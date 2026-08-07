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
import { listProductEntitlements } from '../../../lib/entitlement-db';
import { cancelPaymentLink, createPaymentLink } from '../../../lib/payos';
import { getUpgradeQuote } from '../../../lib/upgrade-pricing';
import type { UpgradeOrderDetails } from '../../../lib/payos-db';

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
  if (typeof body?.product_id !== 'string') return badRequest('Thiếu product_id');
  const selectedScannerId = typeof body.scanner_id === 'string' && body.scanner_id.trim()
    ? body.scanner_id.trim()
    : null;
  const isUpgrade = body.upgrade === true;

  const product = await getProduct(env.DB, body.product_id as string);
  if (!product || !product.is_active) {
    return badRequest('Sản phẩm không tồn tại hoặc đã ngừng bán');
  }
  if (selectedScannerId) {
    const [scanner, entitlements] = await Promise.all([
      env.DB.prepare('SELECT 1 FROM "survey_definition" WHERE "id" = ? AND "status" = \'active\'').bind(selectedScannerId).first(),
      listProductEntitlements(env.DB, product.id),
    ]);
    const isSelectableScanner = entitlements.some(
      (entitlement) => entitlement.content_type === 'scanner' && entitlement.content_id === selectedScannerId,
    );
    if (!scanner || !isSelectableScanner) return badRequest('Scanner được chọn không thuộc sản phẩm này');
  }

  // Upgrade pricing is always recomputed here; a client-supplied amount or
  // source package can never lower the charge.
  let amount = product.price;
  let upgrade: UpgradeOrderDetails | null = null;
  if (isUpgrade) {
    if (selectedScannerId) return badRequest('Không thể nâng cấp cho sản phẩm Scanner tùy chọn');
    const quote = await getUpgradeQuote(
      env.DB,
      locals.user.id,
      product.id,
      typeof body.from_product_id === 'string' ? body.from_product_id : null,
    );
    if (!quote.eligible) return json({ error: quote.message, reason: quote.reason }, 409);

    amount = quote.finalAmount;
    upgrade = {
      from_product_id: quote.fromProduct.id,
      from_access_id: quote.fromAccessId,
      original_amount: quote.originalAmount,
      credit_amount: quote.creditAmount,
      credit_days: quote.remainingDays,
    };
  }

  // Reuse an in-flight checkout so retries or double-clicks cannot create duplicate charges.
  const pendingOrder = await getRecentPendingOrder(
    env.DB,
    locals.user.id,
    product.id,
    selectedScannerId,
    isUpgrade ? 'upgrade' : 'purchase',
  );
  if (pendingOrder?.checkout_url) {
    return json({
      checkoutUrl: pendingOrder.checkout_url,
      orderCode: pendingOrder.order_code,
      orderId: pendingOrder.id,
      amount: pendingOrder.amount,
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
        amount,
        selected_scanner_id: selectedScannerId,
        upgrade,
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
      amount,
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
      amount,
    });
  } catch (err) {
    console.error('PayOS create payment error:', err);
    await cancelPayosReservation(env.DB, orderId).catch((cancelErr) => {
      console.error('PayOS reservation cancellation error:', cancelErr);
    });
    return json({ error: 'Lỗi tạo thanh toán. Vui lòng thử lại.' }, 500);
  }
};
