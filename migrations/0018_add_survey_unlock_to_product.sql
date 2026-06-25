-- Extend product type to support survey_unlock
-- SQLite doesn't support ALTER CHECK, so we recreate the table with the new constraint.
-- This is safe because product table is likely small.

CREATE TABLE IF NOT EXISTS "product_v2" (
  "id" text NOT NULL PRIMARY KEY,
  "name" text NOT NULL,
  "type" text NOT NULL CHECK("type" IN ('course_unlock','document_unlock','booking','event_ticket','survey_unlock')),
  "price" integer NOT NULL,
  "description" text,
  "duration_days" integer,
  "reference_id" text,
  "is_active" integer NOT NULL DEFAULT 1,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

INSERT INTO "product_v2"
  ("id","name","type","price","description","duration_days","reference_id","is_active","created_at","updated_at")
SELECT "id","name","type","price","description","duration_days","reference_id","is_active","created_at","updated_at"
FROM "product";

DROP TABLE "product";
ALTER TABLE "product_v2" RENAME TO "product";

-- Index
CREATE INDEX IF NOT EXISTS "idx_product_type_new" ON "product" ("type");

-- Seed a default survey unlock product
INSERT OR IGNORE INTO "product" ("id","name","type","price","description","duration_days","reference_id","is_active","created_at","updated_at")
VALUES (
  'survey-rootsgoc-1',
  'Hồ Sơ Gốc Rễ — Phân tích AI & PDF',
  'survey_unlock',
  199000,
  'Mở khóa bản phân tích AI chi tiết và file PDF của Hồ Sơ Gốc Rễ. Bao gồm 9 phần phân tích theo framework ROOTS, SKY, S.T.A.R.S.',
  NULL,
  NULL,
  1,
  datetime('now'),
  datetime('now')
);
