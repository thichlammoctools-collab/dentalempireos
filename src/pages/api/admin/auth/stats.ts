import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';

const DASH_BASE = `${env.BETTER_AUTH_URL}/api/auth/dash`;

async function dashFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${DASH_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': env.BETTER_AUTH_API_KEY ?? '',
      ...(options?.headers ?? {}),
    },
  });
  return res;
}

// GET /api/admin/auth/stats — user stats
export const GET: APIRoute = async ({ url }) => {
  try {
    const period = url.searchParams.get('period') ?? 'month';

    const [statsRes, graphRes, retentionRes] = await Promise.all([
      dashFetch(`/user-stats?period=${period}`),
      dashFetch(`/user-graph-data?period=${period}`),
      dashFetch('/user-retention-data'),
    ]);

    const [stats, graph, retention] = await Promise.all([
      statsRes.json(),
      graphRes.json(),
      retentionRes.json(),
    ]);

    return json({ stats, graph, retention });
  } catch (err) {
    console.error('[auth/stats GET]', err);
    return badRequest('Failed to fetch stats');
  }
};
