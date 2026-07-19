import { env } from 'cloudflare:workers';
import { getAiSettings } from './ai-settings-db';
import type { ModelConfig } from './ai-client';

export type AiGatewayUsage = 'default' | 'chat' | 'embedding';

export function hasAiGatewayToken(): boolean {
  return Boolean(env.CF_AI_GATEWAY_TOKEN);
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
