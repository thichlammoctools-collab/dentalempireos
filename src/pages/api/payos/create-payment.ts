import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { getProduct, createOrder, getPayosSettings, getPayosEnv } from '../../../lib/payos-db';
import { createPaymentLink } from '../../../lib/payos';

export const prerender = false;

// POST /api/payos/create-payment — create a payment link for a product
export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);

  const settings = await getPayosSettings(env.DB);
  if (!settings?.client_id || !settings?.api_key) {
    return json({ error: 'PayOS chưa được cấu hình. Vui lòng liên hệ admin.' }, 500);
  }
  const creds = getPayosEnv(env.DB, settings, env);

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.product_id) return badRequest('Thiếu product_id');

  const product = await getProduct(env.DB, body.product_id as string);
  if (!product || !product.is_active) {
    return badRequest('Sản phẩm không tồn tại hoặc đã ngừng bán');
  }

  // Unique order_code — PayOS requires integer, use timestamp modulo
  const orderCode = Date.now() % 1_000_000_000;
  const orderId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

  const baseUrl = env.BETTER_AUTH_URL || 'https://dentalempireos.com';
  const cancelUrl = `${baseUrl}/payment/cancel?order=${orderId}`;
  const returnUrl = `${baseUrl}/payment/return?order=${orderId}`;

  try {
    const payosResponse = await createPaymentLink(creds, {
      orderCode,
      amount: product.price,
      description: `Thanh toan: ${product.name}`,
      cancelUrl,
      returnUrl,
    });

    await createOrder(env.DB, {
      id: orderId,
      user_id: locals.user.id,
      product_id: product.id,
      order_code: orderCode,
      amount: product.price,
      checkout_url: payosResponse.data.checkoutUrl,
      payment_link_id: payosResponse.data.paymentLinkId,
    });

    return json({
      checkoutUrl: payosResponse.data.checkoutUrl,
      orderCode,
      orderId,
      qrCode: payosResponse.data.qrCode,
    });
  } catch (err) {
    console.error('PayOS create payment error:', err);
    return json({ error: 'Lỗi tạo thanh toán. Vui lòng thử lại.' }, 500);
  }
};
