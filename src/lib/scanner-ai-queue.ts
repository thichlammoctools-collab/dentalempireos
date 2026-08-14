import { runAiAnalysis, runPlanAnalysis, type ScannerAiRunResult } from './scanner-ai';
import { failScannerAiJobForInvalidResponse } from './ai-operations';

export type ScannerAiJobType = 'analysis' | 'plan';

export interface ScannerAiQueueMessage {
  responseId: number;
  jobType: ScannerAiJobType;
  runId: string;
  /**
   * Kept only to consume messages published before Phase 1B. The worker looks
   * up ownership from scanner_history and never trusts this queue payload.
   */
  userId?: string;
}

export function getScannerAiQueue(
  env: Cloudflare.Env,
  jobType: ScannerAiJobType,
): Queue<ScannerAiQueueMessage> {
  return jobType === 'analysis'
    ? env.SCANNER_AI_ANALYSIS_QUEUE
    : env.SCANNER_AI_PLAN_QUEUE;
}

export async function processScannerAiQueueMessage(
  env: Cloudflare.Env,
  message: ScannerAiQueueMessage,
): Promise<ScannerAiRunResult> {
  try {
    const job = await env.DB.prepare(
      `SELECT "status", "run_id" FROM "scanner_ai_job" WHERE "response_id" = ? AND "job_type" = ?`,
    ).bind(message.responseId, message.jobType).first<{ status: string; run_id: string }>();
    // At-least-once queue delivery is expected. A completed or superseded job
    // must never issue a second provider request. If its queued row outlived
    // the raw response, terminally invalidate only that exact queued run.
    if (!job || job.run_id !== message.runId || job.status !== 'queued') {
      return { completed: true, retryable: false };
    }
    const retained = await env.DB.prepare(
      `SELECT 1 FROM "scanner_response" response
       INNER JOIN "scanner_history" history ON history."response_id" = response."id"
       WHERE response."id" = ? AND julianday(response."expires_at") > julianday('now')
       LIMIT 1`,
    ).bind(message.responseId).first();
    if (!retained) {
      await failScannerAiJobForInvalidResponse(env.DB, message.responseId, message.jobType, message.runId, 'Response is expired, missing, or has no canonical history owner');
      return { completed: true, retryable: false };
    }

    // Queue payload identity is untrusted. Runners resolve canonical ownership
    // under the active retention fence immediately before provider work.
    const runResult = message.jobType === 'analysis'
      ? await runAiAnalysis(env.DB, message.responseId, undefined, message.runId)
      : await runPlanAnalysis(env.DB, message.responseId, undefined, message.runId);
    if (!runResult.completed) return runResult;

    return { completed: true, retryable: false };
  } catch (error) {
    // Network/provider failures can be retried by Cloudflare Queues. The
    // scanner job record remains the idempotency guard for duplicate delivery.
    console.error('[scanner-ai-queue] Job failed:', error);
    return { completed: false, retryable: true };
  }
}

export function retryDelaySeconds(attempt: number): number {
  return Math.min(300, 10 * 2 ** Math.max(0, attempt - 1));
}
