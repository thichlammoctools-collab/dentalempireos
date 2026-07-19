import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getApp, parseAppConfig } from '../../../../lib/app-db';
import { getAiGatewayConfig } from '../../../../lib/ai-gateway';
import { chatCompletion } from '../../../../lib/ai-client';
import type { ModelConfig } from '../../../../lib/ai-client';

export const prerender = false;

async function getModelConfig(db: D1Database, configJson: string | null): Promise<ModelConfig | null> {
  const config = parseAppConfig(configJson);
  const modelOverride = config.model_override as string | undefined;

  return getAiGatewayConfig(db, 'default', modelOverride);
}

export const POST: APIRoute = async ({ request, params }) => {
  const appId = params.id;
  if (!appId) return badRequest('Missing app ID');

  const app = await getApp(env.DB, appId);
  if (!app) return json({ error: 'Ứng dụng không tồn tại' }, 404);
  if (app.status !== 'active') return json({ error: 'Ứng dụng chưa được kích hoạt' }, 403);

  const body = (await request.json().catch(() => null)) as { input?: string; prompt_vi?: string } | null;
  if (!body?.input?.trim()) return badRequest('Input is required');

  const modelCfg = await getModelConfig(env.DB, app.config_json);
  if (!modelCfg) {
    return json({ error: 'Chưa có AI model nào được kích hoạt.' }, 503);
  }

  const config = parseAppConfig(app.config_json);
  const systemPrompt = (config.prompt_vi as string)?.trim() || 'Bạn là trợ lý AI hữu ích. Trả lời bằng tiếng Việt.';

  try {
    const result = await chatCompletion(
      modelCfg,
      [{ role: 'user', content: body.input }],
      systemPrompt,
    );
    return json({ result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: msg }, 500);
  }
};
