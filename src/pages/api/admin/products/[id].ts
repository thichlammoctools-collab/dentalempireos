import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getProduct, upsertProduct, deleteProduct } from '../../../../lib/payos-db';
import { listProductEntitlements, replaceProductEntitlements } from '../../../../lib/entitlement-db';
import {
  isEntitlementPreset,
  parseEntitlements,
  resolveEntitlements,
  type EntitlementPreset,
} from '../../../../lib/product-entitlement-presets';

export const prerender = false;

function parseEntitlementUpdate(body: Record<string, unknown>) {
  const hasPreset = Object.prototype.hasOwnProperty.call(body, 'entitlement_preset');
  const hasEntitlements = Object.prototype.hasOwnProperty.call(body, 'entitlements');
  if (!hasPreset && !hasEntitlements) return { present: false as const };

  const preset = body.entitlement_preset;
  if (hasPreset && !isEntitlementPreset(preset)) return { error: 'entitlement_preset is invalid' };
  const resolvedPreset: EntitlementPreset | undefined = hasPreset
    ? preset as EntitlementPreset
    : undefined;
  const parsedEntitlements = hasEntitlements ? parseEntitlements(body.entitlements) : undefined;
  if (parsedEntitlements === null) return { error: 'entitlements must be an array of valid entitlement rows' };
  if (parsedEntitlements?.some((entitlement) => entitlement.content_type === 'blog' && entitlement.content_id !== '*')) {
    return { error: 'Blog chỉ hỗ trợ gói đăng ký mở khóa toàn bộ bài Premium' };
  }

  const resolvedEntitlements = resolveEntitlements(
    resolvedPreset,
    parsedEntitlements,
  );
  if (!resolvedEntitlements) return { error: 'preset entitlements are defined by the server' };
  if (resolvedEntitlements.length === 0) return { error: 'Ít nhất một quyền lợi là bắt buộc' };
  return { present: true as const, entitlements: resolvedEntitlements };
}

// GET /api/admin/products/[id] — get a single product
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const row = await getProduct(env.DB, id);
  if (!row) return notFound();
  const entitlements = await listProductEntitlements(env.DB, id);
  return json({ ...row, entitlements });
};

// PATCH /api/admin/products/[id] — partial update (price, is_active, name)
export const PATCH: APIRoute = async ({ params, request, locals }) => {
  if (!locals.user) return json({ error: 'unauthorized' }, 401);
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return badRequest('Invalid JSON');

  const updates: Partial<{ price: number; is_active: number; name: string; description: string; reference_id: string | null; app_id: string | null }> = {};
  if (body.price !== undefined) {
    if (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) return badRequest('price must be >= 0');
    updates.price = body.price;
  }
  if (typeof body.is_active === 'boolean') updates.is_active = body.is_active ? 1 : 0;
  else if (body.is_active !== undefined) return badRequest('is_active must be a boolean');
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) return badRequest('name must be a non-empty string');
    updates.name = body.name.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== 'string') return badRequest('description must be a string');
    updates.description = body.description.trim();
  }
  if (body.reference_id !== undefined) {
    if (typeof body.reference_id !== 'string' && body.reference_id !== null) return badRequest('reference_id must be a string or null');
    updates.reference_id = body.reference_id?.trim() || null;
  }
  if (body.app_id !== undefined) {
    if (typeof body.app_id !== 'string' && body.app_id !== null) return badRequest('app_id must be a string or null');
    updates.app_id = body.app_id?.trim() || null;
  }

  const entitlementUpdate = parseEntitlementUpdate(body);
  if ('error' in entitlementUpdate && typeof entitlementUpdate.error === 'string') {
    return badRequest(entitlementUpdate.error);
  }
  if (Object.keys(updates).length === 0 && !entitlementUpdate.present) return badRequest('No fields to update');

  if (Object.keys(updates).length > 0) {
    await upsertProduct(env.DB, {
      id,
      name: updates.name ?? existing.name,
      type: 'access_package',
      price: updates.price ?? existing.price,
      description: updates.description ?? existing.description ?? undefined,
      duration_days: existing.duration_days,
      reference_id: updates.reference_id !== undefined ? updates.reference_id : existing.reference_id,
      app_id: updates.app_id !== undefined ? updates.app_id : existing.app_id,
      is_active: updates.is_active ?? existing.is_active,
    });
  }
  const entitlements = entitlementUpdate.present
    ? await replaceProductEntitlements(env.DB, id, entitlementUpdate.entitlements)
    : await listProductEntitlements(env.DB, id);

  return json({ success: true, entitlements });
};

// PUT /api/admin/products/[id] — update a product
export const PUT: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('Missing id');

  const existing = await getProduct(env.DB, id);
  if (!existing) return notFound();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== 'object' || Array.isArray(body)) return badRequest('Invalid JSON body');

  const { name, price, description, duration_days, reference_id, app_id, is_active } = body;
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) return badRequest('name must be a non-empty string');
  if (price !== undefined && (typeof price !== 'number' || !Number.isFinite(price) || price < 0)) return badRequest('price must be >= 0');
  if (description !== undefined && typeof description !== 'string') return badRequest('description must be a string');
  if (duration_days !== undefined && duration_days !== null && (typeof duration_days !== 'number' || !Number.isInteger(duration_days) || duration_days < 0)) {
    return badRequest('duration_days must be a non-negative integer or null');
  }
  if (reference_id !== undefined && reference_id !== null && typeof reference_id !== 'string') {
    return badRequest('reference_id must be a string or null');
  }
  if (app_id !== undefined && app_id !== null && typeof app_id !== 'string') return badRequest('app_id must be a string or null');
  if (is_active !== undefined && is_active !== 0 && is_active !== 1) return badRequest('is_active must be 0 or 1');

  const resolvedReferenceId = reference_id === undefined
    ? existing.reference_id
    : typeof reference_id === 'string'
      ? reference_id.trim() || null
      : null;

  const entitlementUpdate = parseEntitlementUpdate(body);
  if ('error' in entitlementUpdate && typeof entitlementUpdate.error === 'string') {
    return badRequest(entitlementUpdate.error);
  }
  const resolvedDurationDays = duration_days === undefined ? existing.duration_days : duration_days as number | null;
  const currentEntitlements = await listProductEntitlements(env.DB, id);
  const finalEntitlements = entitlementUpdate.present
    ? entitlementUpdate.entitlements
    : currentEntitlements;
  if (finalEntitlements.some((entitlement) => entitlement.content_type === 'blog' && entitlement.content_id === '*')
    && (!resolvedDurationDays || resolvedDurationDays < 1)) {
    return badRequest('Gói đăng ký Blog phải có thời hạn lớn hơn 0 ngày');
  }
  await upsertProduct(env.DB, {
    id,
    name: typeof name === 'string' ? name.trim() : existing.name,
    type: 'access_package',
    price: (price as number | undefined) ?? existing.price,
    description: typeof description === 'string' ? description.trim() : existing.description ?? undefined,
    duration_days: resolvedDurationDays,
    reference_id: resolvedReferenceId,
    app_id: app_id === undefined ? existing.app_id : typeof app_id === 'string' ? app_id.trim() || null : null,
    is_active: is_active ?? existing.is_active,
  });
  const entitlements = entitlementUpdate.present
    ? await replaceProductEntitlements(env.DB, id, finalEntitlements)
    : currentEntitlements;

  return json({ id, updated: true, entitlements });
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
