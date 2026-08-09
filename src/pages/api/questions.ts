import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../lib/api-helpers';
import { checkQuestionWriteRateLimit, createQuestion, listQuestionsByUser } from '../../lib/question-db';

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

  if (typeof chapter_id !== 'string' || typeof title !== 'string' || typeof content !== 'string') {
    return badRequest('chapter_id, title, body are required');
  }
  const cleanTitle = title.trim();
  const cleanContent = content.trim();
  if (!cleanTitle || !cleanContent || cleanTitle.length > 200 || cleanContent.length > 8_000) {
    return badRequest('Tiêu đề tối đa 200 ký tự, nội dung tối đa 8.000 ký tự.');
  }
  if (section_id !== undefined && typeof section_id !== 'string') return badRequest('section_id không hợp lệ');
  const chapter = await env.DB.prepare('SELECT 1 FROM "chapter" WHERE "id" = ?').bind(chapter_id).first();
  if (!chapter) return badRequest('chapter_id không hợp lệ');
  if (!(await checkQuestionWriteRateLimit(env.DB, user.id, false))) {
    return json({ error: 'Bạn đã gửi quá nhiều câu hỏi. Vui lòng thử lại sau ít phút.' }, 429);
  }

  const question = await createQuestion(
    env.DB,
    user.id,
    chapter_id,
    section_id ?? null,
    cleanTitle,
    cleanContent,
  );

  return json(question, 201);
};
