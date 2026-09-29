import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { createAuth } from './lib/auth';
import { ensureCreditAccount, grantCredits } from './lib/credit-db';
import { isGuestScannerSlug } from './lib/guest-scanner';

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

// Keep Better Auth's persisted role in sync with the ADMIN_EMAILS allowlist,
// which authorizes the user-management APIs via its admin plugin.
//
// This used to run an unconditional UPDATE on every request, adding a D1 write
// to every anonymous page load. It is now scoped to the signed-in account: only
// an allowlisted session triggers a write, so ordinary and anonymous traffic
// never pays for it, and each admin's own request is what promotes them.
async function ensureAdminRole(db: D1Database, userId: string, email: string): Promise<void> {
  await db
    .prepare('UPDATE "user" SET "role" = \'admin\' WHERE "id" = ? AND LOWER("email") = ? AND "role" != \'admin\'')
    .bind(userId, email.toLowerCase())
    .run();
}

// Document responses (this is `output: 'server'`, so HTML arrives without a file
// extension and never matched the `/*.html` rule in public/_headers).
//
// An explicit `s-maxage` is deliberately NOT set. Cloudflare's Worker cache key
// ignores `Vary: Cookie`, so an edge-shared HTML entry could be replayed to a
// signed-in member and leak which chapters/resources they can read. Browser-level
// revalidation plus the short `s-maxage`-free window keeps every response
// per-session correct; pages that render identical markup for everyone can opt in
// explicitly by setting their own header (see book/[...slug].astro).
function applyDocumentCachePolicy(
  response: Response,
  user: { id: string } | null,
  request: Request,
): void {
  if (request.method !== 'GET' && request.method !== 'HEAD') return;
  if (!response.ok) return;

  const contentType = response.headers.get('Content-Type') ?? '';
  if (!contentType.includes('text/html')) return;

  // A page that already expressed its own policy owns it. /book/[...slug] sets
  // `private, no-store` for premium chapters and must not be relaxed here.
  if (response.headers.has('Cache-Control')) return;

  if (user) {
    // Authenticated HTML varies by account: access state, credits, and the
    // header avatar all render into the markup.
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    response.headers.set('Vary', 'Cookie');
    return;
  }

  response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, request, url } = context;

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && !url.pathname.startsWith('/api/auth/') && !url.pathname.startsWith('/api/payos/webhook')) {
    const origin = request.headers.get('Origin');
    if (origin && origin !== url.origin) {
      return new Response(JSON.stringify({ error: 'cross_origin_request_blocked' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  locals.user = null;
  locals.session = null;

  const adminEmails = getAdminEmails();

  const auth = getAuth();
  const result = await auth.api.getSession({ headers: request.headers });
  if (result) {
    // better-auth không tự động trả về field tùy chỉnh (như is_active).
    // Query trực tiếp từ DB để lấy is_active.
    const dbUser = await env.DB
      .prepare('SELECT "is_active" FROM "user" WHERE "id" = ?')
      .bind(result.user.id)
      .first<{ is_active: number }>();

    // The better-auth session payload already includes the admin plugin's `role`
    // and `banned` columns; locals only adds `is_active`, which better-auth does
    // not select. Narrow explicitly so the spread's banExpires (a Date) does not
    // leak into the locals contract, which only the fields handlers read declare.
    const { banReason: _banReason, banExpires: _banExpires, ...sessionUser } = result.user;
    const user: NonNullable<App.Locals['user']> = { ...sessionUser, is_active: dbUser?.is_active ?? 0 };
    // The new-wallet welcome grant is lazy but exactly-once. Only users created
    // after the Credits Economy migration are eligible; existing accounts are
    // intentionally not backfilled.
    const createdAt = new Date(result.user.createdAt).getTime();
    const creditGoLive = Date.parse('2026-08-09T00:00:00.000Z');
    if (Number.isFinite(createdAt) && createdAt >= creditGoLive) {
      await ensureCreditAccount(env.DB, result.user.id);
      await grantCredits(env.DB, {
        userId: result.user.id,
        amount: 50,
        kind: 'welcome_grant',
        sourceType: 'welcome',
        sourceId: result.user.id,
        idempotencyKey: `welcome:${result.user.id}`,
        reason: 'Credits chào mừng thành viên mới',
      });
    }
    locals.user = user;
    locals.session = result.session;

    // Promote an allowlisted account to the admin role on its own request. The
    // admin plugin authorizes user-management APIs from this persisted column,
    // so it must be set before the admin gate below evaluates this request.
    if (adminEmails.length > 0 && adminEmails.includes(user.email.toLowerCase())) {
      try {
        await ensureAdminRole(env.DB, user.id, user.email);
        user.role = 'admin';
      } catch (error) {
        console.error('[middleware] admin role sync failed', error);
      }
    }

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
    const isResult = seg.startsWith('result/') || seg.startsWith('report/');
    const isGuestScanner = isGuestScannerSlug(seg);
    const isPack = seg === 'pack' || seg.startsWith('pack/');
    const isTest = seg === 'test';
    if (!isResult && !isGuestScanner && !isPack && !isTest) {
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
     newResponse.headers.set('X-Content-Type-Options', 'nosniff');
     newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
     newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
     newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
     newResponse.headers.set('Content-Security-Policy', "base-uri 'self'; object-src 'none'; frame-ancestors 'self'");
     return newResponse;
  }

  const response = await next();
  const secured = new Response(response.body, response);
  secured.headers.set('X-Content-Type-Options', 'nosniff');
  secured.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  secured.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  secured.headers.set('X-Frame-Options', 'SAMEORIGIN');
  secured.headers.set('Content-Security-Policy', "base-uri 'self'; object-src 'none'; frame-ancestors 'self'");
  applyDocumentCachePolicy(secured, locals.user, request);
  return secured;
});
