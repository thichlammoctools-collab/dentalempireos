import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getActiveModelsWithProvider } from '../../../../lib/ai-provider-db';
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

  // Resolve model config từ ai_provider/ai_model (multi-provider system)
  const allModels = await getActiveModelsWithProvider(env.DB);

  let modelCfg: ModelConfig | null = null;

  if (body.model_id) {
    // Tìm model được chỉ định
    for (const [, { provider, models }] of allModels) {
      const model = models.find((m) => m.model_id === body.model_id && m.is_active);
      if (model) {
        modelCfg = {
          provider_id: String(provider.id),
          base_url: provider.base_url,
          api_key: provider.api_key,
          model_id: model.model_id,
          max_tokens: model.max_tokens || 8192,
        };
        break;
      }
    }
    if (!modelCfg) {
      return json({ error: `Model "${body.model_id}" không tìm thấy hoặc chưa được kích hoạt.` }, 400);
    }
  } else {
    // Dùng model mặc định: provider đầu tiên, model đầu tiên active
    for (const [, { provider, models }] of allModels) {
      const model = models.find((m) => m.is_active);
      if (model) {
        modelCfg = {
          provider_id: String(provider.id),
          base_url: provider.base_url,
          api_key: provider.api_key,
          model_id: model.model_id,
          max_tokens: model.max_tokens || 8192,
        };
        break;
      }
    }
  }

  if (!modelCfg) {
    return json(
      {
        error: 'Chưa có AI provider nào được kích hoạt. Vui lòng vào AI Settings để thêm provider.',
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
