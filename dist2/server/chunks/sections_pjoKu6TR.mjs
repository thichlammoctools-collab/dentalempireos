globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, s as slugify, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { h as upsertSection } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { id, chapter_id, parent_id, level, title, slug, order, keywords } = body;
  if (!chapter_id || !title) {
    return badRequest("chapter_id and title are required");
  }
  const sectionId = id || crypto.randomUUID();
  await upsertSection(env.DB, {
    id: sectionId,
    chapter_id,
    parent_id: parent_id ?? null,
    level: level ?? 2,
    title,
    slug: slug || slugify(title),
    order: order ?? 0,
    keywords: keywords ?? "[]"
  });
  return json({ id: sectionId }, 201);
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
