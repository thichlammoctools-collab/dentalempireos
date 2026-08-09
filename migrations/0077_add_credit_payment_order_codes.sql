-- A PayOS orderCode must identify exactly one local payment record across
-- both legacy product orders and new Credit top-up orders.
CREATE TABLE IF NOT EXISTS "payment_order_code" (
  "order_code" integer NOT NULL PRIMARY KEY,
  "order_type" text NOT NULL CHECK("order_type" IN ('product','credit')),
  "order_id" text NOT NULL,
  "created_at" text NOT NULL,
  UNIQUE("order_type", "order_id")
);

INSERT OR IGNORE INTO "payment_order_code" ("order_code", "order_type", "order_id", "created_at")
SELECT "order_code", 'product', "id", "created_at" FROM "order";

ALTER TABLE "credit_order" ADD COLUMN "manual_confirmed_by_user_id" text REFERENCES "user"("id");
ALTER TABLE "credit_order" ADD COLUMN "manual_confirmed_at" text;

CREATE INDEX IF NOT EXISTS "idx_payment_order_code_type_id" ON "payment_order_code"("order_type", "order_id");
