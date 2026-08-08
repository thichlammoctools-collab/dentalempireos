export const ACCESS_TIERS = ['free', 'premium'] as const;
export type AccessTier = (typeof ACCESS_TIERS)[number];

export const ENTITLEMENT_CONTENT_TYPES = [
  'book',
  'ai_app',
  'scanner',
  'course',
  'blog',
  'resource',
  'service',
] as const;
export type EntitlementContentType = (typeof ENTITLEMENT_CONTENT_TYPES)[number];

export interface ProductEntitlement {
  product_id: string;
  content_type: EntitlementContentType;
  content_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductEntitlementInput {
  content_type: EntitlementContentType;
  content_id: string;
}

export interface ActiveUserEntitlement extends ProductEntitlement {
  access_id: string;
  user_id: string;
  granted_at: string;
  expires_at: string | null;
}

function now(): string {
  return new Date().toISOString();
}

export async function listProductEntitlements(
  db: D1Database,
  productId: string,
): Promise<ProductEntitlement[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM "product_entitlement"
       WHERE "product_id" = ?
       ORDER BY "content_type", "content_id"`,
    )
    .bind(productId)
    .all<ProductEntitlement>();
  return results;
}

export async function getProductEntitlement(
  db: D1Database,
  productId: string,
  contentType: EntitlementContentType,
  contentId: string,
): Promise<ProductEntitlement | null> {
  return db
    .prepare(
      `SELECT * FROM "product_entitlement"
       WHERE "product_id" = ? AND "content_type" = ? AND "content_id" = ?`,
    )
    .bind(productId, contentType, contentId)
    .first<ProductEntitlement>();
}

export async function upsertProductEntitlement(
  db: D1Database,
  productId: string,
  entitlement: ProductEntitlementInput,
): Promise<ProductEntitlement> {
  const timestamp = now();
  await db
    .prepare(
      `INSERT INTO "product_entitlement" ("product_id", "content_type", "content_id", "created_at", "updated_at")
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT("product_id", "content_type", "content_id") DO UPDATE SET
         "updated_at" = excluded."updated_at"`,
    )
    .bind(productId, entitlement.content_type, entitlement.content_id, timestamp, timestamp)
    .run();

  return (await getProductEntitlement(
    db,
    productId,
    entitlement.content_type,
    entitlement.content_id,
  ))!;
}

export async function deleteProductEntitlement(
  db: D1Database,
  productId: string,
  contentType: EntitlementContentType,
  contentId: string,
): Promise<void> {
  await db
    .prepare(
      `DELETE FROM "product_entitlement"
       WHERE "product_id" = ? AND "content_type" = ? AND "content_id" = ?`,
    )
    .bind(productId, contentType, contentId)
    .run();
}

export async function replaceProductEntitlements(
  db: D1Database,
  productId: string,
  entitlements: ProductEntitlementInput[],
): Promise<ProductEntitlement[]> {
  const timestamp = now();
  const statements = [
    db.prepare('DELETE FROM "product_entitlement" WHERE "product_id" = ?').bind(productId),
    ...entitlements.map((entitlement) =>
      db
        .prepare(
          `INSERT INTO "product_entitlement" ("product_id", "content_type", "content_id", "created_at", "updated_at")
           VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(productId, entitlement.content_type, entitlement.content_id, timestamp, timestamp),
    ),
  ];
  await db.batch(statements);
  return listProductEntitlements(db, productId);
}

export async function listActiveUserEntitlements(
  db: D1Database,
  userId: string,
): Promise<ActiveUserEntitlement[]> {
  const { results } = await db
    .prepare(
      `SELECT pe.*, a."id" AS "access_id", a."user_id", a."granted_at", a."expires_at"
       FROM "access" a
       INNER JOIN "product_entitlement" pe ON pe."product_id" = a."product_id"
       WHERE a."user_id" = ?
          AND a."is_active" = 1
          AND (a."expires_at" IS NULL OR a."expires_at" > ?)
       ORDER BY a."granted_at" DESC`,
    )
    .bind(userId, now())
    .all<ActiveUserEntitlement>();
  return results;
}

export async function hasActiveEntitlementForContent(
  db: D1Database,
  userId: string,
  contentType: EntitlementContentType,
  contentId: string,
): Promise<boolean> {
  const entitlement = await db
    .prepare(
      `SELECT 1
       FROM "access" a
       INNER JOIN "product_entitlement" pe ON pe."product_id" = a."product_id"
       WHERE a."user_id" = ?
          AND a."is_active" = 1
          AND (a."expires_at" IS NULL OR a."expires_at" > ?)
         AND pe."content_type" = ?
         AND pe."content_id" IN (?, '*')
       LIMIT 1`,
    )
    .bind(userId, now(), contentType, contentId)
    .first();
  return entitlement !== null;
}

/**
 * Scanner selections are stored on access records so one selectable product can
 * grant only the Scanner a customer chose, rather than every configured option.
 * Uses credit-based access: credits > scans_used.
 */
export async function hasActiveScannerEntitlement(
  db: D1Database,
  userId: string,
  scannerId: string,
): Promise<boolean> {
  const entitlement = await db
    .prepare(
      `SELECT 1
       FROM "access" a
       LEFT JOIN "product_entitlement" pe
         ON pe."product_id" = a."product_id"
        AND pe."content_type" = 'scanner'
       WHERE a."user_id" = ?
         AND a."is_active" = 1
         AND a."credits" > a."scans_used"
         AND (
           a."selected_scanner_id" = ?
           OR (
             a."selected_scanner_id" IS NULL
             AND pe."content_id" IN (?, '*')
           )
         )
       LIMIT 1`,
    )
    .bind(userId, scannerId, scannerId)
    .first();
  return entitlement !== null;
}

/** Trừ 1 credit khi user scan xong. Returns true nếu trừ thành công. */
export async function deductScannerCredit(
  db: D1Database,
  userId: string,
  scannerId: string,
): Promise<boolean> {
  // Ưu tiên trừ credit từ per-scanner access trước
  const perScanner = await db
    .prepare(
      `UPDATE "access"
       SET "scans_used" = "scans_used" + 1
       WHERE "id" = (
         SELECT a."id" FROM "access" a
         LEFT JOIN "product_entitlement" pe
           ON pe."product_id" = a."product_id"
          AND pe."content_type" = 'scanner'
         WHERE a."user_id" = ?
           AND a."is_active" = 1
           AND a."credits" > a."scans_used"
           AND (
             a."selected_scanner_id" = ?
             OR (
               a."selected_scanner_id" IS NULL
               AND pe."content_id" IN (?, '*')
             )
           )
         LIMIT 1
       )`,
    )
    .bind(userId, scannerId, scannerId)
    .run();
  if (perScanner.meta.changes > 0) return true;

  // Fallback: trừ từ pooled access (content_id = '*')
  const pooled = await db
    .prepare(
      `UPDATE "access"
       SET "scans_used" = "scans_used" + 1
       WHERE "id" = (
         SELECT a."id" FROM "access" a
         INNER JOIN "product_entitlement" pe
           ON pe."product_id" = a."product_id"
          AND pe."content_type" = 'scanner'
          AND pe."content_id" = '*'
         WHERE a."user_id" = ?
           AND a."is_active" = 1
           AND a."credits" > a."scans_used"
         LIMIT 1
       )`,
    )
    .bind(userId)
    .run();
  return pooled.meta.changes > 0;
}

/** Lấy số credits còn lại của user cho 1 scanner cụ thể. */
export async function getCreditBalance(
  db: D1Database,
  userId: string,
  scannerId: string,
): Promise<{ remaining: number; total: number }> {
  // Ưu tiên per-scanner credits
  const perScanner = await db
    .prepare(
      `SELECT a."credits" AS total, (a."credits" - a."scans_used") AS remaining
       FROM "access" a
       LEFT JOIN "product_entitlement" pe
         ON pe."product_id" = a."product_id"
        AND pe."content_type" = 'scanner'
       WHERE a."user_id" = ?
         AND a."is_active" = 1
         AND a."credits" > a."scans_used"
         AND (
           a."selected_scanner_id" = ?
           OR (
             a."selected_scanner_id" IS NULL
             AND pe."content_id" IN (?, '*')
           )
         )
       LIMIT 1`,
    )
    .bind(userId, scannerId, scannerId)
    .first<{ total: number; remaining: number }>();
  if (perScanner) return perScanner;

  // Fallback: pooled credits
  const pooled = await db
    .prepare(
      `SELECT a."credits" AS total, (a."credits" - a."scans_used") AS remaining
       FROM "access" a
       INNER JOIN "product_entitlement" pe
         ON pe."product_id" = a."product_id"
        AND pe."content_type" = 'scanner'
        AND pe."content_id" = '*'
       WHERE a."user_id" = ?
         AND a."is_active" = 1
         AND a."credits" > a."scans_used"
       LIMIT 1`,
    )
    .bind(userId)
    .first<{ total: number; remaining: number }>();
  return pooled ?? { remaining: 0, total: 0 };
}
