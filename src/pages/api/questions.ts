import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../lib/api-helpers';
import { createQuestion, listQuestionsByUser } from '../../lib/question-db';

export const prerender = false;

// GET /api/questions — list current user's questions
export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const questions = await listQuestionsByUser(env.DB, user.id);
  return json(questions);
};

// POST /api/questions — create a new question
export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthorized' }, 401);

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { chapter_id, section_id, title, body: content } = body as {
    chapter_id?: string;
    section_id?: string;
    title?: string;
    body?: string;
  };

  if (!chapter_id || !title || !content) {
    return badRequest('chapter_id, title, body are required');
  }

  const question = await createQuestion(
    env.DB,
    user.id,
    chapter_id,
    section_id ?? null,
    title,
    content,
  );

  return json(question, 201);
};
