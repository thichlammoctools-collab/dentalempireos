-- Add linked_scanner_id to ai_application table
-- Allows linking a Survey-type AI App to a specific scanner definition.

ALTER TABLE "ai_application"
  ADD COLUMN "linked_scanner_id" TEXT
    REFERENCES "survey_definition"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS "idx_ai_app_linked_scanner"
  ON "ai_application"("linked_scanner_id");
