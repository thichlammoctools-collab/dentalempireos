globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { g as getPayosSettings, c as getPayosEnv, u as upsertPayosSettings } from "./payos-db_0fnCQ6tl.mjs";
import { r as registerWebhook } from "./payos_dJx_6scf.mjs";
const prerender = false;
const GET = async () => {
  const settings = await getPayosSettings(env.DB);
  if (!settings) {
    return json({ error: "Cài đặt PayOS chưa được khởi tạo" }, 404);
  }
  return json({
    ...settings,
    api_key_masked: settings.api_key ? settings.api_key.slice(0, 6) + "••••••" + settings.api_key.slice(-4) : "",
    checksum_key_masked: settings.checksum_key ? settings.checksum_key.slice(0, 6) + "••••••" + settings.checksum_key.slice(-4) : ""
  });
};
const PUT = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { client_id, api_key, checksum_key, webhook_url, sandbox_mode, is_active } = body;
  await upsertPayosSettings(env.DB, {
    client_id,
    api_key,
    checksum_key,
    webhook_url,
    sandbox_mode,
    is_active
  });
  return json({ ok: true });
};
const POST = async () => {
  const settings = await getPayosSettings(env.DB);
  if (!settings?.client_id) {
    return json({ error: "Chưa cấu hình PayOS credentials" }, 400);
  }
  const creds = getPayosEnv(env.DB, settings, env);
  try {
    const result = await registerWebhook(creds);
    return json({ ok: true, webhookUrl: result.webhookUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Lỗi đăng ký webhook";
    return json({ error: message }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
