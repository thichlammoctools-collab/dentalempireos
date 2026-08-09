import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getApp, parseAppConfig } from '../../../../lib/app-db';
import { getAiGatewayConfig, getCloudflareAiGatewayConfig } from '../../../../lib/ai-gateway';
import { chatCompletionWithFallback } from '../../../../lib/ai-client';
import type { ModelConfig } from '../../../../lib/ai-client';
import { createAuth } from '../../../../lib/auth';
import { canAccessAiApp } from '../../../../lib/entitlement-check';

export const prerender = false;

async function getModelConfigs(db: D1Database, configJson: string | null): Promise<ModelConfig[]> {
  const config = parseAppConfig(configJson);
  const modelOverride = config.model_override as string | undefined;
  const fallbackModelOverride = config.fallback_model_override as string | undefined;
  const maxTokensOverride = config.max_tokens_override;
  const maxTokens = typeof maxTokensOverride === 'number' && Number.isInteger(maxTokensOverride) && maxTokensOverride > 0
    ? maxTokensOverride
    : undefined;
  const modelConfig = await getAiGatewayConfig(db, 'default', modelOverride);
  const primary = modelConfig && maxTokens ? { ...modelConfig, max_tokens: maxTokens } : modelConfig;
  const fallback = fallbackModelOverride
    ? await getCloudflareAiGatewayConfig(db, fallbackModelOverride)
    : null;

  const fallbackConfig = fallback && maxTokens ? { ...fallback, max_tokens: maxTokens } : fallback;
  return [primary, fallbackConfig].filter((item): item is ModelConfig =>
    item !== null && !(item.provider_id === primary?.provider_id && item.model_id === primary?.model_id),
  );
}

export const POST: APIRoute = async ({ request, params }) => {
  const appId = params.id;
  if (!appId) return badRequest('Missing app ID');

  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return json({ error: 'Unauthorized' }, 401);

  const app = await getApp(env.DB, appId);
  if (!app) return json({ error: 'Ứng dụng không tồn tại' }, 404);
  if (app.status !== 'active') return json({ error: 'Ứng dụng chưa được kích hoạt' }, 403);
  if (!(await canAccessAiApp(env.DB, session.user.id, app.id))) {
     return json({ error: 'Ứng dụng AI này yêu cầu nâng cấp gói để sử dụng.', upgradeUrl: '/dich-vu', upgrade_url: '/dich-vu' }, 402);
  }

  const body = (await request.json().catch(() => null)) as { input?: string; prompt_vi?: string } | null;
  if (!body?.input?.trim()) return badRequest('Input is required');

  const modelConfigs = await getModelConfigs(env.DB, app.config_json);
  if (!modelConfigs.length) {
    return json({ error: 'Chưa có AI model nào được kích hoạt.' }, 503);
  }

  const config = parseAppConfig(app.config_json);
  const systemPrompt = (config.prompt_vi as string)?.trim() || 'Bạn là trợ lý AI hữu ích. Trả lời bằng tiếng Việt.';

  try {
    const result = await chatCompletionWithFallback(
      modelConfigs,
      [{ role: 'user', content: body.input }],
      systemPrompt,
    );
    return json({ result: result.content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: msg }, 500);
  }
};
