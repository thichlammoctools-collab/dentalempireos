-- Retire Scanner image generation while retaining existing image keys and R2 objects.
-- Return Credits that were reserved for queued image jobs before removing their runs.

INSERT OR IGNORE INTO "credit_ledger_entry"
  ("id", "account_id", "kind", "amount", "source_type", "source_id", "idempotency_key", "actor_user_id", "reason", "metadata_json", "created_at")
SELECT
  'release-scanner-report-image-' || "credit_reservation"."id",
  "credit_reservation"."account_id",
  'release',
  "credit_reservation"."reserved_credits",
  "credit_reservation"."feature_type",
  "credit_reservation"."business_object_id",
  'retire-scanner-report-image:' || "credit_reservation"."id",
  NULL,
  'scanner_report_image_feature_retired',
  '{}',
  datetime('now')
FROM "credit_reservation"
JOIN "scanner_report_image_credit_run"
  ON "scanner_report_image_credit_run"."reservation_id" = "credit_reservation"."id"
WHERE "credit_reservation"."status" = 'reserved';

UPDATE "credit_account"
SET "available_credits" = "available_credits" + "credit_reservation"."reserved_credits",
    "reserved_credits" = "reserved_credits" - "credit_reservation"."reserved_credits",
    "updated_at" = datetime('now')
FROM "credit_reservation"
JOIN "scanner_report_image_credit_run"
  ON "scanner_report_image_credit_run"."reservation_id" = "credit_reservation"."id"
WHERE "credit_account"."id" = "credit_reservation"."account_id"
  AND "credit_reservation"."status" = 'reserved';

UPDATE "credit_reservation"
SET "status" = 'released',
    "released_at" = datetime('now'),
    "updated_at" = datetime('now')
WHERE "status" = 'reserved'
  AND "id" IN (
    SELECT "reservation_id" FROM "scanner_report_image_credit_run"
  );

DELETE FROM "credit_pricing_rule" WHERE "feature_type" = 'scanner_report_image';
DROP TABLE IF EXISTS "scanner_report_image_credit_run";
DROP TABLE IF EXISTS "scanner_report_image_job";
ALTER TABLE "ai_settings" DROP COLUMN "motapis_image_model";
