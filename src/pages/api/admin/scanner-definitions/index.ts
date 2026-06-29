// Admin API: Scanner Definitions — list + create
// GET /api/admin/scanner-definitions
// POST /api/admin/scanner-definitions

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, slugify } from '../../../../lib/api-helpers';
import {
  listSurveyDefinitions,
  upsertSurveyDefinition,
  type SurveyDefinitionInput,
} from '../../../../lib/survey-config-db';

export const prerender = false;

export const GET: APIRoute = async () => {
  const defs = await listSurveyDefinitions(env.DB);
  return json(defs);
};

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as SurveyDefinitionInput | null;
  if (!body) return badRequest('Invalid JSON body');
  if (!body.title_vi?.trim()) return badRequest('title_vi là bắt buộc');

  const slug = body.slug?.trim() || slugify(body.title_vi);
  const id = body.id?.trim() || `${slug}-${Date.now().toString(36)}`;

  const row = await upsertSurveyDefinition(env.DB, {
    id,
    slug,
    title_vi: body.title_vi.trim(),
    title_en: body.title_en?.trim() ?? '',
    description_vi: body.description_vi ?? null,
    description_en: body.description_en ?? null,
    subtitle_vi: body.subtitle_vi ?? null,
    subtitle_en: body.subtitle_en ?? null,
    chapter_refs: body.chapter_refs ?? null,
    status: body.status ?? 'draft',
    is_free: body.is_free ?? 0,
    survey_type: body.survey_type ?? 'full',
    lead_fields: body.lead_fields ?? null,
    scoring_rules: body.scoring_rules ?? null,
    ai_config: body.ai_config ?? null,
    translations_vi: body.translations_vi ?? null,
    translations_en: body.translations_en ?? null,
    order_index: body.order_index ?? 0,
  });

  return json({ id: row.id, slug: row.slug }, 201);
};