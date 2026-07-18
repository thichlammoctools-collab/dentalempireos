/**
 * Embedding service — supports OpenAI-compatible and Gemini APIs.
 * Uses the active provider from the database.
 */

import { getActiveModelsWithProvider } from './ai-provider-db';
import type { AiProviderRow, AiModelRow } from './ai-provider-db';

interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  model: string;
  usage?: { prompt_tokens: number; total_tokens: number };
}

let _cachedProvider: { provider: AiProviderRow; model: AiModelRow } | null = null;

function isGeminiUrl(url: string): boolean {
  const u = url.toLowerCase();
  return u.includes('gemini') || u.includes('generativelanguage') || u.includes('googleapis') || u.includes('aiagent') || u.includes('aistudio');
}

async function getEmbeddingProvider(
  db: D1Database,
): Promise<{ provider: AiProviderRow; model: AiModelRow }> {
  if (_cachedProvider) return _cachedProvider;

  const models = await getActiveModelsWithProvider(db);
  for (const [, { provider, models: providerModels }] of models) {
    const embeddingModel = providerModels.find((m) =>
      `${m.name} ${m.model_id}`.toLowerCase().includes('embedding'),
    );
    if (embeddingModel) {
      _cachedProvider = { provider, model: embeddingModel };
      return _cachedProvider;
    }
  }

  throw new Error('No embedding model configured. Add and activate an embedding model (for example, text-embedding-3-small) in AI Providers.');
}

export async function getEmbedding(
  db: D1Database,
  text: string,
): Promise<number[]> {
  const { provider, model } = await getEmbeddingProvider(db);
  const truncated = text.slice(0, 8000);

  if (isGeminiUrl(provider.base_url)) {
    // Gemini embedding via embedContent API
    const base = provider.base_url.replace(/\/+$/, '');
    let url = `${base}/v1beta/models/${model.model_id}:embedContent?key=${provider.api_key}`;
    if (base.includes('/v1beta')) {
      url = `${base}/models/${model.model_id}:embedContent?key=${provider.api_key}`;
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: { parts: [{ text: truncated }] },
        taskType: 'RETRIEVAL_DOCUMENT',
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Gemini embedding error (${resp.status}): ${err}`);
    }

    const data = (await resp.json()) as { embedding?: { values?: number[] } };
    const embedding = data.embedding?.values;
    if (!embedding) throw new Error('Empty Gemini embedding response');
    return embedding;
  }

  // OpenAI-compatible embedding
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
