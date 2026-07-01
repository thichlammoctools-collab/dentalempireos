// Unified AI client — supports Anthropic and OpenAI-compatible APIs.
// Replaces scanner-ai.ts for all AI calls.

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelConfig {
  base_url: string;
  api_key: string;
  model_id: string;
  max_tokens?: number;
}

function isOpenAIUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.includes('openai') || u.includes('v1/chat') || u.includes('zplay') || u.includes('openrouter') || u.includes('together');
}

export async function chatCompletion(
  config: ModelConfig,
  messages: ChatMessage[],
  systemPrompt?: string,
): Promise<string> {
  const baseUrl = config.base_url.replace(/\/+$/, '');
  const apiKey = config.api_key;
  const model = config.model_id;
  const maxTokens = config.max_tokens || 8192;

  if (isOpenAIUrl(baseUrl)) {
    return chatOpenAI(baseUrl, apiKey, model, messages, systemPrompt, maxTokens);
  } else {
    return chatAnthropic(baseUrl, apiKey, model, messages, systemPrompt, maxTokens);
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

  const body: Record<string, unknown> = {
    model,
    messages: allMessages,
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
    throw new Error(`OpenAI API error (${resp.status}): ${err}`);
  }

  const data = (await resp.json()) as { choices: Array<{ message: { content: string | null } }> };
  const content = data.choices[0]?.message?.content;
  if (content === null || content === undefined) throw new Error('Empty response from OpenAI API');
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
  const anthropicMessages = messages.map((m) => ({
    role: 'user' as const,
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
    throw new Error(`Anthropic API error (${resp.status}): ${err}`);
  }

  const data = (await resp.json()) as { content: Array<{ type: string; text?: string }> };
  const text = data.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n');
  if (!text) throw new Error('Empty response from Anthropic API');
  return text;
}
