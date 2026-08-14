// API: Submit a scanner response
// POST /api/scanner/submit
// Body: { survey_id, lang, owner_name?, clinic_name, email?, responses: {...}, save_profile?: bool }
// Requires auth except the designated Total OS Diagnostic guest-report flow.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../lib/api-helpers';
import {
  getSurveyDefinitionById,
  parseScoringRules,
} from '../../../lib/survey-config-db';
import {
  createScannerResponse,
  buildResponsesMap,
  validateRequiredAnswers,
  parseScores,
  getScannerRetentionExpiry,
  type ScannerRetentionTier,
} from '../../../lib/scanner-response-db';
// AI now triggered on-demand via /api/scanner/run-ai
import { createAuth } from '../../../lib/auth';
import { upsertClinicProfile } from '../../../lib/clinic-profile-db';
import { addToHistory, FREE_SCANNER_ATTEMPT_LIMIT } from '../../../lib/scanner-history-db';
import {
  getActiveCreditPricingRule,
  getScannerCreditRunByIdempotencyKey,
  getCapturedScannerCreditRunPrice,
  startScannerCreditRun,
  completeScannerCreditRun,
  failScannerCreditRun,
  InsufficientCreditsError,
} from '../../../lib/credit-db';
import { getScoreLevel } from '../../../lib/scoring-engine';
import { readAttributionFromPayload, recordSiteEvent, sanitizeAnonymousId } from '../../../lib/site-analytics';
import { checkGuestRequestRateLimit, createGuestReport, validateGuestLead } from '../../../lib/scanner-guest-report';
import { hashIp, subscribe } from '../../../lib/newsletter';
import { sendGuestScannerReportEmail } from '../../../lib/resend';
import { isGuestScannerSlug } from '../../../lib/guest-scanner';
import { getScannerActionPlanForUser } from '../../../lib/scanner-action-plan-db';
import {
  createOrGetScannerSubmission,
  getScannerSubmissionById,
  fingerprintScannerSubmission,
  getScannerSubmissionResponse,
  linkScannerSubmissionSnapshot,
  recordScannerSubmissionResponse,
  ScannerSubmissionMismatchError,
  reserveScannerFreeAttempt,
  settleScannerFreeAttempt,
  releaseScannerFreeAttempt,
} from '../../../lib/scanner-submission-db';

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

function actionPlanId(v: unknown): string | null {
  if (v === undefined || v === null || v === '') return null;
  if (typeof v !== 'string') return null;
  const value = v.trim();
  return value && value.length <= 100 && /^[a-zA-Z0-9-]+$/.test(value) ? value : null;
}

export const POST: APIRoute = async (ctx) => {
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const surveyId = asString(body.survey_id);
  if (!surveyId) return badRequest('survey_id is required');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });

  const lang = body.lang === 'en' ? 'en' : 'vi';
  const anonymousId = sanitizeAnonymousId(body.anonymous_id);
  const attribution = readAttributionFromPayload(body);

  // Load definition
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return badRequest('Survey not found');
  if (def.status !== 'active') return badRequest('Survey is not active');

  const requestedActionPlanId = actionPlanId(body.action_plan_id);
  if (body.action_plan_id !== undefined && !requestedActionPlanId) return badRequest('invalid_action_plan_id');
  const isGuestScanner = !session?.user && isGuestScannerSlug(def.slug);
  if (requestedActionPlanId && !session?.user) return json({ requiresAuth: true, message: 'Vui lòng đăng nhập để tiếp tục' }, 401);
  if (!session?.user && !isGuestScanner) {
    return json({ requiresAuth: true, message: 'Vui lòng đăng nhập để tiếp tục' }, 401);
  }
  if (requestedActionPlanId && session?.user) {
    // Look up only within the current owner's plans. A missing, foreign, or
    // different-survey plan remains non-enumerating; retained owner plans get
    // an explicit policy response before creating a submission or reserving credits.
    const actionPlan = await getScannerActionPlanForUser(env.DB, requestedActionPlanId, session.user.id);
    if (!actionPlan || actionPlan.survey_id !== surveyId) return notFound('not_found');
    if (actionPlan.retention_visibility === 'legacy_source_bound') {
      return json({ error: 'action_plan_read_only' }, 403);
    }
    if (actionPlan.retention_visibility === 'unavailable') {
      return json({ error: 'action_plan_unavailable' }, 410);
    }
  }
  const guestLead = isGuestScanner ? validateGuestLead(body) : null;
  if (isGuestScanner && !guestLead) {
    return badRequest('Tên phòng khám và email hợp lệ là bắt buộc.');
  }
  if (isGuestScanner) {
    const ip = ctx.request.headers.get('CF-Connecting-IP') ?? ctx.request.headers.get('x-forwarded-for');
    const ipHash = await hashIp(ip);
    if (!ipHash || !await checkGuestRequestRateLimit(env.DB, ipHash)) {
      return json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }, 429);
    }
  }

  const pricingRule = await getActiveCreditPricingRule(env.DB, 'scanner', surveyId);

  const clinicName = asString(body.clinic_name);
  if (!clinicName) {
    return badRequest('clinic_name is required');
  }

  const email = isGuestScanner ? guestLead!.email : (asString(body.email) ?? session!.user.email);
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
  const ensureAuthenticatedHistory = async (responseId: number): Promise<void> => {
    const scoringResult = await env.DB
      .prepare('SELECT scores_json FROM scanner_response WHERE id = ?')
      .bind(responseId)
      .first<{ scores_json: string | null }>();
    const parsedScores = scoringResult?.scores_json ? parseScores(scoringResult.scores_json) : {};
    const totalScore = parsedScores.total ?? 0;
    const level = getScoreLevel(totalScore, scoringRules ?? {
      dimensions: [],
      total_formula: 'average',
      thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 },
    }, lang);
    await addToHistory(env.DB, {
      user_id: session!.user.id,
      survey_id: surveyId,
      response_id: responseId,
      score_total: totalScore,
      score_label: level.label_vi,
    });
  };

  const clientIdempotencyKey = asString(ctx.request.headers.get('Idempotency-Key')) ?? asString(body.idempotency_key);
  if (clientIdempotencyKey && clientIdempotencyKey.length > 200) return badRequest('idempotency_key_too_long');
  const idempotencyKey = clientIdempotencyKey ?? crypto.randomUUID();
  const submission = session?.user
    ? await (async () => {
      try {
        return await createOrGetScannerSubmission(env.DB, {
          userId: session.user.id,
          surveyId,
          idempotencyKey,
          actionPlanId: requestedActionPlanId,
          // Include every result-affecting authenticated input, but not profile-save
          // preference or attribution. A same-key replay must mean the same result.
          fingerprint: await fingerprintScannerSubmission({
            surveyId, lang, ownerName: asString(body.owner_name), clinicName,
            clinicAddress: asString(body.clinic_address), clinicPhone: asString(body.clinic_phone),
            email, yearsInOperation: asInt(body.years_in_operation), staffCount: asInt(body.staff_count),
            responses: responsesMap, actionPlanId: requestedActionPlanId,
          }),
        });
      } catch (error) {
        if (error instanceof ScannerSubmissionMismatchError) {
          return null;
        }
        throw error;
      }
    })()
    : null;
  if (session?.user && !submission) {
    return json({ error: 'idempotency_key_reused_with_different_request' }, 409);
  }
  let creditRun: Awaited<ReturnType<typeof startScannerCreditRun>>['run'] | null = null;
  let recoveredResponseId: number | null = null;
  let freeAttemptReserved = false;

  if (submission && !submission.created) {
    // Re-read durable purge state after idempotency lookup. This closes the
    // worker/retry interleave where the worker has marked purge but has not yet
    // deleted the linked raw row.
    const durableSubmission = await getScannerSubmissionById(env.DB, submission.submission.id);
    if (!durableSubmission) return json({ error: 'scanner_submission_missing' }, 409);
    const recoveredId = await getScannerSubmissionResponse(env.DB, durableSubmission);
    if (durableSubmission.response_purged_at) {
      return json({ error: 'scanner_response_expired', responseExpired: true }, 410);
    }
    if (recoveredId !== null) {
      try {
        const existingRun = await getScannerCreditRunByIdempotencyKey(env.DB, session!.user.id, idempotencyKey);
        if (existingRun && existingRun.status !== 'completed') {
          // Fail closed before history can make the raw report accessible. The
          // starter below first repairs a legacy reserved run whose reservation
          // was already released, then restores and settles a replacement.
          // An intact reserved run is simply finalized against its own response.
          getCapturedScannerCreditRunPrice(existingRun);
          creditRun = existingRun;
          recoveredResponseId = recoveredId;
        } else if (existingRun) {
          await ensureAuthenticatedHistory(recoveredId);
        } else {
          await settleScannerFreeAttempt(env.DB, submission.submission.id);
          await ensureAuthenticatedHistory(recoveredId);
        }

        if (!creditRun) {
          let snapshotStatus = submission.submission.snapshot_status;
          if (snapshotStatus === 'pending') {
            try {
              snapshotStatus = await linkScannerSubmissionSnapshot(env.DB, submission.submission.id);
            } catch (error) {
              console.error('[submit] pending rescan snapshot recovery failed:', error);
            }
          }
          return json({ success: true, id: recoveredId, redirect: `/scanner/result/${recoveredId}`, snapshotStatus, warning: snapshotStatus === 'pending' ? 'rescan_snapshot_pending' : undefined });
        }
      } catch (error) {
        console.error('[submit] settlement recovery failed:', error);
        return json({ error: 'Không thể hoàn tất kết quả trước đó. Vui lòng thử lại cùng Idempotency-Key.' }, 500);
      }
    }
  }

  if (session?.user && !creditRun) {
    const existingRun = await getScannerCreditRunByIdempotencyKey(env.DB, session.user.id, idempotencyKey);
    if (existingRun) {
      creditRun = existingRun;
    } else {
      const reservedFree = await reserveScannerFreeAttempt(env.DB, {
        submission: submission!.submission,
        limit: FREE_SCANNER_ATTEMPT_LIMIT,
      });
      freeAttemptReserved = reservedFree.reservation?.status === 'reserved';
      if (!reservedFree.reservation && (!pricingRule?.credit_amount || pricingRule.credit_amount <= 0)) {
        return json({ error: 'Scanner này chưa được cấu hình giá Credits. Vui lòng liên hệ quản trị viên.' }, 503);
      }
    }
  }

  // An existing completed run is returned above. A remaining existing run is
  // either a failed same-key recovery or a reservation that this request owns.
  const requiresCredits = !isGuestScanner && Boolean(session?.user) && !freeAttemptReserved;
  if (requiresCredits && (creditRun !== null || pricingRule?.credit_amount != null)) {
    try {
      const started = await startScannerCreditRun(env.DB, {
        userId: session!.user.id,
        surveyId,
        idempotencyKey,
        // Also call the starter for a reserved same-key run. It repairs the
        // legacy released-reservation split state before any response/history
        // work; an intact reservation remains an in-progress conflict below.
        price: creditRun
          ? getCapturedScannerCreditRunPrice(creditRun)
          : {
            credits: pricingRule!.credit_amount!,
            priceSnapshot: {
              ruleId: pricingRule!.id,
              ruleVersion: pricingRule!.rule_version,
              credits: pricingRule!.credit_amount!,
            },
          },
      });
      creditRun = started.run;
      if (!started.created && creditRun.status === 'completed' && creditRun.response_id != null) {
        return json({ success: true, id: creditRun.response_id, redirect: `/scanner/result/${creditRun.response_id}` });
      }
      if (!started.created && creditRun.status === 'reserved') {
        if (recoveredResponseId !== null) {
          // Recovery owns a response but its earlier settlement did not finish.
          // Continue below and settle this exact durable run.
        } else {
          // A concurrent same-key request owns the reservation and may still be
          // creating the response, so do not create a competing flow.
          return json({ error: 'Yêu cầu đang được xử lý. Vui lòng thử lại cùng Idempotency-Key.' }, 409);
        }
      }
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return json({ error: 'Bạn không đủ Credits để thực hiện Scanner này.', requiresPayment: true, upgradeUrl: '/account/wallet', upgrade_url: '/account/wallet' }, 402);
      }
      console.error('[submit] reserve Scanner Credits failed:', err);
      return json({ error: 'Không thể giữ Credits cho Scanner. Vui lòng thử lại.' }, 500);
    }
  }

  // Insert the response only after a paid run has atomically reserved its Credits.
  const retentionTier: ScannerRetentionTier = isGuestScanner
    ? 'guest'
    : creditRun
      ? 'credit_paid'
      : 'account_free';
  const expiresAt = getScannerRetentionExpiry(retentionTier);
  let id: number;
  try {
    if (recoveredResponseId !== null) {
      id = recoveredResponseId;
    } else {
      ({ id } = await createScannerResponse(env.DB, {
        survey_id: surveyId,
        lang,
        owner_name: isGuestScanner ? guestLead!.ownerName : (asString(body.owner_name) ?? session!.user.name ?? null),
        clinic_name: clinicName,
        clinic_address: asString(body.clinic_address),
        clinic_phone: asString(body.clinic_phone),
        email,
        years_in_operation: asInt(body.years_in_operation),
        staff_count: asInt(body.staff_count),
        retention_tier: retentionTier,
        expires_at: expiresAt,
        submission_id: submission?.submission.id ?? null,
        responses: responsesMap,
      }, scoringRules));
    }
  } catch (err) {
    if (creditRun) await failScannerCreditRun(env.DB, {
      userId: session!.user.id, runId: creditRun.id, reason: 'scanner_response_creation_failed',
    });
    if (submission && freeAttemptReserved) {
      await releaseScannerFreeAttempt(env.DB, submission.submission.id);
    }
    throw err;
  }

  if (submission) await recordScannerSubmissionResponse(env.DB, submission.submission, id);

  if (isGuestScanner) {
    const report = await createGuestReport(env.DB, {
      responseId: id,
      email: guestLead!.email,
      ownerName: guestLead!.ownerName,
      clinicName: guestLead!.clinicName,
      anonymousId,
      attribution,
      expiresAt,
    });
    if (body.marketing_consent === true) {
      await subscribe(env.DB, {
        email: guestLead!.email,
        source: def.slug,
        anonymousId,
        attribution,
      });
    }
    if (anonymousId) {
      await recordSiteEvent(env.DB, {
        anonymousId,
        eventName: 'lead_submitted',
        pagePath: `/scanner/${def.slug}`,
        props: { lead_type: def.slug, placement: attribution.utmContent ?? 'scanner_submit' },
      });
    }
    const waitUntil = ctx.locals.cfContext?.waitUntil?.bind(ctx.locals.cfContext);
    waitUntil?.(sendGuestScannerReportEmail({
      email: guestLead!.email,
      clinicName: guestLead!.clinicName,
      token: report.token,
      lang,
      scannerTitle: def.title_vi,
    }).catch((err) => console.error('[submit] guest report email failed:', err)));
    return json({ success: true, id, redirect: `/scanner/report/${report.token}`, reportExpiresAt: report.expiresAt }, 201);
  }

  // Upsert clinic profile if user wants to save — non-critical
  const saveProfile = body.save_profile === true;
  if (saveProfile) {
    upsertClinicProfile(env.DB, {
      id: session!.user.id,
      name: asString(body.owner_name),
      clinic_name: clinicName,
      clinic_address: asString(body.clinic_address),
    }).catch((err) => console.error('[submit] upsertClinicProfile failed:', err));
  }

  // Paid reports stay inaccessible until their reservation has settled. This is
  // crucial for a recovered failed run: history is the raw-report authority.
  if (creditRun) {
    try {
      await completeScannerCreditRun(env.DB, {
        userId: session!.user.id,
        runId: creditRun.id,
        responseId: id,
      });
    } catch (err) {
      console.error('[submit] settle Scanner Credits failed:', err);
      return json({ error: 'Không thể hoàn tất thanh toán Credits. Vui lòng thử lại cùng Idempotency-Key.' }, 500);
    }
  }

  // The result page verifies ownership from scanner_history. Await this write so
  // the redirect never reaches the result before the authorization row exists.
  try {
    await ensureAuthenticatedHistory(id);
  } catch (err) {
    // The response is already durable and submission-bound. Keep either
    // reservation intact so the same key can finish history/settlement; releasing
    // here would create an unpaid raw response and a free-slot leak/race.
    console.error('[submit] addToHistory failed:', err);
    return json({ error: 'Không thể lưu quyền truy cập kết quả. Vui lòng thử lại cùng Idempotency-Key.' }, 500);
  }

  if (submission && freeAttemptReserved) {
    await settleScannerFreeAttempt(env.DB, submission.submission.id);
  }

  // The result and (if paid) settlement are already durable. A snapshot failure
  // remains pending on this same submission and is retried without a new key,
  // response, or credit reservation.
  let snapshotStatus: 'not_requested' | 'linked' | 'pending' = 'not_requested';
  if (submission) {
    try {
      snapshotStatus = await linkScannerSubmissionSnapshot(env.DB, submission.submission.id);
    } catch (error) {
      snapshotStatus = 'pending';
      console.error('[submit] action plan rescan snapshot deferred:', error);
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
      snapshotStatus,
      warning: snapshotStatus === 'pending' ? 'rescan_snapshot_pending' : undefined,
    },
    201,
  );
};
