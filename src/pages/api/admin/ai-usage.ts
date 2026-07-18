// API: AI usage analytics.
// GET /api/admin/ai-usage — usage stats

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { queryUsageStats, getUsageTotals } from '../../../lib/ai-usage-log';

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
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
