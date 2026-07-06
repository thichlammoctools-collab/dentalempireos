globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { Q as QUY_TRINH_CHECK_SEED } from "./quy-trinh-check_CBupDChE.mjs";
import { r as deleteSurveyDefinition, s as upsertSurveyDefinition, q as addSection, k as addQuestion } from "./survey-config-db_AxTlbaW3.mjs";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const POST = async () => {
  const def = QUY_TRINH_CHECK_SEED;
  try {
    await deleteSurveyDefinition(env.DB, def.id);
    await upsertSurveyDefinition(env.DB, {
      id: def.id,
      slug: def.slug,
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
      order_index: def.order_index ?? 99
    });
    let sectionsAdded = 0;
    let questionsAdded = 0;
    for (const sec of def.sections) {
      await addSection(env.DB, {
        id: sec.id,
        survey_id: def.id,
        title_vi: sec.title_vi,
        title_en: sec.title_en ?? sec.title_vi,
        subtitle_vi: sec.subtitle_vi ?? null,
        subtitle_en: sec.subtitle_en ?? null,
        ref: sec.ref ?? null,
        icon: sec.icon ?? null,
        order_index: sec.order_index ?? 0
      });
      sectionsAdded++;
      for (const q of sec.questions) {
        await addQuestion(env.DB, {
          id: q.id,
          section_id: sec.id,
          survey_id: def.id,
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
          order_index: q.order_index ?? 0
        });
        questionsAdded++;
      }
    }
    return json({
      ok: true,
      id: def.id,
      title: def.title_vi,
      sections_added: sectionsAdded,
      questions_added: questionsAdded
    }, 201);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
