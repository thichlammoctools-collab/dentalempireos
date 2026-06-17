import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { getQuestion, getReplies, updateQuestionStatus } from '../../../../lib/question-db';

export const prerender = false;

// GET /api/admin/questions/[id] — get question detail + replies
export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return notFound();

  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();

  const replies = await getReplies(env.DB, id);
  return json({ question, replies });
};

// PATCH /api/admin/questions/[id] — update question status
export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return notFound();

  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();

  const body = await request.json().catch(() => null);
  if (!body?.status) return badRequest('status is required');

  const validStatuses = ['open', 'answered', 'closed'];
  if (!validStatuses.includes(body.status)) {
    return badRequest(`status must be one of: ${validStatuses.join(', ')}`);
  }

  await updateQuestionStatus(env.DB, id, body.status);
  return json({ ok: true });
};
