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
