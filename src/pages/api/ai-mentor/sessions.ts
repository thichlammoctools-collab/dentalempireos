// API: AI Mentor session management.
// GET /api/ai-mentor/sessions — list sessions for current user

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const { results } = await env.DB
    .prepare(
      `SELECT id, title, messages, context_chunk_ids, model_id, created_at, updated_at
       FROM "ai_mentor_session"
       WHERE user_id = ?
       ORDER BY updated_at DESC
       LIMIT 50`
    )
    .bind(session.user.id)
    .all<{ id: string; title: string | null; messages: string; context_chunk_ids: string | null; model_id: string | null; created_at: string; updated_at: string }>();

  const sessions = (results ?? []).map((r) => {
    let msgs: unknown[] = [];
    try { msgs = JSON.parse(r.messages); } catch { /* ignore */ }
    return {
      id: r.id,
      title: r.title,
      message_count: msgs.length,
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  });

  return json({ sessions });
};
