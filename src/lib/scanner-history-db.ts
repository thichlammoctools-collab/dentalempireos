// Data access layer for scanner_history — tracks which user took which scanner.

import type { ScannerResponseRow } from './scanner-response-db';

export interface ScannerHistoryRow {
  id: number;
  user_id: string;
  survey_id: string;
  response_id: number;
  score_total: number | null;
  score_label: string | null;
  created_at: string;
}

export interface HistoryWithSurvey extends ScannerHistoryRow {
  scanner_title_vi: string | null;
  scanner_title_en: string | null;
  scanner_slug: string | null;
  credit_cost: number | null;
}

export const FREE_SCANNER_ATTEMPT_LIMIT = 3;

export async function addToHistory(
  db: D1Database,
  input: {
    user_id: string;
    survey_id: string;
    response_id: number;
    score_total: number | null;
    score_label: string | null;
  },
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO "scanner_history" ("user_id","survey_id","response_id","score_total","score_label")
       VALUES (?,?,?,?,?)
       ON CONFLICT("response_id") DO NOTHING
       RETURNING "id"`,
    )
    .bind(
      input.user_id,
      input.survey_id,
      input.response_id,
      input.score_total ?? null,
      input.score_label ?? null,
    )
    .first<{ id: number }>();
  return result?.id ?? 0;
}

export async function getUserHistory(
  db: D1Database,
  userId: string,
  limit = 50,
): Promise<HistoryWithSurvey[]> {
  const { results } = await db
    .prepare(
       `SELECT h.*, d.title_vi as scanner_title_vi, d.title_en as scanner_title_en, d.slug as scanner_slug,
               consumption.credits as credit_cost
        FROM "scanner_history" h
         JOIN "survey_definition" d ON d.id = h.survey_id
         JOIN "scanner_response" response ON response.id = h.response_id
         LEFT JOIN "scanner_credit_run" run ON run.response_id = h.response_id AND run.status = 'completed'
         LEFT JOIN "credit_consumption" consumption ON consumption.business_object_id = run.id
           AND consumption.feature_type = 'scanner' AND consumption.charge_type = 'full_run'
         WHERE h.user_id = ? AND response.expires_at > ?
         ORDER BY h.created_at DESC
         LIMIT ?`,
    )
    .bind(userId, new Date().toISOString(), limit)
    .all<HistoryWithSurvey>();
  return results ?? [];
}

export async function getHistoryByResponseId(
  db: D1Database,
  responseId: number,
): Promise<ScannerHistoryRow | null> {
  return db
    .prepare('SELECT * FROM "scanner_history" WHERE "response_id" = ? ORDER BY "created_at" ASC, "id" ASC LIMIT 1')
    .bind(responseId)
    .first<ScannerHistoryRow>() ?? null;
}

export async function isResponseOwnedByUser(
  db: D1Database,
  userId: string,
  responseId: number,
): Promise<boolean> {
  const row = await db
    .prepare('SELECT 1 FROM "scanner_history" WHERE "user_id" = ? AND "response_id" = ?')
    .bind(userId, responseId)
    .first<{ 1: number }>();
  return !!row;
}

/**
 * Canonical raw-report access path. Joining history prevents exposing a raw
 * response before ownership exists and returns null for missing, foreign, and
 * expired IDs so sensitive endpoints do not enumerate reports.
 */
export async function getRetainedScannerResponseForOwner(
  db: D1Database,
  userId: string,
  responseId: number,
): Promise<ScannerResponseRow | null> {
  return await db.prepare(
    `SELECT response.* FROM "scanner_response" response
     INNER JOIN "scanner_history" history ON history."response_id" = response."id"
     WHERE response."id" = ? AND history."user_id" = ? AND response."expires_at" > ?
     LIMIT 1`,
  ).bind(responseId, userId, new Date().toISOString()).first<ScannerResponseRow>() ?? null;
}

export async function getUserHistoryCount(
  db: D1Database,
  userId: string,
): Promise<number> {
  const row = await db
    .prepare('SELECT COUNT(*) as cnt FROM "scanner_history" WHERE "user_id" = ?')
    .bind(userId)
    .first<{ cnt: number }>();
  return row?.cnt ?? 0;
}

export async function getScannerUsage(
  db: D1Database,
  userId: string,
  surveyId: string,
): Promise<{ used: number; limit: number; remaining: number }> {
  // Settled reservations cover new durable submissions. Older history rows have
  // no reservation and remain part of the quota until their normal retention
  // cleanup. Counting both would double-count a new free result.
  const row = await db.prepare(
    `SELECT (
       SELECT COUNT(*) FROM "scanner_history" history
       LEFT JOIN "scanner_response" response ON response."id" = history."response_id"
       LEFT JOIN "scanner_free_attempt_reservation" reservation ON reservation."submission_id" = response."submission_id"
       WHERE history."user_id" = ? AND history."survey_id" = ? AND reservation."submission_id" IS NULL
     ) + (
       SELECT COUNT(*) FROM "scanner_free_attempt_reservation"
       WHERE "user_id" = ? AND "survey_id" = ? AND "status" IN ('reserved', 'settled')
     ) AS used`,
  ).bind(userId, surveyId, userId, surveyId).first<{ used: number }>();
  const used = row?.used ?? 0;
  return {
    used,
    limit: FREE_SCANNER_ATTEMPT_LIMIT,
    remaining: Math.max(0, FREE_SCANNER_ATTEMPT_LIMIT - used),
  };
}
