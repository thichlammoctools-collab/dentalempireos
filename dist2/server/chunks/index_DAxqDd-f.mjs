globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, e as renderSlot, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_CMqveNVP.mjs";
import { env } from "cloudflare:workers";
import { k as listPublishedChapters } from "./book-db_DDcc_FYk.mjs";
import { g as getTierLabel } from "./collection-helpers_Dwl6Qbgw.mjs";
const $$Badge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Badge;
  const { variant = "free", class: className = "" } = Astro2.props;
  const variants = {
    free: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    tier: "bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300",
    new: "bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400",
    accent: "bg-accent-500 text-white"
  };
  return renderTemplate`${maybeRenderHead()}<span${addAttribute([
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
    variants[variant],
    className
  ], "class:list")}> ${renderSlot($$result, $$slots["default"])} </span>`;
}, "C:/dentalempireos/src/components/ui/Badge.astro", void 0);
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const chapters = await listPublishedChapters(env.DB);
  const tiers = [1, 2, 3];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Thư Viện Sách - Dental Empire OS", "description": "Đọc miễn phí toàn bộ nội dung Dental Empire OS — 6 tầng quản trị nha khoa toàn diện." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 bg-surface-container-low"> <div class="px-6 max-w-[1200px] mx-auto text-center"> <h1 class="text-headline-lg text-white mb-4">Thư Viện Sách</h1> <p class="text-on-surface-variant max-w-2xl mx-auto">
Đọc miễn phí toàn bộ nội dung Dental Empire OS. Lộ trình từ nền tảng đến hệ điều hành quản trị toàn diện.
</p> </div> </section>  <section class="py-16"> <div class="px-6 max-w-[1200px] mx-auto space-y-16"> ${tiers.map((tier) => {
    const tierChapters = chapters.filter((c) => c.tier === tier);
    if (tierChapters.length === 0) return null;
    const label = getTierLabel(tier);
    return renderTemplate`<div> <div class="flex items-center gap-3 mb-6"> ${renderComponent($$result2, "Badge", $$Badge, { "variant": "accent" }, { "default": async ($$result3) => renderTemplate`Tầng ${tier}` })} <h2 class="text-headline-md text-white">${label}</h2> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${tierChapters.map((ch) => renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")} class="group p-6 bg-surface-container hover:bg-surface-container-high rounded-2xl border border-outline-variant hover:border-primary/50 transition-all duration-300"> <div class="flex items-start justify-between"> <div> <p class="text-xs text-on-surface-variant mb-1">Chương ${ch.chapter_no}</p> <h3 class="font-bold text-white group-hover:text-primary transition-colors">${ch.title}</h3> <p class="text-sm text-on-surface-variant mt-2 line-clamp-2">${ch.description}</p> </div> <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mt-1">arrow_forward</span> </div> </a>`)} </div> </div>`;
  })} </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/book/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/book/index.astro";
const $$url = "/book";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
