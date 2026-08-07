import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../../lib/api-helpers';
import { getOrder, getProduct, grantProductAccess, updateOrderStatus } from '../../../../../lib/payos-db';

export const prerender = false;

/** Confirm a verified manual bank transfer and grant the purchased access. */
export const POST: APIRoute = async ({ params }) => {
  const orderId = params.id;
  if (!orderId) return badRequest('Thiếu mã đơn hàng');

  const order = await getOrder(env.DB, orderId);
  if (!order) return json({ error: 'Không tìm thấy đơn hàng' }, 404);
  if (order.payment_link_id !== null) return badRequest('Chỉ xác nhận thủ công các đơn chuyển khoản');
  if (order.status === 'paid') return json({ ok: true, alreadyConfirmed: true });
  if (order.status !== 'pending') return badRequest('Đơn hàng không ở trạng thái chờ xác nhận');

  const product = await getProduct(env.DB, order.product_id);
  if (!product) return json({ error: 'Không tìm thấy sản phẩm của đơn hàng' }, 404);

  await updateOrderStatus(env.DB, order.id, 'paid');
  await grantProductAccess(env.DB, {
    user_id: order.user_id,
    product_id: order.product_id,
    order_id: order.id,
    selected_scanner_id: order.selected_scanner_id,
  });
  return json({ ok: true });
};
