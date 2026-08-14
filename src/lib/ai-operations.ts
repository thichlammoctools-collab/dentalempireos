export type AiQuotaFeature = 'website_chat' | 'mentor_chat' | 'scanner_analysis' | 'scanner_plan';

/**
 * The provider client times out individual calls at 60 seconds, but fallback
 * providers and transport cleanup may take longer. Keep the lease comfortably
 * above that bounded work so normal queue redelivery cannot overlap a live call.
 */
export const SCANNER_AI_JOB_LEASE_SECONDS = 15 * 60;

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
  // A duplicate delivery may only claim a queued job. A running lease is held
  // exclusively until the scheduled reaper explicitly requeues this same run.
  const result = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "status" = 'running', "started_at" = datetime('now'), "claimed_at" = datetime('now'),
         "attempt_count" = "attempt_count" + 1, "error_message" = NULL
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'queued'`,
  ).bind(responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) > 0;
}

export async function requeueScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
  runId: string,
): Promise<boolean> {
  const result = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "status" = 'queued', "queued_at" = datetime('now'), "started_at" = NULL,
         "claimed_at" = datetime('now')
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" IN ('queued', 'running')`,
  ).bind(responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) > 0;
}

export interface ReclaimedScannerAiJob {
  responseId: number;
  jobType: 'analysis' | 'plan';
  runId: string;
}

/**
 * Requeues only expired leases without replacing their run ID. Keeping the
 * original run ID makes late deliveries harmless and preserves committed-plan
 * recovery without ever starting duplicate active provider work.
 */
export async function reclaimStaleScannerAiJobs(
  db: D1Database,
  leaseSeconds = SCANNER_AI_JOB_LEASE_SECONDS,
  limit = 25,
): Promise<ReclaimedScannerAiJob[]> {
  const { results = [] } = await db.prepare(
    `SELECT "response_id", "job_type", "run_id"
     FROM "scanner_ai_job"
     WHERE "status" = 'running'
       AND COALESCE("started_at", "claimed_at") < datetime('now', ?)
     ORDER BY COALESCE("started_at", "claimed_at") ASC
     LIMIT ?`,
  ).bind(`-${leaseSeconds} seconds`, limit).all<{
    response_id: number;
    job_type: 'analysis' | 'plan';
    run_id: string;
  }>();

  const reclaimed: ReclaimedScannerAiJob[] = [];
  for (const job of results) {
    // Conditional compare-and-set prevents the reaper from stealing a lease
    // renewed or completed after its candidate query.
    const result = await db.prepare(
      `UPDATE "scanner_ai_job"
       SET "status" = 'queued', "queued_at" = datetime('now'), "started_at" = NULL,
           "claimed_at" = datetime('now'), "error_message" = 'Recovered stale queue lease'
       WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'running'
         AND COALESCE("started_at", "claimed_at") < datetime('now', ?)`,
    ).bind(job.response_id, job.job_type, job.run_id, `-${leaseSeconds} seconds`).run();
    if ((result.meta.changes ?? 0) === 1) {
      reclaimed.push({ responseId: job.response_id, jobType: job.job_type, runId: job.run_id });
    }
  }
  return reclaimed;
}

export async function finishScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: 'analysis' | 'plan',
  runId: string,
  status: 'done' | 'failed',
  errorMessage?: string,
): Promise<boolean> {
  const result = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "status" = ?, "completed_at" = datetime('now'), "error_message" = ?
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" IN ('queued', 'running')`,
  ).bind(status, errorMessage?.slice(0, 500) ?? null, responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) > 0;
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


export function requestId(): string {
  return crypto.randomUUID();
}
