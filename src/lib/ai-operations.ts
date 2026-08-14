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

export type ScannerAiJobType = 'analysis' | 'plan';

type ScannerAiResponseStatus = 'queued' | 'running' | 'done' | 'failed';

function responseStatusColumn(jobType: ScannerAiJobType): 'ai_analysis_status' | 'ai_plan_status' {
  return jobType === 'analysis' ? 'ai_analysis_status' : 'ai_plan_status';
}

function responseArtifactColumn(jobType: ScannerAiJobType): 'ai_analysis' | 'ai_plan' {
  return jobType === 'analysis' ? 'ai_analysis' : 'ai_plan';
}

function activeJobLeaseClause(status = 'running'): string {
  return `EXISTS (
    SELECT 1 FROM "scanner_ai_job" job
    WHERE job."response_id" = "scanner_response"."id"
      AND job."job_type" = ? AND job."run_id" = ? AND job."status" = '${status}'
  )`;
}

/** Creates a durable dispatch-pending job. Queue.send is deliberately outside this transaction. */
export async function enqueueScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
): Promise<{ queued: boolean; runId: string }> {
  const runId = crypto.randomUUID();
  const inserted = await db.prepare(
    `INSERT OR IGNORE INTO "scanner_ai_job"
       ("response_id","job_type","run_id","status","queued_at","attempt_count","error_message","dispatch_pending_at","dispatch_last_attempt_at","dispatch_attempt_count")
     VALUES (?,?,?,'queued',datetime('now'),0,NULL,datetime('now'),NULL,0)`,
  ).bind(responseId, jobType, runId).run();
  const queued = (inserted.meta.changes ?? 0) > 0
    ? true
    : (await db.prepare(
      `UPDATE "scanner_ai_job"
       SET "run_id" = ?, "status" = 'queued', "queued_at" = datetime('now'), "started_at" = NULL,
           "completed_at" = NULL, "attempt_count" = 0, "error_message" = NULL,
           "dispatch_pending_at" = datetime('now'), "dispatch_last_attempt_at" = NULL, "dispatch_attempt_count" = 0
       WHERE "response_id" = ? AND "job_type" = ? AND "status" IN ('done', 'failed')`,
    ).bind(runId, responseId, jobType).run()).meta.changes! > 0;

  if (queued) {
    await setScannerAiResponseStatusForJobState(db, responseId, jobType, runId, 'queued', 'queued');
  }
  return { queued, runId };
}

/** Atomically claims a Queue producer attempt for a dispatch-pending job. */
export async function claimScannerAiJobDispatch(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
  retryAfterSeconds = 0,
): Promise<boolean> {
  const ageClause = retryAfterSeconds > 0
    ? `AND ("dispatch_last_attempt_at" IS NULL OR "dispatch_last_attempt_at" < datetime('now', '-${retryAfterSeconds} seconds'))`
    : '';
  const result = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "dispatch_last_attempt_at" = datetime('now'), "dispatch_attempt_count" = "dispatch_attempt_count" + 1
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'queued'
       AND "dispatch_pending_at" IS NOT NULL ${ageClause}`,
  ).bind(responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) === 1;
}

/** Marks a successfully published message as Queue-owned; failed sends remain pending. */
export async function confirmScannerAiJobDispatched(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
): Promise<boolean> {
  const result = await db.prepare(
    `UPDATE "scanner_ai_job"
     SET "dispatch_pending_at" = NULL
     WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'queued'
       AND "dispatch_pending_at" IS NOT NULL`,
  ).bind(responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) === 1;
}

export async function getScannerAiJobsPendingDispatch(
  db: D1Database,
  retryAfterSeconds = 60,
  limit = 25,
): Promise<ScannerAiQueueJob[]> {
  const { results = [] } = await db.prepare(
    `SELECT "response_id", "job_type", "run_id"
     FROM "scanner_ai_job"
     WHERE "status" = 'queued' AND "dispatch_pending_at" IS NOT NULL
       AND ("dispatch_last_attempt_at" IS NULL OR "dispatch_last_attempt_at" < datetime('now', ?))
     ORDER BY "dispatch_pending_at" ASC
     LIMIT ?`,
  ).bind(`-${retryAfterSeconds} seconds`, limit).all<{
    response_id: number;
    job_type: ScannerAiJobType;
    run_id: string;
  }>();
  return results.map((job) => ({ responseId: job.response_id, jobType: job.job_type, runId: job.run_id }));
}

export async function startQueuedScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
): Promise<boolean> {
  const column = responseStatusColumn(jobType);
  const results = await db.batch([
    db.prepare(
      `UPDATE "scanner_ai_job"
       SET "status" = 'running', "started_at" = datetime('now'), "claimed_at" = datetime('now'),
           "attempt_count" = "attempt_count" + 1, "error_message" = NULL
       WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'queued'`,
    ).bind(responseId, jobType, runId),
    db.prepare(
      `UPDATE "scanner_response" SET "${column}" = 'running'
       WHERE "id" = ? AND ${activeJobLeaseClause()}`,
    ).bind(responseId, jobType, runId),
  ]);
  return (results[0]?.meta.changes ?? 0) === 1 && (results[1]?.meta.changes ?? 0) === 1;
}

/** Returns a live same-run lease to Queue retry without creating a producer redispatch. */
export async function requeueScannerAiJob(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
): Promise<boolean> {
  const column = responseStatusColumn(jobType);
  const results = await db.batch([
    db.prepare(
      `UPDATE "scanner_ai_job"
       SET "status" = 'queued', "queued_at" = datetime('now'), "started_at" = NULL,
           "claimed_at" = datetime('now'), "dispatch_pending_at" = NULL
       WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'running'`,
    ).bind(responseId, jobType, runId),
    db.prepare(
      `UPDATE "scanner_response" SET "${column}" = 'queued'
       WHERE "id" = ? AND ${activeJobLeaseClause('queued')}`,
    ).bind(responseId, jobType, runId),
  ]);
  return (results[0]?.meta.changes ?? 0) === 1 && (results[1]?.meta.changes ?? 0) === 1;
}

export interface ScannerAiQueueJob {
  responseId: number;
  jobType: ScannerAiJobType;
  runId: string;
}

/**
 * Fences an expired worker by assigning a fresh run ID before the replacement
 * job becomes queued. Old completions can no longer match the active lease.
 */
export async function reclaimStaleScannerAiJobs(
  db: D1Database,
  leaseSeconds = SCANNER_AI_JOB_LEASE_SECONDS,
  limit = 25,
): Promise<ScannerAiQueueJob[]> {
  const { results = [] } = await db.prepare(
    `SELECT "response_id", "job_type", "run_id"
     FROM "scanner_ai_job"
     WHERE "status" = 'running'
       AND COALESCE("started_at", "claimed_at") < datetime('now', ?)
     ORDER BY COALESCE("started_at", "claimed_at") ASC
     LIMIT ?`,
  ).bind(`-${leaseSeconds} seconds`, limit).all<{
    response_id: number;
    job_type: ScannerAiJobType;
    run_id: string;
  }>();

  const reclaimed: ScannerAiQueueJob[] = [];
  for (const job of results) {
    const replacementRunId = crypto.randomUUID();
    const column = responseStatusColumn(job.job_type);
    const batch = await db.batch([
      db.prepare(
        `UPDATE "scanner_ai_job"
         SET "run_id" = ?, "status" = 'queued', "queued_at" = datetime('now'), "started_at" = NULL,
             "claimed_at" = datetime('now'), "completed_at" = NULL, "error_message" = 'Recovered stale queue lease',
             "dispatch_pending_at" = datetime('now'), "dispatch_last_attempt_at" = NULL, "dispatch_attempt_count" = 0
         WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'running'
           AND COALESCE("started_at", "claimed_at") < datetime('now', ?)`,
      ).bind(replacementRunId, job.response_id, job.job_type, job.run_id, `-${leaseSeconds} seconds`),
      db.prepare(
        `UPDATE "scanner_response" SET "${column}" = 'queued'
         WHERE "id" = ? AND ${activeJobLeaseClause('queued')}`,
      ).bind(job.response_id, job.job_type, replacementRunId),
    ]);
    if ((batch[0]?.meta.changes ?? 0) === 1 && (batch[1]?.meta.changes ?? 0) === 1) {
      reclaimed.push({ responseId: job.response_id, jobType: job.job_type, runId: replacementRunId });
    }
  }
  return reclaimed;
}

export async function setScannerAiResponseStatusForJobState(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
  status: ScannerAiResponseStatus,
  jobStatus: 'queued' | 'running',
): Promise<boolean> {
  const column = responseStatusColumn(jobType);
  const result = await db.prepare(
    `UPDATE "scanner_response" SET "${column}" = ?
     WHERE "id" = ? AND ${activeJobLeaseClause(jobStatus)}`,
  ).bind(status, responseId, jobType, runId).run();
  return (result.meta.changes ?? 0) === 1;
}

/** Commits the compatibility artifact, UI status, and terminal job state under one active lease. */
export async function completeScannerAiJobWithArtifact(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
  artifact: string,
): Promise<boolean> {
  const statusColumn = responseStatusColumn(jobType);
  const artifactColumn = responseArtifactColumn(jobType);
  const timestampUpdate = jobType === 'analysis' ? ', "ai_analyzed_at" = datetime(\'now\')' : '';
  const results = await db.batch([
    db.prepare(
      `UPDATE "scanner_response"
       SET "${artifactColumn}" = ?, "${statusColumn}" = 'done'${timestampUpdate}
       WHERE "id" = ? AND ${activeJobLeaseClause()}`,
    ).bind(artifact, responseId, jobType, runId),
    db.prepare(
      `UPDATE "scanner_ai_job"
       SET "status" = 'done', "completed_at" = datetime('now'), "error_message" = NULL
       WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'running'`,
    ).bind(responseId, jobType, runId),
  ]);
  return (results[0]?.meta.changes ?? 0) === 1 && (results[1]?.meta.changes ?? 0) === 1;
}

/** Terminal failures are visible only when the failing worker still owns the running lease. */
export async function failScannerAiJobWithResponseStatus(
  db: D1Database,
  responseId: number,
  jobType: ScannerAiJobType,
  runId: string,
  errorMessage: string,
): Promise<boolean> {
  const column = responseStatusColumn(jobType);
  const results = await db.batch([
    db.prepare(
      `UPDATE "scanner_response" SET "${column}" = 'failed'
       WHERE "id" = ? AND ${activeJobLeaseClause()}`,
    ).bind(responseId, jobType, runId),
    db.prepare(
      `UPDATE "scanner_ai_job"
       SET "status" = 'failed', "completed_at" = datetime('now'), "error_message" = ?
       WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ? AND "status" = 'running'`,
    ).bind(errorMessage.slice(0, 500), responseId, jobType, runId),
  ]);
  return (results[0]?.meta.changes ?? 0) === 1 && (results[1]?.meta.changes ?? 0) === 1;
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
