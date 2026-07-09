// Admin API: Product ↔ Scanner mapping
// GET  /api/admin/products/scanners        — all mappings + scanner list
// POST /api/admin/products/scanners        — set scanners for a product

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import {
  getProductScanners,
  setProductScanners,
  getScannerProductMapping,
  getAllProductScanners,
} from '../../../../lib/payos-db';
import { listSurveyDefinitions } from '../../../../lib/survey-config-db';

export const prerender = false;

// GET /api/admin/products/scanners
export const GET: APIRoute = async () => {
  const [mappings, scanners] = await Promise.all([
    getAllProductScanners(env.DB),
    listSurveyDefinitions(env.DB, { status: 'active' }),
  ]);

  // scannerId → productId map (active products only)
  const scannerProductMap = await getScannerProductMapping(env.DB);

  const scannerMap = Object.fromEntries(scanners.map((s) => [s.id, s.title_vi]));

  // Group by product
  const byProduct: Record<string, { product_id: string; scanners: string[] }> = {};
  for (const m of mappings) {
    if (!byProduct[m.product_id]) byProduct[m.product_id] = { product_id: m.product_id, scanners: [] };
    byProduct[m.product_id].scanners.push(m.scanner_id);
  }

  return json({
    mappings: byProduct,
    scanners: scanners.map((s) => ({
      id: s.id,
      title: s.title_vi,
      assigned_to: scannerProductMap.get(s.id) ?? null,
    })),
  });
};

// POST /api/admin/products/scanners — set scanner list for a product
export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'unauthorized' }, 401);

  const body = (await request.json().catch(() => null)) as {
    product_id: string;
    scanner_ids: string[];
  } | null;
  if (!body) return badRequest('Invalid JSON');
  if (!body.product_id) return badRequest('product_id is required');
  if (!Array.isArray(body.scanner_ids)) return badRequest('scanner_ids must be an array');

  // Validate product exists
  const prodRow = await env.DB
    .prepare('SELECT id FROM "product" WHERE id = ?')
    .bind(body.product_id)
    .first<{ id: string }>();
  if (!prodRow) return badRequest('Product not found');

  // Validate: each scanner must exist
  const { results: existingScanners } = await env.DB
    .prepare(
      `SELECT id FROM "survey_definition" WHERE id IN (${body.scanner_ids.map(() => '?').join(',')})`,
    )
    .bind(...body.scanner_ids)
    .all<{ id: string }>();

  if (existingScanners.length !== body.scanner_ids.length) {
    return badRequest('One or more scanner IDs are invalid');
  }

  // Validate: each scanner can only belong to one active product
  const scannerProductMap = await getScannerProductMapping(env.DB);
  for (const sid of body.scanner_ids) {
    const currentProduct = scannerProductMap.get(sid);
    if (currentProduct && currentProduct !== body.product_id) {
      return json(
        {
          error: `Scanner "${sid}" đã được gắn với sản phẩm khác. Cần gỡ khỏi sản phẩm kia trước.`,
          conflict_scanner_id: sid,
          conflict_product_id: currentProduct,
        },
        409,
      );
    }
  }

  await setProductScanners(env.DB, body.product_id, body.scanner_ids);

  return json({ success: true, product_id: body.product_id, scanner_ids: body.scanner_ids });
};
