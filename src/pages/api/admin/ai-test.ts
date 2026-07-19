import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { getAiGatewayConfig } from '../../../lib/ai-gateway';
import { chatCompletion } from '../../../lib/ai-client';

export const prerender = false;

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: 'unauthorized' }, 401);

  const config = await getAiGatewayConfig(env.DB);
  if (!config) {
    return json({ error: 'Cloudflare AI Gateway chưa sẵn sàng. Kiểm tra Account ID, model và secret CF_AI_GATEWAY_TOKEN.' }, 503);
  }

  try {
    await chatCompletion({ ...config, max_tokens: 16 }, [{ role: 'user', content: 'Reply with OK.' }]);
    return json({ ok: true, model: config.model_id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Gateway test failed' }, 502);
  }
};
