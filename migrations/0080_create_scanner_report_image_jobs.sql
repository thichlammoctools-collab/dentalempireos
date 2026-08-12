-- Keep slow image generation independent from the interactive scanner report.
CREATE TABLE IF NOT EXISTS "scanner_report_image_job" (
  "response_id" INTEGER NOT NULL,
  "image_type" TEXT NOT NULL CHECK ("image_type" IN ('analysis', 'plan')),
  "run_id" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'running' CHECK ("status" IN ('running', 'done', 'failed')),
  "claimed_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("response_id", "image_type")
);

CREATE INDEX IF NOT EXISTS "idx_scanner_report_image_job_status"
  ON "scanner_report_image_job"("status", "claimed_at");
