globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { r as deleteSurveyDefinition, s as upsertSurveyDefinition, q as addSection, k as addQuestion } from "./survey-config-db_AxTlbaW3.mjs";
import { S as SEED_REGISTRY } from "./registry_DJyaE1zC.mjs";
const prerender = false;
async function applySeed(db, seed) {
  await deleteSurveyDefinition(db, seed.id);
  await upsertSurveyDefinition(db, {
    id: seed.id,
    slug: seed.slug,
    title_vi: seed.title_vi,
    title_en: seed.title_en ?? "",
    description_vi: seed.description_vi ?? null,
    description_en: seed.description_en ?? null,
    subtitle_vi: seed.subtitle_vi ?? null,
    subtitle_en: seed.subtitle_en ?? null,
    chapter_refs: seed.chapter_refs,
    status: seed.status ?? "active",
    is_free: seed.is_free ?? 0,
    survey_type: seed.survey_type ?? "full",
    lead_fields: seed.lead_fields,
    scoring_rules: seed.scoring_rules,
    ai_config: seed.ai_config,
    translations_vi: seed.translations_vi,
    translations_en: seed.translations_en,
    order_index: seed.order_index ?? 0
  });
  let sectionsAdded = 0;
  let questionsAdded = 0;
  for (const section of seed.sections) {
    const added = await addSection(db, {
      survey_id: seed.id,
      order_idx: section.order_idx,
      title_vi: section.title_vi,
      title_en: section.title_en ?? "",
      subtitle_vi: section.subtitle_vi ?? null,
      subtitle_en: section.subtitle_en ?? null,
      ref: section.ref ?? null,
      icon: section.icon ?? null
    });
    sectionsAdded++;
    for (const q of section.questions) {
      await addQuestion(db, {
        section_id: added.id,
        question_id: q.question_id,
        order_idx: q.order_idx,
        type: q.type,
        label_vi: q.label_vi,
        label_en: q.label_en ?? "",
        placeholder_vi: q.placeholder_vi ?? null,
        placeholder_en: q.placeholder_en ?? null,
        options_vi: q.options_vi ?? null,
        options_en: q.options_en ?? null,
        scale_labels_vi: q.scale_labels_vi ?? null,
        scale_labels_en: q.scale_labels_en ?? null,
        required: q.required ?? 0,
        anchor: q.anchor ?? 0,
        weight: q.weight ?? null,
        dimension: q.dimension ?? null
      });
      questionsAdded++;
    }
  }
  return { sectionsAdded, questionsAdded };
}
const POST = async ({ params }) => {
  const id = params.id;
  if (!id) return badRequest("id is required");
  const seed = SEED_REGISTRY[id];
  if (!seed) {
    return notFound(
      `Seed '${id}' not found. Available: ${Object.keys(SEED_REGISTRY).join(", ")}`
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
        questions_added: questionsAdded
      },
      201
    );
  } catch (err) {
    return badRequest(`Seed failed: ${err instanceof Error ? err.message : String(err)}`);
  }
};
const GET = async () => {
  return json({
    seeds: Object.values(SEED_REGISTRY).map((s) => ({
      id: s.id,
      slug: s.slug,
      title_vi: s.title_vi,
      type: s.survey_type ?? "full",
      is_free: s.is_free ?? 0,
      sections: s.sections.length,
      questions: s.sections.reduce((sum, sec) => sum + sec.questions.length, 0)
    }))
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
