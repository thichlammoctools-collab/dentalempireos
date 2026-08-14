// Immutable Credits wallet/accounting primitives for D1.
// Route handlers must call these functions instead of mutating account balances directly.

export type CreditLedgerKind =
  | 'welcome_grant'
  | 'purchase_grant'
  | 'challenge_grant'
  | 'admin_adjustment'
  | 'reservation'
  | 'settlement'
  | 'release'
  | 'refund'
  | 'reversal';

export interface CreditAccount {
  id: string;
  user_id: string;
  available_credits: number;
  reserved_credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditLedgerEntry {
  id: string;
  account_id: string;
  kind: CreditLedgerKind;
  amount: number;
  source_type: string;
  source_id: string;
  idempotency_key: string;
  actor_user_id: string | null;
  reason: string | null;
  metadata_json: string;
  created_at: string;
}

export interface CreditHistoryEntry extends CreditLedgerEntry {
  service_label: string | null;
}

export interface CreditReservation {
  id: string;
  account_id: string;
  feature_type: string;
  business_object_id: string;
  reserved_credits: number;
  status: 'reserved' | 'settled' | 'released' | 'expired';
  idempotency_key: string;
  expires_at: string | null;
  released_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditConsumption {
  id: string;
  account_id: string;
  reservation_id: string | null;
  feature_type: string;
  business_object_id: string;
  charge_type: string;
  credits: number;
  price_snapshot_json: string;
  quantity_snapshot_json: string;
  created_at: string;
}

export interface CreditBalance {
  available: number;
  reserved: number;
  total: number;
}

export interface CreditPricingRule {
  id: string;
  feature_type: string;
  target_id: string;
  model: string;
  rule_version: number;
  credit_amount: number | null;
  tokens_per_credit: number | null;
  minutes_per_credit: number | null;
  max_tokens: number | null;
  is_active: number;
  effective_from: string;
  effective_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credit_amount: number;
  bonus_credits: number;
  is_active: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreditOrder {
  id: string;
  user_id: string;
  credit_package_id: string | null;
  order_code: number | null;
  amount: number;
  credits_to_grant: number;
  package_snapshot_json: string;
  status: 'pending' | 'processing' | 'paid' | 'cancelled' | 'expired';
  payment_method: 'payos' | 'manual';
  payment_link_id: string | null;
  checkout_url: string | null;
  idempotency_key: string;
  fulfilled_at: string | null;
  created_at: string;
  updated_at: string;
  manual_confirmed_by_user_id?: string | null;
  manual_confirmed_at?: string | null;
}

export class InsufficientCreditsError extends Error {
  constructor() {
    super('Insufficient Credits');
    this.name = 'InsufficientCreditsError';
  }
}

function now(): string {
  return new Date().toISOString();
}

function id(): string {
  return crypto.randomUUID();
}

function json(value: unknown): string {
  return JSON.stringify(value ?? {});
}

function positiveInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer`);
  }
}

function integer(value: number, field: string): void {
  if (!Number.isSafeInteger(value)) throw new Error(`${field} must be an integer`);
}

export async function ensureCreditAccount(db: D1Database, userId: string): Promise<CreditAccount> {
  const timestamp = now();
  const accountId = `credit_${userId}`;
  await db.prepare(
    `INSERT INTO "credit_account" ("id","user_id","available_credits","reserved_credits","created_at","updated_at")
     VALUES (?,?,0,0,?,?)
     ON CONFLICT("user_id") DO NOTHING`,
  ).bind(accountId, userId, timestamp, timestamp).run();

  const account = await db.prepare('SELECT * FROM "credit_account" WHERE "user_id" = ?')
    .bind(userId)
    .first<CreditAccount>();
  if (!account) throw new Error('Unable to create Credit account');
  return account;
}

export async function getCreditBalance(db: D1Database, userId: string): Promise<CreditBalance> {
  const account = await ensureCreditAccount(db, userId);
  return {
    available: account.available_credits,
    reserved: account.reserved_credits,
    total: account.available_credits + account.reserved_credits,
  };
}

export async function listCreditLedger(
  db: D1Database,
  userId: string,
  options: { limit?: number; offset?: number } = {},
): Promise<CreditHistoryEntry[]> {
  const account = await ensureCreditAccount(db, userId);
  const { results } = await db.prepare(
    `SELECT ledger.*,
            CASE WHEN ledger."source_type" = 'scanner' THEN survey."title_vi" ELSE NULL END AS "service_label"
     FROM "credit_ledger_entry" ledger
     LEFT JOIN "scanner_credit_run" scanner_run ON scanner_run."id" = ledger."source_id"
     LEFT JOIN "survey_definition" survey ON survey."id" = scanner_run."survey_id"
     WHERE ledger."account_id" = ?
       AND (
         ledger."kind" != 'reservation'
         OR NOT EXISTS (
           SELECT 1 FROM "credit_ledger_entry" settled
           WHERE settled."account_id" = ledger."account_id"
             AND settled."kind" = 'settlement'
             AND settled."source_type" = ledger."source_type"
             AND settled."source_id" = ledger."source_id"
         )
       )
     ORDER BY ledger."created_at" DESC, ledger."id" DESC
     LIMIT ? OFFSET ?`,
  ).bind(account.id, options.limit ?? 50, options.offset ?? 0).all<CreditHistoryEntry>();
  return results;
}

export async function getActiveCreditPackage(db: D1Database, packageId: string): Promise<CreditPackage | null> {
  return db.prepare(
    'SELECT * FROM "credit_package" WHERE "id" = ? AND "is_active" = 1',
  ).bind(packageId).first<CreditPackage>();
}

export async function getCreditOrder(db: D1Database, orderId: string): Promise<CreditOrder | null> {
  return db.prepare('SELECT * FROM "credit_order" WHERE "id" = ?').bind(orderId).first<CreditOrder>();
}

export async function getCreditOrderByCode(db: D1Database, orderCode: number): Promise<CreditOrder | null> {
  return db.prepare('SELECT * FROM "credit_order" WHERE "order_code" = ?').bind(orderCode).first<CreditOrder>();
}

export const CREDIT_ORDER_TTL_MS: Record<'payos' | 'manual', number> = {
  payos: 15 * 60 * 1000,
  manual: 24 * 60 * 60 * 1000,
};

export async function getRecentPendingCreditOrder(
  db: D1Database,
  userId: string,
  packageId: string,
  paymentMethod: 'payos' | 'manual',
): Promise<CreditOrder | null> {
  const cutoff = new Date(Date.now() - CREDIT_ORDER_TTL_MS[paymentMethod]).toISOString();
  return db.prepare(
    `SELECT * FROM "credit_order"
     WHERE "user_id" = ? AND "credit_package_id" = ? AND "payment_method" = ?
       AND "status" = 'pending' AND "created_at" >= ?
       AND (? = 'manual' OR "payment_link_id" IS NOT NULL)
     ORDER BY "created_at" DESC LIMIT 1`,
  ).bind(userId, packageId, paymentMethod, cutoff, paymentMethod).first<CreditOrder>();
}

export async function expireOldPendingCreditOrders(db: D1Database, userId?: string): Promise<number> {
  const timestamp = now();
  const payosCutoff = new Date(Date.now() - CREDIT_ORDER_TTL_MS.payos).toISOString();
  const manualCutoff = new Date(Date.now() - CREDIT_ORDER_TTL_MS.manual).toISOString();
  const result = await db.prepare(
    `UPDATE "credit_order" SET "status" = 'expired', "updated_at" = ?
     WHERE "status" = 'pending'
       AND (("payment_method" = 'payos' AND "created_at" < ?)
         OR ("payment_method" = 'manual' AND "created_at" < ?))
       ${userId ? 'AND "user_id" = ?' : ''}`,
  ).bind(...(userId ? [timestamp, payosCutoff, manualCutoff, userId] : [timestamp, payosCutoff, manualCutoff])).run();
  return result.meta.changes;
}

export async function listUserCreditOrders(
  db: D1Database,
  userId: string,
  options: { limit?: number } = {},
): Promise<CreditOrder[]> {
  const { results } = await db.prepare(
    `SELECT * FROM "credit_order"
     WHERE "user_id" = ?
     ORDER BY CASE "status" WHEN 'pending' THEN 0 WHEN 'processing' THEN 1 WHEN 'paid' THEN 2 ELSE 3 END, "created_at" DESC
     LIMIT ?`,
  ).bind(userId, options.limit ?? 20).all<CreditOrder>();
  return results;
}

export async function reserveCreditOrder(
  db: D1Database,
  input: {
    userId: string;
    creditPackage: CreditPackage;
    paymentMethod: 'payos' | 'manual';
    orderCode: number | null;
    idempotencyKey: string;
  },
): Promise<CreditOrder> {
  const timestamp = now();
  const orderId = id();
  const creditsToGrant = input.creditPackage.credit_amount + input.creditPackage.bonus_credits;
  positiveInteger(creditsToGrant, 'credits_to_grant');
  const snapshot = {
    id: input.creditPackage.id,
    name: input.creditPackage.name,
    price: input.creditPackage.price,
    creditAmount: input.creditPackage.credit_amount,
    bonusCredits: input.creditPackage.bonus_credits,
    totalCredits: creditsToGrant,
  };
  const statements: D1PreparedStatement[] = [
    db.prepare(
      `INSERT INTO "credit_order"
       ("id","user_id","credit_package_id","order_code","amount","credits_to_grant","package_snapshot_json","status","payment_method","payment_link_id","checkout_url","idempotency_key","fulfilled_at","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,'pending',?,NULL,NULL,?,NULL,?,?)`,
    ).bind(orderId, input.userId, input.creditPackage.id, input.orderCode, input.creditPackage.price,
      creditsToGrant, json(snapshot), input.paymentMethod, input.idempotencyKey, timestamp, timestamp),
  ];
  if (input.paymentMethod === 'payos' && input.orderCode !== null) {
    statements.push(db.prepare(
      `INSERT INTO "payment_order_code" ("order_code","order_type","order_id","created_at")
       VALUES (?,'credit',?,?)`,
    ).bind(input.orderCode, orderId, timestamp));
  }
  await db.batch(statements);
  return (await getCreditOrder(db, orderId))!;
}

export async function attachCreditOrderPaymentLink(
  db: D1Database,
  input: { orderId: string; paymentLinkId: string; checkoutUrl: string },
): Promise<void> {
  const result = await db.prepare(
    `UPDATE "credit_order" SET "payment_link_id" = ?, "checkout_url" = ?, "updated_at" = ?
     WHERE "id" = ? AND "status" = 'pending' AND "payment_link_id" IS NULL`,
  ).bind(input.paymentLinkId, input.checkoutUrl, now(), input.orderId).run();
  if (result.meta.changes !== 1) throw new Error('Unable to attach payment link to Credit order');
}

export async function cancelCreditOrder(
  db: D1Database,
  orderId: string,
): Promise<void> {
  await db.prepare(
    `UPDATE "credit_order" SET "status" = 'cancelled', "updated_at" = ?
     WHERE "id" = ? AND "status" = 'pending'`,
  ).bind(now(), orderId).run();
}

export async function fulfillCreditOrder(
  db: D1Database,
  order: CreditOrder,
  actorUserId?: string | null,
): Promise<{ order: CreditOrder; created: boolean }> {
  if (order.status === 'cancelled' || order.status === 'expired') {
    throw new Error(`Credit order is ${order.status}`);
  }
  const result = await grantCredits(db, {
    userId: order.user_id,
    amount: order.credits_to_grant,
    kind: 'purchase_grant',
    sourceType: 'credit_order',
    sourceId: order.id,
    idempotencyKey: `purchase:credit-order:${order.id}`,
    actorUserId,
    reason: 'Nạp Credits',
    metadata: { orderCode: order.order_code, amount: order.amount, package: JSON.parse(order.package_snapshot_json) },
  });
  const timestamp = now();
  await db.prepare(
    `UPDATE "credit_order"
     SET "status" = 'paid', "fulfilled_at" = COALESCE("fulfilled_at", ?), "updated_at" = ?
     WHERE "id" = ? AND "status" IN ('pending','processing','paid')`,
  ).bind(timestamp, timestamp, order.id).run();
  const fulfilled = (await getCreditOrder(db, order.id))!;
  return { order: fulfilled, created: result.created };
}

export async function grantCredits(
  db: D1Database,
  input: {
    userId: string;
    amount: number;
    kind: Extract<CreditLedgerKind, 'welcome_grant' | 'purchase_grant' | 'challenge_grant' | 'admin_adjustment' | 'refund' | 'reversal'>;
    sourceType: string;
    sourceId: string;
    idempotencyKey: string;
    actorUserId?: string | null;
    reason?: string | null;
    metadata?: unknown;
  },
): Promise<{ account: CreditAccount; entry: CreditLedgerEntry; created: boolean }> {
  positiveInteger(input.amount, 'amount');
  const account = await ensureCreditAccount(db, input.userId);
  const existing = await db.prepare(
    'SELECT * FROM "credit_ledger_entry" WHERE "account_id" = ? AND "idempotency_key" = ?',
  ).bind(account.id, input.idempotencyKey).first<CreditLedgerEntry>();
  if (existing) return { account: await ensureCreditAccount(db, input.userId), entry: existing, created: false };

  const timestamp = now();
  const entry: CreditLedgerEntry = {
    id: id(), account_id: account.id, kind: input.kind, amount: input.amount,
    source_type: input.sourceType, source_id: input.sourceId, idempotency_key: input.idempotencyKey,
    actor_user_id: input.actorUserId ?? null, reason: input.reason ?? null,
    metadata_json: json(input.metadata), created_at: timestamp,
  };

  try {
    await db.batch([
      db.prepare(
        'UPDATE "credit_account" SET "available_credits" = "available_credits" + ?, "updated_at" = ? WHERE "id" = ?',
      ).bind(input.amount, timestamp, account.id),
      db.prepare(
        `INSERT INTO "credit_ledger_entry"
         ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
         VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind(entry.id, entry.account_id, entry.kind, entry.amount, entry.source_type, entry.source_id,
        entry.idempotency_key, entry.actor_user_id, entry.reason, entry.metadata_json, entry.created_at),
    ]);
  } catch (error) {
    const duplicate = await db.prepare(
      'SELECT * FROM "credit_ledger_entry" WHERE "account_id" = ? AND "idempotency_key" = ?',
    ).bind(account.id, input.idempotencyKey).first<CreditLedgerEntry>();
    if (duplicate) return { account: await ensureCreditAccount(db, input.userId), entry: duplicate, created: false };
    throw error;
  }

  return { account: await ensureCreditAccount(db, input.userId), entry, created: true };
}

export async function adjustCredits(
  db: D1Database,
  input: {
    userId: string;
    amount: number;
    actorUserId: string;
    reason: string;
    idempotencyKey: string;
    sourceId?: string;
    metadata?: unknown;
  },
): Promise<CreditBalance> {
  integer(input.amount, 'amount');
  if (input.amount === 0) throw new Error('amount must not be zero');
  if (!input.reason.trim()) throw new Error('reason is required');
  if (input.amount > 0) {
    await grantCredits(db, {
      userId: input.userId, amount: input.amount, kind: 'admin_adjustment', sourceType: 'admin_adjustment',
      sourceId: input.sourceId ?? input.actorUserId, idempotencyKey: input.idempotencyKey,
      actorUserId: input.actorUserId, reason: input.reason, metadata: input.metadata,
    });
    return getCreditBalance(db, input.userId);
  }

  const debit = -input.amount;
  const account = await ensureCreditAccount(db, input.userId);
  const existing = await db.prepare(
    'SELECT 1 FROM "credit_ledger_entry" WHERE "account_id" = ? AND "idempotency_key" = ?',
  ).bind(account.id, input.idempotencyKey).first();
  if (existing) return getCreditBalance(db, input.userId);

  const timestamp = now();
  try {
    const result = await db.batch([
      db.prepare(
        `UPDATE "credit_account"
         SET "available_credits" = "available_credits" - ?, "updated_at" = ?
         WHERE "id" = ? AND "available_credits" >= ?`,
      ).bind(debit, timestamp, account.id, debit),
      db.prepare(
        `INSERT INTO "credit_ledger_entry"
         ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
         SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE changes() = 1`,
      ).bind(id(), account.id, 'admin_adjustment', -debit, 'admin_adjustment', input.sourceId ?? input.actorUserId,
        input.idempotencyKey, input.actorUserId, input.reason, json(input.metadata), timestamp),
    ]);
    if (result[0].meta.changes !== 1) throw new InsufficientCreditsError();
  } catch (error) {
    const duplicate = await db.prepare(
      'SELECT 1 FROM "credit_ledger_entry" WHERE "account_id" = ? AND "idempotency_key" = ?',
    ).bind(account.id, input.idempotencyKey).first();
    if (!duplicate) throw error;
  }
  return getCreditBalance(db, input.userId);
}

export async function reserveCredits(
  db: D1Database,
  input: {
    userId: string;
    amount: number;
    featureType: string;
    businessObjectId: string;
    idempotencyKey: string;
    expiresAt?: string | null;
    metadata?: unknown;
  },
): Promise<{ reservation: CreditReservation; created: boolean }> {
  positiveInteger(input.amount, 'amount');
  const account = await ensureCreditAccount(db, input.userId);
  const existing = await db.prepare(
    'SELECT * FROM "credit_reservation" WHERE "account_id" = ? AND "idempotency_key" = ?',
  ).bind(account.id, input.idempotencyKey).first<CreditReservation>();
  if (existing) return { reservation: existing, created: false };

  const timestamp = now();
  const reservation: CreditReservation = {
    id: id(), account_id: account.id, feature_type: input.featureType, business_object_id: input.businessObjectId,
    reserved_credits: input.amount, status: 'reserved', idempotency_key: input.idempotencyKey,
    expires_at: input.expiresAt ?? null, released_at: null, created_at: timestamp, updated_at: timestamp,
  };

  try {
    const result = await db.batch([
      db.prepare(
        `UPDATE "credit_account"
         SET "available_credits" = "available_credits" - ?, "reserved_credits" = "reserved_credits" + ?, "updated_at" = ?
         WHERE "id" = ? AND "available_credits" >= ?`,
      ).bind(input.amount, input.amount, timestamp, account.id, input.amount),
      db.prepare(
        `INSERT INTO "credit_reservation"
         ("id","account_id","feature_type","business_object_id","reserved_credits","status","idempotency_key","expires_at","released_at","created_at","updated_at")
         SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE changes() = 1`,
      ).bind(reservation.id, reservation.account_id, reservation.feature_type, reservation.business_object_id,
        reservation.reserved_credits, reservation.status, reservation.idempotency_key, reservation.expires_at,
        null, reservation.created_at, reservation.updated_at),
      db.prepare(
        `INSERT INTO "credit_ledger_entry"
         ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
         SELECT ?,?,'reservation',?,?,?,?,NULL,NULL,?,? WHERE changes() = 1`,
      ).bind(id(), account.id, -input.amount, input.featureType, input.businessObjectId,
        `reservation:${input.idempotencyKey}`, json(input.metadata), timestamp),
    ]);
    if (result[0].meta.changes !== 1) throw new InsufficientCreditsError();
  } catch (error) {
    const duplicate = await db.prepare(
      'SELECT * FROM "credit_reservation" WHERE "account_id" = ? AND "idempotency_key" = ?',
    ).bind(account.id, input.idempotencyKey).first<CreditReservation>();
    if (duplicate) return { reservation: duplicate, created: false };
    throw error;
  }
  return { reservation, created: true };
}

export async function settleReservation(
  db: D1Database,
  input: {
    userId: string;
    reservationId: string;
    featureType: string;
    businessObjectId: string;
    chargeType: string;
    credits: number;
    priceSnapshot?: unknown;
    quantitySnapshot?: unknown;
  },
): Promise<CreditConsumption> {
  positiveInteger(input.credits, 'credits');
  const account = await ensureCreditAccount(db, input.userId);
  const reservation = await db.prepare(
    'SELECT * FROM "credit_reservation" WHERE "id" = ? AND "account_id" = ?',
  ).bind(input.reservationId, account.id).first<CreditReservation>();
  if (!reservation) throw new Error('Credit reservation not found');
  if (input.credits > reservation.reserved_credits) throw new Error('Settlement exceeds reserved Credits');

  const existing = await db.prepare(
    `SELECT * FROM "credit_consumption"
     WHERE "feature_type" = ? AND "business_object_id" = ? AND "charge_type" = ?`,
  ).bind(input.featureType, input.businessObjectId, input.chargeType).first<CreditConsumption>();
  if (existing) return existing;
  if (reservation.status !== 'reserved') throw new Error(`Reservation is ${reservation.status}`);

  const timestamp = now();
  const consumption: CreditConsumption = {
    id: id(), account_id: account.id, reservation_id: reservation.id, feature_type: input.featureType,
    business_object_id: input.businessObjectId, charge_type: input.chargeType, credits: input.credits,
    price_snapshot_json: json(input.priceSnapshot), quantity_snapshot_json: json(input.quantitySnapshot), created_at: timestamp,
  };
  const unused = reservation.reserved_credits - input.credits;
  const statements: D1PreparedStatement[] = [
    db.prepare(
      `UPDATE "credit_reservation" SET "status" = 'settled', "updated_at" = ?
       WHERE "id" = ? AND "status" = 'reserved'`,
    ).bind(timestamp, reservation.id),
    db.prepare(
      `UPDATE "credit_account"
       SET "reserved_credits" = "reserved_credits" - ?, "available_credits" = "available_credits" + ?, "updated_at" = ?
       WHERE "id" = ? AND "reserved_credits" >= ? AND changes() = 1`,
    ).bind(reservation.reserved_credits, unused, timestamp, account.id, reservation.reserved_credits),
    db.prepare(
      `INSERT INTO "credit_consumption"
       ("id","account_id","reservation_id","feature_type","business_object_id","charge_type","credits","price_snapshot_json","quantity_snapshot_json","created_at")
       SELECT ?,?,?,?,?,?,?,?,?,? WHERE changes() = 1`,
    ).bind(consumption.id, consumption.account_id, consumption.reservation_id, consumption.feature_type,
      consumption.business_object_id, consumption.charge_type, consumption.credits, consumption.price_snapshot_json,
      consumption.quantity_snapshot_json, consumption.created_at),
    db.prepare(
      `INSERT INTO "credit_ledger_entry"
       ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
       SELECT ?,?,'settlement',?,?,?,?,NULL,NULL,?,? WHERE changes() = 1`,
    // The reservation already moved the charged Credits out of available balance.
    // Settlement records the immutable event without debiting the projection again.
    ).bind(id(), account.id, 0, input.featureType, input.businessObjectId,
      `settlement:${reservation.id}`, json({ reservationId: reservation.id, credits: input.credits }), timestamp),
  ];
  if (unused > 0) {
    statements.push(db.prepare(
      `INSERT INTO "credit_ledger_entry"
       ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
       SELECT ?,?,'release',?,?,?,?,NULL,NULL,?,? WHERE changes() = 1`,
    ).bind(id(), account.id, unused, input.featureType, input.businessObjectId,
      `release:${reservation.id}`, json({ reservationId: reservation.id, reason: 'unused_reservation' }), timestamp));
  }
  const result = await db.batch(statements);
  if (result[0].meta.changes !== 1) throw new Error('Reservation is no longer available for settlement');
  return consumption;
}

export async function releaseReservation(
  db: D1Database,
  input: { userId: string; reservationId: string; reason?: string; status?: 'released' | 'expired' },
): Promise<CreditReservation> {
  const account = await ensureCreditAccount(db, input.userId);
  const reservation = await db.prepare(
    'SELECT * FROM "credit_reservation" WHERE "id" = ? AND "account_id" = ?',
  ).bind(input.reservationId, account.id).first<CreditReservation>();
  if (!reservation) throw new Error('Credit reservation not found');
  if (reservation.status !== 'reserved') return reservation;

  const timestamp = now();
  const status = input.status ?? 'released';
  const result = await db.batch([
    db.prepare(
      `UPDATE "credit_reservation"
       SET "status" = ?, "released_at" = ?, "updated_at" = ?
       WHERE "id" = ? AND "status" = 'reserved'`,
    ).bind(status, timestamp, timestamp, reservation.id),
    db.prepare(
      `UPDATE "credit_account"
       SET "reserved_credits" = "reserved_credits" - ?, "available_credits" = "available_credits" + ?, "updated_at" = ?
       WHERE "id" = ? AND "reserved_credits" >= ? AND changes() = 1`,
    ).bind(reservation.reserved_credits, reservation.reserved_credits, timestamp, account.id, reservation.reserved_credits),
    db.prepare(
      `INSERT INTO "credit_ledger_entry"
       ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
       SELECT ?,?,'release',?,?,?,?,NULL,?, '{}',? WHERE changes() = 1`,
    ).bind(id(), account.id, reservation.reserved_credits, reservation.feature_type, reservation.business_object_id,
      `release:${reservation.id}`, input.reason ?? null, timestamp),
  ]);
  if ((result[0].meta.changes ?? 0) !== 1) {
    return (await db.prepare('SELECT * FROM "credit_reservation" WHERE "id" = ?').bind(reservation.id).first<CreditReservation>())!;
  }
  return (await db.prepare('SELECT * FROM "credit_reservation" WHERE "id" = ?').bind(reservation.id).first<CreditReservation>())!;
}

export async function hasUserContentGrant(
  db: D1Database,
  userId: string | null | undefined,
  contentType: 'book' | 'blog' | 'course' | 'resource',
  contentId: string,
): Promise<boolean> {
  if (!userId) return false;
  const timestamp = now();
  const row = await db.prepare(
    `SELECT 1 FROM "user_content_grant"
     WHERE "user_id" = ? AND "content_type" = ? AND "content_id" IN (?, '*')
       AND ("expires_at" IS NULL OR "expires_at" > ?)
     LIMIT 1`,
  ).bind(userId, contentType, contentId, timestamp).first();
  return !!row;
}

export async function getUserContentGrant(
  db: D1Database,
  userId: string,
  contentType: 'book' | 'blog' | 'course' | 'resource',
  contentId: string,
): Promise<{ id: string; expires_at: string | null; credit_consumption_id: string | null } | null> {
  return db.prepare(
    `SELECT "id", "expires_at", "credit_consumption_id" FROM "user_content_grant"
     WHERE "user_id" = ? AND "content_type" = ? AND "content_id" = ?`,
  ).bind(userId, contentType, contentId).first<{ id: string; expires_at: string | null; credit_consumption_id: string | null }>();
}

export async function redeemContentWithCredits(
  db: D1Database,
  input: {
    userId: string;
    contentType: 'book' | 'blog' | 'course' | 'resource';
    contentId: string;
    credits: number;
    idempotencyKey: string;
    priceSnapshot: unknown;
    durationDays?: number;
  },
): Promise<{ consumption: CreditConsumption | null; alreadyGranted: boolean; expiresAt: string | null }> {
  positiveInteger(input.credits, 'credits');
  const existing = await getUserContentGrant(db, input.userId, input.contentType, input.contentId);
  const renewable = input.contentType === 'book' || input.contentType === 'blog';
  const businessObjectId = `content:${input.userId}:${input.contentType}:${input.contentId}:${input.idempotencyKey}`;
  const existingConsumption = await db.prepare(
    `SELECT * FROM "credit_consumption"
     WHERE "feature_type" = ? AND "business_object_id" = ? AND "charge_type" = 'unlock'`,
  ).bind(input.contentType, businessObjectId).first<CreditConsumption>();
  // The same request may be retried after its grant was persisted. Return the
  // original result instead of extending a time-based grant a second time.
  if (existingConsumption && existing?.credit_consumption_id === existingConsumption.id) {
    return { consumption: existingConsumption, alreadyGranted: true, expiresAt: existing.expires_at };
  }
  if (existing && !renewable && (existing.expires_at === null || existing.expires_at > now())) {
    return { consumption: null, alreadyGranted: true, expiresAt: existing.expires_at };
  }
  const consumption = existingConsumption ?? await (async () => {
    const reservation = await reserveCredits(db, {
      userId: input.userId,
      amount: input.credits,
      featureType: input.contentType,
      businessObjectId,
      idempotencyKey: `content:${input.idempotencyKey}`,
      metadata: { contentType: input.contentType, contentId: input.contentId },
    });
    return settleReservation(db, {
      userId: input.userId,
      reservationId: reservation.reservation.id,
      featureType: input.contentType,
      businessObjectId,
      chargeType: 'unlock',
      credits: input.credits,
      priceSnapshot: input.priceSnapshot,
      quantitySnapshot: { durationDays: input.durationDays ?? null },
    });
  })();

  const timestamp = now();
  const currentExpiry = existing?.expires_at ? new Date(existing.expires_at).getTime() : 0;
  const base = Math.max(Date.now(), currentExpiry);
  const expiresAt = renewable
    ? new Date(base + (input.durationDays ?? input.credits) * 24 * 60 * 60 * 1000).toISOString()
    : null;
  await db.prepare(
    `INSERT INTO "user_content_grant"
     ("id","user_id","content_type","content_id","granted_at","expires_at","credit_consumption_id","updated_at")
     VALUES (?,?,?,?,?,?,?,?)
     ON CONFLICT("user_id","content_type","content_id") DO UPDATE SET
       "expires_at" = excluded."expires_at",
       "credit_consumption_id" = COALESCE("user_content_grant"."credit_consumption_id", excluded."credit_consumption_id"),
       "updated_at" = excluded."updated_at"`,
  ).bind(id(), input.userId, input.contentType, input.contentId, timestamp, expiresAt, consumption.id, timestamp).run();
  return { consumption, alreadyGranted: false, expiresAt };
}

export interface ScannerCreditRun {
  id: string;
  user_id: string;
  survey_id: string;
  idempotency_key: string;
  reservation_id: string;
  response_id: number | null;
  status: 'reserved' | 'completed' | 'failed';
  retry_token: string | null;
  credit_amount: number | null;
  price_snapshot_json: string | null;
  created_at: string;
  updated_at: string;
}

export async function getScannerCreditRunByIdempotencyKey(
  db: D1Database,
  userId: string,
  idempotencyKey: string,
): Promise<ScannerCreditRun | null> {
  return db.prepare(
    'SELECT * FROM "scanner_credit_run" WHERE "user_id" = ? AND "idempotency_key" = ?',
  ).bind(userId, idempotencyKey).first<ScannerCreditRun>() ?? null;
}

export interface ScannerCreditRunPrice {
  credits: number;
  priceSnapshot: Record<string, unknown>;
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

/**
 * A retry must be priced from the immutable capture made with the original run.
 * Rows predating that capture cannot safely be recovered and must fail closed.
 */
export function getCapturedScannerCreditRunPrice(run: ScannerCreditRun): ScannerCreditRunPrice {
  if (!isPositiveSafeInteger(run.credit_amount) || !run.price_snapshot_json) {
    throw new Error('Scanner Credit run lacks a durable price capture.');
  }

  let priceSnapshot: unknown;
  try {
    priceSnapshot = JSON.parse(run.price_snapshot_json);
  } catch {
    throw new Error('Scanner Credit run has an invalid durable price snapshot.');
  }
  if (!priceSnapshot || Array.isArray(priceSnapshot) || typeof priceSnapshot !== 'object'
    || !isPositiveSafeInteger((priceSnapshot as Record<string, unknown>).credits)
    || (priceSnapshot as Record<string, unknown>).credits !== run.credit_amount) {
    throw new Error('Scanner Credit run has inconsistent durable price capture.');
  }
  return { credits: run.credit_amount, priceSnapshot: priceSnapshot as Record<string, unknown> };
}

export async function startScannerCreditRun(
  db: D1Database,
  input: { userId: string; surveyId: string; idempotencyKey: string; price: ScannerCreditRunPrice },
): Promise<{ run: ScannerCreditRun; created: boolean }> {
  let existing = await getScannerCreditRunByIdempotencyKey(db, input.userId, input.idempotencyKey);
  if (existing?.survey_id !== undefined && existing.survey_id !== input.surveyId) {
    throw new Error('Scanner Credit run does not match this survey.');
  }

  // Recover the split state left by the pre-atomic failure path: its reservation
  // was released but the run remained reserved. This does not expose a response;
  // it only makes the run eligible for the normal same-key replacement flow.
  if (existing?.status === 'reserved') {
    const reservation = await db.prepare(
      'SELECT "status" FROM "credit_reservation" WHERE "id" = ?',
    ).bind(existing.reservation_id).first<Pick<CreditReservation, 'status'>>();
    if (reservation?.status === 'released') {
      getCapturedScannerCreditRunPrice(existing);
      const repaired = await db.prepare(
        `UPDATE "scanner_credit_run"
         SET "status" = 'failed', "retry_token" = NULL, "updated_at" = ?
         WHERE "id" = ? AND "status" = 'reserved'
           AND EXISTS (
             SELECT 1 FROM "credit_reservation"
             WHERE "id" = "scanner_credit_run"."reservation_id" AND "status" = 'released'
           )`,
      ).bind(now(), existing.id).run();
      if ((repaired.meta.changes ?? 0) === 1) {
        existing = await getScannerCreditRunByIdempotencyKey(db, input.userId, input.idempotencyKey);
      } else {
        const raced = await getScannerCreditRunByIdempotencyKey(db, input.userId, input.idempotencyKey);
        if (!raced) throw new Error('Scanner Credit retry run disappeared');
        existing = raced;
      }
    }
  }
  if (existing && existing.status !== 'failed') return { run: existing, created: false };

  // A failed same-key run must use its original durable capture, never today's
  // active pricing rule. Validate before claiming/releasing any replacement.
  const price = existing ? getCapturedScannerCreditRunPrice(existing) : input.price;
  if (!isPositiveSafeInteger(price.credits) || !isPositiveSafeInteger(price.priceSnapshot.credits)
    || price.priceSnapshot.credits !== price.credits) {
    throw new Error('Scanner Credit run requires a valid price capture.');
  }
  const priceSnapshotJson = json(price.priceSnapshot);

  // A failure before response creation is retryable with the same request key.
  // Elect one replacement reservation atomically. Concurrent retries see the
  // retry token and reuse that same run/reservation rather than double-charging.
  let retryToken = existing?.retry_token ?? null;
  if (existing && retryToken === null) {
    retryToken = crypto.randomUUID();
    const claimed = await db.prepare(
      `UPDATE "scanner_credit_run" SET "retry_token" = ?, "updated_at" = ?
       WHERE "id" = ? AND "status" = 'failed' AND "retry_token" IS NULL`,
    ).bind(retryToken, now(), existing.id).run();
    if ((claimed.meta.changes ?? 0) !== 1) {
      const raced = await getScannerCreditRunByIdempotencyKey(db, input.userId, input.idempotencyKey);
      if (raced) return { run: raced, created: false };
      throw new Error('Scanner Credit retry run disappeared');
    }
  }

  const runId = existing?.id ?? id();
  const reservationKey = existing ? `scanner:${input.idempotencyKey}:retry:${retryToken}` : `scanner:${input.idempotencyKey}`;
  const reserved = await reserveCredits(db, {
    userId: input.userId,
    amount: price.credits,
    featureType: 'scanner',
    // credit_reservation has one business object per feature/account. A released
    // pre-response run needs a distinct reservation object on same-key retry;
    // settlement remains keyed to the stable Scanner run ID below.
    businessObjectId: existing ? `${runId}:retry:${retryToken}` : runId,
    idempotencyKey: reservationKey,
    metadata: { surveyId: input.surveyId, priceSnapshot: price.priceSnapshot },
  });
  const timestamp = now();
  try {
    if (existing) {
      const restored = await db.prepare(
        `UPDATE "scanner_credit_run"
         SET "reservation_id" = ?, "response_id" = NULL, "status" = 'reserved', "retry_token" = NULL,
             "updated_at" = ?
         WHERE "id" = ? AND "status" = 'failed' AND "retry_token" = ?`,
      ).bind(reserved.reservation.id, timestamp, runId, retryToken).run();
      if ((restored.meta.changes ?? 0) !== 1) throw new Error('Unable to restore Scanner Credit run');
    } else {
      await db.prepare(
        `INSERT INTO "scanner_credit_run"
         ("id","user_id","survey_id","idempotency_key","reservation_id","response_id","status","retry_token","credit_amount","price_snapshot_json","created_at","updated_at")
         VALUES (?,?,?,?,?,NULL,'reserved',NULL,?,?,?,?)`,
      ).bind(runId, input.userId, input.surveyId, input.idempotencyKey, reserved.reservation.id,
        price.credits, priceSnapshotJson, timestamp, timestamp).run();
    }
  } catch (error) {
    if (reserved.created) await releaseReservation(db, {
      userId: input.userId, reservationId: reserved.reservation.id, reason: 'scanner_run_creation_failed',
    });
    if (existing && retryToken !== null) {
      await db.prepare(
        `UPDATE "scanner_credit_run" SET "retry_token" = NULL, "updated_at" = ?
         WHERE "id" = ? AND "status" = 'failed' AND "retry_token" = ?`,
      ).bind(now(), runId, retryToken).run();
    }
    const duplicate = await getScannerCreditRunByIdempotencyKey(db, input.userId, input.idempotencyKey);
    if (duplicate && duplicate.status !== 'failed') return { run: duplicate, created: false };
    throw error;
  }
  return {
    run: {
      id: runId, user_id: input.userId, survey_id: input.surveyId, idempotency_key: input.idempotencyKey,
      reservation_id: reserved.reservation.id, response_id: null, status: 'reserved', retry_token: null,
      credit_amount: price.credits, price_snapshot_json: priceSnapshotJson,
      created_at: existing?.created_at ?? timestamp, updated_at: timestamp,
    },
    created: true,
  };
}

export async function completeScannerCreditRun(
  db: D1Database,
  input: { userId: string; runId: string; responseId: number },
): Promise<CreditConsumption> {
  const run = await db.prepare(
    'SELECT * FROM "scanner_credit_run" WHERE "id" = ? AND "user_id" = ?',
  ).bind(input.runId, input.userId).first<ScannerCreditRun>();
  if (!run) throw new Error('Scanner Credit run not found');
  if (run.status === 'completed') {
    const existing = await db.prepare(
      `SELECT * FROM "credit_consumption"
       WHERE "feature_type" = 'scanner' AND "business_object_id" = ? AND "charge_type" = 'full_run'`,
    ).bind(run.id).first<CreditConsumption>();
    if (!existing) throw new Error('Completed Scanner run is missing its consumption');
    return existing;
  }
  if (run.status !== 'reserved') throw new Error(`Scanner Credit run is ${run.status}`);
  const price = getCapturedScannerCreditRunPrice(run);

  const existing = await db.prepare(
    `SELECT * FROM "credit_consumption"
     WHERE "feature_type" = 'scanner' AND "business_object_id" = ? AND "charge_type" = 'full_run'`,
  ).bind(run.id).first<CreditConsumption>();
  const consumption = existing ?? await settleReservation(db, {
    userId: input.userId, reservationId: run.reservation_id, featureType: 'scanner',
    businessObjectId: run.id, chargeType: 'full_run', credits: price.credits,
    priceSnapshot: price.priceSnapshot, quantitySnapshot: { responseId: input.responseId },
  });
  const result = await db.prepare(
    `UPDATE "scanner_credit_run" SET "response_id" = ?, "status" = 'completed', "updated_at" = ?
     WHERE "id" = ? AND "status" = 'reserved'`,
  ).bind(input.responseId, now(), run.id).run();
  if (result.meta.changes !== 1) throw new Error('Unable to finalize Scanner Credit run');
  return consumption;
}

export async function failScannerCreditRun(
  db: D1Database,
  input: { userId: string; runId: string; reason: string },
): Promise<void> {
  const run = await db.prepare(
    'SELECT * FROM "scanner_credit_run" WHERE "id" = ? AND "user_id" = ?',
  ).bind(input.runId, input.userId).first<ScannerCreditRun>();
  if (!run || run.status !== 'reserved') return;
  // Do not release a reservation into a retryable failed state without the
  // immutable price data that a later same-key recovery must charge.
  getCapturedScannerCreditRunPrice(run);
  const account = await ensureCreditAccount(db, input.userId);
  const reservation = await db.prepare(
    'SELECT * FROM "credit_reservation" WHERE "id" = ? AND "account_id" = ?',
  ).bind(run.reservation_id, account.id).first<CreditReservation>();
  if (!reservation) throw new Error('Scanner Credit run reservation not found');
  const timestamp = now();
  const result = await db.batch([
    // Mark the run failed first in the transaction, then release its reservation.
    // D1 batch is transactional, so a crash cannot leave a released reservation
    // attached to a still-reserved run.
    db.prepare(
      `UPDATE "scanner_credit_run" SET "status" = 'failed', "retry_token" = NULL, "updated_at" = ?
       WHERE "id" = ? AND "user_id" = ? AND "status" = 'reserved'
         AND EXISTS (
           SELECT 1 FROM "credit_reservation"
           WHERE "id" = "scanner_credit_run"."reservation_id"
             AND "status" = 'reserved' AND "reserved_credits" = ?
         )
         AND EXISTS (
           SELECT 1 FROM "credit_account"
           WHERE "id" = ? AND "reserved_credits" >= ?
         )`,
    ).bind(timestamp, run.id, input.userId, reservation.reserved_credits, account.id, reservation.reserved_credits),
    db.prepare(
      `UPDATE "credit_reservation"
       SET "status" = 'released', "released_at" = ?, "updated_at" = ?
       WHERE "id" = ? AND "status" = 'reserved' AND changes() = 1`,
    ).bind(timestamp, timestamp, reservation.id),
    db.prepare(
      `UPDATE "credit_account"
       SET "reserved_credits" = "reserved_credits" - ?, "available_credits" = "available_credits" + ?, "updated_at" = ?
       WHERE "id" = ? AND "reserved_credits" >= ? AND changes() = 1`,
    ).bind(reservation.reserved_credits, reservation.reserved_credits, timestamp, account.id, reservation.reserved_credits),
    db.prepare(
      `INSERT INTO "credit_ledger_entry"
       ("id","account_id","kind","amount","source_type","source_id","idempotency_key","actor_user_id","reason","metadata_json","created_at")
       SELECT ?,?,'release',?,?,?,?,NULL,?, '{}',? WHERE changes() = 1`,
    ).bind(id(), account.id, reservation.reserved_credits, reservation.feature_type, reservation.business_object_id,
      `release:${reservation.id}`, input.reason, timestamp),
  ]);
  if ((result[0].meta.changes ?? 0) !== 1) {
    const current = await db.prepare(
      `SELECT run."status" AS "run_status", reservation."status" AS "reservation_status"
       FROM "scanner_credit_run" run
       JOIN "credit_reservation" reservation ON reservation."id" = run."reservation_id"
       WHERE run."id" = ? AND run."user_id" = ?`,
    ).bind(run.id, input.userId).first<{ run_status: ScannerCreditRun['status']; reservation_status: CreditReservation['status'] }>();
    if (current?.run_status === 'reserved' && current.reservation_status === 'released') {
      // Repair the only historical split state created before this function used
      // a batch. Current writes cannot produce it, and recovery is fail-closed
      // if the immutable capture is absent or invalid.
      const repaired = await db.prepare(
        `UPDATE "scanner_credit_run" SET "status" = 'failed', "retry_token" = NULL, "updated_at" = ?
         WHERE "id" = ? AND "user_id" = ? AND "status" = 'reserved'
           AND EXISTS (
             SELECT 1 FROM "credit_reservation"
             WHERE "id" = "scanner_credit_run"."reservation_id" AND "status" = 'released'
           )`,
      ).bind(now(), run.id, input.userId).run();
      if ((repaired.meta.changes ?? 0) === 1) return;
    }
    if (current?.run_status !== 'failed' || current.reservation_status !== 'released') {
      throw new Error('Unable to atomically fail Scanner Credit run');
    }
  }
}

export async function getActiveCreditPricingRule(
  db: D1Database,
  featureType: string,
  targetId = '*',
  model = '*',
): Promise<CreditPricingRule | null> {
  const timestamp = now();
  return db.prepare(
    `SELECT * FROM "credit_pricing_rule"
     WHERE "feature_type" = ? AND "is_active" = 1
       AND "target_id" IN (?, '*') AND "model" IN (?, '*')
       AND "effective_from" <= ?
       AND ("effective_until" IS NULL OR "effective_until" > ?)
     ORDER BY CASE WHEN "target_id" = ? THEN 0 ELSE 1 END,
              CASE WHEN "model" = ? THEN 0 ELSE 1 END,
              "rule_version" DESC, "effective_from" DESC
     LIMIT 1`,
  ).bind(featureType, targetId, model, timestamp, timestamp, targetId, model).first<CreditPricingRule>();
}

export async function reconcileCreditAccount(
  db: D1Database,
  userId: string,
): Promise<{ ok: boolean; available: number; reserved: number; ledgerNet: number }> {
  const account = await ensureCreditAccount(db, userId);
  const row = await db.prepare(
    'SELECT COALESCE(SUM("amount"), 0) AS "ledger_net" FROM "credit_ledger_entry" WHERE "account_id" = ?',
  ).bind(account.id).first<{ ledger_net: number }>();
  // Reservation ledger entries make the ledger net equal available Credits. Reserved
  // Credits remain separately represented in account projection until settlement/release.
  const ledgerNet = row?.ledger_net ?? 0;
  return {
    ok: ledgerNet === account.available_credits,
    available: account.available_credits,
    reserved: account.reserved_credits,
    ledgerNet,
  };
}
