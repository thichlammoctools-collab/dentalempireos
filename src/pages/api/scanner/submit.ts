// API: Submit a scanner response
// POST /api/scanner/submit
// Body: { survey_id, lang, owner_name?, clinic_name, email?, responses: {...}, save_profile?: bool }
// Requires auth — returns 401 { requiresAuth: true } if not logged in

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import {
  getSurveyDefinitionById,
  parseScoringRules,
} from '../../../lib/survey-config-db';
import {
  createScannerResponse,
  buildResponsesMap,
  validateRequiredAnswers,
  parseScores,
} from '../../../lib/scanner-response-db';
// AI now triggered on-demand via /api/scanner/run-ai
import { createAuth } from '../../../lib/auth';
import { upsertClinicProfile } from '../../../lib/clinic-profile-db';
import { addToHistory } from '../../../lib/scanner-history-db';
import { getScoreLevel } from '../../../lib/scoring-engine';
import { hasAccess } from '../../../lib/payos-db';

export const prerender = false;

function asString(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'number') return String(v);
  return null;
}

function asInt(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : null;
}

export const POST: APIRoute = async (ctx) => {
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const surveyId = asString(body.survey_id);
  if (!surveyId) return badRequest('survey_id is required');

  // Auth check — require login
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ requiresAuth: true, message: 'Vui lòng đăng nhập để tiếp tục' }, 401);
  }

  const lang = body.lang === 'en' ? 'en' : 'vi';

  // Load definition
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return badRequest('Survey not found');
  if (def.status !== 'active') return badRequest('Survey is not active');

  // Access check: free scanners are open, paid scanners require active access
  if (!def.is_free) {
    const appRow = await env.DB
      .prepare('SELECT "id" FROM "ai_application" WHERE "slug" = ? OR "id" = ?')
      .bind(def.slug, `survey-${def.id}`)
      .first<{ id: string }>();
    if (appRow) {
      const prodRow = await env.DB
        .prepare('SELECT "id" FROM "product" WHERE "app_id" = ? AND "is_active" = 1')
        .bind(appRow.id)
        .first<{ id: string }>();
      if (prodRow) {
        const canAccess = await hasAccess(env.DB, session.user.id, prodRow.id);
        if (!canAccess) {
          return json({ requiresAuth: true, message: 'Bạn cần mở khóa scanner này trước.' }, 403);
        }
      }
    }
  }

  // Validate clinic_name + email
  const clinicName = asString(body.clinic_name);
  if (!clinicName) return badRequest('clinic_name is required');

  const email = asString(body.email);
  if (email && !email.includes('@')) return badRequest('Invalid email');

  // Load all questions for this survey (across all sections)
  const sectionsResult = await env.DB
    .prepare(
      `SELECT q.*
       FROM "survey_question" q
       INNER JOIN "survey_section" s ON q."section_id" = s."id"
       WHERE s."survey_id" = ?`,
    )
    .bind(surveyId)
    .all<any>();
  const allQuestions = sectionsResult.results ?? [];

  // Build responses map (typed)
  const responsesMap = buildResponsesMap(body, allQuestions);

  // Validate required answers
  const requiredCheck = validateRequiredAnswers(responsesMap, allQuestions);
  if (!requiredCheck.ok) {
    return badRequest(`Missing required answers: ${requiredCheck.missing.join(', ')}`);
  }

  // Calculate scores
  const scoringRules = parseScoringRules(def.scoring_rules);

  // Insert response (scoring happens inside)
  const { id } = await createScannerResponse(env.DB, {
    survey_id: surveyId,
    lang,
    owner_name: asString(body.owner_name),
    clinic_name: clinicName,
    clinic_address: asString(body.clinic_address),
    email,
    years_in_operation: asInt(body.years_in_operation),
    staff_count: asInt(body.staff_count),
    responses: responsesMap,
  }, scoringRules);

  // Add to scanner history
  const scoringResult = await env.DB
    .prepare('SELECT scores_json FROM scanner_response WHERE id = ?')
    .bind(id)
    .first<{ scores_json: string | null }>();
  const parsedScores = scoringResult?.scores_json ? parseScores(scoringResult.scores_json) : {};
  const totalScore = parsedScores.total ?? 0;
  const level = getScoreLevel(totalScore, scoringRules ?? {
    dimensions: [],
    total_formula: 'average',
    thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
  }, lang);

  // Upsert clinic profile if user wants to save — non-critical
  const saveProfile = body.save_profile === true;
  if (saveProfile) {
    upsertClinicProfile(env.DB, {
      id: session.user.id,
      name: asString(body.owner_name),
      clinic_name: clinicName,
      clinic_address: asString(body.clinic_address),
    }).catch((err) => console.error('[submit] upsertClinicProfile failed:', err));
  }

  // addToHistory is non-critical — don't fail submit if it errors
  addToHistory(env.DB, {
    user_id: session.user.id,
    survey_id: surveyId,
    response_id: id,
    score_total: totalScore,
    score_label: level.label_vi,
  }).catch((err) => console.error('[submit] addToHistory failed:', err));

  return json(
    {
      success: true,
      id,
      redirect: `/scanner/result/${id}`,
    },
    201,
  );
};