// Data access layer for normalized Scanner action plans.
// Phase 1A deliberately exposes storage contracts only; generation and routes arrive later.

import { parseScores } from './scanner-response-db';

export type ScannerActionPlanStatus = 'active' | 'archived';
export type ScannerActionPriority = 'low' | 'medium' | 'high';
export type ScannerActionStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type ScannerActionPlanSnapshotKind = 'baseline' | 'rescan';

export interface ScannerActionPlanRow {
  id: string;
  user_id: string;
  survey_id: string;
  source_response_id: number;
  status: ScannerActionPlanStatus;
  title: string | null;
  summary: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScannerActionPlanScoreSnapshotRow {
  id: string;
  plan_id: string;
  response_id: number;
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
  scores_json: string | null;
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

export async function createScannerActionPlan(
  db: D1Database,
  input: {
    userId: string;
    responseId: number;
    title?: string | null;
    summary?: string | null;
  },
): Promise<ScannerActionPlanRow> {
  const response = await db.prepare(
    `SELECT response."id", response."survey_id", response."created_at", response."scores_json"
     FROM "scanner_response" response
     INNER JOIN "scanner_history" history ON history."response_id" = response."id"
     WHERE response."id" = ? AND history."user_id" = ?`,
  ).bind(input.responseId, input.userId).first<ScannerResponseScoreRow>();
  if (!response) throw new Error('Scanner response not found or not owned by user.');

  const plan: ScannerActionPlanRow = {
    id: id(),
    user_id: input.userId,
    survey_id: response.survey_id,
    source_response_id: response.id,
    status: 'active',
    title: input.title ?? null,
    summary: input.summary ?? null,
    created_at: timestamp(),
    updated_at: timestamp(),
  };
  const scores = parseScores(response.scores_json);
  const baseline: ScannerActionPlanScoreSnapshotRow = {
    id: id(),
    plan_id: plan.id,
    response_id: response.id,
    snapshot_kind: 'baseline',
    score_total: scores.total ?? null,
    scores_json: JSON.stringify(scores),
    response_created_at: response.created_at,
    created_at: plan.created_at,
  };

  await db.batch([
    db.prepare(
      `INSERT INTO "scanner_action_plan"
       ("id","user_id","survey_id","source_response_id","status","title","summary","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?)`,
    ).bind(
      plan.id, plan.user_id, plan.survey_id, plan.source_response_id, plan.status,
      plan.title, plan.summary, plan.created_at, plan.updated_at,
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

  return plan;
}

export async function createScannerActionPlanAction(
  db: D1Database,
  input: {
    planId: string;
    userId: string;
    position: number;
    title: string;
    description?: string | null;
    category?: string | null;
    priority?: ScannerActionPriority;
    targetDays?: number | null;
  },
): Promise<ScannerActionPlanActionRow> {
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

  const plan = await getScannerActionPlanForUser(db, input.planId, input.userId);
  if (!plan) throw new Error('Scanner action plan not found.');

  const createdAt = timestamp();
  const action: ScannerActionPlanActionRow = {
    id: id(),
    plan_id: plan.id,
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

  await db.batch([
    db.prepare(
      `INSERT INTO "scanner_action_plan_action"
       ("id","plan_id","position","title","description","category","priority","target_days","status","completed_at","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(
      action.id, action.plan_id, action.position, action.title, action.description,
      action.category, action.priority, action.target_days, action.status, action.completed_at,
      action.created_at, action.updated_at,
    ),
    db.prepare('UPDATE "scanner_action_plan" SET "updated_at" = ? WHERE "id" = ?')
      .bind(createdAt, plan.id),
  ]);

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
     WHERE action."id" = ? AND plan."user_id" = ?`,
  ).bind(input.actionId, input.userId).first<ScannerActionPlanActionRow>();
  if (!action) throw new Error('Scanner action not found.');

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

  await db.batch([
    db.prepare(
      `INSERT INTO "scanner_action_plan_action_progress"
       ("id","action_id","user_id","status","note","created_at") VALUES (?,?,?,?,?,?)`,
    ).bind(
      progress.id, progress.action_id, progress.user_id, progress.status,
      progress.note, progress.created_at,
    ),
    db.prepare(
      `UPDATE "scanner_action_plan_action"
       SET "status" = ?, "completed_at" = ?, "updated_at" = ? WHERE "id" = ?`,
    ).bind(progress.status, completedAt, createdAt, action.id),
    db.prepare('UPDATE "scanner_action_plan" SET "updated_at" = ? WHERE "id" = ?')
      .bind(createdAt, action.plan_id),
  ]);

  return progress;
}

export async function addScannerActionPlanRescanSnapshot(
  db: D1Database,
  input: { planId: string; userId: string; responseId: number },
): Promise<ScannerActionPlanScoreSnapshotRow> {
  const plan = await getScannerActionPlanForUser(db, input.planId, input.userId);
  if (!plan) throw new Error('Scanner action plan not found.');

  const response = await db.prepare(
    `SELECT response."id", response."survey_id", response."created_at", response."scores_json"
     FROM "scanner_response" response
     INNER JOIN "scanner_history" history ON history."response_id" = response."id"
     WHERE response."id" = ? AND history."user_id" = ?`,
  ).bind(input.responseId, input.userId).first<ScannerResponseScoreRow>();
  if (!response || response.survey_id !== plan.survey_id) {
    throw new Error('Scanner response does not match this action plan.');
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

  await db.batch([
    db.prepare(
      `INSERT INTO "scanner_action_plan_score_snapshot"
       ("id","plan_id","response_id","snapshot_kind","score_total","scores_json","response_created_at","created_at")
       VALUES (?,?,?,?,?,?,?,?)`,
    ).bind(
      snapshot.id, snapshot.plan_id, snapshot.response_id, snapshot.snapshot_kind,
      snapshot.score_total, snapshot.scores_json, snapshot.response_created_at, snapshot.created_at,
    ),
    db.prepare('UPDATE "scanner_action_plan" SET "updated_at" = ? WHERE "id" = ?')
      .bind(snapshot.created_at, plan.id),
  ]);

  return snapshot;
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
