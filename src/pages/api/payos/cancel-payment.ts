import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getOrderByCode, updateOrderStatus, getPayosSettings, getPayosEnv } from '../../../lib/payos-db';
import { cancelPaymentLink } from '../../../lib/payos';

export const prerender = false;

// POST /api/payos/cancel-payment — cancel a pending payment
export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.order_code) return badRequest('Thiếu order_code');

  const orderCode = Number(body.order_code);
  const order = await getOrderByCode(env.DB, orderCode);
  if (!order) return badRequest('Đ��n hàng không tồn tại');
  if (order.user_id !== locals.user.id) return json({ error: 'Forbidden' }, 403);
  if (order.status !== 'pending') return badRequest('Đơn hàng không ở trạng thái chờ');

  // Cancel on PayOS side
  if (order.payment_link_id) {
    const settings = await getPayosSettings(env.DB);
    const creds = getPayosEnv(env.DB, settings, env);
    try {
      await cancelPaymentLink(creds, order.payment_link_id);
    } catch (err) {
      console.error('PayOS cancel error:', err);
    }
  }

  await updateOrderStatus(env.DB, order.id, 'cancelled');
  return json({ success: true });
};
