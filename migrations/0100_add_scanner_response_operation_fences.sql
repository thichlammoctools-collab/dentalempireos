-- Retention fences for Scanner-derived artifacts. A lease is acquired before any
-- external work starts; the purge worker waits for non-stale leases before
-- deleting raw response data and its persisted artifacts.
CREATE TABLE IF NOT EXISTS "scanner_response_operation_lease" (
  "response_id" INTEGER NOT NULL,
  "operation_key" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "lease_expires_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL,
  PRIMARY KEY ("response_id"),
  FOREIGN KEY ("response_id") REFERENCES "scanner_response"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "idx_scanner_response_operation_lease_expiry"
  ON "scanner_response_operation_lease"("lease_expires_at");
