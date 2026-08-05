// Admin API: Get linked product for a scanner
// GET /api/admin/scanner-definitions/:id/linked-product

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getActiveProducts } from '../../../../lib/payos-db';
import { listProductEntitlements } from '../../../../lib/entitlement-db';
import { getSurveyDefinitionById } from '../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing scanner id');

  const def = await getSurveyDefinitionById(env.DB, id);
  if (!def) return json({ error: 'Scanner not found' }, 404);

  const products = await getActiveProducts(env.DB);
  const productsWithEntitlements = await Promise.all(products.map(async (product) => ({
    product,
    entitlements: await listProductEntitlements(env.DB, product.id),
  })));
  const productId = productsWithEntitlements
    .filter(({ entitlements }) => entitlements.some(
      (entitlement) => entitlement.content_type === 'scanner'
        && (entitlement.content_id === id || entitlement.content_id === '*'),
    ))
    .map(({ product }) => product)
    .sort((a, b) => a.price - b.price)[0]?.id ?? null;

  return json({ scanner_id: id, product_id: productId });
};
