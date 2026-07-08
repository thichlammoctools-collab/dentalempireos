/**
 * R2 storage helpers for streaming — saves final text to R2 after streaming completes.
 */

export interface R2SaveResult {
  key: string;
  size: number;
}

/**
 * Stream from a ReadableStream while accumulating text, then save to R2.
 * Returns the accumulated text.
 */
export async function streamAndSaveToR2(
  env: Env,
  key: string,
  stream: ReadableStream,
  options?: { contentType?: string },
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  // Flush any remaining bytes
  fullText += decoder.decode();

  await env.MEDIA.put(key, fullText, {
    httpMetadata: {
      contentType: options?.contentType ?? 'text/plain; charset=utf-8',
    },
  });

  return fullText;
}

/**
 * Save text directly to R2 (no streaming).
 */
export async function saveTextToR2(
  env: Env,
  key: string,
  text: string,
  contentType = 'text/plain; charset=utf-8',
): Promise<R2SaveResult> {
  await env.MEDIA.put(key, text, {
    httpMetadata: { contentType },
  });
  return { key, size: text.length };
}

/**
 * Read text from R2.
 */
export async function readTextFromR2(env: Env, key: string): Promise<string | null> {
  const obj = await env.MEDIA.get(key);
  if (!obj) return null;
  return await obj.text();
}

/**
 * Generate R2 key for scanner AI analysis.
 * pattern: ai_analysis/{responseId}/analysis.md
 */
export function scannerAiR2Key(responseId: number, type: 'analysis' | 'plan'): string {
  return `ai_analysis/${responseId}/${type}.md`;
}
