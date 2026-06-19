import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { upsertBlock, deleteBlock } from '../../../../../lib/blog-db';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Thiếu id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    if (!body.post_id || !body.type || !['text', 'image', 'form'].includes(body.type)) {
      return new Response(JSON.stringify({ error: 'Thiếu hoặc sai post_id / type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await upsertBlock(env.DB, {
      id,
      post_id: body.post_id,
      type: body.type,
      content: body.content ?? '',
      sort_order: body.sort_order ?? 0,
    });

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog block PUT error:', err);
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

    await deleteBlock(env.DB, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog block DELETE error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
