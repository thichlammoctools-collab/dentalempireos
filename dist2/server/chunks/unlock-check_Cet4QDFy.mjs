globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getReadingStats } from "./reading-progress-db_BqfnWdhe.mjs";
import { h as hasAccess } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const GET = async ({ locals }) => {
  if (!locals.user) return json({ qualified: false, reason: "not_logged_in" });
  await getReadingStats(env.DB, locals.user.id);
  const { results: tier1 } = await env.DB.prepare(`SELECT "id" FROM "chapter" WHERE "status" = 'published' AND "tier" = 1`).all();
  const tier1Set = new Set(tier1.map((c) => c.id));
  const { results: progress } = await env.DB.prepare('SELECT "chapter_id", "max_pct" FROM "reading_progress" WHERE "user_id" = ?').bind(locals.user.id).all();
  const completedTier1 = progress.filter(
    (p) => tier1Set.has(p.chapter_id) && p.max_pct >= 80
  ).length;
  const qualified = completedTier1 >= 3;
  const hasPro = await hasAccess(env.DB, locals.user.id, "prod-mini-scanner-pro");
  return json({
    qualified,
    completedTier1,
    totalTier1: tier1Set.size,
    hasPro,
    message: qualified && !hasPro ? "Bạn đã đọc đủ 3 chương Tier 1 — mở khóa Mini Scanner miễn phí!" : qualified && hasPro ? "Bạn đã có Mini Scanner Pro" : `Cần đọc thêm ${Math.max(0, 3 - completedTier1)} chương để mở khóa.`
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
