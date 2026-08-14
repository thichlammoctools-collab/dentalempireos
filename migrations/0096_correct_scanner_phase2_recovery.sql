-- Phase 2 corrective follow-up: durable free-attempt capacity, recoverable Scanner
-- credit runs, and a retention-cleanup audit trail.
--
-- This migration is additive so a normal 0087+ database does not reference the
-- removed scanner_report_image_credit_run table. The retention worker probes that
-- legacy table at runtime only when it exists in an older retained deployment.

CREATE TABLE IF NOT EXISTS "scanner_free_attempt_reservation" (
  "submission_id" TEXT NOT NULL PRIMARY KEY REFERENCES "scanner_submission"("id"),
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "survey_id" TEXT NOT NULL REFERENCES "survey_definition"("id"),
  "status" TEXT NOT NULL CHECK ("status" IN ('reserved', 'settled', 'released')),
  "created_at" TEXT NOT NULL,
  "settled_at" TEXT,
  "released_at" TEXT,
  "updated_at" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_scanner_free_attempt_capacity"
  ON "scanner_free_attempt_reservation"("user_id", "survey_id", "status");

-- Keep an observable record if object deletion succeeds but relational cleanup
-- cannot yet complete; the raw response then remains an intentional retry item.
CREATE TABLE IF NOT EXISTS "scanner_response_purge" (
  "response_id" INTEGER NOT NULL PRIMARY KEY,
  "status" TEXT NOT NULL CHECK ("status" IN ('pending', 'artifacts_deleted', 'completed')),
  "attempt_count" INTEGER NOT NULL DEFAULT 0,
  "last_error" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  "completed_at" TEXT
);

CREATE INDEX IF NOT EXISTS "idx_scanner_response_purge_status"
  ON "scanner_response_purge"("status", "updated_at");

-- A failed run has already released its old reservation. retry_token atomically
-- elects one deterministic replacement reservation for same-key recovery; it is
-- deliberately nullable to retain compatibility with all pre-0096 runs.
ALTER TABLE "scanner_credit_run" ADD COLUMN "retry_token" TEXT;
ALTER TABLE "scanner_credit_run" ADD COLUMN "credit_amount" INTEGER;
ALTER TABLE "scanner_credit_run" ADD COLUMN "price_snapshot_json" TEXT;
