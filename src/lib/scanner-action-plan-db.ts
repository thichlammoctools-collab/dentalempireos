// Data access layer for normalized Scanner action plans.
// Phase 1A deliberately exposes storage contracts only; generation and routes arrive later.

import { parseScores } from './scanner-response-db';

export type ScannerActionPlanStatus = 'active' | 'archived';
export type ScannerActionPlanGenerationState = 'pending' | 'ready';
export type ScannerActionPlanGenerationProvenance = 'legacy_ai_plan' | 'phase_1b_queue';
export type ScannerActionPriority = 'low' | 'medium' | 'high';
export type ScannerActionStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type ScannerActionPlanSnapshotKind = 'baseline' | 'rescan';

export interface ScannerActionPlanRow {
  id: string;
  user_id: string;
  survey_id: string;
  source_response_id: number | null;
  source_response_purged_at: string | null;
  generation_run_id: string;
  generation_state: ScannerActionPlanGenerationState;
  generation_provenance: ScannerActionPlanGenerationProvenance;
  status: ScannerActionPlanStatus;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScannerActionPlanScoreSnapshotRow {
  id: string;
  plan_id: string;
  response_id: number | null;
  snapshot_kind: ScannerActionPlanSnapshotKind;
  score_total: number | null;
  scores_json: string;
  response_created_at: string;
  created_at: string;
}

export interface ScannerActionPlanActionRow {
  id: string;
  plan_id: string;
  position: number;
  title: string;
  description: string | null;
  category: string | null;
  priority: ScannerActionPriority;
  target_days: number | null;
  status: ScannerActionStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScannerActionPlanActionProgressRow {
  id: string;
  action_id: string;
  user_id: string;
  status: ScannerActionStatus;
  note: string | null;
  created_at: string;
}

interface ScannerResponseScoreRow {
  id: number;
  survey_id: string;
  created_at: string;
  expires_at: string;
  scores_json: string | null;
}

export interface ScannerActionPlanActionInput {
  position: number;
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: ScannerActionPriority;
  targetDays?: number | null;
}

export interface ScannerActionPlanActiveLease {
  responseId: number;
  jobType: 'plan';
  runId: string;
}

export interface CreateOrGetScannerActionPlanInput {
  userId: string;
  responseId: number;
  generationRunId: string;
  /** Phase 1B writes require this currently-running scanner_ai_job lease. */
  activeLease?: ScannerActionPlanActiveLease;
  title?: string | null;
  summary?: string | null;
}

export interface PersistScannerActionPlanActionSetInput {
  planId: string;
  userId: string;
  generationRunId: string;
  /** Phase 1B writes require this currently-running scanner_ai_job lease. */
  activeLease?: ScannerActionPlanActiveLease;
  title?: string | null;
  summary?: string | null;
  actions: ScannerActionPlanActionInput[];
}

function timestamp(): string {
  return new Date().toISOString();
}

function id(): string {
  return crypto.randomUUID();
}

function isActionPriority(value: string): value is ScannerActionPriority {
  return value === 'low' || value === 'medium' || value === 'high';
}

function isActionStatus(value: string): value is ScannerActionStatus {
  return value === 'not_started' || value === 'in_progress' || value === 'completed' || value === 'skipped';
}

function activePlanLeaseExists(lease: ScannerActionPlanActiveLease | undefined): string {
  if (!lease) return '1 = 1';
  return `EXISTS (
    SELECT 1 FROM "scanner_ai_job" job
    WHERE job."response_id" = ? AND job."job_type" = ? AND job."run_id" = ? AND job."status" = 'running'
  )`;
}

function activePlanLeaseBindings(lease: ScannerActionPlanActiveLease | undefined): unknown[] {
  return lease ? [lease.responseId, lease.jobType, lease.runId] : [];
}

async function getUnexpiredOwnedScannerResponse(
  db: D1Database,
  responseId: number,
  userId: string,
): Promise<ScannerResponseScoreRow | null> {
  return await db.prepare(
    `SELECT response."id", response."survey_id", response."created_at", response."expires_at", response."scores_json"
     FROM "scanner_response" response
     INNER JOIN "scanner_history" history
        ON history."response_id" = response."id" AND history."survey_id" = response."survey_id"
     WHERE response."id" = ? AND history."user_id" = ? AND response."expires_at" > ?
     ORDER BY history."created_at" ASC, history."id" ASC
     LIMIT 1`,
  ).bind(responseId, userId, timestamp()).first<ScannerResponseScoreRow>() ?? null;
}

function createBaselineSnapshot(
  plan: ScannerActionPlanRow,
  response: ScannerResponseScoreRow,
): ScannerActionPlanScoreSnapshotRow {
  const scores = parseScores(response.scores_json);
  return {
    id: id(),
    plan_id: plan.id,
    response_id: response.id,
    snapshot_kind: 'baseline',
    score_total: scores.total ?? null,
    scores_json: JSON.stringify(scores),
    response_created_at: response.created_at,
    created_at: plan.created_at,
  };
}

/**
 * Creates a generation-pending plan or returns the plan already claimed by the
 * exact scanner_ai_job.run_id. A replacement queue run may reclaim only an
 * active, actionless Phase 1B plan that is still pending for the same response.
 * The plan and baseline snapshot are one D1 batch, so a failed insert cannot
 * leave a partial plan behind.
 */
export async function createOrGetScannerActionPlan(
  db: D1Database,
  input: CreateOrGetScannerActionPlanInput,
): Promise<ScannerActionPlanRow> {
  if (!input.generationRunId.trim()) throw new Error('Plan generation run ID is required.');

  const existing = await db.prepare(
    'SELECT * FROM "scanner_action_plan" WHERE "generation_run_id" = ?',
  ).bind(input.generationRunId).first<ScannerActionPlanRow>();
  if (existing) {
    if (existing.user_id !== input.userId || existing.source_response_id !== input.responseId) {
      throw new Error('Plan generation run does not match this Scanner response.');
    }
    return existing;
  }

  const existingSourcePlan = await db.prepare(
    'SELECT * FROM "scanner_action_plan" WHERE "source_response_id" = ?',
  ).bind(input.responseId).first<ScannerActionPlanRow>();
  if (existingSourcePlan) {
    if (existingSourcePlan.user_id !== input.userId) {
      throw new Error('Scanner action plan is not owned by user.');
    }

    // A terminal queue failure may produce a new run ID. Only its unready,
    // actionless queue plan is reclaimable; ready and legacy plans are immutable.
    const reclaimed = await db.prepare(
      `UPDATE "scanner_action_plan"
       SET "generation_run_id" = ?, "title" = ?, "summary" = ?, "updated_at" = ?
       WHERE "id" = ? AND "user_id" = ? AND "source_response_id" = ?
         AND "generation_run_id" = ?
          AND "generation_state" = 'pending' AND "generation_provenance" = 'phase_1b_queue'
          AND "status" = 'active'
          AND NOT EXISTS (
            SELECT 1 FROM "scanner_action_plan_action" action WHERE action."plan_id" = "scanner_action_plan"."id"
          )
          AND ${activePlanLeaseExists(input.activeLease)}`,
    ).bind(
      input.generationRunId, input.title ?? null, input.summary ?? null, timestamp(),
      existingSourcePlan.id, input.userId, input.responseId, existingSourcePlan.generation_run_id,
      ...activePlanLeaseBindings(input.activeLease),
    ).run();
    if ((reclaimed.meta.changes ?? 0) === 1) {
      return (await getScannerActionPlanForUser(db, existingSourcePlan.id, input.userId))!;
    }

    const currentPlan = await getScannerActionPlanForUser(db, existingSourcePlan.id, input.userId);
    if (currentPlan?.generation_run_id === input.generationRunId) return currentPlan;
    throw new Error('Scanner response already has a plan from a different generation run.');
  }

  const response = await getUnexpiredOwnedScannerResponse(db, input.responseId, input.userId);
  if (!response) throw new Error('Scanner response is expired, missing, or not owned by user.');

  const createdAt = timestamp();
  const plan: ScannerActionPlanRow = {
    id: id(),
    user_id: input.userId,
    survey_id: response.survey_id,
    source_response_id: response.id,
    source_response_purged_at: null,
    generation_run_id: input.generationRunId,
    generation_state: 'pending',
    generation_provenance: 'phase_1b_queue',
    status: 'active',
    title: input.title ?? null,
    summary: input.summary ?? null,
    created_at: createdAt,
    updated_at: createdAt,
  };
  const baseline = createBaselineSnapshot(plan, response);

  try {
    const results = await db.batch([
      db.prepare(
        `INSERT INTO "scanner_action_plan"
         ("id","user_id","survey_id","source_response_id","source_response_purged_at","generation_run_id","generation_state","generation_provenance","status","title","summary","created_at","updated_at")
         SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?
         WHERE ${activePlanLeaseExists(input.activeLease)}`,
      ).bind(
        plan.id, plan.user_id, plan.survey_id, plan.source_response_id, plan.source_response_purged_at,
        plan.generation_run_id, plan.generation_state, plan.generation_provenance, plan.status,
        plan.title, plan.summary, plan.created_at, plan.updated_at,
        ...activePlanLeaseBindings(input.activeLease),
      ),
      db.prepare(
        `INSERT INTO "scanner_action_plan_score_snapshot"
         ("id","plan_id","response_id","snapshot_kind","score_total","scores_json","response_created_at","created_at")
         VALUES (?,?,?,?,?,?,?,?)`,
      ).bind(
        baseline.id, baseline.plan_id, baseline.response_id, baseline.snapshot_kind,
        baseline.score_total, baseline.scores_json, baseline.response_created_at, baseline.created_at,
      ),
    ]);
    if ((results[0]?.meta.changes ?? 0) !== 1) {
      throw new Error('Scanner AI job lease is no longer active for this plan generation.');
    }
    return plan;
  } catch (error) {
    const racedPlan = await db.prepare(
      'SELECT * FROM "scanner_action_plan" WHERE "generation_run_id" = ?',
    ).bind(input.generationRunId).first<ScannerActionPlanRow>();
    if (racedPlan && racedPlan.user_id === input.userId && racedPlan.source_response_id === input.responseId) {
      return racedPlan;
    }

    // A concurrent failed-run recovery can win the source-response uniqueness
    // race. Re-enter through the conditional reclaim path rather than creating
    // a second plan or leaving a newer run unable to recover it.
    const racedSourcePlan = await db.prepare(
      'SELECT * FROM "scanner_action_plan" WHERE "source_response_id" = ?',
    ).bind(input.responseId).first<ScannerActionPlanRow>();
    if (racedSourcePlan?.user_id === input.userId) {
      return createOrGetScannerActionPlan(db, input);
    }
    throw error;
  }
}

/** @deprecated Phase 1A compatibility wrapper. Use createOrGetScannerActionPlan with scanner_ai_job.runId. */
export async function createScannerActionPlan(
  db: D1Database,
  input: Omit<CreateOrGetScannerActionPlanInput, 'generationRunId'>,
): Promise<ScannerActionPlanRow> {
  return createOrGetScannerActionPlan(db, {
    ...input,
    generationRunId: `manual:${input.responseId}:${id()}`,
  });
}

function normalizeAction(input: ScannerActionPlanActionInput, planId: string, createdAt: string): ScannerActionPlanActionRow {
  if (!Number.isInteger(input.position) || input.position < 0) {
    throw new Error('Action position must be a non-negative integer.');
  }
  if (!input.title.trim()) throw new Error('Action title is required.');
  if (input.priority != null && !isActionPriority(input.priority)) {
    throw new Error('Action priority is invalid.');
  }
  if (input.targetDays != null && (!Number.isInteger(input.targetDays) || input.targetDays < 0)) {
    throw new Error('Action target days must be a non-negative integer.');
  }
  return {
    id: id(),
    plan_id: planId,
    position: input.position,
    title: input.title.trim(),
    description: input.description ?? null,
    category: input.category ?? null,
    priority: input.priority ?? 'medium',
    target_days: input.targetDays ?? null,
    status: 'not_started',
    completed_at: null,
    created_at: createdAt,
    updated_at: createdAt,
  };
}

export async function getScannerActionPlanActions(
  db: D1Database,
  planId: string,
): Promise<ScannerActionPlanActionRow[]> {
  const { results = [] } = await db.prepare(
    'SELECT * FROM "scanner_action_plan_action" WHERE "plan_id" = ? ORDER BY "position" ASC',
  ).bind(planId).all<ScannerActionPlanActionRow>();
  return results;
}

/**
 * Persists one generated action set in a single D1 batch. The plan becomes
 * ready only alongside every normalized action, and retries for the same run
 * return its committed action set rather than appending duplicates.
 */
export async function persistScannerActionPlanActionSet(
  db: D1Database,
  input: PersistScannerActionPlanActionSetInput,
): Promise<ScannerActionPlanActionRow[]> {
  const plan = await getScannerActionPlanForUser(db, input.planId, input.userId);
  if (!plan) throw new Error('Scanner action plan not found.');
  if (plan.status === 'archived') throw new Error('Archived Scanner action plans cannot be modified.');
  if (plan.generation_run_id !== input.generationRunId) {
    throw new Error('Plan generation run does not match this action plan.');
  }
  if (plan.generation_state === 'ready') return getScannerActionPlanActions(db, plan.id);

  if (input.actions.length === 0) throw new Error('Generated action plans require at least one action.');

  const createdAt = timestamp();
  const actions = input.actions.map((action) => normalizeAction(action, plan.id, createdAt));
  if (new Set(actions.map((action) => action.position)).size !== actions.length) {
    throw new Error('Action positions must be unique within a plan.');
  }

  try {
    const results = await db.batch([
      // Each insert is contingent on the still-active pending claim. The final
      // readiness transition and all inserts commit or roll back together.
      ...actions.map((action) => db.prepare(
        `INSERT INTO "scanner_action_plan_action"
         ("id","plan_id","position","title","description","category","priority","target_days","status","completed_at","created_at","updated_at")
         SELECT ?,?,?,?,?,?,?,?,?,?,?,?
         WHERE EXISTS (
           SELECT 1 FROM "scanner_action_plan"
            WHERE "id" = ? AND "user_id" = ? AND "generation_run_id" = ?
              AND "generation_state" = 'pending' AND "status" = 'active'
          ) AND ${activePlanLeaseExists(input.activeLease)}`,
       ).bind(
         action.id, action.plan_id, action.position, action.title, action.description,
         action.category, action.priority, action.target_days, action.status, action.completed_at,
         action.created_at, action.updated_at,
         plan.id, input.userId, input.generationRunId,
         ...activePlanLeaseBindings(input.activeLease),
       )),
      db.prepare(
        `UPDATE "scanner_action_plan"
         SET "title" = COALESCE(?, "title"), "summary" = COALESCE(?, "summary"),
             "generation_state" = 'ready', "updated_at" = ?
          WHERE "id" = ? AND "user_id" = ? AND "generation_run_id" = ?
            AND "generation_state" = 'pending' AND "status" = 'active'
            AND ${activePlanLeaseExists(input.activeLease)}`,
       ).bind(
         input.title ?? null, input.summary ?? null, createdAt, plan.id, input.userId, input.generationRunId,
         ...activePlanLeaseBindings(input.activeLease),
       ),
    ]);
    if ((results[results.length - 1]?.meta.changes ?? 0) !== 1) {
      throw new Error('Scanner action plan is no longer active and pending for this generation run.');
    }
    return actions;
  } catch (error) {
    const completedPlan = await getScannerActionPlanForUser(db, plan.id, input.userId);
    if (completedPlan?.generation_state === 'ready' && completedPlan.generation_run_id === input.generationRunId) {
      return getScannerActionPlanActions(db, completedPlan.id);
    }
    throw error;
  }
}

export async function createScannerActionPlanAction(
  db: D1Database,
  input: ScannerActionPlanActionInput & { planId: string; userId: string },
): Promise<ScannerActionPlanActionRow> {
  const plan = await getScannerActionPlanForUser(db, input.planId, input.userId);
  if (!plan) throw new Error('Scanner action plan not found.');
  if (plan.status === 'archived') throw new Error('Archived Scanner action plans cannot be modified.');

  const createdAt = timestamp();
  const action = normalizeAction(input, plan.id, createdAt);
  const results = await db.batch([
    db.prepare(
      `INSERT INTO "scanner_action_plan_action"
       ("id","plan_id","position","title","description","category","priority","target_days","status","completed_at","created_at","updated_at")
       SELECT ?,?,?,?,?,?,?,?,?,?,?,?
       WHERE EXISTS (
         SELECT 1 FROM "scanner_action_plan"
         WHERE "id" = ? AND "user_id" = ? AND "status" = 'active'
       )`,
    ).bind(
      action.id, action.plan_id, action.position, action.title, action.description,
      action.category, action.priority, action.target_days, action.status, action.completed_at,
      action.created_at, action.updated_at, plan.id, input.userId,
    ),
    db.prepare('UPDATE "scanner_action_plan" SET "updated_at" = ? WHERE "id" = ? AND "user_id" = ? AND "status" = \'active\'')
      .bind(createdAt, plan.id, input.userId),
  ]);
  if ((results[0]?.meta.changes ?? 0) !== 1) {
    throw new Error('Scanner action plan is no longer active.');
  }
  return action;
}

export async function recordScannerActionPlanActionProgress(
  db: D1Database,
  input: {
    actionId: string;
    userId: string;
    status: ScannerActionStatus;
    note?: string | null;
  },
): Promise<ScannerActionPlanActionProgressRow> {
  if (!isActionStatus(input.status)) throw new Error('Action status is invalid.');

  const action = await db.prepare(
    `SELECT action.*, plan."id" AS "plan_id"
     FROM "scanner_action_plan_action" action
     INNER JOIN "scanner_action_plan" plan ON plan."id" = action."plan_id"
     WHERE action."id" = ? AND plan."user_id" = ? AND plan."status" = 'active'`,
  ).bind(input.actionId, input.userId).first<ScannerActionPlanActionRow>();
  if (!action) throw new Error('Scanner action not found or its plan is archived.');

  const createdAt = timestamp();
  const progress: ScannerActionPlanActionProgressRow = {
    id: id(),
    action_id: action.id,
    user_id: input.userId,
    status: input.status,
    note: input.note ?? null,
    created_at: createdAt,
  };
  const completedAt = input.status === 'completed' ? createdAt : null;

  const results = await db.batch([
    // Update the action only while its parent remains active. Later statements
    // use the same active-parent predicate, preventing archived-plan TOCTOU writes.
    db.prepare(
      `UPDATE "scanner_action_plan_action"
       SET "status" = ?, "completed_at" = ?, "updated_at" = ?
       WHERE "id" = ?
         AND EXISTS (
           SELECT 1 FROM "scanner_action_plan"
           WHERE "id" = "scanner_action_plan_action"."plan_id"
             AND "user_id" = ? AND "status" = 'active'
         )`,
    ).bind(progress.status, completedAt, createdAt, action.id, input.userId),
    db.prepare(
      `INSERT INTO "scanner_action_plan_action_progress"
       ("id","action_id","user_id","status","note","created_at")
       SELECT ?,?,?,?,?,?
       WHERE EXISTS (
         SELECT 1 FROM "scanner_action_plan_action" action
         INNER JOIN "scanner_action_plan" plan ON plan."id" = action."plan_id"
         WHERE action."id" = ? AND plan."user_id" = ? AND plan."status" = 'active'
       )`,
    ).bind(
      progress.id, progress.action_id, progress.user_id, progress.status,
      progress.note, progress.created_at, action.id, input.userId,
    ),
    db.prepare('UPDATE "scanner_action_plan" SET "updated_at" = ? WHERE "id" = ? AND "user_id" = ? AND "status" = \'active\'')
      .bind(createdAt, action.plan_id, input.userId),
  ]);
  if ((results[0]?.meta.changes ?? 0) !== 1) {
    throw new Error('Scanner action not found or its plan is archived.');
  }

  return progress;
}

export async function addScannerActionPlanRescanSnapshot(
  db: D1Database,
  input: { planId: string; userId: string; responseId: number },
): Promise<ScannerActionPlanScoreSnapshotRow> {
  const plan = await getScannerActionPlanForUser(db, input.planId, input.userId);
  if (!plan) throw new Error('Scanner action plan not found.');

  if (plan.status === 'archived') throw new Error('Archived Scanner action plans cannot be modified.');

  const response = await getUnexpiredOwnedScannerResponse(db, input.responseId, input.userId);
  if (!response || response.survey_id !== plan.survey_id) {
    throw new Error('Scanner response is expired, missing, or does not match this action plan.');
  }

  const scores = parseScores(response.scores_json);
  const snapshot: ScannerActionPlanScoreSnapshotRow = {
    id: id(),
    plan_id: plan.id,
    response_id: response.id,
    snapshot_kind: 'rescan',
    score_total: scores.total ?? null,
    scores_json: JSON.stringify(scores),
    response_created_at: response.created_at,
    created_at: timestamp(),
  };

  const results = await db.batch([
    db.prepare(
      `INSERT INTO "scanner_action_plan_score_snapshot"
       ("id","plan_id","response_id","snapshot_kind","score_total","scores_json","response_created_at","created_at")
       SELECT ?,?,?,?,?,?,?,?
       WHERE EXISTS (
         SELECT 1 FROM "scanner_action_plan"
         WHERE "id" = ? AND "user_id" = ? AND "status" = 'active'
       )`,
    ).bind(
      snapshot.id, snapshot.plan_id, snapshot.response_id, snapshot.snapshot_kind,
      snapshot.score_total, snapshot.scores_json, snapshot.response_created_at, snapshot.created_at,
      plan.id, input.userId,
    ),
    db.prepare('UPDATE "scanner_action_plan" SET "updated_at" = ? WHERE "id" = ? AND "user_id" = ? AND "status" = \'active\'')
      .bind(snapshot.created_at, plan.id, input.userId),
  ]);
  if ((results[0]?.meta.changes ?? 0) !== 1) {
    throw new Error('Scanner action plan is no longer active.');
  }

  return snapshot;
}

export async function getScannerActionPlanForGenerationRun(
  db: D1Database,
  generationRunId: string,
  userId: string,
): Promise<ScannerActionPlanRow | null> {
  return await db.prepare(
    'SELECT * FROM "scanner_action_plan" WHERE "generation_run_id" = ? AND "user_id" = ?',
  ).bind(generationRunId, userId).first<ScannerActionPlanRow>() ?? null;
}

export async function getScannerActionPlanForUser(
  db: D1Database,
  planId: string,
  userId: string,
): Promise<ScannerActionPlanRow | null> {
  return await db.prepare(
    'SELECT * FROM "scanner_action_plan" WHERE "id" = ? AND "user_id" = ?',
  ).bind(planId, userId).first<ScannerActionPlanRow>() ?? null;
}

export async function isScannerActionPlanOwnedByUser(
  db: D1Database,
  planId: string,
  userId: string,
): Promise<boolean> {
  return Boolean(await getScannerActionPlanForUser(db, planId, userId));
}
