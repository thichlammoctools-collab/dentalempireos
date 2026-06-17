-- Resources: downloadable assets (SOPs, checklists, Excel, marketing files)
-- Managed in admin, displayed on public /resources page.

CREATE TABLE IF NOT EXISTS "resource" (
  "id"          text NOT NULL PRIMARY KEY,   -- slug, e.g. "sop-checklist"
  "title"       text NOT NULL,
  "description" text DEFAULT '',
  "icon"        text DEFAULT 'description',
  "file_ext"    text DEFAULT 'pdf',          -- pdf|xlsx|docx|mp4
  "file_url"    text DEFAULT '',             -- R2 URL or external download link
  "category"    text DEFAULT 'sops',         -- sops|checklists|excel|marketing
  "tier"        text DEFAULT 'free',         -- free|premium
  "tag"         text DEFAULT '',             -- display tag (Vận hành, Tài chính...)
  "sort_order"  integer NOT NULL DEFAULT 0,
  "created_at"  text NOT NULL DEFAULT (datetime('now')),
  "updated_at"  text NOT NULL DEFAULT (datetime('now'))
);
