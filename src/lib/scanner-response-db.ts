// Data access layer for scanner_response — the generic response table
// that stores answers as JSON, replacing the column-per-question survey_responses.
// Uses scoring-engine.ts to compute dimension scores from configurable rules.

import type { ResponseMap } from './scoring-engine';
import { calculateAllScores } from './scoring-engine';
import {
  type ScoringRules,
  type SurveyQuestionRow,
  parseScoringRules,
  parseOptions,
  parseScaleLabels,
} from './survey-config-db';

// ── Row Types ───────────────────────────────────────────

export interface ScannerResponseRow {
  id: number;
  survey_id: string;
  created_at: string;
  lang: string;
  owner_name: string | null;
  clinic_name: string | null;
  clinic_address: string | null;
  clinic_phone: string | null;
  email: string | null;
  years_in_operation: number | null;
  staff_count: number | null;
  responses_json: string;
  scores_json: string | null;
  ai_analysis: string | null;
  ai_analyzed_at: string | null;
  ai_plan: string | null;
  ai_analysis_status: string;
  ai_plan_status: string;
  pdf_combined_key: string | null;
  pdf_plan_key: string | null;
  pdf_analysis_key: string | null;
  image_analysis_key: string | null;
  image_plan_key: string | null;
  retention_tier: ScannerRetentionTier;
  expires_at: string;
}

export type ScannerRetentionTier = 'guest' | 'account_free' | 'credit_paid';

export const SCANNER_RETENTION_DAYS: Record<ScannerRetentionTier, number> = {
  guest: 3,
  account_free: 30,
  credit_paid: 365,
};

export function getScannerRetentionExpiry(tier: ScannerRetentionTier, from = new Date()): string {
  const expiresAt = new Date(from);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + SCANNER_RETENTION_DAYS[tier]);
  return expiresAt.toISOString();
}

export function isScannerResponseExpired(response: Pick<ScannerResponseRow, 'expires_at'>, now = new Date()): boolean {
  return new Date(response.expires_at).getTime() <= now.getTime();
}

// ── Input Types ─────────────────────────────────────────

export interface ScannerResponsePollingDto {
  ai_analysis: string | null;
  ai_plan: string | null;
  ai_analysis_status: string;
  ai_plan_status: string;
  ai_analysis_error: string | null;
  ai_plan_error: string | null;
}

/**
 * The raw Scanner response contains contact data and unredacted answers. Raw
 * reads must be authorized through scanner_history; polling receives this DTO
 * instead of a database row.
 */
export async function getOwnedScannerResponsePollingDto(
  db: D1Database,
  responseId: number,
  userId: string,
): Promise<ScannerResponsePollingDto | null> {
  return await db.prepare(
    `SELECT response."ai_analysis", response."ai_plan", response."ai_analysis_status", response."ai_plan_status",
        analysis_job."error_message" AS "ai_analysis_error", plan_job."error_message" AS "ai_plan_error"
     FROM "scanner_response" response
     INNER JOIN "scanner_history" history ON history."response_id" = response."id"
     LEFT JOIN "scanner_ai_job" analysis_job
       ON analysis_job."response_id" = response."id" AND analysis_job."job_type" = 'analysis'
     LEFT JOIN "scanner_ai_job" plan_job
       ON plan_job."response_id" = response."id" AND plan_job."job_type" = 'plan'
     WHERE response."id" = ? AND history."user_id" = ? AND response."expires_at" > ?
     LIMIT 1`,
  ).bind(responseId, userId, new Date().toISOString()).first<ScannerResponsePollingDto>() ?? null;
}

export interface ScannerResponseInput {
  survey_id: string;
  lang?: string;
  owner_name?: string | null;
  clinic_name?: string | null;
  clinic_address?: string | null;
  clinic_phone?: string | null;
  email?: string | null;
  years_in_operation?: number | null;
  staff_count?: number | null;
  retention_tier: ScannerRetentionTier;
  expires_at: string;
  /** Authenticated submissions are idempotently bound before this raw row exists. */
  submission_id?: string | null;
  responses: ResponseMap;
}

// ── Helpers ─────────────────────────────────────────────

export function parseResponses(json: string | null | undefined): ResponseMap {
  if (!json) return {};
  try {
    return JSON.parse(json) as ResponseMap;
  } catch {
    return {};
  }
}

export function parseScores(json: string | null | undefined): Record<string, number> {
  if (!json) return {};
  try {
    return JSON.parse(json) as Record<string, number>;
  } catch {
    return {};
  }
}

export function maskEmail(email: string): string {
  const atIdx = email.indexOf('@');
  if (atIdx <= 0) return '***';
  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'*'.repeat(Math.max(3, local.length - 2))}${domain}`;
}

// ── Build a clean answer map from raw form data ────────

/**
 * Normalize raw form data into the canonical ResponseMap format expected by
 * the scoring engine. Questions with type 'select' or 'yesno' produce numbers,
 * 'textarea' and 'radio' produce strings.
 */
export function buildResponsesMap(
  raw: Record<string, unknown>,
  questions: SurveyQuestionRow[],
): ResponseMap {
  const map: ResponseMap = {};

  for (const q of questions) {
    const value = raw[q.question_id];
    if (value === undefined || value === null || value === '') continue;

    if (q.type === 'select' || q.type === 'yesno') {
      const num = typeof value === 'number' ? value : parseInt(String(value), 10);
      if (Number.isFinite(num)) {
        map[q.question_id] = num;
      }
    } else {
      map[q.question_id] = String(value);
    }
  }

  return map;
}

/** Validate that required questions have answers. */
export function validateRequiredAnswers(
  responses: ResponseMap,
  questions: SurveyQuestionRow[],
): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const q of questions) {
    if (q.required === 1) {
      const v = responses[q.question_id];
      if (v === undefined || v === null || v === '') {
        missing.push(q.question_id);
      }
    }
  }
  return { ok: missing.length === 0, missing };
}

// ── CRUD ────────────────────────────────────────────────

export async function createScannerResponse(
  db: D1Database,
  input: ScannerResponseInput,
  scoringRules: ScoringRules | null,
): Promise<{ id: number; scores: Record<string, number> }> {
  if (input.submission_id) {
    const existing = await db.prepare(
      'SELECT "id", "scores_json" FROM "scanner_response" WHERE "submission_id" = ?',
    ).bind(input.submission_id).first<{ id: number; scores_json: string | null }>();
    if (existing) return { id: existing.id, scores: parseScores(existing.scores_json) };
  }
  const scores = scoringRules
    ? calculateAllScores(input.responses, scoringRules)
    : {};

  let result: { id: number } | null = null;
  try {
    result = await db
      .prepare(
        `INSERT INTO "scanner_response"
           ("survey_id","lang","owner_name","clinic_name","clinic_address","clinic_phone","email",
             "years_in_operation","staff_count","retention_tier","expires_at","submission_id","responses_json","scores_json")
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
         RETURNING "id"`,
      )
      .bind(
        input.survey_id,
        input.lang ?? 'vi',
        input.owner_name ?? null,
        input.clinic_name ?? null,
        input.clinic_address ?? null,
        input.clinic_phone ?? null,
        input.email ?? null,
        input.years_in_operation ?? null,
        input.staff_count ?? null,
        input.retention_tier,
        input.expires_at,
        input.submission_id ?? null,
        JSON.stringify(input.responses),
        JSON.stringify(scores),
      )
      .first<{ id: number }>();
  } catch (err) {
    if (input.submission_id) {
      const raced = await db.prepare(
        'SELECT "id", "scores_json" FROM "scanner_response" WHERE "submission_id" = ?',
      ).bind(input.submission_id).first<{ id: number; scores_json: string | null }>();
      if (raced) return { id: raced.id, scores: parseScores(raced.scores_json) };
    }
    console.error('[scanner-response-db] Insert failed:', err);
    throw new Error('Không thể lưu kết quả khảo sát. Vui lòng thử lại.');
  }

  if (!result) throw new Error('Không thể tạo bản ghi khảo sát.');

  return { id: result.id, scores };
}

export async function getScannerResponse(
  db: D1Database,
  id: number,
): Promise<ScannerResponseRow | null> {
  return await db
    .prepare('SELECT * FROM "scanner_response" WHERE "id" = ?')
    .bind(id)
    .first<ScannerResponseRow>() ?? null;
}

export async function listScannerResponses(
  db: D1Database,
  opts: {
    surveyId?: string;
    limit?: number;
    offset?: number;
    minTotalScore?: number;
    maxTotalScore?: number;
  } = {},
): Promise<ScannerResponseRow[]> {
  const { surveyId, limit = 50, offset = 0, minTotalScore, maxTotalScore } = opts;

  const where: string[] = ['1=1'];
  const params: unknown[] = [];

  if (surveyId) {
    where.push('"survey_id" = ?');
    params.push(surveyId);
  }
  // JSON extraction — D1 supports json_extract
  if (typeof minTotalScore === 'number') {
    where.push("CAST(json_extract(\"scores_json\", '$.total') AS REAL) >= ?");
    params.push(minTotalScore);
  }
  if (typeof maxTotalScore === 'number') {
    where.push("CAST(json_extract(\"scores_json\", '$.total') AS REAL) <= ?");
    params.push(maxTotalScore);
  }

  params.push(limit, offset);

  const sql = `
    SELECT * FROM "scanner_response"
    WHERE ${where.join(' AND ')}
    ORDER BY "created_at" DESC
    LIMIT ? OFFSET ?
  `;

  const result = await db
    .prepare(sql)
    .bind(...params)
    .all<ScannerResponseRow>();

  return result.results ?? [];
}

export async function countScannerResponses(
  db: D1Database,
  surveyId?: string,
): Promise<number> {
  const sql = surveyId
    ? 'SELECT COUNT(*) AS total FROM "scanner_response" WHERE "survey_id" = ?'
    : 'SELECT COUNT(*) AS total FROM "scanner_response"';
  const stmt = db.prepare(sql);
  const row = surveyId
    ? await stmt.bind(surveyId).first<{ total: number }>()
    : await stmt.first<{ total: number }>();
  return row?.total ?? 0;
}

export async function updateAiAnalysis(
  db: D1Database,
  id: number,
  analysis: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE "scanner_response"
       SET "ai_analysis" = ?, "ai_analyzed_at" = datetime('now')
       WHERE "id" = ?`,
    )
    .bind(analysis, id)
    .run();
}

export async function updateAiPlan(
  db: D1Database,
  id: number,
  plan: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE "scanner_response"
       SET "ai_plan" = ?
       WHERE "id" = ?`,
    )
    .bind(plan, id)
    .run();
}

export async function setScannerPdfKey(
  db: D1Database,
  id: number,
  type: 'combined' | 'plan' | 'analysis',
  key: string,
): Promise<void> {
  const column = type === 'combined' ? 'pdf_combined_key' : type === 'plan' ? 'pdf_plan_key' : 'pdf_analysis_key';
  await db.prepare(`UPDATE "scanner_response" SET "${column}" = ? WHERE "id" = ?`).bind(key, id).run();
}


// ── AI Context Builder ──────────────────────────────────

export interface AiContext {
  survey_id: string;
  years_in_operation: number | null;
  staff_count: number | null;
  lang: string;
  scores: Record<string, number>;
  /** Schema-controlled scalar and multiple-choice metadata only. */
  responses: Record<string, unknown>;
}

const MAX_PROVIDER_ANSWERS = 40;
const MAX_LOCAL_SOURCE_FREE_TEXT_VALUES = 20;
const MAX_LOCAL_SOURCE_FREE_TEXT_LENGTH = 1_000;

/**
 * Returns a bounded raw textarea list for local output-echo detection only.
 * Callers must never put these values in provider messages, prompts, or durable
 * AI artifacts.
 */
export function getScannerSourceFreeText(
  response: ScannerResponseRow,
  questions: SurveyQuestionRow[],
): string[] {
  const responses = parseResponses(response.responses_json);
  return questions
    .filter((question) => question.type === 'textarea')
    .map((question) => responses[question.question_id])
    .filter((value): value is string | number | boolean => value !== undefined && value !== null)
    .map((value) => String(value).replace(/\s+/g, ' ').trim().slice(0, MAX_LOCAL_SOURCE_FREE_TEXT_LENGTH))
    // Kept for the plan-retention PII guard: free-text source values must never
    // be copied into the durable normalized action plan. Short identifiers are
    // retained too; the guard uses token-aware matching for those values.
    .filter(Boolean)
    .slice(0, MAX_LOCAL_SOURCE_FREE_TEXT_VALUES);
}

/**
 * Builds provider-safe answer data. Free-form textarea content and all
 * owner/clinic/contact columns are deliberately excluded. Radio values are
 * included only when they exactly match a configured option, so a stored
 * arbitrary string can never become provider input.
 */
export function buildAiContext(
  response: ScannerResponseRow,
  questions: SurveyQuestionRow[],
): AiContext {
  const responses = parseResponses(response.responses_json);
  const scores = parseScores(response.scores_json);
  const enrichedResponses: Record<string, unknown> = {};

  for (const q of questions.slice(0, MAX_PROVIDER_ANSWERS)) {
    const value = responses[q.question_id];
    if (value === undefined || q.type === 'textarea') continue;

    if (q.type === 'select' || q.type === 'yesno') {
      const numericValue = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(numericValue)) continue;
      const labels = parseScaleLabels(q.scale_labels_vi);
      enrichedResponses[q.question_id] = {
        value: numericValue,
        label_vi: labels[String(numericValue)] ?? null,
        question_vi: q.label_vi,
        dimension: q.dimension,
      };
      continue;
    }

    if (q.type === 'radio' && typeof value === 'string') {
      const options = parseOptions(q.options_vi);
      const optionIndex = options.indexOf(value);
      if (optionIndex < 0) continue;
      enrichedResponses[q.question_id] = {
        option_index: optionIndex,
        option_vi: options[optionIndex],
        question_vi: q.label_vi,
        dimension: q.dimension,
      };
    }
  }

  return {
    survey_id: response.survey_id,
    years_in_operation: response.years_in_operation,
    staff_count: response.staff_count,
    lang: response.lang,
    scores,
    responses: enrichedResponses,
  };
}

// ── Re-export commonly used scoring helpers ────────────

export { parseScoringRules, parseOptions, parseScaleLabels };
