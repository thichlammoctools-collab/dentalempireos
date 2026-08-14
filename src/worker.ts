import { handle } from '@astrojs/cloudflare/handler';
import {
  getScannerAiQueue,
  processScannerAiQueueMessage,
  retryDelaySeconds,
  type ScannerAiQueueMessage,
} from './lib/scanner-ai-queue';
import {
  finishScannerAiJob,
  reclaimStaleScannerAiJobs,
  requeueScannerAiJob,
} from './lib/ai-operations';
import { updateAiAnalysisStatus, updateAiPlanStatus } from './lib/scanner-response-db';

const SCANNER_RESPONSE_PURGE_BATCH_SIZE = 100;

async function purgeExpiredScannerResponses(env: Cloudflare.Env): Promise<void> {
  const now = new Date().toISOString();
  const { results = [] } = await env.DB.prepare(
    `SELECT "id", "pdf_combined_key", "pdf_plan_key", "pdf_analysis_key", "image_analysis_key", "image_plan_key"
     FROM "scanner_response"
     WHERE "expires_at" <= ?
     ORDER BY "expires_at" ASC
     LIMIT ?`,
  ).bind(now, SCANNER_RESPONSE_PURGE_BATCH_SIZE).all<{
    id: number;
    pdf_combined_key: string | null;
    pdf_plan_key: string | null;
    pdf_analysis_key: string | null;
    image_analysis_key: string | null;
    image_plan_key: string | null;
  }>();

  for (const response of results) {
    const keys = [
      response.pdf_combined_key,
      response.pdf_plan_key,
      response.pdf_analysis_key,
      response.image_analysis_key,
      response.image_plan_key,
    ].filter((key): key is string => Boolean(key));
    await Promise.all(keys.map((key) => env.MEDIA.delete(key)));

    await env.DB.batch([
      // Improvement-loop plans retain normalized recommendations and score-only
      // snapshots after raw Scanner answers expire. Detach every response link
      // before deleting the source row; plans remain readable by their owner.
      env.DB.prepare(
        `UPDATE "scanner_action_plan"
         SET "source_response_id" = NULL,
             "source_response_purged_at" = COALESCE("source_response_purged_at", ?)
         WHERE "source_response_id" = ?`,
      ).bind(now, response.id),
      env.DB.prepare(
        'UPDATE "scanner_action_plan_score_snapshot" SET "response_id" = NULL WHERE "response_id" = ?',
      ).bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_guest_report" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_history" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_credit_run" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_ai_job" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_response" WHERE "id" = ?').bind(response.id),
    ]);
  }

  try {
    await env.DB.prepare('DELETE FROM "scanner_guest_request" WHERE "created_at" < ?')
      .bind(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .run();
  } catch (error) {
    // The guest-report tables may not exist until the corresponding migration runs.
    console.warn('[scanner-retention] Guest request cleanup skipped:', error);
  }
}

const MAX_QUEUE_ATTEMPTS = 3;
const SCANNER_AI_QUEUE_CONCURRENCY = 3;

async function setScannerAiResponseStatus(
  env: Cloudflare.Env,
  job: ScannerAiQueueMessage,
  status: 'queued' | 'failed',
): Promise<void> {
  await (job.jobType === 'analysis'
    ? updateAiAnalysisStatus(env.DB, job.responseId, status)
    : updateAiPlanStatus(env.DB, job.responseId, status));
}

async function processQueueMessage(
  message: Message<ScannerAiQueueMessage>,
  env: Cloudflare.Env,
): Promise<void> {
  const result = await processScannerAiQueueMessage(env, message.body);
  if (result.completed || !result.retryable) return;

  if (message.attempts < MAX_QUEUE_ATTEMPTS) {
    // Only the active same-run lease can be requeued; a late redelivery must
    // never replace a newer run or start provider work concurrently.
    if (await requeueScannerAiJob(env.DB, message.body.responseId, message.body.jobType, message.body.runId)) {
      await setScannerAiResponseStatus(env, message.body, 'queued');
      message.retry({ delaySeconds: retryDelaySeconds(message.attempts) });
    }
    return;
  }

  // A stale duplicate may have been superseded while it was executing. Finish
  // only an active same-run lease; never overwrite a newer run's UI state.
  if (await finishScannerAiJob(
    env.DB,
    message.body.responseId,
    message.body.jobType,
    message.body.runId,
    'failed',
    'Queue retry limit reached',
  )) {
    await setScannerAiResponseStatus(env, message.body, 'failed');
  }
}

async function reapStaleScannerAiJobs(env: Cloudflare.Env): Promise<void> {
  const reclaimed = await reclaimStaleScannerAiJobs(env.DB);
  for (const job of reclaimed) {
    await setScannerAiResponseStatus(env, job, 'queued');
    try {
      await getScannerAiQueue(env, job.jobType).send(job);
    } catch (error) {
      // Keep the job visible as failed rather than indefinitely queued when a
      // reaper dispatch itself cannot reach Queues. A user/admin can retry it.
      await finishScannerAiJob(env.DB, job.responseId, job.jobType, job.runId, 'failed', 'Stale-job redispatch failed');
      await setScannerAiResponseStatus(env, job, 'failed');
      console.error('[scanner-ai-reaper] Queue redispatch failed:', error);
    }
  }
}

export default {
  fetch: handle,

  async scheduled(_controller: ScheduledController, env: Cloudflare.Env): Promise<void> {
    await Promise.all([
      purgeExpiredScannerResponses(env),
      reapStaleScannerAiJobs(env),
    ]);
  },

  async queue(batch: MessageBatch<ScannerAiQueueMessage>, env: Cloudflare.Env): Promise<void> {
    // Queue batches may contain unrelated reports. A bounded pool prevents one
    // slow model response from making every later Scanner wait in sequence.
    for (let index = 0; index < batch.messages.length; index += SCANNER_AI_QUEUE_CONCURRENCY) {
      await Promise.all(batch.messages
        .slice(index, index + SCANNER_AI_QUEUE_CONCURRENCY)
        .map((message) => processQueueMessage(message, env)));
    }
  },
} satisfies ExportedHandler<Cloudflare.Env, ScannerAiQueueMessage>;
