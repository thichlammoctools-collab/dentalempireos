globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { d as deleteBlock, a as getBlock, u as upsertBlock } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const block = await getBlock(env.DB, id);
  if (!block) return json({ error: "Not found" }, 404);
  return json(block);
};
const PUT = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  let body = null;
  try {
    body = await request.json();
  } catch {
  }
  if (!body) return badRequest("Invalid JSON body");
  const existing = await getBlock(env.DB, id);
  if (!existing) return json({ error: "Block not found" }, 404);
  const { section_id, order, type, text_md, r2_key, filename, mime, alt, caption } = body;
  await upsertBlock(env.DB, {
    id,
    section_id: section_id ?? existing.section_id,
    order: order ?? existing.order,
    type: type ?? existing.type,
    text_md: text_md ?? existing.text_md,
    r2_key: r2_key ?? existing.r2_key,
    filename: filename ?? existing.filename,
    mime: mime ?? existing.mime,
    alt: alt ?? existing.alt,
    caption: caption ?? existing.caption
  });
  return json({ ok: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  await deleteBlock(env.DB, id);
  return json({ ok: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
