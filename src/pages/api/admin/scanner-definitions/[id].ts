// Admin API: Scanner Definition — get, update, delete
// GET /api/admin/scanner-definitions/[id]
// PATCH /api/admin/scanner-definitions/[id]
// DELETE /api/admin/scanner-definitions/[id]

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import {
  getSurveyDefinitionById,
  getSurveyDefinitionFull,
  upsertSurveyDefinition,
  deleteSurveyDefinition,
  type SurveyDefinitionInput,
} from '../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const id = params.id;
  if (!id) return badRequest('id is required');

  const full = url.searchParams.get('full') === '1';
  const result = full
    ? await getSurveyDefinitionFull(env.DB, id)
    : await getSurveyDefinitionById(env.DB, id);

  if (!result) return notFound('Definition not found');
  return json(result);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = params.id;
  if (!id) return badRequest('id is required');

  const body = (await request.json().catch(() => null)) as Partial<SurveyDefinitionInput> | null;
  if (!body) return badRequest('Invalid JSON body');

  const existing = await getSurveyDefinitionById(env.DB, id);
  if (!existing) return notFound('Definition not found');

  const updated = await upsertSurveyDefinition(env.DB, {
    id: existing.id,
    slug: body.slug?.trim() || existing.slug,
    title_vi: body.title_vi?.trim() ?? existing.title_vi,
    title_en: body.title_en ?? existing.title_en,
    description_vi: body.description_vi !== undefined ? body.description_vi : existing.description_vi,
    description_en: body.description_en !== undefined ? body.description_en : existing.description_en,
    subtitle_vi: body.subtitle_vi !== undefined ? body.subtitle_vi : existing.subtitle_vi,
    subtitle_en: body.subtitle_en !== undefined ? body.subtitle_en : existing.subtitle_en,
    chapter_refs: body.chapter_refs !== undefined ? body.chapter_refs : undefined,
    status: body.status ?? (existing.status as SurveyDefinitionInput['status']),
    is_free: body.is_free ?? existing.is_free,
    survey_type: body.survey_type ?? (existing.survey_type as SurveyDefinitionInput['survey_type']),
    lead_fields: body.lead_fields !== undefined ? body.lead_fields : undefined,
    scoring_rules: body.scoring_rules !== undefined ? body.scoring_rules : undefined,
    ai_config: body.ai_config !== undefined ? body.ai_config : undefined,
    translations_vi: body.translations_vi !== undefined ? body.translations_vi : undefined,
    translations_en: body.translations_en !== undefined ? body.translations_en : undefined,
    order_index: body.order_index ?? existing.order_index,
  });

  return json({ id: updated.id, updated: true });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('id is required');

  const existing = await getSurveyDefinitionById(env.DB, id);
  if (!existing) return notFound('Definition not found');

  await deleteSurveyDefinition(env.DB, id);
  return json({ deleted: true });
};