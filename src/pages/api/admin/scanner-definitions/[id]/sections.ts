// Admin API: Sections under a scanner definition — list + create
// GET /api/admin/scanner-definitions/[id]/sections
// POST /api/admin/scanner-definitions/[id]/sections

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../../lib/api-helpers';
import {
  listSectionsBySurvey,
  addSection,
  getSurveyDefinitionById,
  type SurveySectionInput,
} from '../../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const surveyId = params.id;
  if (!surveyId) return badRequest('id is required');

  const sections = await listSectionsBySurvey(env.DB, surveyId);
  return json(sections);
};

export const POST: APIRoute = async ({ params, request }) => {
  const surveyId = params.id;
  if (!surveyId) return badRequest('id is required');

  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) return notFound('Definition not found');

  const body = (await request.json().catch(() => null)) as Omit<SurveySectionInput, 'survey_id'> | null;
  if (!body) return badRequest('Invalid JSON body');
  if (!body.title_vi?.trim()) return badRequest('title_vi là bắt buộc');

  const row = await addSection(env.DB, {
    survey_id: surveyId,
    order_idx: body.order_idx,
    title_vi: body.title_vi.trim(),
    title_en: body.title_en ?? '',
    subtitle_vi: body.subtitle_vi ?? null,
    subtitle_en: body.subtitle_en ?? null,
    ref: body.ref ?? null,
    icon: body.icon ?? null,
  });

  return json({ id: row.id }, 201);
};