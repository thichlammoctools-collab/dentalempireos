-- Multi-asset resource catalog with lifecycle and access controls.

ALTER TABLE "resource" ADD COLUMN "status" text NOT NULL DEFAULT 'published'
  CHECK ("status" IN ('draft', 'published', 'archived'));
ALTER TABLE "resource" ADD COLUMN "access_mode" text NOT NULL DEFAULT 'free'
  CHECK ("access_mode" IN ('free', 'credits'));
ALTER TABLE "resource" ADD COLUMN "published_at" text;
ALTER TABLE "resource" ADD COLUMN "created_by_user_id" text;
ALTER TABLE "resource" ADD COLUMN "updated_by_user_id" text;
ALTER TABLE "resource" ADD COLUMN "primary_asset_id" text;

-- Preserve legacy records: the pre-existing catalog was already public and used tier.
UPDATE "resource"
SET "access_mode" = CASE WHEN "tier" = 'premium' THEN 'credits' ELSE 'free' END,
    "published_at" = COALESCE("published_at", "created_at");

CREATE TABLE IF NOT EXISTS "resource_asset" (
  "id" text NOT NULL PRIMARY KEY,
  "resource_id" text NOT NULL REFERENCES "resource"("id") ON DELETE RESTRICT,
  "storage_key" text NOT NULL,
  "original_filename" text NOT NULL,
  "download_filename" text NOT NULL,
  "mime_type" text NOT NULL,
  "file_ext" text NOT NULL,
  "byte_size" integer,
  "sha256" text,
  "locale" text NOT NULL DEFAULT 'vi',
  "asset_role" text NOT NULL DEFAULT 'download' CHECK ("asset_role" IN ('download', 'preview')),
  "version" integer NOT NULL DEFAULT 1,
  "is_current" integer NOT NULL DEFAULT 1 CHECK ("is_current" IN (0, 1)),
  "created_by_user_id" text,
  "created_at" text NOT NULL DEFAULT (datetime('now')),
  "retired_at" text
);

CREATE INDEX IF NOT EXISTS "idx_resource_status_category" ON "resource"("status", "category", "sort_order");
CREATE INDEX IF NOT EXISTS "idx_resource_asset_resource_current" ON "resource_asset"("resource_id", "asset_role", "is_current", "version");
CREATE UNIQUE INDEX IF NOT EXISTS "idx_resource_asset_storage_key" ON "resource_asset"("storage_key");

-- Backfill legacy R2-backed resource links. External links remain legacy-only because
-- they cannot provide revocable access control.
INSERT OR IGNORE INTO "resource_asset" (
  "id", "resource_id", "storage_key", "original_filename", "download_filename",
  "mime_type", "file_ext", "asset_role", "version", "is_current", "created_at"
)
SELECT
  'legacy-' || "id",
  "id",
  CASE WHEN "file_url" LIKE '/media/%' THEN substr("file_url", 8) ELSE "file_url" END,
  "id" || '.' || "file_ext",
  "id" || '.' || "file_ext",
  CASE "file_ext"
    WHEN 'pdf' THEN 'application/pdf'
    WHEN 'xlsx' THEN 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    WHEN 'docx' THEN 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    WHEN 'mp4' THEN 'video/mp4'
    ELSE 'application/octet-stream'
  END,
  "file_ext", 'download', 1, 1, "created_at"
FROM "resource"
WHERE "file_url" <> ''
  AND "file_url" NOT LIKE 'http://%'
  AND "file_url" NOT LIKE 'https://%';

UPDATE "resource"
SET "primary_asset_id" = 'legacy-' || "id"
WHERE "primary_asset_id" IS NULL
  AND EXISTS (SELECT 1 FROM "resource_asset" a WHERE a."id" = 'legacy-' || "resource"."id");
