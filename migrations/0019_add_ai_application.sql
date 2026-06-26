-- Migration 0019: Add ai_application registry and link products to apps.
-- Creates ai_application table for AI-powered apps.
-- Adds app_id to product table for linking.
-- Deletes the hardcoded survey-rootsgoc-1 seed product (admin will recreate via UI).

CREATE TABLE IF NOT EXISTS "ai_application" (
  "id"          text NOT NULL PRIMARY KEY,
  "slug"        text NOT NULL UNIQUE,
  "name"        text NOT NULL,
  "description" text,
  "type"        text NOT NULL CHECK("type" IN (
    'survey','ebook_ai','course_ai','tool','generator'
  )),
  "status"      text NOT NULL DEFAULT 'draft'
                CHECK("status" IN ('draft','active','archived')),
  "is_free"     integer NOT NULL DEFAULT 0,
  "config_json" text,
  "created_at"  text NOT NULL DEFAULT (datetime('now')),
  "updated_at"  text NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_app_type" ON "ai_application" ("type");
CREATE INDEX IF NOT EXISTS "idx_app_status" ON "ai_application" ("status");
CREATE INDEX IF NOT EXISTS "idx_app_slug" ON "ai_application" ("slug");

-- Add app_id column to product (nullable, no FK constraint for D1 compatibility)
-- NOTE: D1 doesn't support "ALTER TABLE ADD COLUMN IF NOT EXISTS".
-- If this migration is applied twice, the ALTER will fail. Use `wrangler d1 migrations apply` which tracks applied migrations.
ALTER TABLE "product" ADD COLUMN "app_id" text;

CREATE INDEX IF NOT EXISTS "idx_product_app_id" ON "product" ("app_id");

-- Seed the survey app (product will be created by admin via UI)
INSERT OR IGNORE INTO "ai_application"
  ("id","slug","name","description","type","status","is_free","config_json","created_at","updated_at")
VALUES (
  'survey-rootsgoc-1-app',
  'ho-so-goc-re',
  'Hồ Sơ Gốc Rễ',
  'Khảo sát tự đánh giá + phân tích AI 9 phần theo framework ROOTS, SKY, S.T.A.R.S.',
  'survey',
  'active',
  0,
  NULL,
  datetime('now'),
  datetime('now')
);

-- Deactivate the old hardcoded survey product (keep it, don't delete).
-- User đã thanh toán vẫn giữ quyền vì access rows vẫn nguyên.
-- Admin có thể bật lại hoặc edit từ UI mới.
UPDATE "product" SET "is_active" = 0, "app_id" = 'survey-rootsgoc-1-app'
WHERE "id" = 'survey-rootsgoc-1';
