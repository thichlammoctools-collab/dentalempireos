-- Migration 0059: Configuration for manual bank-transfer payments.
CREATE TABLE IF NOT EXISTS "manual_payment_settings" (
  "id" integer NOT NULL PRIMARY KEY CHECK("id" = 1),
  "is_active" integer NOT NULL DEFAULT 0,
  "bank_bin" text NOT NULL DEFAULT '',
  "account_number" text NOT NULL DEFAULT '',
  "account_name" text NOT NULL DEFAULT '',
  "zalo_url" text NOT NULL DEFAULT '',
  "updated_at" text NOT NULL
);

INSERT OR IGNORE INTO "manual_payment_settings"
  ("id", "is_active", "bank_bin", "account_number", "account_name", "zalo_url", "updated_at")
VALUES
  (1, 0, '', '', '', '', datetime('now'));
