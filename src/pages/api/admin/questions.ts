import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { listAllQuestions, getQuestionStats } from '../../../lib/question-db';

export const prerender = false;

// GET /api/admin/questions — list all questions with optional status filter
export const GET: APIRoute = async ({ url }) => {
  const status = url.searchParams.get('status') ?? 'all';
  const questions = await listAllQuestions(env.DB, status);
  const stats = await getQuestionStats(env.DB);
  return json({ questions, stats });
};
