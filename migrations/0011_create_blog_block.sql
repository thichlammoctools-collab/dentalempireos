-- Blog content blocks: text, image, form — ordered per post
CREATE TABLE IF NOT EXISTS "blog_block" (
  "id"         text NOT NULL PRIMARY KEY,
  "post_id"    text NOT NULL REFERENCES "blog_post" ("id") ON DELETE CASCADE,
  "type"       text NOT NULL DEFAULT 'text',  -- 'text' | 'image' | 'form'
  "content"    text NOT NULL DEFAULT '',       -- markdown for text, URL for image, JSON config for form
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_blog_block_post"    ON "blog_block" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_blog_block_order"  ON "blog_block" ("post_id", "sort_order");

-- Form submissions from blog post blocks
CREATE TABLE IF NOT EXISTS "form_submission" (
  "id"         text NOT NULL PRIMARY KEY,
  "post_id"    text NOT NULL REFERENCES "blog_post" ("id") ON DELETE CASCADE,
  "fields"     text NOT NULL DEFAULT '{}',
  "status"     text NOT NULL DEFAULT 'new',
  "created_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_form_sub_post"   ON "form_submission" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_form_sub_status" ON "form_submission" ("status");
