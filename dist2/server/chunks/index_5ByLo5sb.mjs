globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { u as upsertBlock } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { section_id, type, order } = body;
  if (!section_id || !type) {
    return badRequest("Missing section_id or type");
  }
  if (type !== "text" && type !== "image" && type !== "file") {
    return badRequest("Invalid block type");
  }
  const id = crypto.randomUUID();
  await upsertBlock(env.DB, {
    id,
    section_id,
    type,
    order: order ?? Date.now()
  });
  return json({ id }, 201);
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
