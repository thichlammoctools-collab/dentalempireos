-- AI Mentor multi-session storage for streaming + multi-turn conversations.

CREATE TABLE IF NOT EXISTS "ai_mentor_session" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "title" TEXT,
  "messages" TEXT NOT NULL DEFAULT '[]',  -- JSON: [{role, content, image_url?, created_at}]
  "context_chunk_ids" TEXT,               -- JSON: [chunk_id, ...] from last RAG call
  "model_id" TEXT,
  "created_at" TEXT NOT NULL DEFAULT (datetime('now')),
  "updated_at" TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS "idx_session_user" ON "ai_mentor_session"("user_id");
CREATE INDEX IF NOT EXISTS "idx_session_updated" ON "ai_mentor_session"("updated_at" DESC);
