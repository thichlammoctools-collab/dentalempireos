globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json, n as notFound, s as slugify } from "./api-helpers_DYIwbpI_.mjs";
import { f as deleteSection, h as upsertSection } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  try {
    const row = await env.DB.prepare('SELECT * FROM "section" WHERE "id" = ?').bind(id).first();
    if (!row) return notFound("Section not found");
    return json(row);
  } catch (err) {
    return json({ error: err?.message ?? "DB error" }, 500);
  }
};
const PUT = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { chapter_id, parent_id, level, title, slug, order, sibling_ids, keywords } = body;
  if (!chapter_id) return badRequest("chapter_id is required");
  await upsertSection(env.DB, {
    id,
    chapter_id,
    parent_id: parent_id ?? null,
    level: level ?? 2,
    title: title ?? "",
    slug: slug || slugify(title ?? ""),
    order: order ?? 0,
    keywords: keywords ?? "[]"
  });
  if (sibling_ids && sibling_ids.length > 0) {
    await env.DB.batch(
      sibling_ids.map(
        (sid, index) => env.DB.prepare(`UPDATE "section" SET "order" = ? WHERE "id" = ?`).bind(index, sid)
      )
    );
  }
  return json({ ok: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  try {
    await deleteSection(env.DB, id);
    return json({ ok: true });
  } catch (err) {
    return json({ error: err?.message ?? "Failed to delete section" }, 500);
  }
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
