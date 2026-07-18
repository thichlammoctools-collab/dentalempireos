-- Bảng lưu lịch sử hội thoại AI Chat công khai (website-wide chat).
-- Tách biệt với ai_mentor_session (dùng cho AI Mentor app trả phí).
-- user_id nullable để hỗ trợ cả anonymous users.

CREATE TABLE IF NOT EXISTS "website_chat_session" (
  "id"               TEXT PRIMARY KEY,
  "user_id"          TEXT REFERENCES "user"("id") ON DELETE CASCADE,
  "title"            TEXT,
  "messages"         TEXT NOT NULL DEFAULT '[]',  -- JSON: [{role, content, created_at}]
  "context_chunk_ids" TEXT,                        -- JSON: [chunk_id, ...] từ RAG call cuối
  "page_type"        TEXT,                         -- 'book' | 'blog' | 'resource' | 'home'
  "page_slug"        TEXT,
  "created_at"       TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at"       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_website_chat_user"    ON "website_chat_session"("user_id");
CREATE INDEX IF NOT EXISTS "idx_website_chat_updated" ON "website_chat_session"("updated_at" DESC);
