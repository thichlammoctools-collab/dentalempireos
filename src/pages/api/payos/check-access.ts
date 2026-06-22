import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { checkUserAccess, checkUserAccessBatch } from '../../../lib/access-check';

export const prerender = false;

// GET /api/payos/check-access?product_id=xxx  or  ?product_ids=xxx,yyy
export const GET: APIRoute = async ({ url, locals }) => {
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
