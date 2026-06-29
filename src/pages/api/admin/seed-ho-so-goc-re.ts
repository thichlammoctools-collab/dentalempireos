// Admin API: Seed "Hồ Sơ Gốc Rễ" survey definition.
// POST /api/admin/seed-ho-so-goc-re
//
// Idempotent — safe to re-run. Deletes existing definition with the same id
// and re-inserts everything from src/data/seeds/ho-so-goc-re.ts.
//
// Designed as a one-time bootstrap endpoint. After the first successful seed,
// admins should manage scanners through the regular /admin/scanners UI.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { HO_SO_GOC_RE_SEED, SECTIONS } from '../../../data/seeds/ho-so-goc-re';
import {
  upsertSurveyDefinition,
  addSection,
  addQuestion,
  deleteSurveyDefinition,
} from '../../../lib/survey-config-db';
import { json, badRequest } from '../../../lib/api-helpers';

export const prerender = false;

export const POST: APIRoute = async () => {
  try {
    const db = env.DB;

    // Step 1: Remove existing definition (cascades to sections + questions)
    await deleteSurveyDefinition(db, HO_SO_GOC_RE_SEED.id!);

    // Step 2: Upsert definition row (will be created fresh)
    await upsertSurveyDefinition(db, {
      id: HO_SO_GOC_RE_SEED.id!,
      slug: HO_SO_GOC_RE_SEED.slug!,
      title_vi: HO_SO_GOC_RE_SEED.title_vi,
      title_en: HO_SO_GOC_RE_SEED.title_en,
      description_vi: HO_SO_GOC_RE_SEED.description_vi,
      description_en: HO_SO_GOC_RE_SEED.description_en,
      subtitle_vi: HO_SO_GOC_RE_SEED.subtitle_vi,
      subtitle_en: HO_SO_GOC_RE_SEED.subtitle_en,
      chapter_refs: HO_SO_GOC_RE_SEED.chapter_refs,
      status: HO_SO_GOC_RE_SEED.status,
      is_free: HO_SO_GOC_RE_SEED.is_free,
      survey_type: HO_SO_GOC_RE_SEED.survey_type,
      lead_fields: HO_SO_GOC_RE_SEED.lead_fields,
      scoring_rules: HO_SO_GOC_RE_SEED.scoring_rules,
      ai_config: HO_SO_GOC_RE_SEED.ai_config,
      translations_vi: HO_SO_GOC_RE_SEED.translations_vi,
      translations_en: HO_SO_GOC_RE_SEED.translations_en,
      order_index: HO_SO_GOC_RE_SEED.order_index,
    });

    // Step 3: Insert each section + its questions
    let sectionsAdded = 0;
    let questionsAdded = 0;

    for (const section of SECTIONS) {
      const added = await addSection(db, {
        survey_id: HO_SO_GOC_RE_SEED.id!,
        order_idx: section.order_idx,
        title_vi: section.title_vi,
        title_en: section.title_en,
        subtitle_vi: section.subtitle_vi ?? null,
        subtitle_en: section.subtitle_en ?? null,
        ref: section.ref ?? null,
        icon: section.icon ?? null,
      });
      sectionsAdded++;

      for (const q of section.questions) {
        await addQuestion(db, {
          section_id: added.id,
          question_id: q.question_id,
          order_idx: q.order_idx,
          type: q.type,
          label_vi: q.label_vi,
          label_en: q.label_en,
          placeholder_vi: q.placeholder_vi ?? null,
          placeholder_en: q.placeholder_en ?? null,
          options_vi: q.options_vi ?? null,
          options_en: q.options_en ?? null,
          scale_labels_vi: q.scale_labels_vi ?? null,
          scale_labels_en: q.scale_labels_en ?? null,
          required: q.required ?? 0,
          anchor: q.anchor ?? 0,
          weight: q.weight ?? null,
          dimension: q.dimension ?? null,
        });
        questionsAdded++;
      }
    }

    return json(
      {
        success: true,
        definition_id: HO_SO_GOC_RE_SEED.id,
        slug: HO_SO_GOC_RE_SEED.slug,
        sections_added: sectionsAdded,
        questions_added: questionsAdded,
      },
      201,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return badRequest(`Seed failed: ${msg}`);
  }
};

export const GET: APIRoute = async () => {
  return json({
    message: 'POST to this endpoint to seed the Hồ Sơ Gốc Rễ survey.',
    method: 'POST',
  });
};