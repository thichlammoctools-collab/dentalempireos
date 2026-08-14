-- Phase 1A corrective follow-up.
--
-- Scanner responses are retention-limited because they contain raw answers and
-- contact data. Action plans retain only normalized recommendations and score
-- snapshots, so an owner can compare future rescans after the source response
-- has expired. Response links therefore become nullable and are detached by the
-- retention worker before the source row is deleted.
--
-- Existing 0092 plans are legacy ai_plan-derived records. Assign a stable,
-- plan-scoped legacy run ID so future Phase 1B queue runs can use the existing
-- scanner_ai_job.run_id as an idempotency key without changing deployed 0092.

PRAGMA defer_foreign_keys = ON;

CREATE TABLE "scanner_action_plan_0093" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "survey_id" TEXT NOT NULL REFERENCES "survey_definition"("id"),
  "source_response_id" INTEGER UNIQUE REFERENCES "scanner_response"("id"),
  "source_response_purged_at" TEXT,
  "generation_run_id" TEXT NOT NULL,
  "generation_state" TEXT NOT NULL DEFAULT 'pending'
    CHECK ("generation_state" IN ('pending', 'ready')),
  "generation_provenance" TEXT NOT NULL DEFAULT 'legacy_ai_plan'
    CHECK ("generation_provenance" IN ('legacy_ai_plan', 'phase_1b_queue')),
  "status" TEXT NOT NULL DEFAULT 'active' CHECK ("status" IN ('active', 'archived')),
  "title" TEXT,
  "summary" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL
);

CREATE TABLE "scanner_action_plan_score_snapshot_0093" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "plan_id" TEXT NOT NULL REFERENCES "scanner_action_plan_0093"("id"),
  "response_id" INTEGER REFERENCES "scanner_response"("id"),
  "snapshot_kind" TEXT NOT NULL CHECK ("snapshot_kind" IN ('baseline', 'rescan')),
  "score_total" REAL,
  "scores_json" TEXT NOT NULL,
  "response_created_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  UNIQUE("plan_id", "response_id")
);

CREATE TABLE "scanner_action_plan_action_0093" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "plan_id" TEXT NOT NULL REFERENCES "scanner_action_plan_0093"("id"),
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

CREATE TABLE "scanner_action_plan_action_progress_0093" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "action_id" TEXT NOT NULL REFERENCES "scanner_action_plan_action_0093"("id"),
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "status" TEXT NOT NULL CHECK ("status" IN ('not_started', 'in_progress', 'completed', 'skipped')),
  "note" TEXT,
  "created_at" TEXT NOT NULL
);

INSERT INTO "scanner_action_plan_0093"
  ("id", "user_id", "survey_id", "source_response_id", "source_response_purged_at",
   "generation_run_id", "generation_state", "generation_provenance", "status", "title", "summary", "created_at", "updated_at")
SELECT
  "id", "user_id", "survey_id", "source_response_id", NULL,
  'legacy-ai-plan:' || "id", 'ready', 'legacy_ai_plan', "status", "title", "summary", "created_at", "updated_at"
FROM "scanner_action_plan";

INSERT INTO "scanner_action_plan_score_snapshot_0093"
  ("id", "plan_id", "response_id", "snapshot_kind", "score_total", "scores_json", "response_created_at", "created_at")
SELECT "id", "plan_id", "response_id", "snapshot_kind", "score_total", "scores_json", "response_created_at", "created_at"
FROM "scanner_action_plan_score_snapshot";

INSERT INTO "scanner_action_plan_action_0093"
  ("id", "plan_id", "position", "title", "description", "category", "priority", "target_days", "status", "completed_at", "created_at", "updated_at")
SELECT "id", "plan_id", "position", "title", "description", "category", "priority", "target_days", "status", "completed_at", "created_at", "updated_at"
FROM "scanner_action_plan_action";

INSERT INTO "scanner_action_plan_action_progress_0093"
  ("id", "action_id", "user_id", "status", "note", "created_at")
SELECT "id", "action_id", "user_id", "status", "note", "created_at"
FROM "scanner_action_plan_action_progress";

DROP TABLE "scanner_action_plan_action_progress";
DROP TABLE "scanner_action_plan_action";
DROP TABLE "scanner_action_plan_score_snapshot";
DROP TABLE "scanner_action_plan";

ALTER TABLE "scanner_action_plan_0093" RENAME TO "scanner_action_plan";
ALTER TABLE "scanner_action_plan_score_snapshot_0093" RENAME TO "scanner_action_plan_score_snapshot";
ALTER TABLE "scanner_action_plan_action_0093" RENAME TO "scanner_action_plan_action";
ALTER TABLE "scanner_action_plan_action_progress_0093" RENAME TO "scanner_action_plan_action_progress";

CREATE INDEX "idx_scanner_action_plan_user_status"
  ON "scanner_action_plan"("user_id", "status", "updated_at" DESC);
CREATE INDEX "idx_scanner_action_plan_source_response"
  ON "scanner_action_plan"("source_response_id");
CREATE UNIQUE INDEX "idx_scanner_action_plan_generation_run"
  ON "scanner_action_plan"("generation_run_id");
CREATE INDEX "idx_scanner_action_plan_snapshot_response"
  ON "scanner_action_plan_score_snapshot"("response_id");
CREATE INDEX "idx_scanner_action_plan_snapshot_plan_created"
  ON "scanner_action_plan_score_snapshot"("plan_id", "created_at");
CREATE UNIQUE INDEX "idx_scanner_action_plan_one_baseline"
  ON "scanner_action_plan_score_snapshot"("plan_id")
  WHERE "snapshot_kind" = 'baseline';
CREATE INDEX "idx_scanner_action_plan_action_plan_position"
  ON "scanner_action_plan_action"("plan_id", "position");
CREATE INDEX "idx_scanner_action_plan_progress_action_created"
  ON "scanner_action_plan_action_progress"("action_id", "created_at");
