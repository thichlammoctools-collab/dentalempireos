import { runAiAnalysis, runPlanAnalysis } from './scanner-ai';
import { getScannerResponse } from './scanner-response-db';
import { getSurveyDefinitionFull } from './survey-config-db';
import { generateQueuedScannerReportImage } from './scanner-report-image';

export type ScannerAiJobType = 'analysis' | 'plan';

export interface ScannerAiQueueMessage {
  responseId: number;
  jobType: ScannerAiJobType;
  runId: string;
  userId: string;
}

export interface ScannerAiRunResult {
  completed: boolean;
  retryable: boolean;
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
    // must never issue a second provider request.
    if (!job || job.run_id !== message.runId || job.status !== 'queued') {
      return { completed: true, retryable: false };
    }

    if (message.jobType === 'analysis') {
      await runAiAnalysis(env.DB, message.responseId, message.userId);
    } else {
      await runPlanAnalysis(env.DB, message.responseId, message.userId);
    }

    const response = await getScannerResponse(env.DB, message.responseId);
    const definition = response && await getSurveyDefinitionFull(env.DB, response.survey_id);
    const reportText = message.jobType === 'analysis' ? response?.ai_analysis : response?.ai_plan;
    if (response && definition && reportText?.trim()) {
      await generateQueuedScannerReportImage(env, response, definition.definition.title_vi, message.jobType);
    }
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
