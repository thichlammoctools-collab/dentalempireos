-- Migration 0009: Create course tables
-- Courses: youtube video courses organized by course
-- Videos: individual youtube embeds within a course

CREATE TABLE IF NOT EXISTS "course" (
  "id" text NOT NULL PRIMARY KEY,
  "title" text NOT NULL,
  "description" text,
  "thumbnail_url" text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "is_published" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "course_video" (
  "id" text NOT NULL PRIMARY KEY,
  "course_id" text NOT NULL REFERENCES "course" ("id") ON DELETE CASCADE,
  "youtube_id" text NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "duration_seconds" integer,
  "is_published" integer NOT NULL DEFAULT 0,
  "created_at" text NOT NULL,
  "updated_at" text NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_course_sort" ON "course" ("sort_order");
CREATE INDEX IF NOT EXISTS "idx_course_video_course" ON "course_video" ("course_id");
CREATE INDEX IF NOT EXISTS "idx_course_video_sort" ON "course_video" ("sort_order");
