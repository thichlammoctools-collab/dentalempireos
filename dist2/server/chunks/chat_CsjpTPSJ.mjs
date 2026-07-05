globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getApp, p as parseAppConfig } from "./app-db_BINE4Y41.mjs";
import { g as getActiveModelsWithProvider } from "./ai-provider-db_DV3FpOjN.mjs";
import { c as chatCompletion } from "./ai-client_CyIPqKQD.mjs";
const prerender = false;
function buildSystemPrompt(appName, promptVi) {
  const customRules = promptVi ? `

HƯỚNG DẪN TÙY CHỈNH TỪ ADMIN:
${promptVi}
` : "";
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
function extractSOPComplete(reply) {
  const marker = "---END-SOP---";
  const idx = reply.lastIndexOf(marker);
  if (idx !== -1) {
    return {
      full_sop: reply.slice(0, idx).trim(),
      reply: reply.slice(idx + marker.length).trim() || "✅ Hoàn thành! SOP của bạn đã sẵn sàng.",
      complete: true
    };
  }
  return { reply: reply.trim(), full_sop: "", complete: false };
}
async function getModelConfig(db, app) {
  const config = parseAppConfig(app.config_json);
  const modelOverride = config.model_override;
  const allModels = await getActiveModelsWithProvider(db);
  if (modelOverride) {
    for (const [, { provider, models }] of allModels) {
      const model = models.find((m) => m.model_id === modelOverride && m.is_active);
      if (model) {
        return {
          base_url: provider.base_url,
          api_key: provider.api_key,
          model_id: model.model_id,
          max_tokens: model.max_tokens || 8192
        };
      }
    }
  }
  for (const [, { provider, models }] of allModels) {
    const model = models.find((m) => m.is_active);
    if (model) {
      return {
        base_url: provider.base_url,
        api_key: provider.api_key,
        model_id: model.model_id,
        max_tokens: model.max_tokens || 8192
      };
    }
  }
  return null;
}
const POST = async ({ request, params }) => {
  const appId = params.id;
  if (!appId) return badRequest("Missing app ID");
  const app = await getApp(env.DB, appId);
  if (!app) return json({ error: "Ứng dụng không tồn tại" }, 404);
  if (app.status !== "active") return json({ error: "Ứng dụng chưa được kích hoạt" }, 403);
  const body = await request.json().catch(() => null);
  if (!body?.messages?.length) return badRequest("Messages required");
  const config = parseAppConfig(app.config_json);
  const modelCfg = await getModelConfig(env.DB, app);
  if (!modelCfg) {
    return json({ error: "Chưa có AI model nào được kích hoạt. Vui lòng vào AI Settings để thêm provider." }, 503);
  }
  const systemPrompt = buildSystemPrompt(body.app_name || app.name, config.prompt_vi || "");
  const MAX_CONTENT_LENGTH = 2e3;
  const stripTags = (text) => text.replace(/\[data\][\s\S]*?\[\/data\]/g, "").replace(/\[score\][\s\S]*?\[\/score\]/g, "").replace(/\[result\][\s\S]*?\[\/result\]/g, "").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();
  const truncate = (text) => text.length > MAX_CONTENT_LENGTH ? text.slice(0, MAX_CONTENT_LENGTH) + "…" : text;
  const messages = body.messages.slice(-10).map((m) => ({
    role: m.role,
    content: truncate(stripTags(m.content))
  }));
  try {
    const reply = await chatCompletion(modelCfg, messages, systemPrompt);
    if (!reply) return json({ reply: "Không có phản hồi.", full_sop_text: "", sop_complete: false });
    const { reply: cleanReply, full_sop, complete } = extractSOPComplete(reply);
    return json({
      reply: cleanReply,
      full_sop_text: complete ? full_sop : "",
      sop_complete: complete
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return json({ error: msg }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
