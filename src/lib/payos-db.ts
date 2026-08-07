// Data access layer for PayOS payment tables in D1.
// Covers products, orders, access grants, and webhook audit logs.

// ── Types ────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  // Persisted values are normalized to access_package. Keep this permissive for
  // external callers that still send or display legacy labels during rollout.
  type: string;
  price: number;
  description: string | null;
  duration_days: number | null;
  reference_id: string | null;
  app_id: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  id: string;
  name: string;
  type?: string;
  price: number;
  description?: string;
  duration_days?: number | null;
  reference_id?: string | null;
  app_id?: string | null;
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

export interface OrderWithBuyer extends Order {
  buyer_name: string | null;
  buyer_email: string | null;
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

export interface OrderWithProduct extends Order {
  product_name: string;
  product_type: Product['type'];
}

export interface ManualPaymentSettings {
  id: number;
  is_active: number;
  bank_bin: string;
  account_number: string;
  account_name: string;
  zalo_url: string;
  updated_at: string;
}

/** Return the active product that unlocks all premium book sections. */
export async function getActiveBookProduct(db: D1Database): Promise<Product | null> {
  return db
    .prepare(
      `SELECT * FROM "product"
       WHERE "is_active" = 1
         AND EXISTS (
           SELECT 1 FROM "product_entitlement" pe
           WHERE pe."product_id" = "product"."id"
             AND pe."content_type" = 'book'
             AND pe."content_id" = '*'
         )
       ORDER BY "created_at" DESC
       LIMIT 1`,
    )
    .first<Product>();
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
      `INSERT INTO "product" ("id","name","type","price","description","duration_days","reference_id","app_id","is_active","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "type"=excluded."type",
         "price"=excluded."price",
         "description"=excluded."description",
         "duration_days"=excluded."duration_days",
         "reference_id"=excluded."reference_id",
         "app_id"=excluded."app_id",
         "is_active"=excluded."is_active",
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.id,
      input.name,
      'access_package',
      input.price,
      input.description ?? null,
      input.duration_days ?? null,
      input.reference_id ?? null,
      input.app_id ?? null,
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

/** Reserve an order code before creating its corresponding remote PayOS link. */
export async function reservePayosOrder(
  db: D1Database,
  input: {
    id: string;
    user_id: string;
    product_id: string;
    order_code: number;
    amount: number;
  },
): Promise<Order> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at")
       VALUES (?,?,?,?,?,'pending',NULL,NULL,?)`,
    )
    .bind(input.id, input.user_id, input.product_id, input.order_code, input.amount, ts)
    .run();
  return getOrder(db, input.id) as Promise<Order>;
}

/** Attach the remote payment link only to its still-pending local reservation. */
export async function attachPayosPaymentLink(
  db: D1Database,
  input: { order_id: string; payment_link_id: string; checkout_url: string },
): Promise<void> {
  const result = await db
    .prepare(
      `UPDATE "order"
       SET "payment_link_id" = ?, "checkout_url" = ?
       WHERE "id" = ? AND "status" = 'pending' AND "payment_link_id" IS NULL`,
    )
    .bind(input.payment_link_id, input.checkout_url, input.order_id)
    .run();

  if (result.meta.changes !== 1) {
    throw new Error(`Unable to attach PayOS payment link to reserved order ${input.order_id}`);
  }
}

/** Cancel a local reservation after its remote payment-link workflow fails. */
export async function cancelPayosReservation(db: D1Database, orderId: string): Promise<void> {
  await db
    .prepare(
      `UPDATE "order" SET "status" = 'cancelled'
       WHERE "id" = ? AND "status" = 'pending' AND "payment_link_id" IS NULL`,
    )
    .bind(orderId)
    .run();
}

/** D1 surfaces SQLite unique violations as errors without a stable typed error API. */
export function isUniqueConstraintError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /UNIQUE/i.test(message) && /order_code/i.test(message);
}

export async function getOrder(db: D1Database, id: string): Promise<Order | null> {
  return db.prepare('SELECT * FROM "order" WHERE "id" = ?').bind(id).first<Order>();
}

export async function getRecentPendingOrder(
  db: D1Database,
  userId: string,
  productId: string,
): Promise<Order | null> {
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  return db
    .prepare(
      `SELECT * FROM "order"
       WHERE "user_id" = ? AND "product_id" = ? AND "status" = 'pending'
         AND "payment_link_id" IS NOT NULL AND "created_at" >= ?
       ORDER BY "created_at" DESC
       LIMIT 1`,
    )
    .bind(userId, productId, cutoff)
    .first<Order>();
}

export async function getOrderWithProduct(
  db: D1Database,
  orderId: string,
  userId: string,
): Promise<OrderWithProduct | null> {
  return db
    .prepare(
      `SELECT o.*, p."name" AS "product_name", p."type" AS "product_type"
       FROM "order" o
       INNER JOIN "product" p ON p."id" = o."product_id"
       WHERE o."id" = ? AND o."user_id" = ?`,
    )
    .bind(orderId, userId)
    .first<OrderWithProduct>();
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
): Promise<{ orders: OrderWithBuyer[]; total: number }> {
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
    .prepare(
      `SELECT o.*, u."name" AS "buyer_name", u."email" AS "buyer_email"
       FROM "order" o
       LEFT JOIN "user" u ON u."id" = o."user_id"
       ${where ? `WHERE ${conditions.map((condition) => condition.replaceAll('"', 'o."')).join(' AND ')}` : ''}
       ORDER BY o."created_at" DESC LIMIT ? OFFSET ?`,
    )
    .bind(...binds, limit, offset)
    .all<OrderWithBuyer>();

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
  // A payment can be delivered more than once. Its original grant is the
  // authoritative result, so retries must not create another renewal.
  const orderAccess = await db
    .prepare('SELECT * FROM "access" WHERE "order_id" = ? LIMIT 1')
    .bind(input.order_id)
    .first<Access>();
  if (orderAccess) return orderAccess;

  const ts = now();
  const id = uid();

  const existing = await db
    .prepare(
      `SELECT "expires_at" FROM "access"
       WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1
       LIMIT 1`,
    )
    .bind(input.user_id, input.product_id)
    .first<{ expires_at: string | null }>();

  // Renewals extend from the later of now and the current expiry. A permanent
  // access remains permanent when the same product is granted again.
  const expiresAt = existing?.expires_at === null
    ? null
    : existing?.expires_at && input.expires_at
      ? new Date(Math.max(
        new Date(existing.expires_at).getTime(),
        new Date(input.expires_at).getTime(),
      )).toISOString()
      : input.expires_at;

  // Deactivate any existing active access for this user+product first.
  // This prevents race conditions (e.g., PayOS webhook fires twice for the same payment).
  // The unique partial index idx_access_user_product_active also guards against duplicates.
  await db
    .prepare(
      `UPDATE "access" SET "is_active" = 0
       WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1`,
    )
    .bind(input.user_id, input.product_id)
    .run();

  await db
    .prepare(
      `INSERT INTO "access" ("id","user_id","product_id","order_id","granted_at","expires_at","is_active")
       VALUES (?,?,?,?,?,?,1)`,
    )
    .bind(id, input.user_id, input.product_id, input.order_id, ts, expiresAt)
    .run();

  return db.prepare('SELECT * FROM "access" WHERE "id" = ?').bind(id).first<Access>() as Promise<Access>;
}

/** Grant product access using its duration without shortening an active renewal. */
export async function grantProductAccess(
  db: D1Database,
  input: { user_id: string; product_id: string; order_id: string },
): Promise<Access> {
  const product = await getProduct(db, input.product_id);
  if (!product) throw new Error(`Product not found: ${input.product_id}`);

  let expiresAt: string | null = null;
  if (product.duration_days && product.duration_days > 0) {
    const existing = await db
      .prepare(
        `SELECT "expires_at" FROM "access"
         WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1
         LIMIT 1`,
      )
      .bind(input.user_id, input.product_id)
      .first<{ expires_at: string | null }>();

    if (existing?.expires_at !== null) {
      const currentExpiry = existing?.expires_at ? new Date(existing.expires_at).getTime() : 0;
      const base = Math.max(Date.now(), currentExpiry);
      expiresAt = new Date(base + product.duration_days * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  return grantAccess(db, { ...input, expires_at: expiresAt });
}

export async function hasAccess(
  db: D1Database,
  userId: string,
  productId: string,
): Promise<boolean> {
  const now = new Date().toISOString();

  const row = await db
    .prepare(
      `SELECT 1 FROM "access" a
       WHERE a."user_id" = ? AND a."product_id" = ? AND a."is_active" = 1
           AND (a."expires_at" IS NULL OR a."expires_at" > ?)
       LIMIT 1`,
    )
    .bind(userId, productId, now)
    .first();
  return !!row;
}

export interface OrderWithScanners extends OrderWithProduct {
  scanner_names: string[];
}

export async function listUserOrders(db: D1Database, userId: string): Promise<OrderWithProduct[]> {
  const { results } = await db
    .prepare(
      `SELECT o.*, p."name" AS "product_name", p."type" AS "product_type"
       FROM "order" o
       INNER JOIN "product" p ON p."id" = o."product_id"
       WHERE o."user_id" = ?
       ORDER BY o."created_at" DESC`,
    )
    .bind(userId)
    .all<OrderWithProduct>();
  return results;
}

/** List user orders with the scanner names attached to each product. */
export async function listUserOrdersWithScanners(
  db: D1Database,
  userId: string,
): Promise<OrderWithScanners[]> {
  const orders = await listUserOrders(db, userId);
  if (orders.length === 0) return orders as OrderWithScanners[];

  const productIds = [...new Set(orders.map((o) => o.product_id))];
  const placeholders = productIds.map(() => '?').join(',');
  const { results: scannerRows } = await db
    .prepare(
       `SELECT pe."product_id", CASE WHEN pe."content_id" = '*' THEN 'Toàn bộ Scanner' ELSE d."title_vi" END AS "scanner_name"
       FROM "product_entitlement" pe
       LEFT JOIN "survey_definition" d
         ON pe."content_id" = d."id"
       WHERE pe."content_type" = 'scanner'
         AND pe."product_id" IN (${placeholders})
        ORDER BY d."title_vi" ASC`,
    )
    .bind(...productIds)
    .all<{ product_id: string; scanner_name: string }>();

  const byProduct = new Map<string, string[]>();
  for (const row of scannerRows) {
    const list = byProduct.get(row.product_id) ?? [];
    if (!list.includes(row.scanner_name)) list.push(row.scanner_name);
    byProduct.set(row.product_id, list);
  }

  return orders.map((order) => ({
    ...order,
    scanner_names: byProduct.get(order.product_id) ?? [],
  }));
}

export async function listManualOrders(db: D1Database): Promise<OrderWithProduct[]> {
  const { results } = await db
    .prepare(
      `SELECT o.*, p."name" AS "product_name", p."type" AS "product_type"
       FROM "order" o
       INNER JOIN "product" p ON p."id" = o."product_id"
       WHERE o."payment_link_id" IS NULL
       ORDER BY CASE o."status" WHEN 'pending' THEN 0 ELSE 1 END, o."created_at" DESC`,
    )
    .all<OrderWithProduct>();
  return results;
}

/** Create a pending order for a bank transfer. Its order code is the transfer reference. */
export async function createManualOrder(
  db: D1Database,
  input: { id: string; user_id: string; product_id: string; order_code: number; amount: number },
): Promise<Order> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at")
       VALUES (?,?,?,?,?,'pending',NULL,NULL,?)`,
    )
    .bind(input.id, input.user_id, input.product_id, input.order_code, input.amount, ts)
    .run();
  return getOrder(db, input.id) as Promise<Order>;
}

/** Return whether a user has an active product that unlocks this scanner. */
export async function hasScannerAccess(
  db: D1Database,
  userId: string,
  scannerId: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const row = await db
    .prepare(
       `SELECT 1
        FROM "access" a
         INNER JOIN "product_entitlement" pe ON pe."product_id" = a."product_id"
         WHERE a."user_id" = ? AND pe."content_type" = 'scanner'
           AND pe."content_id" IN (?, '*') AND a."is_active" = 1
          AND (a."expires_at" IS NULL OR a."expires_at" > ?)
       LIMIT 1`,
    )
    .bind(userId, scannerId, now)
    .first();
  return !!row;
}

// ── Product ↔ Scanner mapping ────────────────────────────────

/** Get all scanner IDs assigned to a product. */
export async function getProductScanners(db: D1Database, productId: string): Promise<string[]> {
  const { results } = await db
    .prepare(`SELECT DISTINCT d."id" AS "scanner_id"
      FROM "product_entitlement" pe
      INNER JOIN "survey_definition" d ON pe."content_id" = d."id" OR pe."content_id" = '*'
      WHERE pe."product_id" = ? AND pe."content_type" = 'scanner'
      ORDER BY d."id" ASC`)
    .bind(productId)
    .all<{ scanner_id: string }>();
  return results.map((r) => r.scanner_id);
}

export async function getScannerProduct(
  db: D1Database,
  scannerId: string,
): Promise<string | null> {
  const row = await db
    .prepare(
       `SELECT p.id FROM "product" p
        INNER JOIN "product_entitlement" pe ON p.id = pe.product_id
        WHERE pe."content_type" = 'scanner'
          AND pe."content_id" IN (?, '*')
        ORDER BY p."is_active" DESC, pe."created_at" DESC
       LIMIT 1`,
    )
    .bind(scannerId)
    .first<{ id: string }>();
  return row?.id ?? null;
}

export async function setProductScanners(
  db: D1Database,
  productId: string,
  scannerIds: string[],
): Promise<void> {
  await db.batch([
    db.prepare(`DELETE FROM "product_entitlement"
      WHERE "product_id" = ? AND "content_type" = 'scanner'`).bind(productId),
    ...scannerIds.map((scannerId) =>
      db
        .prepare(
          `INSERT INTO "product_entitlement"
           ("product_id", "content_type", "content_id", "created_at", "updated_at")
           VALUES (?, 'scanner', ?, datetime('now'), datetime('now'))`,
        )
        .bind(productId, scannerId),
    ),
  ]);
}

export async function getAllProductScanners(
  db: D1Database,
): Promise<Array<{ product_id: string; scanner_id: string; assigned_at: string }>> {
  const { results } = await db.prepare(
    `SELECT pe."product_id", d."id" AS "scanner_id", pe."created_at" AS "assigned_at"
     FROM "product_entitlement" pe
     INNER JOIN "survey_definition" d ON pe."content_id" = d."id" OR pe."content_id" = '*'
     WHERE pe."content_type" = 'scanner'
     ORDER BY "assigned_at" ASC`,
  ).all<{ product_id: string; scanner_id: string; assigned_at: string }>();
  return results;
}

export async function getScannerProductMapping(
  db: D1Database,
): Promise<Map<string, string>> {
  const { results } = await db
    .prepare(
       `SELECT d.id AS scanner_id, p.id as product_id
         FROM "product_entitlement" pe
         INNER JOIN "product" p ON pe.product_id = p.id
         INNER JOIN "survey_definition" d
           ON pe.content_id = d.id OR pe.content_id = '*'
         WHERE pe.content_type = 'scanner'
         ORDER BY d.id ASC, p.is_active DESC, pe.created_at DESC`,
    )
    .all<{ scanner_id: string; product_id: string }>();
  const map = new Map<string, string>();
  for (const r of results) if (!map.has(r.scanner_id)) map.set(r.scanner_id, r.product_id);
  return map;
}

export async function getScannerPriceMapping(
  db: D1Database,
): Promise<Map<string, number>> {
  const { results } = await db
    .prepare(
       `SELECT d.id AS scanner_id, p.price
         FROM "product_entitlement" pe
         INNER JOIN "product" p ON pe.product_id = p.id
         INNER JOIN "survey_definition" d
           ON pe.content_id = d.id OR pe.content_id = '*'
         WHERE pe.content_type = 'scanner'
         ORDER BY d.id ASC, p.is_active DESC, pe.created_at DESC`,
    )
    .all<{ scanner_id: string; price: number }>();
  const map = new Map<string, number>();
  for (const r of results) if (!map.has(r.scanner_id)) map.set(r.scanner_id, r.price);
  return map;
}

export async function listUserAccess(db: D1Database, userId: string): Promise<Access[]> {
  const { results } = await db
    .prepare(
      `SELECT a.* FROM "access" a
       WHERE a."user_id" = ? AND a."is_active" = 1
       ORDER BY a."granted_at" DESC`,
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
 * Production Cloudflare Secrets take priority over editable D1 settings.
 */
export function getPayosEnv(
  _db: D1Database,
  settings: PayosSettings | null,
  env: Cloudflare.Env,
): { PAYOS_CLIENT_ID: string; PAYOS_API_KEY: string; PAYOS_CHECKSUM_KEY: string; PAYOS_WEBHOOK_URL: string } {
  return {
    PAYOS_CLIENT_ID: env.PAYOS_CLIENT_ID || settings?.client_id || '',
    PAYOS_API_KEY: env.PAYOS_API_KEY || settings?.api_key || '',
    PAYOS_CHECKSUM_KEY: env.PAYOS_CHECKSUM_KEY || settings?.checksum_key || '',
    PAYOS_WEBHOOK_URL: (env.PAYOS_WEBHOOK_URL || settings?.webhook_url || '').trim(),
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

// ── Manual payment settings ──────────────────────────────────

export async function getManualPaymentSettings(db: D1Database): Promise<ManualPaymentSettings | null> {
  return db.prepare('SELECT * FROM "manual_payment_settings" WHERE "id" = 1').first<ManualPaymentSettings>();
}

export async function upsertManualPaymentSettings(
  db: D1Database,
  input: Partial<Omit<ManualPaymentSettings, 'id' | 'updated_at'>>,
): Promise<void> {
  const ts = now();
  await db
    .prepare(
      `INSERT INTO "manual_payment_settings" ("id","is_active","bank_bin","account_number","account_name","zalo_url","updated_at")
       VALUES (1,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "is_active"=excluded."is_active",
         "bank_bin"=excluded."bank_bin",
         "account_number"=excluded."account_number",
         "account_name"=excluded."account_name",
         "zalo_url"=excluded."zalo_url",
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      input.is_active ?? 1,
      input.bank_bin ?? '',
      input.account_number ?? '',
      input.account_name ?? '',
      input.zalo_url ?? '',
      ts,
    )
    .run();
}
