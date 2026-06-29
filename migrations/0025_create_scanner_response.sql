-- Migration 0025: Create scanner_response table
-- Generic responses for all surveys. Replaces column-per-question `survey_responses` table.
-- `responses_json` stores question_id -> answer mapping (string for textarea, number for select).
-- `scores_json` stores dimension scores (e.g. {"roots":75,"sky":60,"total":68}).

CREATE TABLE IF NOT EXISTS "scanner_response" (
  "id"                 integer PRIMARY KEY AUTOINCREMENT,
  "survey_id"          text NOT NULL REFERENCES "survey_definition"("id"),
  "created_at"         text NOT NULL DEFAULT (datetime('now')),
  "lang"               text NOT NULL DEFAULT 'vi',
  "owner_name"         text,
  "clinic_name"        text,
  "clinic_address"     text,
  "email"              text,
  "years_in_operation" integer,
  "staff_count"        integer,
  "responses_json"     text NOT NULL DEFAULT '{}',
  "scores_json"        text,
  "ai_analysis"        text,
  "ai_analyzed_at"     text
);

CREATE INDEX IF NOT EXISTS "idx_response_survey"   ON "scanner_response" ("survey_id");
CREATE INDEX IF NOT EXISTS "idx_response_created"  ON "scanner_response" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_response_email"    ON "scanner_response" ("email");