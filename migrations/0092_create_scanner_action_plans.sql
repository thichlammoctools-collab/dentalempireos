-- Phase 1A: normalized, user-owned Scanner action plans.
-- Plans are anchored to an authenticated Scanner response; score snapshots support
-- the baseline and each later rescan without relying on mutable scoring rules.

CREATE TABLE IF NOT EXISTS "scanner_action_plan" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "survey_id" TEXT NOT NULL REFERENCES "survey_definition"("id"),
  "source_response_id" INTEGER NOT NULL UNIQUE REFERENCES "scanner_response"("id"),
  "status" TEXT NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'archived')),
  "title" TEXT,
  "summary" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "scanner_action_plan_score_snapshot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "plan_id" TEXT NOT NULL REFERENCES "scanner_action_plan"("id"),
  "response_id" INTEGER NOT NULL REFERENCES "scanner_response"("id"),
  "snapshot_kind" TEXT NOT NULL CHECK ("snapshot_kind" IN ('baseline', 'rescan')),
  "score_total" REAL,
  "scores_json" TEXT NOT NULL,
  "response_created_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  UNIQUE("plan_id", "response_id")
);

CREATE TABLE IF NOT EXISTS "scanner_action_plan_action" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "plan_id" TEXT NOT NULL REFERENCES "scanner_action_plan"("id"),
  "position" INTEGER NOT NULL CHECK ("position" >= 0),
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "priority" TEXT NOT NULL DEFAULT 'medium' CHECK ("priority" IN ('low', 'medium', 'high')),
  "target_days" INTEGER CHECK ("target_days" IS NULL OR "target_days" >= 0),
  "status" TEXT NOT NULL DEFAULT 'not_started' CHECK ("status" IN ('not_started', 'in_progress', 'completed', 'skipped')),
  "completed_at" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  UNIQUE("plan_id", "position")
);

CREATE TABLE IF NOT EXISTS "scanner_action_plan_action_progress" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "action_id" TEXT NOT NULL REFERENCES "scanner_action_plan_action"("id"),
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "status" TEXT NOT NULL CHECK ("status" IN ('not_started', 'in_progress', 'completed', 'skipped')),
  "note" TEXT,
  "created_at" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_user_status"
  ON "scanner_action_plan"("user_id", "status", "updated_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_source_response"
  ON "scanner_action_plan"("source_response_id");
CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_snapshot_response"
  ON "scanner_action_plan_score_snapshot"("response_id");
CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_snapshot_plan_created"
  ON "scanner_action_plan_score_snapshot"("plan_id", "created_at");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_scanner_action_plan_one_baseline"
  ON "scanner_action_plan_score_snapshot"("plan_id")
  WHERE "snapshot_kind" = 'baseline';
CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_action_plan_position"
  ON "scanner_action_plan_action"("plan_id", "position");
CREATE INDEX IF NOT EXISTS "idx_scanner_action_plan_progress_action_created"
  ON "scanner_action_plan_action_progress"("action_id", "created_at");
