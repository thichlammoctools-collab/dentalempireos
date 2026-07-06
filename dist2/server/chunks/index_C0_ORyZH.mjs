globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_B1DfdmGZ.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_0y24a0AK.mjs";
import { env } from "cloudflare:workers";
import { l as listChapters } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const chapters = await listChapters(env.DB);
  const total = chapters.length;
  const published = chapters.filter((c) => c.status === "published").length;
  const drafts = total - published;
  const tierMap = {
    1: { name: "Dental Empire C++", subtitle: "Nền tảng chuyên môn và vận hành cơ bản", icon: "medical_services" },
    2: { name: "Dental Empire U++", subtitle: "Nâng cấp và nhân bản", icon: "trending_up" },
    3: { name: "Dental Empire OS", subtitle: "Hệ điều hành quản trị toàn diện", icon: "deployed_code" }
  };
  const tiers = [1, 2, 3];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "E-books | Dental Empire Admin", "data-astro-cid-kqfowpa7": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4" data-astro-cid-kqfowpa7> <div data-astro-cid-kqfowpa7> <h2 class="text-3xl font-bold text-white mb-1" data-astro-cid-kqfowpa7>Quản lý E-books</h2> <p class="text-on-surface-variant" data-astro-cid-kqfowpa7> ${total} chương · ${published} đã xuất bản · ${drafts} bản nháp
</p> </div> <a href="/admin/ebooks/new" class="bg-primary-container text-white px-6 py-3 rounded-xl font-bold cyan-glow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-[20px]" data-astro-cid-kqfowpa7>add</span> <span class="text-sm" data-astro-cid-kqfowpa7>Thêm chương mới</span> </a> </div>  <div class="flex flex-wrap items-center gap-2" id="ebook-filters" data-astro-cid-kqfowpa7> <button type="button" data-filter="all" class="filter-chip px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-primary text-on-primary border-primary transition-all active:scale-95" data-astro-cid-kqfowpa7>
Tất cả (${total})
</button> ${tiers.map((t) => renderTemplate`<button type="button"${addAttribute(`tier-${t}`, "data-filter")} class="filter-chip px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-surface-container-high text-on-surface-variant border-outline-variant transition-all active:scale-95" data-astro-cid-kqfowpa7>
Tầng ${t} </button>`)} <button type="button" data-filter="published" class="filter-chip px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-surface-container-high text-on-surface-variant border-outline-variant transition-all active:scale-95" data-astro-cid-kqfowpa7>
Đã xuất bản
</button> <button type="button" data-filter="draft" class="filter-chip px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-surface-container-high text-on-surface-variant border-outline-variant transition-all active:scale-95" data-astro-cid-kqfowpa7>
Bản nháp
</button> </div> ${total === 0 ? renderTemplate`<div class="text-center py-16 glass-card rounded-xl" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-6xl text-on-surface-variant/40" data-astro-cid-kqfowpa7>menu_book</span> <p class="text-on-surface-variant mt-3" data-astro-cid-kqfowpa7>Chưa có chương nào</p> <a href="/admin/ebooks/new" class="inline-block mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold" data-astro-cid-kqfowpa7>+ Tạo chương đầu tiên</a> </div>` : renderTemplate`<div class="flex flex-col gap-8" data-astro-cid-kqfowpa7> ${tiers.map((tier) => {
    const tierChapters = chapters.filter((c) => c.tier === tier);
    if (tierChapters.length === 0) return null;
    const t = tierMap[tier];
    return renderTemplate`<section class="ebook-tier-group flex flex-col gap-3"${addAttribute(`tier-${tier}`, "data-tier")} data-astro-cid-kqfowpa7> <div class="flex items-center gap-3" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg" data-astro-cid-kqfowpa7>${t.icon}</span> <div data-astro-cid-kqfowpa7> <h3 class="text-lg font-bold text-white" data-astro-cid-kqfowpa7>Tầng ${tier}: ${t.name}</h3> <p class="text-xs text-on-surface-variant" data-astro-cid-kqfowpa7>${t.subtitle}</p> </div> </div> <div class="tier-chapters grid grid-cols-1 md:grid-cols-2 gap-3"${addAttribute(tier, "data-tier")} data-astro-cid-kqfowpa7> ${tierChapters.map((ch) => renderTemplate`<article class="ebook-card glass-card rounded-xl p-4 relative"${addAttribute(`tier-${ch.tier}`, "data-tier")}${addAttribute(ch.status, "data-status")}${addAttribute(ch.id, "data-chapter-id")} draggable="true" data-astro-cid-kqfowpa7> <!-- Delete button: top-right corner --> <button${addAttribute(ch.id, "data-delete-chapter")}${addAttribute(ch.title, "data-chapter-title")} class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-on-surface-variant/50 hover:text-error hover:bg-error/10 transition-colors z-10" title="Xóa chương" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-[16px]" data-astro-cid-kqfowpa7>delete</span> </button> <div class="flex items-start gap-4 pr-8" data-astro-cid-kqfowpa7> <div class="w-11 h-11 rounded-lg bg-surface-container-high border border-outline-variant/15 flex items-center justify-center shrink-0 text-on-surface-variant cursor-grab active:cursor-grabbing order-handle" title="Kéo để sắp xếp thứ tự" data-astro-cid-kqfowpa7> <span class="chapter-num text-sm font-bold" data-astro-cid-kqfowpa7>${String(ch.chapter_no).padStart(2, "0")}</span> </div> <div class="flex-1 min-w-0" data-astro-cid-kqfowpa7> <div class="flex items-center gap-2 mb-1" data-astro-cid-kqfowpa7> ${ch.status === "draft" ? renderTemplate`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase text-on-surface-variant bg-surface-variant" data-astro-cid-kqfowpa7>Draft</span>` : renderTemplate`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase text-primary bg-primary/10" data-astro-cid-kqfowpa7>Published</span>`} </div> <h4 class="text-base font-semibold text-white truncate" data-astro-cid-kqfowpa7>${ch.title}</h4> <p class="text-xs text-on-surface-variant mt-1 line-clamp-2" data-astro-cid-kqfowpa7>${ch.description}</p> <div class="flex items-center gap-3 mt-3 pt-3 border-t border-outline-variant/60" data-astro-cid-kqfowpa7> <a${addAttribute(`/admin/ebooks/${ch.id}`, "href")} class="text-xs font-bold text-primary hover:underline flex items-center gap-1" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-[16px]" data-astro-cid-kqfowpa7>edit</span> Sửa
</a> ${ch.status === "published" && renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")} target="_blank" class="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-[16px]" data-astro-cid-kqfowpa7>visibility</span> Xem
</a>`} </div> </div> </div> </article>`)} </div> </section>`;
  })} </div>`} <div id="ebook-empty" class="hidden text-center py-16" data-astro-cid-kqfowpa7> <span class="material-symbols-outlined text-6xl text-on-surface-variant/40" data-astro-cid-kqfowpa7>search_off</span> <p class="text-on-surface-variant mt-3" data-astro-cid-kqfowpa7>Không có chương nào khớp bộ lọc</p> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/ebooks/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/ebooks/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/ebooks/index.astro";
const $$url = "/admin/ebooks";
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
