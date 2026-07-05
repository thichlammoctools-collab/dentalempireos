globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate, F as Fragment, e as renderSlot, b as defineScriptVars, u as unescapeHTML } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { g } from "./marked.esm_10m2JtFV.mjs";
import { env } from "cloudflare:workers";
import { c as getChapterTree, p as listAllSections, k as listPublishedChapters, g as getSupportSettings } from "./book-db_DDcc_FYk.mjs";
import { g as getTierLabel } from "./collection-helpers_Dwl6Qbgw.mjs";
import { $ as $$BaseLayout, a as $$StructuredData } from "./BaseLayout_CMqveNVP.mjs";
import { $ as $$StarRating } from "./StarRating_CQPGVxgS.mjs";
import { $ as $$DonateWidget } from "./DonateWidget_CwpS5eFB.mjs";
import { a as listReviewsByChapter, g as getReviewStats } from "./review-db_BEpAiHjt.mjs";
const $$SectionNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SectionNav;
  const { sections, attachments = [], chapterId = "", chapterTitle = "" } = Astro2.props;
  const attachmentCount = attachments.length;
  const numberedSections = sections.map((section) => {
    const num = section.sectionNumber || "";
    const depth = num ? num.split(".").length : 0;
    const isRoot = depth <= 1;
    const indentPx = Math.max(0, depth - 1) * 12;
    const linkColorStyle = isRoot ? "color: var(--reader-chrome-text); opacity: 0.8;" : "color: var(--reader-chrome-text-muted); opacity: 0.55;";
    const linkStyle = `padding-left: ${8 + indentPx}px; ${linkColorStyle}`;
    const numStyle = "min-width: 2em";
    const linkCls = isRoot ? "section-nav-link group flex items-center gap-1.5 rounded-md text-[14px] transition-all duration-150 font-semibold py-1.5 px-2" : "section-nav-link group flex items-center gap-1.5 rounded-md text-[14px] transition-all duration-150 py-1 px-2";
    const numCls = isRoot ? "font-mono tabular-nums shrink-0 transition-colors text-[10px] text-primary/50" : "font-mono tabular-nums shrink-0 transition-colors text-[10px] text-primary/30";
    return { ...section, num, depth, linkCls, linkStyle, numCls, numStyle };
  });
  return renderTemplate`<!-- ============ DESKTOP: Compact right sidebar ============ -->${maybeRenderHead()}<aside id="section-nav-desktop" class="section-nav-desktop hidden lg:flex flex-col sticky top-20 self-start w-[375px] shrink-0 max-h-[calc(100vh-6rem)] overflow-y-auto border-r" style="background: var(--reader-chrome-bg); border-color: var(--reader-border);" data-astro-cid-rhxl4t3w> <!-- Header: inline title + attachment link --> <div class="px-3 pt-3 pb-1.5 sticky top-0 z-10 backdrop-blur-sm border-b" style="background: var(--reader-chrome-bg); border-color: var(--reader-border);" data-astro-cid-rhxl4t3w> <div class="flex items-center justify-between" data-astro-cid-rhxl4t3w> <h3 class="text-[13px] font-bold uppercase tracking-wider flex items-center gap-1.5" style="color: var(--reader-chrome-text-muted);" data-astro-cid-rhxl4t3w> <span class="material-symbols-outlined text-[15px] text-primary/70" data-astro-cid-rhxl4t3w>format_list_numbered</span>
Đề mục
</h3> ${attachmentCount > 0 && renderTemplate`<a href="#attachments-summary" class="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-primary/70 hover:text-primary hover:bg-primary/5 transition-all"${addAttribute(`${attachmentCount} tệp đính kèm`, "title")} data-astro-cid-rhxl4t3w> <span class="material-symbols-outlined text-[12px]" data-astro-cid-rhxl4t3w>attachment</span> ${attachmentCount} </a>`} </div> </div> <!-- Section links --> <nav class="flex-1 overflow-y-auto py-1.5 px-1.5" id="section-nav-links" data-astro-cid-rhxl4t3w> ${numberedSections.map((section) => renderTemplate`<a${addAttribute(`#${section.slug}`, "href")}${addAttribute(section.linkCls, "class")}${addAttribute(section.linkStyle, "style")}${addAttribute(section.slug, "data-section-link")} data-astro-cid-rhxl4t3w> ${section.num && renderTemplate`<span${addAttribute(section.numCls, "class")}${addAttribute(section.numStyle, "style")} data-astro-cid-rhxl4t3w>${section.num}</span>`} <span class="truncate" data-astro-cid-rhxl4t3w>${section.title}</span> </a>`)} </nav> </aside>  ${renderScript($$result, "C:/dentalempireos/src/components/book/SectionNav.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/book/SectionNav.astro", void 0);
const $$SectionNavMobile = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SectionNavMobile;
  const {
    sections,
    groupedChapters = [],
    currentSlug = "",
    reviewStats = { avgRating: 0, totalReviews: 0 },
    attachments = [],
    chapterId: _chapterId = "",
    chapterTitle: _chapterTitle = ""
  } = Astro2.props;
  const h2Count = sections.filter((s) => s.level === 2).length;
  const attachmentCount = attachments.length;
  const numberedSections = sections.map((section) => {
    const num = section.sectionNumber || "";
    const depth = num ? num.split(".").length : 0;
    return { ...section, num, depth };
  });
  const currentChapterTitle = groupedChapters.flatMap((g2) => g2.chapters).find((c) => c.id === currentSlug)?.data.title ?? "";
  return renderTemplate`<!-- Floating trigger buttons (right side, above bottom bar) --><!-- Collapsed: icon-only circular buttons, lower position -->${maybeRenderHead()}<div id="mobile-fab-container" class="lg:hidden fixed right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-[55] pointer-events-none flex flex-col gap-2" data-astro-cid-b4r54kzu> <!-- Section nav: mobile only (desktop has sidebar) --> <button id="section-nav-trigger" class="mobile-fab-btn pointer-events-auto w-10 h-10 rounded-full shadow-lg transition-all active:scale-90" style="background: var(--reader-chrome-surface-high); border: 1px solid var(--reader-border); color: var(--reader-chrome-text); backdrop-filter: blur(12px);" aria-label="Mở mục lục" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-lg" data-astro-cid-b4r54kzu>format_list_numbered</span> <span class="sr-only" data-astro-cid-b4r54kzu>Đề mục (${sections.length})</span> </button> <!-- Review --> <button id="review-trigger" class="mobile-fab-btn pointer-events-auto relative w-10 h-10 rounded-full shadow-lg transition-all active:scale-90" style="background: var(--reader-chrome-surface-high); border: 1px solid var(--reader-border); backdrop-filter: blur(12px);" aria-label="Mở đánh giá" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-lg" style="color: var(--color-primary);" data-astro-cid-b4r54kzu>reviews</span> ${reviewStats.totalReviews > 0 && renderTemplate`<span class="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center" style="background: var(--color-primary); color: var(--color-on-primary);" data-astro-cid-b4r54kzu>${reviewStats.totalReviews > 9 ? "9+" : reviewStats.totalReviews}</span>`} </button> <!-- Question --> <button id="question-trigger" class="mobile-fab-btn pointer-events-auto hidden w-10 h-10 rounded-full shadow-lg transition-all active:scale-90" style="background: var(--reader-chrome-surface-high); border: 1px solid var(--reader-border); backdrop-filter: blur(12px);" aria-label="Hỏi tác giả" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-lg" style="color: var(--color-primary);" data-astro-cid-b4r54kzu>support_agent</span> </button> </div> <!-- Overlay --> <div id="section-nav-overlay" class="fixed inset-0 z-[101] bg-black/50 backdrop-blur-sm hidden transition-opacity" aria-hidden="true" data-astro-cid-b4r54kzu></div> <!-- Unified Drawer --> <div id="section-nav-sheet" class="section-nav-sheet fixed inset-x-0 bottom-0 z-[102] rounded-t-3xl overflow-hidden flex flex-col shadow-2xl" style="background: var(--reader-chrome-bg); max-height: 85vh;" data-astro-cid-b4r54kzu> <!-- Handle --> <div class="flex justify-center pt-3 pb-2 cursor-pointer select-none" id="section-nav-handle" data-astro-cid-b4r54kzu> <div class="w-10 h-1 rounded-full" style="background: var(--reader-border);" data-astro-cid-b4r54kzu></div> </div> <!-- Header --> <div class="px-5 pb-3 flex items-center justify-between" style="border-bottom: 1px solid var(--reader-border);" data-astro-cid-b4r54kzu> <div data-astro-cid-b4r54kzu> <h3 class="text-sm font-bold flex items-center gap-2" style="color: var(--reader-chrome-text);" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-primary text-base" data-astro-cid-b4r54kzu>format_list_numbered</span>
Đề mục
</h3> <p class="text-[10px] mt-0.5" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>${currentChapterTitle}</p> </div> <div class="flex items-center gap-2" data-astro-cid-b4r54kzu> <div class="w-32 h-2 rounded-full overflow-hidden" style="background: var(--reader-chrome-surface-high);" data-astro-cid-b4r54kzu> <div id="section-nav-progress-mobile" class="h-full rounded-full" style="width: 0%; background: var(--color-tertiary); transition: width 0.3s;" data-astro-cid-b4r54kzu></div> </div> <button id="section-nav-close" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style="background: var(--reader-chrome-surface-high);" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-base" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>close</span> </button> </div> </div> <!-- Tab switcher: Đề mục / Chương --> <div class="flex px-4 pt-3 gap-1" id="section-nav-tabs" data-astro-cid-b4r54kzu> <button class="section-nav-tab flex-1 py-2 rounded-xl text-xs font-bold transition-all" data-tab="sections" style="background: rgba(146,204,255,0.1); color: var(--color-primary); border: 1px solid rgba(146,204,255,0.3);" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-sm align-middle mr-1" data-astro-cid-b4r54kzu>format_list_numbered</span>
Đề mục (${sections.length})
</button> <button class="section-nav-tab flex-1 py-2 rounded-xl text-xs font-bold transition-all" data-tab="chapters" style="background: var(--reader-chrome-surface-high); color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-sm align-middle mr-1" data-astro-cid-b4r54kzu>menu_book</span>
Chương (${groupedChapters.flatMap((g2) => g2.chapters).length})
</button> <button class="section-nav-tab flex-1 py-2 rounded-xl text-xs font-bold transition-all" data-tab="attachments" style="background: var(--reader-chrome-surface-high); color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-sm align-middle mr-1" data-astro-cid-b4r54kzu>attachment</span>
Đính kèm (${attachmentCount})
</button> </div> <!-- Scrollable content: Section headings --> <nav class="flex-1 overflow-y-auto px-3 py-3 section-nav-panel" id="section-nav-panel-sections" data-panel="sections" data-astro-cid-b4r54kzu> ${numberedSections.map((section) => {
    const indentPx = (section.depth - 1) * 14;
    const isChild = section.depth > 1;
    return renderTemplate`<a${addAttribute(`#${section.slug}`, "href")}${addAttribute([
      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border-l-[3px]",
      isChild ? "border-transparent" : "border-transparent"
    ], "class:list")}${addAttribute(`color: var(--reader-chrome-text-muted); padding-left: ${12 + indentPx}px`, "style")}${addAttribute(section.slug, "data-mobile-section-link")} data-astro-cid-b4r54kzu> ${section.num ? renderTemplate`<span class="text-[11px] font-bold shrink-0" style="color: var(--reader-chrome-text-muted); min-width: 2.5em;" data-astro-cid-b4r54kzu>${section.num}</span>` : renderTemplate`<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: var(--reader-chrome-text-muted); opacity: 0.4;" data-astro-cid-b4r54kzu></span>`} <span class="truncate text-xs font-medium" data-astro-cid-b4r54kzu>${section.title}</span> </a>`;
  })} ${sections.length === 0 && renderTemplate`<div class="py-8 text-center" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-3xl block mb-2 opacity-30" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>article</span> <p class="text-xs" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>Chưa có đề mục</p> </div>`} </nav> <!-- Scrollable content: Chapter navigation --> <nav class="flex-1 overflow-y-auto px-3 py-3 space-y-1 section-nav-panel hidden" id="section-nav-panel-chapters" data-panel="chapters" data-astro-cid-b4r54kzu> ${groupedChapters.map((group) => {
    const hasCurrent = group.chapters.some((ch) => ch.id === currentSlug);
    return renderTemplate`<div class="mobile-toc-group"${addAttribute(group.tier, "data-tier")}${addAttribute(hasCurrent ? "true" : "false", "data-current-tier")} data-astro-cid-b4r54kzu> <button class="mobile-toc-group-header flex items-center gap-2 px-3 py-2 w-full rounded-xl text-left transition-all border border-transparent" style="background: var(--reader-chrome-surface-high);" data-mobile-toc-toggle data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-primary text-[16px] mobile-toc-group-icon transition-transform duration-200" data-astro-cid-b4r54kzu>folder_open</span> <span class="text-xs font-bold flex-1 truncate" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>${group.label}</span> <span class="text-[10px] px-1.5 py-0.5 rounded" style="background: var(--reader-chrome-bg); color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>${group.chapters.length}</span> <span class="material-symbols-outlined text-[16px] transition-transform duration-200" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>expand_more</span> </button> <div class="mobile-toc-group-chapters overflow-hidden transition-all duration-300" data-astro-cid-b4r54kzu> ${group.chapters.map((ch) => {
      const isCurrent = ch.id === currentSlug;
      return renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")}${addAttribute([
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all border-l-[3px]",
        isCurrent ? "border-primary" : "border-transparent"
      ], "class:list")}${addAttribute(isCurrent ? "background: rgba(146,204,255,0.1); color: var(--color-primary); box-shadow: inset 0 0 0 1px rgba(146,204,255,0.15);" : "color: var(--reader-chrome-text-muted);", "style")} data-section-nav-chapter-link data-astro-cid-b4r54kzu> <span class="text-[10px] font-bold w-7 shrink-0" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>Ch${String(ch.data.chapter).padStart(2, "0")}</span> <span class="truncate text-xs font-medium" data-astro-cid-b4r54kzu>${ch.data.title}</span> ${isCurrent && renderTemplate`<span class="material-symbols-outlined text-primary text-base ml-auto shrink-0" data-astro-cid-b4r54kzu>play_arrow</span>`} </a>`;
    })} </div> </div>`;
  })} </nav> <nav class="flex-1 overflow-y-auto px-3 py-3 section-nav-panel hidden" id="section-nav-panel-attachments" data-panel="attachments" data-astro-cid-b4r54kzu> ${attachmentCount > 0 ? attachments.map((item) => renderTemplate`<a${addAttribute(`#attachment-${item.id}`, "href")} class="flex items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-sm transition-all hover:border-primary/40 hover:bg-primary/5" style="border-color: var(--reader-border); background: var(--reader-chrome-surface-high);" data-mobile-attachment-link data-astro-cid-b4r54kzu> <div class="min-w-0" data-astro-cid-b4r54kzu> <p class="text-sm font-semibold r-text truncate" data-astro-cid-b4r54kzu>${item.title}</p> <p class="text-[11px] r-text-muted truncate" data-astro-cid-b4r54kzu>${item.sectionTitle}</p> </div> <span class="inline-flex h-6 items-center rounded-full px-2 text-[10px] font-semibold r-text-muted" style="background: var(--reader-chrome-bg);" data-astro-cid-b4r54kzu>${item.type === "image" ? "Hình" : item.ext ?? "Tệp"}</span> </a>`) : renderTemplate`<div class="py-8 text-center" data-astro-cid-b4r54kzu> <span class="material-symbols-outlined text-3xl block mb-2 opacity-30" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>attachment</span> <p class="text-xs" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu>Chưa có mục đính kèm trong chương này</p> </div>`} </nav> <!-- Footer --> <div class="px-5 py-3 shrink-0" style="border-top: 1px solid var(--reader-border);" data-astro-cid-b4r54kzu> <p class="text-[10px] font-semibold" style="color: var(--reader-chrome-text-muted);" data-astro-cid-b4r54kzu> ${h2Count} mục chính · ${sections.length - h2Count} mục con
</p> </div> </div>   ${renderScript($$result, "C:/dentalempireos/src/components/book/SectionNavMobile.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/book/SectionNavMobile.astro", void 0);
const $$ChapterNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ChapterNav;
  const { prev, next } = Astro2.props;
  return renderTemplate`<!-- Fixed bottom bar: chapter prev/next navigation -->${maybeRenderHead()}<div id="chapter-nav-fixed" class="chapter-nav-fixed fixed bottom-0 left-0 right-0 z-[45] flex items-center justify-between px-3 py-2 gap-2 border-t" style="
    background: var(--reader-chrome-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-color: var(--reader-border);
    padding-bottom: calc(0.5rem + env(safe-area-inset-bottom, 0px));
    display: flex;
  " data-astro-cid-bjdpsf27> ${prev ? renderTemplate`<a${addAttribute(`/book/${prev.id}`, "href")} class="flex-1 flex items-center gap-2 py-2.5 pl-2 pr-3 rounded-xl min-w-0 ch-nav-link" data-astro-cid-bjdpsf27> <span class="material-symbols-outlined text-[18px] shrink-0" style="color: var(--reader-chrome-text-muted);" data-astro-cid-bjdpsf27>arrow_back</span> <div class="flex flex-col min-w-0" data-astro-cid-bjdpsf27> <span class="text-[10px] font-semibold leading-none mb-0.5" style="color: var(--reader-chrome-text-muted);" data-astro-cid-bjdpsf27>Chương trước</span> <span class="text-xs font-bold leading-tight truncate group-hover:text-primary transition-colors" style="color: var(--reader-chrome-text);" data-astro-cid-bjdpsf27>${prev.data.title}</span> </div> </a>` : renderTemplate`<div class="flex-1" data-astro-cid-bjdpsf27></div>`} ${next ? renderTemplate`<a${addAttribute(`/book/${next.id}`, "href")} class="flex-1 flex items-center justify-end gap-2 py-2.5 pl-3 pr-2 rounded-xl min-w-0 text-right ch-nav-link" data-astro-cid-bjdpsf27> <div class="flex flex-col min-w-0" data-astro-cid-bjdpsf27> <span class="text-[10px] font-semibold leading-none mb-0.5" style="color: var(--reader-chrome-text-muted);" data-astro-cid-bjdpsf27>Chương tiếp</span> <span class="text-xs font-bold leading-tight truncate group-hover:text-primary transition-colors" style="color: var(--reader-chrome-text);" data-astro-cid-bjdpsf27>${next.data.title}</span> </div> <span class="material-symbols-outlined text-[18px] shrink-0" style="color: var(--reader-chrome-text-muted);" data-astro-cid-bjdpsf27>arrow_forward</span> </a>` : renderTemplate`<div class="flex-1" data-astro-cid-bjdpsf27></div>`} </div>`;
}, "C:/dentalempireos/src/components/book/ChapterNav.astro", void 0);
const $$ReviewForm = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ReviewForm;
  const { chapterId, isLoggedIn } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="review-form-container bg-surface-container rounded-2xl border border-outline-variant/40 p-6 mb-8"${addAttribute(chapterId, "data-chapter-id")}> ${!isLoggedIn ? renderTemplate`<!-- Logged out state - Login prompt -->
    <div class="text-center py-8"> <div class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style="background: var(--color-surface-container-high);"> <span class="material-symbols-outlined text-3xl" style="color: var(--color-on-surface-variant);">lock</span> </div> <h3 class="font-bold text-white mb-2">Đăng nhập để đánh giá</h3> <p class="text-sm text-on-surface-variant mb-5 max-w-xs mx-auto">
Bạn cần đăng nhập để gửi đánh giá và chia sẻ cảm nhận với tác giả.
</p> <div class="flex items-center justify-center gap-3"> <a href="/login" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity"> <span class="material-symbols-outlined text-base">login</span>
Đăng nhập
</a> <a href="/register" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:border-primary hover:text-primary transition-all"> <span class="material-symbols-outlined text-base">person_add</span>
Đăng ký
</a> </div> </div>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`  <div class="flex items-center gap-2 mb-4"> <span class="material-symbols-outlined text-primary text-xl">rate_review</span> <h3 class="font-bold text-white">Gửi cảm nhận của bạn</h3> </div>  <form id="review-form" class="space-y-4"> <input type="hidden" name="chapter_id"${addAttribute(chapterId, "value")}>  <div> <label class="block text-sm font-medium text-on-surface-variant mb-1.5">
Đánh giá <span class="text-error">*</span> </label> ${renderComponent($$result2, "StarRating", $$StarRating, { "name": "rating", "size": "lg" })} </div>  <div> <label for="review-title" class="block text-sm font-medium text-on-surface-variant mb-1.5">
Tiêu đề <span class="text-on-surface-variant/50">(tùy chọn)</span> </label> <input type="text" id="review-title" name="title" placeholder="Tóm tắt cảm nhận..." class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"> </div>  <div> <label for="review-content" class="block text-sm font-medium text-on-surface-variant mb-1.5">
Nội dung <span class="text-error">*</span> </label> <textarea id="review-content" name="content" required rows="4" minlength="2" placeholder="Chia sẻ cảm nhận về chương này..." class="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-y min-h-[6rem] max-h-[12rem]"></textarea> </div>  <div class="flex items-center justify-between"> <p class="text-xs text-on-surface-variant/50 review-status"></p> <button type="submit" class="review-submit px-6 py-2.5 btn-primary-metallic font-bold rounded-xl text-sm flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">send</span>
Gửi đánh giá
</button> </div> </form> <div class="review-success hidden text-center py-6"> <span class="material-symbols-outlined text-5xl text-green-400 mb-2 block">check_circle</span> <p class="font-semibold text-white mb-1">Cảm ơn bạn đã chia sẻ!</p> <p class="text-sm text-on-surface-variant">Đánh giá của bạn đã được hiển thị.</p> </div> ` })}`} </div> ${renderScript($$result, "C:/dentalempireos/src/components/book/ReviewForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/book/ReviewForm.astro", void 0);
const $$ReviewDrawer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ReviewDrawer;
  const { chapterId, chapterTitle = "", isLoggedIn, currentUserId = null } = Astro2.props;
  return renderTemplate`<!-- Overlay -->${maybeRenderHead()}<div id="review-overlay" class="fixed inset-0 z-[101] bg-black/50 backdrop-blur-sm" style="opacity: 0; pointer-events: none; transition: opacity 0.3s ease;" aria-hidden="true" data-astro-cid-e565lpid></div> <!-- ═══════════ DESKTOP: Slide-in panel with tabs ═══════════ --> <aside id="review-drawer-desktop" class="fixed right-0 top-0 bottom-0 z-[102] flex-col shadow-2xl" style="width: 440px; background: var(--reader-chrome-bg); display: none; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);"${addAttribute(chapterId, "data-chapter-id")}${addAttribute(chapterTitle, "data-chapter-title")}${addAttribute(isLoggedIn, "data-is-logged-in")}${addAttribute(currentUserId, "data-current-user-id")} data-astro-cid-e565lpid> <!-- Header --> <div class="shrink-0 border-b" style="border-color: var(--reader-border);" data-astro-cid-e565lpid> <div class="flex items-center justify-between px-5 pt-4 pb-0" data-astro-cid-e565lpid> <div class="flex items-center gap-2" data-astro-cid-e565lpid> <span id="review-badge-desktop" class="text-[10px] px-1.5 py-0.5 rounded-full font-bold r-surface-high r-text-muted hidden" data-astro-cid-e565lpid>0</span> </div> <button id="review-close-desktop" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-surface-container-high" title="Đóng" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-base r-text-muted" data-astro-cid-e565lpid>close</span> </button> </div> <!-- Tab bar --> <div class="flex px-5 gap-1" id="desktop-review-tabs" data-astro-cid-e565lpid> <button class="desktop-tab flex-1 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5" data-tab="reviews" style="background: rgba(146,204,255,0.1); color: var(--color-primary); border-bottom: 2px solid var(--color-primary);" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-[15px]" data-astro-cid-e565lpid>reviews</span>
Đánh giá
</button> <button class="desktop-tab flex-1 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5" data-tab="question" style="background: transparent; color: var(--reader-chrome-text-muted); border-bottom: 2px solid transparent;" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-[15px]" data-astro-cid-e565lpid>support_agent</span>
Hỏi tác giả
</button> </div> </div> <!-- ══ Reviews panel ══ --> <div id="desktop-panel-reviews" class="flex-1 overflow-y-auto px-5 py-4 space-y-5" data-astro-cid-e565lpid> <div id="review-skeleton-desktop" class="space-y-4" data-astro-cid-e565lpid> <div class="animate-pulse flex items-center gap-4 p-4 rounded-2xl r-surface" data-astro-cid-e565lpid> <div class="w-16 h-12 r-surface-high rounded-lg" data-astro-cid-e565lpid></div> <div class="flex-1 space-y-2" data-astro-cid-e565lpid> <div class="h-4 r-surface-high rounded w-24" data-astro-cid-e565lpid></div> <div class="h-3 r-surface-high rounded w-16" data-astro-cid-e565lpid></div> </div> </div> <div class="animate-pulse space-y-3" data-astro-cid-e565lpid> <div class="h-20 r-surface rounded-xl" data-astro-cid-e565lpid></div> <div class="h-20 r-surface rounded-xl" data-astro-cid-e565lpid></div> </div> </div> <div id="review-content-desktop" class="hidden space-y-5" data-astro-cid-e565lpid></div> ${renderComponent($$result, "ReviewForm", $$ReviewForm, { "chapterId": chapterId, "isLoggedIn": isLoggedIn, "data-astro-cid-e565lpid": true })} <div id="reviews-list-desktop" class="space-y-4" data-astro-cid-e565lpid></div> </div> <!-- ══ Question panel ══ --> <div id="desktop-panel-question" class="flex-1 overflow-y-auto px-6 py-5 space-y-5" style="display: none;" data-astro-cid-e565lpid> <!-- Logged out state --> <div id="question-logged-out-desktop"${addAttribute(["text-center py-12", !isLoggedIn ? "" : "hidden"], "class:list")} data-astro-cid-e565lpid> <div class="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style="background: var(--reader-chrome-surface-high);" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-2xl" style="color: var(--reader-chrome-text-muted);" data-astro-cid-e565lpid>lock</span> </div> <p class="text-sm font-semibold mb-1" style="color: var(--reader-chrome-text);" data-astro-cid-e565lpid>Đăng nhập để đặt câu hỏi</p> <p class="text-xs mb-5" style="color: var(--reader-chrome-text-muted);" data-astro-cid-e565lpid>Bạn cần đăng nhập để gửi câu hỏi cho tác giả.</p> <a href="/login" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-base" data-astro-cid-e565lpid>login</span> Đăng nhập
</a> </div> <!-- Form --> <form id="question-form-desktop"${addAttribute(["flex flex-col gap-4", isLoggedIn ? "" : "hidden"], "class:list")} data-astro-cid-e565lpid> <input type="hidden" name="chapter_id"${addAttribute(chapterId, "value")} data-astro-cid-e565lpid> <div data-astro-cid-e565lpid> <label class="text-[11px] font-bold uppercase tracking-widest mb-2 block" style="color: var(--reader-chrome-text-muted);" data-astro-cid-e565lpid>Tiêu đề câu hỏi</label> <input type="text" name="title" placeholder="Tóm tắt ngắn gọn câu hỏi của bạn..." class="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all" style="background: var(--reader-chrome-surface); border: 1px solid var(--reader-border); color: var(--reader-chrome-text);" required maxlength="200" data-astro-cid-e565lpid> </div> <div data-astro-cid-e565lpid> <label class="text-[11px] font-bold uppercase tracking-widest mb-2 block" style="color: var(--reader-chrome-text-muted);" data-astro-cid-e565lpid>Nội dung chi tiết</label> <textarea name="body"${addAttribute(5, "rows")} placeholder="Mô tả chi tiết câu hỏi của bạn. Càng cụ thể, tác giả càng dễ trả lời..." class="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-y" style="background: var(--reader-chrome-surface); border: 1px solid var(--reader-border); color: var(--reader-chrome-text);" required data-astro-cid-e565lpid></textarea> </div> <div class="flex items-center justify-between gap-3 pt-1" data-astro-cid-e565lpid> <p class="text-[11px] flex-1" style="color: var(--reader-chrome-text-muted);" data-astro-cid-e565lpid>
Tác giả sẽ nhận thông báo và trả lời sớm nhất có thể.
</p> <button type="submit" id="question-submit-desktop" class="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shrink-0" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-base" data-astro-cid-e565lpid>send</span>
Gửi câu hỏi
</button> </div> </form> <!-- Success state --> <div id="question-success-desktop" class="hidden text-center py-10" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-primary text-5xl mb-4 block" data-astro-cid-e565lpid>check_circle</span> <p class="text-base font-bold mb-1" style="color: var(--reader-chrome-text);" data-astro-cid-e565lpid>Câu hỏi đã được gửi!</p> <p class="text-sm" style="color: var(--reader-chrome-text-muted);" data-astro-cid-e565lpid>Tác giả sẽ trả lời trong thời gian sớm nhất.</p> </div> </div> </aside> <!-- ═══════════ MOBILE: Review bottom sheet ═══════════ --> <div id="review-drawer-mobile" class="fixed inset-x-0 bottom-0 z-[103] rounded-t-3xl overflow-hidden flex flex-col shadow-2xl" style="background: var(--color-surface-container-low); max-height: 88vh; display: none; transform: translateY(100%); transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);"${addAttribute(chapterId, "data-chapter-id")}${addAttribute(isLoggedIn, "data-is-logged-in")}${addAttribute(currentUserId, "data-current-user-id")} data-astro-cid-e565lpid> <div class="flex justify-center pt-3 pb-2 cursor-grab select-none" id="review-handle" data-astro-cid-e565lpid> <div class="w-10 h-1.5 rounded-full bg-outline-variant" data-astro-cid-e565lpid></div> </div> <div class="px-5 pb-3 flex items-center justify-between shrink-0 border-b r-border" data-astro-cid-e565lpid> <div class="flex items-center gap-2" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-primary text-lg" data-astro-cid-e565lpid>reviews</span> <h3 class="text-sm font-bold r-text" data-astro-cid-e565lpid>Đánh Giá</h3> <span id="review-badge-mobile" class="text-[10px] px-1.5 py-0.5 rounded-full font-bold r-surface-high r-text-muted hidden" data-astro-cid-e565lpid>0</span> </div> <button id="review-close-mobile" class="w-8 h-8 rounded-full flex items-center justify-center bg-surface-container-high" data-astro-cid-e565lpid> <span class="material-symbols-outlined text-base r-text-muted" data-astro-cid-e565lpid>close</span> </button> </div> <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5" data-astro-cid-e565lpid> <div id="review-skeleton-mobile" class="space-y-4" data-astro-cid-e565lpid> <div class="animate-pulse flex items-center gap-4 p-4 rounded-2xl r-surface" data-astro-cid-e565lpid> <div class="w-16 h-12 r-surface-high rounded-lg" data-astro-cid-e565lpid></div> <div class="flex-1 space-y-2" data-astro-cid-e565lpid> <div class="h-4 r-surface-high rounded w-24" data-astro-cid-e565lpid></div> <div class="h-3 r-surface-high rounded w-16" data-astro-cid-e565lpid></div> </div> </div> <div class="animate-pulse space-y-3" data-astro-cid-e565lpid> <div class="h-20 r-surface rounded-xl" data-astro-cid-e565lpid></div> <div class="h-20 r-surface rounded-xl" data-astro-cid-e565lpid></div> </div> </div> <div id="review-content-mobile" class="hidden space-y-5" data-astro-cid-e565lpid></div> ${renderComponent($$result, "ReviewForm", $$ReviewForm, { "chapterId": chapterId, "isLoggedIn": isLoggedIn, "data-astro-cid-e565lpid": true })} <div id="reviews-list-mobile" class="space-y-4" data-astro-cid-e565lpid></div> </div> </div>  ${renderScript($$result, "C:/dentalempireos/src/components/book/ReviewDrawer.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/book/ReviewDrawer.astro", void 0);
const $$QuestionDrawer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$QuestionDrawer;
  const { chapterId, chapterTitle = "" } = Astro2.props;
  return renderTemplate`<!-- Mobile: Bottom sheet only (desktop uses ReviewDrawer's question tab) -->${maybeRenderHead()}<div id="question-drawer-mobile" class="fixed z-[102] rounded-t-3xl overflow-hidden flex-col shadow-2xl hidden" style="
    background: var(--reader-chrome-bg);
    left: 0; right: 0; bottom: 0;
    width: 100%; max-width: 100%;
    max-height: min(95vh, calc(100dvh - 20px));
    transform-origin: bottom center;
    transform: translateY(100%);
    opacity: 0; pointer-events: none;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  " data-astro-cid-mzjtrlas> <!-- Handle --> <div class="flex justify-center pt-3 pb-1 cursor-pointer select-none" id="question-handle" data-astro-cid-mzjtrlas> <div class="w-10 h-1 rounded-full" style="background: var(--reader-border);" data-astro-cid-mzjtrlas></div> </div> <!-- Header --> <div class="flex items-center justify-between px-5 py-3 shrink-0" style="border-bottom: 1px solid var(--reader-border);" data-astro-cid-mzjtrlas> <div class="flex items-center gap-2" data-astro-cid-mzjtrlas> <span class="material-symbols-outlined text-primary text-xl" data-astro-cid-mzjtrlas>support_agent</span> <div data-astro-cid-mzjtrlas> <h3 class="text-sm font-bold" style="color: var(--reader-chrome-text);" data-astro-cid-mzjtrlas>Hỏi Tác Giả</h3> ${chapterTitle && renderTemplate`<p class="text-[11px] truncate max-w-[200px]" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>${chapterTitle}</p>`} </div> </div> <button id="question-close-mobile" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-surface-container-high" title="Đóng" data-astro-cid-mzjtrlas> <span class="material-symbols-outlined text-base" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>close</span> </button> </div> <!-- Content --> <div class="flex-1 overflow-y-auto px-5 py-4" data-astro-cid-mzjtrlas> <div id="question-logged-out-mobile" class="hidden text-center py-10" data-astro-cid-mzjtrlas> <span class="material-symbols-outlined text-5xl block mb-4 opacity-30" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>lock</span> <p class="text-xs mb-4" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>Đăng nhập để đặt câu hỏi cho tác giả</p> <a href="/login" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold" data-astro-cid-mzjtrlas> <span class="material-symbols-outlined text-sm" data-astro-cid-mzjtrlas>login</span> Đăng nhập
</a> </div> <form id="question-form-mobile" class="flex flex-col gap-3" data-astro-cid-mzjtrlas> <input type="hidden" name="chapter_id"${addAttribute(chapterId, "value")} data-astro-cid-mzjtrlas> <div data-astro-cid-mzjtrlas> <label class="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>Tiêu đề</label> <input type="text" name="title" placeholder="Tóm tắt câu hỏi..." class="w-full rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary" style="background: var(--reader-chrome-surface); border: 1px solid var(--reader-border); color: var(--reader-chrome-text);" required maxlength="200" data-astro-cid-mzjtrlas> </div> <div data-astro-cid-mzjtrlas> <label class="text-[11px] font-bold uppercase tracking-wider mb-1.5 block" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>Chi tiết</label> <textarea name="body"${addAttribute(4, "rows")} placeholder="Mô tả chi tiết câu hỏi..." class="w-full rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary resize-y" style="background: var(--reader-chrome-surface); border: 1px solid var(--reader-border); color: var(--reader-chrome-text);" required data-astro-cid-mzjtrlas></textarea> </div> <button type="submit" id="question-submit-mobile" class="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" data-astro-cid-mzjtrlas> <span class="material-symbols-outlined text-base" data-astro-cid-mzjtrlas>send</span>
Gửi câu hỏi
</button> <p class="text-[10px] text-center" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>Tác giả sẽ nhận thông báo và trả lời sớm nhất có thể.</p> </form> <div id="question-success-mobile" class="hidden text-center py-8" data-astro-cid-mzjtrlas> <span class="material-symbols-outlined text-primary text-5xl mb-4 block" data-astro-cid-mzjtrlas>check_circle</span> <p class="text-xs font-bold mb-1" style="color: var(--reader-chrome-text);" data-astro-cid-mzjtrlas>Câu hỏi đã được gửi!</p> <p class="text-[11px]" style="color: var(--reader-chrome-text-muted);" data-astro-cid-mzjtrlas>Tác giả sẽ trả lời trong thời gian sớm nhất.</p> </div> </div> </div>  ${renderScript($$result, "C:/dentalempireos/src/components/book/QuestionDrawer.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/book/QuestionDrawer.astro", void 0);
const $$BookLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BookLayout;
  const {
    title,
    description,
    groupedChapters,
    currentSlug,
    currentModules,
    sections = [],
    attachments = [],
    tier = 3,
    tierLabel = "Tier 3",
    chapterNo = 1,
    prev = null,
    next = null,
    isLoggedIn = false,
    currentUserId = null,
    chapterId = ""
  } = Astro2.props;
  const currentTierLabel = groupedChapters.find(
    (g2) => g2.chapters.some((c) => c.id === currentSlug)
  )?.label ?? "Tier 3";
  const currentTier = groupedChapters.find(
    (g2) => g2.chapters.some((c) => c.id === currentSlug)
  )?.tier ?? 3;
  const chapterURL = new URL(`/book/${currentSlug}`, "https://dentalempireos.com").toString();
  const bookSchema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Dental Empire OS",
    alternateName: "Hệ Điều Hành Quản Trị Nha Khoa",
    bookFormat: "https://schema.org/EBook",
    inLanguage: "vi",
    author: {
      "@type": "Person",
      name: "Bác sĩ Nguyễn Phước Vinh",
      url: "https://dentalempireos.com/about"
    },
    publisher: {
      "@type": "Organization",
      name: "Dental Empire OS",
      url: "https://dentalempireos.com"
    },
    url: "https://dentalempireos.com/book",
    description: "Nền tảng chia sẻ tri thức quản trị nha khoa toàn diện — 6 tầng quản trị nha khoa theo hệ điều hành."
  };
  const chapterSchema = {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: title,
    description,
    inLanguage: "vi",
    isPartOf: {
      "@type": "Book",
      name: "Dental Empire OS",
      url: "https://dentalempireos.com/book"
    },
    position: chapterNo,
    url: chapterURL,
    author: {
      "@type": "Person",
      name: "Bác sĩ Nguyễn Phước Vinh"
    }
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Trang chủ",
        item: "https://dentalempireos.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Thư viện sách",
        item: "https://dentalempireos.com/book"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: chapterURL
      }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${title} - Dental Empire OS`, "description": description, "isReading": true, "currentSlug": currentSlug, "groupedChapters": groupedChapters, "ogType": "book", "ogImage": `/api/og/chapter/${currentSlug}.svg`, "data-astro-cid-l3js6ivh": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "StructuredData", $$StructuredData, { "type": "book", "data": bookSchema, "data-astro-cid-l3js6ivh": true })} ${renderComponent($$result2, "StructuredData", $$StructuredData, { "type": "article", "data": chapterSchema, "data-astro-cid-l3js6ivh": true })} ${renderComponent($$result2, "StructuredData", $$StructuredData, { "type": "breadcrumb", "data": breadcrumbSchema, "data-astro-cid-l3js6ivh": true })}  ${maybeRenderHead()}<header id="reader-toolbar" class="fixed top-0 left-0 right-0 flex items-center justify-between px-4 lg:px-6 h-12 lg:h-14 glass-nav border-b r-border z-50" style="background: var(--reader-chrome-bg);" data-astro-cid-l3js6ivh> <!-- Left: Back + breadcrumb --> <div class="flex items-center gap-2 lg:gap-3 min-w-0" data-astro-cid-l3js6ivh> <a href="/book" class="flex items-center gap-1 lg:gap-2 r-text-muted hover:text-primary transition-colors flex-shrink-0" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-lg lg:text-xl" data-astro-cid-l3js6ivh>arrow_back</span> <span class="hidden sm:inline text-xs lg:text-sm font-semibold" data-astro-cid-l3js6ivh>Thư Viện</span> </a> <div class="w-px h-5 hidden sm:block" style="background: var(--reader-border);" data-astro-cid-l3js6ivh></div> <!-- Mobile: "Đang đọc" label + title --> <div class="flex flex-col min-w-0 lg:hidden" data-astro-cid-l3js6ivh> <span class="text-[10px] font-bold uppercase tracking-wider r-text-muted leading-none" data-astro-cid-l3js6ivh>Đang đọc</span> <span class="text-sm font-bold r-text truncate max-w-[180px] leading-tight" data-astro-cid-l3js6ivh>${title}</span> </div> <!-- Desktop: title only --> <div class="hidden lg:flex items-center gap-2 min-w-0" data-astro-cid-l3js6ivh> <span class="text-sm lg:text-base font-bold r-text truncate max-w-[280px]" data-astro-cid-l3js6ivh>${title}</span> </div> </div> <!-- Center: Progress (desktop) --> <div class="hidden lg:flex items-center gap-2 flex-shrink-0" data-astro-cid-l3js6ivh> <span id="progress-pct" class="text-[10px] r-text-muted font-bold tabular-nums" style="min-width: 2.5ch; text-align: right;" data-astro-cid-l3js6ivh>0%</span> <div class="w-32 h-1.5 r-surface-high rounded-full overflow-hidden" data-astro-cid-l3js6ivh> <div id="progress-bar" class="read-progress h-full rounded-full transition-all duration-300" style="width: 0%" data-astro-cid-l3js6ivh></div> </div> </div> <!-- Right: Mobile = progress + bookmark + theme | Desktop = controls --> <div class="flex lg:hidden items-center gap-1.5 flex-shrink-0" data-astro-cid-l3js6ivh> <div class="flex items-center gap-1" data-astro-cid-l3js6ivh> <div class="w-16 sm:w-20 h-1 r-surface-high rounded-full overflow-hidden" data-astro-cid-l3js6ivh> <div id="progress-bar-mobile" class="read-progress h-full rounded-r-full transition-all duration-300" style="width: 0%" data-astro-cid-l3js6ivh></div> </div> <span id="progress-pct-mobile" class="text-[10px] r-text-muted font-bold tabular-nums shrink-0" data-astro-cid-l3js6ivh>0%</span> </div> <button id="mobile-bookmark-btn" class="w-8 h-8 flex items-center justify-center rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Đánh dấu" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-lg" id="mobile-bookmark-icon" data-astro-cid-l3js6ivh>bookmark_border</span> </button> <button id="mobile-theme-btn" class="w-8 h-8 flex items-center justify-center rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Chế độ nền" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-lg" id="mobile-theme-icon" data-astro-cid-l3js6ivh>dark_mode</span> </button> </div> <!-- Right: Controls (desktop) --> <div class="hidden lg:flex items-center gap-1 lg:gap-2" data-astro-cid-l3js6ivh> <button id="toolbar-review-btn" class="fab-control items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Đánh giá" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" data-astro-cid-l3js6ivh>reviews</span> <span class="text-[11px] font-semibold" data-astro-cid-l3js6ivh>Đánh giá</span> </button> <button id="toolbar-ask-btn" class="fab-control items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Hỏi Tác Giả" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" data-astro-cid-l3js6ivh>support_agent</span> <span class="text-[11px] font-semibold" data-astro-cid-l3js6ivh>Hỏi tác giả</span> </button> <button id="theme-btn" class="fab-control items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-all" title="Chế độ đọc" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" id="theme-icon" data-astro-cid-l3js6ivh>dark_mode</span> <span class="text-[11px] font-semibold" data-astro-cid-l3js6ivh>Nền</span> </button> <button id="search-btn" class="fab-control items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Tìm kiếm (Ctrl+K)" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" data-astro-cid-l3js6ivh>search</span> <span class="hidden lg:inline text-[11px] font-semibold" data-astro-cid-l3js6ivh>Tìm</span> </button> ${attachments.length > 0 && renderTemplate`<a href="#attachments-summary" id="attachments-btn" class="relative items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg r-text-muted hover:text-primary r-hover transition-all"${addAttribute(`Xem ${attachments.length} tệp đính kèm`, "title")}${addAttribute(`Xem ${attachments.length} tệp đính kèm`, "aria-label")} data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" data-astro-cid-l3js6ivh>attachment</span> <span class="hidden lg:inline text-[11px] font-semibold" data-astro-cid-l3js6ivh>Tệp</span> <span class="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/15 text-primary text-[10px] font-bold px-2 py-0.5 border border-primary/20" data-astro-cid-l3js6ivh>${attachments.length}</span> </a>`} <button id="toc-toggle-btn" class="fab-control items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Mục lục (Ctrl+Shift+L)" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" data-astro-cid-l3js6ivh>list</span> <span class="hidden lg:inline text-[11px] font-semibold" data-astro-cid-l3js6ivh>Mục lục</span> </button> <button id="bookmark-btn" class="fab-control items-center gap-1 px-2 lg:px-3 py-1.5 rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Đánh dấu" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-base" id="bookmark-icon" data-astro-cid-l3js6ivh>bookmark_border</span> </button> </div> </header>  <div id="search-overlay" class="hidden fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4" data-astro-cid-l3js6ivh> <div class="glass-panel-dark rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl" data-astro-cid-l3js6ivh> <div class="flex items-center gap-3 px-4 py-3 border-b r-border" style="border-color: var(--reader-border);" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined r-text-muted" data-astro-cid-l3js6ivh>search</span> <input id="search-input" type="text" placeholder="Tìm kiếm trong chương..." class="flex-1 bg-transparent border-none outline-none text-sm" autofocus style="color: var(--reader-chrome-text);" data-astro-cid-l3js6ivh> <kbd class="hidden sm:inline px-2 py-1 rounded r-surface-high text-[10px] r-text-muted font-mono" data-astro-cid-l3js6ivh>ESC</kbd> </div> <div class="p-8 text-center text-sm r-text-muted" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-4xl block mb-3 opacity-50" data-astro-cid-l3js6ivh>manage_search</span> <p id="search-helper-text" data-astro-cid-l3js6ivh>Nhập từ khóa để tìm kiếm trong nội dung</p> <p id="search-result-count" class="mt-3 text-xs text-on-surface-variant/70" data-astro-cid-l3js6ivh></p> </div> </div> </div>  <div id="reader-app" class="reader-app flex flex-col overflow-hidden" data-astro-cid-l3js6ivh> <!-- ==========================================
         MAIN BODY: Sidebar + Reader
         ========================================== --> <div class="flex flex-col flex-1 overflow-hidden relative pt-12 lg:pt-14 min-h-0" data-astro-cid-l3js6ivh> <!-- Horizontal content row (sidebar + reader + section nav) --> <div class="flex flex-1 overflow-hidden min-h-0" data-astro-cid-l3js6ivh> <!-- Desktop Sidebar TOC --> <aside id="toc-sidebar" class="hidden lg:flex flex-col w-[26rem] flex-shrink-0 h-full border-r overflow-y-auto toc-sidebar" style="border-color: var(--reader-border); background: var(--reader-chrome-bg);" data-astro-cid-l3js6ivh> <!-- TOC Header --> <div class="px-5 py-4 border-b sticky top-0 z-10" style="border-color: var(--reader-border); background: var(--reader-chrome-bg);" data-astro-cid-l3js6ivh> <h3 class="text-sm font-bold r-text mb-1" data-astro-cid-l3js6ivh>Mục lục</h3> <p class="text-xs r-text-muted" data-astro-cid-l3js6ivh>${currentTierLabel}</p> </div> <!-- Chapter navigation --> <nav class="flex-1 px-4 py-4 space-y-2" data-astro-cid-l3js6ivh> ${groupedChapters.map((group) => {
    const isCurrentTier = group.tier === currentTier;
    return renderTemplate`<div class="toc-group"${addAttribute(group.tier, "data-tier")}${addAttribute(isCurrentTier ? "true" : "false", "data-current-tier")} data-astro-cid-l3js6ivh> <!-- Group header with collapse toggle --> <button class="toc-group-header flex items-center gap-2.5 px-4 py-2.5 w-full rounded-lg text-left transition-all r-hover" aria-expanded="true" data-toc-toggle data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-primary text-[18px] toc-group-icon transition-transform duration-200" data-astro-cid-l3js6ivh>folder_open</span> <span class="text-sm font-bold r-text-muted toc-group-label flex-1 truncate" data-astro-cid-l3js6ivh>${group.label}</span> <span class="text-xs r-text-muted px-2 py-0.5 rounded toc-group-count" style="background: var(--reader-chrome-surface-high);" data-astro-cid-l3js6ivh>${group.chapters.length}</span> <span class="material-symbols-outlined text-[18px] text-on-surface-variant/60 toc-group-chevron transition-transform duration-200" data-astro-cid-l3js6ivh>expand_more</span> </button> <!-- Chapter list --> <div class="toc-group-chapters space-y-1 overflow-hidden transition-all duration-300" data-astro-cid-l3js6ivh> ${group.chapters.map((ch) => {
      const isCurrent = ch.id === currentSlug;
      return renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")}${addAttribute([
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all border-l-2",
        isCurrent ? "toc-item-active border-primary text-primary" : "border-transparent r-text-muted toc-item-hover"
      ], "class:list")} data-toc-chapter data-astro-cid-l3js6ivh> <span class="shrink-0 text-xs w-6" data-astro-cid-l3js6ivh>Ch${String(ch.data.chapter).padStart(2, "0")}</span> <span class="truncate leading-relaxed" data-astro-cid-l3js6ivh>${ch.data.title}</span> </a>`;
    })} </div> </div>`;
  })} </nav> <!-- Current section --> <div class="px-4 py-4 border-t sticky bottom-0" style="border-color: var(--reader-border); background: var(--reader-chrome-bg);" data-astro-cid-l3js6ivh> <p class="text-xs font-bold uppercase tracking-wider r-text-muted mb-1" data-astro-cid-l3js6ivh>Đang đọc</p> <p class="text-base font-bold r-text leading-tight line-clamp-2" data-astro-cid-l3js6ivh>${title}</p> </div> </aside> <!-- Reader Scroll Area --> <main id="reader-scroll" class="flex-1 overflow-y-auto relative reader-main pb-20 lg:pb-0" style="background: var(--reader-bg);" tabindex="-1" data-astro-cid-l3js6ivh> <!-- Content --> <div class="max-w-[760px] mx-auto px-5 sm:px-8 lg:px-14 py-8 lg:py-12 reader-content" id="reader-content"${addAttribute(currentSlug, "data-chapter-id")}${addAttribute(isLoggedIn ? "true" : "false", "data-is-logged-in")}${addAttribute(currentUserId ?? "", "data-user-id")}${addAttribute(title, "data-chapter-title")}${addAttribute(tier, "data-chapter-tier")}${addAttribute(tierLabel, "data-chapter-tier-label")}${addAttribute(chapterNo, "data-chapter-no")}${addAttribute(description, "data-chapter-desc")} data-astro-cid-l3js6ivh> ${renderSlot($$result2, $$slots["default"])} <!-- Spacer: push content above fixed chapter nav bar --> <div id="chapter-nav-spacer" style="height: 72px;" data-astro-cid-l3js6ivh></div> </div> </main> <!-- ==========================================
           SECTION NAV (Desktop right sidebar + Mobile drawer)
           ========================================== --> ${renderComponent($$result2, "SectionNav", $$SectionNav, { "sections": sections, "attachments": attachments, "chapterId": chapterId, "chapterTitle": title, "data-astro-cid-l3js6ivh": true })} </div><!-- end horizontal content row --> <!-- ==========================================
           STATUS BAR (Desktop)
           ========================================== --> <footer id="reader-status" class="hidden lg:flex items-center justify-between px-6 h-9 flex-shrink-0 glass-nav border-t z-40" style="background: var(--reader-chrome-bg); border-color: var(--reader-border);" data-astro-cid-l3js6ivh> <div class="flex items-center gap-4" data-astro-cid-l3js6ivh> <div class="flex items-center gap-2" data-astro-cid-l3js6ivh> <span class="status-dot" data-astro-cid-l3js6ivh></span> <span class="text-[10px] r-text-muted font-semibold" data-astro-cid-l3js6ivh>Online</span> </div> <div class="h-4 w-px" style="background: var(--reader-border);" data-astro-cid-l3js6ivh></div> <span id="word-count" class="text-[10px] r-text-muted" data-astro-cid-l3js6ivh>—</span> </div> <div class="flex items-center gap-3" data-astro-cid-l3js6ivh> <span class="text-[10px] text-primary font-bold" data-astro-cid-l3js6ivh>Dental Empire OS</span> <button id="fullscreen-btn" class="r-text-muted hover:text-primary transition-colors" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-sm" data-astro-cid-l3js6ivh>fullscreen</span> </button> </div> </footer> </div> </div>  ${renderComponent($$result2, "SectionNavMobile", $$SectionNavMobile, { "sections": sections, "groupedChapters": groupedChapters, "currentSlug": currentSlug, "attachments": attachments, "chapterId": chapterId || currentSlug, "chapterTitle": title, "data-astro-cid-l3js6ivh": true })}  ${renderComponent($$result2, "ChapterNav", $$ChapterNav, { "prev": prev, "next": next, "data-astro-cid-l3js6ivh": true })}  ${renderComponent($$result2, "ReviewDrawer", $$ReviewDrawer, { "chapterId": currentSlug, "chapterTitle": title, "isLoggedIn": isLoggedIn, "currentUserId": currentUserId, "data-astro-cid-l3js6ivh": true })}  ${renderComponent($$result2, "QuestionDrawer", $$QuestionDrawer, { "chapterId": currentSlug, "chapterTitle": title, "data-astro-cid-l3js6ivh": true })}  <div id="image-lightbox" class="hidden fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Xem ảnh phóng to" data-astro-cid-l3js6ivh> <div class="lb-backdrop absolute inset-0 bg-black/90 backdrop-blur-md" data-astro-cid-l3js6ivh></div> <div class="lb-container absolute inset-0 flex items-center justify-center overflow-hidden" data-astro-cid-l3js6ivh> <img class="lb-image select-none" draggable="false" alt="" data-astro-cid-l3js6ivh> </div> <!-- Close button --> <button class="lb-close absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors" title="Đóng (Esc)" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-xl" data-astro-cid-l3js6ivh>close</span> </button> <!-- Zoom indicator --> <div class="lb-zoom-badge absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm pointer-events-none opacity-0 transition-opacity duration-300" data-astro-cid-l3js6ivh></div> <!-- Hint (shown on first open) --> <div class="lb-hint absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs font-medium backdrop-blur-sm pointer-events-none transition-opacity duration-500" data-astro-cid-l3js6ivh> <span class="hidden sm:inline" data-astro-cid-l3js6ivh>Nhấn để zoom · Cuộn để phóng to · Esc để đóng</span> <span class="sm:hidden" data-astro-cid-l3js6ivh>Chạm để zoom · 2 ngón để phóng to · Vuốt để di chuyển</span> </div> </div>  <div id="file-preview-modal" class="hidden fixed inset-0 z-[80] flex items-center justify-center" role="dialog" aria-modal="true" data-astro-cid-l3js6ivh> <div class="file-preview-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm" id="preview-backdrop" data-astro-cid-l3js6ivh></div> <div class="file-preview-panel relative z-10 rounded-2xl border shadow-2xl mx-4 my-4 flex flex-col w-full h-[90vh] sm:max-w-4xl sm:max-h-[85vh]" style="background: var(--reader-chrome-surface); border-color: var(--reader-border);" data-astro-cid-l3js6ivh> <div class="flex items-center justify-between px-4 py-3 border-b shrink-0" style="border-color: var(--reader-border);" data-astro-cid-l3js6ivh> <div class="flex items-center gap-2 min-w-0" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-primary text-lg" data-astro-cid-l3js6ivh>visibility</span> <p id="preview-filename" class="text-sm font-bold r-text truncate" data-astro-cid-l3js6ivh></p> </div> <div class="flex items-center gap-1 shrink-0" data-astro-cid-l3js6ivh> <button id="preview-open-external" class="w-8 h-8 flex items-center justify-center rounded-lg r-text-muted hover:text-primary r-hover transition-all" title="Mở tab mới" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-[18px]" data-astro-cid-l3js6ivh>open_in_new</span> </button> <button id="preview-download" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all" title="Tải file" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-[18px]" data-astro-cid-l3js6ivh>download</span> </button> <button id="preview-close" class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-white hover:bg-error/20 transition-all" title="Đóng" data-astro-cid-l3js6ivh> <span class="material-symbols-outlined text-[18px]" data-astro-cid-l3js6ivh>close</span> </button> </div> </div> <div id="preview-body" class="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center" data-astro-cid-l3js6ivh></div> </div> </div>  ${renderScript($$result2, "C:/dentalempireos/src/layouts/BookLayout.astro?astro&type=script&index=0&lang.ts")}  ${renderScript($$result2, "C:/dentalempireos/src/layouts/BookLayout.astro?astro&type=script&index=1&lang.ts")}  ${renderScript($$result2, "C:/dentalempireos/src/layouts/BookLayout.astro?astro&type=script&index=2&lang.ts")}  ` })}`;
}, "C:/dentalempireos/src/layouts/BookLayout.astro", void 0);
const $$BookHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BookHeader;
  const {
    title,
    description,
    tier,
    tierLabel,
    chapterNo,
    coverUrl,
    coverAlt
  } = Astro2.props;
  const tierColors = {
    1: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    2: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    3: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary" }
  };
  const colors = tierColors[tier] ?? tierColors[3];
  const tierEmojis = {
    1: "🌱",
    2: "🌿",
    3: "🌳"
  };
  return renderTemplate`<!-- Mobile Book Header -->${maybeRenderHead()}<div class="lg:hidden mb-6 pb-6 border-b border-white/[0.06]"> <div class="flex items-start gap-3 mb-4"> <!-- Book Cover --> <div class="w-16 h-22 rounded-lg overflow-hidden flex-shrink-0 shadow-lg border border-white/[0.08] bg-surface-container" style="aspect-ratio: 3/4;"> ${coverUrl ? renderTemplate`<img${addAttribute(coverUrl, "src")}${addAttribute(coverAlt ?? title, "alt")} class="w-full h-full object-cover" loading="eager">` : renderTemplate`<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container"> <span class="text-2xl">${tierEmojis[tier] ?? "📖"}</span> </div>`} </div> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-1.5"> <span${addAttribute(`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${colors.bg} ${colors.border} ${colors.text}`, "class")}>
Chương ${chapterNo} </span> <span class="text-on-surface-variant text-xs">${tierLabel}</span> </div> <h1 class="text-2xl font-extrabold text-on-surface leading-snug tracking-tight">${title}</h1> <div class="flex items-center gap-1.5 text-on-surface-variant text-xs mt-1.5"> <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;">schedule</span> <span id="read-time-remaining">~12 phút đọc</span> </div> </div> </div> <!-- Key Insight (shown if description exists) --> ${description && renderTemplate`<div class="relative rounded-xl p-4 overflow-hidden border border-primary/20 bg-primary/[0.04]"> <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div> <div class="flex items-center gap-1.5 mb-2"> <span class="material-symbols-outlined text-primary text-[16px]" style="font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;">lightbulb</span> <span class="text-[10px] font-bold uppercase tracking-widest text-primary">Key Insight</span> </div> <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-3">${description}</p> </div>`} </div> <!-- Desktop Book Header --> <div class="hidden lg:block mb-6 pb-6 border-b border-white/[0.06]"> <div class="flex items-center gap-3 mb-4"> <span${addAttribute(`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${colors.bg} ${colors.border} ${colors.text}`, "class")}>
Tầng ${tier} </span> <span class="text-on-surface-variant text-sm">${tierLabel}</span> <span class="text-on-surface-variant text-sm">·</span> <span class="text-on-surface-variant text-sm">Chương ${chapterNo}</span> </div> <h1 class="text-3xl xl:text-4xl font-extrabold text-on-surface leading-tight tracking-tight mb-3">${title}</h1> ${description && renderTemplate`<p class="text-on-surface-variant text-base leading-relaxed max-w-2xl">${description}</p>`} </div> ${renderScript($$result, "C:/dentalempireos/src/components/book/BookHeader.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/book/BookHeader.astro", void 0);
const keywords = {
  // ═══════════════════════════════════════
  // Frameworks cốt lõi
  // ═══════════════════════════════════════
  "SKY": {
    label: "SKY",
    target: "/book/tier-3/24-to-be-sky#sky-la-gi",
    description: "Sincerity, Kindness, Yielding — Trục đạo đức"
  },
  "S.T.A.R.S": {
    label: "S.T.A.R.S",
    target: "/book/tier-3/25-s-t-a-r-s",
    description: "Skills, Traits, Actions, Results, Synergy — Bản đồ năng lực"
  },
  "S.T.A.R.S.": {
    label: "S.T.A.R.S.",
    target: "/book/tier-3/25-s-t-a-r-s",
    description: "Skills, Traits, Actions, Results, Synergy — Bản đồ năng lực"
  },
  "R.O.A.D.M.A.P": {
    label: "R.O.A.D.M.A.P",
    target: "/book/tier-3/26-r-o-a-d-m-a-p",
    description: "Roots, One Light, Awaken, Deepen, Mature, Align, Prosper"
  },
  "TO BE SKY": {
    label: "TO BE SKY",
    target: "/book/tier-3/24-to-be-sky#to-be-sky",
    description: "Tư tưởng cốt lõi: Transcend, Open, Beneath, Enlighten"
  },
  // ═══════════════════════════════════════
  // SKY Components
  // ═══════════════════════════════════════
  "Sincerity": {
    label: "Sincerity",
    target: "/book/tier-3/24-to-be-sky#sincerity-su-chan-thanh",
    description: "Sự chân thành và trung thực"
  },
  "Kindness": {
    label: "Kindness",
    target: "/book/tier-3/24-to-be-sky#kindness-long-tu-te",
    description: "Lòng tử tế và tinh thần nhân bản"
  },
  "Yielding": {
    label: "Yielding",
    target: "/book/tier-3/24-to-be-sky#yielding-kha-nang-nhuong-minh",
    description: "Khả năng nhường mình để ưu tiên điều đúng"
  },
  // ═══════════════════════════════════════
  // S.T.A.R.S Components
  // ═══════════════════════════════════════
  "Skills": {
    label: "Skills",
    target: "/book/tier-3/25-s-t-a-r-s#skills-ky-nang",
    description: "Năng lực chuyên môn, kỹ năng giao tiếp, vận hành"
  },
  "Traits": {
    label: "Traits",
    target: "/book/tier-3/25-s-t-a-r-s#traits-to-chat",
    description: "Khí chất tự nhiên, tố chất phù hợp vai trò"
  },
  "Actions": {
    label: "Actions",
    target: "/book/tier-3/25-s-t-a-r-s#actions-kha-nang-hanh-dong",
    description: "Tính chủ động, kỷ luật thực thi"
  },
  "Results": {
    label: "Results",
    target: "/book/tier-3/25-s-t-a-r-s#results-ket-qua",
    description: "Đầu ra thực tế, mức độ hoàn thành mục tiêu"
  },
  "Synergy": {
    label: "Synergy",
    target: "/book/tier-3/25-s-t-a-r-s#synergy-cong-huong",
    description: "Khả năng phối hợp, làm mạnh hệ thống"
  },
  // ═══════════════════════════════════════
  // R.O.A.D.M.A.P Components
  // ═══════════════════════════════════════
  "ROOTS": {
    label: "ROOTS",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#roots-goc-re",
    description: "Gốc rễ bản sắc tổ chức"
  },
  "ONE LIGHT": {
    label: "ONE LIGHT",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#one-light-tam-go-dao-duc",
    description: "Tâm gỗ đạo đức"
  },
  "AWAKEN": {
    label: "AWAKEN",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#awaken-tu-soi-chieu",
    description: "Tự soi chiếu"
  },
  "DEEPEN": {
    label: "DEEPEN",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#deepen-dao-sau",
    description: "Đào sâu chuẩn hóa năng lực"
  },
  "MATURE": {
    label: "MATURE",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#mature-nang-tang",
    description: "Nâng tầng đội ngũ"
  },
  "ALIGN": {
    label: "ALIGN",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#align-dong-bo",
    description: "Đồng bộ nguồn lực"
  },
  "PROSPER": {
    label: "PROSPER",
    target: "/book/tier-3/26-r-o-a-d-m-a-p#prosper-thinh-vuong",
    description: "Thịnh vượng có phẩm giá"
  },
  // ═══════════════════════════════════════
  // Quản trị concepts
  // ═══════════════════════════════════════
  "Patient Experience": {
    label: "Patient Experience",
    target: "/book/tier-2/19-patient-experience",
    description: "Trải nghiệm người bệnh toàn diện"
  },
  "Referral": {
    label: "Referral",
    target: "/book/tier-2/18-referral-system",
    description: "Hệ thống giới thiệu khách hàng"
  },
  "CRM": {
    label: "CRM",
    target: "/book/tier-2/16-crm-tuong-tac",
    description: "Quản trị quan hệ khách hàng"
  },
  "KPI": {
    label: "KPI",
    target: "/book/tier-2/15-kpi-do-luong",
    description: "Chỉ số hiệu suất then chốt"
  },
  "Y đức": {
    label: "Y đức",
    target: "/book/tier-3/24-to-be-sky",
    description: "Đạo đức nghề nghiệp y khoa"
  },
  "onboarding": {
    label: "onboarding",
    target: "/book/tier-3/27-dao-tao",
    description: "Chương trình đào tạo nhân viên mới"
  },
  "Dental Empire OS": {
    label: "Dental Empire OS",
    target: "/book/tier-3/21-tong-quan-he-thong",
    description: "Hệ điều hành quản trị nha khoa toàn diện"
  },
  "Dental Empire C++": {
    label: "Dental Empire C++",
    target: "/book/",
    description: "Tầng 1: Nền tảng chuyên môn và vận hành"
  },
  "Dental Empire U++": {
    label: "Dental Empire U++",
    target: "/book/",
    description: "Tầng 2: Nâng cấp và nhân bản"
  }
};
const keywordAliases = {
  "chân thành": "Sincerity",
  "tử tế": "Kindness",
  "nhường mình": "Yielding",
  "kỹ năng": "Skills",
  "tố chất": "Traits",
  "hành động": "Actions",
  "kết quả": "Results",
  "cộng hưởng": "Synergy",
  "gốc rễ": "ROOTS",
  "tâm gỗ": "ONE LIGHT",
  "tự soi chiếu": "AWAKEN",
  "đào sâu": "DEEPEN",
  "nâng tầng": "MATURE",
  "đồng bộ": "ALIGN",
  "thịnh vượng": "PROSPER",
  "trải nghiệm người bệnh": "Patient Experience",
  "giới thiệu khách hàng": "Referral",
  "quản trị quan hệ khách hàng": "CRM",
  "chỉ số hiệu suất": "KPI"
};
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$KeywordAutoLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$KeywordAutoLink;
  const { autoKeywords = [] } = Astro2.props;
  const searchMap = [];
  for (const [key, def] of Object.entries(keywords)) {
    searchMap.push({ pattern: key, target: def.target, label: def.label, desc: def.description || "" });
  }
  for (const [alias, mainKey] of Object.entries(keywordAliases)) {
    const main = keywords[mainKey];
    if (main) {
      searchMap.push({ pattern: alias, target: main.target, label: main.label, desc: main.description || "" });
    }
  }
  for (const ak of autoKeywords) {
    const exists = searchMap.some((s) => s.pattern.toLowerCase() === ak.pattern.toLowerCase());
    if (!exists) {
      searchMap.push({ pattern: ak.pattern, target: ak.target, label: ak.label, desc: "" });
    }
  }
  searchMap.sort((a, b) => b.pattern.length - a.pattern.length);
  const serializedMap = JSON.stringify(searchMap);
  return renderTemplate(_a || (_a = __template(["<script>(function(){", "\n  function initKeywordLinks() {\n    const keywordMap = JSON.parse(serializedMap);\n    const article = document.querySelector('article');\n    if (!article || keywordMap.length === 0) return;\n\n    // Build combined regex — match all keywords, case-insensitive\n    const escaped = keywordMap.map(k => k.pattern.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'));\n    const combinedRegex = new RegExp(`(?<![\\\\p{L}])(${escaped.join('|')})(?![\\\\p{L}])`, 'giu');\n\n    // Elements to skip\n    const skipTags = new Set(['A', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SCRIPT', 'STYLE']);\n\n    function processNode(node) {\n      if (node.nodeType === Node.TEXT_NODE) {\n        const text = node.textContent;\n        if (!text || !combinedRegex.test(text)) return;\n\n        // Check parent element\n        const parent = node.parentElement;\n        if (parent && skipTags.has(parent.tagName)) return;\n        if (parent && parent.closest('a, code, pre, h1, h2, h3, h4, h5, h6')) return;\n\n        // Reset regex\n        combinedRegex.lastIndex = 0;\n\n        const fragment = document.createDocumentFragment();\n        let lastIndex = 0;\n        let match;\n\n        while ((match = combinedRegex.exec(text)) !== null) {\n          const matchText = match[0];\n          const matchStart = match.index;\n\n          // Add text before match\n          if (matchStart > lastIndex) {\n            fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));\n          }\n\n          // Find keyword def (case-insensitive lookup)\n          const keywordDef = keywordMap.find(\n            k => k.pattern.toLowerCase() === matchText.toLowerCase()\n          );\n\n          if (keywordDef) {\n            const link = document.createElement('a');\n            link.href = keywordDef.target;\n            link.className = 'keyword-link';\n            link.title = keywordDef.desc;\n            link.textContent = matchText;\n            fragment.appendChild(link);\n          } else {\n            fragment.appendChild(document.createTextNode(matchText));\n          }\n\n          lastIndex = matchStart + matchText.length;\n        }\n\n        // Remaining text\n        if (lastIndex < text.length) {\n          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));\n        }\n\n        node.parentNode.replaceChild(fragment, node);\n      } else if (node.nodeType === Node.ELEMENT_NODE) {\n        if (skipTags.has(node.tagName)) return;\n        // Clone childNodes to avoid live mutation issues\n        const children = Array.from(node.childNodes);\n        children.forEach(child => processNode(child));\n      }\n    }\n\n    // Process article content\n    const contentDiv = article.querySelector('.prose');\n    if (contentDiv) {\n      processNode(contentDiv);\n    }\n  }\n\n  // Defer keyword processing until after first paint so content is visible immediately\n  if ('requestIdleCallback' in window) {\n    requestIdleCallback(initKeywordLinks, { timeout: 1000 });\n  } else {\n    setTimeout(initKeywordLinks, 200);\n  }\n})();<\/script>"], ["<script>(function(){", "\n  function initKeywordLinks() {\n    const keywordMap = JSON.parse(serializedMap);\n    const article = document.querySelector('article');\n    if (!article || keywordMap.length === 0) return;\n\n    // Build combined regex — match all keywords, case-insensitive\n    const escaped = keywordMap.map(k => k.pattern.replace(/[.*+?^\\${}()|[\\\\]\\\\\\\\]/g, '\\\\\\\\$&'));\n    const combinedRegex = new RegExp(\\`(?<![\\\\\\\\p{L}])(\\${escaped.join('|')})(?![\\\\\\\\p{L}])\\`, 'giu');\n\n    // Elements to skip\n    const skipTags = new Set(['A', 'CODE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SCRIPT', 'STYLE']);\n\n    function processNode(node) {\n      if (node.nodeType === Node.TEXT_NODE) {\n        const text = node.textContent;\n        if (!text || !combinedRegex.test(text)) return;\n\n        // Check parent element\n        const parent = node.parentElement;\n        if (parent && skipTags.has(parent.tagName)) return;\n        if (parent && parent.closest('a, code, pre, h1, h2, h3, h4, h5, h6')) return;\n\n        // Reset regex\n        combinedRegex.lastIndex = 0;\n\n        const fragment = document.createDocumentFragment();\n        let lastIndex = 0;\n        let match;\n\n        while ((match = combinedRegex.exec(text)) !== null) {\n          const matchText = match[0];\n          const matchStart = match.index;\n\n          // Add text before match\n          if (matchStart > lastIndex) {\n            fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));\n          }\n\n          // Find keyword def (case-insensitive lookup)\n          const keywordDef = keywordMap.find(\n            k => k.pattern.toLowerCase() === matchText.toLowerCase()\n          );\n\n          if (keywordDef) {\n            const link = document.createElement('a');\n            link.href = keywordDef.target;\n            link.className = 'keyword-link';\n            link.title = keywordDef.desc;\n            link.textContent = matchText;\n            fragment.appendChild(link);\n          } else {\n            fragment.appendChild(document.createTextNode(matchText));\n          }\n\n          lastIndex = matchStart + matchText.length;\n        }\n\n        // Remaining text\n        if (lastIndex < text.length) {\n          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));\n        }\n\n        node.parentNode.replaceChild(fragment, node);\n      } else if (node.nodeType === Node.ELEMENT_NODE) {\n        if (skipTags.has(node.tagName)) return;\n        // Clone childNodes to avoid live mutation issues\n        const children = Array.from(node.childNodes);\n        children.forEach(child => processNode(child));\n      }\n    }\n\n    // Process article content\n    const contentDiv = article.querySelector('.prose');\n    if (contentDiv) {\n      processNode(contentDiv);\n    }\n  }\n\n  // Defer keyword processing until after first paint so content is visible immediately\n  if ('requestIdleCallback' in window) {\n    requestIdleCallback(initKeywordLinks, { timeout: 1000 });\n  } else {\n    setTimeout(initKeywordLinks, 200);\n  }\n})();<\/script>"])), defineScriptVars({ serializedMap }));
}, "C:/dentalempireos/src/components/book/KeywordAutoLink.astro", void 0);
const prerender = false;
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$;
  g.use({ breaks: true });
  const { slug } = Astro2.params;
  if (!slug) return Astro2.redirect("/book");
  const db = env.DB;
  const _chapterCache = /* @__PURE__ */ new Map();
  const _CHAPTER_TTL_MS = 6e4;
  const [tree, autoKeywordsResult, allPublished, supportSettings] = await Promise.all([
    getChapterTree(db, slug),
    listAllSections(db).catch(() => []),
    listPublishedChapters(db),
    getSupportSettings(db).catch(() => null)
  ]);
  const autoKeywords = autoKeywordsResult ?? [];
  if (!tree) {
    return new Response("Không tìm thấy chương", { status: 404 });
  }
  const { chapter: ch, sections } = tree;
  const groupedByTier = [1, 2, 3].map((tier) => ({
    tier,
    label: getTierLabel(tier),
    chapters: allPublished.filter((c) => c.tier === tier).map((c) => ({
      id: c.id,
      data: { title: c.title, tier: c.tier, chapter: c.chapter_no }
    }))
  }));
  const flatIds = allPublished.map((c) => c.id);
  const currentIdx = flatIds.indexOf(slug);
  const prevCh = currentIdx > 0 ? allPublished[currentIdx - 1] : null;
  const nextCh = currentIdx < flatIds.length - 1 ? allPublished[currentIdx + 1] : null;
  const prev = prevCh ? { id: prevCh.id, data: { title: prevCh.title, tier: prevCh.tier } } : null;
  const next = nextCh ? { id: nextCh.id, data: { title: nextCh.title, tier: nextCh.tier } } : null;
  const modules = sections.map((s) => ({
    title: s.title,
    slug: s.slug
  }));
  function flattenSections(nodes, prefix = "") {
    const result = [];
    let localIdx = 0;
    for (const node of nodes) {
      localIdx++;
      const sectionNumber = prefix ? `${prefix}.${localIdx}` : `${localIdx}`;
      result.push({ title: node.title, slug: node.slug, level: node.level, sectionNumber });
      if (node.children.length > 0) {
        result.push(...flattenSections(node.children, sectionNumber));
      }
    }
    return result;
  }
  function getFileMeta(mime) {
    if (!mime) return { icon: "description", badge: "FILE", iconBg: "bg-secondary/15 text-secondary", badgeClass: "bg-secondary/15 text-secondary", isPreviewable: false, mimeLabel: "File" };
    if (mime.includes("pdf")) return { icon: "picture_as_pdf", badge: "PDF", iconBg: "bg-error/15 text-error", badgeClass: "bg-error/15 text-error", isPreviewable: true, mimeLabel: "PDF Document" };
    if (mime.includes("word") || mime.includes("document")) return { icon: "article", badge: "DOC", iconBg: "bg-primary/15 text-primary", badgeClass: "bg-primary/15 text-primary", isPreviewable: false, mimeLabel: "Word Document" };
    if (mime.includes("sheet") || mime.includes("excel")) return { icon: "table_chart", badge: "XLS", iconBg: "bg-green-400/15 text-green-400", badgeClass: "bg-green-400/15 text-green-400", isPreviewable: false, mimeLabel: "Excel Spreadsheet" };
    if (mime.includes("presentation") || mime.includes("powerpoint")) return { icon: "slideshow", badge: "PPT", iconBg: "bg-tertiary/15 text-tertiary", badgeClass: "bg-tertiary/15 text-tertiary", isPreviewable: false, mimeLabel: "PowerPoint" };
    if (mime.includes("image")) return { icon: "image", badge: "IMG", iconBg: "bg-tertiary/15 text-tertiary", badgeClass: "bg-tertiary/15 text-tertiary", isPreviewable: true, mimeLabel: "Image" };
    return { icon: "description", badge: "FILE", iconBg: "bg-secondary/15 text-secondary", badgeClass: "bg-secondary/15 text-secondary", isPreviewable: false, mimeLabel: "File" };
  }
  function renderMarkdown(text) {
    let html = g.parse(text);
    html = html.replace(
      /<img\b([^>]*)>/gi,
      (match, attrs) => {
        let fixed = attrs.replace(
          /\bsrc="([^"]*)"/i,
          (_, src) => {
            if (/^https?:\/\//.test(src)) return `src="${src}"`;
            if (src.startsWith("/media/")) return `src="${src}"`;
            return `src="/media/${src}"`;
          }
        );
        if (!/onerror/i.test(fixed)) {
          fixed += ` onerror="this.style.display='none'"`;
        }
        return `<img${fixed}>`;
      }
    );
    return html;
  }
  function renderSection(s, attachments2, sectionNumber = "") {
    const tag = s.level <= 2 ? "h2" : s.level === 3 ? "h3" : s.level === 4 ? "h4" : "h5";
    let html = `<${tag} id="${s.slug}" class="section-heading">${sectionNumber ? `<span class="section-number">${sectionNumber}</span>` : ""}${s.title}</${tag}>`;
    for (const block of s.blocks) {
      if (block.type === "text" && block.text_md) {
        html += renderMarkdown(block.text_md);
      } else if (block.type === "image" && block.r2_key) {
        const imageUrl = `/media/${block.r2_key}`;
        attachments2.push({
          id: block.id,
          type: "image",
          title: block.caption ?? `Hình ảnh trong ${s.title}`,
          url: imageUrl,
          caption: block.caption ?? void 0,
          sectionSlug: s.slug,
          sectionTitle: s.title,
          previewable: true
        });
        html += `<div id="attachment-${block.id}" class="attachment-anchor"></div><figure class="my-6">
        <img src="${imageUrl}" alt="${block.alt ?? ""}" class="rounded-xl w-full" loading="lazy" decoding="async" />
        ${block.caption ? `<figcaption class="text-center text-sm text-on-surface-variant mt-2">${block.caption}</figcaption>` : ""}
      </figure>`;
      } else if (block.type === "file" && block.r2_key) {
        const meta = getFileMeta(block.mime);
        const ext = (block.filename ?? "").split(".").pop()?.toUpperCase() ?? meta.badge;
        attachments2.push({
          id: block.id,
          type: "file",
          title: block.filename ?? `Tệp trong ${s.title}`,
          url: `/media/${block.r2_key}`,
          caption: block.caption ?? void 0,
          filename: block.filename ?? void 0,
          mime: block.mime,
          mimeLabel: meta.mimeLabel,
          sectionSlug: s.slug,
          sectionTitle: s.title,
          ext,
          previewable: meta.isPreviewable
        });
        html += `<div id="attachment-${block.id}" class="attachment-anchor"></div><div class="file-card my-5 relative overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low hover:border-primary/30 transition-all duration-300"
        data-file-url="/media/${block.r2_key}"
        data-file-mime="${block.mime ?? ""}"
        data-file-name="${(block.filename ?? "file").replace(/"/g, "&quot;")}"
        data-file-card>
        <div class="file-progress-overlay hidden absolute inset-0 bg-surface-container-low/95 backdrop-blur-sm z-10 flex items-center px-4 gap-3">
          <div class="flex-1">
            <div class="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div class="file-progress-bar h-full rounded-full transition-all duration-200" style="width: 0%; background: var(--color-primary);"></div>
            </div>
            <p class="text-[10px] text-on-surface-variant mt-1 font-medium">
              <span class="file-progress-pct">0</span>% · <span class="file-progress-status">Đang tải...</span>
            </p>
          </div>
          <button class="file-cancel-btn w-7 h-7 flex items-center justify-center rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-all" title="Hủy">
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <div class="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4">
          <div class="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${meta.iconBg} transition-transform duration-300 group-hover:scale-105">
            <span class="material-symbols-outlined text-2xl">${meta.icon}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm text-on-surface font-semibold truncate">${block.filename ?? "Tải file"}</p>
              <span class="flex-shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${meta.badgeClass}">${ext}</span>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs text-on-surface-variant file-mime-label">${meta.mimeLabel}</span>
              <span class="text-xs text-on-surface-variant file-size-display hidden"></span>
            </div>
            ${block.caption ? `<p class="text-xs text-on-surface-variant/70 mt-1 line-clamp-1">${block.caption}</p>` : ""}
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${meta.isPreviewable ? `<button class="file-preview-btn w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200" title="Xem trước">
              <span class="material-symbols-outlined text-[20px]">visibility</span>
            </button>` : ""}
            <button class="file-download-btn btn-primary-metallic flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white" title="Tải file">
              <span class="material-symbols-outlined text-[16px] sm:text-[18px]">download</span>
              <span class="hidden sm:inline">Tải</span>
            </button>
          </div>
        </div>
      </div>`;
      }
    }
    for (let ci = 0; ci < s.children.length; ci++) {
      const childNum = sectionNumber ? `${sectionNumber}.${ci + 1}` : `${ci + 1}`;
      html += renderSection(s.children[ci], attachments2, childNum);
    }
    return html;
  }
  const cached = _chapterCache.get(slug);
  let strippedContent;
  let attachments;
  if (cached && Date.now() - cached.ts < _CHAPTER_TTL_MS) {
    strippedContent = cached.html;
    attachments = cached.attachments;
  } else {
    const localAttachments = [];
    const sectionsHtml = sections.map((s, i) => renderSection(s, localAttachments, `${i + 1}`)).join("");
    strippedContent = sectionsHtml;
    attachments = localAttachments;
    _chapterCache.set(slug, { html: strippedContent, attachments, sectionNavItems: [], ts: Date.now(), ch });
  }
  if (cached && Date.now() - cached.ts >= _CHAPTER_TTL_MS) {
    const staleAttachments = [];
    const freshSectionsHtml = sections.map((s, i) => renderSection(s, staleAttachments, `${i + 1}`)).join("");
    const freshHtml = freshSectionsHtml;
    _chapterCache.set(slug, { html: freshHtml, attachments: staleAttachments, sectionNavItems: [], ts: Date.now(), ch });
  }
  const attachmentCount = attachments.length;
  const imageAttachments = attachments.filter((item) => item.type === "image");
  const fileAttachments = attachments.filter((item) => item.type === "file");
  const sectionNavItems = flattenSections(sections);
  const reviewLimit = 10;
  let reviews = [];
  let reviewStats = { avgRating: 0, totalReviews: 0 };
  try {
    [reviews, reviewStats] = await Promise.all([
      listReviewsByChapter(db, slug, reviewLimit, 0),
      getReviewStats(db, slug)
    ]);
  } catch {
    reviews = [];
    reviewStats = { avgRating: 0, totalReviews: 0 };
  }
  const currentUser = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "BookLayout", $$BookLayout, { "title": ch.title, "description": ch.description ?? "", "groupedChapters": groupedByTier, "currentSlug": slug, "currentModules": modules, "sections": sectionNavItems, "attachments": attachments, "tier": ch.tier, "tierLabel": getTierLabel(ch.tier), "chapterNo": ch.chapter_no, "prev": prev, "next": next, "isLoggedIn": !!currentUser, "currentUserId": currentUser?.id, "chapterId": slug }, { "default": async ($$result2) => renderTemplate`  ${renderComponent($$result2, "BookHeader", $$BookHeader, { "title": ch.title, "description": ch.description ?? "", "tier": ch.tier, "tierLabel": getTierLabel(ch.tier), "chapterNo": ch.chapter_no })}  ${maybeRenderHead()}<div class="prose prose-invert prose-headings:text-white prose-p:text-on-surface-variant prose-a:text-primary prose-strong:text-white prose-li:text-on-surface-variant prose-figure:my-6 max-w-none reader-content" id="reader-content">${unescapeHTML(strippedContent)}</div> ${attachmentCount > 0 ? renderTemplate`<section id="attachments-summary" class="att-list-section mt-10 mb-8"> <div class="att-list-header"> <span class="att-list-label"> <span class="material-symbols-outlined text-[16px]">attach_file</span> ${attachmentCount} đính kèm
</span> <span class="att-list-counts"> ${imageAttachments.length > 0 && renderTemplate`<span class="att-count-chip">${imageAttachments.length} hình</span>`} ${fileAttachments.length > 0 && renderTemplate`<span class="att-count-chip att-count-chip--file">${fileAttachments.length} file</span>`} </span> </div> <div class="att-list"> ${attachments.map((item, idx) => renderTemplate`<a${addAttribute(`#attachment-${item.id}`, "href")} class="att-list-item"> <span class="att-list-num">${idx + 1}</span> <span${addAttribute(`att-list-icon ${item.type === "image" ? "att-list-icon--img" : "att-list-icon--file"}`, "class")}> <span class="material-symbols-outlined text-[16px]">${item.type === "image" ? "image" : "description"}</span> </span> <span class="att-list-info"> <span class="att-list-title">${item.title}</span> <span class="att-list-meta">${item.sectionTitle}</span> </span> <span${addAttribute(`att-list-badge ${item.type === "image" ? "att-badge--img" : "att-badge--" + (item.ext ?? "file").toLowerCase()}`, "class")}> ${item.type === "image" ? "Hình" : item.ext ?? "Tệp"} </span> <span class="att-list-action"> ${item.previewable ? "Xem" : "Mở"} <span class="material-symbols-outlined text-[14px]">arrow_forward</span> </span> </a>`)} </div> </section>` : null} ${renderComponent($$result2, "DonateWidget", $$DonateWidget, { "settings": supportSettings ?? { enabled: 0, title: "", message: "", qr_url: "", payment_methods: "" } })}  ${(() => {
    const scannerMap = {
      1: { slug: "he-thong-check", title: "Hệ Thống Check", icon: "settings", color: "from-blue-600/20 to-cyan-600/5 border-blue-500/30" },
      2: { slug: "nhan-su-check", title: "Nhân Sự Check", icon: "groups", color: "from-emerald-600/20 to-teal-600/5 border-emerald-500/30" },
      3: { slug: "quy-trinh-check", title: "Quy Trình Check", icon: "account_tree", color: "from-amber-600/20 to-orange-600/5 border-amber-500/30" },
      4: { slug: "tiep-don-check", title: "Tiếp Đón Check", icon: "sentiment_satisfied", color: "from-pink-600/20 to-rose-600/5 border-pink-500/30" },
      5: { slug: "tai-chinh-check", title: "Tài Chính Check", icon: "payments", color: "from-violet-600/20 to-purple-600/5 border-violet-500/30" }
    };
    const scanner = scannerMap[ch.chapter_no];
    if (!scanner) return null;
    return renderTemplate`<section class="mt-10 mb-8"> <div${addAttribute(`glass-card rounded-2xl p-6 border bg-gradient-to-br ${scanner.color}`, "class")}> <div class="flex items-start gap-4"> <div class="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center flex-shrink-0"> <span class="material-symbols-outlined text-primary text-[24px]">${scanner.icon}</span> </div> <div class="flex-1 min-w-0"> <p class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1">Đo lường nhanh</p> <h3 class="text-lg font-bold text-white mb-1">${scanner.title}</h3> <p class="text-sm text-on-surface-variant mb-4">5 câu hỏi giúp bạn nhìn rõ thực tế — kèm AI phân tích cá nhân hóa cho phòng khám của bạn.</p> <a${addAttribute(`/scanner/${scanner.slug}`, "href")} class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all"> <span>Làm bài check ngay</span> <span class="material-symbols-outlined text-[18px]">arrow_forward</span> </a> </div> </div> </div> </section>`;
  })()} <section id="newsletter-widget" class="mt-10 mb-8"${addAttribute(slug, "data-chapter-slug")}> <div class="rounded-2xl p-5 border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent"> <div class="flex items-start gap-3"> <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0"> <span class="material-symbols-outlined text-amber-400 text-[20px]">mail</span> </div> <div class="flex-1 min-w-0"> <p class="text-[10px] font-bold uppercase tracking-wider text-amber-400/70 mb-0.5">Nhận tips hàng tuần</p> <h3 class="text-sm font-bold text-white mb-1">Cập nhật nội dung mới qua email</h3> <p class="text-xs text-on-surface-variant mb-3">Không spam — chỉ gửi khi có bài mới hoặc tips hữu ích từ BS. Vinh.</p> <form id="newsletter-form" class="flex gap-2"> <input type="email" id="newsletter-email" placeholder="email@example.com" required class="flex-1 px-3 py-2 bg-white/5 border border-outline-variant/30 rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-amber-400/50 focus:outline-none text-sm"> <button type="submit" id="newsletter-submit" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-lg transition-colors shrink-0">
Đăng ký
</button> </form> <p id="newsletter-success" class="hidden text-xs text-emerald-400 mt-2"></p> <p id="newsletter-error" class="hidden text-xs text-rose-400 mt-2"></p> </div> </div> </div> </section>  ${renderComponent($$result2, "KeywordAutoLink", $$KeywordAutoLink, { "autoKeywords": autoKeywords })} ${renderScript($$result2, "C:/dentalempireos/src/pages/book/[...slug].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/book/[...slug].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/book/[...slug].astro";
const $$url = "/book/[...slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
