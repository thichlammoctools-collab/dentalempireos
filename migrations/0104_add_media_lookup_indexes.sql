-- /media/<key> resolves access on every book figure and resource download.
-- Both lookups are single-column equality probes against tables that hold the
-- entire corpus, so without these indexes D1 full-scans "block" (32 chapters
-- plus every text_md body) and "resource" for each request.
CREATE INDEX IF NOT EXISTS "idx_block_r2_key" ON "block" ("r2_key");
CREATE INDEX IF NOT EXISTS "idx_resource_file_url" ON "resource" ("file_url");
