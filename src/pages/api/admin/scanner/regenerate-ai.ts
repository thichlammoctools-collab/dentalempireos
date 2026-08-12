// Admin API: Re-generate AI analysis + plan for a scanner response.
// POST /api/admin/scanner/regenerate-ai?id=<responseId>
// Admin-only (via middleware auth check)

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { isAiEnabled } from '../../../../lib/ai-settings-db';
import { getScannerResponse, updateAiAnalysisStatus, updateAiPlanStatus } from '../../../../lib/scanner-response-db';
import { enqueueScannerAiJob } from '../../../../lib/ai-operations';
import { getScannerAiQueue } from '../../../../lib/scanner-ai-queue';

export const prerender = false;

export const POST: APIRoute = async ({ url, locals }) => {
  // Admin auth check (middleware already validates, but double-check here)
  const isAdmin = locals.user && (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(locals.user.email.toLowerCase());

  if (!isAdmin || !locals.user) {
    return json({ error: 'unauthorized' }, 401);
  }
  const userId = locals.user.id;

  const id = parseInt(url.searchParams.get('id') ?? '', 10);
  if (!id) return badRequest('id is required');

  const response = await getScannerResponse(env.DB, id);
  if (!response) return badRequest('Response not found');

  const aiEnabled = await isAiEnabled(env.DB);
  if (!aiEnabled) {
    return json({ error: 'AI is not enabled. Please configure AI settings first.' }, 400);
  }

  const jobs = await Promise.all((['analysis', 'plan'] as const).map(async (jobType) => {
    const job = await enqueueScannerAiJob(env.DB, id, jobType);
    if (!job.queued) return { type: jobType, queued: false };
    await (jobType === 'analysis'
      ? updateAiAnalysisStatus(env.DB, id, 'queued')
      : updateAiPlanStatus(env.DB, id, 'queued'));
    await getScannerAiQueue(env, jobType).send({
      responseId: id,
      jobType,
      runId: job.runId,
       userId,
    });
    return { type: jobType, queued: true, runId: job.runId };
  }));

  return json({ success: true, queued: true, jobs }, 202);
};
