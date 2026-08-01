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

export async function finishScannerAiJob(db: D1Database, responseId: number, jobType: 'analysis' | 'plan', runId: string, status: 'done' | 'failed'): Promise<void> {
  await db.prepare(
    `UPDATE "scanner_ai_job" SET "status" = ? WHERE "response_id" = ? AND "job_type" = ? AND "run_id" = ?`,
  ).bind(status, responseId, jobType, runId).run();
}

export function requestId(): string {
  return crypto.randomUUID();
}
