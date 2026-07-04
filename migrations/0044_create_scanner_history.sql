-- Migration: 0044_create_scanner_history
-- Tracks which user has taken which scanner, for history + access control.

CREATE TABLE IF NOT EXISTS "scanner_history" (
  "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
  "user_id" text NOT NULL,
  "survey_id" text NOT NULL,
  "response_id" integer NOT NULL,
  "score_total" real,
  "score_label" text,
  "created_at" text NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_scanner_history_user" ON "scanner_history" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_scanner_history_user_survey" ON "scanner_history" ("user_id", "survey_id");
