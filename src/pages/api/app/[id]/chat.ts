import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { getApp, parseAppConfig } from '../../../../lib/app-db';
import { getActiveModelsWithProvider } from '../../../../lib/ai-provider-db';
import { chatCompletion } from '../../../../lib/ai-client';
import type { ModelConfig } from '../../../../lib/ai-client';

export const prerender = false;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function buildSystemPrompt(appName: string, promptVi: string): string {
  const customRules = promptVi ? `\n\nHƯỚNG DẪN TÙY CHỈNH TỪ ADMIN:\n${promptVi}\n` : '';
  return `Bạn là một chuyên gia tư vấn thân thiện, đang ngồi cùng chủ phòng khám nha khoa để xây dựng SOP (Quy trình vận hành chuẩn) cùng nhau.

Nhiệm vụ của bạn: Hỏi từng câu hỏi, lắng nghe câu trả lời, rồi hỏi tiếp. KHÔNG bao giờ hỏi nhiều câu cùng lúc.

**Quy tắc quan trọng:**
1. MỖI CÂU TRẢ LỜI của user → chỉ đặt ĐÚNG 1 câu hỏi tiếp theo
2. Câu hỏi phải NGẮN GỌN (tối đa 2-3 dòng), dễ hiểu
3. SAU MỖI CÂU HỎI → đưa ra 3-4 GỢI Ý CHỌN để user bấm chọn. Gợi ý phải phù hợp với ngữ cảnh câu hỏi.
4. Nếu gợi ý không khớp → user tự nhập
5. Sau 6-8 câu hỏi → TỔNG HỢP toàn bộ thành SOP hoàn chỉnh
6. Không hỏi lại những gì user đã trả lời
7. LUÔN trả lời bằng tiếng Việt${customRules}

**Format câu hỏi với gợi ý:**
Sau câu hỏi, thêm:
[data]
{"options": ["Gợi ý 1", "Gợi ý 2", "Gợi ý 3", "Khác..."]}
[/data]
LUÔN đặt [data]...[/data] SAU mỗi câu hỏi.

**Cấu trúc SOP khi hoàn thành:** Tên, Mục đích, Phạm vi, Các bước (đánh số), Biểu mẫu, Ghi chú.

Khi đủ thông tin → viết SOP hoàn chỉnh → kết thúc bằng:
---END-SOP---

Tên ứng dụng: ${appName}`;
}

function extractSOPComplete(reply: string): { reply: string; full_sop: string; complete: boolean } {
  const marker = '---END-SOP---';
  const idx = reply.lastIndexOf(marker);
  if (idx !== -1) {
    return {
      full_sop: reply.slice(0, idx).trim(),
      reply: reply.slice(idx + marker.length).trim() || '✅ Hoàn thành! SOP của bạn đã sẵn sàng.',
      complete: true,
    };
  }
  return { reply: reply.trim(), full_sop: '', complete: false };
}

async function getModelConfig(db: D1Database, app: ReturnType<typeof parseAppConfig>): Promise<ModelConfig | null> {
  const config = parseAppConfig(app.config_json);
  const modelOverride = config.model_override as string | undefined;

  const allModels = await getActiveModelsWithProvider(db);

  if (modelOverride) {
    // Find by model_id
    for (const [, { provider, models }] of allModels) {
      const model = models.find(m => m.model_id === modelOverride && m.is_active);
      if (model) {
        return {
          base_url: provider.base_url,
          api_key: provider.api_key,
          model_id: model.model_id,
          max_tokens: model.max_tokens || 8192,
        };
      }
    }
  }

  // Fallback: use default provider's first active model
  for (const [, { provider, models }] of allModels) {
    const model = models.find(m => m.is_active);
    if (model) {
      return {
        base_url: provider.base_url,
        api_key: provider.api_key,
        model_id: model.model_id,
        max_tokens: model.max_tokens || 8192,
      };
    }
  }

  return null;
}

export const POST: APIRoute = async ({ request, params }) => {
  const appId = params.id;
  if (!appId) return badRequest('Missing app ID');

  const app = await getApp(env.DB, appId);
  if (!app) return json({ error: 'Ứng dụng không tồn tại' }, 404);
  if (app.status !== 'active') return json({ error: 'Ứng dụng chưa được kích hoạt' }, 403);

  const body = (await request.json().catch(() => null)) as {
    messages?: Message[];
    prompt_vi?: string;
    app_name?: string;
  } | null;

  if (!body?.messages?.length) return badRequest('Messages required');

  const config = parseAppConfig(app.config_json);
  const modelCfg = await getModelConfig(env.DB, app);

  if (!modelCfg) {
    return json({ error: 'Chưa có AI model nào được kích hoạt. Vui lòng vào AI Settings để thêm provider.' }, 503);
  }

  const systemPrompt = buildSystemPrompt(body.app_name || app.name, config.prompt_vi as string || '');
  const messages = body.messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  try {
    const reply = await chatCompletion(modelCfg, messages, systemPrompt);
    if (!reply) return json({ reply: 'Không có phản hồi.', full_sop_text: '', sop_complete: false });

    const { reply: cleanReply, full_sop, complete } = extractSOPComplete(reply);
    return json({
      reply: cleanReply,
      full_sop_text: complete ? full_sop : '',
      sop_complete: complete,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return json({ error: msg }, 500);
  }
};
