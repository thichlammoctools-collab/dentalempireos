import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { fulfillCreditOrder, getCreditBalance, getCreditOrder } from '../../../lib/credit-db';
import { getPayosEnv, getPayosSettings } from '../../../lib/payos-db';
import { getPaymentInfo } from '../../../lib/payos';

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'unauthorized' }, 401);
  const orderId = url.searchParams.get('order_id');
  if (!orderId) return json({ error: 'Thiếu order_id' }, 400);

  const order = await getCreditOrder(env.DB, orderId);
  if (!order || order.user_id !== locals.user.id) return json({ status: 'unknown' }, 404);
  if (order.status === 'paid') {
    return json({ status: 'paid', creditsGranted: order.credits_to_grant, balance: await getCreditBalance(env.DB, locals.user.id) });
  }
  if (order.payment_method !== 'payos' || !order.payment_link_id) return json({ status: order.status });

  try {
    const settings = await getPayosSettings(env.DB);
    const creds = getPayosEnv(env.DB, settings, env);
    if (!creds.PAYOS_CLIENT_ID || !creds.PAYOS_API_KEY || !creds.PAYOS_CHECKSUM_KEY) return json({ status: order.status });
    const payment = await getPaymentInfo(creds, order.payment_link_id);
    if (payment.status === 'PAID' && payment.amount === order.amount && payment.orderCode === order.order_code) {
      const fulfilled = await fulfillCreditOrder(env.DB, order);
      return json({ status: fulfilled.order.status, creditsGranted: fulfilled.order.credits_to_grant, balance: await getCreditBalance(env.DB, locals.user.id) });
    }
  } catch (error) {
    console.error('[credits/check-payment] reconciliation failed:', error);
  }
  return json({ status: order.status });
};
