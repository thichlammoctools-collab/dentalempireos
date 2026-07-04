import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { checkUserAccess, checkUserAccessBatch } from '../../../lib/access-check';

export const prerender = false;

// GET /api/payos/check-access?product_id=xxx  or  ?product_ids=xxx,yyy  or  ?order_id=xxx
export const GET: APIRoute = async ({ url, locals }) => {
  const orderId = url.searchParams.get('order_id');

  // Order status check (no auth required for this path)
  if (orderId) {
    try {
      const order = await env.DB
        .prepare('SELECT status, product_id FROM "order" WHERE id = ? LIMIT 1')
        .bind(orderId)
        .first<{ status: string; product_id: string }>();
      if (order) {
        return json({ status: order.status, product_id: order.product_id });
      }
    } catch {}
    return json({ status: 'unknown' });
  }

  if (!locals.user) return json({ hasAccess: false });

  const productId = url.searchParams.get('product_id');
  const productIds = url.searchParams.get('product_ids');

  if (productId) {
    const access = await checkUserAccess(env.DB, locals.user.id, productId);
    return json({ hasAccess: access });
  }

  if (productIds) {
    const ids = productIds.split(',').filter(Boolean);
    const accessMap = await checkUserAccessBatch(env.DB, locals.user.id, ids);
    const result: Record<string, boolean> = {};
    accessMap.forEach((v, k) => {
      result[k] = v;
    });
    return json({ access: result });
  }

  return json({ error: 'Thiếu product_id hoặc product_ids' }, 400);
};
