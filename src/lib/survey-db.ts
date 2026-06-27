// Data access layer for survey responses (Hồ Sơ Gốc Rễ) in D1.

export interface SurveyResponseRow {
  id: number;
  created_at: string;
  lang: string;
  owner_name: string | null;
  clinic_name: string | null;
  clinic_address: string | null;
  email: string | null;
  years_in_operation: number | null;
  staff_count: number | null;
  // ROOTS
  roots_q1: string | null;
  roots_q2: string | null;
  roots_q3: string | null;
  roots_q4: string | null;
  roots_d1: number | null;
  roots_d2: number | null;
  roots_d3: number | null;
  roots_q4_choice: string | null;
  // SKY — Sincerity
  sky_sin_open: string | null;
  sky_s_d1: number | null;
  sky_s_d2: number | null;
  // SKY — Kindness
  sky_k_open: string | null;
  sky_k_d1: number | null;
  sky_k_d2: number | null;
  // SKY — Yielding
  sky_y_open: string | null;
  sky_y_d1: number | null;
  sky_y_d2: number | null;
  // S.T.A.R.S
  stars_s_d: number | null;
  stars_s_open: string | null;
  stars_t_d: number | null;
  stars_t_open: string | null;
  stars_a_d: number | null;
  stars_a_open: string | null;
  stars_r_d: number | null;
  stars_syn_choice: string | null;
  stars_syn_d: number | null;
  stars_syn_open: string | null;
  // Living System
  living_o1: string | null;
  living_o2: string | null;
  living_d1: number | null;
  living_d2: number | null;
  living_d3: number | null;
  living_d4: number | null;
  // Future
  future_o1: string | null;
  future_o2: string | null;
  future_o3: string | null;
  // Commitment
  commit_o1: string | null;
  commit_o2: string | null;
  commit_choice: string | null;
  signature: string | null;
  // Scores
  score_roots: number | null;
  score_sky: number | null;
  score_stars: number | null;
  score_living: number | null;
  score_total: number | null;
  // AI
  ai_analysis: string | null;
  ai_analyzed_at: string | null;
}

// ── Input type ────────────────────────────────────────────

export interface SurveyInput {
  lang: string;
  owner_name?: string | null;
  clinic_name?: string | null;
  clinic_address?: string | null;
  email?: string | null;
  years_in_operation?: number | null;
  staff_count?: number | null;
  roots_q1?: string | null;
  roots_q2?: string | null;
  roots_q3?: string | null;
  roots_q4?: string | null;
  roots_d1?: number | null;
  roots_d2?: number | null;
  roots_d3?: number | null;
  roots_q4_choice?: string | null;
  sky_sin_open?: string | null;
  sky_s_d1?: number | null;
  sky_s_d2?: number | null;
  sky_k_open?: string | null;
  sky_k_d1?: number | null;
  sky_k_d2?: number | null;
  sky_y_open?: string | null;
  sky_y_d1?: number | null;
  sky_y_d2?: number | null;
  stars_s_d?: number | null;
  stars_s_open?: string | null;
  stars_t_d?: number | null;
  stars_t_open?: string | null;
  stars_a_d?: number | null;
  stars_a_open?: string | null;
  stars_r_d?: number | null;
  stars_syn_choice?: string | null;
  stars_syn_d?: number | null;
  stars_syn_open?: string | null;
  living_o1?: string | null;
  living_o2?: string | null;
  living_d1?: number | null;
  living_d2?: number | null;
  living_d3?: number | null;
  living_d4?: number | null;
  future_o1?: string | null;
  future_o2?: string | null;
  future_o3?: string | null;
  commit_o1?: string | null;
  commit_o2?: string | null;
  commit_choice?: string | null;
  signature?: string | null;
}

// ── Score Calculator ──────────────────────────────────────

function avg(...values: (number | null | undefined)[]): number {
  const valid = values.filter((v): v is number => typeof v === 'number' && v >= 1 && v <= 5);
  if (valid.length === 0) return 0;
  return valid.reduce((s, v) => s + v, 0) / valid.length;
}

/** Scale 1-5 → percentage 0-100 */
function to100(avg5: number): number {
  return Math.round(((avg5 - 1) / 4) * 100 * 10) / 10;
}

export function calculateScores(data: SurveyInput): {
  score_roots: number;
  score_sky: number;
  score_stars: number;
  score_living: number;
  score_total: number;
} {
  // ROOTS: 3 rated dimensions
  const rootsAvg = avg(data.roots_d1, data.roots_d2, data.roots_d3);
  const score_roots = to100(rootsAvg);

  // SKY: 6 rated dimensions (2 per quality)
  const skyAvg = avg(
    data.sky_s_d1, data.sky_s_d2,
    data.sky_k_d1, data.sky_k_d2,
    data.sky_y_d1, data.sky_y_d2,
  );
  const score_sky = to100(skyAvg);

  // S.T.A.R.S: 5 rated dimensions
  const starsAvg = avg(
    data.stars_s_d, data.stars_t_d, data.stars_a_d,
    data.stars_r_d, data.stars_syn_d,
  );
  const score_stars = to100(starsAvg);

  // Living System: 4 rated dimensions
  const livingAvg = avg(data.living_d1, data.living_d2, data.living_d3, data.living_d4);
  const score_living = to100(livingAvg);

  const score_total = Math.round(((score_roots + score_sky + score_stars + score_living) / 4) * 10) / 10;

  return { score_roots, score_sky, score_stars, score_living, score_total };
}

// ── Column list for INSERT ────────────────────────────────

const COLUMNS = [
  'lang',
  'owner_name', 'clinic_name', 'clinic_address', 'email',
  'years_in_operation', 'staff_count',
  'roots_q1', 'roots_q2', 'roots_q3', 'roots_q4',
  'roots_d1', 'roots_d2', 'roots_d3', 'roots_q4_choice',
  'sky_sin_open', 'sky_s_d1', 'sky_s_d2',
  'sky_k_open', 'sky_k_d1', 'sky_k_d2',
  'sky_y_open', 'sky_y_d1', 'sky_y_d2',
  'stars_s_d', 'stars_s_open', 'stars_t_d', 'stars_t_open',
  'stars_a_d', 'stars_a_open', 'stars_r_d',
  'stars_syn_choice', 'stars_syn_d', 'stars_syn_open',
  'living_o1', 'living_o2', 'living_d1', 'living_d2', 'living_d3', 'living_d4',
  'future_o1', 'future_o2', 'future_o3',
  'commit_o1', 'commit_o2', 'commit_choice', 'signature',
  'score_roots', 'score_sky', 'score_stars', 'score_living', 'score_total',
] as const;

// ── CRUD ──────────────────────────────────────────────────

export async function createSurveyResponse(
  db: D1Database,
  input: SurveyInput,
): Promise<{ id: number }> {
  const scores = calculateScores(input);

  const values = COLUMNS.map((col) => {
    if (col === 'lang') return input.lang ?? 'vi';
    if (col === 'score_roots') return scores.score_roots;
    if (col === 'score_sky') return scores.score_sky;
    if (col === 'score_stars') return scores.score_stars;
    if (col === 'score_living') return scores.score_living;
    if (col === 'score_total') return scores.score_total;
    return (input as unknown as Record<string, unknown>)[col] ?? null;
  });

  const placeholders = COLUMNS.map(() => '?').join(', ');
  const colNames = COLUMNS.map((c) => `"${c}"`).join(', ');

  const result = await db
    .prepare(`INSERT INTO "survey_responses" (${colNames}) VALUES (${placeholders})`)
    .bind(...values)
    .run();

  const row = await db
    .prepare('SELECT "id" FROM "survey_responses" WHERE "rowid" = ?')
    .bind(result.meta.last_row_id)
    .first<{ id: number }>();

  return { id: row?.id ?? Number(result.meta.last_row_id) };
}

export async function getSurveyResponse(
  db: D1Database,
  id: number,
): Promise<SurveyResponseRow | null> {
  const row = await db
    .prepare('SELECT * FROM "survey_responses" WHERE "id" = ?')
    .bind(id)
    .first<SurveyResponseRow>();
  return row ?? null;
}

export async function listSurveyResponses(
  db: D1Database,
  opts: { limit?: number; offset?: number; minScore?: number; maxScore?: number } = {},
): Promise<SurveyResponseRow[]> {
  const { limit = 50, offset = 0, minScore, maxScore } = opts;

  let where = '1=1';
  const params: unknown[] = [];

  if (typeof minScore === 'number') {
    where += ' AND "score_total" >= ?';
    params.push(minScore);
  }
  if (typeof maxScore === 'number') {
    where += ' AND "score_total" <= ?';
    params.push(maxScore);
  }

  params.push(limit, offset);

  const { results } = await db
    .prepare(
      `SELECT * FROM "survey_responses" WHERE ${where} ORDER BY "created_at" DESC LIMIT ? OFFSET ?`,
    )
    .bind(...params)
    .all<SurveyResponseRow>();

  return results;
}

export async function countSurveyResponses(
  db: D1Database,
): Promise<number> {
  const row = await db
    .prepare('SELECT COUNT(*) as "total" FROM "survey_responses"')
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function updateAiAnalysis(
  db: D1Database,
  id: number,
  analysis: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE "survey_responses"
       SET "ai_analysis" = ?, "ai_analyzed_at" = datetime('now')
       WHERE "id" = ?`,
    )
    .bind(analysis, id)
    .run();
}

// ── Helpers for AI analysis prompt ────────────────────────

/** Build a summary object for the AI analysis prompt */
export function buildAnalysisContext(row: SurveyResponseRow): Record<string, unknown> {
  return {
    clinic: row.clinic_name,
    owner: row.owner_name,
    years: row.years_in_operation,
    staff: row.staff_count,
    scores: {
      roots: row.score_roots,
      sky: row.score_sky,
      stars: row.score_stars,
      living: row.score_living,
      total: row.score_total,
    },
    answers: {
      roots: {
        q1_purpose: row.roots_q1,
        q2_reason: row.roots_q2,
        q3_values: row.roots_q3,
        q4_stood_firm: row.roots_q4,
        d1_vision_clarity: row.roots_d1,
        d2_values_embodiment: row.roots_d2,
        d3_daily_alignment: row.roots_d3,
        q4_choice_conflict: row.roots_q4_choice,
      },
      sky: {
        sincerity_example: row.sky_sin_open,
        sincerity_honesty: row.sky_s_d1,
        sincerity_staff_honest: row.sky_s_d2,
        kindness_patient_feeling: row.sky_k_open,
        kindness_emotional_care: row.sky_k_d1,
        kindness_staff_growth: row.sky_k_d2,
        yielding_last_admitted: row.sky_y_open,
        yielding_listens: row.sky_y_d1,
        yielding_adaptable: row.sky_y_d2,
      },
      stars: {
        skills_level: row.stars_s_d,
        skills_team_map: row.stars_s_open,
        traits_hiring: row.stars_t_d,
        traits_pressure_example: row.stars_t_open,
        actions_standardized: row.stars_a_d,
        actions_training_need: row.stars_a_open,
        results_measurement: row.stars_r_d,
        synergy_current: row.stars_syn_choice,
        synergy_strength: row.stars_syn_d,
        synergy骄傲_worry: row.stars_syn_open,
      },
      living: {
        self_assessment: row.living_o1,
        strongest_weakest: row.living_o2,
        self_learning: row.living_d1,
        data_driven: row.living_d2,
        psychological_safety: row.living_d3,
        relationship_growth: row.living_d4,
      },
      future: {
        vision_3_years: row.future_o1,
        biggest_pressure: row.future_o2,
        failed_attempts: row.future_o3,
      },
      commitment: {
        ready_for_truth: row.commit_o1,
        one_small_thing: row.commit_o2,
        commitment_level: row.commit_choice,
      },
    },
  };
}
