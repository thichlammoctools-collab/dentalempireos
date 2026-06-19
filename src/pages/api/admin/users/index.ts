import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { listUsers, toggleUserActive } from '../../../../lib/user-db';

export const prerender = false;

// GET /api/admin/users — list all users
export const GET: APIRoute = async () => {
  try {
    const users = await listUsers(env.DB);
    const active = users.filter((u) => u.is_active === 1).length;
    return json({ users, total: users.length, active, inactive: users.length - active });
  } catch (err) {
    console.error('list users error:', err);
    return badRequest('Failed to list users');
  }
};

// PATCH /api/admin/users — toggle is_active
// Body: { userId: string }
export const PATCH: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { userId } = body as { userId?: string };
  if (!userId) return badRequest('userId is required');

  try {
    const updated = await toggleUserActive(env.DB, userId);
    if (!updated) return badRequest('User not found');
    return json({ ok: true, user: updated });
  } catch (err) {
    console.error('toggle user active error:', err);
    return badRequest('Failed to toggle user');
  }
};
