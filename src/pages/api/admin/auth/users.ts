import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';

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

// GET /api/admin/auth/users — list users with rich data
export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    const search = url.searchParams.get('search') ?? '';
    const banned = url.searchParams.get('banned');

    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (search) params.set('search', search);
    if (banned !== null) params.set('banned', banned);

    const res = await dashFetch(`/list-users?${params}`);
    const data = await res.json();
    return json(data);
  } catch (err) {
    console.error('[auth/users GET]', err);
    return badRequest('Failed to fetch users');
  }
};

// POST /api/admin/auth/users — create user
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const res = await dashFetch('/create-user', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return badRequest(data.message ?? 'Failed to create user');
    return json(data, 201);
  } catch (err) {
    console.error('[auth/users POST]', err);
    return badRequest('Failed to create user');
  }
};
