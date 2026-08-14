-- Retired Scanner artifact keys are a privacy cleanup ledger, not report data.
-- No response foreign key is intentional: a tombstone must survive raw-response
-- purge so a late stale R2.put is deleted by later scheduled reconciliations.
CREATE TABLE IF NOT EXISTS "scanner_retired_artifact_tombstone" (
  "storage_key" TEXT NOT NULL PRIMARY KEY,
  "write_token" TEXT,
  "artifact_kind" TEXT NOT NULL CHECK ("artifact_kind" IN ('pdf', 'image')),
  "retired_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  "last_delete_attempt_at" TEXT,
  "last_delete_succeeded_at" TEXT,
  "last_delete_failed_at" TEXT,
  "delete_attempt_count" INTEGER NOT NULL DEFAULT 0,
  "last_error" TEXT
);

CREATE INDEX IF NOT EXISTS "idx_scanner_retired_artifact_tombstone_reconcile"
  ON "scanner_retired_artifact_tombstone" ("last_delete_attempt_at", "retired_at");
