import type { ScannerPdfType } from './scanner-pdf';

export const SCANNER_PDF_OPERATION_LEASE_SECONDS = 10 * 60;

/** Stable per-artifact operation key; the lease also serializes same-type PDF requests. */
export function scannerPdfOperationKey(type: ScannerPdfType): string {
  return `pdf:${type}`;
}

export interface ScannerResponseOperationLease {
  operationKey: string;
  token: string;
}

/**
 * Acquires a durable lease only while the raw response is both retained and
 * owned by the requesting history row. A concurrent caller cannot replace a
 * live response lease, including when it asks for a different PDF artifact.
 */
export async function claimRetainedScannerPdfLease(
  db: D1Database,
  responseId: number,
  userId: string,
  type: ScannerPdfType,
): Promise<ScannerResponseOperationLease | null> {
  const operationKey = scannerPdfOperationKey(type);
  const token = crypto.randomUUID();
  // sqlite's `changes()` is not reliable for an UPDATE that renews a lease to
  // the same timestamp, so read back the token after the conditional upsert.
  await db.prepare(
    `INSERT INTO "scanner_response_operation_lease"
       ("response_id","operation_key","token","lease_expires_at","created_at")
     SELECT ?,?,?,datetime('now', ?),datetime('now')
     WHERE EXISTS (
       SELECT 1 FROM "scanner_response" response
       INNER JOIN "scanner_history" history ON history."response_id" = response."id"
       WHERE response."id" = ? AND history."user_id" = ?
         AND julianday(response."expires_at") > julianday('now')
     )
      ON CONFLICT("response_id") DO UPDATE SET
       "token" = excluded."token", "lease_expires_at" = excluded."lease_expires_at"
     WHERE julianday("scanner_response_operation_lease"."lease_expires_at") <= julianday('now')
       AND EXISTS (
         SELECT 1 FROM "scanner_response" response
         INNER JOIN "scanner_history" history ON history."response_id" = response."id"
         WHERE response."id" = ? AND history."user_id" = ?
           AND julianday(response."expires_at") > julianday('now')
       )`,
  ).bind(
    responseId, operationKey, token, `+${SCANNER_PDF_OPERATION_LEASE_SECONDS} seconds`,
    responseId, userId, responseId, userId,
  ).run();
  const claimed = await db.prepare(
    `SELECT 1 FROM "scanner_response_operation_lease"
     WHERE "response_id" = ? AND "operation_key" = ? AND "token" = ?
       AND julianday("lease_expires_at") > julianday('now')`,
  ).bind(responseId, operationKey, token).first();
  return claimed ? { operationKey, token } : null;
}

/** Persists only if this request still owns an unexpired retained-response lease. */
export async function persistScannerPdfKeyForLease(
  db: D1Database,
  responseId: number,
  userId: string,
  type: ScannerPdfType,
  key: string,
  lease: ScannerResponseOperationLease,
): Promise<boolean> {
  const column = type === 'combined' ? 'pdf_combined_key' : type === 'plan' ? 'pdf_plan_key' : 'pdf_analysis_key';
  const result = await db.prepare(
    `UPDATE "scanner_response" SET "${column}" = ?
     WHERE "id" = ? AND julianday("expires_at") > julianday('now')
       AND EXISTS (
         SELECT 1 FROM "scanner_history" history
         WHERE history."response_id" = "scanner_response"."id" AND history."user_id" = ?
       )
       AND EXISTS (
         SELECT 1 FROM "scanner_response_operation_lease" lease
         WHERE lease."response_id" = "scanner_response"."id"
           AND lease."operation_key" = ? AND lease."token" = ?
           AND julianday(lease."lease_expires_at") > julianday('now')
       )`,
  ).bind(key, responseId, userId, lease.operationKey, lease.token).run();
  return (result.meta.changes ?? 0) === 1;
}

/** The purge worker defers destructive work while a still-valid PDF write lease exists. */
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
