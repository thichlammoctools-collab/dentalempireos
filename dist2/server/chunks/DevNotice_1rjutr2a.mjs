globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
const $$DevNotice = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$DevNotice;
  const {
    title = "Tính năng đang phát triển",
    description = "Chúng tôi đang hoàn thiện trang này. Hãy quay lại sau nhé!"
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="dev-notice-overlay" data-astro-cid-tt7gf3cz> <div class="dev-notice-card" data-astro-cid-tt7gf3cz> <div class="dev-notice-icon" data-astro-cid-tt7gf3cz> <span class="material-symbols-outlined text-5xl text-primary" data-astro-cid-tt7gf3cz>construction</span> </div> <h2 class="text-2xl font-bold text-white mb-2" data-astro-cid-tt7gf3cz>${title}</h2> <p class="text-on-surface-variant mb-6 max-w-sm text-center leading-relaxed" data-astro-cid-tt7gf3cz>${description}</p> <a href="/" class="inline-flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity" data-astro-cid-tt7gf3cz> <span class="material-symbols-outlined text-[20px]" data-astro-cid-tt7gf3cz>home</span>
Về trang chủ
</a> </div> </div>`;
}, "C:/dentalempireos/src/components/ui/DevNotice.astro", void 0);
export {
  $$DevNotice as $
};
