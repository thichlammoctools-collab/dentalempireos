import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../../lib/api-helpers';
import { createAuth } from '../../../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const auth = createAuth(env);
    const user = await auth.api.getUser({ id });
    return json(user);
  } catch (err) {
    console.error('[auth/users/[id] GET]', err);
    return badRequest('Failed to fetch user');
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const auth = createAuth(env);
    const body = await request.json();
    const user = await auth.api.updateUser({ id, ...body });
    return json(user);
  } catch (err) {
    console.error('[auth/users/[id] PATCH]', err);
    return badRequest('Failed to update user');
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const auth = createAuth(env);
    await auth.api.removeUser({ userId: id });
    return json({ success: true });
  } catch (err) {
    console.error('[auth/users/[id] DELETE]', err);
    return badRequest('Failed to delete user');
  }
};
