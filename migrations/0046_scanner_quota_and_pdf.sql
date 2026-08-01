-- Store generated report objects so users can view/download the same PDF again.
ALTER TABLE "scanner_response" ADD COLUMN "pdf_combined_key" text;
ALTER TABLE "scanner_response" ADD COLUMN "pdf_plan_key" text;
ALTER TABLE "scanner_response" ADD COLUMN "pdf_analysis_key" text;

CREATE INDEX IF NOT EXISTS "idx_scanner_history_user_survey_created"
  ON "scanner_history" ("user_id", "survey_id", "created_at");
