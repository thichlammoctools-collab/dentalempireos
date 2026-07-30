-- Migration 0058: Add book paywall support
-- 1. Add is_free column to section (0=premium, 1=free)
-- 2. Extend product type to support 'book_unlock'

-- 1. Add is_free to section
ALTER TABLE "section" ADD COLUMN "is_free" integer NOT NULL DEFAULT 0;

-- 2. Extend product type constraint (SQLite doesn't support ALTER CHECK)
CREATE TABLE IF NOT EXISTS "product_v3" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "type" text NOT NULL CHECK("type" IN (
    'course_unlock','document_unlock','booking','event_ticket',
    'survey_unlock','book_unlock'
  )),
  "price" integer NOT NULL,
  "description" text,
  "duration_days" integer,
  "reference_id" text,
  "is_active" integer NOT NULL DEFAULT 1,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

INSERT INTO "product_v3"
  ("id","name","type","price","description","duration_days","reference_id","is_active","created_at","updated_at")
SELECT "id","name","type","price","description","duration_days","reference_id","is_active","created_at","updated_at"
FROM "product";

DROP TABLE "product";
ALTER TABLE "product_v3" RENAME TO "product";

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_section_is_free" ON "section" ("is_free");
CREATE INDEX IF NOT EXISTS "idx_product_type_v3" ON "product" ("type");
