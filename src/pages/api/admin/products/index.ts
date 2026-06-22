import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import { listProducts, upsertProduct } from '../../../../lib/payos-db';

export const prerender = false;

// GET /api/admin/products — list all products
export const GET: APIRoute = async () => {
  const products = await listProducts(env.DB);
  return json(products);
};

// POST /api/admin/products — create a new product
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { name, type, price, description, duration_days, reference_id, is_active } = body as {
    name?: string;
    type?: string;
    price?: number;
    description?: string;
    duration_days?: number | null;
    reference_id?: string | null;
    is_active?: number;
  };

  if (!name) return badRequest('name is required');
  if (!type) return badRequest('type is required');
  if (price == null || price < 0) return badRequest('price must be >= 0');

  const id = slugify(name) + '-' + Date.now().toString(36);
  await upsertProduct(env.DB, {
    id,
    name,
    type,
    price,
    description,
    duration_days,
    reference_id,
    is_active,
  });

  return json({ id }, 201);
};
