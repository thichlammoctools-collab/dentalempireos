globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { reorderCategories } from "./blog-db_CoZeeOQQ.mjs";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const PUT = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { parent_id, ids } = body;
  if (parent_id === void 0) {
    return badRequest("parent_id is required (use null for root categories)");
  }
  if (!Array.isArray(ids) || ids.length === 0) {
    return badRequest("ids[] is required and must not be empty");
  }
  try {
    await reorderCategories(env.DB, parent_id || null, ids);
    return json({ ok: true });
  } catch (err) {
    console.error("reorder categories error:", err);
    return badRequest("Failed to reorder categories");
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
