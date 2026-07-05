globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_CMqveNVP.mjs";
import { env } from "cloudflare:workers";
import { listPosts } from "./blog-db_CoZeeOQQ.mjs";
import { l as listResources } from "./resource-db_vN7y6pUI.mjs";
import { k as listPublishedChapters } from "./book-db_DDcc_FYk.mjs";
import { g as getTierLabel } from "./collection-helpers_Dwl6Qbgw.mjs";
const prerender = false;
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Search;
  const db = env.DB;
  const q = Astro2.url.searchParams.get("q") ?? "";
  let blogPosts = [];
  let resources = [];
  let chapters = [];
  if (q.trim()) {
    const [blogResult, resResult, chapResult] = await Promise.all([
      listPosts(db, { search: q, limit: 20 }),
      listResources(db, { search: q }),
      listPublishedChapters(db)
    ]);
    blogPosts = blogResult.posts;
    resources = resResult;
    const lq = q.toLowerCase();
    chapters = chapResult.filter(
      (ch) => ch.title.toLowerCase().includes(lq)
    );
  }
  const totalResults = blogPosts.length + resources.length + chapters.length;
  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": q ? `Tìm kiếm "${q}" | Dental Empire OS` : "Tìm kiếm | Dental Empire OS", "description": "Tìm kiếm bài viết, tài nguyên, và nội dung E-book trên Dental Empire OS." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative py-14 overflow-hidden"> <div class="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface"></div> <div class="relative z-10 px-6 max-w-[700px] mx-auto text-center space-y-5"> <h1 class="text-headline-large font-bold text-white"> <span class="material-symbols-outlined text-primary align-middle mr-1">search</span>
Tìm kiếm
</h1> <form method="get" class="w-full"> <div class="relative"> <input type="text" name="q"${addAttribute(q, "value")} placeholder="Nhập từ khóa..." autofocus class="w-full pl-12 pr-12 py-4 bg-surface-container-high border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none text-white text-lg placeholder:text-white/30"> <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span> ${q && renderTemplate`<a href="/search" class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"> <span class="material-symbols-outlined text-[22px]">close</span> </a>`} </div> </form> ${q && renderTemplate`<p class="text-sm text-on-surface-variant"> ${totalResults > 0 ? `Tìm thấy <strong class="text-white">${totalResults}</strong> kết quả cho "<strong class="text-white">${q}</strong>"` : `Không tìm thấy kết quả nào cho "<strong class="text-white">${q}</strong>"`} </p>`} </div> </section> <section class="px-6 max-w-[1200px] mx-auto pb-20 space-y-12">  ${blogPosts.length > 0 && renderTemplate`<div> <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">newsmode</span>
Blog
<span class="text-xs font-normal text-on-surface-variant">(${blogPosts.length})</span> </h2> <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"> ${blogPosts.map((post) => renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="group"> <article class="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-all duration-300"> <div class="relative h-40 overflow-hidden"> ${post.cover_url ? renderTemplate`<img${addAttribute(post.cover_url, "src")}${addAttribute(post.cover_alt, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">` : renderTemplate`<div class="w-full h-full bg-gradient-to-br from-primary/20 to-tertiary/10"></div>`} </div> <div class="p-4 flex flex-col flex-1"> ${post.category && renderTemplate`<span class="inline-block text-[10px] font-bold uppercase tracking-wider mb-1.5"${addAttribute(`color: ${post.category.color}`, "style")}> ${post.category.name} </span>`} <h3 class="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5"> ${post.title} </h3> <p class="text-xs text-on-surface-variant line-clamp-2 flex-1">${post.description}</p> <div class="flex items-center gap-3 text-[11px] text-on-surface-variant mt-3 pt-2 border-t border-outline-variant/50"> <span>${formatDate(post.published_at)}</span> <span>${post.read_time_minutes} phút đọc</span> </div> </div> </article> </a>`)} </div> </div>`}  ${resources.length > 0 && renderTemplate`<div> <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">folder_open</span>
Tài nguyên
<span class="text-xs font-normal text-on-surface-variant">(${resources.length})</span> </h2> <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"> ${resources.map((res) => {
    function resourceUrl(fileUrl) {
      if (!fileUrl) return "#";
      if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) return fileUrl;
      return `/media/${fileUrl}`;
    }
    return renderTemplate`<a${addAttribute(resourceUrl(res.file_url), "href")} class="glass-card rounded-2xl p-5 flex items-start gap-4 hover:-translate-y-0.5 transition-all group"> <span class="material-symbols-outlined text-3xl text-primary shrink-0 mt-0.5"> ${res.icon || "description"} </span> <div class="min-w-0 flex-1"> <h3 class="font-bold text-white text-sm line-clamp-2 group-hover:text-primary transition-colors"> ${res.title} </h3> <p class="text-xs text-on-surface-variant line-clamp-2 mt-1">${res.description}</p> <div class="flex items-center gap-2 mt-2"> <span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-surface-container-high text-on-surface-variant uppercase"> ${res.file_ext} </span> ${res.tag && renderTemplate`<span class="text-[10px] text-on-surface-variant">#${res.tag}</span>`} </div> </div> </a>`;
  })} </div> </div>`}  ${chapters.length > 0 && renderTemplate`<div> <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">menu_book</span>
E-book
<span class="text-xs font-normal text-on-surface-variant">(${chapters.length})</span> </h2> <div class="space-y-2"> ${chapters.map((ch) => renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")} class="glass-card rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-surface-container-high transition-all group"> <span class="material-symbols-outlined text-primary text-[20px] shrink-0">description</span> <div class="min-w-0 flex-1"> <h3 class="font-semibold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors"> ${ch.title} </h3> <div class="flex items-center gap-2 mt-0.5"> <span${addAttribute([
    "px-2 py-0.5 text-[10px] font-bold uppercase rounded-full",
    ch.tier === 1 ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"
  ], "class:list")}> ${getTierLabel(ch.tier)} </span> </div> </div> <span class="material-symbols-outlined text-on-surface-variant/40 text-[18px] shrink-0 group-hover:text-primary transition-colors">
arrow_forward
</span> </a>`)} </div> </div>`}  ${q && totalResults === 0 && renderTemplate`<div class="text-center py-20"> <span class="material-symbols-outlined text-[64px] text-on-surface-variant/20">search_off</span> <p class="text-on-surface-variant mt-4 text-lg">Không tìm thấy kết quả phù hợp</p> <p class="text-on-surface-variant/60 text-sm mt-2">Thử từ khóa khác hoặc kiểm tra lại chính tả</p> </div>`}  ${!q && renderTemplate`<div class="text-center py-20"> <span class="material-symbols-outlined text-[64px] text-on-surface-variant/20">manage_search</span> <p class="text-on-surface-variant mt-4 text-lg">Nhập từ khóa để tìm kiếm</p> <div class="flex flex-wrap justify-center gap-2 mt-6"> <a href="/blog?q=implant" class="px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant text-sm text-on-surface-variant hover:border-primary hover:text-white transition-all">
implant
</a> <a href="/blog?q=SOP" class="px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant text-sm text-on-surface-variant hover:border-primary hover:text-white transition-all">
SOP
</a> <a href="/search?q=quản trị" class="px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant text-sm text-on-surface-variant hover:border-primary hover:text-white transition-all">
quản trị
</a> <a href="/search?q=nhân sự" class="px-4 py-2 rounded-full bg-surface-container-high border border-outline-variant text-sm text-on-surface-variant hover:border-primary hover:text-white transition-all">
nhân sự
</a> </div> </div>`} </section> ` })}`;
}, "C:/dentalempireos/src/pages/search.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/search.astro";
const $$url = "/search";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
