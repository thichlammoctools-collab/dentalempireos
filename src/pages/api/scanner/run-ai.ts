// API: Queue AI analysis/plan generation on-demand (click-to-run).
// POST /api/scanner/run-ai
// Body: { response_id: number, type: 'analysis' | 'plan' }
// Requires auth — returns 401 if not logged in.
// Cloudflare Queues runs the work durably; the client polls D1 for progress.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { isResponseOwnedByUser } from '../../../lib/scanner-history-db';
import { createAuth } from '../../../lib/auth';
import { getScannerResponse, updateAiAnalysisStatus, updateAiPlanStatus } from '../../../lib/scanner-response-db';
import { canAccessScanner } from '../../../lib/entitlement-check';
import { getUserByEmail } from '../../../lib/user-db';
import { enqueueScannerAiJob, finishScannerAiJob, isScannerAiJobRunning, reserveAiQuota } from '../../../lib/ai-operations';
import { getScannerAiQueue } from '../../../lib/scanner-ai-queue';

export const prerender = false;

export const POST: APIRoute = async (ctx) => {
  const body = (await ctx.request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  const responseId = typeof body.response_id === 'number' ? body.response_id : parseInt(String(body.response_id), 10);
  if (!responseId || Number.isNaN(responseId)) {
    return badRequest('response_id is required');
  }

  const type: 'analysis' | 'plan' | null = body.type === 'analysis' || body.type === 'plan'
    ? body.type
    : null;
  if (!type) return badRequest('type must be "analysis" or "plan"');

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

  if (type === 'plan' && !response.ai_analysis?.trim()) {
    return json({ error: 'Hoàn tất Bản soi chiếu hệ thống trước khi tạo Kế hoạch 30 ngày.' }, 409);
  }
  if (await isScannerAiJobRunning(env.DB, responseId, type)) {
    return json({ error: 'Báo cáo AI này đang được tạo. Vui lòng chờ kết quả hiện tại.' }, 409);
  }

  const feature = type === 'analysis' ? 'scanner_analysis' : 'scanner_plan';
  const quota = await reserveAiQuota(env.DB, session.user.id, feature);
  if (!quota.allowed) return json({ error: 'Bạn đã đạt giới hạn tạo báo cáo AI trong giờ này.', quota }, 429);

  const job = await enqueueScannerAiJob(env.DB, responseId, type);
  if (!job.queued) {
    return json({ error: 'Báo cáo AI này đang được tạo. Vui lòng chờ kết quả hiện tại.' }, 409);
  }

  try {
    await (type === 'analysis'
      ? updateAiAnalysisStatus(env.DB, responseId, 'queued')
      : updateAiPlanStatus(env.DB, responseId, 'queued'));
    await getScannerAiQueue(env, type).send({
      responseId,
      jobType: type,
      runId: job.runId,
      userId: session.user.id,
    });
  } catch (error) {
    console.error('[run-ai] Queue dispatch failed:', error);
    await finishScannerAiJob(env.DB, responseId, type, job.runId, 'failed', 'Queue dispatch failed');
    await (type === 'analysis'
      ? updateAiAnalysisStatus(env.DB, responseId, 'failed')
      : updateAiPlanStatus(env.DB, responseId, 'failed'));
    return json({ error: 'Không thể xếp hàng tạo báo cáo AI. Vui lòng thử lại.' }, 503);
  }

  return json({ queued: true, type, job: { type, runId: job.runId } }, 202);
};
