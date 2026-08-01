import { env } from 'cloudflare:workers';
import { getAiSettings } from './ai-settings-db';
import type { ModelConfig } from './ai-client';

export type AiGatewayUsage = 'default' | 'scanner' | 'chat' | 'embedding';

export function hasAiGatewayToken(): boolean {
  return Boolean(env.CF_AI_GATEWAY_TOKEN);
}

export function hasMotapisApiKey(): boolean {
  return Boolean(env.MOTAPIS_API_KEY);
}

function isCloudflareModelId(model: string | undefined): model is string {
  return Boolean(model && /^(openai|anthropic|google|@cf)\//.test(model));
}

export async function getAiGatewayConfig(
  db: D1Database,
  usage: AiGatewayUsage = 'default',
  modelOverride?: string,
): Promise<ModelConfig | null> {
  const settings = await getAiSettings(db);
  // Embeddings remain on Cloudflare because the website knowledge base is
  // configured around its embedding model catalog.
  if (usage !== 'embedding' && settings.ai_provider === 'motapis') {
    if (!settings.motapis_enabled || !settings.motapis_model || !hasMotapisApiKey()) {
      return null;
    }
    return {
      provider_id: 'motapis',
      base_url: 'https://motapis.com/v1',
      api_key: env.MOTAPIS_API_KEY,
      model_id: modelOverride
        || (usage === 'scanner' ? settings.motapis_scanner_model : undefined)
        || (usage === 'chat' ? settings.motapis_chat_model : undefined)
        || settings.motapis_model,
      max_tokens: settings.max_tokens,
    };
  }
  if (!settings.gateway_enabled || !settings.gateway_account_id || !hasAiGatewayToken()) {
    return null;
  }

  const model = usage === 'embedding'
    ? settings.gateway_embedding_model
    : (isCloudflareModelId(modelOverride) ? modelOverride : undefined)
      || (usage === 'chat' ? settings.gateway_chat_model : undefined)
      || settings.gateway_default_model;
  if (!model) return null;

  return {
    provider_id: 'cloudflare-ai-gateway',
    base_url: `https://api.cloudflare.com/client/v4/accounts/${settings.gateway_account_id}/ai/v1`,
    api_key: env.CF_AI_GATEWAY_TOKEN,
    gateway_id: settings.gateway_id || 'default',
    model_id: model,
    max_tokens: settings.max_tokens,
  };
}
