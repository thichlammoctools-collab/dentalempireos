-- Migration 0014: Create payment tables for PayOS integration
-- Products: sellable items (course unlock, document unlock, booking, event tickets)
-- Orders: individual purchase transactions
-- Access: granted permissions after successful payment
-- payos_webhook_log: audit trail for PayOS webhook payloads

CREATE TABLE IF NOT EXISTS "product" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "type" text NOT NULL CHECK("type" IN ('course_unlock','document_unlock','booking','event_ticket')),
  "price" integer NOT NULL,
  "description" text,
  "duration_days" integer,
  "reference_id" text,
  "is_active" integer NOT NULL DEFAULT 1,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "order" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user" ("id"),
  "product_id" text NOT NULL REFERENCES "product" ("id"),
  "order_code" integer NOT NULL UNIQUE,
  "amount" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'pending' CHECK("status" IN ('pending','paid','cancelled','expired')),
  "payment_link_id" text,
  "checkout_url" text,
  "created_at" text NOT NULL,
  "paid_at" text,
  "expires_at" text
);

CREATE TABLE IF NOT EXISTS "access" (
  "id" text NOT NULL PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "user" ("id"),
  "product_id" text NOT NULL REFERENCES "product" ("id"),
  "order_id" text NOT NULL REFERENCES "order" ("id"),
  "granted_at" text NOT NULL,
  "expires_at" text,
  "is_active" integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "payos_webhook_log" (
  "id" integer PRIMARY KEY AUTOINCREMENT,
  "order_code" integer NOT NULL,
  "payload" text NOT NULL,
  "received_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_order_user" ON "order" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_order_status" ON "order" ("status");
CREATE INDEX IF NOT EXISTS "idx_order_code" ON "order" ("order_code");
CREATE INDEX IF NOT EXISTS "idx_access_user_product" ON "access" ("user_id", "product_id");
CREATE INDEX IF NOT EXISTS "idx_access_active" ON "access" ("is_active");
CREATE INDEX IF NOT EXISTS "idx_product_type" ON "product" ("type");
