-- Retention snapshots ensure storage duration is fixed at submission time.
ALTER TABLE "scanner_response" ADD COLUMN "retention_tier" TEXT NOT NULL DEFAULT 'account_free'
  CHECK ("retention_tier" IN ('guest', 'account_free', 'credit_paid'));
ALTER TABLE "scanner_response" ADD COLUMN "expires_at" TEXT NOT NULL DEFAULT '9999-12-31T23:59:59.999Z';

CREATE INDEX IF NOT EXISTS "idx_scanner_response_expiry"
  ON "scanner_response" ("expires_at");
CREATE INDEX IF NOT EXISTS "idx_scanner_credit_run_response_status"
  ON "scanner_credit_run" ("response_id", "status");

UPDATE "scanner_response"
SET "retention_tier" = 'guest',
    "expires_at" = strftime('%Y-%m-%dT%H:%M:%fZ', "created_at", '+3 days')
WHERE "id" IN (SELECT "response_id" FROM "scanner_guest_report");

UPDATE "scanner_response"
SET "retention_tier" = 'credit_paid',
    "expires_at" = strftime('%Y-%m-%dT%H:%M:%fZ', "created_at", '+365 days')
WHERE "id" IN (
  SELECT "response_id" FROM "scanner_credit_run"
  WHERE "status" = 'completed' AND "response_id" IS NOT NULL
);

UPDATE "scanner_response"
SET "retention_tier" = 'account_free',
    "expires_at" = strftime('%Y-%m-%dT%H:%M:%fZ', "created_at", '+30 days')
WHERE "retention_tier" = 'account_free'
  AND "expires_at" = '9999-12-31T23:59:59.999Z';

UPDATE "scanner_guest_report"
SET "expires_at" = (
  SELECT "expires_at" FROM "scanner_response"
  WHERE "scanner_response"."id" = "scanner_guest_report"."response_id"
);
