globalThis.process ??= {};
globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from "./chunks/sequence_CNN-ZGRA.mjs";
import { env } from "cloudflare:workers";
import { b as createAuth } from "./chunks/index_CZ-nCjtb.mjs";
let _cachedAuth = null;
function getAuth() {
  if (!_cachedAuth) {
    _cachedAuth = createAuth(env);
  }
  return _cachedAuth;
}
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { locals, request, url } = context;
  locals.user = null;
  locals.session = null;
  const auth = getAuth();
  const result = await auth.api.getSession({ headers: request.headers });
  if (result) {
    const dbUser = await env.DB.prepare('SELECT "is_active" FROM "user" WHERE "id" = ?').bind(result.user.id).first();
    locals.user = { ...result.user, is_active: dbUser?.is_active ?? 0 };
    locals.session = result.session;
  }
  const isAdminPage = url.pathname === "/admin" || url.pathname.startsWith("/admin/");
  const isAdminApi = url.pathname.startsWith("/api/admin/");
  const isAccountPage = url.pathname === "/account" || url.pathname.startsWith("/account/");
  if (isAccountPage && !locals.user) {
    const redirect = encodeURIComponent(url.pathname + url.search);
    return context.redirect(`/login?redirect=${redirect}`);
  }
  if (isAdminPage || isAdminApi) {
    const isAuthorized = locals.user && (env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean).includes(locals.user.email.toLowerCase());
    if (!isAuthorized) {
      if (isAdminApi) {
        const status = locals.user ? 403 : 401;
        return new Response(
          JSON.stringify({ error: locals.user ? "forbidden" : "unauthorized" }),
          { status, headers: { "Content-Type": "application/json" } }
        );
      }
      if (!locals.user) {
        const redirect = encodeURIComponent(url.pathname + url.search);
        return context.redirect(`/login?redirect=${redirect}`);
      }
      return new Response("Bạn không có quyền truy cập trang quản trị.", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }
  return next();
});
const onRequest = sequence(
  onRequest$1
);
export {
  onRequest
};
