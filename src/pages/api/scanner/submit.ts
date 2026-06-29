// Public API: Submit a scanner response
// POST /api/scanner/submit
// Body: { survey_id, lang, owner_name?, clinic_name, email?, responses: {...} }

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import {
  getSurveyDefinitionById,
  parseScoringRules,
  parseLeadFields,
} from '../../../lib/survey-config-db';
import {
  createScannerResponse,
  buildResponsesMap,
  validateRequiredAnswers,
} from '../../../lib/scanner-response-db';
import { runAiAnalysis } from '../../../lib/scanner-ai';
import { isAiEnabled } from '../../../lib/ai-settings-db';

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
  const waitUntil = (ctx as { waitUntil?: (p: Promise<unknown>) => void }).waitUntil;
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const surveyId = asString(body.survey_id);
  if (!surveyId) return badRequest('survey_id is required');

  const lang = body.lang === 'en' ? 'en' : 'vi';

  // Load definition
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return badRequest('Survey not found');
  if (def.status !== 'active') return badRequest('Survey is not active');

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

  // Trigger AI analysis in background (fire-and-forget)
  if (await isAiEnabled(env.DB)) {
    waitUntil?.(runAiAnalysis(env.DB, id));
  }

  return json(
    {
      success: true,
      id,
      redirect: `/scanner/result/${id}`,
    },
    201,
  );
};