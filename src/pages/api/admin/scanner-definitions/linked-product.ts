// Admin API: Get linked product for a scanner
// GET /api/admin/scanner-definitions/:id/linked-product

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getScannerProduct } from '../../../../lib/payos-db';
import { getSurveyDefinitionById } from '../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing scanner id');

  const def = await getSurveyDefinitionById(env.DB, id);
  if (!def) return json({ error: 'Scanner not found' }, 404);

  const productId = await getScannerProduct(env.DB, id);

  return json({ scanner_id: id, product_id: productId });
};
