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

/**
 * The single authorization source for admin API routes.
 *
 * Middleware already rejects every `/admin` and `/api/admin/` request that is not
 * allowlisted, and it promotes an allowlisted account's persisted `role` to
 * 'admin' before the gate runs. Routes therefore read `locals.user` instead of
 * re-deriving admin status: an earlier version of these handlers compared the
 * `role` column in one place and the ADMIN_EMAILS env in another, so the two
 * could disagree about the same request.
 */
export function isAdminUser(user: App.Locals['user']): boolean {
  return user?.role === 'admin';
}

/** Returns a 403 response when locals.user is not an admin. */
export function requireAdmin(user: App.Locals['user']): Response | null {
  return isAdminUser(user) ? null : json({ error: 'Admin only' }, 403);
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
