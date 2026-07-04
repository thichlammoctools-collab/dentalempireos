// Data access layer for survey_definition / survey_section / survey_question.
// Generic, configurable "scanner" / "audit tool" definitions stored in D1.
// Replaces the hardcoded "Hồ Sơ Gốc Rễ" survey structure.

// ── Types ───────────────────────────────────────────────

export type SurveyStatus = 'draft' | 'active' | 'archived';
export type SurveyType = 'mini' | 'full' | 'checklist';
export type QuestionType = 'textarea' | 'select' | 'radio' | 'yesno';

export interface LeadFieldConfig {
  label_vi: string;
  label_en?: string;
  required?: boolean;
  placeholder_vi?: string;
  placeholder_en?: string;
  type?: 'text' | 'email' | 'number';
}

export interface LeadFieldsConfig {
  owner_name?: LeadFieldConfig;
  clinic_name?: LeadFieldConfig;
  clinic_address?: LeadFieldConfig;
  email?: LeadFieldConfig;
  years_in_operation?: LeadFieldConfig;
  staff_count?: LeadFieldConfig;
}

export interface ScoringDimension {
  id: string;
  name_vi: string;
  name_en?: string;
  question_ids: string[];                    // which questions contribute (select type only)
  formula: 'avg' | 'sum' | 'count_if';
  weight?: number;                           // for weighted average total
}

export interface ScoringRules {
  dimensions: ScoringDimension[];
  total_formula: 'average' | 'weighted_average';
  thresholds: {
    excellent: number;                       // >= this
    good: number;
    needs_work: number;
    critical: number;                        // < needs_work
  };
}

export interface AiConfig {
  prompt_vi?: string;
  prompt_en?: string;
  model_override?: string | null;
  max_tokens_override?: number | null;
  analysis_sections?: Array<{
    id: string;
    title_vi: string;
    title_en?: string;
  }>;
  plan_prompt_vi?: string;
  plan_prompt_en?: string;
}

export interface UiTranslations {
  submitButton?: string;
  submitting?: string;
  required?: string;
  start?: string;
  back?: string;
  next?: string;
  prev?: string;
  intro_title?: string;
  intro_desc?: string;
  restore_draft?: string;
  clear_draft?: string;
  submit_title?: string;
  submit_desc?: string;
  step_label?: string;                       // e.g. "Phần" or "Part"
  submit_label?: string;                     // e.g. "Gửi" or "Submit"
}

export interface SurveyDefinitionRow {
  id: string;
  slug: string;
  title_vi: string;
  title_en: string;
  description_vi: string | null;
  description_en: string | null;
  subtitle_vi: string | null;
  subtitle_en: string | null;
  chapter_refs: string | null;               // JSON array
  status: SurveyStatus;
  is_free: number;
  survey_type: SurveyType;
  lead_fields: string | null;                // JSON
  scoring_rules: string | null;              // JSON
  ai_config: string | null;                  // JSON
  translations_vi: string | null;            // JSON
  translations_en: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SurveySectionRow {
  id: number;
  survey_id: string;
  order_idx: number;
  title_vi: string;
  title_en: string;
  subtitle_vi: string | null;
  subtitle_en: string | null;
  ref: string | null;
  icon: string | null;
  created_at: string;
}

export interface SurveyQuestionRow {
  id: number;
  section_id: number;
  question_id: string;
  order_idx: number;
  type: QuestionType;
  label_vi: string;
  label_en: string;
  placeholder_vi: string | null;
  placeholder_en: string | null;
  options_vi: string | null;
  options_en: string | null;
  scale_labels_vi: string | null;
  scale_labels_en: string | null;
  required: number;
  anchor: number;
  weight: number | null;
  dimension: string | null;
  created_at: string;
}

// ── Parsed types (with JSON decoded) ───────────────────

export interface SurveyDefinitionFull {
  definition: SurveyDefinitionRow;
  sections: Array<SurveySectionRow & { questions: SurveyQuestionRow[] }>;
}

export interface SurveyDefinitionInput {
  id?: string;
  slug?: string;
  title_vi: string;
  title_en?: string;
  description_vi?: string | null;
  description_en?: string | null;
  subtitle_vi?: string | null;
  subtitle_en?: string | null;
  chapter_refs?: string[] | null;
  status?: SurveyStatus;
  is_free?: number;
  survey_type?: SurveyType;
  lead_fields?: LeadFieldsConfig | null;
  scoring_rules?: ScoringRules | null;
  ai_config?: AiConfig | null;
  translations_vi?: UiTranslations | null;
  translations_en?: UiTranslations | null;
  order_index?: number;
}

export interface SurveySectionInput {
  survey_id: string;
  order_idx?: number;
  title_vi: string;
  title_en?: string;
  subtitle_vi?: string | null;
  subtitle_en?: string | null;
  ref?: string | null;
  icon?: string | null;
}

export interface SurveyQuestionInput {
  section_id: number;
  question_id: string;
  order_idx?: number;
  type: QuestionType;
  label_vi: string;
  label_en?: string;
  placeholder_vi?: string | null;
  placeholder_en?: string | null;
  options_vi?: string[] | null;
  options_en?: string[] | null;
  scale_labels_vi?: Record<string, string> | null;
  scale_labels_en?: Record<string, string> | null;
  required?: number;
  anchor?: number;
  weight?: number | null;
  dimension?: string | null;
}

// ── Helpers ─────────────────────────────────────────────

export function parseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseLeadFields(raw: string | null | undefined): LeadFieldsConfig {
  return parseJSON<LeadFieldsConfig>(raw, {});
}

export function parseScoringRules(raw: string | null | undefined): ScoringRules | null {
  return parseJSON<ScoringRules | null>(raw, null);
}

export function parseAiConfig(raw: string | null | undefined): AiConfig {
  return parseJSON<AiConfig>(raw, {});
}

export function parseUiTranslations(raw: string | null | undefined, lang: 'vi' | 'en'): UiTranslations {
  return parseJSON<UiTranslations>(raw, {});
}

export function parseChapterRefs(raw: string | null | undefined): string[] {
  return parseJSON<string[]>(raw, []);
}

export function parseOptions(raw: string | null | undefined): string[] {
  return parseJSON<string[]>(raw, []);
}

export function parseScaleLabels(raw: string | null | undefined): Record<string, string> {
  return parseJSON<Record<string, string>>(raw, {});
}

// ── CRUD: Survey Definition ────────────────────────────

export async function listSurveyDefinitions(
  db: D1Database,
  opts: { status?: SurveyStatus } = {},
): Promise<SurveyDefinitionRow[]> {
  let sql = 'SELECT * FROM "survey_definition"';
  const params: unknown[] = [];

  if (opts.status) {
    sql += ' WHERE "status" = ?';
    params.push(opts.status);
  }

  sql += ' ORDER BY "order_index" ASC, "created_at" DESC';

  const stmt = db.prepare(sql);
  const result = params.length > 0
    ? await stmt.bind(...params).all<SurveyDefinitionRow>()
    : await stmt.all<SurveyDefinitionRow>();
  return result.results ?? [];
}

export async function getSurveyDefinitionById(
  db: D1Database,
  id: string,
): Promise<SurveyDefinitionRow | null> {
  return await db
    .prepare('SELECT * FROM "survey_definition" WHERE "id" = ?')
    .bind(id)
    .first<SurveyDefinitionRow>() ?? null;
}

export async function getSurveyDefinitionBySlug(
  db: D1Database,
  slug: string,
): Promise<SurveyDefinitionRow | null> {
  return await db
    .prepare('SELECT * FROM "survey_definition" WHERE "slug" = ?')
    .bind(slug)
    .first<SurveyDefinitionRow>() ?? null;
}

export async function getSurveyDefinitionFull(
  db: D1Database,
  id: string,
): Promise<SurveyDefinitionFull | null> {
  const definition = await getSurveyDefinitionById(db, id);
  if (!definition) return null;

  const sections = await listSectionsBySurvey(db, id);
  const sectionsWithQuestions = await Promise.all(
    sections.map(async (section) => ({
      ...section,
      questions: await listQuestionsBySection(db, section.id),
    })),
  );

  return { definition, sections: sectionsWithQuestions };
}

export async function getSurveyDefinitionFullBySlug(
  db: D1Database,
  slug: string,
): Promise<SurveyDefinitionFull | null> {
  const definition = await getSurveyDefinitionBySlug(db, slug);
  if (!definition) return null;
  return getSurveyDefinitionFull(db, definition.id);
}

export async function upsertSurveyDefinition(
  db: D1Database,
  input: SurveyDefinitionInput & { id: string; slug: string },
): Promise<SurveyDefinitionRow> {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const existing = await getSurveyDefinitionById(db, input.id);
  const createdAt = existing?.created_at ?? now;

  const row: SurveyDefinitionRow = {
    id: input.id,
    slug: input.slug,
    title_vi: input.title_vi,
    title_en: input.title_en ?? existing?.title_en ?? '',
    description_vi: input.description_vi ?? existing?.description_vi ?? null,
    description_en: input.description_en ?? existing?.description_en ?? null,
    subtitle_vi: input.subtitle_vi ?? existing?.subtitle_vi ?? null,
    subtitle_en: input.subtitle_en ?? existing?.subtitle_en ?? null,
    chapter_refs: input.chapter_refs !== undefined
      ? JSON.stringify(input.chapter_refs)
      : existing?.chapter_refs ?? null,
    status: input.status ?? existing?.status ?? 'draft',
    is_free: input.is_free ?? existing?.is_free ?? 0,
    survey_type: input.survey_type ?? existing?.survey_type ?? 'full',
    lead_fields: input.lead_fields !== undefined
      ? JSON.stringify(input.lead_fields)
      : existing?.lead_fields ?? null,
    scoring_rules: input.scoring_rules !== undefined
      ? JSON.stringify(input.scoring_rules)
      : existing?.scoring_rules ?? null,
    ai_config: input.ai_config !== undefined
      ? JSON.stringify(input.ai_config)
      : existing?.ai_config ?? null,
    translations_vi: input.translations_vi !== undefined
      ? JSON.stringify(input.translations_vi)
      : existing?.translations_vi ?? null,
    translations_en: input.translations_en !== undefined
      ? JSON.stringify(input.translations_en)
      : existing?.translations_en ?? null,
    order_index: input.order_index ?? existing?.order_index ?? 0,
    created_at: createdAt,
    updated_at: now,
  };

  await db
    .prepare(
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
         "updated_at"=excluded."updated_at"`,
    )
    .bind(
      row.id, row.slug, row.title_vi, row.title_en,
      row.description_vi, row.description_en,
      row.subtitle_vi, row.subtitle_en,
      row.chapter_refs, row.status, row.is_free, row.survey_type,
      row.lead_fields, row.scoring_rules, row.ai_config,
      row.translations_vi, row.translations_en,
      row.order_index, row.created_at, row.updated_at,
    )
    .run();

  return row;
}

export async function deleteSurveyDefinition(
  db: D1Database,
  id: string,
): Promise<void> {
  await db
    .prepare('DELETE FROM "survey_definition" WHERE "id" = ?')
    .bind(id)
    .run();
}

export async function countResponsesBySurvey(
  db: D1Database,
  surveyId: string,
): Promise<number> {
  const row = await db
    .prepare('SELECT COUNT(*) AS total FROM "scanner_response" WHERE "survey_id" = ?')
    .bind(surveyId)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

// ── CRUD: Survey Section ───────────────────────────────

export async function listSectionsBySurvey(
  db: D1Database,
  surveyId: string,
): Promise<SurveySectionRow[]> {
  const result = await db
    .prepare(
      `SELECT * FROM "survey_section" WHERE "survey_id" = ?
       ORDER BY "order_idx" ASC, "id" ASC`,
    )
    .bind(surveyId)
    .all<SurveySectionRow>();
  return result.results ?? [];
}

export async function getSectionById(
  db: D1Database,
  id: number,
): Promise<SurveySectionRow | null> {
  return await db
    .prepare('SELECT * FROM "survey_section" WHERE "id" = ?')
    .bind(id)
    .first<SurveySectionRow>() ?? null;
}

export async function addSection(
  db: D1Database,
  input: SurveySectionInput,
): Promise<SurveySectionRow> {
  // Append to end by default
  const lastIdx = await db
    .prepare(
      `SELECT COALESCE(MAX("order_idx"), -1) AS max_idx
       FROM "survey_section" WHERE "survey_id" = ?`,
    )
    .bind(input.survey_id)
    .first<{ max_idx: number }>();

  const orderIdx = input.order_idx ?? ((lastIdx?.max_idx ?? -1) + 1);

  const result = await db
    .prepare(
      `INSERT INTO "survey_section"
        ("survey_id","order_idx","title_vi","title_en","subtitle_vi","subtitle_en","ref","icon","created_at")
       VALUES (?,?,?,?,?,?,?,?,datetime('now'))
       RETURNING *`,
    )
    .bind(
      input.survey_id,
      orderIdx,
      input.title_vi,
      input.title_en ?? '',
      input.subtitle_vi ?? null,
      input.subtitle_en ?? null,
      input.ref ?? null,
      input.icon ?? null,
    )
    .first<SurveySectionRow>();

  if (!result) throw new Error('Failed to insert section');
  return result;
}

export async function updateSection(
  db: D1Database,
  id: number,
  input: Partial<SurveySectionInput>,
): Promise<SurveySectionRow | null> {
  const existing = await getSectionById(db, id);
  if (!existing) return null;

  const updated: SurveySectionRow = {
    ...existing,
    order_idx: input.order_idx ?? existing.order_idx,
    title_vi: input.title_vi ?? existing.title_vi,
    title_en: input.title_en ?? existing.title_en,
    subtitle_vi: input.subtitle_vi !== undefined ? input.subtitle_vi : existing.subtitle_vi,
    subtitle_en: input.subtitle_en !== undefined ? input.subtitle_en : existing.subtitle_en,
    ref: input.ref !== undefined ? input.ref : existing.ref,
    icon: input.icon !== undefined ? input.icon : existing.icon,
  };

  await db
    .prepare(
      `UPDATE "survey_section"
       SET "order_idx"=?, "title_vi"=?, "title_en"=?,
           "subtitle_vi"=?, "subtitle_en"=?, "ref"=?, "icon"=?
       WHERE "id" = ?`,
    )
    .bind(
      updated.order_idx, updated.title_vi, updated.title_en,
      updated.subtitle_vi, updated.subtitle_en,
      updated.ref, updated.icon, id,
    )
    .run();

  return updated;
}

export async function deleteSection(
  db: D1Database,
  id: number,
): Promise<void> {
  await db
    .prepare('DELETE FROM "survey_section" WHERE "id" = ?')
    .bind(id)
    .run();
}

export async function reorderSections(
  db: D1Database,
  surveyId: string,
  orderedIds: number[],
): Promise<void> {
  const statements = orderedIds.map((id, idx) =>
    db
      .prepare(
        `UPDATE "survey_section" SET "order_idx" = ?
         WHERE "id" = ? AND "survey_id" = ?`,
      )
      .bind(idx, id, surveyId),
  );
  await db.batch(statements);
}

// ── CRUD: Survey Question ──────────────────────────────

export async function listQuestionsBySection(
  db: D1Database,
  sectionId: number,
): Promise<SurveyQuestionRow[]> {
  const result = await db
    .prepare(
      `SELECT * FROM "survey_question" WHERE "section_id" = ?
       ORDER BY "order_idx" ASC, "id" ASC`,
    )
    .bind(sectionId)
    .all<SurveyQuestionRow>();
  return result.results ?? [];
}

export async function listQuestionsBySurvey(
  db: D1Database,
  surveyId: string,
): Promise<SurveyQuestionRow[]> {
  const result = await db
    .prepare(
      `SELECT q.*
       FROM "survey_question" q
       INNER JOIN "survey_section" s ON q."section_id" = s."id"
       WHERE s."survey_id" = ?
       ORDER BY s."order_idx" ASC, q."order_idx" ASC`,
    )
    .bind(surveyId)
    .all<SurveyQuestionRow>();
  return result.results ?? [];
}

export async function getQuestionById(
  db: D1Database,
  id: number,
): Promise<SurveyQuestionRow | null> {
  return await db
    .prepare('SELECT * FROM "survey_question" WHERE "id" = ?')
    .bind(id)
    .first<SurveyQuestionRow>() ?? null;
}

export async function addQuestion(
  db: D1Database,
  input: SurveyQuestionInput,
): Promise<SurveyQuestionRow> {
  // Append to end by default
  const lastIdx = await db
    .prepare(
      `SELECT COALESCE(MAX("order_idx"), -1) AS max_idx
       FROM "survey_question" WHERE "section_id" = ?`,
    )
    .bind(input.section_id)
    .first<{ max_idx: number }>();

  const orderIdx = input.order_idx ?? ((lastIdx?.max_idx ?? -1) + 1);

  const result = await db
    .prepare(
      `INSERT INTO "survey_question"
        ("section_id","question_id","order_idx","type","label_vi","label_en",
         "placeholder_vi","placeholder_en","options_vi","options_en",
         "scale_labels_vi","scale_labels_en","required","anchor","weight","dimension","created_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))
       RETURNING *`,
    )
    .bind(
      input.section_id,
      input.question_id,
      orderIdx,
      input.type,
      input.label_vi,
      input.label_en ?? '',
      input.placeholder_vi ?? null,
      input.placeholder_en ?? null,
      input.options_vi ? JSON.stringify(input.options_vi) : null,
      input.options_en ? JSON.stringify(input.options_en) : null,
      input.scale_labels_vi ? JSON.stringify(input.scale_labels_vi) : null,
      input.scale_labels_en ? JSON.stringify(input.scale_labels_en) : null,
      input.required ?? 0,
      input.anchor ?? 0,
      input.weight ?? null,
      input.dimension ?? null,
    )
    .first<SurveyQuestionRow>();

  if (!result) throw new Error('Failed to insert question');
  return result;
}

export async function updateQuestion(
  db: D1Database,
  id: number,
  input: Partial<SurveyQuestionInput>,
): Promise<SurveyQuestionRow | null> {
  const existing = await getQuestionById(db, id);
  if (!existing) return null;

  const updated: SurveyQuestionRow = {
    ...existing,
    order_idx: input.order_idx ?? existing.order_idx,
    question_id: input.question_id ?? existing.question_id,
    type: input.type ?? existing.type,
    label_vi: input.label_vi ?? existing.label_vi,
    label_en: input.label_en ?? existing.label_en,
    placeholder_vi: input.placeholder_vi !== undefined ? input.placeholder_vi : existing.placeholder_vi,
    placeholder_en: input.placeholder_en !== undefined ? input.placeholder_en : existing.placeholder_en,
    options_vi: input.options_vi !== undefined
      ? (input.options_vi ? JSON.stringify(input.options_vi) : null)
      : existing.options_vi,
    options_en: input.options_en !== undefined
      ? (input.options_en ? JSON.stringify(input.options_en) : null)
      : existing.options_en,
    scale_labels_vi: input.scale_labels_vi !== undefined
      ? (input.scale_labels_vi ? JSON.stringify(input.scale_labels_vi) : null)
      : existing.scale_labels_vi,
    scale_labels_en: input.scale_labels_en !== undefined
      ? (input.scale_labels_en ? JSON.stringify(input.scale_labels_en) : null)
      : existing.scale_labels_en,
    required: input.required ?? existing.required,
    anchor: input.anchor ?? existing.anchor,
    weight: input.weight !== undefined ? input.weight : existing.weight,
    dimension: input.dimension !== undefined ? input.dimension : existing.dimension,
  };

  await db
    .prepare(
      `UPDATE "survey_question"
       SET "order_idx"=?, "question_id"=?, "type"=?, "label_vi"=?, "label_en"=?,
           "placeholder_vi"=?, "placeholder_en"=?,
           "options_vi"=?, "options_en"=?,
           "scale_labels_vi"=?, "scale_labels_en"=?,
           "required"=?, "anchor"=?, "weight"=?, "dimension"=?
       WHERE "id" = ?`,
    )
    .bind(
      updated.order_idx, updated.question_id, updated.type,
      updated.label_vi, updated.label_en,
      updated.placeholder_vi, updated.placeholder_en,
      updated.options_vi, updated.options_en,
      updated.scale_labels_vi, updated.scale_labels_en,
      updated.required, updated.anchor, updated.weight, updated.dimension,
      id,
    )
    .run();

  return updated;
}

export async function deleteQuestion(
  db: D1Database,
  id: number,
): Promise<void> {
  await db
    .prepare('DELETE FROM "survey_question" WHERE "id" = ?')
    .bind(id)
    .run();
}

export async function reorderQuestions(
  db: D1Database,
  sectionId: number,
  orderedIds: number[],
): Promise<void> {
  const statements = orderedIds.map((id, idx) =>
    db
      .prepare(
        `UPDATE "survey_question" SET "order_idx" = ?
         WHERE "id" = ? AND "section_id" = ?`,
      )
      .bind(idx, id, sectionId),
  );
  await db.batch(statements);
}

// ── Validation ─────────────────────────────────────────

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateQuestionInput(input: Partial<SurveyQuestionInput>): ValidationResult {
  const errors: string[] = [];

  if (!input.question_id?.trim()) errors.push('question_id là bắt buộc');
  if (!input.type) errors.push('type là bắt buộc');
  else if (!['textarea', 'select', 'radio', 'yesno'].includes(input.type)) {
    errors.push('type không hợp lệ');
  }
  if (!input.label_vi?.trim()) errors.push('label_vi là bắt buộc');

  if (input.type === 'radio' && !input.options_vi?.length) {
    errors.push('radio type cần options_vi');
  }

  return { ok: errors.length === 0, errors };
}