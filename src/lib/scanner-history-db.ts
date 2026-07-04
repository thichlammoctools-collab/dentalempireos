// Data access layer for scanner_history — tracks which user took which scanner.

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
}

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
      `SELECT h.*, d.title_vi as scanner_title_vi, d.title_en as scanner_title_en, d.slug as scanner_slug
       FROM "scanner_history" h
       JOIN "survey_definition" d ON d.id = h.survey_id
       WHERE h.user_id = ?
       ORDER BY h.created_at DESC
       LIMIT ?`,
    )
    .bind(userId, limit)
    .all<HistoryWithSurvey>();
  return results ?? [];
}

export async function getHistoryByResponseId(
  db: D1Database,
  responseId: number,
): Promise<ScannerHistoryRow | null> {
  return db
    .prepare('SELECT * FROM "scanner_history" WHERE "response_id" = ?')
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
