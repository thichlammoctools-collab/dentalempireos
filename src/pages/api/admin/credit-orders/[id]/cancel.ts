import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../../lib/api-helpers';
import { cancelCreditOrder, getCreditOrder } from '../../../../../lib/credit-db';

export const prerender = false;

export const POST: APIRoute = async ({ params }) => {
  const orderId = params.id;
  if (!orderId) return badRequest('Thiếu mã đơn nạp Credits');
  const order = await getCreditOrder(env.DB, orderId);
  if (!order) return json({ error: 'Không tìm thấy đơn nạp Credits' }, 404);
  if (order.payment_method !== 'manual') return badRequest('Chỉ hủy đơn chuyển khoản thủ công');
  const cancelled = await cancelCreditOrder(env.DB, order.id);
  if (!cancelled && order.status !== 'cancelled') return badRequest('Đơn không còn ở trạng thái chờ');
  return json({ ok: true });
};
