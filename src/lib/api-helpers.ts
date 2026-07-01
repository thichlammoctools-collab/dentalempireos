// Shared helpers for admin JSON API endpoints.

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

export function notFound(message = 'Không tìm thấy'): Response {
  return json({ error: message }, 404);
}

// Turns a Vietnamese (or any) heading into a URL-safe anchor slug.
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Generate a unique app ID. */
export function generateAppId(_type: string, name: string): string {
  const base = slugify(name).replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 5);
  return `app-${base}-${ts}${rand}`.slice(0, 64);
}

/** Generate a unique scanner ID. */
export function generateScannerId(name: string): string {
  const base = slugify(name).replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 5);
  return `scan-${base}-${ts}${rand}`.slice(0, 64);
}
