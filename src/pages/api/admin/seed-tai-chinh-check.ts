// Admin API: Seed "Tài Chính Check" survey definition.
// POST /api/admin/seed-tai-chinh-check
// Idempotent — safe to re-run.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { TAI_CHINH_CHECK_SEED } from '../../../data/seeds/tai-chinh-check';
import {
  upsertSurveyDefinition,
  addSection,
  addQuestion,
  deleteSurveyDefinition,
} from '../../../lib/survey-config-db';
import { json } from '../../../lib/api-helpers';

export const prerender = false;

export const POST: APIRoute = async () => {
  const def = TAI_CHINH_CHECK_SEED;

  try {
    await deleteSurveyDefinition(env.DB, def.id!);

    await upsertSurveyDefinition(env.DB, {
      id: def.id!,
      slug: def.slug!,
      title_vi: def.title_vi,
      title_en: def.title_en,
      description_vi: def.description_vi,
      description_en: def.description_en,
      subtitle_vi: def.subtitle_vi ?? null,
      subtitle_en: def.subtitle_en ?? null,
      chapter_refs: def.chapter_refs,
      status: def.status,
      is_free: def.is_free,
      survey_type: def.survey_type,
      lead_fields: def.lead_fields,
      scoring_rules: def.scoring_rules ?? null,
      ai_config: def.ai_config ?? null,
      translations_vi: def.translations_vi,
      translations_en: def.translations_en,
      order_index: def.order_index ?? 99,
    });

    let sectionsAdded = 0;
    let questionsAdded = 0;

    for (const sec of def.sections) {
      await addSection(env.DB, {
        id: sec.id!,
        survey_id: def.id!,
        title_vi: sec.title_vi,
        title_en: sec.title_en ?? sec.title_vi,
        subtitle_vi: sec.subtitle_vi ?? null,
        subtitle_en: sec.subtitle_en ?? null,
        ref: sec.ref ?? null,
        icon: sec.icon ?? null,
        order_index: sec.order_index ?? 0,
      });
      sectionsAdded++;

      for (const q of sec.questions) {
        await addQuestion(env.DB, {
          id: q.id!,
          section_id: sec.id!,
          survey_id: def.id!,
          question_id: q.question_id,
          type: q.type,
          label_vi: q.label_vi,
          label_en: q.label_en ?? q.label_vi,
          placeholder_vi: q.placeholder_vi ?? null,
          placeholder_en: q.placeholder_en ?? null,
          options_vi: q.options_vi ?? null,
          options_en: q.options_en ?? null,
          scale_labels_vi: q.scale_labels_vi ?? null,
          scale_labels_en: q.scale_labels_en ?? null,
          dimension: q.dimension ?? null,
          anchor: q.anchor ?? false,
          required: q.required ?? false,
          order_index: q.order_index ?? 0,
        });
        questionsAdded++;
      }
    }

    return json({
      ok: true,
      id: def.id,
      title: def.title_vi,
      sections_added: sectionsAdded,
      questions_added: questionsAdded,
    }, 201);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
};
