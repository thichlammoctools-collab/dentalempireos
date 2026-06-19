import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  try {
    const db = env.DB;

    // Test homepage_settings
    const homeRow = await db.prepare('SELECT id FROM "homepage_settings" WHERE "id" = 1').first();
    if (!homeRow) return new Response(JSON.stringify({ error: 'No homepage_settings row' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // Test support_settings
    const supportRow = await db.prepare('SELECT id FROM "support_settings" WHERE "id" = 1').first();
    if (!supportRow) return new Response(JSON.stringify({ error: 'No support_settings row' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // Test listPublishedChapters (book-db)
    const chapters = await db.prepare('SELECT id, title FROM "chapter" WHERE "is_published" = 1 LIMIT 3').all();
    if (!chapters) return new Response(JSON.stringify({ error: 'No chapters' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // Test course query
    const courses = await db.prepare('SELECT id, title FROM "course" WHERE "is_published" = 1 LIMIT 3').all();

    return new Response(JSON.stringify({
      ok: true,
      homepage: homeRow,
      support: supportRow,
      chapters: chapters.results,
      courses: courses.results,
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
