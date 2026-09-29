// Scanner submission credit runs: the priced, idempotent, retryable charge that
// backs a single scanner submission.
//
// This state machine belongs to the scanner domain, not the credits ledger: it
// owns the scanner_credit_run row and coordinates reservations, but every credit
// mutation goes through the ledger API in credit-db.ts. It is separated here so
// the scanner->credits dependency stays one-directional (a retry path may be
// resumed, but the ledger never needs to know about scanner runs).
//
// Invariants this module must preserve:
//   - A retry is always priced from the immutable capture taken with the original
//     run, never from today's active pricing rule. Missing capture fails closed.
//   - A same-key retry is attempted once: the retry_token is claimed atomically,
//     so concurrent retries reuse the same run/reservation instead of
//     double-charging.
//   - Marking a run failed and releasing its reservation happen in one D1 batch,
//     so a crash cannot leave a released reservation attached to a reserved run.

import {
  ensureCreditAccount,
  releaseReservation,
  reserveCredits,
  settleReservation,
  type CreditConsumption,
  type CreditReservation,
} from './credit-db';
// The durable price capture and its fail-closed validation are pure and live in
// scanner-credit-run-price.ts so they can be unit tested without a D1 binding.
import {
  getCapturedScannerCreditRunPrice,
  isPositiveSafeInteger,
  type ScannerCreditRun,
  type ScannerCreditRunPrice,
} from './scanner-credit-run-price';

export { getCapturedScannerCreditRunPrice, type ScannerCreditRun, type ScannerCreditRunPrice };

function now(): string {
  return new Date().toISOString();
}

function id(): string {
  return crypto.randomUUID();
}

function json(value: unknown): string {
  return JSON.stringify(value);
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
