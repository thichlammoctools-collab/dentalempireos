import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { checkUserAccess, checkUserAccessBatch } from '../../../lib/access-check';
import {
  getPayosEnv,
  getPayosSettings,
  grantProductAccess,
  updateOrderStatus,
} from '../../../lib/payos-db';
import { getPaymentInfo } from '../../../lib/payos';

export const prerender = false;

// GET /api/payos/check-access?product_id=xxx  or  ?product_ids=xxx,yyy  or  ?order_id=xxx
export const GET: APIRoute = async ({ url, locals }) => {
  const orderId = url.searchParams.get('order_id');

  // Reconcile a returning customer with PayOS if a webhook has not arrived yet.
  if (orderId) {
    try {
      const order = await env.DB
        .prepare('SELECT * FROM "order" WHERE id = ? LIMIT 1')
        .bind(orderId)
        .first<{
          id: string;
          user_id: string;
          product_id: string;
          payment_link_id: string | null;
          status: string;
        }>();

      if (order) {
        if (
          order.status === 'pending'
          && order.payment_link_id
          && locals.user?.id === order.user_id
        ) {
          const settings = await getPayosSettings(env.DB);
          const creds = getPayosEnv(env.DB, settings, env);

          if (creds.PAYOS_CLIENT_ID && creds.PAYOS_API_KEY && creds.PAYOS_CHECKSUM_KEY) {
            const payment = await getPaymentInfo(creds, order.payment_link_id);
            if (payment.status === 'PAID') {
              await updateOrderStatus(env.DB, order.id, 'paid');

              await grantProductAccess(env.DB, {
                user_id: order.user_id,
                product_id: order.product_id,
                order_id: order.id,
              });
              return json({ status: 'paid', product_id: order.product_id });
            }
          }
        }

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
