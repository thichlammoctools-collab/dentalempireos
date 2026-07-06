globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_NhufuOWg.mjs";
import { env } from "cloudflare:workers";
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  if (Astro2.locals.user) {
    return Astro2.redirect("/");
  }
  const redirectTo = Astro2.url.searchParams.get("redirect") || "/";
  const hasGoogleOAuth = !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Đăng nhập | Dental Empire OS", "description": "Đăng nhập để tải tài liệu và sử dụng tính năng nâng cao.", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-[440px] mx-auto px-6 py-16"> <div class="glass-card rounded-2xl p-8 border border-outline-variant/20"> <h1 class="text-2xl font-bold text-white mb-2">Đăng nhập</h1> <p class="text-sm text-on-surface-variant mb-6">
Chưa có tài khoản?
<a${addAttribute(`/register?redirect=${encodeURIComponent(redirectTo)}`, "href")} class="text-primary font-semibold hover:underline">Đăng ký</a> </p> <form id="login-form" class="flex flex-col gap-4"> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1.5" for="email">Email</label> <input id="email" name="email" type="email" required autocomplete="email" placeholder="ban@email.com" class="w-full px-4 py-3 bg-white/5 border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1.5" for="password">Mật khẩu</label> <input id="password" name="password" type="password" required autocomplete="current-password" placeholder="••••••••" class="w-full px-4 py-3 bg-white/5 border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> </div> <p id="login-error" class="hidden text-sm text-rose-400"></p> <button type="submit" id="login-submit" class="w-full px-4 py-3 btn-primary-metallic font-bold rounded-xl text-sm active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
Đăng nhập
</button> </form> ${hasGoogleOAuth && renderTemplate`<div> <div class="flex items-center gap-3 my-5"> <div class="flex-1 h-px bg-outline-variant/30"></div> <span class="text-xs text-on-surface-variant">hoặc</span> <div class="flex-1 h-px bg-outline-variant/30"></div> </div> <button id="google-login-btn" type="button" class="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-outline-variant rounded-xl text-white text-sm font-semibold hover:bg-white/10 transition-colors"> <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"> <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"></path> <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path> <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path> <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path> </svg>
Đăng nhập bằng Google
</button> </div>`} </div> </section> ${renderScript($$result2, "C:/dentalempireos/src/pages/login.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/login.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/login.astro";
const $$url = "/login";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
