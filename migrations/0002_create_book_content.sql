-- Book content schema: chapter -> section (self-referencing) -> block
-- Replaces the static MDX content collection with structured D1 data
-- so content can be edited in admin, carry uploaded media, and later be
-- chunked for AI retrieval (RAG).

CREATE TABLE IF NOT EXISTS "chapter" (
  "id" text NOT NULL PRIMARY KEY,            -- slug, e.g. "24-to-be-sky"
  "tier" integer NOT NULL,
  "chapter_no" integer NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "order" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'draft',    -- 'draft' | 'published'
  "createdAt" text NOT NULL,
  "updatedAt" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "section" (                      -- heading: self-ref for main + sub
  "id" text NOT NULL PRIMARY KEY,
  "chapter_id" text NOT NULL REFERENCES "chapter" ("id") ON DELETE CASCADE,
  "parent_id" text REFERENCES "section" ("id") ON DELETE CASCADE,  -- NULL = main heading
  "level" integer NOT NULL,                   -- 2 = h2 (main), 3 = h3 (sub)
  "title" text NOT NULL,
  "slug" text NOT NULL,                        -- anchor for table of contents
  "order" integer NOT NULL
);

CREATE TABLE IF NOT EXISTS "block" (                         -- content unit inside a section
  "id" text NOT NULL PRIMARY KEY,
  "section_id" text NOT NULL REFERENCES "section" ("id") ON DELETE CASCADE,
  "order" integer NOT NULL,
  "type" text NOT NULL,                        -- 'text' | 'image' | 'file'
  "text_md" text,                              -- type=text: Markdown content
  "r2_key" text,                               -- type=image|file: key in R2
  "filename" text,                             -- original file name
  "mime" text,                                 -- content-type
  "alt" text,                                  -- image: alt text (AI-readable)
  "caption" text                               -- image/file: caption (AI-readable)
);

CREATE INDEX IF NOT EXISTS "idx_section_chapter" ON "section" ("chapter_id");
CREATE INDEX IF NOT EXISTS "idx_section_parent" ON "section" ("parent_id");
CREATE INDEX IF NOT EXISTS "idx_block_section" ON "block" ("section_id");

-- Prepared for RAG (phase 5, not used yet):
CREATE TABLE IF NOT EXISTS "content_chunk" (
  "id" text NOT NULL PRIMARY KEY,
  "chapter_id" text NOT NULL REFERENCES "chapter" ("id") ON DELETE CASCADE,
  "section_id" text REFERENCES "section" ("id") ON DELETE CASCADE,
  "heading_path" text,                         -- "Ch24 > TO BE SKY > Sincerity"
  "text" text NOT NULL,
  "vector_synced" integer NOT NULL DEFAULT 0,  -- pushed to Vectorize yet?
  "updatedAt" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_chunk_chapter" ON "content_chunk" ("chapter_id");
