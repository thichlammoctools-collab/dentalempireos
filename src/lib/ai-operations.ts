export type AiQuotaFeature = 'website_chat' | 'mentor_chat' | 'scanner_analysis' | 'scanner_plan';

const DEFAULT_LIMITS: Record<AiQuotaFeature, number> = {
  website_chat: 30,
  mentor_chat: 60,
  scanner_analysis: 10,
  scanner_plan: 10,
};

function hourWindow(): string {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  return date.toISOString();
}

export async function reserveAiQuota(
  db: D1Database,
  subjectKey: string,
  feature: AiQuotaFeature,
  limit = DEFAULT_LIMITS[feature],
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const window = hourWindow();
  await db.prepare(
    `INSERT OR IGNORE INTO "ai_quota_counter" ("subject_key","feature","window_start") VALUES (?,?,?)`,
  ).bind(subjectKey, feature, window).run();
  const result = await db.prepare(
    `UPDATE "ai_quota_counter"
     SET "request_count" = "request_count" + 1, "updated_at" = datetime('now')
     WHERE "subject_key" = ? AND "feature" = ? AND "window_start" = ? AND "request_count" < ?`,
  ).bind(subjectKey, feature, window, limit).run();
  const row = await db.prepare(
    `SELECT "request_count" as used FROM "ai_quota_counter" WHERE "subject_key" = ? AND "feature" = ? AND "window_start" = ?`,
  ).bind(subjectKey, feature, window).first<{ used: number }>();
  return { allowed: (result.meta.changes ?? 0) > 0, used: row?.used ?? 0, limit };
}

export async function claimScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
): Promise<{ claimed: boolean; runId: string }> {
  const runId = crypto.randomUUID();
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO "scanner_ai_job" ("response_id","job_type","run_id") VALUES (?,?,?)`,
  ).bind(responseId, jobType, runId).run();
  if ((inserted.meta.changes ?? 0) > 0) return { claimed: true, runId };

  const updated = await db.prepare(
    `UPDATE "scanner_ai_job" SET "run_id" = ?, "status" = 'running', "claimed_at" = datetime('now')
     WHERE "response_id" = ? AND "job_type" = ? AND ("status" <> 'running' OR "claimed_at" < datetime('now', '-15 minutes'))`,
  ).bind(runId, responseId, jobType).run();
  return { claimed: (updated.meta.changes ?? 0) > 0, runId };
}

export async function enqueueScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
): Promise<{ queued: boolean; runId: string }> {
  const runId = crypto.randomUUID();
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO "scanner_ai_job" ("response_id","job_type","run_id","status","queued_at","attempt_count","error_message")
     VALUES (?,?,?,'queued',datetime('now'),0,NULL)`,
  ).bind(responseId, jobType, runId).run();
  if ((inserted.meta.changes ?? 0) > 0) return { queued: true, runId };

  const updated = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "run_id" = ?, "status" = 'queued', "queued_at" = datetime('now'), "started_at" = NULL,
         "completed_at" = NULL, "attempt_count" = 0, "error_message" = NULL
     WHERE "response_id" = ? AND "job_type" = ? AND "status" IN ('done', 'failed')`,
  ).bind(runId, responseId, jobType).run();
  return { queued: (updated.meta.changes ?? 0) > 0, runId };
}

export async function startQueuedScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
  runId: string,
): Promise<boolean> {
  const result = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "status" = 'running', "started_at" = COALESCE("started_at", datetime('now')),
         "attempt_count" = "attempt_count" + 1, "error_message" = NULL
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" IN ('queued', 'running')`,
  ).bind(responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function requeueScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
  runId: string,
): Promise<void> {
  await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "status" = 'queued', "queued_at" = datetime('now')
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ?`,
  ).bind(responseId, jobType, runId).run();
}

export async function finishScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
  runId: string,
  status: 'done' | 'failed',
  errorMessage?: string,
): Promise<void> {
  await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "status" = ?, "completed_at" = datetime('now'), "error_message" = ?
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ?`,
  ).bind(status, errorMessage?.slice(0, 500) ?? null, responseId, jobType, runId).run();
}

export async function isScannerAiJobRunning(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
): Promise<boolean> {
  const row = await db.prepare(
     `SELECT 1 as running FROM "scanner_ai_job"
     WHERE "response_id" = ? AND "job_type" = ? AND "status" IN ('queued', 'running')`,
  ).bind(responseId, jobType).first<{ running: number }>();
  return Boolean(row?.running);
}

export async function claimScannerReportImageJob(
  db: D1Database,
  responseId: number,
  imageType: 'analysis' | 'plan',
): Promise<{ claimed: boolean; runId: string }> {
  const runId = crypto.randomUUID();
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO "scanner_report_image_job" ("response_id","image_type","run_id") VALUES (?,?,?)`,
  ).bind(responseId, imageType, runId).run();
  if ((inserted.meta.changes ?? 0) > 0) return { claimed: true, runId };

  const updated = await db.prepare(
    `UPDATE "scanner_report_image_job"
     SET "run_id" = ?, "status" = 'running', "claimed_at" = datetime('now'), "updated_at" = datetime('now')
     WHERE "response_id" = ? AND "image_type" = ?
       AND ("status" <> 'running' OR "claimed_at" < datetime('now', '-15 minutes'))`,
  ).bind(runId, responseId, imageType).run();
  return { claimed: (updated.meta.changes ?? 0) > 0, runId };
}

export async function finishScannerReportImageJob(
  db: D1Database,
  responseId: number,
  imageType: 'analysis' | 'plan',
  runId: string,
  status: 'done' | 'failed',
): Promise<void> {
  await db.prepare(
    `UPDATE "scanner_report_image_job" SET "status" = ?, "updated_at" = datetime('now')
     WHERE "response_id" = ? AND "image_type" = ? AND "run_id" = ?`,
  ).bind(status, responseId, imageType, runId).run();
}

export function requestId(): string {
  return crypto.randomUUID();
}
