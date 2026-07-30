import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../../lib/api-helpers';
import { createAuth } from '../../../../../lib/auth';
import { getProduct, grantAccess, listProducts } from '../../../../../lib/payos-db';

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const auth = createAuth(env);
    const user = await auth.api.getUser({ id, headers: request.headers });
    const [products, accessResult] = await Promise.all([
      listProducts(env.DB),
      env.DB
        .prepare(
          `SELECT a."id", a."product_id", a."granted_at", a."expires_at", a."is_active",
                  p."name" AS "product_name"
           FROM "access" a
           JOIN "product" p ON p."id" = a."product_id"
           WHERE a."user_id" = ? AND a."is_active" = 1
           ORDER BY a."granted_at" DESC`,
        )
        .bind(id)
        .all(),
    ]);
    return json({
      ...user,
      products: products.filter((product) => product.is_active === 1),
      accesses: accessResult.results,
    });
  } catch (err) {
    console.error('[auth/users/[id] GET]', err);
    return badRequest('Failed to fetch user');
  }
};

// POST /api/admin/auth/users/[id] — manually grant a product to a user.
export const POST: APIRoute = async ({ params, request }) => {
  const { id: userId } = params;
  if (!userId) return badRequest('Missing user id');

  const body = await request.json().catch(() => null) as { productId?: string } | null;
  const productId = body?.productId;
  if (!productId) return badRequest('productId is required');

  const user = await env.DB
    .prepare('SELECT "id", "banned" FROM "user" WHERE "id" = ?')
    .bind(userId)
    .first<{ id: string; banned: number | null }>();
  if (!user) return json({ error: 'Không tìm thấy người dùng' }, 404);
  if (user.banned) return badRequest('Không thể cấp quyền cho người dùng đang bị cấm');

  const product = await getProduct(env.DB, productId);
  if (!product) return json({ error: 'Không tìm thấy sản phẩm' }, 404);
  if (product.is_active !== 1) return badRequest('Sản phẩm hiện không được kích hoạt');

  const now = new Date();
  const expiresAt = product.duration_days
    ? new Date(now.getTime() + product.duration_days * 24 * 60 * 60 * 1000).toISOString()
    : null;
  const orderId = crypto.randomUUID();
  // Internal orders remain auditable while not colliding with customer payment codes.
  const orderCode = now.getTime() * 1000 + Math.floor(Math.random() * 1000);

  await env.DB
    .prepare(
      `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at","paid_at")
       VALUES (?,?,?,?,?,'paid',NULL,NULL,?,?)`,
    )
    .bind(orderId, userId, product.id, orderCode, 0, now.toISOString(), now.toISOString())
    .run();

  const access = await grantAccess(env.DB, {
    user_id: userId,
    product_id: product.id,
    order_id: orderId,
    expires_at: expiresAt,
  });

  return json({ ok: true, access });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const auth = createAuth(env);
    const body = await request.json();
    const user = await auth.api.updateUser({ id, ...body, headers: request.headers });
    return json(user);
  } catch (err) {
    console.error('[auth/users/[id] PATCH]', err);
    return badRequest('Failed to update user');
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const { id } = params;
  if (!id) return badRequest('Missing user id');

  try {
    const auth = createAuth(env);
    await auth.api.removeUser({ userId: id, headers: request.headers });
    return json({ success: true });
  } catch (err) {
    console.error('[auth/users/[id] DELETE]', err);
    return badRequest('Failed to delete user');
  }
};
