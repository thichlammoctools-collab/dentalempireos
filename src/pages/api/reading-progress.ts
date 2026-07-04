import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../lib/api-helpers';
import {
  upsertReadingProgress,
  getUserReadingProgress,
  toggleBookmark,
  getReadingStats,
} from '../../lib/reading-progress-db';

export const prerender = false;

// GET /api/reading-progress — list all progress + stats
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);
  const [progress, stats] = await Promise.all([
    getUserReadingProgress(env.DB, locals.user.id),
    getReadingStats(env.DB, locals.user.id),
  ]);
  return json({ progress, stats });
};

// PUT /api/reading-progress — upsert progress
export const PUT: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);
  let body: { chapter_id?: string; pct?: number; bookmarked?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON');
  }
  if (!body.chapter_id) return badRequest('chapter_id required');
  const row = await upsertReadingProgress(
    env.DB,
    locals.user.id,
    body.chapter_id,
    Math.min(100, Math.max(0, body.pct ?? 0)),
    body.bookmarked ?? false,
  );
  return json({ progress: row });
};

// POST /api/reading-progress/bookmark — toggle bookmark
export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Chưa đăng nhập' }, 401);
  let body: { chapter_id?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON');
  }
  if (!body.chapter_id) return badRequest('chapter_id required');
  const bookmarked = await toggleBookmark(env.DB, locals.user.id, body.chapter_id);
  return json({ bookmarked });
};
