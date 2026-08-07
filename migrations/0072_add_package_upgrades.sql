-- Migration 0072: Support upgrading from a smaller package to a larger one.
-- An upgrade credits the unused value of the current package against the new
-- package price. The new package then starts a fresh term from payment time.

-- Orders remember their upgrade breakdown so payments stay auditable even when
-- product prices change afterwards.
ALTER TABLE "order" ADD COLUMN "order_kind" text NOT NULL DEFAULT 'purchase';
ALTER TABLE "order" ADD COLUMN "upgrade_from_product_id" text REFERENCES "product" ("id");
ALTER TABLE "order" ADD COLUMN "upgrade_from_access_id" text REFERENCES "access" ("id");
ALTER TABLE "order" ADD COLUMN "upgrade_original_amount" integer;
ALTER TABLE "order" ADD COLUMN "upgrade_credit_amount" integer;
ALTER TABLE "order" ADD COLUMN "upgrade_credit_days" integer;

-- One row per completed or in-flight upgrade, kept for history and support.
CREATE TABLE IF NOT EXISTS "upgrade" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user" ("id"),
  "order_id" text NOT NULL REFERENCES "order" ("id"),
  "from_product_id" text NOT NULL REFERENCES "product" ("id"),
  "to_product_id" text NOT NULL REFERENCES "product" ("id"),
  "from_access_id" text REFERENCES "access" ("id"),
  "to_access_id" text REFERENCES "access" ("id"),
  "credit_days" integer NOT NULL,
  "credit_amount" integer NOT NULL,
  "created_at" text NOT NULL
);

-- Delivering the same payment twice must not record a second upgrade.
CREATE UNIQUE INDEX IF NOT EXISTS "idx_upgrade_order" ON "upgrade" ("order_id");
CREATE INDEX IF NOT EXISTS "idx_upgrade_user" ON "upgrade" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_order_kind" ON "order" ("order_kind");
