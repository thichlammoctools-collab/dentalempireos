-- 0007: Create review table for reader feedback/ratings per chapter.

CREATE TABLE IF NOT EXISTS "review" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT,
  "chapter_id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL CHECK("rating" BETWEEN 1 AND 5),
  "title" TEXT,
  "content" TEXT NOT NULL,
  "author_name" TEXT,
  "status" TEXT NOT NULL DEFAULT 'published',
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_review_chapter" ON "review"("chapter_id");
CREATE INDEX IF NOT EXISTS "idx_review_chapter_status" ON "review"("chapter_id", "status");
CREATE INDEX IF NOT EXISTS "idx_review_status_created" ON "review"("status", "createdAt" DESC);
