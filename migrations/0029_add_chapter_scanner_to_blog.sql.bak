-- Add linking fields to blog_post for ebook chapter + scanner/test assignment

ALTER TABLE "blog_post"
  ADD COLUMN "chapter_id" TEXT
    REFERENCES "chapter"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;

ALTER TABLE "blog_post"
  ADD COLUMN "scanner_id" TEXT
    REFERENCES "survey_definition"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "idx_blog_chapter" ON "blog_post"("chapter_id");
CREATE INDEX IF NOT EXISTS "idx_blog_scanner" ON "blog_post"("scanner_id");
