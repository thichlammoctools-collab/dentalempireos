// Durable idempotency and rescan-linkage authority for authenticated Scanner submissions.
// A submission owns one request fingerprint, optional action plan, and response.

import { addScannerActionPlanRescanSnapshot, getScannerActionPlanForUser } from './scanner-action-plan-db';

export interface ScannerSubmissionRow {
  id: string;
  user_id: string;
  survey_id: string;
  idempotency_key: string;
  request_fingerprint: string;
  action_plan_id: string | null;
  response_id: number | null;
  response_purged_at: string | null;
  snapshot_status: 'not_requested' | 'pending' | 'linked';
  created_at: string;
  updated_at: string;
}

export interface ScannerFreeAttemptReservation {
  submission_id: string;
  user_id: string;
  survey_id: string;
  status: 'reserved' | 'settled' | 'released';
  created_at: string;
  settled_at: string | null;
  released_at: string | null;
  updated_at: string;
}

export class ScannerSubmissionMismatchError extends Error {
  constructor() {
    super('Idempotency-Key was already used for a different Scanner submission.');
    this.name = 'ScannerSubmissionMismatchError';
  }
}

function timestamp(): string {
  return new Date().toISOString();
}

function stableJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(',')}}`;
}

export async function fingerprintScannerSubmission(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(stableJson(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (part) => part.toString(16).padStart(2, '0')).join('');
}

function assertMatches(
  row: ScannerSubmissionRow,
  input: { userId: string; surveyId: string; idempotencyKey: string; fingerprint: string; actionPlanId: string | null },
): void {
  if (row.user_id !== input.userId || row.survey_id !== input.surveyId
    || row.idempotency_key !== input.idempotencyKey || row.request_fingerprint !== input.fingerprint
    || row.action_plan_id !== input.actionPlanId) {
    throw new ScannerSubmissionMismatchError();
  }
}

/**
 * Binds the request to its owner plan before a response can be created. The
 * immutable fingerprint means a key replay cannot change answers, survey, or
 * action plan after a result/charge exists.
 */
export async function getScannerSubmissionById(
  db: D1Database,
  submissionId: string,
): Promise<ScannerSubmissionRow | null> {
  return db.prepare('SELECT * FROM "scanner_submission" WHERE "id" = ?')
    .bind(submissionId).first<ScannerSubmissionRow>() ?? null;
}

export async function createOrGetScannerSubmission(
  db: D1Database,
  input: { userId: string; surveyId: string; idempotencyKey: string; fingerprint: string; actionPlanId: string | null },
): Promise<{ submission: ScannerSubmissionRow; created: boolean }> {
  const existing = await db.prepare(
    'SELECT * FROM "scanner_submission" WHERE "user_id" = ? AND "idempotency_key" = ?',
  ).bind(input.userId, input.idempotencyKey).first<ScannerSubmissionRow>();
  if (existing) {
    assertMatches(existing, input);
    return { submission: existing, created: false };
  }

  if (input.actionPlanId) {
    const plan = await getScannerActionPlanForUser(db, input.actionPlanId, input.userId);
    if (!plan || plan.status !== 'active' || plan.survey_id !== input.surveyId || plan.retention_visibility !== 'available') {
      throw new Error('Invalid Scanner action plan.');
    }
  }

  const createdAt = timestamp();
  const candidate: ScannerSubmissionRow = {
    id: crypto.randomUUID(),
    user_id: input.userId,
    survey_id: input.surveyId,
    idempotency_key: input.idempotencyKey,
    request_fingerprint: input.fingerprint,
    action_plan_id: input.actionPlanId,
    response_id: null,
    response_purged_at: null,
    snapshot_status: input.actionPlanId ? 'pending' : 'not_requested',
    created_at: createdAt,
    updated_at: createdAt,
  };
  try {
    await db.prepare(
      `INSERT INTO "scanner_submission"
       ("id","user_id","survey_id","idempotency_key","request_fingerprint","action_plan_id","response_id","response_purged_at","snapshot_status","created_at","updated_at")
       VALUES (?,?,?,?,?,?,NULL,NULL,?,?,?)`,
    ).bind(
      candidate.id, candidate.user_id, candidate.survey_id, candidate.idempotency_key,
      candidate.request_fingerprint, candidate.action_plan_id, candidate.snapshot_status,
      candidate.created_at, candidate.updated_at,
    ).run();
    return { submission: candidate, created: true };
  } catch (error) {
    const raced = await db.prepare(
      'SELECT * FROM "scanner_submission" WHERE "user_id" = ? AND "idempotency_key" = ?',
    ).bind(input.userId, input.idempotencyKey).first<ScannerSubmissionRow>();
    if (!raced) throw error;
    assertMatches(raced, input);
    return { submission: raced, created: false };
  }
}

/**
 * Acquires one free slot using a conditional INSERT. The serializable D1 write
 * prevents distinct idempotency keys from exceeding the per-user/per-survey
 * cap, while the submission row makes a same-key retry a no-op.
 */
export async function reserveScannerFreeAttempt(
  db: D1Database,
  input: { submission: ScannerSubmissionRow; limit: number },
): Promise<{ reservation: ScannerFreeAttemptReservation | null; created: boolean }> {
  const existing = await db.prepare(
    'SELECT * FROM "scanner_free_attempt_reservation" WHERE "submission_id" = ?',
  ).bind(input.submission.id).first<ScannerFreeAttemptReservation>();
  if (existing && existing.status !== 'released') return { reservation: existing, created: false };

  const createdAt = timestamp();
  try {
    if (existing) {
      const restored = await db.prepare(
        `UPDATE "scanner_free_attempt_reservation"
         SET "status" = 'reserved', "released_at" = NULL, "updated_at" = ?
         WHERE "submission_id" = ? AND "status" = 'released' AND (
           SELECT COUNT(*) FROM "scanner_history" history
           LEFT JOIN "scanner_response" response ON response."id" = history."response_id"
           LEFT JOIN "scanner_free_attempt_reservation" prior ON prior."submission_id" = response."submission_id"
           WHERE history."user_id" = ? AND history."survey_id" = ? AND prior."submission_id" IS NULL
         ) + (
           SELECT COUNT(*) FROM "scanner_free_attempt_reservation"
           WHERE "user_id" = ? AND "survey_id" = ? AND "status" IN ('reserved', 'settled')
         ) < ?`,
      ).bind(createdAt, input.submission.id, input.submission.user_id, input.submission.survey_id,
        input.submission.user_id, input.submission.survey_id, input.limit).run();
      if ((restored.meta.changes ?? 0) === 1) {
        return {
          reservation: { ...existing, status: 'reserved', released_at: null, updated_at: createdAt },
          created: true,
        };
      }
      return { reservation: null, created: false };
    }
    const result = await db.prepare(
      `INSERT INTO "scanner_free_attempt_reservation"
       ("submission_id","user_id","survey_id","status","created_at","settled_at","released_at","updated_at")
       SELECT ?,?,?, 'reserved', ?, NULL, NULL, ?
       WHERE (
         SELECT COUNT(*) FROM "scanner_history" history
         LEFT JOIN "scanner_response" response ON response."id" = history."response_id"
         LEFT JOIN "scanner_free_attempt_reservation" prior ON prior."submission_id" = response."submission_id"
         WHERE history."user_id" = ? AND history."survey_id" = ? AND prior."submission_id" IS NULL
       ) + (
         SELECT COUNT(*) FROM "scanner_free_attempt_reservation"
         WHERE "user_id" = ? AND "survey_id" = ? AND "status" IN ('reserved', 'settled')
       ) < ?`,
    ).bind(
      input.submission.id, input.submission.user_id, input.submission.survey_id, createdAt, createdAt,
      input.submission.user_id, input.submission.survey_id,
      input.submission.user_id, input.submission.survey_id, input.limit,
    ).run();
    if ((result.meta.changes ?? 0) === 1) {
      return {
        reservation: {
          submission_id: input.submission.id, user_id: input.submission.user_id, survey_id: input.submission.survey_id,
          status: 'reserved', created_at: createdAt, settled_at: null, released_at: null, updated_at: createdAt,
        },
        created: true,
      };
    }
  } catch (error) {
    const raced = await db.prepare(
      'SELECT * FROM "scanner_free_attempt_reservation" WHERE "submission_id" = ?',
    ).bind(input.submission.id).first<ScannerFreeAttemptReservation>();
    if (raced) return { reservation: raced, created: false };
    throw error;
  }
  return { reservation: null, created: false };
}

/** Settlement happens only after the owner history row is durable. */
export async function settleScannerFreeAttempt(db: D1Database, submissionId: string): Promise<void> {
  await db.prepare(
    `UPDATE "scanner_free_attempt_reservation"
     SET "status" = 'settled', "settled_at" = COALESCE("settled_at", ?), "updated_at" = ?
     WHERE "submission_id" = ? AND "status" = 'reserved'`,
  ).bind(timestamp(), timestamp(), submissionId).run();
}

/** A failure before an owned response/history is durable returns the free slot. */
export async function releaseScannerFreeAttempt(
  db: D1Database,
  submissionId: string,
): Promise<void> {
  await db.prepare(
    `UPDATE "scanner_free_attempt_reservation"
     SET "status" = 'released', "released_at" = COALESCE("released_at", ?), "updated_at" = ?
     WHERE "submission_id" = ? AND "status" = 'reserved'`,
  ).bind(timestamp(), timestamp(), submissionId).run();
}

/** Locates the response inserted with this durable submission identity. */
export async function getScannerSubmissionResponse(
  db: D1Database,
  submission: ScannerSubmissionRow,
): Promise<number | null> {
  const response = await db.prepare(
    'SELECT "id" FROM "scanner_response" WHERE "submission_id" = ? LIMIT 1',
  ).bind(submission.id).first<{ id: number }>();
  return response?.id ?? null;
}

export async function recordScannerSubmissionResponse(
  db: D1Database,
  submission: ScannerSubmissionRow,
  responseId: number,
): Promise<void> {
  const result = await db.prepare(
    `UPDATE "scanner_submission" SET "response_id" = COALESCE("response_id", ?), "updated_at" = ?
     WHERE "id" = ? AND "user_id" = ? AND ("response_id" IS NULL OR "response_id" = ?)`,
  ).bind(responseId, timestamp(), submission.id, submission.user_id, responseId).run();
  if ((result.meta.changes ?? 0) !== 1) throw new ScannerSubmissionMismatchError();
}

/**
 * Links only the submission's pre-bound plan. Failure remains `pending` and is
 * retried by the scheduler or the same-key replay; no new submission or charge
 * is created to repair it.
 */
export async function linkScannerSubmissionSnapshot(
  db: D1Database,
  submissionId: string,
): Promise<'not_requested' | 'linked' | 'pending'> {
  const submission = await db.prepare('SELECT * FROM "scanner_submission" WHERE "id" = ?')
    .bind(submissionId).first<ScannerSubmissionRow>();
  if (!submission) throw new Error('Scanner submission not found.');
  if (!submission.action_plan_id) return 'not_requested';
  const responseId = await getScannerSubmissionResponse(db, submission);
  if (!responseId) return 'pending';

  try {
    await addScannerActionPlanRescanSnapshot(db, {
      planId: submission.action_plan_id,
      userId: submission.user_id,
      responseId,
    });
    await db.prepare(
      `UPDATE "scanner_submission" SET "response_id" = ?, "snapshot_status" = 'linked', "updated_at" = ?
       WHERE "id" = ? AND "action_plan_id" = ?`,
    ).bind(responseId, timestamp(), submission.id, submission.action_plan_id).run();
    return 'linked';
  } catch (error) {
    await db.prepare(
      `UPDATE "scanner_submission" SET "response_id" = ?, "snapshot_status" = 'pending', "updated_at" = ?
       WHERE "id" = ? AND "action_plan_id" = ?`,
    ).bind(responseId, timestamp(), submission.id, submission.action_plan_id).run();
    throw error;
  }
}

export async function listPendingScannerSubmissionSnapshots(
  db: D1Database,
  limit: number,
): Promise<ScannerSubmissionRow[]> {
  const { results = [] } = await db.prepare(
    `SELECT submission.* FROM "scanner_submission" submission
     INNER JOIN "scanner_response" response ON response."submission_id" = submission."id"
     WHERE submission."snapshot_status" = 'pending' AND response."expires_at" > ?
     ORDER BY submission."updated_at" ASC LIMIT ?`,
  ).bind(timestamp(), limit).all<ScannerSubmissionRow>();
  return results;
}
