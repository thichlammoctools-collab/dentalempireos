-- Paid member-only image generation runs. One active run per report image avoids
-- double-reservation while terminal failures remain retryable with a new run.
CREATE TABLE IF NOT EXISTS "scanner_report_image_credit_run" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "response_id" INTEGER NOT NULL REFERENCES "scanner_response"("id"),
  "image_type" TEXT NOT NULL CHECK ("image_type" IN ('analysis', 'plan')),
  "user_id" TEXT NOT NULL REFERENCES "user"("id"),
  "reservation_id" TEXT NOT NULL REFERENCES "credit_reservation"("id"),
  "pricing_rule_id" TEXT NOT NULL REFERENCES "credit_pricing_rule"("id"),
  "idempotency_key" TEXT NOT NULL,
  "credits" INTEGER NOT NULL CHECK ("credits" > 0),
  "price_snapshot_json" TEXT NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('reserved', 'completed', 'failed')),
  "active_key" TEXT,
  "failure_reason" TEXT,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL,
  UNIQUE("response_id", "image_type", "active_key"),
  UNIQUE("user_id", "idempotency_key")
);

CREATE INDEX IF NOT EXISTS "idx_scanner_report_image_credit_run_user_status"
  ON "scanner_report_image_credit_run"("user_id", "status", "created_at" DESC);
