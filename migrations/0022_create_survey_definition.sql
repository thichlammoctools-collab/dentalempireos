-- Migration 0022: Create survey_definition table
-- Defines a "scanner" / "audit tool" — a configurable self-assessment.
-- Replaces the hardcoded "Hồ Sơ Gốc Rễ" survey with a flexible definition-driven system.
-- Each scanner has its own scoring rules, AI prompt, and translations.

CREATE TABLE IF NOT EXISTS "survey_definition" (
  "id"              text PRIMARY KEY,                                    -- e.g. 'ho-so-goc-re'
  "slug"            text NOT NULL UNIQUE,                                -- URL-friendly identifier
  "title_vi"        text NOT NULL,
  "title_en"        text NOT NULL DEFAULT '',
  "description_vi"  text,
  "description_en"  text,
  "subtitle_vi"     text,
  "subtitle_en"     text,
  "chapter_refs"    text,                                                -- JSON array: ["Ch.26","Ch.24"]
  "status"          text NOT NULL DEFAULT 'draft'
                    CHECK("status" IN ('draft','active','archived')),
  "is_free"         integer NOT NULL DEFAULT 0,                          -- 0=AI paywall, 1=AI free
  "survey_type"     text NOT NULL DEFAULT 'full'
                    CHECK("survey_type" IN ('mini','full','checklist')),
  "lead_fields"     text,                                                -- JSON: which fields to collect
  "scoring_rules"   text,                                                -- JSON: dimensions + thresholds
  "ai_config"       text,                                                -- JSON: prompts + model override
  "translations_vi" text,                                                -- JSON: button labels etc.
  "translations_en" text,
  "order_index"     integer NOT NULL DEFAULT 0,
  "created_at"      text NOT NULL DEFAULT (datetime('now')),
  "updated_at"      text NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_survey_def_status"   ON "survey_definition" ("status");
CREATE INDEX IF NOT EXISTS "idx_survey_def_slug"     ON "survey_definition" ("slug");
CREATE INDEX IF NOT EXISTS "idx_survey_def_order"    ON "survey_definition" ("order_index");