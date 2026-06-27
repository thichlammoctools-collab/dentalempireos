import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as { post_id?: string; fields?: Record<string, unknown> };
    const { post_id, fields } = body;

    if (!post_id) {
      return new Response(JSON.stringify({ error: 'Thiếu post_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store form submission
    const id = crypto.randomUUID();
    const ts = new Date().toISOString();
    const fieldsJson = JSON.stringify(fields ?? {});

    await env.DB
      .prepare(
        `INSERT INTO "form_submission" ("id","post_id","fields","status","created_at")
         VALUES (?,?,?,?,?)`,
      )
      .bind(id, post_id, fieldsJson, 'new', ts)
      .run();

    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Blog form submission error:', err);
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
