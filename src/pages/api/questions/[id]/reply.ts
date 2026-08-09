import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import { checkQuestionWriteRateLimit, replyToQuestion, getQuestion } from '../../../../lib/question-db';

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
  if (typeof content !== 'string' || !content.trim() || content.trim().length > 8_000) {
    return badRequest('Nội dung trả lời tối đa 8.000 ký tự.');
  }
  if (!(await checkQuestionWriteRateLimit(env.DB, user.id, true))) {
    return json({ error: 'Bạn đã gửi quá nhiều phản hồi. Vui lòng thử lại sau ít phút.' }, 429);
  }

  try {
    const reply = await replyToQuestion(env.DB, id, user.id, content.trim(), false);
    return json(reply, 201);
  } catch (err) {
    console.error('[POST /api/questions/:id/reply] DB error:', err);
    return json({ error: 'Database error' }, 500);
  }
};
