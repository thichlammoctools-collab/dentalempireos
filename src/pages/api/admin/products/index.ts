import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import { listProducts, upsertProduct } from '../../../../lib/payos-db';

export const prerender = false;

const PRODUCT_TYPES = new Set([
  'course_unlock',
  'document_unlock',
  'booking',
  'event_ticket',
  'survey_unlock',
  'book_unlock',
]);

// GET /api/admin/products — list all products
export const GET: APIRoute = async () => {
  const products = await listProducts(env.DB);
  return json(products);
};

// POST /api/admin/products — create a new product
export const POST: APIRoute = async ({ request }) => {
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

  if (!name) return badRequest('name is required');
  if (!type) return badRequest('type is required');
  if (price == null || price < 0) return badRequest('price must be >= 0');
  if (!PRODUCT_TYPES.has(type)) return badRequest('Loại sản phẩm không hợp lệ');
  if (type === 'book_unlock' && is_active !== 0) {
    const activeBookProduct = await env.DB
      .prepare('SELECT "id" FROM "product" WHERE "type" = ? AND "is_active" = 1 LIMIT 1')
      .bind('book_unlock')
      .first<{ id: string }>();
    if (activeBookProduct) return badRequest('Chỉ được phép có một gói mở khóa sách đang bán');
  }
  const id = slugify(name) + '-' + Date.now().toString(36);
  await upsertProduct(env.DB, {
    id,
    name,
    type,
    price,
    description,
    duration_days,
    reference_id: type === 'book_unlock' ? null : reference_id,
    app_id: app_id || null,
    is_active,
  });

  return json({ id }, 201);
};
