import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getProduct, upsertProduct, deleteProduct } from '../../../../lib/payos-db';

export const prerender = false;

// GET /api/admin/products/[id] — get a single product
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const row = await getProduct(env.DB, id);
  if (!row) return notFound();
  return json(row);
};

// PUT /api/admin/products/[id] — update a product
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();

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

  await upsertProduct(env.DB, {
    id,
    name: name ?? existing.name,
    type: type ?? existing.type,
    price: price ?? existing.price,
    description: description ?? existing.description,
    duration_days: duration_days ?? existing.duration_days,
    reference_id: reference_id ?? existing.reference_id,
    is_active: is_active ?? existing.is_active,
  });

  return json({ id, updated: true });
};

// DELETE /api/admin/products/[id] — delete a product
export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();

  await deleteProduct(env.DB, id);
  return json({ deleted: true });
};
