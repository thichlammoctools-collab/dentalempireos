// Admin API: Re-generate AI analysis + plan for a scanner response.
// POST /api/admin/scanner/regenerate-ai?id=<responseId>
// Admin-only (via middleware auth check)

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { isAiEnabled } from '../../../../lib/ai-settings-db';
import { getRetainedScannerResponseCanonicalOwner } from '../../../../lib/scanner-response-operation-fence';
import {
  claimScannerAiJobDispatch,
  confirmScannerAiJobDispatched,
  enqueueScannerAiJob,
} from '../../../../lib/ai-operations';
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
  const id = parseInt(url.searchParams.get('id') ?? '', 10);
  if (!id) return badRequest('id is required');

  // Admin regeneration still processes raw response data; it requires the same
  // retained canonical owner invariant as user-initiated AI work.
  if (!await getRetainedScannerResponseCanonicalOwner(env.DB, id)) {
    return badRequest('Response is expired, missing, or has no canonical history owner');
  }

  const aiEnabled = await isAiEnabled(env.DB);
  if (!aiEnabled) {
    return json({ error: 'AI is not enabled. Please configure AI settings first.' }, 400);
  }

  const job = await enqueueScannerAiJob(env.DB, id, 'analysis');
  if (!job.queued) return json({ error: 'Bản soi chiếu đang được tạo.' }, 409);
  if (await claimScannerAiJobDispatch(env.DB, id, 'analysis', job.runId)) {
    try {
      await getScannerAiQueue(env, 'analysis').send({ responseId: id, jobType: 'analysis', runId: job.runId });
      await confirmScannerAiJobDispatched(env.DB, id, 'analysis', job.runId);
    } catch (error) {
      console.error('[regenerate-ai] Queue dispatch deferred to scheduled retry:', error);
    }
  }

  return json({ success: true, queued: true, job: { type: 'analysis', runId: job.runId } }, 202);
};
