import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { getSupportSettings } from '../../../lib/book-db';

export const prerender = false;

// GET /api/public/support-settings — no auth required
export const GET: APIRoute = async () => {
  const settings = await getSupportSettings(env.DB);
  return json(settings ?? { enabled: 0 });
};
