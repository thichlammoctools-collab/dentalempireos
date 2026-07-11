import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../../lib/api-helpers';

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

// GET /api/admin/auth/users/[id] — user detail
export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const res = await dashFetch(`/user/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) return badRequest(data.message ?? 'Failed to fetch user');
    return json(data);
  } catch (err) {
    console.error('[auth/users/[id] GET]', err);
    return badRequest('Failed to fetch user');
  }
};

// PATCH /api/admin/auth/users/[id] — update user
export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const body = await request.json();
    const res = await dashFetch(`/update-user/${encodeURIComponent(id)}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return badRequest(data.message ?? 'Failed to update user');
    return json(data);
  } catch (err) {
    console.error('[auth/users/[id] PATCH]', err);
    return badRequest('Failed to update user');
  }
};

// DELETE /api/admin/auth/users/[id] — delete user
export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const res = await dashFetch(`/delete-user/${encodeURIComponent(id)}`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) return badRequest(data.message ?? 'Failed to delete user');
    return json(data);
  } catch (err) {
    console.error('[auth/users/[id] DELETE]', err);
    return badRequest('Failed to delete user');
  }
};
