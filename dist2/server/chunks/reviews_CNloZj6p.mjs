globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { a as listReviewsByChapter, g as getReviewStats, c as createReview } from "./review-db_BEpAiHjt.mjs";
const prerender = false;
const GET = async ({ request }) => {
  const url = new URL(request.url);
  const chapterId = url.searchParams.get("chapter_id");
  if (!chapterId) return badRequest("chapter_id is required");
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20"), 50);
  const offset = parseInt(url.searchParams.get("offset") ?? "0");
  const db = env.DB;
  const [reviews, stats] = await Promise.all([
    listReviewsByChapter(db, chapterId, limit, offset),
    getReviewStats(db, chapterId)
  ]);
  return json({ reviews, stats });
};
const POST = async ({ request, locals }) => {
  let body = null;
  try {
    body = await request.json();
  } catch {
  }
  if (!body) return badRequest("Invalid JSON");
  const { chapter_id, rating, title, content, author_name } = body;
  if (!chapter_id || typeof chapter_id !== "string") return badRequest("chapter_id is required");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return badRequest("rating must be 1-5");
  if (!content || typeof content !== "string" || content.trim().length < 2) return badRequest("content must be at least 2 characters");
  const user = locals.user;
  const input = {
    chapter_id,
    rating,
    title: title || null,
    content: content.trim(),
    user_id: user?.id ?? null,
    author_name: user ? user.name : author_name?.trim() || "Ẩn danh"
  };
  const review = await createReview(env.DB, input);
  return json(review, 201);
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
