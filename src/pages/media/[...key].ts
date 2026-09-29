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

// Bounds for the optional on-the-fly transform. Chapter figures are stored as
// full-resolution PNGs, which are typically 10x the bytes of the same image in
// AVIF. Callers request a size with ?w= and this clamps it to a sane range so a
// crafted query cannot request an unbounded transform.
const MAX_IMAGE_WIDTH = 2400;
const ALLOWED_IMAGE_FORMATS = new Set(['auto', 'avif', 'webp', 'json']);

interface R2ImageTransform {
  width: number;
  fit: 'scale-down';
  format: string;
  quality?: number;
}

// `cf.image` on an R2 get is a supported runtime option but is absent from the
// installed @cloudflare/workers-types R2GetOptions, so it is declared locally.
type R2GetWithImageTransform = R2GetOptions & { cf: { image: R2ImageTransform } };

function readImageTransform(url: URL): R2ImageTransform | undefined {
  const widthParam = Number(url.searchParams.get('w'));
  if (!Number.isFinite(widthParam) || widthParam <= 0) return undefined;

  const formatParam = (url.searchParams.get('f') ?? 'auto').toLowerCase();
  const qualityParam = Number(url.searchParams.get('q'));

  return {
    width: Math.min(Math.round(widthParam), MAX_IMAGE_WIDTH),
    fit: 'scale-down',
    // `auto` lets Cloudflare pick AVIF/WebP per the request's Accept header.
    format: ALLOWED_IMAGE_FORMATS.has(formatParam) ? formatParam : 'auto',
    ...(Number.isFinite(qualityParam) && qualityParam > 0
      ? { quality: Math.min(Math.round(qualityParam), 90) }
      : {}),
  };
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

  // R2Bucket.head has no image-transform option, so metadata here always
  // describes the stored original. Clients negotiate variants through GET.
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

export const GET: APIRoute = async ({ params, locals, url }) => {
  const key = params.key;
  if (!key) {
    return json({ error: 'Missing key' }, 400);
  }

  if (!(await canAccessMedia(key, locals.user?.id))) {
    return json({ error: locals.user ? 'Bạn chưa có quyền truy cập tệp này' : 'Vui lòng đăng nhập để truy cập tệp này' }, locals.user ? 403 : 401);
  }

  const transform = readImageTransform(url);
  const object = await env.MEDIA.get(key, transform ? { cf: { image: transform } } as R2GetWithImageTransform : undefined);

  if (!object) {
    return json({ error: 'File not found' }, 404);
  }

  const headers = new Headers();
  const ct = object.httpMetadata?.contentType ?? 'application/octet-stream';
  headers.set('Content-Type', ct);

  const filename = key.split('/').pop() || 'download';
  if (ct.startsWith('image/')) {
    // Images must remain inline so book figures can render in the reader.
    // A transformed variant is a distinct URL, so it can be cached harder than
    // the original; the original stays short-lived because a new upload replaces
    // the same R2 key.
    headers.set('Cache-Control', transform ? 'private, max-age=86400' : 'private, max-age=3600');
    headers.set('Vary', 'Accept');
    headers.set('Content-Disposition', 'inline');
  } else {
    headers.set('Cache-Control', 'private, no-store');
    headers.set('Content-Disposition', object.httpMetadata?.contentDisposition || `attachment; filename="${filename}"`);
  }

  if (transform && object.httpEtag) {
    headers.set('ETag', object.httpEtag);
  }

  return new Response(object.body, { status: 200, headers });
};
