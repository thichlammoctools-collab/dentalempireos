globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest, s as slugify } from "./api-helpers_DYIwbpI_.mjs";
import { l as listChapters, e as upsertChapter } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const GET = async () => {
  const chapters = await listChapters(env.DB);
  return json(chapters);
};
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { tier, chapter_no, title, description, order, status } = body;
  if (!tier || !chapter_no || !title) {
    return badRequest("tier, chapter_no, title are required");
  }
  const id = slugify(title);
  await upsertChapter(env.DB, {
    id,
    tier,
    chapter_no,
    title,
    description,
    order: order ?? chapter_no,
    status: status ?? "draft"
  });
  return json({ id }, 201);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
