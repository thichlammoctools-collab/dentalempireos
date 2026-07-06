globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
const GET = async () => {
  try {
    const db = env.DB;
    const homeRow = await db.prepare('SELECT id FROM "homepage_settings" WHERE "id" = 1').first();
    if (!homeRow) return new Response(JSON.stringify({ error: "No homepage_settings row" }), { status: 500, headers: { "Content-Type": "application/json" } });
    const supportRow = await db.prepare('SELECT id FROM "support_settings" WHERE "id" = 1').first();
    if (!supportRow) return new Response(JSON.stringify({ error: "No support_settings row" }), { status: 500, headers: { "Content-Type": "application/json" } });
    const chapters = await db.prepare('SELECT id, title FROM "chapter" WHERE "is_published" = 1 LIMIT 3').all();
    if (!chapters) return new Response(JSON.stringify({ error: "No chapters" }), { status: 500, headers: { "Content-Type": "application/json" } });
    const courses = await db.prepare('SELECT id, title FROM "course" WHERE "is_published" = 1 LIMIT 3').all();
    return new Response(JSON.stringify({
      ok: true,
      homepage: homeRow,
      support: supportRow,
      chapters: chapters.results,
      courses: courses.results
    }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
