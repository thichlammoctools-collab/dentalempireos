globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { a as getUserReadingProgress, g as getReadingStats, t as toggleBookmark, u as upsertReadingProgress } from "./reading-progress-db_BqfnWdhe.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  if (!locals.user) return json({ error: "Chưa đăng nhập" }, 401);
  const [progress, stats] = await Promise.all([
    getUserReadingProgress(env.DB, locals.user.id),
    getReadingStats(env.DB, locals.user.id)
  ]);
  return json({ progress, stats });
};
const PUT = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Chưa đăng nhập" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  if (!body.chapter_id) return badRequest("chapter_id required");
  const row = await upsertReadingProgress(
    env.DB,
    locals.user.id,
    body.chapter_id,
    Math.min(100, Math.max(0, body.pct ?? 0)),
    body.bookmarked ?? false
  );
  return json({ progress: row });
};
const POST = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Chưa đăng nhập" }, 401);
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  if (!body.chapter_id) return badRequest("chapter_id required");
  const bookmarked = await toggleBookmark(env.DB, locals.user.id, body.chapter_id);
  return json({ bookmarked });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
