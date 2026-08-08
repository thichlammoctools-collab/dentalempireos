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

export interface PurchasedPaidScanner {
  scanner_id: string;
  scanner_title_vi: string;
  scanner_slug: string;
  product_name: string;
  purchased_at: string;
  expires_at: string | null;
  used: number;
  limit: number;
  remaining: number;
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

/** List paid scanners the user can currently access, with pooled credit balance. */
export async function getPurchasedPaidScanners(
  db: D1Database,
  userId: string,
): Promise<PurchasedPaidScanner[]> {
  const now = new Date().toISOString();
  const { results } = await db
    .prepare(
      `SELECT d."id" AS "scanner_id",
              d."title_vi" AS "scanner_title_vi",
              d."slug" AS "scanner_slug",
              GROUP_CONCAT(DISTINCT p."name") AS "product_name",
              MAX(COALESCE(o."paid_at", a."granted_at")) AS "purchased_at",
              CASE WHEN SUM(CASE WHEN a."expires_at" IS NULL THEN 1 ELSE 0 END) > 0
                THEN NULL ELSE MAX(a."expires_at") END AS "expires_at",
              SUM(a."scans_used") AS "used",
              SUM(a."credits") AS "limit",
              (SUM(a."credits") - SUM(a."scans_used")) AS "remaining"
       FROM "access" a
       INNER JOIN "product" p ON p."id" = a."product_id"
       INNER JOIN "product_entitlement" pe
         ON pe."product_id" = a."product_id" AND pe."content_type" = 'scanner'
       INNER JOIN "survey_definition" d
         ON d."id" = CASE
           WHEN a."selected_scanner_id" IS NOT NULL THEN a."selected_scanner_id"
           ELSE pe."content_id"
         END
         OR (a."selected_scanner_id" IS NULL AND pe."content_id" = '*')
       LEFT JOIN "order" o ON o."id" = a."order_id"
       WHERE a."user_id" = ? AND a."is_active" = 1
         AND (a."expires_at" IS NULL OR a."expires_at" > ?)
       GROUP BY d."id", d."title_vi", d."slug"
       ORDER BY "purchased_at" DESC, d."title_vi" ASC`,
    )
    .bind(userId, now)
    .all<PurchasedPaidScanner>();
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

export async function getScannerUsage(
  db: D1Database,
  userId: string,
  surveyId: string,
  isFree: boolean,
): Promise<{ used: number; limit: number; remaining: number }> {
  if (isFree) {
    const row = await db.prepare('SELECT COUNT(*) AS used FROM "scanner_history" WHERE "user_id" = ? AND "survey_id" = ?').bind(userId, surveyId).first<{ used: number }>();
    const used = row?.used ?? 0;
    return {
      used,
      limit: FREE_SCANNER_ATTEMPT_LIMIT,
      remaining: Math.max(0, FREE_SCANNER_ATTEMPT_LIMIT - used),
    };
  }
  // Credit-based: query from access table
  const row = await db.prepare(`
    SELECT (a."credits" - a."scans_used") AS remaining, a."credits" AS "limit"
    FROM "access" a
    LEFT JOIN "product_entitlement" pe ON pe."product_id" = a."product_id" AND pe."content_type" = 'scanner'
    WHERE a."user_id" = ?
      AND a."is_active" = 1
      AND a."credits" > a."scans_used"
      AND (a."selected_scanner_id" = ? OR (a."selected_scanner_id" IS NULL AND pe."content_id" IN (?, '*')))
    LIMIT 1
  `).bind(userId, surveyId, surveyId).first<{ remaining: number; limit: number }>();
  return { used: (row?.limit ?? 0) - (row?.remaining ?? 0), limit: row?.limit ?? 0, remaining: row?.remaining ?? 0 };
}
