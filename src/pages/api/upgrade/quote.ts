import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { badRequest, json } from '../../../lib/api-helpers';
import { getUpgradeQuote } from '../../../lib/upgrade-pricing';

export const prerender = false;

// GET /api/upgrade/quote?product_id=xxx — preview the price of an upgrade.
export const GET: APIRoute = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);

  const productId = url.searchParams.get('product_id');
  if (!productId) return badRequest('Thiếu product_id');
  const fromProductId = url.searchParams.get('from_product_id');

  const quote = await getUpgradeQuote(env.DB, locals.user.id, productId, fromProductId);
  if (!quote.eligible) {
    return json({ eligible: false, reason: quote.reason, message: quote.message });
  }

  return json({
    eligible: true,
    fromProduct: { id: quote.fromProduct.id, name: quote.fromProduct.name },
    toProduct: { id: quote.toProduct.id, name: quote.toProduct.name },
    remainingDays: quote.remainingDays,
    creditAmount: quote.creditAmount,
    originalAmount: quote.originalAmount,
    finalAmount: quote.finalAmount,
    newDurationDays: quote.newDurationDays,
    newExpiresAt: quote.newExpiresAt,
  });
};
