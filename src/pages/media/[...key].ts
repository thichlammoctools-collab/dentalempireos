import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../lib/api-helpers';
import { hasAccess } from '../../lib/payos-db';

export const prerender = false;

interface BookMediaAccess {
  is_free: number;
  product_id: string | null;
}

async function canAccessBookMedia(key: string, userId?: string): Promise<boolean> {
  const block = await env.DB
    .prepare(
      `SELECT s."is_free", p."id" AS product_id
       FROM "block" b
       JOIN "section" s ON s."id" = b."section_id"
       LEFT JOIN "product" p
         ON p."type" = 'book_unlock'
        AND p."is_active" = 1
       WHERE b."r2_key" = ?
       LIMIT 1`,
    )
    .bind(key)
    .first<BookMediaAccess>();

  // Files not attached to a book block remain public to preserve existing media behavior.
  if (!block || block.is_free === 1) return true;
  return !!userId && !!block.product_id && hasAccess(env.DB, userId, block.product_id);
}

// GET /media/[...key] — serve file from R2 with caching
export const HEAD: APIRoute = async ({ params, locals }) => {
  const key = params.key;
  if (!key) {
    return new Response(null, { status: 400 });
  }

  if (!(await canAccessBookMedia(key, locals.user?.id))) {
    return new Response(null, { status: locals.user ? 403 : 401 });
  }

  const head = await env.MEDIA.head(key);
  if (!head) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Length', String(head.size));
  headers.set('Content-Type', head.httpMetadata?.contentType ?? 'application/octet-stream');
  headers.set('Cache-Control', 'private, no-store');
  return new Response(null, { status: 200, headers });
};

export const GET: APIRoute = async ({ params, locals }) => {
  const key = params.key;
  if (!key) {
    return json({ error: 'Missing key' }, 400);
  }

  if (!(await canAccessBookMedia(key, locals.user?.id))) {
    return json({ error: locals.user ? 'Bạn chưa có quyền truy cập tệp này' : 'Vui lòng đăng nhập để truy cập tệp này' }, locals.user ? 403 : 401);
  }

  const object = await env.MEDIA.get(key);

  if (!object) {
    return json({ error: 'File not found' }, 404);
  }

  const headers = new Headers();
  headers.set('Cache-Control', 'private, no-store');

  const ct = object.httpMetadata?.contentType ?? 'application/octet-stream';
  headers.set('Content-Type', ct);

  const filename = key.split('/').pop() || 'download';
  const cd = object.httpMetadata?.contentDisposition;
  headers.set('Content-Disposition', cd || `attachment; filename="${filename}"`);

  return new Response(object.body, { status: 200, headers });
};
