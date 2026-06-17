-- Questions & Replies & Notifications
-- Supports "Ask the Author" feature in book reader.

-- Bảng câu hỏi: 1 thread = 1 câu hỏi + nhiều reply
CREATE TABLE IF NOT EXISTS "question" (
  "id"          text NOT NULL PRIMARY KEY,   -- nanoid
  "user_id"     text NOT NULL REFERENCES "user"("id"),
  "chapter_id"  text NOT NULL REFERENCES "chapter"("id"),
  "section_id"  text,                        -- section đang đọc (nullable)
  "title"       text NOT NULL,               -- tiêu đề/tóm tắt câu hỏi
  "body"        text NOT NULL,               -- nội dung chi tiết (markdown)
  "status"      text NOT NULL DEFAULT 'open', -- open | answered | closed
  "createdAt"   text NOT NULL,
  "updatedAt"   text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_question_user"    ON "question" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_question_chapter" ON "question" ("chapter_id");
CREATE INDEX IF NOT EXISTS "idx_question_status"  ON "question" ("status");

-- Bảng replies (cả user và admin đều reply được)
CREATE TABLE IF NOT EXISTS "question_reply" (
  "id"          text NOT NULL PRIMARY KEY,   -- nanoid
  "question_id" text NOT NULL REFERENCES "question"("id") ON DELETE CASCADE,
  "user_id"     text NOT NULL REFERENCES "user"("id"),
  "body"        text NOT NULL,               -- markdown content
  "is_admin"    integer NOT NULL DEFAULT 0,  -- 1 = reply từ admin
  "createdAt"   text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_reply_question" ON "question_reply" ("question_id");

-- Bảng thông báo in-app
CREATE TABLE IF NOT EXISTS "notification" (
  "id"          text NOT NULL PRIMARY KEY,   -- nanoid
  "user_id"     text NOT NULL REFERENCES "user"("id"),
  "type"        text NOT NULL,               -- 'question_reply' | 'question_answered'
  "title"       text NOT NULL,
  "body"        text NOT NULL,
  "link"        text NOT NULL DEFAULT '',    -- URL to navigate on click
  "read"        integer NOT NULL DEFAULT 0,  -- 0 = unread, 1 = read
  "createdAt"   text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_notification_user" ON "notification" ("user_id");
