import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import {
  getProduct,
  getPayosSettings,
  getPayosEnv,
  getRecentPendingOrder,
  reservePayosOrder,
  attachPayosPaymentLink,
  cancelPayosReservation,
  isUniqueConstraintError,
} from '../../../lib/payos-db';
import { cancelPaymentLink, createPaymentLink } from '../../../lib/payos';

export const prerender = false;

const MAX_RESERVATION_ATTEMPTS = 5;

function createCryptographicOrderCode(): number {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return (value[0] % 2_147_483_647) + 1;
}

// POST /api/payos/create-payment — create a payment link for a product
export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);

  const settings = await getPayosSettings(env.DB);
  const creds = getPayosEnv(env.DB, settings, env);
  if (!settings?.is_active || !creds.PAYOS_CLIENT_ID || !creds.PAYOS_API_KEY || !creds.PAYOS_CHECKSUM_KEY) {
    return json({ error: 'Thanh toán PayOS hiện chưa khả dụng. Vui lòng liên hệ quản trị viên.' }, 503);
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.product_id) return badRequest('Thiếu product_id');

  const product = await getProduct(env.DB, body.product_id as string);
  if (!product || !product.is_active) {
    return badRequest('Sản phẩm không tồn tại hoặc đã ngừng bán');
  }

  // Reuse an in-flight checkout so retries or double-clicks cannot create duplicate charges.
  const pendingOrder = await getRecentPendingOrder(env.DB, locals.user.id, product.id);
  if (pendingOrder?.checkout_url) {
    return json({
      checkoutUrl: pendingOrder.checkout_url,
      orderCode: pendingOrder.order_code,
      orderId: pendingOrder.id,
    });
  }

  let orderCode = 0;
  let orderId = '';
  let reserved = false;

  for (let attempt = 0; attempt < MAX_RESERVATION_ATTEMPTS; attempt += 1) {
    orderCode = createCryptographicOrderCode();
    orderId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

    try {
      await reservePayosOrder(env.DB, {
        id: orderId,
        user_id: locals.user.id,
        product_id: product.id,
        order_code: orderCode,
        amount: product.price,
      });
      reserved = true;
      break;
    } catch (err) {
      if (!isUniqueConstraintError(err) || attempt === MAX_RESERVATION_ATTEMPTS - 1) {
        console.error('PayOS order reservation error:', err);
        return json({ error: 'Lỗi tạo đơn thanh toán. Vui lòng thử lại.' }, 500);
      }
    }
  }

  if (!reserved) {
    return json({ error: 'Lỗi tạo đơn thanh toán. Vui lòng thử lại.' }, 500);
  }

  const baseUrl = env.BETTER_AUTH_URL || 'https://dentalempireos.com';
  const cancelUrl = `${baseUrl}/payment/cancel?order=${orderId}`;
  const returnUrl = `${baseUrl}/payment/return?order=${orderId}`;

  try {
    const payosResponse = await createPaymentLink(creds, {
      orderCode,
      amount: product.price,
      // PayOS limits payment descriptions; keep this ASCII reference short and unique.
      description: `DEOS${orderCode}`,
      cancelUrl,
      returnUrl,
    });

    try {
      await attachPayosPaymentLink(env.DB, {
        order_id: orderId,
        checkout_url: payosResponse.data.checkoutUrl,
        payment_link_id: payosResponse.data.paymentLinkId,
      });
    } catch (err) {
      console.error('PayOS payment-link attach error:', err);
      try {
        await cancelPaymentLink(creds, payosResponse.data.paymentLinkId);
      } catch (cancelErr) {
        console.error('PayOS remote payment-link cancellation error:', cancelErr);
      }
      await cancelPayosReservation(env.DB, orderId).catch((cancelErr) => {
        console.error('PayOS reservation cancellation error:', cancelErr);
      });
      return json({ error: 'Lỗi tạo thanh toán. Vui lòng thử lại.' }, 500);
    }

    return json({
      checkoutUrl: payosResponse.data.checkoutUrl,
      orderCode,
      orderId,
      qrCode: payosResponse.data.qrCode,
    });
  } catch (err) {
    console.error('PayOS create payment error:', err);
    await cancelPayosReservation(env.DB, orderId).catch((cancelErr) => {
      console.error('PayOS reservation cancellation error:', cancelErr);
    });
    return json({ error: 'Lỗi tạo thanh toán. Vui lòng thử lại.' }, 500);
  }
};
