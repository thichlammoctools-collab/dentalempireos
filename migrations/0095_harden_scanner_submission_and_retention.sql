-- Phase 2 corrective pass: make authenticated Scanner submissions durable before
-- they can create a response or settle a credit run.
--
-- `scanner_submission` is the idempotency authority for both free and paid
-- submissions. Its request fingerprint and optional action-plan binding are
-- immutable per (user, idempotency key), so a replay cannot redirect an already
-- created response into another plan.
CREATE TABLE IF NOT EXISTS "scanner_submission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "survey_id" TEXT NOT NULL REFERENCES "survey_definition"("id"),
  "idempotency_key" TEXT NOT NULL,
  "request_fingerprint" TEXT NOT NULL,
  "action_plan_id" TEXT REFERENCES "scanner_action_plan"("id"),
  "response_id" INTEGER REFERENCES "scanner_response"("id"),
  "snapshot_status" TEXT NOT NULL DEFAULT 'not_requested'
    CHECK ("snapshot_status" IN ('not_requested', 'pending', 'linked')),
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  UNIQUE("user_id", "idempotency_key")
);

CREATE INDEX IF NOT EXISTS "idx_scanner_submission_response"
  ON "scanner_submission"("response_id");
CREATE INDEX IF NOT EXISTS "idx_scanner_submission_plan"
  ON "scanner_submission"("action_plan_id");

-- New normalized plans are guarded before persistence. Older plans were derived
-- from legacy `ai_plan` text, which could contain raw report data. Do not rewrite
-- that historical content: show it only while its source remains retained, then
-- mark it unavailable when the retention worker purges the source response.
ALTER TABLE "scanner_action_plan" ADD COLUMN "retention_visibility" TEXT NOT NULL DEFAULT 'available'
  CHECK ("retention_visibility" IN ('available', 'legacy_source_bound', 'unavailable'));

UPDATE "scanner_action_plan"
SET "retention_visibility" = 'legacy_source_bound'
WHERE "generation_provenance" = 'legacy_ai_plan';

-- A rescan response can belong to exactly one plan. This backs up the immutable
-- submission binding at the database layer if any future route is added.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_scanner_action_plan_one_rescan_response"
  ON "scanner_action_plan_score_snapshot"("response_id")
  WHERE "snapshot_kind" = 'rescan' AND "response_id" IS NOT NULL;
