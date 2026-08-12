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
import { addToHistory, getScannerUsage } from '../../../lib/scanner-history-db';
import { getActiveCreditPricingRule, startScannerCreditRun, completeScannerCreditRun, failScannerCreditRun, InsufficientCreditsError } from '../../../lib/credit-db';
import { getScoreLevel } from '../../../lib/scoring-engine';
import { readAttributionFromPayload, recordSiteEvent, sanitizeAnonymousId } from '../../../lib/site-analytics';

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
  const anonymousId = sanitizeAnonymousId(body.anonymous_id);
  const attribution = readAttributionFromPayload(body);

  // Load definition
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return badRequest('Survey not found');
  if (def.status !== 'active') return badRequest('Survey is not active');

  const pricingRule = await getActiveCreditPricingRule(env.DB, 'scanner', surveyId);
  const usage = await getScannerUsage(env.DB, session.user.id, surveyId);
  const requiresCredits = usage.remaining === 0;
  if (requiresCredits && (!pricingRule?.credit_amount || pricingRule.credit_amount <= 0)) {
    return json({ error: 'Scanner này chưa được cấu hình giá Credits. Vui lòng liên hệ quản trị viên.' }, 503);
  }

  const clinicName = asString(body.clinic_name);
  if (!clinicName) {
    return badRequest('clinic_name is required');
  }

  const email = asString(body.email) ?? session.user.email;
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

  const clientIdempotencyKey = asString(ctx.request.headers.get('Idempotency-Key')) ?? asString(body.idempotency_key);
  const idempotencyKey = clientIdempotencyKey ?? crypto.randomUUID();
  let creditRun: Awaited<ReturnType<typeof startScannerCreditRun>>['run'] | null = null;

  if (requiresCredits && pricingRule?.credit_amount != null) {
    try {
      const started = await startScannerCreditRun(env.DB, {
        userId: session.user.id,
        surveyId,
        idempotencyKey,
        credits: pricingRule.credit_amount,
        pricingRuleId: pricingRule.id,
      });
      creditRun = started.run;
      if (!started.created && creditRun.status === 'completed' && creditRun.response_id != null) {
        return json({ success: true, id: creditRun.response_id, redirect: `/scanner/result/${creditRun.response_id}` });
      }
      if (!started.created && creditRun.status === 'reserved') {
        return json({ error: 'Yêu cầu đang được xử lý. Vui lòng thử lại sau ít phút.' }, 409);
      }
      if (!started.created && creditRun.status === 'failed') {
        return json({ error: 'Yêu cầu trước đó không hoàn tất. Hãy gửi lại với một Idempotency-Key mới.' }, 409);
      }
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return json({
          error: 'Bạn không đủ Credits để thực hiện Scanner này.',
          requiresPayment: true,
          upgradeUrl: '/account/wallet',
          upgrade_url: '/account/wallet',
        }, 402);
      }
      console.error('[submit] reserve Scanner Credits failed:', err);
      return json({ error: 'Không thể giữ Credits cho Scanner. Vui lòng thử lại.' }, 500);
    }
  }

  // Insert the response only after a paid run has atomically reserved its Credits.
  let id: number;
  try {
    ({ id } = await createScannerResponse(env.DB, {
      survey_id: surveyId,
      lang,
      owner_name: asString(body.owner_name) ?? session.user.name ?? null,
      clinic_name: clinicName,
      clinic_address: asString(body.clinic_address),
      email,
      years_in_operation: asInt(body.years_in_operation),
      staff_count: asInt(body.staff_count),
      responses: responsesMap,
    }, scoringRules));
  } catch (err) {
    if (creditRun) await failScannerCreditRun(env.DB, {
      userId: session.user.id, runId: creditRun.id, reason: 'scanner_response_creation_failed',
    });
    throw err;
  }

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
    if (creditRun) await failScannerCreditRun(env.DB, {
      userId: session.user.id, runId: creditRun.id, reason: 'scanner_history_creation_failed',
    });
    console.error('[submit] addToHistory failed:', err);
    return json({ error: 'Không thể lưu quyền truy cập kết quả. Vui lòng thử lại.' }, 500);
  }

  if (creditRun && pricingRule?.credit_amount != null) {
    try {
      await completeScannerCreditRun(env.DB, {
        userId: session.user.id,
        runId: creditRun.id,
        responseId: id,
        credits: pricingRule.credit_amount,
        priceSnapshot: {
          ruleId: pricingRule.id,
          ruleVersion: pricingRule.rule_version,
          credits: pricingRule.credit_amount,
        },
      });
    } catch (err) {
      console.error('[submit] settle Scanner Credits failed:', err);
      return json({ error: 'Kết quả đã được lưu nhưng không thể hoàn tất thanh toán Credits. Vui lòng liên hệ quản trị viên.' }, 500);
    }
  }

  if (anonymousId) {
    await recordSiteEvent(env.DB, {
      anonymousId,
      eventName: 'lead_submitted',
      pagePath: `/scanner/${def.slug}`,
      props: { lead_type: 'total_os_diagnostic', placement: attribution.utmContent ?? 'scanner_submit' },
    });
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
