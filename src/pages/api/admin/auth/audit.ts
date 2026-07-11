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

// GET /api/admin/auth/audit — audit logs
export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const userId = url.searchParams.get('userId') ?? undefined;
    const eventType = url.searchParams.get('eventType') ?? undefined;
    const identifier = url.searchParams.get('identifier') ?? undefined;

    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (userId) params.set('userId', userId);
    if (eventType) params.set('eventType', eventType);
    if (identifier) params.set('identifier', identifier);

    const res = await dashFetch(`/events/all-audit-logs?${params}`);
    const data = await res.json();
    return json(data);
  } catch (err) {
    console.error('[auth/audit GET]', err);
    return badRequest('Failed to fetch audit logs');
  }
};
