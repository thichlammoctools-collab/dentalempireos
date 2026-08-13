-- Retire Scanner image generation while retaining existing image keys and R2 objects.
-- Return Credits that were reserved for queued image jobs before removing their runs.

INSERT OR IGNORE INTO "credit_ledger_entry"
  ("id", "account_id", "kind", "amount", "source_type", "source_id", "idempotency_key", "actor_user_id", "reason", "metadata_json", "created_at")
SELECT DISTINCT
  'release-scanner-report-image-' || "cr"."id",
  "cr"."account_id",
  'release',
  "cr"."reserved_credits",
  "cr"."feature_type",
  "cr"."business_object_id",
  'retire-scanner-report-image:' || "cr"."id",
  NULL,
  'scanner_report_image_feature_retired',
  '{}',
  datetime('now')
FROM "credit_reservation" AS "cr"
JOIN "scanner_report_image_credit_run" AS "run"
  ON "run"."reservation_id" = "cr"."id"
WHERE "cr"."status" = 'reserved';

UPDATE "credit_account" AS "ca"
SET "available_credits" = "ca"."available_credits" + "releases"."reserved_credits",
    "reserved_credits" = "ca"."reserved_credits" - "releases"."reserved_credits",
    "updated_at" = datetime('now')
FROM (
  SELECT
    "reservations"."account_id",
    SUM("reservations"."reserved_credits") AS "reserved_credits"
  FROM (
    SELECT DISTINCT
      "cr"."id",
      "cr"."account_id",
      "cr"."reserved_credits"
    FROM "credit_reservation" AS "cr"
    JOIN "scanner_report_image_credit_run" AS "run"
      ON "run"."reservation_id" = "cr"."id"
    WHERE "cr"."status" = 'reserved'
  ) AS "reservations"
  GROUP BY "reservations"."account_id"
) AS "releases"
WHERE "ca"."id" = "releases"."account_id";

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
