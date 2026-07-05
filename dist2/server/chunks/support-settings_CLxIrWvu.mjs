globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { g as getSupportSettings, i as upsertSupportSettings } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const GET = async () => {
  const settings = await getSupportSettings(env.DB);
  if (!settings) {
    return json({ error: "Settings not found" }, 404);
  }
  return json(settings);
};
const PUT = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { enabled, title, message, qr_url, payment_methods } = body;
  await upsertSupportSettings(env.DB, {
    enabled,
    title,
    message,
    qr_url,
    payment_methods
  });
  return json({ ok: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
