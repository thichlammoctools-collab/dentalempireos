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
}

// ── Input Types ─────────────────────────────────────────

export interface ScannerResponseInput {
  survey_id: string;
  lang?: string;
  owner_name?: string | null;
  clinic_name?: string | null;
  clinic_address?: string | null;
  email?: string | null;
  years_in_operation?: number | null;
  staff_count?: number | null;
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
  const scores = scoringRules
    ? calculateAllScores(input.responses, scoringRules)
    : {};

  const result = await db
    .prepare(
      `INSERT INTO "scanner_response"
        ("survey_id","lang","owner_name","clinic_name","clinic_address","email",
         "years_in_operation","staff_count","responses_json","scores_json")
       VALUES (?,?,?,?,?,?,?,?,?,?)
       RETURNING "id"`,
    )
    .bind(
      input.survey_id,
      input.lang ?? 'vi',
      input.owner_name ?? null,
      input.clinic_name ?? null,
      input.clinic_address ?? null,
      input.email ?? null,
      input.years_in_operation ?? null,
      input.staff_count ?? null,
      JSON.stringify(input.responses),
      JSON.stringify(scores),
    )
    .first<{ id: number }>();

  if (!result) throw new Error('Failed to insert scanner response');

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

// ── AI Context Builder ──────────────────────────────────

export interface AiContext {
  survey_id: string;
  clinic: string | null;
  owner: string | null;
  years_in_operation: number | null;
  staff_count: number | null;
  lang: string;
  scores: Record<string, number>;
  responses: Record<string, unknown>;
}

/**
 * Build a structured context object for the AI prompt.
 * Maps each question's answer to a human-readable field for the model.
 */
export function buildAiContext(
  response: ScannerResponseRow,
  questions: SurveyQuestionRow[],
): AiContext {
  const responses = parseResponses(response.responses_json);
  const scores = parseScores(response.scores_json);

  // Convert answer values to readable strings for the AI:
  // - textarea: keep as-is
  // - select (1-5): include the numeric value (model reads scale_labels for context)
  // - radio: keep the option string
  const enrichedResponses: Record<string, unknown> = {};

  for (const q of questions) {
    const v = responses[q.question_id];
    if (v === undefined) continue;

    if (q.type === 'select') {
      // Decode the numeric value into a labeled object
      const labels = parseScaleLabels(q.scale_labels_vi);
      enrichedResponses[q.question_id] = {
        value: v,
        label_vi: labels[String(v)] ?? String(v),
        question_vi: q.label_vi,
        dimension: q.dimension,
      };
    } else if (q.type === 'radio') {
      // Already a string (option text)
      enrichedResponses[q.question_id] = {
        value: v,
        question_vi: q.label_vi,
        dimension: q.dimension,
      };
    } else {
      enrichedResponses[q.question_id] = {
        value: v,
        question_vi: q.label_vi,
        dimension: q.dimension,
      };
    }
  }

  return {
    survey_id: response.survey_id,
    clinic: response.clinic_name,
    owner: response.owner_name,
    years_in_operation: response.years_in_operation,
    staff_count: response.staff_count,
    lang: response.lang,
    scores,
    responses: enrichedResponses,
  };
}

// ── AI Status helpers ────────────────────────────────

export async function updateAiAnalysisStatus(
  db: D1Database,
  id: number,
  status: 'pending' | 'running' | 'done' | 'failed',
): Promise<void> {
  await db
    .prepare(`UPDATE "scanner_response" SET "ai_analysis_status" = ? WHERE "id" = ?`)
    .bind(status, id)
    .run();
}

export async function updateAiPlanStatus(
  db: D1Database,
  id: number,
  status: 'pending' | 'running' | 'done' | 'failed',
): Promise<void> {
  await db
    .prepare(`UPDATE "scanner_response" SET "ai_plan_status" = ? WHERE "id" = ?`)
    .bind(status, id)
    .run();
}

// ── Re-export commonly used scoring helpers ────────────

export { parseScoringRules, parseOptions, parseScaleLabels };