// Pricing rules for upgrading from a smaller package to a larger one.
//
// An upgrade converts the unused time of the current package into a credit
// against the new package price. The new package then starts a fresh term from
// the payment date, so the credited days are never granted twice.

import { listProductEntitlements, type ProductEntitlementInput } from './entitlement-db';
import { getProduct, type Access, type Product } from './payos-db';

/** PayOS rejects very small charges, so an upgrade never bills below this. */
export const MIN_UPGRADE_AMOUNT = 2_000;

/** Credits are rounded down to whole thousands to keep bank amounts readable. */
const CREDIT_ROUNDING = 1_000;

const DAY_MS = 24 * 60 * 60 * 1000;

export type UpgradeIneligibleReason =
  | 'no_active_package'
  | 'already_owned'
  | 'upgrade_pending'
  | 'product_unavailable'
  | 'product_not_upgradable'
  | 'no_upgrade_path';

export const UPGRADE_INELIGIBLE_MESSAGES: Record<UpgradeIneligibleReason, string> = {
  no_active_package: 'Bạn chưa có gói nào đang hiệu lực để nâng cấp.',
  already_owned: 'Bạn đang sử dụng gói này.',
  upgrade_pending: 'Bạn đang có một đơn nâng cấp chờ thanh toán cho gói này.',
  product_unavailable: 'Sản phẩm không tồn tại hoặc đã ngừng bán.',
  product_not_upgradable: 'Gói này không hỗ trợ nâng cấp.',
  no_upgrade_path: 'Gói hiện tại của bạn không thể nâng cấp lên gói này.',
};

export interface UpgradeQuote {
  eligible: true;
  fromProduct: Product;
  toProduct: Product;
  fromAccessId: string;
  /** Whole days of the current package still unused, rounded up. */
  remainingDays: number;
  creditAmount: number;
  originalAmount: number;
  finalAmount: number;
  newDurationDays: number;
  newExpiresAt: string;
}

export interface UpgradeRejection {
  eligible: false;
  reason: UpgradeIneligibleReason;
  message: string;
}

export type UpgradeQuoteResult = UpgradeQuote | UpgradeRejection;

function reject(reason: UpgradeIneligibleReason): UpgradeRejection {
  return { eligible: false, reason, message: UPGRADE_INELIGIBLE_MESSAGES[reason] };
}

/** Unused days of a term, rounded up so a partial day still earns credit. */
export function remainingDays(expiresAt: string, from: number = Date.now()): number {
  const remainingMs = new Date(expiresAt).getTime() - from;
  if (!Number.isFinite(remainingMs) || remainingMs <= 0) return 0;
  return Math.ceil(remainingMs / DAY_MS);
}

/**
 * Value of the unused days at the daily rate the customer originally paid.
 * Credit never exceeds what was paid for the package.
 */
export function calculateCredit(
  price: number,
  durationDays: number,
  unusedDays: number,
): number {
  if (price <= 0 || durationDays <= 0 || unusedDays <= 0) return 0;
  const cappedDays = Math.min(unusedDays, durationDays);
  const rawCredit = (price / durationDays) * cappedDays;
  const rounded = Math.floor(rawCredit / CREDIT_ROUNDING) * CREDIT_ROUNDING;
  return Math.max(0, Math.min(rounded, price));
}

/** Amount actually charged, clamped so PayOS always receives a payable value. */
export function calculateUpgradeAmount(newPrice: number, credit: number): number {
  return Math.max(newPrice - credit, MIN_UPGRADE_AMOUNT);
}

function entitlementKey(entitlement: ProductEntitlementInput): string {
  return `${entitlement.content_type}:${entitlement.content_id}`;
}

/**
 * An upgrade is only offered when the new package keeps every entitlement of
 * the current one and adds at least one more, so nothing is silently lost.
 */
export function coversEntitlements(
  from: readonly ProductEntitlementInput[],
  to: readonly ProductEntitlementInput[],
): boolean {
  if (from.length === 0 || to.length === 0) return false;
  const target = new Set(to.map(entitlementKey));
  const keepsAll = from.every((entitlement) => target.has(entitlementKey(entitlement)));
  return keepsAll && to.length > from.length;
}

interface UpgradeCandidate {
  access: Access;
  product: Product;
  hasPendingUpgrade: boolean;
}

/**
 * Active grants that can fund an upgrade: time-limited, still valid, and not
 * tied to a specific Scanner selection, whose value is therefore product-wide.
 */
async function listUpgradeCandidates(
  db: D1Database,
  userId: string,
): Promise<UpgradeCandidate[]> {
  const { results } = await db
    .prepare(
      `SELECT a."id" AS "access_id", a."expires_at", p.*,
              EXISTS (
                SELECT 1 FROM "order" o
                WHERE o."user_id" = a."user_id"
                  AND o."upgrade_from_access_id" = a."id"
                  AND o."status" = 'pending'
              ) AS "has_pending_upgrade"
       FROM "access" a
       INNER JOIN "product" p ON p."id" = a."product_id"
       WHERE a."user_id" = ?
         AND a."is_active" = 1
         AND a."selected_scanner_id" IS NULL
         AND a."expires_at" IS NOT NULL
         AND a."expires_at" > ?
         AND p."duration_days" > 0
         AND p."price" > 0
       ORDER BY a."granted_at" DESC`,
    )
    .bind(userId, new Date().toISOString())
    .all<Product & { access_id: string; expires_at: string; has_pending_upgrade: number }>();

  return results.map((row) => {
    const { access_id, expires_at, has_pending_upgrade, ...product } = row;
    return {
      access: { id: access_id, expires_at } as Access,
      product: product as Product,
      hasPendingUpgrade: has_pending_upgrade === 1,
    };
  });
}

/**
 * Build the upgrade offer for a target product, choosing the candidate package
 * that yields the largest credit for the customer.
 */
export async function getUpgradeQuote(
  db: D1Database,
  userId: string,
  toProductId: string,
  fromProductId?: string | null,
): Promise<UpgradeQuoteResult> {
  const toProduct = await getProduct(db, toProductId);
  if (!toProduct || !toProduct.is_active) return reject('product_unavailable');
  if (!toProduct.duration_days || toProduct.duration_days <= 0) {
    return reject('product_not_upgradable');
  }

  const candidates = await listUpgradeCandidates(db, userId);
  if (candidates.length === 0) return reject('no_active_package');
  if (candidates.some((candidate) => candidate.product.id === toProductId)) {
    return reject('already_owned');
  }

  const scoped = fromProductId
    ? candidates.filter((candidate) => candidate.product.id === fromProductId)
    : candidates;
  if (scoped.length === 0) return reject('no_upgrade_path');

  const toEntitlements = await listProductEntitlements(db, toProduct.id);
  const now = Date.now();

  let best: { candidate: UpgradeCandidate; credit: number; days: number } | null = null;
  for (const candidate of scoped) {
    if (candidate.hasPendingUpgrade) continue;
    const fromEntitlements = await listProductEntitlements(db, candidate.product.id);
    if (!coversEntitlements(fromEntitlements, toEntitlements)) continue;

    const days = remainingDays(candidate.access.expires_at as string, now);
    if (days <= 0) continue;

    const credit = calculateCredit(
      candidate.product.price,
      candidate.product.duration_days as number,
      days,
    );
    if (!best || credit > best.credit) best = { candidate, credit, days };
  }

  if (!best) {
    return scoped.some((candidate) => candidate.hasPendingUpgrade)
      ? reject('upgrade_pending')
      : reject('no_upgrade_path');
  }

  return {
    eligible: true,
    fromProduct: best.candidate.product,
    toProduct,
    fromAccessId: best.candidate.access.id,
    remainingDays: best.days,
    creditAmount: best.credit,
    originalAmount: toProduct.price,
    finalAmount: calculateUpgradeAmount(toProduct.price, best.credit),
    newDurationDays: toProduct.duration_days,
    newExpiresAt: new Date(now + toProduct.duration_days * DAY_MS).toISOString(),
  };
}
