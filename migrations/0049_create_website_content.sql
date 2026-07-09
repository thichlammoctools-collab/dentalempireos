-- website_content: indexed content from books, blog, and resources for AI chat.
-- Content is synced at build-time via the sync-website-content admin endpoint.

CREATE TABLE IF NOT EXISTS "website_content" (
  "id"          TEXT NOT NULL PRIMARY KEY,
  "content_type" TEXT NOT NULL CHECK ("content_type" IN ('book', 'blog', 'resource')),
  -- For book: chapter_id from the chapter table
  -- For blog: post_id from the blog_post table
  -- For resource: id from the resource table
  "source_id"   TEXT NOT NULL,
  "source_slug" TEXT,
  "title"       TEXT NOT NULL,
  "heading_path" TEXT,
  "content"     TEXT NOT NULL,
  "url"         TEXT NOT NULL,
  "chunk_order"  INTEGER NOT NULL DEFAULT 0,
  "vector_id"   TEXT,
  "vector_synced" INTEGER NOT NULL DEFAULT 0,
  "createdAt"  TEXT NOT NULL DEFAULT (datetime('now')),
  "updatedAt"  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_wc_content_type" ON "website_content" ("content_type");
CREATE INDEX IF NOT EXISTS "idx_wc_source"      ON "website_content" ("content_type", "source_id");
CREATE INDEX IF NOT EXISTS "idx_wc_source_slug"  ON "website_content" ("source_slug");
CREATE INDEX IF NOT EXISTS "idx_wc_vector_synced" ON "website_content" ("vector_synced");
