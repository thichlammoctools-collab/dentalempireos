globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { H as HO_SO_GOC_RE_SEED, S as SECTIONS } from "./ho-so-goc-re_Ngf1_kpb.mjs";
import { r as deleteSurveyDefinition, s as upsertSurveyDefinition, q as addSection, k as addQuestion } from "./survey-config-db_AxTlbaW3.mjs";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const POST = async () => {
  try {
    const db = env.DB;
    await deleteSurveyDefinition(db, HO_SO_GOC_RE_SEED.id);
    await upsertSurveyDefinition(db, {
      id: HO_SO_GOC_RE_SEED.id,
      slug: HO_SO_GOC_RE_SEED.slug,
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
      order_index: HO_SO_GOC_RE_SEED.order_index
    });
    let sectionsAdded = 0;
    let questionsAdded = 0;
    for (const section of SECTIONS) {
      const added = await addSection(db, {
        survey_id: HO_SO_GOC_RE_SEED.id,
        order_idx: section.order_idx,
        title_vi: section.title_vi,
        title_en: section.title_en,
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
          dimension: q.dimension ?? null
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
        questions_added: questionsAdded
      },
      201
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return badRequest(`Seed failed: ${msg}`);
  }
};
const GET = async () => {
  return json({
    message: "POST to this endpoint to seed the Hồ Sơ Gốc Rễ survey.",
    method: "POST"
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
