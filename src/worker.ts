import { handle } from '@astrojs/cloudflare/handler';
import {
  processScannerAiQueueMessage,
  retryDelaySeconds,
  type ScannerAiQueueMessage,
} from './lib/scanner-ai-queue';
import { requeueScannerAiJob } from './lib/ai-operations';
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
      env.DB.prepare('DELETE FROM "scanner_guest_report" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_history" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_credit_run" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_report_image_credit_run" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_report_image_job" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_ai_job" WHERE "response_id" = ?').bind(response.id),
      env.DB.prepare('DELETE FROM "scanner_response" WHERE "id" = ?').bind(response.id),
    ]);
  }

  await env.DB.prepare('DELETE FROM "scanner_guest_request" WHERE "created_at" < ?')
    .bind(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .run();
}

const MAX_QUEUE_ATTEMPTS = 3;
const SCANNER_AI_QUEUE_CONCURRENCY = 3;

async function processQueueMessage(
  message: Message<ScannerAiQueueMessage>,
  env: Cloudflare.Env,
): Promise<void> {
  const result = await processScannerAiQueueMessage(env, message.body);
  if (!result.completed && result.retryable && message.attempts < MAX_QUEUE_ATTEMPTS) {
    await requeueScannerAiJob(env.DB, message.body.responseId, message.body.jobType, message.body.runId);
    await (message.body.jobType === 'analysis'
      ? updateAiAnalysisStatus(env.DB, message.body.responseId, 'queued')
      : updateAiPlanStatus(env.DB, message.body.responseId, 'queued'));
    message.retry({ delaySeconds: retryDelaySeconds(message.attempts) });
  }
}

export default {
  fetch: handle,

  async scheduled(_controller: ScheduledController, env: Cloudflare.Env): Promise<void> {
    await purgeExpiredScannerResponses(env);
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
