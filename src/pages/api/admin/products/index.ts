import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import { listProducts, upsertProduct } from '../../../../lib/payos-db';
import { listProductEntitlements, replaceProductEntitlements } from '../../../../lib/entitlement-db';
import {
  isEntitlementPreset,
  parseEntitlements,
  resolveEntitlements,
} from '../../../../lib/product-entitlement-presets';

export const prerender = false;

// GET /api/admin/products — list all products
export const GET: APIRoute = async () => {
  const products = await listProducts(env.DB);
  return json(await Promise.all(products.map(async (product) => ({
    ...product,
    entitlements: await listProductEntitlements(env.DB, product.id),
  }))));
};

// POST /api/admin/products — create a new product
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return badRequest('Invalid JSON body');

  const { name, price, description, duration_days, reference_id, app_id, is_active, entitlement_preset, entitlements } = body as {
    name?: string;
    price?: number;
    description?: string;
    duration_days?: number | null;
    reference_id?: string | null;
    app_id?: string | null;
    is_active?: number;
    entitlement_preset?: unknown;
    entitlements?: unknown;
  };

  if (typeof name !== 'string' || !name.trim()) return badRequest('name is required');
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) return badRequest('price must be >= 0');
  if (description !== undefined && typeof description !== 'string') return badRequest('description must be a string');
  if (duration_days !== undefined && duration_days !== null && (!Number.isInteger(duration_days) || duration_days < 0)) {
    return badRequest('duration_days must be a non-negative integer or null');
  }
  if (reference_id !== undefined && reference_id !== null && typeof reference_id !== 'string') {
    return badRequest('reference_id must be a string or null');
  }
  if (app_id !== undefined && app_id !== null && typeof app_id !== 'string') return badRequest('app_id must be a string or null');
  if (is_active !== undefined && is_active !== 0 && is_active !== 1) return badRequest('is_active must be 0 or 1');
  const normalizedReferenceId = reference_id?.trim() || null;
  if (entitlement_preset !== undefined && !isEntitlementPreset(entitlement_preset)) {
    return badRequest('entitlement_preset is invalid');
  }
  const parsedEntitlements = entitlements === undefined ? undefined : parseEntitlements(entitlements);
  if (parsedEntitlements === null) return badRequest('entitlements must be an array of valid entitlement rows');
  if (parsedEntitlements?.some((entitlement) => entitlement.content_type === 'blog' && entitlement.content_id !== '*')) {
    return badRequest('Blog chỉ hỗ trợ gói đăng ký mở khóa toàn bộ bài Premium');
  }
  const resolvedEntitlements = resolveEntitlements(entitlement_preset, parsedEntitlements);
  if (resolvedEntitlements === null) return badRequest('Invalid entitlement mapping');
  if (!resolvedEntitlements?.length) return badRequest('Ít nhất một quyền lợi là bắt buộc');
  if (resolvedEntitlements?.some((entitlement) => entitlement.content_type === 'blog' && entitlement.content_id === '*')
    && (!duration_days || duration_days < 1)) {
    return badRequest('Gói đăng ký Blog phải có thời hạn lớn hơn 0 ngày');
  }
  const id = slugify(name.trim()) + '-' + Date.now().toString(36);
  await upsertProduct(env.DB, {
    id,
    name: name.trim(),
    type: 'access_package',
    price,
    description: description?.trim(),
    duration_days,
    reference_id: normalizedReferenceId,
    app_id: app_id?.trim() || null,
    is_active,
  });
  await replaceProductEntitlements(env.DB, id, resolvedEntitlements);

  return json({ id, entitlements: resolvedEntitlements }, 201);
};
