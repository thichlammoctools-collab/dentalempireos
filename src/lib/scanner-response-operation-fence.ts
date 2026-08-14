import type { ScannerPdfType } from './scanner-pdf';

export const SCANNER_RESPONSE_OPERATION_LEASE_SECONDS = 15 * 60;

export type ScannerAiOperationType = 'analysis' | 'plan';
export type ScannerResponseOperationKey = `pdf:${ScannerPdfType}` | `ai:${ScannerAiOperationType}`;

/** Stable per-artifact operation key; one response can hold only one external-work lease. */
export function scannerPdfOperationKey(type: ScannerPdfType): `pdf:${ScannerPdfType}` {
  return `pdf:${type}`;
}

/** Stable per-job operation key. */
export function scannerAiOperationKey(type: ScannerAiOperationType): `ai:${ScannerAiOperationType}` {
  return `ai:${type}`;
}

export interface ScannerResponseOperationLease {
  operationKey: ScannerResponseOperationKey;
  token: string;
}

export interface ScannerPdfArtifactIntent {
  responseId: number;
  key: string;
  token: string;
  operationKey: ScannerResponseOperationKey;
}

/**
 * Retired-key cleanup is deliberately indefinite. An R2 write can complete after
 * its caller has lost a lease, so removing a successful-delete record would make
 * a later stale put permanent. Keys are never reused, and tombstones contain no
 * response ID, owner, or raw report data.
 */
export const SCANNER_RETIRED_ARTIFACT_TOMBSTONE_RETENTION = 'indefinite' as const;

export function buildScannerPdfArtifactKey(
  prefix: string,
  type: ScannerPdfType,
  layoutVersion: string,
  writeToken: string,
): string {
  return `${prefix}/${type}-${layoutVersion}-${writeToken}.pdf`;
}

/** Supports legacy deterministic cached keys while requiring a token for new writes. */
export function isScannerPdfArtifactKeyForLayout(
  key: string,
  type: ScannerPdfType,
  layoutVersion: string,
): boolean {
  const filename = key.slice(key.lastIndexOf('/') + 1);
  return filename === `${type}-${layoutVersion}.pdf`
    || filename.startsWith(`${type}-${layoutVersion}-`) && /^[A-Za-z0-9-]{1,128}\.pdf$/.test(filename.slice(`${type}-${layoutVersion}-`.length));
}

/**
 * A history row is canonical only when it is the sole owner linked to a response.
 * The uniqueness migration enforces this normally; the predicate remains explicit
 * so old or partially migrated data cannot be treated as authoritative.
 */
const canonicalOwnerClause = `
  NOT EXISTS (
    SELECT 1 FROM "scanner_history" competing_history
    WHERE competing_history."response_id" = history."response_id"
      AND competing_history."id" <> history."id"
  )`;

/** Resolves the sole retained history owner without trusting a caller or queue payload. */
export type ScannerResponseOperationLeaseClaim =
  | { outcome: 'claimed'; lease: ScannerResponseOperationLease }
  | { outcome: 'contended' }
  | { outcome: 'invalid' };

export async function getRetainedScannerResponseCanonicalOwner(
  db: D1Database,
  responseId: number,
): Promise<string | null> {
  const row = await db.prepare(
    `SELECT history."user_id"
     FROM "scanner_response" response
     INNER JOIN "scanner_history" history ON history."response_id" = response."id"
     WHERE response."id" = ?
       AND julianday(response."expires_at") > julianday('now')
       AND ${canonicalOwnerClause}
     LIMIT 1`,
  ).bind(responseId).first<{ user_id: string }>();
  return row?.user_id ?? null;
}

/**
 * Claims the one response-wide external-work lease. The token is never replaced
 * while live, so PDF and AI work serialize safely even with different operation keys.
 */
export async function claimRetainedScannerResponseOperationLease(
  db: D1Database,
  responseId: number,
  userId: string,
  operationKey: ScannerResponseOperationKey,
): Promise<ScannerResponseOperationLease | null> {
  const result = await claimRetainedScannerResponseOperationLeaseWithOutcome(db, responseId, userId, operationKey);
  return result.outcome === 'claimed' ? result.lease : null;
}

/** Distinguishes a live competing operation from a response that is no longer safe to process. */
export async function claimRetainedScannerResponseOperationLeaseWithOutcome(
  db: D1Database,
  responseId: number,
  userId: string,
  operationKey: ScannerResponseOperationKey,
): Promise<ScannerResponseOperationLeaseClaim> {
  const token = crypto.randomUUID();
  await db.prepare(
    `INSERT INTO "scanner_response_operation_lease"
       ("response_id","operation_key","token","lease_expires_at","created_at")
     SELECT ?,?,?,datetime('now', ?),datetime('now')
     WHERE EXISTS (
       SELECT 1
       FROM "scanner_response" response
       INNER JOIN "scanner_history" history ON history."response_id" = response."id"
       WHERE response."id" = ? AND history."user_id" = ?
         AND julianday(response."expires_at") > julianday('now')
         AND ${canonicalOwnerClause}
     )
      ON CONFLICT("response_id") DO UPDATE SET
       "token" = excluded."token", "operation_key" = excluded."operation_key",
       "lease_expires_at" = excluded."lease_expires_at"
     WHERE julianday("scanner_response_operation_lease"."lease_expires_at") <= julianday('now')
       AND EXISTS (
         SELECT 1
         FROM "scanner_response" response
         INNER JOIN "scanner_history" history ON history."response_id" = response."id"
         WHERE response."id" = ? AND history."user_id" = ?
           AND julianday(response."expires_at") > julianday('now')
           AND ${canonicalOwnerClause}
       )`,
  ).bind(
    responseId, operationKey, token, `+${SCANNER_RESPONSE_OPERATION_LEASE_SECONDS} seconds`,
    responseId, userId, responseId, userId,
  ).run();
  const claimed = await db.prepare(
    `SELECT 1 FROM "scanner_response_operation_lease"
     WHERE "response_id" = ? AND "operation_key" = ? AND "token" = ?
       AND julianday("lease_expires_at") > julianday('now')`,
  ).bind(responseId, operationKey, token).first();
  if (claimed) return { outcome: 'claimed', lease: { operationKey, token } };

  // A retained canonical response that did not receive our token is contended
  // only when another operation still owns a live lease. All other failures are
  // invalid/retention failures and must not be retried as contention.
  const activeLease = await db.prepare(
    `SELECT 1
     FROM "scanner_response_operation_lease" lease
     INNER JOIN "scanner_response" response ON response."id" = lease."response_id"
     INNER JOIN "scanner_history" history ON history."response_id" = response."id"
     WHERE lease."response_id" = ? AND julianday(lease."lease_expires_at") > julianday('now')
       AND response."id" = ? AND history."user_id" = ?
       AND julianday(response."expires_at") > julianday('now')
       AND ${canonicalOwnerClause}
     LIMIT 1`,
  ).bind(responseId, responseId, userId).first();
  return activeLease ? { outcome: 'contended' } : { outcome: 'invalid' };
}

/**
 * Heartbeats the exact lease holder. Renewal is conditional on retained state,
 * canonical ownership, operation key, token, and a still-live lease; it cannot
 * reacquire an expired or replaced lease.
 */
export async function renewRetainedScannerResponseOperationLease(
  db: D1Database,
  responseId: number,
  userId: string,
  lease: ScannerResponseOperationLease,
): Promise<boolean> {
  const result = await db.prepare(
    `UPDATE "scanner_response_operation_lease"
     SET "lease_expires_at" = datetime('now', ?)
     WHERE "response_id" = ? AND "operation_key" = ? AND "token" = ?
       AND julianday("lease_expires_at") > julianday('now')
       AND EXISTS (
         SELECT 1
         FROM "scanner_response" response
         INNER JOIN "scanner_history" history ON history."response_id" = response."id"
         WHERE response."id" = "scanner_response_operation_lease"."response_id"
           AND history."user_id" = ?
           AND julianday(response."expires_at") > julianday('now')
           AND ${canonicalOwnerClause}
       )`,
  ).bind(
    `+${SCANNER_RESPONSE_OPERATION_LEASE_SECONDS} seconds`,
    responseId, lease.operationKey, lease.token, userId,
  ).run();
  return (result.meta.changes ?? 0) === 1;
}

/** Backward-compatible PDF claim wrapper. */
export function claimRetainedScannerPdfLease(
  db: D1Database,
  responseId: number,
  userId: string,
  type: ScannerPdfType,
): Promise<ScannerResponseOperationLease | null> {
  return claimRetainedScannerResponseOperationLease(db, responseId, userId, scannerPdfOperationKey(type));
}

export function scannerPdfArtifactIntentMatchesLease(
  intent: Pick<ScannerPdfArtifactIntent, 'key' | 'token' | 'operationKey'>,
  key: string,
  lease: ScannerResponseOperationLease,
): boolean {
  return intent.key === key && intent.token === lease.token && intent.operationKey === lease.operationKey;
}

/** Records an R2 write intent before a put, under the current response lease. */
export async function createScannerPdfArtifactIntent(
  db: D1Database,
  responseId: number,
  userId: string,
  key: string,
  lease: ScannerResponseOperationLease,
): Promise<boolean> {
  const result = await db.prepare(
    `INSERT INTO "scanner_pdf_artifact_intent"
       ("response_id","storage_key","operation_key","lease_token","created_at","updated_at")
     SELECT ?,?,?,?,datetime('now'),datetime('now')
     WHERE EXISTS (
       SELECT 1
       FROM "scanner_response" response
       INNER JOIN "scanner_history" history ON history."response_id" = response."id"
       INNER JOIN "scanner_response_operation_lease" current_lease ON current_lease."response_id" = response."id"
       WHERE response."id" = ? AND history."user_id" = ?
         AND julianday(response."expires_at") > julianday('now')
         AND current_lease."operation_key" = ? AND current_lease."token" = ?
         AND julianday(current_lease."lease_expires_at") > julianday('now')
         AND ${canonicalOwnerClause}
     )
     ON CONFLICT("response_id") DO UPDATE SET
       "storage_key" = excluded."storage_key", "operation_key" = excluded."operation_key",
       "lease_token" = excluded."lease_token", "updated_at" = excluded."updated_at"`,
  ).bind(
    responseId, key, lease.operationKey, lease.token,
    responseId, userId, lease.operationKey, lease.token,
  ).run();
  return (result.meta.changes ?? 0) === 1;
}

/** Clears only the matching intent, preserving a newer lease holder's intent. */
export async function clearScannerPdfArtifactIntent(
  db: D1Database,
  responseId: number,
  key: string,
  lease: ScannerResponseOperationLease,
): Promise<void> {
  await db.prepare(
    `DELETE FROM "scanner_pdf_artifact_intent"
     WHERE "response_id" = ? AND "storage_key" = ?
       AND "operation_key" = ? AND "lease_token" = ?`,
  ).bind(responseId, key, lease.operationKey, lease.token).run();
}

/** Persists only if this request still owns an unexpired retained-response lease, then clears its intent. */
export async function persistScannerPdfKeyForLease(
  db: D1Database,
  responseId: number,
  userId: string,
  type: ScannerPdfType,
  key: string,
  lease: ScannerResponseOperationLease,
): Promise<boolean> {
  const column = type === 'combined' ? 'pdf_combined_key' : type === 'plan' ? 'pdf_plan_key' : 'pdf_analysis_key';
  const ownershipFence = `"id" = ? AND julianday("expires_at") > julianday('now')
    AND EXISTS (
      SELECT 1 FROM "scanner_history" history
      WHERE history."response_id" = "scanner_response"."id" AND history."user_id" = ?
        AND ${canonicalOwnerClause}
    )
    AND EXISTS (
      SELECT 1 FROM "scanner_response_operation_lease" lease
      WHERE lease."response_id" = "scanner_response"."id"
        AND lease."operation_key" = ? AND lease."token" = ?
        AND julianday(lease."lease_expires_at") > julianday('now')
    )`;
  const results = await db.batch([
    // A replacement makes the old key unreachable from scanner_response, so
    // retain its independent cleanup handle before switching the pointer.
    db.prepare(
      `INSERT OR IGNORE INTO "scanner_retired_artifact_tombstone"
         ("storage_key","write_token","artifact_kind","retired_at","created_at")
       SELECT "${column}", NULL, 'pdf', datetime('now'), datetime('now')
       FROM "scanner_response"
       WHERE ${ownershipFence} AND "${column}" IS NOT NULL AND "${column}" <> ?`,
    ).bind(responseId, userId, lease.operationKey, lease.token, key),
    db.prepare(
      `UPDATE "scanner_response" SET "${column}" = ?
       WHERE ${ownershipFence}`,
    ).bind(key, responseId, userId, lease.operationKey, lease.token),
  ]);
  if ((results[1]?.meta.changes ?? 0) !== 1) return false;
  // Do not clear on a failed persistence fence: that record is the durable
  // cleanup handle for a successful put that an expired response cannot reference.
  await clearScannerPdfArtifactIntent(db, responseId, key, lease);
  return true;
}

/** The purge worker defers destructive work while any still-valid external-work lease exists. */
export async function hasActiveScannerResponseOperationLease(
  db: D1Database,
  responseId: number,
): Promise<boolean> {
  return Boolean(await db.prepare(
    `SELECT 1 FROM "scanner_response_operation_lease"
     WHERE "response_id" = ? AND julianday("lease_expires_at") > julianday('now')
     LIMIT 1`,
  ).bind(responseId).first());
}

export async function releaseScannerResponseOperationLease(
  db: D1Database,
  responseId: number,
  lease: ScannerResponseOperationLease,
): Promise<void> {
  await db.prepare(
    `DELETE FROM "scanner_response_operation_lease"
     WHERE "response_id" = ? AND "operation_key" = ? AND "token" = ?`,
  ).bind(responseId, lease.operationKey, lease.token).run();
}
