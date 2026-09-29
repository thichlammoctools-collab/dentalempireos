// API: Delete old AI usage logs.
// POST /api/admin/ai-usage/reset
// Body: { older_than: 'YYYY-MM-DD' }

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, requireAdmin } from '../../../../lib/api-helpers';
import { deleteOldLogs } from '../../../../lib/ai-usage-log';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  // Middleware already gated /api/admin/* and set locals.user with the promoted
  // role, so the check here reads the same source instead of re-querying it.
  const denied = requireAdmin(ctx.locals.user);
  if (denied) return denied;

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
