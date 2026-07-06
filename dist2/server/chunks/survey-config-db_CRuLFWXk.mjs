globalThis.process ??= {};
globalThis.process.env ??= {};
function parseJSON(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
function parseLeadFields(raw) {
  return parseJSON(raw, {});
}
function parseScoringRules(raw) {
  return parseJSON(raw, null);
}
function parseAiConfig(raw) {
  return parseJSON(raw, {});
}
function parseUiTranslations(raw, lang) {
  return parseJSON(raw, {});
}
function parseOptions(raw) {
  return parseJSON(raw, []);
}
function parseScaleLabels(raw) {
  return parseJSON(raw, {});
}
async function listSurveyDefinitions(db, opts = {}) {
  let sql = 'SELECT * FROM "survey_definition"';
  const params = [];
  if (opts.status) {
    sql += ' WHERE "status" = ?';
    params.push(opts.status);
  }
  sql += ' ORDER BY "order_index" ASC, "created_at" DESC';
  const stmt = db.prepare(sql);
  const result = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
  return result.results ?? [];
}
async function getSurveyDefinitionById(db, id) {
  return await db.prepare('SELECT * FROM "survey_definition" WHERE "id" = ?').bind(id).first() ?? null;
}
async function getSurveyDefinitionBySlug(db, slug) {
  return await db.prepare('SELECT * FROM "survey_definition" WHERE "slug" = ?').bind(slug).first() ?? null;
}
async function getSurveyDefinitionFull(db, id) {
  const definition = await getSurveyDefinitionById(db, id);
  if (!definition) return null;
  const sections = await listSectionsBySurvey(db, id);
  const sectionsWithQuestions = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      questions: await listQuestionsBySection(db, section.id)
    }))
  );
  return { definition, sections: sectionsWithQuestions };
}
async function getSurveyDefinitionFullBySlug(db, slug) {
  const definition = await getSurveyDefinitionBySlug(db, slug);
  if (!definition) return null;
  return getSurveyDefinitionFull(db, definition.id);
}
async function upsertSurveyDefinition(db, input) {
  const now = (/* @__PURE__ */ new Date()).toISOString().slice(0, 19).replace("T", " ");
  const existing = await getSurveyDefinitionById(db, input.id);
  const createdAt = existing?.created_at ?? now;
  const row = {
    id: input.id,
    slug: input.slug,
    title_vi: input.title_vi,
    title_en: input.title_en ?? existing?.title_en ?? "",
    description_vi: input.description_vi ?? existing?.description_vi ?? null,
    description_en: input.description_en ?? existing?.description_en ?? null,
    subtitle_vi: input.subtitle_vi ?? existing?.subtitle_vi ?? null,
    subtitle_en: input.subtitle_en ?? existing?.subtitle_en ?? null,
    chapter_refs: input.chapter_refs !== void 0 ? JSON.stringify(input.chapter_refs) : existing?.chapter_refs ?? null,
    status: input.status ?? existing?.status ?? "draft",
    is_free: input.is_free ?? existing?.is_free ?? 0,
    survey_type: input.survey_type ?? existing?.survey_type ?? "full",
    lead_fields: input.lead_fields !== void 0 ? JSON.stringify(input.lead_fields) : existing?.lead_fields ?? null,
    scoring_rules: input.scoring_rules !== void 0 ? JSON.stringify(input.scoring_rules) : existing?.scoring_rules ?? null,
    ai_config: input.ai_config !== void 0 ? JSON.stringify(input.ai_config) : existing?.ai_config ?? null,
    translations_vi: input.translations_vi !== void 0 ? JSON.stringify(input.translations_vi) : existing?.translations_vi ?? null,
    translations_en: input.translations_en !== void 0 ? JSON.stringify(input.translations_en) : existing?.translations_en ?? null,
    order_index: input.order_index ?? existing?.order_index ?? 0,
    created_at: createdAt,
    updated_at: now
  };
  await db.prepare(
    `INSERT INTO "survey_definition"
        ("id","slug","title_vi","title_en","description_vi","description_en",
         "subtitle_vi","subtitle_en","chapter_refs","status","is_free","survey_type",
         "lead_fields","scoring_rules","ai_config","translations_vi","translations_en",
         "order_index","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "slug"=excluded."slug",
         "title_vi"=excluded."title_vi",
         "title_en"=excluded."title_en",
         "description_vi"=excluded."description_vi",
         "description_en"=excluded."description_en",
         "subtitle_vi"=excluded."subtitle_vi",
         "subtitle_en"=excluded."subtitle_en",
         "chapter_refs"=excluded."chapter_refs",
         "status"=excluded."status",
         "is_free"=excluded."is_free",
         "survey_type"=excluded."survey_type",
         "lead_fields"=excluded."lead_fields",
         "scoring_rules"=excluded."scoring_rules",
         "ai_config"=excluded."ai_config",
         "translations_vi"=excluded."translations_vi",
         "translations_en"=excluded."translations_en",
         "order_index"=excluded."order_index",
         "updated_at"=excluded."updated_at"`
  ).bind(
    row.id,
    row.slug,
    row.title_vi,
    row.title_en,
    row.description_vi,
    row.description_en,
    row.subtitle_vi,
    row.subtitle_en,
    row.chapter_refs,
    row.status,
    row.is_free,
    row.survey_type,
    row.lead_fields,
    row.scoring_rules,
    row.ai_config,
    row.translations_vi,
    row.translations_en,
    row.order_index,
    row.created_at,
    row.updated_at
  ).run();
  return row;
}
async function deleteSurveyDefinition(db, id) {
  await db.prepare('DELETE FROM "survey_definition" WHERE "id" = ?').bind(id).run();
}
async function countResponsesBySurvey(db, surveyId) {
  const row = await db.prepare('SELECT COUNT(*) AS total FROM "scanner_response" WHERE "survey_id" = ?').bind(surveyId).first();
  return row?.total ?? 0;
}
async function listSectionsBySurvey(db, surveyId) {
  const result = await db.prepare(
    `SELECT * FROM "survey_section" WHERE "survey_id" = ?
       ORDER BY "order_idx" ASC, "id" ASC`
  ).bind(surveyId).all();
  return result.results ?? [];
}
async function getSectionById(db, id) {
  return await db.prepare('SELECT * FROM "survey_section" WHERE "id" = ?').bind(id).first() ?? null;
}
async function addSection(db, input) {
  const lastIdx = await db.prepare(
    `SELECT COALESCE(MAX("order_idx"), -1) AS max_idx
       FROM "survey_section" WHERE "survey_id" = ?`
  ).bind(input.survey_id).first();
  const orderIdx = input.order_idx ?? (lastIdx?.max_idx ?? -1) + 1;
  const result = await db.prepare(
    `INSERT INTO "survey_section"
        ("survey_id","order_idx","title_vi","title_en","subtitle_vi","subtitle_en","ref","icon","created_at")
       VALUES (?,?,?,?,?,?,?,?,datetime('now'))
       RETURNING *`
  ).bind(
    input.survey_id,
    orderIdx,
    input.title_vi,
    input.title_en ?? "",
    input.subtitle_vi ?? null,
    input.subtitle_en ?? null,
    input.ref ?? null,
    input.icon ?? null
  ).first();
  if (!result) throw new Error("Failed to insert section");
  return result;
}
async function updateSection(db, id, input) {
  const existing = await getSectionById(db, id);
  if (!existing) return null;
  const updated = {
    ...existing,
    order_idx: input.order_idx ?? existing.order_idx,
    title_vi: input.title_vi ?? existing.title_vi,
    title_en: input.title_en ?? existing.title_en,
    subtitle_vi: input.subtitle_vi !== void 0 ? input.subtitle_vi : existing.subtitle_vi,
    subtitle_en: input.subtitle_en !== void 0 ? input.subtitle_en : existing.subtitle_en,
    ref: input.ref !== void 0 ? input.ref : existing.ref,
    icon: input.icon !== void 0 ? input.icon : existing.icon
  };
  await db.prepare(
    `UPDATE "survey_section"
       SET "order_idx"=?, "title_vi"=?, "title_en"=?,
           "subtitle_vi"=?, "subtitle_en"=?, "ref"=?, "icon"=?
       WHERE "id" = ?`
  ).bind(
    updated.order_idx,
    updated.title_vi,
    updated.title_en,
    updated.subtitle_vi,
    updated.subtitle_en,
    updated.ref,
    updated.icon,
    id
  ).run();
  return updated;
}
async function deleteSection(db, id) {
  await db.prepare('DELETE FROM "survey_section" WHERE "id" = ?').bind(id).run();
}
async function listQuestionsBySection(db, sectionId) {
  const result = await db.prepare(
    `SELECT * FROM "survey_question" WHERE "section_id" = ?
       ORDER BY "order_idx" ASC, "id" ASC`
  ).bind(sectionId).all();
  return result.results ?? [];
}
async function getQuestionById(db, id) {
  return await db.prepare('SELECT * FROM "survey_question" WHERE "id" = ?').bind(id).first() ?? null;
}
async function addQuestion(db, input) {
  const lastIdx = await db.prepare(
    `SELECT COALESCE(MAX("order_idx"), -1) AS max_idx
       FROM "survey_question" WHERE "section_id" = ?`
  ).bind(input.section_id).first();
  const orderIdx = input.order_idx ?? (lastIdx?.max_idx ?? -1) + 1;
  const result = await db.prepare(
    `INSERT INTO "survey_question"
        ("section_id","question_id","order_idx","type","label_vi","label_en",
         "placeholder_vi","placeholder_en","options_vi","options_en",
         "scale_labels_vi","scale_labels_en","required","anchor","weight","dimension","created_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
       RETURNING *`
  ).bind(
    input.section_id,
    input.question_id,
    orderIdx,
    input.type,
    input.label_vi,
    input.label_en ?? "",
    input.placeholder_vi ?? null,
    input.placeholder_en ?? null,
    input.options_vi ? JSON.stringify(input.options_vi) : null,
    input.options_en ? JSON.stringify(input.options_en) : null,
    input.scale_labels_vi ? JSON.stringify(input.scale_labels_vi) : null,
    input.scale_labels_en ? JSON.stringify(input.scale_labels_en) : null,
    input.required ?? 0,
    input.anchor ?? 0,
    input.weight ?? null,
    input.dimension ?? null
  ).first();
  if (!result) throw new Error("Failed to insert question");
  return result;
}
async function updateQuestion(db, id, input) {
  const existing = await getQuestionById(db, id);
  if (!existing) return null;
  const updated = {
    ...existing,
    order_idx: input.order_idx ?? existing.order_idx,
    question_id: input.question_id ?? existing.question_id,
    type: input.type ?? existing.type,
    label_vi: input.label_vi ?? existing.label_vi,
    label_en: input.label_en ?? existing.label_en,
    placeholder_vi: input.placeholder_vi !== void 0 ? input.placeholder_vi : existing.placeholder_vi,
    placeholder_en: input.placeholder_en !== void 0 ? input.placeholder_en : existing.placeholder_en,
    options_vi: input.options_vi !== void 0 ? input.options_vi ? JSON.stringify(input.options_vi) : null : existing.options_vi,
    options_en: input.options_en !== void 0 ? input.options_en ? JSON.stringify(input.options_en) : null : existing.options_en,
    scale_labels_vi: input.scale_labels_vi !== void 0 ? input.scale_labels_vi ? JSON.stringify(input.scale_labels_vi) : null : existing.scale_labels_vi,
    scale_labels_en: input.scale_labels_en !== void 0 ? input.scale_labels_en ? JSON.stringify(input.scale_labels_en) : null : existing.scale_labels_en,
    required: input.required ?? existing.required,
    anchor: input.anchor ?? existing.anchor,
    weight: input.weight !== void 0 ? input.weight : existing.weight,
    dimension: input.dimension !== void 0 ? input.dimension : existing.dimension
  };
  await db.prepare(
    `UPDATE "survey_question"
       SET "order_idx"=?, "question_id"=?, "type"=?, "label_vi"=?, "label_en"=?,
           "placeholder_vi"=?, "placeholder_en"=?,
           "options_vi"=?, "options_en"=?,
           "scale_labels_vi"=?, "scale_labels_en"=?,
           "required"=?, "anchor"=?, "weight"=?, "dimension"=?
       WHERE "id" = ?`
  ).bind(
    updated.order_idx,
    updated.question_id,
    updated.type,
    updated.label_vi,
    updated.label_en,
    updated.placeholder_vi,
    updated.placeholder_en,
    updated.options_vi,
    updated.options_en,
    updated.scale_labels_vi,
    updated.scale_labels_en,
    updated.required,
    updated.anchor,
    updated.weight,
    updated.dimension,
    id
  ).run();
  return updated;
}
async function deleteQuestion(db, id) {
  await db.prepare('DELETE FROM "survey_question" WHERE "id" = ?').bind(id).run();
}
function validateQuestionInput(input) {
  const errors = [];
  if (!input.question_id?.trim()) errors.push("question_id là bắt buộc");
  if (!input.type) errors.push("type là bắt buộc");
  else if (!["textarea", "select", "radio", "yesno"].includes(input.type)) {
    errors.push("type không hợp lệ");
  }
  if (!input.label_vi?.trim()) errors.push("label_vi là bắt buộc");
  if (input.type === "radio" && !input.options_vi?.length) {
    errors.push("radio type cần options_vi");
  }
  return { ok: errors.length === 0, errors };
}
export {
  parseScoringRules as a,
  parseScaleLabels as b,
  parseOptions as c,
  getSurveyDefinitionById as d,
  countResponsesBySurvey as e,
  deleteQuestion as f,
  getSurveyDefinitionFull as g,
  getQuestionById as h,
  listQuestionsBySection as i,
  getSectionById as j,
  addQuestion as k,
  listSurveyDefinitions as l,
  deleteSection as m,
  updateSection as n,
  listSectionsBySurvey as o,
  parseAiConfig as p,
  addSection as q,
  deleteSurveyDefinition as r,
  upsertSurveyDefinition as s,
  getSurveyDefinitionFullBySlug as t,
  updateQuestion as u,
  validateQuestionInput as v,
  getSurveyDefinitionBySlug as w,
  parseUiTranslations as x,
  parseLeadFields as y
};
