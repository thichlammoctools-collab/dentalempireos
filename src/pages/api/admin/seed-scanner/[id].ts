// Admin API: Generic seed endpoint for any scanner.
// POST /api/admin/seed-scanner/[id]
//
// Reads from src/data/seeds/<id>.ts. If file exists, replaces DB row + sections + questions.
// Used by /admin/scanners UI to import bundled seeds.
//
// Supported ids: 'ho-so-goc-re', 'he-thong-check', 'nhan-su-check', 'marketing-audit'.

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest, notFound } from '../../../../lib/api-helpers';
import {
  upsertSurveyDefinition,
  addSection,
  addQuestion,
  deleteSurveyDefinition,
  type SurveyDefinitionInput,
} from '../../../../lib/survey-config-db';
import { SEED_REGISTRY, type SeedScanner } from '../../../../data/seeds/registry';

export const prerender = false;

async function applySeed(db: D1Database, seed: SeedScanner) {
  // Step 1: Remove existing (cascades to sections + questions)
  await deleteSurveyDefinition(db, seed.id);

  // Step 2: Upsert definition
  await upsertSurveyDefinition(db, {
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

  // Step 3: Insert sections + questions
  let sectionsAdded = 0;
  let questionsAdded = 0;

  for (const section of seed.sections) {
    const added = await addSection(db, {
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

    for (const q of section.questions) {
      await addQuestion(db, {
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

  return { sectionsAdded, questionsAdded };
}

export const POST: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest('id is required');

  const seed = SEED_REGISTRY[id];
  if (!seed) {
    return notFound(
      `Seed '${id}' not found. Available: ${Object.keys(SEED_REGISTRY).join(', ')}`,
    );
  }

  try {
    const { sectionsAdded, questionsAdded } = await applySeed(env.DB, seed);
    return json(
      {
        success: true,
        definition_id: seed.id,
        slug: seed.slug,
        sections_added: sectionsAdded,
        questions_added: questionsAdded,
      },
      201,
    );
  } catch (err) {
    return badRequest(`Seed failed: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export const GET: APIRoute = async () => {
  return json({
    seeds: Object.values(SEED_REGISTRY).map((s) => ({
      id: s.id,
      slug: s.slug,
      title_vi: s.title_vi,
      type: s.survey_type ?? 'full',
      is_free: s.is_free ?? 0,
      sections: s.sections.length,
      questions: s.sections.reduce((sum, sec) => sum + sec.questions.length, 0),
    })),
  });
};