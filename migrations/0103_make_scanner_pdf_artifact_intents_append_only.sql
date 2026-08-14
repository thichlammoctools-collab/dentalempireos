-- PDF artifact write intents are append-only cleanup handles. A stalled writer
-- must never lose its key when a later lease claims the same response.
--
-- Rebuild instead of altering the original 0101 table: SQLite cannot replace its
-- response_id primary key in place, and deployed migrations must remain immutable.
CREATE TABLE "scanner_pdf_artifact_intent_0103" (
  "response_id" INTEGER NOT NULL,
  "storage_key" TEXT NOT NULL,
  "operation_key" TEXT NOT NULL,
  "lease_token" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  PRIMARY KEY ("response_id", "lease_token"),
  UNIQUE ("storage_key"),
  FOREIGN KEY ("response_id") REFERENCES "scanner_response"("id") ON DELETE CASCADE
);

-- Preserve every legacy intent before replacing the singleton response_id shape.
INSERT INTO "scanner_pdf_artifact_intent_0103"
  ("response_id", "storage_key", "operation_key", "lease_token", "created_at", "updated_at")
SELECT
  "response_id", "storage_key", "operation_key", "lease_token", "created_at", "updated_at"
FROM "scanner_pdf_artifact_intent";

DROP TABLE "scanner_pdf_artifact_intent";
ALTER TABLE "scanner_pdf_artifact_intent_0103" RENAME TO "scanner_pdf_artifact_intent";

CREATE INDEX IF NOT EXISTS "idx_scanner_pdf_artifact_intent_response_updated"
  ON "scanner_pdf_artifact_intent"("response_id", "updated_at");
