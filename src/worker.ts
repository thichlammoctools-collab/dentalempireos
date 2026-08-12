import { handle } from '@astrojs/cloudflare/handler';
import {
  processScannerAiQueueMessage,
  retryDelaySeconds,
  type ScannerAiQueueMessage,
} from './lib/scanner-ai-queue';
import { requeueScannerAiJob } from './lib/ai-operations';
import { updateAiAnalysisStatus, updateAiPlanStatus } from './lib/scanner-response-db';

const MAX_QUEUE_ATTEMPTS = 3;

export default {
  fetch: handle,

  async queue(batch: MessageBatch<ScannerAiQueueMessage>, env: Cloudflare.Env): Promise<void> {
    for (const message of batch.messages) {
      const result = await processScannerAiQueueMessage(env, message.body);
      if (!result.completed && result.retryable && message.attempts < MAX_QUEUE_ATTEMPTS) {
        await requeueScannerAiJob(env.DB, message.body.responseId, message.body.jobType, message.body.runId);
        await (message.body.jobType === 'analysis'
          ? updateAiAnalysisStatus(env.DB, message.body.responseId, 'queued')
          : updateAiPlanStatus(env.DB, message.body.responseId, 'queued'));
        message.retry({ delaySeconds: retryDelaySeconds(message.attempts) });
      }
    }
  },
} satisfies ExportedHandler<Cloudflare.Env, ScannerAiQueueMessage>;
