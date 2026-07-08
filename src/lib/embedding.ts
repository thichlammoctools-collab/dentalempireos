/**
 * OpenAI embedding service using text-embedding-3-small (1536 dimensions).
 * Uses the active OpenAI-compatible provider from the database.
 */

import { getActiveModelsWithProvider } from './ai-provider-db';
import type { AiProviderRow, AiModelRow } from './ai-provider-db';
import type { ChatMessage } from './ai-client';

interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  model: string;
  usage?: { prompt_tokens: number; total_tokens: number };
}

let _cachedProvider: { provider: AiProviderRow; model: AiModelRow } | null = null;

/**
 * Get or cache the active OpenAI provider and embedding model.
 */
async function getOpenAIProvider(
  db: D1Database,
): Promise<{ provider: AiProviderRow; model: AiModelRow }> {
  if (_cachedProvider) return _cachedProvider;

  const models = await getActiveModelsWithProvider(db);
  for (const [, { provider, models: providerModels }] of models) {
    // Look for an OpenAI-compatible provider
    const baseUrl = provider.base_url.toLowerCase();
    if (
      baseUrl.includes('openai') ||
      baseUrl.includes('v1/chat') ||
      baseUrl.includes('zplay') ||
      baseUrl.includes('openrouter') ||
      baseUrl.includes('together')
    ) {
      // Pick the first active model, or look for one with 'embedding' in the name
      const embeddingModel =
        providerModels.find((m) => m.model_id.includes('embedding')) ??
        providerModels[0];
      if (embeddingModel) {
        _cachedProvider = { provider, model: embeddingModel };
        return _cachedProvider;
      }
    }
  }

  throw new Error('No OpenAI-compatible embedding provider configured');
}

/**
 * Get a text embedding vector for the given text.
 * Automatically truncates to 8000 chars to stay within token limits.
 */
export async function getEmbedding(
  db: D1Database,
  text: string,
): Promise<number[]> {
  const { provider, model } = await getOpenAIProvider(db);

  const truncated = text.slice(0, 8000);
  const url = `${provider.base_url.replace(/\/+$/, '')}/embeddings`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.api_key}`,
    },
    body: JSON.stringify({
      model: model.model_id,
      input: truncated,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Embedding API error (${resp.status}): ${err}`);
  }

  const data = (await resp.json()) as EmbeddingResponse;
  const embedding = data.data[0]?.embedding;
  if (!embedding) throw new Error('Empty embedding response');
  return embedding;
}

/** Clear the cached provider (useful for testing or config changes). */
export function clearEmbeddingCache(): void {
  _cachedProvider = null;
}
