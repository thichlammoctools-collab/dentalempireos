-- Migration 0024: Create survey_question table
-- Each section contains ordered questions.
-- Supported types: textarea (open), select (1-5 scale), radio (multiple choice), yesno (yes/no).
-- Scoring dimensions reference questions by their `question_id` (unique within a survey).

CREATE TABLE IF NOT EXISTS "survey_question" (
  "id"              integer PRIMARY KEY AUTOINCREMENT,
  "section_id"      integer NOT NULL REFERENCES "survey_section"("id") ON DELETE CASCADE,
  "question_id"     text NOT NULL,                                       -- unique key within survey
  "order_idx"       integer NOT NULL DEFAULT 0,
  "type"            text NOT NULL
                    CHECK("type" IN ('textarea','select','radio','yesno')),
  "label_vi"        text NOT NULL,
  "label_en"        text NOT NULL DEFAULT '',
  "placeholder_vi"  text,
  "placeholder_en"  text,
  "options_vi"      text,                                                -- JSON array for radio
  "options_en"      text,
  "scale_labels_vi" text,                                                -- JSON {"1":"..","5":".."} for select
  "scale_labels_en" text,
  "required"        integer NOT NULL DEFAULT 0,
  "anchor"          integer NOT NULL DEFAULT 0,                          -- highlight as anchor question
  "weight"          real,                                                -- scoring weight, nullable
  "dimension"       text,                                                -- scoring dimension group
  "created_at"      text NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_question_section" ON "survey_question" ("section_id");
CREATE INDEX IF NOT EXISTS "idx_question_order"   ON "survey_question" ("section_id", "order_idx");
CREATE INDEX IF NOT EXISTS "idx_question_dim"     ON "survey_question" ("dimension");