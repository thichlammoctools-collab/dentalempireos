globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const PUT = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { ids } = body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return badRequest("ids[] is required");
  }
  (/* @__PURE__ */ new Date()).toISOString();
  try {
    await env.DB.batch(
      ids.map(
        (id, index) => env.DB.prepare(`UPDATE "section" SET "order" = ? WHERE "id" = ?`).bind(index, id)
      )
    );
    return json({ ok: true });
  } catch (err) {
    console.error("reorder sections error:", err);
    return badRequest("Failed to reorder sections");
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
