import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../../lib/api-helpers';
import { getOrder, updateOrderStatus } from '../../../../../lib/payos-db';

export const prerender = false;

/** Cancel a manual bank-transfer order that has not been confirmed yet. */
export const POST: APIRoute = async ({ params }) => {
  const orderId = params.id;
  if (!orderId) return badRequest('Thiếu mã đơn hàng');

  const order = await getOrder(env.DB, orderId);
  if (!order) return json({ error: 'Không tìm thấy đơn hàng' }, 404);
  if (order.payment_link_id !== null) return badRequest('Chỉ hủy thủ công các đơn chuyển khoản');
  if (order.status !== 'pending') return badRequest('Đơn hàng không ở trạng thái chờ xác nhận');

  await updateOrderStatus(env.DB, order.id, 'cancelled');
  return json({ ok: true });
};
