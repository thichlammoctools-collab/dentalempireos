import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { replyToQuestion, getQuestion } from '../../../../lib/question-db';

export const prerender = false;

// POST /api/questions/[id]/reply — user replies to their own question
export const POST: APIRoute = async ({ params, request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const id = params.id;
  if (!id) return notFound();

  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();
  if (question.user_id !== user.id) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { body: content } = body as { body?: string };
  if (!content) return badRequest('body is required');

  const reply = await replyToQuestion(env.DB, id, user.id, content, false);
  return json(reply, 201);
};
