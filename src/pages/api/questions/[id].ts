import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, notFound } from '../../../lib/api-helpers';
import { getQuestion, getReplies } from '../../../lib/question-db';

export const prerender = false;

// GET /api/questions/[id] — get question detail + replies (owner only)
export const GET: APIRoute = async ({ params, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const id = params.id;
  if (!id) return notFound();

  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();
  if (question.user_id !== user.id) return notFound();

  const replies = await getReplies(env.DB, id);
  return json({ question, replies });
};
