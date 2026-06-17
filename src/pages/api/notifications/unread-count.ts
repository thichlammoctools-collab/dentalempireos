import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { getUnreadCount } from '../../../lib/question-db';

export const prerender = false;

// GET /api/notifications/unread-count
export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const count = await getUnreadCount(env.DB, user.id);
  return json({ count });
};
