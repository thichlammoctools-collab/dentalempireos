import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../../lib/api-helpers';
import { replyToQuestion, getQuestion, createNotification } from '../../../../../lib/question-db';

export const prerender = false;

// POST /api/admin/questions/[id]/reply — admin replies to a question
export const POST: APIRoute = async ({ params, request, locals }) => {
  const adminUser = locals.user;
  if (!adminUser) return json({ error: 'unauthorized' }, 401);

  const id = params.id;
  if (!id) return notFound();

  const question = await getQuestion(env.DB, id);
  if (!question) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { body: content } = body as { body?: string };
  if (!content) return badRequest('body is required');

  // Create the admin reply
  const reply = await replyToQuestion(env.DB, id, adminUser.id, content, true);

  // Auto-update status to 'answered' if it was 'open'
  if (question.status === 'open') {
    const { updateQuestionStatus } = await import('../../../../../lib/question-db');
    await updateQuestionStatus(env.DB, id, 'answered');
  }

  // Notify the question owner
  const { DB } = env;
  await createNotification(
    DB,
    question.user_id,
    'question_reply',
    `Tác giả đã trả lời: ${question.title}`,
    content.length > 200 ? content.slice(0, 200) + '...' : content,
    `/my-questions/${id}`,
  );

  return json(reply, 201);
};
