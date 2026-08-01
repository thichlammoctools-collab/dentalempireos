-- Server-side AI quota counters and scanner job claims.
CREATE TABLE IF NOT EXISTS "ai_quota_counter" (
  "subject_key" TEXT NOT NULL,
  "feature" TEXT NOT NULL,
  "window_start" TEXT NOT NULL,
  "request_count" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("subject_key", "feature", "window_start")
);

CREATE TABLE IF NOT EXISTS "scanner_ai_job" (
  "response_id" INTEGER NOT NULL,
  "job_type" TEXT NOT NULL CHECK ("job_type" IN ('analysis', 'plan')),
  "run_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'running',
  "claimed_at" TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("response_id", "job_type")
);

CREATE INDEX IF NOT EXISTS "idx_ai_quota_updated" ON "ai_quota_counter"("updated_at");
CREATE INDEX IF NOT EXISTS "idx_scanner_ai_job_status" ON "scanner_ai_job"("status", "claimed_at");

ALTER TABLE "ai_usage_log" ADD COLUMN "request_id" TEXT;
ALTER TABLE "ai_usage_log" ADD COLUMN "attempt_count" INTEGER;
