import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../../lib/api-helpers';
import { replyToQuestion, getQuestion, createNotification, updateQuestionStatus } from '../../../../../lib/question-db';

export const prerender = false;

// POST /api/admin/questions/[id]/reply — admin replies to a question
export const POST: APIRoute = async ({ params, request, locals }) => {
  const adminUser = locals.user;
  if (!adminUser) {
    console.error('[admin reply] unauthorized — no user in locals');
    return json({ error: 'unauthorized' }, 401);
  }

  const id = params.id;
  if (!id) return notFound();

  console.log(`[admin reply] questionId=${id}, adminUserId=${adminUser.id}, adminEmail=${adminUser.email}`);

  const question = await getQuestion(env.DB, id);
  if (!question) {
    console.error(`[admin reply] question not found: ${id}`);
    return notFound();
  }

  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { body: content } = body as { body?: string };
  if (!content) return badRequest('body is required');

  console.log(`[admin reply] content length=${content.length}, question status=${question.status}`);

  // Create the admin reply
  try {
    const reply = await replyToQuestion(env.DB, id, adminUser.id, content, true);
    console.log(`[admin reply] reply created: id=${reply.id}`);

    // Auto-update status to 'answered' if it was 'open'
    if (question.status === 'open') {
      try {
        await updateQuestionStatus(env.DB, id, 'answered');
        console.log('[admin reply] status updated to answered');
      } catch (err) {
        console.error('[admin reply] failed to update question status:', err);
      }
    }

    // Notify the question owner (non-critical)
    try {
      await createNotification(
        env.DB,
        question.user_id,
        'question_reply',
        `Tác giả đã trả lời: ${question.title}`,
        content.length > 200 ? content.slice(0, 200) + '...' : content,
        `/my-questions/${id}`,
      );
      console.log('[admin reply] notification created');
    } catch (err) {
      console.error('[admin reply] failed to create notification:', err);
    }

    return json(reply, 201);
  } catch (err) {
    console.error('[admin reply] FAILED to create reply:', err);
    return json({ error: 'Failed to create reply' }, 500);
  }
};
