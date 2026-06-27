import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { reorderBlocks } from '../../../../../lib/blog-db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as { post_id?: string; ordered_ids?: string[] };

    if (!body.post_id || !Array.isArray(body.ordered_ids)) {
      return new Response(JSON.stringify({ error: 'Thiếu post_id hoặc ordered_ids' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await reorderBlocks(env.DB, body.post_id, body.ordered_ids);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog blocks reorder error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
