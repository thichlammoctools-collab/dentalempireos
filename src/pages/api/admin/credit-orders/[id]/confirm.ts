import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../../../lib/api-helpers';
import { fulfillCreditOrder, getCreditOrder } from '../../../../../lib/credit-db';

export const prerender = false;

export const POST: APIRoute = async ({ params, locals }) => {
  const orderId = params.id;
  if (!orderId) return badRequest('Thiếu mã đơn nạp Credits');
  if (!locals.user) return json({ error: 'unauthorized' }, 401);
  const order = await getCreditOrder(env.DB, orderId);
  if (!order) return json({ error: 'Không tìm thấy đơn nạp Credits' }, 404);
  if (order.payment_method !== 'manual') return badRequest('Chỉ xác nhận đơn chuyển khoản thủ công');
  if (order.status === 'cancelled' || order.status === 'expired') return badRequest('Đơn nạp Credits không còn hiệu lực');
  const fulfilled = await fulfillCreditOrder(env.DB, order, locals.user.id);
  const timestamp = new Date().toISOString();
  await env.DB.prepare(
    `UPDATE "credit_order"
     SET "manual_confirmed_by_user_id" = COALESCE("manual_confirmed_by_user_id", ?),
         "manual_confirmed_at" = COALESCE("manual_confirmed_at", ?), "updated_at" = ?
     WHERE "id" = ?`,
  ).bind(locals.user.id, timestamp, timestamp, order.id).run();
  return json({ ok: true, alreadyConfirmed: !fulfilled.created, order: fulfilled.order });
};
