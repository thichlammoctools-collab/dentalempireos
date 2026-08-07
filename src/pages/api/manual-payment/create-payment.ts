import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import {
  createManualOrder,
  getManualPaymentSettings,
  getProduct,
} from '../../../lib/payos-db';
import { listProductEntitlements } from '../../../lib/entitlement-db';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (typeof body?.product_id !== 'string') return badRequest('Thiếu product_id');
  const selectedScannerId = typeof body.scanner_id === 'string' && body.scanner_id.trim()
    ? body.scanner_id.trim()
    : null;

  const [product, settings] = await Promise.all([
    getProduct(env.DB, body.product_id),
    getManualPaymentSettings(env.DB),
  ]);
  if (!product?.is_active) return badRequest('Sản phẩm không tồn tại hoặc đã ngừng bán');
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
  if (!settings?.is_active || !settings.bank_bin || !settings.account_number || !settings.zalo_url) {
    return json({ error: 'Thanh toán chuyển khoản chưa được cấu hình. Vui lòng liên hệ quản trị viên.' }, 503);
  }

  // The short numeric reference is easy to type and fits bank transfer descriptions.
  const orderCode = Number(`${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 10)}`);
  const orderId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

  try {
    await createManualOrder(env.DB, {
      id: orderId,
      user_id: locals.user.id,
      product_id: product.id,
      order_code: orderCode,
      amount: product.price,
      selected_scanner_id: selectedScannerId,
    });
  } catch (error) {
    console.error('Manual payment order error:', error);
    return json({ error: 'Không thể tạo đơn hàng. Vui lòng thử lại.' }, 500);
  }

  return json({ orderId });
};
