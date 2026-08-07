import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../lib/api-helpers';
import { canAccessBook, canAccessResource } from '../../lib/entitlement-check';

export const prerender = false;

interface BookMediaAccess {
  is_free: number;
  is_premium: number;
  chapter_id: string;
}

async function canAccessBookMedia(key: string, userId?: string): Promise<boolean> {
  const block = await env.DB
    .prepare(
      `SELECT s."is_free", c."is_premium", c."id" AS chapter_id
       FROM "block" b
       JOIN "section" s ON s."id" = b."section_id"
       JOIN "chapter" c ON c."id" = s."chapter_id"
       WHERE b."r2_key" = ?
       LIMIT 1`,
    )
    .bind(key)
    .first<BookMediaAccess>();

  // Images/files attached to a free-preview section remain public even when
  // the surrounding chapter is premium. Only premium sections require access.
  // Files not attached to a book block remain public to preserve existing media behavior.
  if (!block || block.is_premium !== 1 || block.is_free === 1) return true;
  return !!userId && canAccessBook(env.DB, userId, block.chapter_id);
}

async function canAccessResourceMedia(key: string, userId?: string): Promise<boolean> {
  const resource = await env.DB
    .prepare('SELECT "id" FROM "resource" WHERE "file_url" = ? OR "file_url" = ? LIMIT 1')
    .bind(key, `/media/${key}`)
    .first<{ id: string }>();

  // A media key that is not assigned to a resource retains its existing access behavior.
  return !resource || canAccessResource(env.DB, userId, resource.id);
}

async function canAccessMedia(key: string, userId?: string): Promise<boolean> {
  const [hasBookAccess, hasResourceAccess] = await Promise.all([
    canAccessBookMedia(key, userId),
    canAccessResourceMedia(key, userId),
  ]);
  return hasBookAccess && hasResourceAccess;
}

// GET /media/[...key] — serve file from R2 with caching
export const HEAD: APIRoute = async ({ params, locals }) => {
  const key = params.key;
  if (!key) {
    return new Response(null, { status: 400 });
  }

  if (!(await canAccessMedia(key, locals.user?.id))) {
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

  if (!(await canAccessMedia(key, locals.user?.id))) {
    return json({ error: locals.user ? 'Bạn chưa có quyền truy cập tệp này' : 'Vui lòng đăng nhập để truy cập tệp này' }, locals.user ? 403 : 401);
  }

  const object = await env.MEDIA.get(key);

  if (!object) {
    return json({ error: 'File not found' }, 404);
  }

  const headers = new Headers();
  const ct = object.httpMetadata?.contentType ?? 'application/octet-stream';
  headers.set('Content-Type', ct);

  const filename = key.split('/').pop() || 'download';
  if (ct.startsWith('image/')) {
    // Images must remain inline so book figures can render in the reader.
    headers.set('Cache-Control', 'private, max-age=3600');
    headers.set('Content-Disposition', 'inline');
  } else {
    headers.set('Cache-Control', 'private, no-store');
    headers.set('Content-Disposition', object.httpMetadata?.contentDisposition || `attachment; filename="${filename}"`);
  }

  return new Response(object.body, { status: 200, headers });
};
