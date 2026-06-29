-- Migration 0023: Create survey_section table
-- Each survey definition is divided into ordered sections (steps in the multi-step form).
-- E.g. "Hồ Sơ Gốc Rễ" has 6 sections: ROOTS, SKY, S.T.A.R.S, Living, Future, Commitment.

CREATE TABLE IF NOT EXISTS "survey_section" (
  "id"          integer PRIMARY KEY AUTOINCREMENT,
  "survey_id"   text NOT NULL REFERENCES "survey_definition"("id") ON DELETE CASCADE,
  "order_idx"   integer NOT NULL DEFAULT 0,
  "title_vi"    text NOT NULL,
  "title_en"    text NOT NULL DEFAULT '',
  "subtitle_vi" text,
  "subtitle_en" text,
  "ref"         text,                                                   -- e.g. "Ch.26 — R.O.A.D.M.A.P"
  "icon"        text,                                                   -- material symbol name
  "created_at"  text NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_section_survey"  ON "survey_section" ("survey_id");
CREATE INDEX IF NOT EXISTS "idx_section_order"   ON "survey_section" ("survey_id", "order_idx");