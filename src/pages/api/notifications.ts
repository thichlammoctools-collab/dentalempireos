import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../lib/api-helpers';
import { listNotifications } from '../../lib/question-db';

export const prerender = false;

// GET /api/notifications — list current user's notifications
export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const notifications = await listNotifications(env.DB, user.id);
  return json(notifications);
};
