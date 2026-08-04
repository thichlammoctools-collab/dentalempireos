-- Migration 0067: Normalize product-to-content entitlements.
-- Keep existing product data and relationships while allowing service programs.

PRAGMA foreign_keys = OFF;

CREATE TABLE "product_v4" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "type" text NOT NULL CHECK("type" IN (
    'course_unlock','document_unlock','booking','event_ticket',
    'survey_unlock','book_unlock','service_program'
  )),
  "price" integer NOT NULL,
  "description" text,
  "duration_days" integer,
  "reference_id" text,
  "app_id" text,
  "is_active" integer NOT NULL DEFAULT 1,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

INSERT INTO "product_v4"
  ("id","name","type","price","description","duration_days","reference_id","app_id","is_active","created_at","updated_at")
SELECT "id","name","type","price","description","duration_days","reference_id","app_id","is_active","created_at","updated_at"
FROM "product";

DROP TABLE "product";
ALTER TABLE "product_v4" RENAME TO "product";

CREATE INDEX IF NOT EXISTS "idx_product_type" ON "product" ("type");
CREATE INDEX IF NOT EXISTS "idx_product_type_new" ON "product" ("type");
CREATE INDEX IF NOT EXISTS "idx_product_type_v3" ON "product" ("type");
CREATE INDEX IF NOT EXISTS "idx_product_app_id" ON "product" ("app_id");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_active_book_unlock"
  ON "product" ("type")
  WHERE "type" = 'book_unlock' AND "is_active" = 1;

PRAGMA foreign_keys = ON;

ALTER TABLE "course" ADD COLUMN "access_tier" text NOT NULL DEFAULT 'free'
  CHECK("access_tier" IN ('free','premium'));
CREATE INDEX IF NOT EXISTS "idx_course_access_tier" ON "course" ("access_tier");

ALTER TABLE "blog_post" ADD COLUMN "access_tier" text NOT NULL DEFAULT 'free'
  CHECK("access_tier" IN ('free','premium'));
CREATE INDEX IF NOT EXISTS "idx_blog_access_tier" ON "blog_post" ("access_tier");

CREATE TABLE IF NOT EXISTS "product_entitlement" (
  "product_id" text NOT NULL REFERENCES "product" ("id") ON DELETE CASCADE,
  "content_type" text NOT NULL CHECK("content_type" IN (
    'book','ai_app','scanner','course','blog','resource'
  )),
  "content_id" text NOT NULL,
  "created_at" text NOT NULL DEFAULT (datetime('now')),
  "updated_at" text NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY ("product_id", "content_type", "content_id")
);

CREATE INDEX IF NOT EXISTS "idx_product_entitlement_content"
  ON "product_entitlement" ("content_type", "content_id");
CREATE INDEX IF NOT EXISTS "idx_product_entitlement_product"
  ON "product_entitlement" ("product_id");

-- Existing products retain their previous content relationships.
INSERT OR IGNORE INTO "product_entitlement" ("product_id","content_type","content_id")
SELECT "id", 'book', '*'
FROM "product"
WHERE "type" = 'book_unlock';

INSERT OR IGNORE INTO "product_entitlement" ("product_id","content_type","content_id")
SELECT "id", 'ai_app', "app_id"
FROM "product"
WHERE "app_id" IS NOT NULL AND "app_id" <> '';

INSERT OR IGNORE INTO "product_entitlement" ("product_id","content_type","content_id")
SELECT "product_id", 'scanner', "scanner_id"
FROM "product_scanner";

INSERT OR IGNORE INTO "product_entitlement" ("product_id","content_type","content_id")
SELECT "id", 'course', "reference_id"
FROM "product"
WHERE "type" = 'course_unlock'
  AND "reference_id" IS NOT NULL AND "reference_id" <> '';

INSERT OR IGNORE INTO "product_entitlement" ("product_id","content_type","content_id")
SELECT "id", 'resource', "reference_id"
FROM "product"
WHERE "type" = 'document_unlock'
  AND "reference_id" IS NOT NULL AND "reference_id" <> '';
