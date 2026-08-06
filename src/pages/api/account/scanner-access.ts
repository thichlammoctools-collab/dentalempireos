import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { getActiveProducts, type Product } from '../../../lib/payos-db';
import { listProductEntitlements } from '../../../lib/entitlement-db';
import { canAccessScanner } from '../../../lib/entitlement-check';
import { listSurveyDefinitions } from '../../../lib/survey-config-db';

export const prerender = false;

// GET /api/account/scanner-access — list all scanners with user's access status
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ items: [] });

  const [surveys, products] = await Promise.all([
    listSurveyDefinitions(env.DB, { status: 'active' }),
    getActiveProducts(env.DB),
  ]);
  const productsWithEntitlements = await Promise.all(products.map(async (product) => ({
    product,
    entitlements: await listProductEntitlements(env.DB, product.id),
  })));

  const getScannerProduct = (scannerId: string): Product | null =>
    productsWithEntitlements
      .filter(({ entitlements }) => entitlements.some(
        (entitlement) => entitlement.content_type === 'scanner'
          && (entitlement.content_id === scannerId || entitlement.content_id === '*'),
      ))
      .map(({ product }) => product)
      .sort((a, b) => a.price - b.price)[0] ?? null;

  const items = await Promise.all(
    surveys.map(async (s) => {
       const product = getScannerProduct(s.id);
      const has_access = await canAccessScanner(env.DB, locals.user!.id, s.id).catch(() => false);

      return {
        id: s.id,
        slug: s.slug,
        title: s.title_vi,
        is_free: !product,
        has_access,
        price: product?.price ?? null,
        product_id: product?.id ?? null,
      };
    }),
  );

  return json({ items });
};
