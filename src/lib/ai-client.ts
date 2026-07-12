// Unified AI client — supports Anthropic and OpenAI-compatible APIs.
// Replaces scanner-ai.ts for all AI calls.

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelConfig {
  provider_id: string;
  base_url: string;
  api_key: string;
  model_id: string;
  max_tokens?: number;
}

export class AiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public provider: string,
  ) {
    super(message);
    this.name = 'AiError';
  }
}

function isOpenAIUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.includes('openai') || u.includes('v1/chat') || u.includes('zplay') || u.includes('openrouter') || u.includes('together');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries - 1) {
        await sleep(1000 * Math.pow(2, i));
      }
    }
  }
  throw lastError;
}

export async function chatCompletion(
  config: ModelConfig,
  messages: ChatMessage[],
  systemPrompt?: string,
): Promise<string> {
  const baseUrl = config.base_url.replace(/\/+$/, '');
  const cleanBase = baseUrl.replace(/\/v1$/, '');
  if (isOpenAIUrl(cleanBase)) {
    return chatOpenAI(cleanBase, config.api_key, config.model_id, messages, systemPrompt, config.max_tokens);
  } else {
    return chatAnthropic(cleanBase, config.api_key, config.model_id, messages, systemPrompt, config.max_tokens);
  }
}

async function chatOpenAI(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  systemPrompt?: string,
  maxTokens?: number,
): Promise<string> {
  const allMessages: ChatMessage[] = [];
  if (systemPrompt) allMessages.push({ role: 'system', content: systemPrompt });
  allMessages.push(...messages);

  const body: Record<string, unknown> = { model, messages: allMessages };
  if (maxTokens) body.max_tokens = maxTokens;

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new AiError(`OpenAI API error (${resp.status}): ${err}`, resp.status, 'openai');
  }

  const data = (await resp.json()) as { choices: Array<{ message: { content: string | null } }> };
  const content = data.choices[0]?.message?.content;
  if (content === null || content === undefined) throw new AiError('Empty response from OpenAI API', 200, 'openai');
  return content;
}

async function chatAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  systemPrompt?: string,
  maxTokens?: number,
): Promise<string> {
  // Preserve original role for assistant messages (fixes the role-mapping bug)
  const anthropicMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens || 8192,
    messages: anthropicMessages,
  };
  if (systemPrompt) body.system = systemPrompt;

  const resp = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new AiError(`Anthropic API error (${resp.status}): ${err}`, resp.status, 'anthropic');
  }

  const data = (await resp.json()) as { content: Array<{ type: string; text?: string }> };
  const text = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n');
  if (!text) throw new AiError('Empty response from Anthropic API', 200, 'anthropic');
  return text;
}

// ─── Streaming ────────────────────────────────────────────────────────────────

/** OpenAI Server-Sent Events streaming. */
async function* streamOpenAI(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  systemPrompt?: string,
  maxTokens?: number,
): AsyncGenerator<string> {
  const allMessages: ChatMessage[] = [];
  if (systemPrompt) allMessages.push({ role: 'system', content: systemPrompt });
  allMessages.push(...messages);

  const body: Record<string, unknown> = {
    model,
    messages: allMessages,
    stream: true,
  };
  if (maxTokens) body.max_tokens = maxTokens;

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new AiError(`OpenAI streaming error (${resp.status}): ${err}`, resp.status, 'openai');
  }

  if (!resp.body) throw new AiError('No response body for OpenAI streaming', 200, 'openai');

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** Anthropic streaming via /v1/messages with beta header. */
async function* streamAnthropic(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  systemPrompt?: string,
  maxTokens?: number,
): AsyncGenerator<string> {
  const anthropicMessages = messages.map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }));

  const body: Record<string, unknown> = {
    model,
    max_tokens: maxTokens || 8192,
    messages: anthropicMessages,
    stream: true,
  };
  if (systemPrompt) body.system = systemPrompt;

  const resp = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'prompt-caching-2025-05-14',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new AiError(`Anthropic streaming error (${resp.status}): ${err}`, resp.status, 'anthropic');
  }

  if (!resp.body) throw new AiError('No response body for Anthropic streaming', 200, 'anthropic');

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data) as {
            type?: string;
            delta?: { text?: string };
          };
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            yield parsed.delta.text;
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Returns a Workers-native ReadableStream that streams chunks to the client.
 * Uses pull() pattern to avoid Cloudflare buffering issues with async start().
 * Chunks are also accumulated and passed to onChunk for secondary use (e.g. R2 save).
 */
export function chatCompletionStream(
  config: ModelConfig,
  messages: ChatMessage[],
  systemPrompt?: string,
  onChunk?: (text: string) => void,
): ReadableStream {
  const baseUrl = config.base_url.replace(/\/+$/, '').replace(/\/v1$/, '');

  let iterator: AsyncGenerator<string> | null = null;
  let cancelled = false;

  async function getIterator(): AsyncGenerator<string> {
    if (isOpenAIUrl(baseUrl)) {
      return streamOpenAI(baseUrl, config.api_key, config.model_id, messages, systemPrompt, config.max_tokens);
    } else {
      return streamAnthropic(baseUrl, config.api_key, config.model_id, messages, systemPrompt, config.max_tokens);
    }
  }

  return new ReadableStream({
    async pull(controller) {
      if (!iterator) {
        iterator = await getIterator();
      }
      try {
        const { value, done } = await iterator.next();
        if (done || cancelled) {
          controller.close();
          return;
        }
        controller.enqueue(value);
        onChunk?.(value);
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      cancelled = true;
    },
  });
}
