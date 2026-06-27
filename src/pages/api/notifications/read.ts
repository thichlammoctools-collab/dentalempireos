import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { markNotificationRead, markAllNotificationsRead } from '../../../lib/question-db';

export const prerender = false;

// POST /api/notifications/read — mark notifications as read
export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = (await request.json().catch(() => null)) as { id?: string } | null;

  if (body?.id) {
    // Mark single notification
    await markNotificationRead(env.DB, body.id);
  } else {
    // Mark all as read
    await markAllNotificationsRead(env.DB, user.id);
  }

  return json({ ok: true });
};
