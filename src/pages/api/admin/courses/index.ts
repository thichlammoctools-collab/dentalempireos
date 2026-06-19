import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { listCourses, upsertCourse } from '../../../../lib/course-db';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const courses = await listCourses(env.DB);
    return new Response(JSON.stringify(courses), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Courses GET error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.id || !body.title) {
      return new Response(JSON.stringify({ error: 'Thiếu trường bắt buộc: id, title' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const course = await upsertCourse(env.DB, {
      id: body.id,
      title: body.title,
      description: body.description ?? null,
      thumbnail_url: body.thumbnail_url ?? null,
      sort_order: body.sort_order ?? 0,
      is_published: body.is_published ?? 0,
    });

    return new Response(JSON.stringify({ success: true, course }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Courses POST error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
