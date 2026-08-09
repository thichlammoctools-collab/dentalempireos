// API: AI Mentor chat with SSE streaming + session persistence.
// POST /api/ai-mentor/chat
// Body: { session_id?: string, message: string, image_url?: string, app_slug?: string, chapter_id?: string }
// Auth: Session
// Response: text/event-stream

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { sseResponse, sseEnqueue } from '../../../lib/sse';
import { chatCompletionStream } from '../../../lib/ai-client';
import type { ModelConfig, ChatMessage } from '../../../lib/ai-client';
import { getAiGatewayConfig } from '../../../lib/ai-gateway';
import { searchChunks, buildRagContext, type RagChunk } from '../../../lib/rag-search';
import { createAuth } from '../../../lib/auth';
import { getAppBySlug } from '../../../lib/app-db';
import { canAccessAiApp } from '../../../lib/entitlement-check';
import { reserveAiQuota, requestId } from '../../../lib/ai-operations';
import { logAiUsage } from '../../../lib/ai-usage-log';

export const prerender = false;

interface StoredMessage {
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  created_at: string;
}

async function getAiModel(db: D1Database): Promise<ModelConfig | null> {
  return getAiGatewayConfig(db);
}

async function getOrCreateSession(
  db: D1Database,
  sessionId: string | null,
  userId: string,
  _appSlug: string,
): Promise<string> {
  if (sessionId) {
    const existing = await db
      .prepare('SELECT id FROM "ai_mentor_session" WHERE id = ? AND user_id = ?')
      .bind(sessionId, userId)
      .first<{ id: string }>();
    if (existing) return existing.id;
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO "ai_mentor_session" ("id","user_id","title","messages","created_at","updated_at")
       VALUES (?, ?, '', '[]', ?, ?)`
    )
    .bind(id, userId, now, now)
    .run();
  return id;
}

async function loadSession(
  db: D1Database,
  sessionId: string,
  userId: string,
): Promise<{ messages: StoredMessage[]; chunk_ids: string[] } | null> {
  const row = await db
    .prepare('SELECT messages, context_chunk_ids FROM "ai_mentor_session" WHERE id = ? AND user_id = ?')
    .bind(sessionId, userId)
    .first<{ messages: string; context_chunk_ids: string | null }>();
  if (!row) return null;
  try {
    return {
      messages: JSON.parse(row.messages) as StoredMessage[],
      chunk_ids: row.context_chunk_ids ? JSON.parse(row.context_chunk_ids) as string[] : [],
    };
  } catch {
    return { messages: [], chunk_ids: [] };
  }
}

async function saveSession(
  db: D1Database,
  sessionId: string,
  messages: StoredMessage[],
  chunkIds: string[],
): Promise<void> {
  const now = new Date().toISOString();
  const firstUserMsg = messages.find((m) => m.role === 'user')?.content.slice(0, 60) ?? 'Session';
  await db
    .prepare(
      `UPDATE "ai_mentor_session"
       SET messages = ?,
           context_chunk_ids = ?,
           title = CASE
             WHEN title IS NULL OR title = '' THEN ?
             ELSE title
           END,
           updated_at = ?
       WHERE id = ?`
    )
    .bind(JSON.stringify(messages.slice(-50)), JSON.stringify(chunkIds), firstUserMsg, now, sessionId)
    .run();
}

function buildSystemPrompt(ragContext: string): string {
  if (ragContext) {
    return `Bạn là AI Mentor của Dental Empire OS — trợ lý AI chuyên về quản trị phòng khám nha khoa.

Sử dụng nội dung tài liệu sau để trả lời câu hỏi của user. Nếu câu hỏi nằm NGOÀI phạm vi nội dung tài liệu, hãy nói rõ điều đó.

--- NGỮ CẢNH TỪ TÀI LIỆU ---
${ragContext}
--- HẾT NGỮ CẢNH ---

Trả lời bằng tiếng Việt, ngắn gọn, có ví dụ cụ thể khi phù hợp. Đánh dấu các thuật ngữ quan trọng bằng **bold**.`;
  }
  return `Bạn là AI Mentor của Dental Empire OS — trợ lý AI chuyên về quản trị phòng khám nha khoa.

Trả lời bằng tiếng Việt, ngắn gọn, có ví dụ cụ thể khi phù hợp. Đánh dấu các thuật ngữ quan trọng bằng **bold**.

Nếu câu hỏi nằm ngoài phạm vi tài liệu Dental Empire OS, hãy nói rõ điều đó.`;
}

export const POST: APIRoute = async (ctx) => {
  let body: { session_id?: string; message: string; image_url?: string; app_slug?: string; chapter_id?: string };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  if (!body.message?.trim()) {
    return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const auth = createAuth(env);
  const authSession = await auth.api.getSession({ headers: ctx.request.headers });
  if (!authSession?.user) {
    return new Response(JSON.stringify({ error: 'Vui lòng đăng nhập' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const userId = authSession.user.id;
  const appSlug = body.app_slug ?? 'ai-mentor';
  const app = await getAppBySlug(env.DB, appSlug);
  if (!app || app.status !== 'active') {
    return new Response(JSON.stringify({ error: 'AI Mentor chưa được kích hoạt.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
  if (!(await canAccessAiApp(env.DB, userId, app.id))) {
     return new Response(JSON.stringify({ error: 'Ứng dụng AI này yêu cầu nâng cấp gói để sử dụng.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }), { status: 402, headers: { 'Content-Type': 'application/json' } });
  }

  const request = requestId();
  const quota = await reserveAiQuota(env.DB, userId, 'mentor_chat');
  if (!quota.allowed) {
    return new Response(JSON.stringify({ error: 'Bạn đã đạt giới hạn AI Mentor trong giờ này.', quota }), { status: 429, headers: { 'Content-Type': 'application/json' } });
  }

  const modelCfg = await getAiModel(env.DB);
  if (!modelCfg) {
    return new Response(JSON.stringify({ error: 'Chưa có AI model nào được kích hoạt.' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  const sessionId = await getOrCreateSession(env.DB, body.session_id ?? null, userId, appSlug);
  const sessionData = await loadSession(env.DB, sessionId, userId);
  const storedMessages: StoredMessage[] = sessionData?.messages ?? [];

  const userMsg: StoredMessage = {
    role: 'user',
    content: body.message.trim(),
    image_url: body.image_url,
    created_at: new Date().toISOString(),
  };
  storedMessages.push(userMsg);

  let chunks: RagChunk[] = [];
  let ragContext = '';
  try {
    chunks = await searchChunks(env.DB, body.message, 4, { chapterId: body.chapter_id }, env);
    ragContext = buildRagContext(chunks);
  } catch (err) {
    console.warn('[ai-mentor] RAG search failed:', err);
  }

  const chunkIds = chunks.map((c) => c.id);
  const systemPrompt = buildSystemPrompt(ragContext);

  const MAX_LEN = 1500;
  const chatMessages: ChatMessage[] = storedMessages.slice(-50).map((m) => ({
    role: m.role,
    content: m.content.length > MAX_LEN ? m.content.slice(0, MAX_LEN) + '…' : m.content,
  }));

  const stream = new ReadableStream({
    async start(controller) {
      const startedAt = Date.now();
      try {
        sseEnqueue(controller, 'chunks_used', { count: chunks.length, ids: chunkIds });

        const aiStream = chatCompletionStream(modelCfg, chatMessages, systemPrompt);
        const reader = aiStream.getReader();
        let fullText = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = typeof value === 'string' ? value : new TextDecoder().decode(value, { stream: true });
            fullText += text;
            sseEnqueue(controller, 'chunk', { text });
          }
        } finally {
          reader.releaseLock();
        }

        const assistantMsg: StoredMessage = {
          role: 'assistant',
          content: fullText,
          created_at: new Date().toISOString(),
        };
        storedMessages.push(assistantMsg);
        await saveSession(env.DB, sessionId, storedMessages, chunkIds);
        await logAiUsage(env.DB, {
          provider_id: modelCfg.provider_id,
          model_id: modelCfg.model_id,
          user_id: userId,
          session_id: sessionId,
          feature: 'mentor_chat',
          success: true,
          latency_ms: Date.now() - startedAt,
          input_tokens: Math.ceil(chatMessages.reduce((n, m) => n + m.content.length, 0) / 4),
          output_tokens: Math.ceil(fullText.length / 4),
          retrieval_chunks: chunks.length,
          request_id: request,
        }).catch((logErr) => console.warn('[ai-mentor] usage log failed:', logErr));

        sseEnqueue(controller, 'done', { session_id: sessionId, chunks_used: chunks.length });
        controller.close();
      } catch (err) {
        console.error('[ai-mentor] Stream error:', err);
        await logAiUsage(env.DB, {
          provider_id: modelCfg.provider_id,
          model_id: modelCfg.model_id,
          user_id: userId,
          session_id: sessionId,
          feature: 'mentor_chat',
          success: false,
          error_message: String(err).slice(0, 500),
          request_id: request,
        }).catch(() => undefined);
        sseEnqueue(controller, 'error', { message: String(err) });
        controller.error(err);
      }
    },
  });

  return sseResponse(stream);
};
