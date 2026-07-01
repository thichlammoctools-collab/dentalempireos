-- Newsletter subscriber table for blog email capture
CREATE TABLE IF NOT EXISTS "newsletter_subscriber" (
  "id"           TEXT PRIMARY KEY,
  "email"        TEXT NOT NULL UNIQUE,
  "source"       TEXT NOT NULL DEFAULT 'blog',
  "post_slug"    TEXT,
  "ip_hash"      TEXT,
  "status"       TEXT NOT NULL DEFAULT 'active',  -- active | unsubscribed
  "created_at"   TEXT NOT NULL,
  "unsubscribed_at" TEXT
);

CREATE INDEX IF NOT EXISTS "idx_newsletter_subscriber_email"
  ON "newsletter_subscriber" ("email");

CREATE INDEX IF NOT EXISTS "newsletter_subscriber_source_idx"
  ON "newsletter_subscriber" ("source");

CREATE INDEX IF NOT EXISTS "newsletter_subscriber_created_at_idx"
  ON "newsletter_subscriber" ("created_at");
