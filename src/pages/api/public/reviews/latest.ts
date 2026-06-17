import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../../lib/api-helpers';
import { listLatestReviews } from '../../../../lib/review-db';

export const prerender = false;

// GET /api/public/reviews/latest?limit=20&offset=0
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 50);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  const reviews = await listLatestReviews(env.DB, limit, offset);
  return json(reviews);
};
