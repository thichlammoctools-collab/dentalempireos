import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../lib/api-helpers';

export const prerender = false;

// Whitelist of allowed MIME types
const ALLOWED_MIME: Record<string, string> = {
  // Images
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  // Documents
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  // Video
  'video/mp4': 'mp4',
  // Presentation
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
};

const MAX_SIZE_DEFAULT = 10 * 1024 * 1024; // 10 MB
const MAX_SIZE_RESOURCE = 100 * 1024 * 1024; // 100 MB for resource uploads (videos etc.)

// POST /api/admin/upload — multipart file upload to R2
export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('multipart/form-data')) {
    return badRequest('Expected multipart/form-data');
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const purpose = (formData.get('purpose') as string) || 'book';
  const chapterId = (formData.get('chapterId') as string) || 'unsorted';

  if (!file || !(file instanceof File)) {
    return badRequest('No file provided');
  }

  const maxSize = purpose === 'resource' ? MAX_SIZE_RESOURCE : MAX_SIZE_DEFAULT;
  if (file.size > maxSize) {
    return badRequest(`File too large (max ${maxSize / 1024 / 1024}MB)`);
  }

  const mime = file.type;
  if (!ALLOWED_MIME[mime]) {
    return badRequest(`File type "${mime}" is not allowed`);
  }

  // R2 key: purpose/{subfolder}/{uuid}-{sanitised-filename}
  const ext = ALLOWED_MIME[mime];
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  // Strip original extension from filename since we add it via `ext` below
  const baseName = safeName.replace(/\.[^.]+$/, '');
  const folder = purpose === 'resource' ? 'resources' : purpose === 'blog' ? 'blog' : `book/${chapterId}`;
  const key = `${folder}/${crypto.randomUUID()}-${baseName}.${ext}`;

  // Sanitise filename for Content-Disposition header (RFC 6266)
  const safeDispositionName = safeName.replace(/["\\]/g, '_');

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      contentDisposition: mime.startsWith('image/')
        ? `inline; filename="${safeDispositionName}"`
        : `attachment; filename="${safeDispositionName}"`,
    },
  });

  return json({ r2_key: key, url: `/media/${key}`, mime, filename: file.name }, 201);
};
