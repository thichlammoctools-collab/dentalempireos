import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { deleteReview } from '../../../../lib/review-db';

export const prerender = false;

// DELETE /api/public/reviews/[id] — delete own review (auth required)
export const DELETE: APIRoute = async ({ params, locals }) => {
  const user = (locals as any).user;
  if (!user) return json({ error: 'Unauthorized' }, 401);

  const id = params.id;
  if (!id) return badRequest('Missing id');

  const deleted = await deleteReview(env.DB, id, user.id);
  if (!deleted) return json({ error: 'Review not found or not yours' }, 404);

  return json({ ok: true });
};
