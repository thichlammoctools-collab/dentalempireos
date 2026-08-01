import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../../lib/api-helpers';
import { getOrder, getPayosEnv, getPayosSettings, updateOrderStatus } from '../../../../../lib/payos-db';
import { cancelPaymentLink } from '../../../../../lib/payos';

export const prerender = false;

/** Cancel an unpaid manual-transfer or PayOS order. */
export const POST: APIRoute = async ({ params }) => {
  const orderId = params.id;
  if (!orderId) return badRequest('Thiếu mã đơn hàng');

  const order = await getOrder(env.DB, orderId);
  if (!order) return json({ error: 'Không tìm thấy đơn hàng' }, 404);
  if (order.status !== 'pending') return badRequest('Chỉ có thể hủy đơn đang chờ thanh toán');

  if (order.payment_link_id) {
    try {
      const settings = await getPayosSettings(env.DB);
      const credentials = getPayosEnv(env.DB, settings, env);
      await cancelPaymentLink(credentials, order.payment_link_id);
    } catch (error) {
      console.error(`[admin-orders] Failed to cancel PayOS link for ${order.id}:`, error);
      return json({ error: 'Không thể hủy liên kết thanh toán tại PayOS. Đơn hàng chưa được thay đổi.' }, 502);
    }
  }

  await updateOrderStatus(env.DB, order.id, 'cancelled');
  return json({ ok: true });
};
