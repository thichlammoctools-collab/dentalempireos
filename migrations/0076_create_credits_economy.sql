-- Migration 0076: Credits Economy cutover foundation
-- New Credits tables intentionally coexist with legacy commerce until routes are migrated.

CREATE TABLE IF NOT EXISTS "credit_account" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL UNIQUE REFERENCES "user"("id"),
  "available_credits" integer NOT NULL DEFAULT 0 CHECK("available_credits" >= 0),
  "reserved_credits" integer NOT NULL DEFAULT 0 CHECK("reserved_credits" >= 0),
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "credit_ledger_entry" (
  "id" text NOT NULL PRIMARY KEY,
  "account_id" text NOT NULL REFERENCES "credit_account"("id"),
  "kind" text NOT NULL CHECK("kind" IN ('welcome_grant','purchase_grant','challenge_grant','admin_adjustment','reservation','settlement','release','refund','reversal')),
  "amount" integer NOT NULL,
  "source_type" text NOT NULL,
  "source_id" text NOT NULL,
  "idempotency_key" text NOT NULL,
  "actor_user_id" text REFERENCES "user"("id"),
  "reason" text,
  "metadata_json" text NOT NULL DEFAULT '{}',
  "created_at" text NOT NULL,
  UNIQUE("account_id", "idempotency_key")
);

CREATE TABLE IF NOT EXISTS "credit_reservation" (
  "id" text NOT NULL PRIMARY KEY,
  "account_id" text NOT NULL REFERENCES "credit_account"("id"),
  "feature_type" text NOT NULL,
  "business_object_id" text NOT NULL,
  "reserved_credits" integer NOT NULL CHECK("reserved_credits" > 0),
  "status" text NOT NULL CHECK("status" IN ('reserved','settled','released','expired')),
  "idempotency_key" text NOT NULL,
  "expires_at" text,
  "released_at" text,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL,
  UNIQUE("account_id", "idempotency_key"),
  UNIQUE("account_id", "feature_type", "business_object_id")
);

CREATE TABLE IF NOT EXISTS "credit_consumption" (
  "id" text NOT NULL PRIMARY KEY,
  "account_id" text NOT NULL REFERENCES "credit_account"("id"),
  "reservation_id" text REFERENCES "credit_reservation"("id"),
  "feature_type" text NOT NULL,
  "business_object_id" text NOT NULL,
  "charge_type" text NOT NULL,
  "credits" integer NOT NULL CHECK("credits" >= 0),
  "price_snapshot_json" text NOT NULL DEFAULT '{}',
  "quantity_snapshot_json" text NOT NULL DEFAULT '{}',
  "created_at" text NOT NULL,
  UNIQUE("feature_type", "business_object_id", "charge_type")
);

CREATE TABLE IF NOT EXISTS "credit_package" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "price" integer NOT NULL CHECK("price" >= 0),
  "credit_amount" integer NOT NULL CHECK("credit_amount" >= 0),
  "bonus_credits" integer NOT NULL DEFAULT 0 CHECK("bonus_credits" >= 0),
  "is_active" integer NOT NULL DEFAULT 1,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "credit_order" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user"("id"),
  "credit_package_id" text REFERENCES "credit_package"("id"),
  "order_code" integer UNIQUE,
  "amount" integer NOT NULL CHECK("amount" >= 0),
  "credits_to_grant" integer NOT NULL CHECK("credits_to_grant" >= 0),
  "package_snapshot_json" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending' CHECK("status" IN ('pending','processing','paid','cancelled','expired')),
  "payment_method" text NOT NULL,
  "payment_link_id" text,
  "checkout_url" text,
  "idempotency_key" text NOT NULL UNIQUE,
  "fulfilled_at" text,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "credit_pricing_rule" (
  "id" text NOT NULL PRIMARY KEY,
  "feature_type" text NOT NULL,
  "target_id" text NOT NULL DEFAULT '*',
  "model" text NOT NULL DEFAULT '*',
  "rule_version" integer NOT NULL DEFAULT 1,
  "credit_amount" integer,
  "tokens_per_credit" integer,
  "minutes_per_credit" integer,
  "max_tokens" integer,
  "is_active" integer NOT NULL DEFAULT 1,
  "effective_from" text NOT NULL,
  "effective_until" text,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL,
  CHECK("credit_amount" IS NOT NULL OR "tokens_per_credit" IS NOT NULL OR "minutes_per_credit" IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS "user_content_grant" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user"("id"),
  "content_type" text NOT NULL CHECK("content_type" IN ('book','blog','course','resource')),
  "content_id" text NOT NULL,
  "granted_at" text NOT NULL,
  "expires_at" text,
  "credit_consumption_id" text REFERENCES "credit_consumption"("id"),
  "updated_at" text NOT NULL,
  UNIQUE("user_id", "content_type", "content_id")
);

CREATE TABLE IF NOT EXISTS "consultation_booking" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user"("id"),
  "requested_blocks" integer NOT NULL CHECK("requested_blocks" > 0),
  "reserved_blocks" integer NOT NULL CHECK("reserved_blocks" > 0),
  "scheduled_at" text,
  "status" text NOT NULL CHECK("status" IN ('pending','scheduled','completed','declined','cancelled','expired')),
  "reservation_id" text REFERENCES "credit_reservation"("id"),
  "credit_consumption_id" text REFERENCES "credit_consumption"("id"),
  "actual_blocks" integer,
  "notes" text,
  "admin_user_id" text REFERENCES "user"("id"),
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "scanner_credit_run" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user"("id"),
  "survey_id" text NOT NULL REFERENCES "survey_definition"("id"),
  "idempotency_key" text NOT NULL,
  "reservation_id" text NOT NULL REFERENCES "credit_reservation"("id"),
  "response_id" integer REFERENCES "scanner_response"("id"),
  "status" text NOT NULL CHECK("status" IN ('reserved','completed','failed')),
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL,
  UNIQUE("user_id", "idempotency_key")
);

CREATE TABLE IF NOT EXISTS "credit_challenge" (
  "id" text NOT NULL PRIMARY KEY,
  "event_type" text NOT NULL CHECK("event_type" IN ('scanner','course')),
  "target_id" text NOT NULL DEFAULT '*',
  "reward_credits" integer NOT NULL CHECK("reward_credits" > 0),
  "is_active" integer NOT NULL DEFAULT 1,
  "one_time" integer NOT NULL DEFAULT 1,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "credit_challenge_reward" (
  "id" text NOT NULL PRIMARY KEY,
  "challenge_id" text NOT NULL REFERENCES "credit_challenge"("id"),
  "user_id" text NOT NULL REFERENCES "user"("id"),
  "event_reference" text NOT NULL,
  "ledger_entry_id" text REFERENCES "credit_ledger_entry"("id"),
  "created_at" text NOT NULL,
  UNIQUE("challenge_id", "user_id", "event_reference")
);

CREATE INDEX IF NOT EXISTS "idx_credit_ledger_account_created" ON "credit_ledger_entry"("account_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_credit_reservation_account_status" ON "credit_reservation"("account_id", "status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_credit_consumption_account_created" ON "credit_consumption"("account_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_credit_package_active" ON "credit_package"("is_active", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_credit_order_user_status" ON "credit_order"("user_id", "status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_credit_pricing_active" ON "credit_pricing_rule"("feature_type", "target_id", "model", "is_active", "effective_from");
CREATE INDEX IF NOT EXISTS "idx_scanner_credit_run_user_status" ON "scanner_credit_run"("user_id", "status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_user_content_grant_lookup" ON "user_content_grant"("user_id", "content_type", "content_id", "expires_at");
CREATE INDEX IF NOT EXISTS "idx_consultation_booking_user_status" ON "consultation_booking"("user_id", "status", "created_at" DESC);
