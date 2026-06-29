// Admin API: Single Question — get, update, delete
// GET /api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid]
// PATCH /api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid]
// DELETE /api/admin/scanner-definitions/[id]/sections/[sid]/questions/[qid]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../../../../../lib/api-helpers';
import {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  validateQuestionInput,
  type SurveyQuestionInput,
} from '../../../../../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const qid = parseInt(params.qid ?? '', 10);
  if (!qid) return badRequest('qid is required');

  const row = await getQuestionById(env.DB, qid);
  if (!row) return notFound('Question not found');
  return json(row);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const qid = parseInt(params.qid ?? '', 10);
  if (!qid) return badRequest('qid is required');

  const body = (await request.json().catch(() => null)) as Partial<SurveyQuestionInput> | null;
  if (!body) return badRequest('Invalid JSON body');

  const validation = validateQuestionInput(body);
  if (!validation.ok) {
    return badRequest(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const updated = await updateQuestion(env.DB, qid, body);
  if (!updated) return notFound('Question not found');

  return json({ id: qid, updated: true });
};

export const DELETE: APIRoute = async ({ params }) => {
  const qid = parseInt(params.qid ?? '', 10);
  if (!qid) return badRequest('qid is required');

  await deleteQuestion(env.DB, qid);
  return json({ deleted: true });
};