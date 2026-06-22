import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../../lib/api-helpers';
import { listOrders } from '../../../../lib/payos-db';

export const prerender = false;

// GET /api/admin/orders — list orders with optional filters
export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status') ?? undefined;
  const userId = url.searchParams.get('user_id') ?? undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

  const result = await listOrders(env.DB, {
    status,
    user_id: userId,
    limit,
    offset,
  });

  return json(result);
};
