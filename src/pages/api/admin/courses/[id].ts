import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getCourse, upsertCourse, deleteCourse } from '../../../../lib/course-db';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const course = await getCourse(env.DB, id);
    if (!course) {
      return new Response(JSON.stringify({ error: 'Không tìm thấy' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Course GET error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = (await request.json()) as {
      title?: string;
      description?: string | null;
      thumbnail_url?: string | null;
      sort_order?: number;
      is_published?: number;
    };

    if (!body.title) {
      return new Response(JSON.stringify({ error: 'Thiếu title' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const course = await upsertCourse(env.DB, {
      id,
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
    console.error('Course PUT error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await deleteCourse(env.DB, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Course DELETE error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
