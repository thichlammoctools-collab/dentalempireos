import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../lib/api-helpers';

export const prerender = false;

// GET /media/[...key] — serve file from R2 with caching
export const HEAD: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return new Response(null, { status: 400 });
  }

  const head = await env.MEDIA.head(key);
  if (!head) {
    return new Response(null, { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Length', String(head.size));
  headers.set('Content-Type', head.httpMetadata?.contentType ?? 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  return new Response(null, { status: 200, headers });
};

export const GET: APIRoute = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return json({ error: 'Missing key' }, 400);
  }

  const object = await env.MEDIA.get(key);

  if (!object) {
    return json({ error: 'File not found' }, 404);
  }

  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  const ct = object.httpMetadata?.contentType ?? 'application/octet-stream';
  headers.set('Content-Type', ct);

  const cd = object.httpMetadata?.contentDisposition;
  if (cd) {
    headers.set('Content-Disposition', cd);
  }

  return new Response(object.body, { status: 200, headers });
};
