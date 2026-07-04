import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';
import { createAuth } from '../../../lib/auth';
import { upsertClinicProfile, getClinicProfile } from '../../../lib/clinic-profile-db';

export const prerender = false;

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

// POST /api/account/logo-upload — upload clinic logo to R2 + save logo_url to clinic_profile
export const POST: APIRoute = async ({ request }) => {
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

  // R2 key: logos/{userId}.{ext} — always overwrite
  const key = `logos/${session.user.id}.${ext}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      contentDisposition: 'inline',
    },
  });

  // Update clinic_profile with logo_url
  await upsertClinicProfile(env.DB, {
    id: session.user.id,
    logo_url: `/media/${key}`,
  });

  return json({ url: `/media/${key}`, r2_key: key }, 201);
};

// DELETE /api/account/logo-upload — remove logo
export const DELETE: APIRoute = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: 'unauthorized' }, 401);
  }

  const profile = await getClinicProfile(env.DB, session.user.id);
  if (profile?.logo_url) {
    const key = profile.logo_url.replace('/media/', '');
    await env.MEDIA.delete(key);
  }

  await upsertClinicProfile(env.DB, {
    id: session.user.id,
    logo_url: null,
  });

  return json({ success: true });
};
