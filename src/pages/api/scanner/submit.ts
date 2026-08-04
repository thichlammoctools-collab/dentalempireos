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
import { getClinicProfile, upsertClinicProfile } from '../../../lib/clinic-profile-db';
import { addToHistory, getScannerUsage } from '../../../lib/scanner-history-db';
import { getScannerProduct, hasScannerAccess } from '../../../lib/payos-db';
import { getScoreLevel } from '../../../lib/scoring-engine';

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

  console.log('[scanner/submit] body keys:', Object.keys(body));
  console.log('[scanner/submit] clinic_name:', body.clinic_name, typeof body.clinic_name);

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

  const isPaidScanner = !!await getScannerProduct(env.DB, surveyId);
  const paidAccess = isPaidScanner && await hasScannerAccess(env.DB, session.user.id, surveyId);
  if (isPaidScanner && !paidAccess) {
    return json({ error: 'Bạn cần mở khóa Scanner này trước khi thực hiện.', requiresPayment: true }, 402);
  }
  const usage = await getScannerUsage(env.DB, session.user.id, surveyId, !isPaidScanner);
  console.log('[scanner/submit] usage:', usage);
  if (usage.remaining <= 0) {
    return json({
      error: !isPaidScanner
        ? 'Scanner miễn phí này chỉ được thực hiện 1 lần.'
        : 'Scanner trả phí được thực hiện tối đa 3 lần trong tháng.',
      quota: usage,
    }, 429);
  }

  // Unmapped scanners collect a per-response contact snapshot. Paid scanners
  // use the account's clinic profile so reports stay consistent and verified.
  // Premium AI analysis is gated on the result page, not before scoring.
  const profile = isPaidScanner
    ? await getClinicProfile(env.DB, session.user.id)
    : null;
  const clinicName = isPaidScanner
    ? profile?.clinic_name ?? null
    : asString(body.clinic_name);
  if (!clinicName) {
    return badRequest(isPaidScanner
      ? 'Vui lòng hoàn thiện Hồ sơ phòng khám trước khi làm scanner premium.'
      : 'clinic_name is required');
  }

  const email = isPaidScanner ? session.user.email : asString(body.email);
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
    console.log('[scanner/submit] missing required answers:', requiredCheck.missing);
    return badRequest(`Missing required answers: ${requiredCheck.missing.join(', ')}`);
  }

  // Calculate scores
  const scoringRules = parseScoringRules(def.scoring_rules);

  // Insert response (scoring happens inside)
  const { id } = await createScannerResponse(env.DB, {
    survey_id: surveyId,
    lang,
    owner_name: isPaidScanner ? (profile?.name ?? session.user.name ?? null) : asString(body.owner_name),
    clinic_name: clinicName,
    clinic_address: isPaidScanner ? (profile?.clinic_address ?? null) : asString(body.clinic_address),
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
  const saveProfile = !isPaidScanner && body.save_profile === true;
  if (saveProfile) {
    upsertClinicProfile(env.DB, {
      id: session.user.id,
      name: asString(body.owner_name),
      clinic_name: clinicName,
      clinic_address: asString(body.clinic_address),
    }).catch((err) => console.error('[submit] upsertClinicProfile failed:', err));
  }

  // The result page verifies ownership from scanner_history. Await this write so
  // the redirect never reaches the result before the authorization row exists.
  try {
    await addToHistory(env.DB, {
      user_id: session.user.id,
      survey_id: surveyId,
      response_id: id,
      score_total: totalScore,
      score_label: level.label_vi,
    });
  } catch (err) {
    console.error('[submit] addToHistory failed:', err);
    return json({ error: 'Không thể lưu quyền truy cập kết quả. Vui lòng thử lại.' }, 500);
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
