import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { listReviewsByChapter, getReviewStats, createReview } from '../../../lib/review-db';
import type { ReviewInput } from '../../../lib/review-db';

export const prerender = false;

// GET /api/public/reviews?chapter_id=xxx&limit=20&offset=0
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const chapterId = url.searchParams.get('chapter_id');
  if (!chapterId) return badRequest('chapter_id is required');

  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  const db = env.DB;
  const [reviews, stats] = await Promise.all([
    listReviewsByChapter(db, chapterId, limit, offset),
    getReviewStats(db, chapterId),
  ]);

  return json({ reviews, stats });
};

// POST /api/public/reviews — submit a review
export const POST: APIRoute = async ({ request, locals }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON');

  const { chapter_id, rating, title, content, author_name } = body;

  if (!chapter_id || typeof chapter_id !== 'string') return badRequest('chapter_id is required');
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return badRequest('rating must be 1-5');
  if (!content || typeof content !== 'string' || content.trim().length < 2) return badRequest('content must be at least 2 characters');

  const user = (locals as any).user;
  const input: ReviewInput = {
    chapter_id,
    rating,
    title: title || null,
    content: content.trim(),
    user_id: user?.id ?? null,
    author_name: user ? user.name : (author_name?.trim() || 'Ẩn danh'),
  };

  const review = await createReview(env.DB, input);
  return json(review, 201);
};
