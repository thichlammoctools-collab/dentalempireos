// Access checking utilities — gate premium content behind PayOS purchases.
// Supports both single and batch checks. Can be extended with KV caching later.

import { hasAccess as dbHasAccess } from './payos-db';

/**
 * Check if a user has active access to a specific product.
 * Returns true if there's an active, non-expired access record.
 */
export async function checkUserAccess(
  db: D1Database,
  userId: string,
  productId: string,
): Promise<boolean> {
  return dbHasAccess(db, userId, productId);
}

/**
 * Batch check access for multiple products at once.
 * Returns a Map of productId → boolean.
 * Useful for course pages that need to check many sections simultaneously.
 */
export async function checkUserAccessBatch(
  db: D1Database,
  userId: string,
  productIds: string[],
): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>();
  if (productIds.length === 0) return result;

  const now = new Date().toISOString();
  const placeholders = productIds.map(() => '?').join(',');

  const { results } = await db
    .prepare(
      `SELECT a."product_id", a."expires_at" FROM "access" a
        WHERE a."user_id" = ? AND a."product_id" IN (${placeholders}) AND a."is_active" = 1
          AND (a."expires_at" IS NULL OR a."expires_at" > ?)`,
    )
    .bind(userId, ...productIds, now)
    .all<{ product_id: string; expires_at: string | null }>();

  const activeSet = new Set(results.map((r) => r.product_id));

  for (const id of productIds) {
    result.set(id, activeSet.has(id));
  }
  return result;
}

/**
 * Get all active product IDs a user has access to.
 * Useful for checking which resources/courses are unlocked for a user.
 */
export async function getUserUnlockedProductIds(
  db: D1Database,
  userId: string,
): Promise<string[]> {
  const now = new Date().toISOString();
  const { results } = await db
    .prepare(
      `SELECT DISTINCT a."product_id" FROM "access" a
       WHERE a."user_id" = ? AND a."is_active" = 1
          AND (a."expires_at" IS NULL OR a."expires_at" > ?)`,
    )
    .bind(userId, now)
    .all<{ product_id: string }>();
  return results.map((r) => r.product_id);
}
