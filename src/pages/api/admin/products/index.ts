import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import { listProducts, upsertProduct } from '../../../../lib/payos-db';
import { listProductEntitlements, replaceProductEntitlements } from '../../../../lib/entitlement-db';
import {
  isEntitlementPreset,
  isServiceEntitlementPreset,
  parseEntitlements,
  resolveEntitlements,
} from '../../../../lib/product-entitlement-presets';

export const prerender = false;

const PRODUCT_TYPES = new Set([
  'course_unlock',
  'document_unlock',
  'booking',
  'event_ticket',
  'survey_unlock',
  'book_unlock',
  'service_program',
]);

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

  const { name, type, price, description, duration_days, reference_id, app_id, is_active, entitlement_preset, entitlements } = body as {
    name?: string;
    type?: string;
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
  if (typeof type !== 'string') return badRequest('type is required');
  if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) return badRequest('price must be >= 0');
  if (!PRODUCT_TYPES.has(type)) return badRequest('Loại sản phẩm không hợp lệ');
  if (description !== undefined && typeof description !== 'string') return badRequest('description must be a string');
  if (duration_days !== undefined && duration_days !== null && (!Number.isInteger(duration_days) || duration_days < 0)) {
    return badRequest('duration_days must be a non-negative integer or null');
  }
  if (reference_id !== undefined && reference_id !== null && typeof reference_id !== 'string') {
    return badRequest('reference_id must be a string or null');
  }
  if (app_id !== undefined && app_id !== null && typeof app_id !== 'string') return badRequest('app_id must be a string or null');
  if (is_active !== undefined && is_active !== 0 && is_active !== 1) return badRequest('is_active must be 0 or 1');
  if (entitlement_preset !== undefined && !isEntitlementPreset(entitlement_preset)) {
    return badRequest('entitlement_preset is invalid');
  }
  if (
    entitlement_preset !== undefined
    && isServiceEntitlementPreset(entitlement_preset)
    && type !== 'service_program'
  ) {
    return badRequest('service entitlement presets require a service_program product');
  }
  const parsedEntitlements = entitlements === undefined ? undefined : parseEntitlements(entitlements);
  if (parsedEntitlements === null) return badRequest('entitlements must be an array of valid entitlement rows');
  const resolvedEntitlements = resolveEntitlements(entitlement_preset, parsedEntitlements);
  if (entitlement_preset !== undefined && !resolvedEntitlements) {
    return badRequest('custom requires entitlements; preset entitlements are defined by the server');
  }
  if (resolvedEntitlements === null) return badRequest('Invalid entitlement mapping');
  if (
    type !== 'service_program'
    && resolvedEntitlements?.some((entitlement) => entitlement.content_type === 'service')
  ) {
    return badRequest('service entitlements require a service_program product');
  }
  if (type === 'book_unlock' && is_active !== 0) {
    const activeBookProduct = await env.DB
      .prepare('SELECT "id" FROM "product" WHERE "type" = ? AND "is_active" = 1 LIMIT 1')
      .bind('book_unlock')
      .first<{ id: string }>();
    if (activeBookProduct) return badRequest('Chỉ được phép có một gói mở khóa sách đang bán');
  }
  const id = slugify(name.trim()) + '-' + Date.now().toString(36);
  await upsertProduct(env.DB, {
    id,
    name: name.trim(),
    type,
    price,
    description: description?.trim(),
    duration_days,
    reference_id: type === 'book_unlock' ? null : reference_id?.trim() || null,
    app_id: app_id?.trim() || null,
    is_active,
  });
  await replaceProductEntitlements(env.DB, id, resolvedEntitlements ?? []);

  return json({ id, entitlements: resolvedEntitlements ?? [] }, 201);
};
