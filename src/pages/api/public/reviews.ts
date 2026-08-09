import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { checkReviewRateLimit, listReviewsByChapter, getReviewStats, createReview } from '../../../lib/review-db';
import { hashIp } from '../../../lib/newsletter';
import type { ReviewInput } from '../../../lib/review-db';

export const prerender = false;

// GET /api/public/reviews?chapter_id=xxx&limit=20&offset=0
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const chapterId = url.searchParams.get('chapter_id');
  if (!chapterId) return badRequest('chapter_id is required');

  const requestedLimit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10);
  const requestedOffset = Number.parseInt(url.searchParams.get('offset') ?? '0', 10);
  const limit = Number.isSafeInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
  const offset = Number.isSafeInteger(requestedOffset) ? Math.max(requestedOffset, 0) : 0;

  const db = env.DB;
  const [reviews, stats] = await Promise.all([
    listReviewsByChapter(db, chapterId, limit, offset),
    getReviewStats(db, chapterId),
  ]);

  return json({ reviews, stats });
};

// POST /api/public/reviews — submit a review
export const POST: APIRoute = async ({ request, locals }) => {
  let body: Record<string, any> | null = null;
  try { body = await request.json(); } catch {}
  if (!body) return badRequest('Invalid JSON');

  const { chapter_id, rating, title, content, author_name } = body;

  if (!chapter_id || typeof chapter_id !== 'string' || chapter_id.length > 128) return badRequest('chapter_id is required');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return badRequest('rating must be 1-5');
  if (typeof content !== 'string' || content.trim().length < 2 || content.trim().length > 2_000) {
    return badRequest('content must contain 2-2,000 characters');
  }
  if (title !== undefined && (typeof title !== 'string' || title.trim().length > 160)) return badRequest('title is invalid');
  if (author_name !== undefined && (typeof author_name !== 'string' || author_name.trim().length > 80)) return badRequest('author_name is invalid');
  const chapter = await env.DB.prepare('SELECT 1 FROM "chapter" WHERE "id" = ?').bind(chapter_id).first();
  if (!chapter) return badRequest('chapter_id is invalid');

  const user = locals.user;
  const rawIp = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for')?.split(',')[0] ?? null;
  const ipHash = await hashIp(rawIp);
  if (ipHash && !(await checkReviewRateLimit(env.DB, ipHash))) {
    return json({ error: 'Bạn đã gửi quá nhiều đánh giá. Vui lòng thử lại sau ít phút.' }, 429);
  }
  const input: ReviewInput = {
    chapter_id,
    rating,
    title: typeof title === 'string' ? title.trim() || null : null,
    content: content.trim(),
    user_id: user?.id ?? null,
    author_name: user ? user.name : (typeof author_name === 'string' ? author_name.trim() || 'Ẩn danh' : 'Ẩn danh'),
    ip_hash: ipHash,
  };

  const review = await createReview(env.DB, input);
  return json(review, 201);
};
