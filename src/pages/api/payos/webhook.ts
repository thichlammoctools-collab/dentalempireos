import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifySignature } from '../../../lib/payos';
import {
  getOrderByCode,
  updateOrderStatus,
  grantAccess,
  logWebhook,
  getProduct,
  getPayosSettings,
  getPayosEnv,
} from '../../../lib/payos-db';

export const prerender = false;

/**
 * POST /api/payos/webhook — receive payment notifications from PayOS.
 *
 * Rules:
 *  - Always return 200 to PayOS (except invalid signature) — PayOS retries on non-200.
 *  - Idempotent: check order.status before processing.
 *  - Log every webhook for audit trail.
 */
export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();

  let body: {
    code?: string;
    data?: {
      orderCode?: number;
      amount?: number;
      status?: string;
      description?: string;
      cancelUrl?: string;
      returnUrl?: string;
      paymentLinkId?: string;
      transactionDateTime?: string;
      reference?: string;
      counterAccountName?: string;
      counterAccountNumber?: string;
      counterAccountBankName?: string;
    };
    signature?: string;
  };

  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { data, signature } = body;
  if (!data || !signature || data.orderCode == null) {
    return new Response('Bad request', { status: 400 });
  }

  // Log every incoming webhook
  await logWebhook(env.DB, data.orderCode, rawBody);

  // Load PayOS credentials from D1
  const settings = await getPayosSettings(env.DB);
  const creds = getPayosEnv(env.DB, settings, env);

  // Verify HMAC-SHA256 signature
  const sigData: Record<string, string | number> = {
    amount: data.amount ?? 0,
    cancelUrl: data.cancelUrl ?? '',
    description: data.description ?? '',
    orderCode: data.orderCode,
    returnUrl: data.returnUrl ?? '',
  };

  const valid = await verifySignature(sigData, signature, creds.PAYOS_CHECKSUM_KEY);
  if (!valid) {
    return new Response('Invalid signature', { status: 400 });
  }

  // Look up the order
  const order = await getOrderByCode(env.DB, data.orderCode);
  if (!order) {
    // Unknown order — still return 200 so PayOS doesn't retry
    return new Response('Order not found', { status: 200 });
  }

  // Idempotent: already processed
  if (order.status === 'paid') {
    return new Response('Already processed', { status: 200 });
  }

  // Determine payment success
  const isSuccess = data.status === 'PAID' || body.code === '00';

  if (isSuccess) {
    await updateOrderStatus(env.DB, order.id, 'paid');

    // Grant access
    const product = await getProduct(env.DB, order.product_id);
    let expiresAt: string | null = null;

    if (product?.duration_days) {
      const d = new Date();
      d.setDate(d.getDate() + product.duration_days);
      expiresAt = d.toISOString();
    }

    await grantAccess(env.DB, {
      user_id: order.user_id,
      product_id: order.product_id,
      order_id: order.id,
      expires_at: expiresAt,
    });
  } else {
    await updateOrderStatus(env.DB, order.id, 'cancelled');
  }

  return new Response('OK', { status: 200 });
};
