// API: Website-wide AI chat (RAG on book + blog + resource).
// POST /api/website-chat
// Body: { message: string, session_id?: string, page_type?: string, page_slug?: string }
// Auth: None (public, but session ownership checked if user authenticated)
// Response: text/event-stream

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse } from '../../lib/sse';
import { chatCompletionStream } from '../../lib/ai-client';
import type { ChatMessage, ModelConfig } from '../../lib/ai-client';
import { getAiGatewayConfigs } from '../../lib/ai-gateway';
import {
  searchWebsite,
  expandWebsiteContext,
  buildWebsiteContext,
  buildPublishedBookOutline,
  chunksToFormatted,
  buildSearchQueryWithHistory,
  detectBookOverviewIntent,
  summarizeHistory,
  type BookOverviewIntent,
  type WebsiteChunk,
} from '../../lib/rag-website-search';
import { createSession, loadSession, saveSession } from '../../lib/website-chat-db';
import { createAuth } from '../../lib/auth';
import { logAiUsage } from '../../lib/ai-usage-log';
import { reserveAiQuota, requestId } from '../../lib/ai-operations';

export const prerender = false;

const MAX_CHAT_OUTPUT_TOKENS = 1024;
const ANONYMOUS_SESSION_COOKIE = 'de_chat_anon_token';
const ANONYMOUS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getChatMaxTokens(maxTokens?: number): number {
  return Math.min(maxTokens ?? MAX_CHAT_OUTPUT_TOKENS, MAX_CHAT_OUTPUT_TOKENS);
}

function getAnonymousSessionToken(request: Request): string | null {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ANONYMOUS_SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

function anonymousSessionCookie(token: string): string {
  return `${ANONYMOUS_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${ANONYMOUS_COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`;
}

function quotaSubject(userId: string | null, clientAddress: string | undefined, anonymousToken: string | null): string {
  if (userId) return `user:${userId}`;
  if (anonymousToken) return `anon:${anonymousToken}`;
  return `ip:${clientAddress ?? 'unknown'}`;
}

function eventPayload(event: string, data: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify({ event, ...data })}\n\n`);
}

function buildSystemPrompt(ragContext: string, bookOverviewIntent: BookOverviewIntent): string {
  const overviewInstruction = bookOverviewIntent
    ? `
10. Câu hỏi này yêu cầu tổng quan/danh mục thư viện. Chỉ dùng phần "DANH MỤC CHÍNH THỨC" để mô tả toàn bộ phạm vi, nhóm nội dung, chương hoặc đề mục. Danh mục đó là nguồn chuẩn duy nhất cho các khẳng định đầy đủ.
11. Chỉ nói về việc nội dung có thể đọc, truy cập, miễn phí, trả phí hoặc cần đăng nhập khi trạng thái đó xuất hiện rõ trong ngữ cảnh. Nếu không có, không suy đoán về khả dụng.`
    : `
10. Các đoạn RAG thông thường chỉ là trích đoạn liên quan, không phải mục lục. Tuyệt đối không mô tả chúng là toàn bộ sách/thư viện, không suy diễn một danh sách nhóm, chương hoặc đề mục đầy đủ từ chúng.`;

  return `Bạn là Dental Empire AI, trợ lý nội dung của Dental Empire OS về vận hành và quản trị phòng khám nha khoa tại Việt Nam.

Mục tiêu là giúp người đọc tìm đúng nội dung trên website và hiểu được bước tiếp theo có thể áp dụng. Giọng điệu chuyên nghiệp, thân thiện, thực tế; xưng "mình" hoặc "Dental Empire AI", gọi người dùng là "bạn".

${ragContext ? `--- NGỮ CẢNH ĐÃ KIỂM CHỨNG TỪ WEBSITE ---
${ragContext}
--- HẾT NGỮ CẢNH ---

` : ''}Quy tắc bắt buộc:
1. Trả lời hoàn toàn bằng tiếng Việt. Trả lời trực tiếp vào câu hỏi, không lặp lại câu hỏi và không mở đầu chung chung.
2. Lịch sử hội thoại chỉ giúp xác định câu hỏi tiếp nối đang nói về điều gì. Ưu tiên thông tin trong ngữ cảnh đã kiểm chứng khi trả lời.
3. Chỉ khẳng định các chi tiết về tài liệu, blog, tài nguyên, khóa học, giá, ưu đãi hoặc đường dẫn khi chúng có trong ngữ cảnh.
4. Nếu ngữ cảnh không có câu trả lời, nói rõ: "Mình chưa tìm thấy thông tin này trên Dental Empire OS." Sau đó chỉ đưa ra hướng dẫn chung có điều kiện, không suy đoán hoặc bịa đặt.
5. Khi có ngữ cảnh, mọi định nghĩa, tên framework, từ viết tắt và các tầng/phần của framework phải bám sát ngữ cảnh đó. Không thay bằng định nghĩa phổ biến hoặc kiến thức nền của bạn. Với câu hỏi "là gì", nêu định nghĩa theo tài liệu trước, rồi mới diễn giải ngắn nếu cần.
6. Khi có ngữ cảnh, kết thúc câu trả lời bằng một câu nguồn ngắn theo mẫu "Nguồn: Tài liệu <tên tài liệu>". Chỉ dùng đúng tên tài liệu xuất hiện trong ngữ cảnh; giao diện sẽ hiển thị liên kết nguồn tương ứng.
7. Với câu hỏi ngoài nội dung website, có thể trả lời bằng kiến thức tổng quát về quản trị phòng khám, nhưng phải nói rõ đó là gợi ý chung, không phải nội dung đã xác minh từ website.
8. Không tự tạo URL, tên sản phẩm, chương, chương trình miễn phí, ưu đãi, số liệu hoặc chính sách. Không yêu cầu người dùng truy cập URL trong phần trả lời vì giao diện tự hiển thị nguồn khi có.
9. Không chẩn đoán, tư vấn điều trị, kê đơn hoặc đưa khuyến nghị y khoa cá nhân.${overviewInstruction}

Định dạng cho khung chat:
- Mặc định dài 2-5 câu, tối đa 120 từ.
- Nếu cần liệt kê, dùng tối đa 3 gạch đầu dòng ngắn.
- Chỉ dùng **in đậm** cho tối đa 2 cụm từ thật sự quan trọng. Không dùng tiêu đề Markdown, bảng, emoji hoặc phần "Hỏi tiếp".
- Khi thông tin có trong ngữ cảnh, nêu rõ đó là **Tài liệu**, **Blog** hoặc **Tài nguyên** nếu phân loại này hữu ích.`;
}

function buildContextFallback(chunks: WebsiteChunk[], bookOutline = ''): string {
  if (!chunks.length) {
    return bookOutline
      ? 'Mình đang gặp sự cố khi tổng hợp câu trả lời AI. Danh mục chính thức của thư viện đã được tải, nhưng chưa thể tạo phần tóm tắt.'
      : 'Mình chưa tìm thấy nội dung phù hợp trên Dental Empire OS cho câu hỏi này.';
  }

  const excerpts = chunks.slice(0, 2).map((chunk) => {
    const text = chunk.text
      .replace(/[#*_`~\[\]()>/|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const excerpt = text.length > 260
      ? `${text.slice(0, 260).replace(/\s+\S*$/, '')}...`
      : text;
    return `- **${chunk.title}**: ${excerpt}`;
  });

  return `Mình đang gặp sự cố khi tổng hợp câu trả lời AI. Đây là các nội dung liên quan nhất từ tài liệu để bạn tham khảo:\n${excerpts.join('\n')}`;
}

export const POST: APIRoute = async (ctx) => {
  let body: { message?: unknown; session_id?: unknown; page_type?: unknown; page_slug?: unknown };
  try {
    const parsedBody = await ctx.request.json();
    if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
      throw new Error('Invalid request body');
    }
    body = parsedBody as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (typeof body.message !== 'string' || !body.message.trim() || body.message.trim().length > 4_000) {
    return new Response(JSON.stringify({ error: 'message must contain 1-4,000 characters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Older cached clients sent null for a new conversation. Treat null and blank
  // values as absent so the session creation fallback below can recover safely.
  const sessionId = typeof body.session_id === 'string' ? body.session_id.trim() : undefined;
  if (body.session_id !== undefined && body.session_id !== null && (typeof body.session_id !== 'string' || body.session_id.length > 128)) {
    return new Response(JSON.stringify({ error: 'session_id is invalid' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (body.page_type !== undefined && (typeof body.page_type !== 'string' || !['book', 'blog', 'resource', 'home'].includes(body.page_type))) {
    return new Response(JSON.stringify({ error: 'page_type is invalid' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  if (body.page_slug !== undefined && (typeof body.page_slug !== 'string' || body.page_slug.length > 160)) {
    return new Response(JSON.stringify({ error: 'page_slug is invalid' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  // Check if user is authenticated
  const auth = createAuth(env);
  const authSession = await auth.api.getSession({ headers: ctx.request.headers });
  const userId = authSession?.user?.id ?? null;
  const request = requestId();
  let anonymousToken = userId ? null : getAnonymousSessionToken(ctx.request);

  const message = body.message.trim();

  // A browser can retain a session created before the visitor signs in, or one
  // removed by maintenance. Start a fresh conversation rather than blocking chat.
  let activeSessionId = sessionId;
  let sessionData = activeSessionId
    ? await loadSession(env.DB, activeSessionId, userId, anonymousToken)
    : null;
  let sessionCookie: string | null = null;
  if (!sessionData) {
    const createdSession = await createSession(env.DB, userId, body.page_type as string | undefined, body.page_slug as string | undefined);
    activeSessionId = createdSession.id;
    anonymousToken = createdSession.anonymousToken;
    sessionCookie = anonymousToken ? anonymousSessionCookie(anonymousToken) : null;
    sessionData = await loadSession(env.DB, activeSessionId, userId, anonymousToken);
  }
  if (!activeSessionId || !sessionData) {
    return new Response(JSON.stringify({ error: 'Không thể khởi tạo phiên chat. Vui lòng thử lại.' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get conversation history from DB
  const history = sessionData.messages.slice(-8); // Last 8 messages for context

  const modelConfigs = await getAiGatewayConfigs(env.DB, 'chat');
  const modelCfg = modelConfigs[0];
  if (!modelCfg) {
    return new Response(JSON.stringify({ error: 'AI chưa được kích hoạt. Vui lòng liên hệ quản trị viên.' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }
  for (const config of modelConfigs) config.max_tokens = getChatMaxTokens(config.max_tokens);

  const quota = await reserveAiQuota(
    env.DB,
    quotaSubject(userId, ctx.clientAddress, anonymousToken),
    'website_chat',
  );
  if (!quota.allowed) {
    return new Response(JSON.stringify({ error: 'Bạn đã đạt giới hạn Website Chat trong giờ này.', quota }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...(sessionCookie ? { 'Set-Cookie': sessionCookie } : {}) },
    });
  }

  const searchOpts: { contentType?: string } = {};
  if (body.page_type === 'book' && body.page_slug) {
    searchOpts.contentType = 'book';
  } else if (body.page_type === 'blog' && body.page_slug) {
    searchOpts.contentType = 'blog';
  }

  // Build search query với conversation context (multi-turn understanding).
  // Overview detection intentionally runs on the current message only, so a
  // short named-concept follow-up (for example, "ROADMAP là gì?") remains on
  // the ordinary retrieval path instead of inheriting a prior catalogue intent.
  const searchQuery = buildSearchQueryWithHistory(message, history);
  const bookOverviewIntent = detectBookOverviewIntent(message);

  let chunks: WebsiteChunk[] = [];
  let bookOutline = '';
  try {
    if (bookOverviewIntent) {
      // A complete outline comes exclusively from the published chapter/section
      // schema. Top-ranked prose chunks are deliberately excluded because they
      // cannot prove an exhaustive book scope or availability claim.
      bookOutline = await buildPublishedBookOutline(env.DB, bookOverviewIntent);
    } else {
      const matches = await searchWebsite(env.DB, searchQuery, 8, searchOpts, env);
      chunks = await expandWebsiteContext(env.DB, matches, 10);
    }
  } catch (err) {
    console.warn('[website-chat] search failed:', err);
  }

  const retrievedContext = buildWebsiteContext(chunks);
  const ragContext = bookOutline || retrievedContext;
  const systemPrompt = buildSystemPrompt(ragContext, bookOverviewIntent);
  const formattedChunks = chunksToFormatted(chunks);

  // Summarize history nếu quá dài, rồi thêm user message mới
  const summarizedHistory = summarizeHistory(history);
  const chatMessages: ChatMessage[] = [
    ...summarizedHistory.map((message): ChatMessage => ({ role: message.role as ChatMessage['role'], content: message.content })),
    { role: 'user', content: message },
  ].slice(-9) as ChatMessage[];

  const sourceMetadata = formattedChunks.map((chunk) => ({
    url: chunk.url,
    title: chunk.title,
    content_type: chunk.content_type,
  }));
  const aiStartedAt = Date.now();
  let aiResponse = '';
  let currentConfigIndex = 0;
  let usedModelCfg: ModelConfig = modelCfg;
  let providerFallbackUsed = false;
  let modelReader: ReadableStreamDefaultReader<string> | null = null;
  let completed = false;
  let cancelled = false;

  const openModelStream = () => {
    usedModelCfg = modelConfigs[currentConfigIndex];
    modelReader = chatCompletionStream(usedModelCfg, chatMessages, systemPrompt).getReader();
  };

  const saveAndLog = async (fallbackUsed: boolean, errorMessage?: string) => {
    const success = Boolean(aiResponse.trim()) && !fallbackUsed;
    await logAiUsage(env.DB, {
      provider_id: usedModelCfg.provider_id,
      model_id: usedModelCfg.model_id,
      user_id: userId ?? undefined,
      session_id: activeSessionId,
      feature: 'website_chat',
      success,
      error_message: errorMessage,
      latency_ms: Date.now() - aiStartedAt,
      input_tokens: Math.ceil((systemPrompt.length + chatMessages.reduce((sum, message) => sum + message.content.length, 0)) / 4),
      output_tokens: Math.ceil(aiResponse.length / 4),
      fallback_used: fallbackUsed || providerFallbackUsed,
      retrieval_chunks: chunks.length,
      request_id: request,
    }).catch((err) => console.warn('[website-chat] usage log failed:', err));

    if (!cancelled && aiResponse.trim()) {
      try {
        await saveSession(env.DB, activeSessionId, [
          ...sessionData.messages,
          { role: 'user', content: message, created_at: new Date().toISOString() },
          { role: 'assistant', content: aiResponse, created_at: new Date().toISOString() },
        ], chunks.map((chunk) => chunk.id));
      } catch (err) {
        console.error('[website-chat] Save session failed:', err);
      }
    }
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(eventPayload('metadata', {
        session_id: activeSessionId,
        chunks_count: chunks.length,
        chunks_ids: chunks.map((chunk) => chunk.id),
        sources: sourceMetadata,
        quota,
      }));
    },
    async pull(controller) {
      if (completed) return;

      while (true) {
        try {
          if (!modelReader) openModelStream();
          const reader = modelReader;
          if (!reader) throw new Error('Không thể mở luồng AI.');
          const { value, done } = await reader.read();
          if (done) {
            completed = true;
            if (!aiResponse.trim()) {
              aiResponse = buildContextFallback(chunks, bookOutline);
              controller.enqueue(eventPayload('chunk', { text: aiResponse }));
              await saveAndLog(true, 'AI returned an empty response');
            } else {
              await saveAndLog(false);
            }
            controller.enqueue(eventPayload('done', {
              session_id: activeSessionId,
              chunks_used: chunks.length,
              sources: sourceMetadata,
              quota,
              fallback_used: providerFallbackUsed,
            }));
            controller.close();
            return;
          }

          if (value) {
            aiResponse += value;
            controller.enqueue(eventPayload('chunk', { text: value }));
          }
          return;
        } catch (err) {
          await modelReader?.cancel(err).catch(() => undefined);
          modelReader = null;
          if (!aiResponse && currentConfigIndex < modelConfigs.length - 1) {
            currentConfigIndex++;
            providerFallbackUsed = true;
            continue;
          }

          console.error('[website-chat] AI stream failed:', err);
          completed = true;
          if (!aiResponse.trim()) {
            aiResponse = buildContextFallback(chunks, bookOutline);
            controller.enqueue(eventPayload('chunk', { text: aiResponse }));
          }
          await saveAndLog(true, String(err));
          controller.enqueue(eventPayload('done', {
            session_id: activeSessionId,
            chunks_used: chunks.length,
            sources: sourceMetadata,
            quota,
            fallback_used: true,
          }));
          controller.close();
          return;
        }
      }
    },
    async cancel(reason) {
      cancelled = true;
      await modelReader?.cancel(reason).catch(() => undefined);
    },
  });

  return sseResponse(stream, {
    headers: sessionCookie ? { 'Set-Cookie': sessionCookie } : undefined,
  });
};
