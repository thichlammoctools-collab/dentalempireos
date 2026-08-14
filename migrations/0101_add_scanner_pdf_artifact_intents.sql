-- Durable PDF write intents close the put-before-persist crash window. The
-- response_id primary key matches the response-wide external-work lease: one
-- response can have at most one in-flight external artifact operation.
CREATE TABLE IF NOT EXISTS "scanner_pdf_artifact_intent" (
  "response_id" INTEGER NOT NULL PRIMARY KEY,
  "storage_key" TEXT NOT NULL,
  "operation_key" TEXT NOT NULL,
  "lease_token" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  FOREIGN KEY ("response_id") REFERENCES "scanner_response"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_scanner_pdf_artifact_intent_storage_key"
  ON "scanner_pdf_artifact_intent"("storage_key");
