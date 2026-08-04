// API: Trigger AI analysis/plan generation on-demand (click-to-run).
// POST /api/scanner/run-ai
// Body: { response_id: number, type: 'analysis' | 'plan' | 'all' }
// Requires auth — returns 401 if not logged in.
// Uses ctx.waitUntil() to run AI in background, returns 202 immediately.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { runAiAnalysis, runPlanAnalysis } from '../../../lib/scanner-ai';
import { isResponseOwnedByUser } from '../../../lib/scanner-history-db';
import { createAuth } from '../../../lib/auth';
import { getScannerResponse } from '../../../lib/scanner-response-db';
import { canAccessScanner } from '../../../lib/entitlement-check';
import { getUserByEmail } from '../../../lib/user-db';
import { isScannerAiJobRunning, reserveAiQuota } from '../../../lib/ai-operations';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const responseId = typeof body.response_id === 'number' ? body.response_id : parseInt(String(body.response_id), 10);
  if (!responseId || Number.isNaN(responseId)) {
    return badRequest('response_id is required');
  }

  const type: 'analysis' | 'plan' | 'all' = body.type === 'analysis' || body.type === 'plan' || body.type === 'all'
    ? body.type
    : 'all';
  if (!['analysis', 'plan', 'all'].includes(type)) {
    return badRequest('type must be "analysis", "plan", or "all"');
  }

  // Auth check
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  if (!session?.user) {
    return json({ error: 'Vui lòng đăng nhập' }, 401);
  }

  const response = await getScannerResponse(env.DB, responseId);
  if (!response) return json({ error: 'Không tìm thấy kết quả này' }, 404);

  const owned = await isResponseOwnedByUser(env.DB, session.user.id, responseId);
  const ownsByEmail = response.email
    ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id
    : false;
  if (!owned && !ownsByEmail) {
    return json({ error: 'Không có quyền với kết quả này' }, 403);
  }

  if (!await canAccessScanner(env.DB, session.user.id, response.survey_id)) {
     return json({ error: 'Scanner này yêu cầu nâng cấp dịch vụ.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }, 402);
  }

  const jobTypes: Array<'analysis' | 'plan'> = type === 'all' ? ['analysis', 'plan'] : [type];
  for (const jobType of jobTypes) {
    if (await isScannerAiJobRunning(env.DB, responseId, jobType)) {
      return json({ error: 'Báo cáo AI này đang được tạo. Vui lòng chờ kết quả hiện tại.' }, 409);
    }
  }

  const quotaFeatures = type === 'all' ? ['scanner_analysis', 'scanner_plan'] as const : [type === 'analysis' ? 'scanner_analysis' : 'scanner_plan'] as const;
  for (const feature of quotaFeatures) {
    const quota = await reserveAiQuota(env.DB, session.user.id, feature);
    if (!quota.allowed) return json({ error: 'Bạn đã đạt giới hạn tạo báo cáo AI trong giờ này.', quota }, 429);
  }

  // Queue AI work in background via waitUntil
  const tasks: Promise<void>[] = [];
  if (type === 'analysis' || type === 'all') {
    tasks.push(runAiAnalysis(env.DB, responseId, session.user.id));
  }
  if (type === 'plan' || type === 'all') {
    tasks.push(runPlanAnalysis(env.DB, responseId, session.user.id));
  }

  const waitUntil = (ctx as typeof ctx & { waitUntil?: (promise: Promise<unknown>) => void }).waitUntil;
  if (waitUntil) {
    waitUntil(Promise.allSettled(tasks));
  } else {
    // Fallback if waitUntil is unavailable — still run async but won't survive request termination
    Promise.allSettled(tasks).catch((err) => {
      console.error('[run-ai] Background task error:', err);
    });
  }

  return json({ queued: true, type }, 202);
};
