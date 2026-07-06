globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { b as deleteChapter, c as getChapterTree, e as upsertChapter } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const tree = await getChapterTree(env.DB, id);
  if (!tree) return notFound("Chapter not found");
  return json(tree);
};
const PUT = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const existing = await getChapterTree(env.DB, id);
  if (!existing) return notFound("Chapter not found");
  const { tier, chapter_no, title, description, order, status } = body;
  const newTier = tier ?? existing.chapter.tier;
  const newChapterNo = chapter_no ?? existing.chapter.chapter_no;
  const newOrder = order ?? existing.chapter.order;
  await upsertChapter(env.DB, {
    id,
    tier: newTier,
    chapter_no: newChapterNo,
    title: title ?? existing.chapter.title,
    description: description ?? existing.chapter.description,
    order: newOrder,
    status: ["draft", "published"].includes(status) ? status : existing.chapter.status
  });
  if (chapter_no !== void 0 && chapter_no !== existing.chapter.chapter_no) {
    const allInTier = await env.DB.prepare('SELECT "id", "chapter_no" FROM "chapter" WHERE "tier" = ? ORDER BY "chapter_no", "createdAt"').bind(newTier).all();
    if (allInTier.results.length > 0) {
      const ts = Date.now();
      await env.DB.batch(
        allInTier.results.map(
          (ch, idx) => env.DB.prepare('UPDATE "chapter" SET "order" = ?, "updatedAt" = ? WHERE "id" = ?').bind(idx, ts, ch.id)
        )
      );
    }
  }
  return json({ ok: true });
};
const DELETE = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("Missing id");
  await deleteChapter(env.DB, id);
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
