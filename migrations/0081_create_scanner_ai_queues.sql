-- Durable metadata for scanner AI jobs. Cloudflare Queues delivers the work;
-- D1 remains the source of truth for the UI and idempotency.
ALTER TABLE "scanner_ai_job" ADD COLUMN "queued_at" TEXT;
ALTER TABLE "scanner_ai_job" ADD COLUMN "started_at" TEXT;
ALTER TABLE "scanner_ai_job" ADD COLUMN "completed_at" TEXT;
ALTER TABLE "scanner_ai_job" ADD COLUMN "attempt_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "scanner_ai_job" ADD COLUMN "error_message" TEXT;

CREATE INDEX IF NOT EXISTS "idx_scanner_ai_job_queue" ON "scanner_ai_job"("status", "queued_at");
