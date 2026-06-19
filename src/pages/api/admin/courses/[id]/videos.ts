import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getCourseVideos, upsertCourseVideo } from '../../../../../lib/course-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu course id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const videos = await getCourseVideos(env.DB, id);
    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Videos GET error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu course id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();

    if (!body.youtube_id || !body.title) {
      return new Response(JSON.stringify({ error: 'Thiếu trường bắt buộc: youtube_id, title' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const video = await upsertCourseVideo(env.DB, {
      id: body.id,
      course_id: id,
      youtube_id: body.youtube_id,
      title: body.title,
      description: body.description ?? null,
      sort_order: body.sort_order ?? 0,
      duration_seconds: body.duration_seconds ?? null,
      is_published: body.is_published ?? 0,
    });

    return new Response(JSON.stringify({ success: true, video }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Videos POST error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
