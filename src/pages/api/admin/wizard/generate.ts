import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getAiGatewayConfig } from '../../../../lib/ai-gateway';
import { wizardGenerate } from '../../../../lib/product-wizard-ai';
import type { ModelConfig } from '../../../../lib/ai-client';

export const prerender = false;

const VALID_TYPES = ['survey', 'ebook_ai', 'course_ai', 'tool', 'generator'];

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as {
    type?: string;
    answers?: Record<string, unknown>;
    model_id?: string | null;
  } | null;

  if (!body) return badRequest('Invalid JSON body');
  if (!body.type || !VALID_TYPES.includes(body.type)) {
    return badRequest(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!body.answers || typeof body.answers !== 'object') {
    return badRequest('Missing or invalid answers');
  }

  const modelCfg: ModelConfig | null = await getAiGatewayConfig(env.DB, 'default', body.model_id ?? undefined);

  if (!modelCfg) {
    return json(
      {
        error: 'Cloudflare AI Gateway chưa được cấu hình. Vui lòng vào AI Settings.',
        link: '/admin/ai-settings',
      },
      503,
    );
  }

  try {
    const generated = await wizardGenerate(modelCfg, body.type, body.answers as Parameters<typeof wizardGenerate>[2]);
    return json({ success: true, generated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: message }, 500);
  }
};
