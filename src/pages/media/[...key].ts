import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../lib/api-helpers';
import { canAccessBook, canAccessResource } from '../../lib/entitlement-check';
import { getResourceAssetByStorageKey } from '../../lib/resource-db';

export const prerender = false;

interface BookMediaAccess {
  is_premium: number;
  chapter_id: string;
}


async function canAccessBookMedia(key: string, userId?: string): Promise<boolean | null> {
  const block = await env.DB
    .prepare(
      `SELECT c."is_premium", c."id" AS chapter_id
       FROM "block" b
       JOIN "section" s ON s."id" = b."section_id"
       JOIN "chapter" c ON c."id" = s."chapter_id"
       WHERE b."r2_key" = ?
       LIMIT 1`,
    )
    .bind(key)
    .first<BookMediaAccess>();

  // Null means this key is not book media. Free chapters and every block within
  // them are public; premium chapter media follows the existing member policy.
  if (!block) return null;
  return canAccessBook(env.DB, userId, block.chapter_id);
}

async function canAccessResourceMedia(key: string, userId?: string): Promise<boolean | null> {
  const asset = await getResourceAssetByStorageKey(env.DB, key);
  if (asset) {
    // Resource drafts never leak through a known R2 key. Admin preview is served
    // through the same authenticated admin session, handled by middleware.
    if (asset.status !== 'published') return false;
    return canAccessResource(env.DB, userId, asset.id);
  }

  // Compatibility for existing records that have not been backfilled yet.
  const legacy = await env.DB.prepare(
    'SELECT "id", "status" FROM "resource" WHERE ("file_url" = ? OR "file_url" = ?) LIMIT 1',
  ).bind(key, `/media/${key}`).first<{ id: string; status: string }>();
  if (!legacy) return null;
  if (legacy.status !== 'published') return false;
  return canAccessResource(env.DB, userId, legacy.id);
}

async function canAccessMedia(key: string, userId?: string): Promise<boolean> {
  const [bookAccess, resourceAccess] = await Promise.all([canAccessBookMedia(key, userId), canAccessResourceMedia(key, userId)]);
  // Resource objects must always be catalog-referenced. Unknown keys retain the
  // existing book-media behavior only; resources/ is deliberately closed.
  if (resourceAccess !== null) return resourceAccess;
  return bookAccess ?? !key.startsWith('resources/');
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
