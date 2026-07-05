globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getApp, p as parseAppConfig } from "./app-db_BINE4Y41.mjs";
import { g as getActiveModelsWithProvider } from "./ai-provider-db_DV3FpOjN.mjs";
import { c as chatCompletion } from "./ai-client_CyIPqKQD.mjs";
const prerender = false;
async function getModelConfig(db, configJson) {
  const config = parseAppConfig(configJson);
  const modelOverride = config.model_override;
  const allModels = await getActiveModelsWithProvider(db);
  if (modelOverride) {
    for (const [, { provider, models }] of allModels) {
      const model = models.find((m) => m.model_id === modelOverride && m.is_active);
      if (model) {
        return { base_url: provider.base_url, api_key: provider.api_key, model_id: model.model_id, max_tokens: model.max_tokens || 8192 };
      }
    }
  }
  for (const [, { provider, models }] of allModels) {
    const model = models.find((m) => m.is_active);
    if (model) {
      return { base_url: provider.base_url, api_key: provider.api_key, model_id: model.model_id, max_tokens: model.max_tokens || 8192 };
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
  if (!body?.input?.trim()) return badRequest("Input is required");
  const modelCfg = await getModelConfig(env.DB, app.config_json);
  if (!modelCfg) {
    return json({ error: "Chưa có AI model nào được kích hoạt." }, 503);
  }
  const config = parseAppConfig(app.config_json);
  const systemPrompt = config.prompt_vi?.trim() || "Bạn là trợ lý AI hữu ích. Trả lời bằng tiếng Việt.";
  try {
    const result = await chatCompletion(
      modelCfg,
      [{ role: "user", content: body.input }],
      systemPrompt
    );
    return json({ result });
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
