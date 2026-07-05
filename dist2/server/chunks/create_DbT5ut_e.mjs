globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { u as upsertApp } from "./app-db_BINE4Y41.mjs";
import { s as upsertSurveyDefinition, q as addSection, k as addQuestion } from "./survey-config-db_FzodKoeP.mjs";
const prerender = false;
const VALID_TYPES = ["survey", "ebook_ai", "course_ai", "tool", "generator"];
const VALID_STATUSES = ["draft", "active", "archived"];
async function slugExists(db, slug, table) {
  const row = await db.prepare(`SELECT 1 FROM "${table}" WHERE "slug" = ?`).bind(slug).first();
  return !!row;
}
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  if (!body.type || !VALID_TYPES.includes(body.type)) {
    return badRequest(`Invalid type. Must be one of: ${VALID_TYPES.join(", ")}`);
  }
  if (!body.name?.trim()) return badRequest("name is required");
  if (!body.generated) return badRequest("generated config is required");
  const type = body.type;
  const name = body.name.trim();
  const status = VALID_STATUSES.includes(body.status ?? "") ? body.status : "draft";
  const isFree = body.is_free === 1 ? 1 : 0;
  let slug = body.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  slug = slug.replace(/^app-/, "").replace(/^scan-/, "");
  let suffix = 2;
  while (await slugExists(env.DB, slug, "ai_application")) {
    slug = `${slug}-${suffix++}`;
  }
  const appId = crypto.randomUUID();
  let scannerId;
  let scannerSlug = "";
  let configJsonStr = body.config_json;
  if (!configJsonStr && body.generated?.config_json) {
    configJsonStr = JSON.stringify(body.generated.config_json);
  }
  if (type === "survey" && body.generated?.config_json?.scanner_definition) {
    const scannerDef = body.generated.config_json.scanner_definition;
    scannerSlug = scannerDef.title_vi.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    suffix = 2;
    while (await slugExists(env.DB, scannerSlug, "survey_definition")) {
      scannerSlug = `${scannerSlug}-${suffix++}`;
    }
    scannerId = crypto.randomUUID();
    const aiConfig = {
      prompt_vi: body.generated.config_json.prompt_vi,
      prompt_en: body.generated.config_json.prompt_en || void 0,
      analysis_sections: body.generated.config_json.analysis_sections
    };
    await upsertSurveyDefinition(env.DB, {
      id: scannerId,
      slug: scannerSlug,
      title_vi: scannerDef.title_vi,
      title_en: scannerDef.title_en || scannerDef.title_vi,
      description_vi: scannerDef.description_vi,
      description_en: scannerDef.description_vi,
      status: "draft",
      is_free: isFree,
      survey_type: scannerDef.survey_type,
      scoring_rules: scannerDef.scoring_rules,
      ai_config: aiConfig,
      order_index: 999
    });
    for (let sIdx = 0; sIdx < scannerDef.sections.length; sIdx++) {
      const sec = scannerDef.sections[sIdx];
      const sectionRow = await addSection(env.DB, {
        survey_id: scannerId,
        order_idx: sIdx,
        title_vi: sec.title_vi,
        title_en: sec.title_en || sec.title_vi,
        icon: sec.icon || null
      });
      const dimMap = {};
      if (scannerDef.scoring_rules?.dimensions) {
        for (const dim of scannerDef.scoring_rules.dimensions) {
          for (const qid of dim.question_ids) {
            dimMap[qid] = dim.id;
          }
        }
      }
      for (let qIdx = 0; qIdx < sec.questions.length; qIdx++) {
        const q = sec.questions[qIdx];
        const questionId = q.question_id || `q_${sIdx}_${qIdx}`;
        const dimension = dimMap[questionId] || q.dimension || null;
        await addQuestion(env.DB, {
          section_id: sectionRow.id,
          question_id: questionId,
          order_idx: qIdx,
          type: q.type,
          label_vi: q.label_vi,
          label_en: q.label_en || q.label_vi,
          scale_labels_vi: q.scale_labels_vi || null,
          options_vi: q.options_vi || null,
          required: q.required ?? 0,
          dimension,
          anchor: q.anchor ?? 0,
          weight: q.weight ?? null
        });
      }
    }
  }
  await upsertApp(env.DB, {
    id: appId,
    slug,
    name,
    description: body.description?.trim() || null,
    type,
    status,
    is_free: isFree,
    config_json: configJsonStr,
    linked_scanner_id: scannerId || null
  });
  return json({ id: appId, linked_scanner_id: scannerId }, 201);
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
