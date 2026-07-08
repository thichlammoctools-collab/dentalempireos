// API: Delete a single AI Mentor session.
// DELETE /api/ai-mentor/sessions/[id]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';

export const prerender = false;

export const DELETE: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const id = ctx.params.id ?? '';
  if (!id) return json({ error: 'Session ID required' }, 400);

  const result = await env.DB
    .prepare('DELETE FROM "ai_mentor_session" WHERE id = ? AND user_id = ?')
    .bind(id, session.user.id)
    .run();

  return json({ deleted: result.meta.changes > 0 });
};
