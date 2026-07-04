import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { searchChunks, buildRagContext } from '../../../lib/rag-search';
import { chatCompletion } from '../../../lib/ai-client';
import { getActiveModelsWithProvider } from '../../../lib/ai-provider-db';
import { getApp } from '../../../lib/app-db';

export const prerender = false;

interface Message { role: 'user' | 'assistant'; content: string; }

async function getAiModel(): Promise<{
  base_url: string; api_key: string; model_id: string; max_tokens: number;
} | null> {
  const all = await getActiveModelsWithProvider(env.DB);
  for (const [, entry] of all) {
    const model = entry.models.find(m => m.is_active);
    if (model) {
      return {
        base_url: entry.provider.base_url,
        api_key: entry.provider.api_key,
        model_id: model.model_id,
        max_tokens: model.max_tokens ?? 4096,
      };
    }
  }
  return null;
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: { messages?: Message[]; app_slug?: string; chapter_id?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON');
  }

  if (!body.messages?.length) return badRequest('messages required');

  // Resolve app (optional — defaults to 'ai-mentor')
  const appSlug = body.app_slug ?? 'ai-mentor';
  const app = await getApp(env.DB, appSlug);
  if (!app || app.status !== 'active') {
    return json({ error: 'AI Mentor chưa được kích hoạt.' }, 403);
  }

  // Get AI model
  const modelCfg = await getAiModel();
  if (!modelCfg) {
    return json({ error: 'Chưa có AI model nào được kích hoạt.' }, 503);
  }

  // RAG search from last user message
  const lastUserMsg = [...body.messages].reverse().find(m => m.role === 'user');
  const query = lastUserMsg?.content ?? '';
  const chunks = await searchChunks(env.DB, query, 4, { chapterId: body.chapter_id });
  const ragContext = buildRagContext(chunks);

  // Build system prompt
  const systemPrompt = ragContext
    ? `Bạn là AI Mentor của Dental Empire OS — trợ lý AI chuyên về quản trị phòng khám nha khoa.

Sử dụng nội dung sách sau để trả lời câu hỏi của user. Nếu câu hỏi nằm NGOÀI phạm vi nội dung sách, hãy nói rõ điều đó.

--- NGỮ CẢNH TỪ SÁCH ---
${ragContext}
--- HẾT NGỮ CẢNH ---

Trả lời bằng tiếng Việt, ngắn gọn, có ví dụ cụ thể khi phù hợp. Đánh dấu các thuật ngữ quan trọng bằng **bold**.`
    : `Bạn là AI Mentor của Dental Empire OS — trợ lý AI chuyên về quản trị phòng khám nha khoa.

Trả lời bằng tiếng Việt, ngắn gọn, có ví dụ cụ thể khi phù hợp. Đánh dấu các thuật ngữ quan trọng bằng **bold**.

Nếu câu hỏi nằm ngoài phạm vi sách Dental Empire OS, hãy nói rõ điều đó.`;

  // Strip + truncate messages
  const MAX_LEN = 1500;
  const messages = body.messages
    .slice(-8)
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content.length > MAX_LEN ? m.content.slice(0, MAX_LEN) + '…' : m.content,
    }));

  try {
    const reply = await chatCompletion(modelCfg, messages, systemPrompt);
    return json({ reply, chunks_used: chunks.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: msg }, 500);
  }
};
