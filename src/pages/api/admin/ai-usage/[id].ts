// API: Delete old AI usage logs.
// POST /api/admin/ai-usage/reset
// Body: { older_than: 'YYYY-MM-DD' }

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../../lib/api-helpers';
import { createAuth } from '../../../../lib/auth';
import { deleteOldLogs } from '../../../../lib/ai-usage-log';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) return json({ error: 'Unauthorized' }, 401);

  const user = await env.DB
    .prepare('SELECT role FROM "user" WHERE id = ?')
    .bind(session.user.id)
    .first<{ role: string }>();
  if (user?.role !== 'admin') return json({ error: 'Admin only' }, 403);

  let body: { older_than?: string };
  try {
    body = (await ctx.request.json()) as typeof body;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (!body.older_than) return json({ error: 'older_than required (YYYY-MM-DD)' }, 400);

  const deleted = await deleteOldLogs(env.DB, body.older_than);
  return json({ deleted });
};
