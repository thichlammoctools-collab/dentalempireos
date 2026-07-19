/**
 * Embedding service — supports OpenAI-compatible and Gemini APIs.
 * Uses the active provider from the database.
 */

import { getAiGatewayConfig } from './ai-gateway';

interface EmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  model: string;
  usage?: { prompt_tokens: number; total_tokens: number };
}

export async function getEmbedding(
  db: D1Database,
  text: string,
): Promise<number[]> {
  const config = await getAiGatewayConfig(db, 'embedding');
  if (!config) {
    throw new Error('Cloudflare AI Gateway chưa được cấu hình hoặc Worker secret CF_AI_GATEWAY_TOKEN chưa có.');
  }
  const truncated = text.slice(0, 8000);
  const resp = await fetch(`${config.base_url}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.api_key}`,
      'cf-aig-gateway-id': config.gateway_id || 'default',
    },
    body: JSON.stringify({
      model: config.model_id,
      input: truncated,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Cloudflare AI Gateway embedding error (${resp.status}) for ${config.model_id}: ${err}`);
  }

  const data = (await resp.json()) as EmbeddingResponse;
  const embedding = data.data[0]?.embedding;
  if (!embedding) throw new Error('Empty embedding response');
  return embedding;
}

