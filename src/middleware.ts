import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { createAuth } from './lib/auth';

// Memoize auth instance per isolate (persists across requests in the same Worker instance)
let _cachedAuth: ReturnType<typeof createAuth> | null = null;
function getAuth() {
  if (!_cachedAuth) {
    _cachedAuth = createAuth(env);
  }
  return _cachedAuth;
}

function getAdminEmails() {
  return (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, request, url } = context;

  locals.user = null;
  locals.session = null;

  // Keep Better Auth's role in sync with the email allowlist used by this app.
  // Its admin plugin authorizes user-management APIs from this persisted role.
  const adminEmails = getAdminEmails();
  if (adminEmails.length > 0) {
    const placeholders = adminEmails.map(() => '?').join(', ');
    await env.DB
      .prepare(`UPDATE "user" SET "role" = 'admin' WHERE LOWER("email") IN (${placeholders}) AND "role" != 'admin'`)
      .bind(...adminEmails)
      .run();
  }

  const auth = getAuth();
  const result = await auth.api.getSession({ headers: request.headers });
  if (result) {
    // better-auth không tự động trả về field tùy chỉnh (như is_active).
    // Query trực tiếp từ DB để lấy is_active.
    const dbUser = await env.DB
      .prepare('SELECT "is_active" FROM "user" WHERE "id" = ?')
      .bind(result.user.id)
      .first<{ is_active: number }>();

    const user = { ...result.user, is_active: dbUser?.is_active ?? 0 };
    locals.user = user;
    locals.session = result.session;

    // Chặn user bị banned khỏi mọi trang (trừ login)
    if (user.banned && !url.pathname.startsWith('/login')) {
      return context.redirect('/login?reason=banned');
    }
  }

  const isAdminPage = url.pathname === '/admin' || url.pathname.startsWith('/admin/');
  const isAdminApi = url.pathname.startsWith('/api/admin/');

  const isAccountPage = url.pathname === '/account' || url.pathname.startsWith('/account/');
  if (isAccountPage && !locals.user) {
    const redirect = encodeURIComponent(url.pathname + url.search);
    return context.redirect(`/login?redirect=${redirect}`);
  }

  if (isAdminPage || isAdminApi) {
    const isAuthorized =
      locals.user &&
      adminEmails.includes(locals.user.email.toLowerCase());

    if (!isAuthorized) {
      if (isAdminApi) {
        const status = locals.user ? 403 : 401;
        return new Response(
          JSON.stringify({ error: locals.user ? 'forbidden' : 'unauthorized' }),
          { status, headers: { 'Content-Type': 'application/json' } },
        );
      }
      if (!locals.user) {
        const redirect = encodeURIComponent(url.pathname + url.search);
        return context.redirect(`/login?redirect=${redirect}`);
      }
      return new Response('Bạn không có quyền truy cập trang quản trị.', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  }

  // Scanner form pages require login (exclude /result/, /pack, /test)
  if (url.pathname.startsWith('/scanner/') && !locals.user) {
    const seg = url.pathname.slice('/scanner/'.length);
    const isResult = seg.startsWith('result/');
    const isPack = seg === 'pack' || seg.startsWith('pack/');
    const isTest = seg === 'test';
    if (!isResult && !isPack && !isTest) {
      const redirect = encodeURIComponent(url.pathname + url.search);
      return context.redirect(`/login?redirect=${redirect}`);
    }
  }

  // Prevent CDN/browser caching on dynamic scanner pages — list/slug change with DB seed updates
  if (url.pathname.startsWith('/scanner')) {
    const response = await next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    newResponse.headers.set('Pragma', 'no-cache');
    newResponse.headers.set('Expires', '0');
    return newResponse;
  }

  return next();
});
