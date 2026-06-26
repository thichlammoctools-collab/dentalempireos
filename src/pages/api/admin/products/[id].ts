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

// PATCH /api/admin/products/[id] — partial update (price, is_active, name)
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) return json({ error: 'unauthorized' }, 401);
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON');

  const updates: Partial<{ price: number; is_active: number; name: string; description: string; app_id: string | null }> = {};
  if (typeof body.price === 'number' && body.price >= 0) updates.price = body.price;
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active ? 1 : 0;
  if (typeof body.name === 'string' && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.description === 'string') updates.description = body.description.trim();
  if (typeof body.app_id === 'string' || body.app_id === null) updates.app_id = body.app_id ?? null;

  if (Object.keys(updates).length === 0) return badRequest('No fields to update');

  await upsertProduct(env.DB, {
    id,
    name: updates.name ?? existing.name,
    type: existing.type,
    price: updates.price ?? existing.price,
    description: updates.description ?? existing.description,
    duration_days: existing.duration_days,
    reference_id: existing.reference_id,
    app_id: updates.app_id !== undefined ? updates.app_id : existing.app_id,
    is_active: updates.is_active ?? existing.is_active,
  });

  return json({ success: true });
};

// PUT /api/admin/products/[id] — update a product
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { name, type, price, description, duration_days, reference_id, app_id, is_active } = body as {
    name?: string;
    type?: string;
    price?: number;
    description?: string;
    duration_days?: number | null;
    reference_id?: string | null;
    app_id?: string | null;
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
    app_id: app_id !== undefined ? app_id : existing.app_id,
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
