import { handle } from '@astrojs/cloudflare/handler';
import {
  processScannerAiQueueMessage,
  retryDelaySeconds,
  type ScannerAiQueueMessage,
} from './lib/scanner-ai-queue';
import { requeueScannerAiJob } from './lib/ai-operations';
import { updateAiAnalysisStatus, updateAiPlanStatus } from './lib/scanner-response-db';

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
