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
  if (type === 'book_unlock') {
    if (!reference_id) return badRequest('Mở khóa chương sách cần Reference ID của chương');
    const chapter = await env.DB
      .prepare('SELECT 1 FROM "chapter" WHERE "id" = ? LIMIT 1')
      .bind(reference_id)
      .first();
    if (!chapter) return badRequest('Không tìm thấy chương tương ứng với Reference ID');
  }

  const id = slugify(name) + '-' + Date.now().toString(36);
  await upsertProduct(env.DB, {
    id,
    name,
    type,
    price,
    description,
    duration_days,
    reference_id,
    app_id: app_id || null,
    is_active,
  });

  return json({ id }, 201);
};
