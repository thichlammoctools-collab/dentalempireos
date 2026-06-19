import type { D1Database } from '@cloudflare/workers-types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_published: number;
  created_at: string;
  updated_at: string;
}

export interface CourseVideo {
  id: string;
  course_id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  duration_seconds: number | null;
  is_published: number;
  created_at: string;
  updated_at: string;
}

export interface CourseWithVideoCount extends Course {
  video_count: number;
}

export interface CourseInput {
  id?: string;
  title: string;
  description?: string | null;
  thumbnail_url?: string | null;
  sort_order?: number;
  is_published?: number;
}

export interface CourseVideoInput {
  id?: string;
  course_id: string;
  youtube_id: string;
  title: string;
  description?: string | null;
  sort_order?: number;
  duration_seconds?: number | null;
  is_published?: number;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

function nanoid(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
}

// ─── Course CRUD ──────────────────────────────────────────────────────────────

export async function getCourse(db: D1Database, id: string): Promise<Course | null> {
  const result = await db
    .prepare('SELECT * FROM "course" WHERE "id" = ?')
    .bind(id)
    .first<Course>();
  return result ?? null;
}

export async function listCourses(
  db: D1Database,
  opts: { publishedOnly?: boolean } = {},
): Promise<CourseWithVideoCount[]> {
  const { publishedOnly = false } = opts;
  const whereClause = publishedOnly ? 'WHERE c."is_published" = 1' : '';

  return db
    .prepare(`
      SELECT c.*, COUNT(cv.id) AS video_count
      FROM "course" c
      LEFT JOIN "course_video" cv ON cv."course_id" = c."id" AND cv."is_published" = 1
      ${whereClause}
      GROUP BY c."id"
      ORDER BY c."sort_order" ASC, c."created_at" ASC
    `)
    .all<CourseWithVideoCount>()
    .then((r) => r.results);
}

export async function upsertCourse(
  db: D1Database,
  input: CourseInput,
): Promise<Course> {
  const id = input.id ?? nanoid();
  const timestamp = now();

  await db
    .prepare(`
      INSERT INTO "course" ("id", "title", "description", "thumbnail_url", "sort_order", "is_published", "created_at", "updated_at")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT("id") DO UPDATE SET
        "title" = excluded."title",
        "description" = excluded."description",
        "thumbnail_url" = excluded."thumbnail_url",
        "sort_order" = excluded."sort_order",
        "is_published" = excluded."is_published",
        "updated_at" = excluded."updated_at"
    `)
    .bind(
      id,
      input.title,
      input.description ?? null,
      input.thumbnail_url ?? null,
      input.sort_order ?? 0,
      input.is_published ?? 0,
      input.id ? (await getCourse(db, id))?.created_at ?? timestamp : timestamp,
      timestamp,
    )
    .run();

  return (await getCourse(db, id))!;
}

export async function deleteCourse(db: D1Database, id: string): Promise<void> {
  await db
    .prepare('DELETE FROM "course" WHERE "id" = ?')
    .bind(id)
    .run();
}

// ─── Video CRUD ────────────────────────────────────────────────────────────────

export async function getCourseVideo(
  db: D1Database,
  id: string,
): Promise<CourseVideo | null> {
  const result = await db
    .prepare('SELECT * FROM "course_video" WHERE "id" = ?')
    .bind(id)
    .first<CourseVideo>();
  return result ?? null;
}

export async function getCourseVideos(
  db: D1Database,
  courseId: string,
  opts: { publishedOnly?: boolean } = {},
): Promise<CourseVideo[]> {
  const { publishedOnly = false } = opts;
  const whereClause = publishedOnly
    ? 'AND "is_published" = 1'
    : '';

  return db
    .prepare(`
      SELECT * FROM "course_video"
      WHERE "course_id" = ?
      ${whereClause}
      ORDER BY "sort_order" ASC, "created_at" ASC
    `)
    .bind(courseId)
    .all<CourseVideo>()
    .then((r) => r.results);
}

export async function upsertCourseVideo(
  db: D1Database,
  input: CourseVideoInput,
): Promise<CourseVideo> {
  const id = input.id ?? nanoid();
  const timestamp = now();

  await db
    .prepare(`
      INSERT INTO "course_video" ("id", "course_id", "youtube_id", "title", "description", "sort_order", "duration_seconds", "is_published", "created_at", "updated_at")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT("id") DO UPDATE SET
        "youtube_id" = excluded."youtube_id",
        "title" = excluded."title",
        "description" = excluded."description",
        "sort_order" = excluded."sort_order",
        "duration_seconds" = excluded."duration_seconds",
        "is_published" = excluded."is_published",
        "updated_at" = excluded."updated_at"
    `)
    .bind(
      id,
      input.course_id,
      input.youtube_id,
      input.title,
      input.description ?? null,
      input.sort_order ?? 0,
      input.duration_seconds ?? null,
      input.is_published ?? 0,
      input.id ? (await getCourseVideo(db, id))?.created_at ?? timestamp : timestamp,
      timestamp,
    )
    .run();

  return (await getCourseVideo(db, id))!;
}

export async function deleteCourseVideo(
  db: D1Database,
  id: string,
): Promise<void> {
  await db
    .prepare('DELETE FROM "course_video" WHERE "id" = ?')
    .bind(id)
    .run();
}
