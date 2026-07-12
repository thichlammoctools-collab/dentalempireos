// API: Website-wide AI chat (RAG on book + blog + resource).
// POST /api/website-chat
// Body: { message: string, page_type?: string, page_slug?: string }
// Auth: None (public)
// Response: text/event-stream

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse } from '../../lib/sse';
import { chatCompletion } from '../../lib/ai-client';
import type { ModelConfig, ChatMessage } from '../../lib/ai-client';
import { getActiveModelsWithProvider } from '../../lib/ai-provider-db';
import { searchWebsite, buildWebsiteContext, chunksToFormatted, type WebsiteChunk } from '../../lib/rag-website-search';

export const prerender = false;

async function getAiModel(db: D1Database): Promise<ModelConfig | null> {
  const all = await getActiveModelsWithProvider(db);
  for (const [, entry] of all) {
    const model = entry.models.find((m) => m.is_active);
    if (model) {
      return {
        provider_id: String(entry.provider.id),
        base_url: entry.provider.base_url,
        api_key: entry.provider.api_key,
        model_id: model.model_id,
        max_tokens: model.max_tokens ?? 4096,
      };
    }
  }
  return null;
}

function buildSystemPrompt(ragContext: string): string {
  if (ragContext) {
    return `Bạn là trợ lý AI của Dental Empire OS — chuyên trả lời câu hỏi về nội dung website (sách quản trị phòng khám nha khoa, blog, tài nguyên).

Sử dụng ngữ cảnh được cung cấp bên dưới để trả lời CHÍNH XÁC và ĐẦY ĐỦ. Nếu ngữ cảnh không chứa thông tin cần thiết, hãy nói rõ điều đó.

--- NGỮ CẢNH TỪ WEBSITE ---
${ragContext}
--- HẾT NGỮ CẢNH ---

Quy tắc trả lời:
1. Trả lời bằng tiếng Việt, ngắn gọn và có cấu trúc (dùng **bold** cho thuật ngữ quan trọng).
2. Khi có liên kết đến nguồn, dẫn người dùng đến URL đích: **Xem chi tiết**: {url}
3. Phân biệt rõ nội dung đang nói đến thuộc loại nào (Sách / Blog / Tài nguyên).
4. Nếu câu hỏi nằm ngoài phạm vi website, trả lời dựa trên kiến thức chung về quản trị phòng khám nha khoa.
5. Không bịa đặt thông tin không có trong ngữ cảnh.`;
  }
  return `Bạn là trợ lý AI của Dental Empire OS — chuyên về quản trị phòng khám nha khoa.

Trả lời bằng tiếng Việt, ngắn gọn, có cấu trúc. Dùng **bold** cho thuật ngữ quan trọng.
Nếu câu hỏi thuộc phạm vi nội dung website (sách, blog, tài nguyên), hãy gợi ý người dùng truy cập các trang liên quan.`;
}

export const POST: APIRoute = async (ctx) => {
  let body: { message: string; page_type?: string; page_slug?: string };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!body.message?.trim()) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const modelCfg = await getAiModel(env.DB);
  if (!modelCfg) {
    return new Response(JSON.stringify({ error: 'Chưa có AI model nào được kích hoạt. Vui lòng liên hệ quản trị viên.' }), {
      status: 503, headers: { 'Content-Type': 'application/json' },
    });
  }

  const searchOpts: { contentType?: string } = {};
  if (body.page_type === 'book' && body.page_slug) {
    searchOpts.contentType = 'book';
  } else if (body.page_type === 'blog' && body.page_slug) {
    searchOpts.contentType = 'blog';
  }

  let chunks: WebsiteChunk[] = [];
  try {
    chunks = await searchWebsite(env.DB, body.message, 5, searchOpts, env);
  } catch (err) {
    console.warn('[website-chat] search failed:', err);
  }

  const ragContext = buildWebsiteContext(chunks);
  const systemPrompt = buildSystemPrompt(ragContext);
  const formattedChunks = chunksToFormatted(chunks);

  const userMsg: ChatMessage = { role: 'user', content: body.message.trim() };

  let aiResponse = '';
  let aiError: string | null = null;
  try {
    aiResponse = await chatCompletion(modelCfg, [userMsg], systemPrompt);
  } catch (err) {
    aiError = String(err);
    console.error('[website-chat] AI error:', err);
  }

  // Build full SSE response as text, then return as a single-chunk stream
  const textEncoder = new TextEncoder();
  const lines: string[] = [];

  lines.push(`data: ${JSON.stringify({
    event: 'chunks_used',
    count: chunks.length,
    ids: chunks.map(c => c.id),
    sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
  })}`);

  if (aiError) {
    lines.push(`data: ${JSON.stringify({ event: 'error', message: aiError })}`);
  } else {
    const words = aiResponse.split(/(\s+)/);
    for (const word of words) {
      if (word) {
        lines.push(`data: ${JSON.stringify({ event: 'chunk', text: word })}`);
      }
    }
    lines.push(`data: ${JSON.stringify({
      event: 'done',
      chunks_used: chunks.length,
      sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
    })}`);
  }

  const sseText = lines.join('\n') + '\n\n';

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(textEncoder.encode(sseText));
      controller.close();
    },
  });

  return sseResponse(stream);
};
