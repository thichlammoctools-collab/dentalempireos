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
  credits: number;
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
  credits?: number;
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
  selected_scanner_id?: string | null;
  order_kind?: 'purchase' | 'upgrade';
  upgrade_from_product_id?: string | null;
  upgrade_from_access_id?: string | null;
  upgrade_original_amount?: number | null;
  upgrade_credit_amount?: number | null;
  upgrade_credit_days?: number | null;
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
  selected_scanner_id?: string | null;
  credits: number;
  scans_used: number;
}

/** Breakdown persisted on an upgrade order so payments stay auditable. */
export interface UpgradeOrderDetails {
  from_product_id: string;
  from_access_id: string;
  original_amount: number;
  credit_amount: number;
  credit_days: number;
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
       ORDER BY CASE WHEN "name" = 'Đọc full sách 1 năm' THEN 0 ELSE 1 END,
                "created_at" DESC
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
      `INSERT INTO "product" ("id","name","type","price","credits","description","duration_days","reference_id","app_id","is_active","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "type"=excluded."type",
         "price"=excluded."price",
         "credits"=excluded."credits",
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
      input.credits ?? 20,
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
    selected_scanner_id?: string | null;
    upgrade?: UpgradeOrderDetails | null;
  },
): Promise<Order> {
  const ts = now();
  await db.batch([
    db.prepare(
       `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at","selected_scanner_id","order_kind","upgrade_from_product_id","upgrade_from_access_id","upgrade_original_amount","upgrade_credit_amount","upgrade_credit_days")
        VALUES (?,?,?,?,?,'pending',NULL,NULL,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      input.id,
      input.user_id,
      input.product_id,
      input.order_code,
      input.amount,
      ts,
      input.selected_scanner_id ?? null,
      input.upgrade ? 'upgrade' : 'purchase',
      input.upgrade?.from_product_id ?? null,
      input.upgrade?.from_access_id ?? null,
      input.upgrade?.original_amount ?? null,
      input.upgrade?.credit_amount ?? null,
      input.upgrade?.credit_days ?? null,
    ),
    db.prepare(
      `INSERT INTO "payment_order_code" ("order_code","order_type","order_id","created_at")
       VALUES (?,'product',?,?)`,
    ).bind(input.order_code, input.id, ts),
  ]);
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
  selectedScannerId: string | null = null,
  orderKind: 'purchase' | 'upgrade' = 'purchase',
): Promise<Order | null> {
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  return db
    .prepare(
      `SELECT * FROM "order"
       WHERE "user_id" = ? AND "product_id" = ? AND "status" = 'pending'
          AND IFNULL("selected_scanner_id", '') = IFNULL(?, '')
          AND "order_kind" = ?
          AND "payment_link_id" IS NOT NULL AND "created_at" >= ?
       ORDER BY "created_at" DESC
       LIMIT 1`,
    )
    .bind(userId, productId, selectedScannerId, orderKind, cutoff)
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
    selected_scanner_id?: string | null;
    credits?: number;
  },
): Promise<Access> {
  const credits = input.credits ?? 20;
  // A payment can be delivered more than once. Its original grant is the
  // authoritative result, so retries must not create another renewal.
  const orderAccess = await db
    .prepare(
      `SELECT * FROM "access"
       WHERE "order_id" = ?
         AND IFNULL("selected_scanner_id", '') = IFNULL(?, '')
       LIMIT 1`,
    )
    .bind(input.order_id, input.selected_scanner_id ?? null)
    .first<Access>();
  if (orderAccess) return orderAccess;

  const ts = now();
  const id = uid();

  const existing = await db
    .prepare(
       `SELECT "expires_at", "credits", "scans_used" FROM "access"
        WHERE "user_id" = ? AND "product_id" = ? AND IFNULL("selected_scanner_id", '') = IFNULL(?, '') AND "is_active" = 1
       LIMIT 1`,
    )
    .bind(input.user_id, input.product_id, input.selected_scanner_id ?? null)
    .first<{ expires_at: string | null; credits: number; scans_used: number }>();

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

  // A repeat purchase must preserve unused attempts and add the new allocation.
  // Resetting scans_used makes the resulting grant self-contained and works for
  // both standalone Scanner products and package-derived Scanner grants.
  const remainingCredits = Math.max(0, (existing?.credits ?? 0) - (existing?.scans_used ?? 0));
  const grantedCredits = remainingCredits + credits;

  // Deactivate any existing active access for this user+product first.
  // This prevents race conditions (e.g., PayOS webhook fires twice for the same payment).
  // The unique partial index idx_access_user_product_active also guards against duplicates.
  await db
    .prepare(
       `UPDATE "access" SET "is_active" = 0
        WHERE "user_id" = ? AND "product_id" = ? AND IFNULL("selected_scanner_id", '') = IFNULL(?, '') AND "is_active" = 1`,
    )
    .bind(input.user_id, input.product_id, input.selected_scanner_id ?? null)
    .run();

  await db
    .prepare(
       `INSERT INTO "access" ("id","user_id","product_id","order_id","granted_at","expires_at","is_active","selected_scanner_id","credits","scans_used")
        VALUES (?,?,?,?,?,?,1,?,?,0)`,
    )
    .bind(id, input.user_id, input.product_id, input.order_id, ts, expiresAt, input.selected_scanner_id ?? null, grantedCredits)
    .run();

  return db.prepare('SELECT * FROM "access" WHERE "id" = ?').bind(id).first<Access>() as Promise<Access>;
}

/** Grant product access using its duration without shortening an active renewal. */
export async function grantProductAccess(
  db: D1Database,
  input: { user_id: string; product_id: string; order_id: string; selected_scanner_id?: string | null },
): Promise<Access> {
  const product = await getProduct(db, input.product_id);
  if (!product) throw new Error(`Product not found: ${input.product_id}`);

  const entitlements = await db
    .prepare('SELECT "content_type", "content_id" FROM "product_entitlement" WHERE "product_id" = ?')
    .bind(product.id)
    .all<{ content_type: string; content_id: string }>();
  const grantsAllScanners = (entitlements.results ?? []).some(
    (entitlement) => entitlement.content_type === 'scanner' && entitlement.content_id === '*',
  );

  let expiresAt: string | null = null;
  if (product.duration_days && product.duration_days > 0) {
    const existing = await db
      .prepare(
       `SELECT "expires_at" FROM "access"
          WHERE "user_id" = ? AND "product_id" = ? AND IFNULL("selected_scanner_id", '') = IFNULL(?, '') AND "is_active" = 1
          LIMIT 1`,
    )
      .bind(input.user_id, input.product_id, input.selected_scanner_id ?? null)
      .first<{ expires_at: string | null }>();

    if (existing?.expires_at !== null) {
      const currentExpiry = existing?.expires_at ? new Date(existing.expires_at).getTime() : 0;
      const base = Math.max(Date.now(), currentExpiry);
      expiresAt = new Date(base + product.duration_days * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  if (grantsAllScanners) {
    const scannerAccess = await grantScannerPackageAccess(db, product, {
      ...input,
      expires_at: expiresAt,
    });

    // Hybrid packages also need one base access row for time-limited content
    // and Chat. Scanner grants use selected_scanner_id and remain credit-based.
    if (expiresAt) {
      await grantAccess(db, {
        ...input,
        expires_at: expiresAt,
        credits: 0,
      });
    }
    return scannerAccess;
  }

  return grantAccess(db, { ...input, expires_at: expiresAt, credits: product.credits });
}

/**
 * A scanner:* package is discounted bulk purchase, not a pooled credit wallet.
 * Grant the package's credits independently to every Scanner that has an active
 * dedicated product, giving buyers the same per-Scanner benefit as buying each
 * Scanner separately.
 */
async function grantScannerPackageAccess(
  db: D1Database,
  product: Product,
  input: { user_id: string; product_id: string; order_id: string; selected_scanner_id?: string | null; expires_at: string | null },
): Promise<Access> {
  const { results } = await db
    .prepare(
      `SELECT DISTINCT pe."content_id" AS "scanner_id"
       FROM "product_entitlement" pe
       INNER JOIN "product" p ON p."id" = pe."product_id"
       INNER JOIN "survey_definition" d ON d."id" = pe."content_id" AND d."status" = 'active'
       WHERE p."is_active" = 1
         AND pe."content_type" = 'scanner'
         AND pe."content_id" <> '*'
         AND p."id" <> ?
       ORDER BY pe."content_id"`,
    )
    .bind(product.id)
    .all<{ scanner_id: string }>();

  if (!results?.length) {
    throw new Error(`Scanner package ${product.id} has no active dedicated Scanner products`);
  }

  const grants = await Promise.all(results.map(({ scanner_id }) => grantAccess(db, {
    user_id: input.user_id,
    product_id: input.product_id,
    order_id: input.order_id,
    selected_scanner_id: scanner_id,
    expires_at: null,
    credits: product.credits,
  })));
  return grants[0];
}

/**
 * Claim a pending order for fulfillment. Only the caller that changes its
 * status may grant access, preventing concurrent webhook/return-page handlers
 * from both changing package access.
 */
export async function markOrderPaidIfPending(
  db: D1Database,
  orderId: string,
): Promise<boolean> {
  const result = await db
    .prepare(`UPDATE "order" SET "status" = 'paid', "paid_at" = ? WHERE "id" = ? AND "status" = 'pending'`)
    .bind(now(), orderId)
    .run();
  return result.meta.changes === 1;
}

/**
 * Grant everything a paid order entitles, including upgrade conversion.
 *
 * The new package is always granted before the credited one is deactivated, so
 * a failure part-way through can never leave a customer without access. Repeat
 * webhook deliveries are absorbed by grantAccess and the unique upgrade index.
 */
export async function fulfillPaidOrder(db: D1Database, order: Order): Promise<Access> {
  const isUpgrade = order.order_kind === 'upgrade'
    && Boolean(order.upgrade_from_product_id)
    && Boolean(order.upgrade_from_access_id);

  // An upgrade starts a fresh term because the credited days were already paid
  // back as a discount, so it must not extend an existing expiry.
  const access = isUpgrade
    ? await grantUpgradedAccess(db, order)
    : await grantProductAccess(db, {
      user_id: order.user_id,
      product_id: order.product_id,
      order_id: order.id,
      selected_scanner_id: order.selected_scanner_id,
    });

  if (!isUpgrade) return access;

  await db
    .prepare(
      `UPDATE "access" SET "is_active" = 0
       WHERE "id" = ? AND "user_id" = ? AND "product_id" = ? AND "is_active" = 1`,
    )
    .bind(order.upgrade_from_access_id, order.user_id, order.upgrade_from_product_id)
    .run();

  await db
    .prepare(
      `INSERT OR IGNORE INTO "upgrade"
       ("id","user_id","order_id","from_product_id","to_product_id","from_access_id","to_access_id","credit_days","credit_amount","created_at")
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      uid(),
      order.user_id,
      order.id,
      order.upgrade_from_product_id,
      order.product_id,
      order.upgrade_from_access_id,
      access.id,
      order.upgrade_credit_days ?? 0,
      order.upgrade_credit_amount ?? 0,
      now(),
    )
    .run();

  return access;
}

/** Grant an upgrade target with a term starting at payment time. */
async function grantUpgradedAccess(db: D1Database, order: Order): Promise<Access> {
  const product = await getProduct(db, order.product_id);
  if (!product) throw new Error(`Product not found: ${order.product_id}`);

  const expiresAt = product.duration_days && product.duration_days > 0
    ? new Date(Date.now() + product.duration_days * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const existing = await db
    .prepare('SELECT * FROM "access" WHERE "order_id" = ? LIMIT 1')
    .bind(order.id)
    .first<Access>();
  if (existing) return existing;

  const ts = now();
  const id = uid();

  await db
    .prepare(
      `UPDATE "access" SET "is_active" = 0
       WHERE "user_id" = ? AND "product_id" = ? AND "selected_scanner_id" IS NULL
         AND "is_active" = 1 AND "order_id" <> ?`,
    )
    .bind(order.user_id, order.product_id, order.id)
    .run();

  await db
    .prepare(
      `INSERT INTO "access" ("id","user_id","product_id","order_id","granted_at","expires_at","is_active","selected_scanner_id","credits","scans_used")
       VALUES (?,?,?,?,?,?,1,NULL,?,0)`,
    )
    .bind(id, order.user_id, order.product_id, order.id, ts, expiresAt, product.credits)
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
  scanner_links: Array<{ name: string; href: string }>;
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

/** List user orders with their selected Scanner, or legacy product Scanner details. */
export async function listUserOrdersWithScanners(
  db: D1Database,
  userId: string,
): Promise<OrderWithScanners[]> {
  const orders = await listUserOrders(db, userId);
  if (orders.length === 0) return orders as OrderWithScanners[];

  const selectedScannerIds = [...new Set(
    orders.flatMap((order) => order.selected_scanner_id ? [order.selected_scanner_id] : []),
  )];
  const selectedScanners = new Map<string, { name: string; href: string }>();
  if (selectedScannerIds.length > 0) {
    const placeholders = selectedScannerIds.map(() => '?').join(',');
    const { results } = await db
      .prepare(`SELECT "id", "title_vi", "slug" FROM "survey_definition" WHERE "id" IN (${placeholders})`)
      .bind(...selectedScannerIds)
      .all<{ id: string; title_vi: string; slug: string }>();
    for (const scanner of results) {
      selectedScanners.set(scanner.id, { name: scanner.title_vi, href: `/scanner/${scanner.slug}` });
    }
  }

  // Orders created before Scanner selections were tracked keep the previous
  // product-level display because their original choice cannot be recovered.
  const legacyProductIds = [...new Set(
    orders.flatMap((order) => order.selected_scanner_id ? [] : [order.product_id]),
  )];
  const scannerRows: Array<{ product_id: string; scanner_name: string; scanner_href: string }> = [];
  if (legacyProductIds.length > 0) {
    const placeholders = legacyProductIds.map(() => '?').join(',');
    const { results } = await db
      .prepare(
        `SELECT pe."product_id",
                CASE WHEN pe."content_id" = '*' THEN 'Toàn bộ Scanner' ELSE d."title_vi" END AS "scanner_name",
                CASE WHEN pe."content_id" = '*' THEN '/scanner' ELSE '/scanner/' || d."slug" END AS "scanner_href"
         FROM "product_entitlement" pe
         LEFT JOIN "survey_definition" d ON pe."content_id" = d."id"
         WHERE pe."content_type" = 'scanner' AND pe."product_id" IN (${placeholders})
         ORDER BY d."title_vi" ASC`,
      )
      .bind(...legacyProductIds)
      .all<{ product_id: string; scanner_name: string; scanner_href: string }>();
    scannerRows.push(...results.filter((row) => Boolean(row.scanner_name)));
  }

  const byProduct = new Map<string, Array<{ name: string; href: string }>>();
  for (const row of scannerRows) {
    const list = byProduct.get(row.product_id) ?? [];
    if (!list.some((item) => item.href === row.scanner_href)) {
      list.push({ name: row.scanner_name, href: row.scanner_href });
    }
    byProduct.set(row.product_id, list);
  }

  return orders.map((order) => {
    const scannerLinks = order.selected_scanner_id
      ? [selectedScanners.get(order.selected_scanner_id) ?? { name: 'Scanner đã chọn', href: '/scanner' }]
      : byProduct.get(order.product_id) ?? [];

    return {
      ...order,
      scanner_names: scannerLinks.map((scanner) => scanner.name),
      scanner_links: scannerLinks,
    };
  });
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
  input: {
    id: string;
    user_id: string;
    product_id: string;
    order_code: number;
    amount: number;
    selected_scanner_id?: string | null;
    upgrade?: UpgradeOrderDetails | null;
  },
): Promise<Order> {
  const ts = now();
  await db
    .prepare(
       `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at","selected_scanner_id","order_kind","upgrade_from_product_id","upgrade_from_access_id","upgrade_original_amount","upgrade_credit_amount","upgrade_credit_days")
        VALUES (?,?,?,?,?,'pending',NULL,NULL,?,?,?,?,?,?,?,?)`,
    )
    .bind(
      input.id,
      input.user_id,
      input.product_id,
      input.order_code,
      input.amount,
      ts,
      input.selected_scanner_id ?? null,
      input.upgrade ? 'upgrade' : 'purchase',
      input.upgrade?.from_product_id ?? null,
      input.upgrade?.from_access_id ?? null,
      input.upgrade?.original_amount ?? null,
      input.upgrade?.credit_amount ?? null,
      input.upgrade?.credit_days ?? null,
    )
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
