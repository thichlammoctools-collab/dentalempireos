import { handle } from '@astrojs/cloudflare/handler';
import {
  processScannerAiQueueMessage,
  retryDelaySeconds,
  type ScannerAiQueueMessage,
} from './lib/scanner-ai-queue';

const MAX_QUEUE_ATTEMPTS = 3;

export default {
  fetch: handle,

  async queue(batch: MessageBatch<ScannerAiQueueMessage>, env: Cloudflare.Env): Promise<void> {
    for (const message of batch.messages) {
      const result = await processScannerAiQueueMessage(env, message.body);
      if (!result.completed && result.retryable && message.attempts < MAX_QUEUE_ATTEMPTS) {
        message.retry({ delaySeconds: retryDelaySeconds(message.attempts) });
      }
    }
  },
} satisfies ExportedHandler<Cloudflare.Env, ScannerAiQueueMessage>;
