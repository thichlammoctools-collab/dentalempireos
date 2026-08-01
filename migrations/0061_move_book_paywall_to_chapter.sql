-- A chapter has one paywall. The selected root section is the last section
-- available in the free preview; all following root sections require access.
ALTER TABLE "chapter" ADD COLUMN "is_premium" integer NOT NULL DEFAULT 0;
ALTER TABLE "chapter" ADD COLUMN "free_until_section_id" text REFERENCES "section"("id") ON DELETE SET NULL;

-- Preserve the current paid/free intent while moving it from individual sections.
UPDATE "chapter"
SET "is_premium" = CASE WHEN EXISTS (
  SELECT 1 FROM "section" s
  WHERE s."chapter_id" = "chapter"."id" AND s."is_free" = 0
) THEN 1 ELSE 0 END;

-- Preserve the final free top-level section as the preview boundary.
UPDATE "chapter"
SET "free_until_section_id" = (
  SELECT s."id" FROM "section" s
  WHERE s."chapter_id" = "chapter"."id"
    AND s."parent_id" IS NULL
    AND s."is_free" = 1
  ORDER BY s."order" DESC
  LIMIT 1
)
WHERE "is_premium" = 1;

CREATE INDEX IF NOT EXISTS "idx_chapter_premium" ON "chapter" ("is_premium");
