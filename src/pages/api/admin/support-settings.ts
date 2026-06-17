import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getSupportSettings, upsertSupportSettings } from '../../../lib/book-db';

export const prerender = false;

// GET /api/admin/support-settings
export const GET: APIRoute = async () => {
  const settings = await getSupportSettings(env.DB);
  if (!settings) {
    return json({ error: 'Settings not found' }, 404);
  }
  return json(settings);
};

// PUT /api/admin/support-settings
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { enabled, title, message, qr_url, payment_methods } = body as {
    enabled?: number;
    title?: string;
    message?: string;
    qr_url?: string;
    payment_methods?: string;
  };

  await upsertSupportSettings(env.DB, {
    enabled,
    title,
    message,
    qr_url,
    payment_methods,
  });

  return json({ ok: true });
};
