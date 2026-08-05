-- Migration 0070: Make products generic access packages.
-- Product entitlements are the only product-to-content access configuration.

PRAGMA defer_foreign_keys = ON;

-- Recreate the table because SQLite cannot alter the existing type CHECK constraint.
-- Keep the row identifiers and all payment/access columns unchanged.
CREATE TABLE "product_v5" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "type" text NOT NULL CHECK("type" = 'access_package'),
  "price" integer NOT NULL,
  "description" text,
  "duration_days" integer,
  "reference_id" text,
  "app_id" text,
  "is_active" integer NOT NULL DEFAULT 1,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

INSERT INTO "product_v5"
  ("id","name","type","price","description","duration_days","reference_id","app_id","is_active","created_at","updated_at")
SELECT "id","name",'access_package',"price","description","duration_days","reference_id","app_id","is_active","created_at","updated_at"
FROM "product";

-- Stage entitlements before removing the old parent product table. The legacy
-- product_scanner foreign key cascades when that table is rebuilt.
CREATE TABLE "product_entitlement_v3" (
  "product_id" text NOT NULL REFERENCES "product_v5" ("id") ON DELETE CASCADE,
  "content_type" text NOT NULL CHECK("content_type" IN (
    'book','ai_app','scanner','course','blog','resource','service'
  )),
  "content_id" text NOT NULL,
  "created_at" text NOT NULL DEFAULT (datetime('now')),
  "updated_at" text NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("product_id", "content_type", "content_id")
);

INSERT INTO "product_entitlement_v3"
  ("product_id","content_type","content_id","created_at","updated_at")
SELECT "product_id","content_type","content_id","created_at","updated_at"
FROM "product_entitlement";

-- Preserve assignment time when a legacy scanner row was not already backfilled.
INSERT OR IGNORE INTO "product_entitlement_v3"
  ("product_id","content_type","content_id","created_at","updated_at")
SELECT "product_id",'scanner',"scanner_id","assigned_at","assigned_at"
FROM "product_scanner";

DROP TABLE "product_entitlement";
DROP TABLE "product";
ALTER TABLE "product_v5" RENAME TO "product";
ALTER TABLE "product_entitlement_v3" RENAME TO "product_entitlement";

-- The legacy mapping table is no longer part of the product access model.
DROP TABLE "product_scanner";

-- These indexes encoded the old product-type semantics and must not survive the
-- normalization. The entitlement indexes cover the supported lookup paths.
DROP INDEX IF EXISTS "idx_product_type";
DROP INDEX IF EXISTS "idx_product_type_new";
DROP INDEX IF EXISTS "idx_product_type_v3";
DROP INDEX IF EXISTS "idx_active_book_unlock";

CREATE INDEX IF NOT EXISTS "idx_product_app_id" ON "product" ("app_id");
CREATE INDEX IF NOT EXISTS "idx_product_entitlement_product"
  ON "product_entitlement" ("product_id");
CREATE INDEX IF NOT EXISTS "idx_product_entitlement_content"
  ON "product_entitlement" ("content_type", "content_id");

PRAGMA defer_foreign_keys = OFF;
