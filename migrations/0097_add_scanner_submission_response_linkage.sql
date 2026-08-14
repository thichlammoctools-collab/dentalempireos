-- Scanner submission/response retention linkage follow-up.
--
-- This runs after the deployable 0095 baseline. D1 records applied migrations,
-- so the column additions execute once; SQLite supports IF NOT EXISTS for the
-- index but not for ALTER TABLE ... ADD COLUMN.

ALTER TABLE "scanner_submission" ADD COLUMN "response_purged_at" TEXT;

ALTER TABLE "scanner_response" ADD COLUMN "submission_id" TEXT REFERENCES "scanner_submission"("id");

CREATE UNIQUE INDEX IF NOT EXISTS "idx_scanner_response_submission"
  ON "scanner_response"("submission_id") WHERE "submission_id" IS NOT NULL;
