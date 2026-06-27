import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';

export const prerender = false;

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// POST /api/account/avatar — upload user avatar to R2
export const POST: APIRoute = async ({ request }) => {
  // Auth guard
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: 'unauthorized' }, 401);
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return badRequest('Expected multipart/form-data');
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return badRequest('No file provided');
  }

  if (file.size > MAX_SIZE) {
    return badRequest(`File too large (max ${MAX_SIZE / 1024 / 1024}MB)`);
  }

  const mime = file.type;
  const ext = ALLOWED_MIME[mime];
  if (!ext) {
    return badRequest(`File type "${mime}" is not allowed`);
  }

  // R2 key uses fixed userId so new avatar overwrites old one (no orphans)
  const key = `avatars/${session.user.id}-${crypto.randomUUID()}.${ext}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      contentDisposition: 'inline',
    },
  });

  return json({ url: `/media/${key}`, r2_key: key }, 201);
};
