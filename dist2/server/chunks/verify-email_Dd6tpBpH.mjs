globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_CcpFbi8U.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_lrzeJKgU.mjs";
const $$VerifyEmail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$VerifyEmail;
  const email = Astro2.url.searchParams.get("email") || "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Xác nhận email | Dental Empire OS", "description": "Kiểm tra hộp thư để xác nhận tài khoản.", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-[440px] mx-auto px-6 py-16 text-center"> <div class="glass-card rounded-2xl p-8 border border-outline-variant/20"> <span class="material-symbols-outlined text-primary text-[56px] mb-4">mark_email_unread</span> <h1 class="text-2xl font-bold text-white mb-3">Kiểm tra email của bạn</h1> <p class="text-sm text-on-surface-variant leading-relaxed mb-6">
Chúng tôi đã gửi liên kết xác nhận${email ? " đến " : ""}<span class="text-white font-semibold">${email}</span>.
        Nhấn vào liên kết trong email để kích hoạt tài khoản, sau đó đăng nhập.
</p> <a href="/login" class="inline-flex items-center justify-center gap-2 px-6 py-3 btn-primary-metallic font-bold rounded-xl text-sm active:scale-95 transition-all">
Tới trang đăng nhập
</a> <p class="text-xs text-on-surface-variant/60 mt-6">
Không thấy email? Kiểm tra mục spam hoặc thử đăng ký lại sau vài phút.
</p> </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/verify-email.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/verify-email.astro";
const $$url = "/verify-email";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$VerifyEmail,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
