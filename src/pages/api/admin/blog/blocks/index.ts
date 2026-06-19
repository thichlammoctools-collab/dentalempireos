import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { upsertBlocks, getBlocksByPostId } from '../../../../../lib/blog-db';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  try {
    const postId = url.searchParams.get('post_id');
    if (!postId) {
      return new Response(JSON.stringify({ error: 'Thiếu post_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const blocks = await getBlocksByPostId(env.DB, postId);
    return new Response(JSON.stringify({ blocks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog blocks GET error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.post_id || !Array.isArray(body.blocks)) {
      return new Response(JSON.stringify({ error: 'Thiếu post_id hoặc blocks' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blocks = body.blocks.map((b: { id?: string; type: string; content?: string; sort_order?: number }, i: number) => ({
      id: b.id || crypto.randomUUID(),
      type: b.type,
      content: b.content ?? '',
      sort_order: b.sort_order ?? i,
    }));

    await upsertBlocks(env.DB, body.post_id, blocks);

    return new Response(JSON.stringify({ success: true, count: blocks.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog blocks POST error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
