import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { setPostTags } from '../../../../lib/blog-db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { postId, tagIds } = body;

    if (!postId || !Array.isArray(tagIds)) {
      return new Response(JSON.stringify({ error: 'Thiếu postId hoặc tagIds' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await setPostTags(env.DB, postId, tagIds);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog tags error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
