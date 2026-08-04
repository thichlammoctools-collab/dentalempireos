// API: Delete a single AI Mentor session.
// DELETE /api/ai-mentor/sessions/[id]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';
import { getAppBySlug } from '../../../../lib/app-db';
import { canAccessAiApp } from '../../../../lib/entitlement-check';

export const prerender = false;

export const DELETE: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const app = await getAppBySlug(env.DB, 'ai-mentor');
  if (!app || app.status !== 'active') {
    return json({ error: 'AI Mentor chưa được kích hoạt.' }, 403);
  }
  if (!(await canAccessAiApp(env.DB, session.user.id, app.id))) {
     return json({ error: 'Ứng dụng AI này yêu cầu nâng cấp gói để sử dụng.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }, 402);
  }

  const id = ctx.params.id ?? '';
  if (!id) return json({ error: 'Session ID required' }, 400);

  const result = await env.DB
    .prepare('DELETE FROM "ai_mentor_session" WHERE id = ? AND user_id = ?')
    .bind(id, session.user.id)
    .run();

  return json({ deleted: result.meta.changes > 0 });
};
