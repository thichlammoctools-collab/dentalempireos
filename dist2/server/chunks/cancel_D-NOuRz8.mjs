globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_VoTlS2tl.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_CRYLZtq9.mjs";
const prerender = false;
const $$Cancel = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Hủy thanh toán | Dental Empire OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-[480px] mx-auto px-6 py-16 text-center"> <div class="glass-card rounded-2xl p-8 border border-outline-variant/20"> <div class="flex flex-col items-center gap-4"> <div class="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center"> <svg class="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path> </svg> </div> <h2 class="text-xl font-bold text-white">Đã hủy thanh toán</h2> <p class="text-on-surface-variant text-sm">
Bạn đã hủy giao dịch này. Không có khoản phí nào được trừ.
</p> <a href="/" class="mt-2 px-6 py-2.5 btn-primary-metallic font-bold rounded-xl text-sm">
Về trang chủ
</a> </div> </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/payment/cancel.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/payment/cancel.astro";
const $$url = "/payment/cancel";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Cancel,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
