-- Blog content schema: post -> category, post <-> tag, read tracking

CREATE TABLE IF NOT EXISTS "blog_category" (
  "id"          text NOT NULL PRIMARY KEY,
  "name"        text NOT NULL,
  "slug"        text NOT NULL UNIQUE,
  "description" text NOT NULL DEFAULT '',
  "icon"        text NOT NULL DEFAULT 'folder',
  "color"       text NOT NULL DEFAULT '#0d9488',
  "sort_order"  integer NOT NULL DEFAULT 0,
  "post_count"  integer NOT NULL DEFAULT 0,
  "created_at"  text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_cat_slug"      ON "blog_category" ("slug");
CREATE INDEX IF NOT EXISTS "idx_cat_sort_order" ON "blog_category" ("sort_order");

CREATE TABLE IF NOT EXISTS "blog_tag" (
  "id"         text NOT NULL PRIMARY KEY,
  "name"       text NOT NULL,
  "slug"       text NOT NULL UNIQUE,
  "post_count" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_tag_slug" ON "blog_tag" ("slug");

CREATE TABLE IF NOT EXISTS "blog_post" (
  "id"               text NOT NULL PRIMARY KEY,
  "title"            text NOT NULL,
  "slug"             text NOT NULL UNIQUE,
  "description"      text NOT NULL DEFAULT '',
  "content_md"       text NOT NULL DEFAULT '',
  "cover_url"        text NOT NULL DEFAULT '',
  "cover_alt"        text NOT NULL DEFAULT '',
  "category_id"      text REFERENCES "blog_category" ("id") ON DELETE SET NULL,
  "author_name"      text NOT NULL DEFAULT 'Dental Empire',
  "status"           text NOT NULL DEFAULT 'draft',
  "is_featured"      integer NOT NULL DEFAULT 0,
  "is_pinned"        integer NOT NULL DEFAULT 0,
  "is_recommended"   integer NOT NULL DEFAULT 0,
  "read_time_minutes" integer NOT NULL DEFAULT 3,
  "view_count"       integer NOT NULL DEFAULT 0,
  "published_at"     text,
  "created_at"       text NOT NULL,
  "updated_at"       text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_blog_slug"       ON "blog_post" ("slug");
CREATE INDEX IF NOT EXISTS "idx_blog_category"  ON "blog_post" ("category_id");
CREATE INDEX IF NOT EXISTS "idx_blog_status"     ON "blog_post" ("status");
CREATE INDEX IF NOT EXISTS "idx_blog_published"  ON "blog_post" ("published_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_blog_featured"  ON "blog_post" ("is_featured");
CREATE INDEX IF NOT EXISTS "idx_blog_pinned"    ON "blog_post" ("is_pinned");
CREATE INDEX IF NOT EXISTS "idx_blog_view_count" ON "blog_post" ("view_count" DESC);
CREATE INDEX IF NOT EXISTS "idx_blog_updated"   ON "blog_post" ("updated_at" DESC);

CREATE TABLE IF NOT EXISTS "blog_post_tag" (
  "post_id" text NOT NULL REFERENCES "blog_post" ("id") ON DELETE CASCADE,
  "tag_id"  text NOT NULL REFERENCES "blog_tag" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("post_id", "tag_id")
);

CREATE INDEX IF NOT EXISTS "idx_pt_post" ON "blog_post_tag" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_pt_tag"  ON "blog_post_tag" ("tag_id");

CREATE TABLE IF NOT EXISTS "blog_read_log" (
  "id"         text NOT NULL PRIMARY KEY,
  "post_id"    text NOT NULL REFERENCES "blog_post" ("id") ON DELETE CASCADE,
  "visitor_id" text NOT NULL,
  "read_at"    text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_read_post"    ON "blog_read_log" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_read_visitor" ON "blog_read_log" ("visitor_id");
