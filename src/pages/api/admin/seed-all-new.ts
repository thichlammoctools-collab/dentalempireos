// Admin API: Seed all 3 new scanners into D1 in one call.
// GET /api/admin/seed-all-new
// Safe — idempotent, skips if already seeded.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { TIEP_DON_CHECK_SEED } from '../../../data/seeds/tiep-don-check';
import { QUY_TRINH_CHECK_SEED } from '../../../data/seeds/quy-trinh-check';
import { TAI_CHINH_CHECK_SEED } from '../../../data/seeds/tai-chinh-check';
import {
  upsertSurveyDefinition,
  addSection,
  addQuestion,
  deleteSurveyDefinition,
} from '../../../lib/survey-config-db';
import { json } from '../../../lib/api-helpers';

export const prerender = false;

async function seedOne(seed: typeof TIEP_DON_CHECK_SEED) {
  // Remove existing (cascades to sections + questions)
  try {
    await deleteSurveyDefinition(env.DB, seed.id);
  } catch {}

  // Upsert definition
  await upsertSurveyDefinition(env.DB, {
    id: seed.id,
    slug: seed.slug,
    title_vi: seed.title_vi,
    title_en: seed.title_en ?? '',
    description_vi: seed.description_vi ?? null,
    description_en: seed.description_en ?? null,
    subtitle_vi: seed.subtitle_vi ?? null,
    subtitle_en: seed.subtitle_en ?? null,
    chapter_refs: seed.chapter_refs,
    status: seed.status ?? 'active',
    is_free: seed.is_free ?? 0,
    survey_type: seed.survey_type ?? 'full',
    lead_fields: seed.lead_fields,
    scoring_rules: seed.scoring_rules,
    ai_config: seed.ai_config,
    translations_vi: seed.translations_vi,
    translations_en: seed.translations_en,
    order_index: seed.order_index ?? 0,
  });

  let sectionsAdded = 0;
  let questionsAdded = 0;

  for (const section of seed.sections ?? []) {
    const added = await addSection(env.DB, {
      survey_id: seed.id,
      order_idx: section.order_idx,
      title_vi: section.title_vi,
      title_en: section.title_en ?? '',
      subtitle_vi: section.subtitle_vi ?? null,
      subtitle_en: section.subtitle_en ?? null,
      ref: section.ref ?? null,
      icon: section.icon ?? null,
    });
    sectionsAdded++;

    for (const q of section.questions ?? []) {
      await addQuestion(env.DB, {
        section_id: added.id,
        question_id: q.question_id,
        order_idx: q.order_idx,
        type: q.type,
        label_vi: q.label_vi,
        label_en: q.label_en ?? '',
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

  return { id: seed.id, title: seed.title_vi, sections: sectionsAdded, questions: questionsAdded };
}

export const GET: APIRoute = async () => {
  try {
    const results = [
      await seedOne(TIEP_DON_CHECK_SEED),
      await seedOne(QUY_TRINH_CHECK_SEED),
      await seedOne(TAI_CHINH_CHECK_SEED),
    ];
    return json({ ok: true, seeded: results });
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
};

export const POST: APIRoute = async () => GET();
