// API: Website-wide AI chat (RAG on book + blog + resource).
// POST /api/website-chat
// Body: { message: string, page_type?: string, page_slug?: string }
// Auth: None (public)
// Response: text/event-stream

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse, sseEnqueue } from '../../lib/sse';
import { chatCompletionStream } from '../../lib/ai-client';
import type { ModelConfig, ChatMessage } from '../../lib/ai-client';
import { getActiveModelsWithProvider } from '../../lib/ai-provider-db';
import { searchWebsite, buildWebsiteContext, chunksToFormatted, type WebsiteChunk } from '../../lib/rag-website-search';

export const prerender = false;

interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const SESSION_KV_PREFIX = 'wc_sess:';

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

function contentTypeLabel(type: string): string {
  return type === 'book' ? 'Sách' : type === 'blog' ? 'Blog' : 'Tài nguyên';
}

function formatSourceLinks(chunks: WebsiteChunk[]): string {
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const c of chunks) {
    const key = c.url;
    if (!seen.has(key)) {
      seen.add(key);
      lines.push(`• ${contentTypeLabel(c.content_type)}: ${c.title} → ${c.url}`);
    }
  }
  return lines.join('\n');
}

export const POST: APIRoute = async (ctx) => {
  let body: { message: string; page_type?: string; page_slug?: string; session_id?: string };
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

  // Search relevant content
  const searchOpts: { contentType?: string; sourceId?: string } = {};
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

  const sourceLinks = chunks.length > 0 ? formatSourceLinks(chunks) : '';

  const userMsg: ChatMessage = {
    role: 'user',
    content: body.message.trim(),
  };

  const finalUserContent = sourceLinks
    ? `${body.message.trim()}\n\n---\n**Nguồn tham khảo:**\n${sourceLinks}`
    : body.message.trim();

  const MAX_LEN = 1200;
  const chatMessages: ChatMessage[] = [{
    role: 'user',
    content: finalUserContent.length > MAX_LEN ? finalUserContent.slice(0, MAX_LEN) + '…' : finalUserContent,
  }];

  const chunkIds = chunks.map(c => c.id);
  const formattedChunks = chunksToFormatted(chunks);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sseEnqueue(controller, 'chunks_used', {
          count: chunks.length,
          ids: chunkIds,
          sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
        });

        const aiStream = chatCompletionStream(modelCfg, chatMessages, systemPrompt);
        const reader = aiStream.getReader();
        let fullText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = new TextDecoder().decode(value, { stream: true });
            fullText += text;
            sseEnqueue(controller, 'chunk', { text });
          }
        } finally {
          reader.releaseLock();
        }

        sseEnqueue(controller, 'done', {
          chunks_used: chunks.length,
          sources: formattedChunks.map(c => ({ url: c.url, title: c.title, content_type: c.content_type })),
        });
        controller.close();
      } catch (err) {
        console.error('[website-chat] stream error:', err);
        sseEnqueue(controller, 'error', { message: String(err) });
        controller.error(err);
      }
    },
  });

  return sseResponse(stream);
};
