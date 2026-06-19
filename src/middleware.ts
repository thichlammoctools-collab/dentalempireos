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

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, request, url } = context;

  locals.user = null;
  locals.session = null;

  const auth = getAuth();
  const result = await auth.api.getSession({ headers: request.headers });
  if (result) {
    locals.user = result.user;
    locals.session = result.session;
  }

  const isAdminPage = url.pathname === '/admin' || url.pathname.startsWith('/admin/');
  const isAdminApi = url.pathname.startsWith('/api/admin/');

  if (isAdminPage || isAdminApi) {
    const isAuthorized =
      locals.user &&
      (env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((e: string) => e.trim().toLowerCase())
        .filter(Boolean)
        .includes(locals.user.email.toLowerCase());

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

  return next();
});
