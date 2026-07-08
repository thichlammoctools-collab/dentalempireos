// API: AI usage analytics.
// GET /api/admin/ai-usage — usage stats

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';
import { queryUsageStats, getUsageTotals } from '../../../lib/ai-usage-log';

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) return json({ error: 'Unauthorized' }, 401);

  const user = await env.DB
    .prepare('SELECT role FROM "user" WHERE id = ?')
    .bind(session.user.id)
    .first<{ role: string }>();
  if (user?.role !== 'admin') return json({ error: 'Admin only' }, 403);

  const url = new URL(ctx.request.url);
  const from = url.searchParams.get('from') ?? undefined;
  const to = url.searchParams.get('to') ?? undefined;
  const providerId = url.searchParams.get('provider_id') ?? undefined;
  const groupBy = (url.searchParams.get('group_by') as 'day' | 'model' | 'feature' | 'user') ?? 'day';

  if (!['day', 'model', 'feature', 'user'].includes(groupBy)) {
    return json({ error: 'Invalid group_by' }, 400);
  }

  const [usage, totals] = await Promise.all([
    queryUsageStats(env.DB, { from, to, provider_id: providerId, group_by: groupBy }),
    getUsageTotals(env.DB, { from, to, provider_id: providerId }),
  ]);

  return json({ usage, totals });
};
