// Data access layer for PayOS payment tables in D1.
// Covers products, orders, access grants, and webhook audit logs.

// ── Types ────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  type: 'course_unlock' | 'document_unlock' | 'booking' | 'event_ticket';
  price: number;
  description: string | null;
  duration_days: number | null;
  reference_id: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  id: string;
  name: string;
  type: string;
  price: number;
  description?: string;
  duration_days?: number | null;
  reference_id?: string | null;
  is_active?: number;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  order_code: number;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  payment_link_id: string | null;
  checkout_url: string | null;
  created_at: string;
  paid_at: string | null;
  expires_at: string | null;
}

export interface Access {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string;
  granted_at: string;
  expires_at: string | null;
  is_active: number;
}

function now(): string {
  return new Date().toISOString();
}

function uid(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

// ── Products ─────────────────────────────────────────────────

export async function listProducts(db: D1Database): Promise<Product[]> {
  const { results } = await db
    .prepare('SELECT * FROM "product" ORDER BY "created_at" DESC')
    .all<Product>();
  return results;
}

export async function getProduct(db: D1Database, id: string): Promise<Product | null> {
  return db.prepare('SELECT * FROM "product" WHERE "id" = ?').bind(id).first<Product>();
}

export async function getActiveProducts(db: D1Database): Promise<Product[]> {
  const { results } = await db
    .prepare('SELECT * FROM "product" WHERE "is_active" = 1 ORDER BY "created_at" DESC')
    .all<Product>();
  return results;
}

export async function upsertProduct(db: D1Database, input: ProductInput): Promise<Product> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "product" ("id","name","type","price","description","duration_days","reference_id","is_active","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "type"=excluded."type",
         "price"=excluded."price",
         "description"=excluded."description",
         "duration_days"=excluded."duration_days",
         "reference_id"=excluded."reference_id",
         "is_active"=excluded."is_active",
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.id,
      input.name,
      input.type,
      input.price,
      input.description ?? null,
      input.duration_days ?? null,
      input.reference_id ?? null,
      input.is_active ?? 1,
      ts,
      ts,
    )
    .run();
  return getProduct(db, input.id) as Promise<Product>;
}

export async function deleteProduct(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM "product" WHERE "id" = ?').bind(id).run();
}

// ── Orders ───────────────────────────────────────────────────

export async function createOrder(
  db: D1Database,
  input: {
    id: string;
    user_id: string;
    product_id: string;
    order_code: number;
    amount: number;
    checkout_url: string;
    payment_link_id: string;
    expires_at?: string | null;
  },
): Promise<Order> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at")
       VALUES (?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      input.id,
      input.user_id,
      input.product_id,
      input.order_code,
      input.amount,
      'pending',
      input.payment_link_id,
      input.checkout_url,
      ts,
    )
    .run();
  return getOrder(db, input.id) as Promise<Order>;
}

export async function getOrder(db: D1Database, id: string): Promise<Order | null> {
  return db.prepare('SELECT * FROM "order" WHERE "id" = ?').bind(id).first<Order>();
}

export async function getOrderByCode(db: D1Database, orderCode: number): Promise<Order | null> {
  return db
    .prepare('SELECT * FROM "order" WHERE "order_code" = ?')
    .bind(orderCode)
    .first<Order>();
}

export async function listOrders(
  db: D1Database,
  opts: { status?: string; user_id?: string; limit?: number; offset?: number } = {},
): Promise<{ orders: Order[]; total: number }> {
  const conditions: string[] = [];
  const binds: (string | number)[] = [];

  if (opts.status) {
    conditions.push('"status" = ?');
    binds.push(opts.status);
  }
  if (opts.user_id) {
    conditions.push('"user_id" = ?');
    binds.push(opts.user_id);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const limit = opts.limit ?? 20;
  const offset = opts.offset ?? 0;

  const row = await db
    .prepare(`SELECT COUNT(*) as count FROM "order" ${where}`)
    .bind(...binds)
    .first<{ count: number }>();

  const { results } = await db
    .prepare(`SELECT * FROM "order" ${where} ORDER BY "created_at" DESC LIMIT ? OFFSET ?`)
    .bind(...binds, limit, offset)
    .all<Order>();

  return { orders: results, total: row?.count ?? 0 };
}

export async function updateOrderStatus(
  db: D1Database,
  orderId: string,
  status: 'paid' | 'cancelled' | 'expired',
): Promise<void> {
  const ts = now();
  if (status === 'paid') {
    await db
      .prepare('UPDATE "order" SET "status" = ?, "paid_at" = ? WHERE "id" = ?')
      .bind(status, ts, orderId)
      .run();
  } else {
    await db
      .prepare('UPDATE "order" SET "status" = ? WHERE "id" = ?')
      .bind(status, orderId)
      .run();
  }
}

// ── Access ───────────────────────────────────────────────────

export async function grantAccess(
  db: D1Database,
  input: {
    user_id: string;
    product_id: string;
    order_id: string;
    expires_at: string | null;
  },
): Promise<Access> {
  const ts = now();
  const id = uid();
  await db
    .prepare(
      `INSERT INTO "access" ("id","user_id","product_id","order_id","granted_at","expires_at","is_active")
       VALUES (?,?,?,?,?,?,1)`,
    )
    .bind(id, input.user_id, input.product_id, input.order_id, ts, input.expires_at)
    .run();
  return db.prepare('SELECT * FROM "access" WHERE "id" = ?').bind(id).first<Access>() as Promise<Access>;
}

export async function hasAccess(
  db: D1Database,
  userId: string,
  productId: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const row = await db
    .prepare(
      `SELECT 1 FROM "access"
       WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1
         AND ("expires_at" IS NULL OR "expires_at" > ?)
       LIMIT 1`,
    )
    .bind(userId, productId, now)
    .first();
  return !!row;
}

export async function listUserAccess(db: D1Database, userId: string): Promise<Access[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "access" WHERE "user_id" = ? AND "is_active" = 1
       ORDER BY "granted_at" DESC`,
    )
    .bind(userId)
    .all<Access>();
  return results;
}

export async function revokeAccess(db: D1Database, accessId: string): Promise<void> {
  await db
    .prepare('UPDATE "access" SET "is_active" = 0 WHERE "id" = ?')
    .bind(accessId)
    .run();
}

// ── Webhook Log ──────────────────────────────────────────────

export async function logWebhook(
  db: D1Database,
  orderCode: number,
  payload: string,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO "payos_webhook_log" ("order_code","payload","received_at") VALUES (?,?,?)`,
    )
    .bind(orderCode, payload, now())
    .run();
}

// ── PayOS Settings (single-row config) ───────────────────────

export interface PayosSettings {
  id: number;
  client_id: string;
  api_key: string;
  checksum_key: string;
  webhook_url: string;
  sandbox_mode: number;
  is_active: number;
  updated_at: string;
}

export async function getPayosSettings(db: D1Database): Promise<PayosSettings | null> {
  return db.prepare('SELECT * FROM "payos_settings" WHERE "id" = 1').first<PayosSettings>();
}

/**
 * Get PayOS credentials as an env-like object for use by payos.ts functions.
 * Falls back to env vars if D1 settings are empty.
 */
export function getPayosEnv(
  db: D1Database,
  settings: PayosSettings | null,
  env: Cloudflare.Env,
): { PAYOS_CLIENT_ID: string; PAYOS_API_KEY: string; PAYOS_CHECKSUM_KEY: string; PAYOS_WEBHOOK_URL: string } {
  return {
    PAYOS_CLIENT_ID: settings?.client_id || env.PAYOS_CLIENT_ID || '',
    PAYOS_API_KEY: settings?.api_key || env.PAYOS_API_KEY || '',
    PAYOS_CHECKSUM_KEY: settings?.checksum_key || env.PAYOS_CHECKSUM_KEY || '',
    PAYOS_WEBHOOK_URL: settings?.webhook_url || env.PAYOS_WEBHOOK_URL || '',
  };
}

export async function upsertPayosSettings(
  db: D1Database,
  input: {
    client_id?: string;
    api_key?: string;
    checksum_key?: string;
    webhook_url?: string;
    sandbox_mode?: number;
    is_active?: number;
  },
): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "payos_settings" ("id","client_id","api_key","checksum_key","webhook_url","sandbox_mode","is_active","updated_at")
       VALUES (1,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "client_id"=COALESCE(excluded."client_id","payos_settings"."client_id"),
         "api_key"=COALESCE(excluded."api_key","payos_settings"."api_key"),
         "checksum_key"=COALESCE(excluded."checksum_key","payos_settings"."checksum_key"),
         "webhook_url"=COALESCE(excluded."webhook_url","payos_settings"."webhook_url"),
         "sandbox_mode"=COALESCE(excluded."sandbox_mode","payos_settings"."sandbox_mode"),
         "is_active"=COALESCE(excluded."is_active","payos_settings"."is_active"),
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.client_id ?? '',
      input.api_key ?? '',
      input.checksum_key ?? '',
      input.webhook_url ?? '',
      input.sandbox_mode ?? 1,
      input.is_active ?? 0,
      ts,
    )
    .run();
}
