import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import {
  attachCreditOrderPaymentLink,
  cancelCreditOrder,
  getActiveCreditPackage,
  getRecentPendingCreditOrder,
  reserveCreditOrder,
} from '../../../lib/credit-db';
import { getManualPaymentSettings, getPayosEnv, getPayosSettings } from '../../../lib/payos-db';
import { createPaymentLink } from '../../../lib/payos';

export const prerender = false;

const MAX_ORDER_CODE_ATTEMPTS = 5;

function createOrderCode(): number {
  const value = new Uint32Array(1);
  crypto.getRandomValues(value);
  return (value[0] % 2_147_483_647) + 1;
}

function isUniqueConstraint(error: unknown): boolean {
  return /UNIQUE|PRIMARY KEY/i.test(error instanceof Error ? error.message : String(error));
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);
  const body = await request.json().catch(() => null) as { package_id?: unknown; payment_method?: unknown } | null;
  const packageId = typeof body?.package_id === 'string' ? body.package_id.trim() : '';
  const paymentMethod = body?.payment_method === 'payos' || body?.payment_method === 'manual'
    ? body.payment_method
    : null;
  if (!packageId || !paymentMethod) return badRequest('package_id và payment_method là bắt buộc');

  const creditPackage = await getActiveCreditPackage(env.DB, packageId);
  if (!creditPackage) return json({ error: 'Gói Credits không tồn tại hoặc đã ngừng bán.' }, 404);

  const pending = await getRecentPendingCreditOrder(env.DB, locals.user.id, creditPackage.id, paymentMethod);
  if (pending) {
    return json({
      orderId: pending.id,
      checkoutUrl: pending.checkout_url,
      amount: pending.amount,
      credits: pending.credits_to_grant,
      paymentMethod,
    });
  }

  if (paymentMethod === 'manual') {
    const settings = await getManualPaymentSettings(env.DB);
    if (!settings?.is_active || !settings.bank_bin || !settings.account_number || !settings.zalo_url) {
      return json({ error: 'Thanh toán chuyển khoản chưa được cấu hình.' }, 503);
    }
    const order = await reserveCreditOrder(env.DB, {
      userId: locals.user.id,
      creditPackage,
      paymentMethod: 'manual',
      orderCode: Number(`${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`),
      idempotencyKey: `manual:${locals.user.id}:${crypto.randomUUID()}`,
    });
    return json({ orderId: order.id, amount: order.amount, credits: order.credits_to_grant, paymentMethod }, 201);
  }

  const settings = await getPayosSettings(env.DB);
  const creds = getPayosEnv(env.DB, settings, env);
  if (!settings?.is_active || !creds.PAYOS_CLIENT_ID || !creds.PAYOS_API_KEY || !creds.PAYOS_CHECKSUM_KEY) {
    return json({ error: 'Thanh toán PayOS hiện chưa khả dụng.' }, 503);
  }

  let order: Awaited<ReturnType<typeof reserveCreditOrder>> | null = null;
  for (let attempt = 0; attempt < MAX_ORDER_CODE_ATTEMPTS; attempt += 1) {
    try {
      order = await reserveCreditOrder(env.DB, {
        userId: locals.user.id,
        creditPackage,
        paymentMethod: 'payos',
        orderCode: createOrderCode(),
        idempotencyKey: `payos:${locals.user.id}:${crypto.randomUUID()}`,
      });
      break;
    } catch (error) {
      if (!isUniqueConstraint(error) || attempt === MAX_ORDER_CODE_ATTEMPTS - 1) {
        console.error('[credits/checkout] order reservation failed:', error);
        return json({ error: 'Không thể tạo đơn nạp Credits.' }, 500);
      }
    }
  }
  if (!order || order.order_code === null) return json({ error: 'Không thể tạo đơn nạp Credits.' }, 500);

  const baseUrl = env.BETTER_AUTH_URL || 'https://dentalempireos.com';
  try {
    const payosResponse = await createPaymentLink(creds, {
      orderCode: order.order_code,
      amount: order.amount,
      description: `CRED${order.order_code}`,
      cancelUrl: `${baseUrl}/account/wallet`,
      returnUrl: `${baseUrl}/payment/credits-return?order=${encodeURIComponent(order.id)}`,
    });
    await attachCreditOrderPaymentLink(env.DB, {
      orderId: order.id,
      paymentLinkId: payosResponse.data.paymentLinkId,
      checkoutUrl: payosResponse.data.checkoutUrl,
    });
    return json({
      orderId: order.id,
      checkoutUrl: payosResponse.data.checkoutUrl,
      amount: order.amount,
      credits: order.credits_to_grant,
      paymentMethod,
    }, 201);
  } catch (error) {
    console.error('[credits/checkout] PayOS link failed:', error);
    await cancelCreditOrder(env.DB, order.id).catch(() => undefined);
    return json({ error: 'Không thể tạo liên kết thanh toán PayOS.' }, 500);
  }
};
