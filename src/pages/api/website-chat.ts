// API: Website-wide AI chat (RAG on book + blog + resource).
// POST /api/website-chat
// Body: { message: string, session_id?: string, page_type?: string, page_slug?: string }
// Auth: None (public, but session ownership checked if user authenticated)
// Response: text/event-stream

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse } from '../../lib/sse';
import { chatCompletion } from '../../lib/ai-client';
import type { ChatMessage } from '../../lib/ai-client';
import { getAiGatewayConfig } from '../../lib/ai-gateway';
import { searchWebsite, expandWebsiteContext, buildWebsiteContext, chunksToFormatted, buildSearchQueryWithHistory, summarizeHistory, type WebsiteChunk } from '../../lib/rag-website-search';
import { createSession, loadSession, saveSession } from '../../lib/website-chat-db';
import { generateFollowupSuggestions } from '../../lib/ai-followup';
import { createAuth } from '../../lib/auth';

export const prerender = false;

const MAX_CHAT_OUTPUT_TOKENS = 1024;

function getChatMaxTokens(maxTokens?: number): number {
  return Math.min(maxTokens ?? MAX_CHAT_OUTPUT_TOKENS, MAX_CHAT_OUTPUT_TOKENS);
}

function buildSystemPrompt(ragContext: string): string {
  return `Bạn là Dental Empire AI, trợ lý nội dung của Dental Empire OS về vận hành và quản trị phòng khám nha khoa tại Việt Nam.

Mục tiêu là giúp người đọc tìm đúng nội dung trên website và hiểu được bước tiếp theo có thể áp dụng. Giọng điệu chuyên nghiệp, thân thiện, thực tế; xưng "mình" hoặc "Dental Empire AI", gọi người dùng là "bạn".

${ragContext ? `--- NGỮ CẢNH ĐÃ KIỂM CHỨNG TỪ WEBSITE ---
${ragContext}
--- HẾT NGỮ CẢNH ---

` : ''}Quy tắc bắt buộc:
1. Trả lời hoàn toàn bằng tiếng Việt. Trả lời trực tiếp vào câu hỏi, không lặp lại câu hỏi và không mở đầu chung chung.
2. Lịch sử hội thoại chỉ giúp xác định câu hỏi tiếp nối đang nói về điều gì. Ưu tiên thông tin trong ngữ cảnh đã kiểm chứng khi trả lời.
3. Chỉ khẳng định các chi tiết về sách, blog, tài nguyên, khóa học, giá, ưu đãi hoặc đường dẫn khi chúng có trong ngữ cảnh.
4. Nếu ngữ cảnh không có câu trả lời, nói rõ: "Mình chưa tìm thấy thông tin này trên Dental Empire OS." Sau đó chỉ đưa ra hướng dẫn chung có điều kiện, không suy đoán hoặc bịa đặt.
5. Với câu hỏi ngoài nội dung website, có thể trả lời bằng kiến thức tổng quát về quản trị phòng khám, nhưng phải nói rõ đó là gợi ý chung, không phải nội dung đã xác minh từ website.
6. Không tự tạo URL, tên sản phẩm, chương sách, chương trình miễn phí, ưu đãi, số liệu hoặc chính sách. Không yêu cầu người dùng truy cập URL trong phần trả lời vì giao diện tự hiển thị nguồn khi có.
7. Không chẩn đoán, tư vấn điều trị, kê đơn hoặc đưa khuyến nghị y khoa cá nhân.

Định dạng cho khung chat:
- Mặc định dài 2-5 câu, tối đa 120 từ.
- Nếu cần liệt kê, dùng tối đa 3 gạch đầu dòng ngắn.
- Chỉ dùng **in đậm** cho tối đa 2 cụm từ thật sự quan trọng. Không dùng tiêu đề Markdown, bảng, emoji hoặc phần "Hỏi tiếp".
- Khi thông tin có trong ngữ cảnh, nêu rõ đó là **Sách**, **Blog** hoặc **Tài nguyên** nếu phân loại này hữu ích.`;
}

export const POST: APIRoute = async (ctx) => {
  let body: { message: string; session_id?: string; page_type?: string; page_slug?: string };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!body.message?.trim()) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Check if user is authenticated
  const auth = createAuth(env);
  const authSession = await auth.api.getSession({ headers: ctx.request.headers });
  const userId = authSession?.user?.id ?? null;

  // Get or create session
  let sessionId = body.session_id;
  if (!sessionId) {
    sessionId = await createSession(env.DB, userId, body.page_type, body.page_slug);
  }

  // Load session (verify ownership if authenticated)
  const sessionData = await loadSession(env.DB, sessionId, userId);
  if (!sessionData) {
    return new Response(JSON.stringify({ error: 'Session not found or access denied' }), {
      status: 404, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get conversation history from DB
  const history = sessionData.messages.slice(-8); // Last 8 messages for context

  const modelCfg = await getAiGatewayConfig(env.DB, 'chat');
  if (!modelCfg) {
    return new Response(JSON.stringify({ error: 'AI chưa được kích hoạt. Vui lòng liên hệ quản trị viên.' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }
  modelCfg.max_tokens = getChatMaxTokens(modelCfg.max_tokens);

  const searchOpts: { contentType?: string } = {};
  if (body.page_type === 'book' && body.page_slug) {
    searchOpts.contentType = 'book';
  } else if (body.page_type === 'blog' && body.page_slug) {
    searchOpts.contentType = 'blog';
  }

  // Build search query với conversation context (multi-turn understanding)
  const searchQuery = buildSearchQueryWithHistory(body.message.trim(), history);

  let chunks: WebsiteChunk[] = [];
  try {
    const matches = await searchWebsite(env.DB, searchQuery, 8, searchOpts, env);
    chunks = await expandWebsiteContext(env.DB, matches, 10);
  } catch (err) {
    console.warn('[website-chat] search failed:', err);
  }

  const ragContext = buildWebsiteContext(chunks);
  const systemPrompt = buildSystemPrompt(ragContext);
  const formattedChunks = chunksToFormatted(chunks);

  // Summarize history nếu quá dài, rồi thêm user message mới
  const summarizedHistory = summarizeHistory(history);
  const chatMessages: ChatMessage[] = [...summarizedHistory, { role: 'user', content: body.message.trim() }].slice(-9);

  let aiResponse = '';
  let aiError: string | null = null;
  try {
    aiResponse = await chatCompletion(modelCfg, chatMessages, systemPrompt);
  } catch (err) {
    aiError = String(err);
    console.error('[website-chat] AI error:', err);
  }

  // Generate follow-up suggestions (chạy song song với streaming)
  let followupSuggestions: string[] = [];
  if (aiResponse && !aiError) {
    try {
      followupSuggestions = await generateFollowupSuggestions(
        modelCfg,
        body.message.trim(),
        aiResponse,
        ragContext,
      );
    } catch (err) {
      console.warn('[website-chat] Followup generation failed:', err);
    }
  }

  // Save conversation to DB
  if (!aiError) {
    try {
      const newMessages = [
        ...sessionData.messages,
        { role: 'user' as const, content: body.message.trim(), created_at: new Date().toISOString() },
        { role: 'assistant' as const, content: aiResponse, created_at: new Date().toISOString() },
      ];
      await saveSession(env.DB, sessionId, newMessages, chunks.map(c => c.id));
    } catch (err) {
      console.error('[website-chat] Save session failed:', err);
    }
  }

  // Stream response word-by-word as they arrive
  const textEncoder = new TextEncoder();
  let wordIndex = 0;
  const words = aiResponse.split(/(\s+)/);

  const stream = new ReadableStream({
    pull(controller) {
      if (wordIndex === 0) {
        // First pull: send session_id + sources metadata
        const metadataText = textEncoder.encode(
          `data: ${JSON.stringify({
            event: 'metadata',
            session_id: sessionId,
            chunks_count: chunks.length,
            chunks_ids: chunks.map(c => c.id),
            sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
          })}\n\n`
        );
        controller.enqueue(metadataText);
      }

      if (aiError) {
        controller.enqueue(
          textEncoder.encode(`data: ${JSON.stringify({ event: 'error', message: aiError })}\n\n`)
        );
        controller.close();
        return;
      }

      if (wordIndex < words.length) {
        const word = words[wordIndex++];
        if (word) {
          controller.enqueue(
            textEncoder.encode(`data: ${JSON.stringify({ event: 'chunk', text: word })}\n\n`)
          );
        }
        return;
      }

      // Before done: send followup suggestions if available
      if (followupSuggestions.length > 0 && wordIndex === words.length) {
        controller.enqueue(
          textEncoder.encode(
            `data: ${JSON.stringify({ event: 'followup_suggestions', suggestions: followupSuggestions })}\n\n`
          )
        );
        wordIndex++; // Prevent re-sending
      }

      // Done
      controller.enqueue(
        textEncoder.encode(
          `data: ${JSON.stringify({
            event: 'done',
            session_id: sessionId,
            chunks_used: chunks.length,
            sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
          })}\n\n`
        )
      );
      controller.close();
    },
  });

  return sseResponse(stream);
};
