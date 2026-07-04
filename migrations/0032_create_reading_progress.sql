CREATE TABLE IF NOT EXISTS "reading_progress" (
  "id"          TEXT PRIMARY KEY,
  "user_id"     TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "chapter_id"  TEXT NOT NULL REFERENCES "chapter"("id") ON DELETE CASCADE,
  "pct"         INTEGER NOT NULL DEFAULT 0,
  "max_pct"     INTEGER NOT NULL DEFAULT 0,
  "bookmarked"  INTEGER NOT NULL DEFAULT 0,
  "last_read_at" TEXT NOT NULL,
  "created_at"   TEXT NOT NULL,
  UNIQUE("user_id", "chapter_id")
);
CREATE INDEX IF NOT EXISTS "idx_rp_user" ON "reading_progress" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_rp_user_read" ON "reading_progress" ("user_id", "last_read_at" DESC);
