globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CSH0S1kB.mjs";
import { env } from "cloudflare:workers";
import { listPosts, getCategories as listCategories, getTags as listTags } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const db = env.DB;
  const page2 = Math.max(1, parseInt(Astro2.url.searchParams.get("page") ?? "1", 10));
  const perPage = 20;
  const status = Astro2.url.searchParams.get("status") ?? "all";
  const categorySlug = Astro2.url.searchParams.get("cat") ?? "";
  const search = Astro2.url.searchParams.get("q") ?? "";
  const [{ posts, total }, categories, tags] = await Promise.all([
    listPosts(db, {
      limit: perPage,
      offset: (page2 - 1) * perPage,
      search: search || void 0,
      sort: "recent"
    }),
    listCategories(db),
    listTags(db)
  ]);
  const totalPages = Math.ceil(total / perPage);
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
  }
  const statusLabels = {
    all: "Tất cả",
    published: "Đã xuất bản",
    draft: "Bản nháp"
  };
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Blog | Dental Empire Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <h2 class="text-3xl font-bold text-white mb-1">Quản lý Blog</h2> <p class="text-on-surface-variant"> ${total} bài viết · ${publishedCount} đã xuất bản · ${draftCount} bản nháp
</p> </div> <div class="flex gap-3"> <a href="/admin/blog/categories" class="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">folder_open</span>
Chuyên mục
</a> <a href="/admin/blog/tags" class="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">tag</span>
Tags
</a> <a href="/admin/blog/new" class="bg-primary-container text-white px-6 py-3 rounded-xl font-bold cyan-glow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto"> <span class="material-symbols-outlined text-[20px]">add</span> <span class="text-sm">Viết bài mới</span> </a> </div> </div>  <div class="flex flex-wrap items-center gap-2"> ${["all", "published", "draft"].map((s) => renderTemplate`<a${addAttribute(`/admin/blog?status=${s}&q=${search}`, "href")}${addAttribute(`filter-chip px-4 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${status === s ? "bg-primary text-white border-primary" : "bg-surface-container-high text-on-surface-variant border-outline-variant"}`, "class")}> ${statusLabels[s]} (${s === "all" ? total : s === "published" ? publishedCount : draftCount})
</a>`)} <div class="h-5 w-px bg-outline-variant mx-1"></div> <!-- Category filter --> <select id="cat-filter" class="px-3 py-1.5 bg-surface-container-high border border-outline-variant rounded-full text-xs font-semibold text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer"> <option value="">Tất cả chuyên mục</option> ${categories.map((cat) => renderTemplate`<option${addAttribute(cat.slug, "value")}${addAttribute(categorySlug === cat.slug, "selected")}>${cat.name}</option>`)} </select> <!-- Search --> <form method="get" class="flex-1 min-w-0 max-w-xs"> <input type="hidden" name="status"${addAttribute(status, "value")}> <div class="relative"> <input type="text" name="q"${addAttribute(search, "value")} placeholder="Tìm tiêu đề..." class="w-full pl-9 pr-3 py-1.5 bg-surface-container-high border border-outline-variant rounded-xl text-xs text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none"> <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span> </div> </form> </div>  ${posts.length === 0 ? renderTemplate`<div class="text-center py-16 glass-card rounded-xl"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/40">newsmode</span> <p class="text-on-surface-variant mt-3">Chưa có bài viết nào</p> <a href="/admin/blog/new" class="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">+ Viết bài đầu tiên</a> </div>` : renderTemplate`<div class="glass-card rounded-xl overflow-hidden"> <table class="w-full"> <thead> <tr class="border-b border-outline-variant/50"> <th class="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Bài viết</th> <th class="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Chuyên mục</th> <th class="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Tags</th> <th class="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Trạng thái</th> <th class="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">Ngày đăng</th> <th class="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Lượt xem</th> <th class="px-4 py-3"></th> </tr> </thead> <tbody class="divide-y divide-outline-variant/20"> ${posts.map((post) => renderTemplate`<tr class="hover:bg-surface-container-high/50 transition-colors group"> <td class="px-4 py-3"> <div class="flex items-center gap-3"> ${post.cover_url ? renderTemplate`<img${addAttribute(post.cover_url, "src")}${addAttribute(post.cover_alt, "alt")} class="w-12 h-12 rounded-lg object-cover shrink-0">` : renderTemplate`<div class="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-tertiary/20 shrink-0"></div>`} <div class="min-w-0"> <p class="font-semibold text-white text-sm truncate max-w-[200px]">${post.title}</p> <div class="flex items-center gap-2 mt-0.5"> ${post.is_featured === 1 && renderTemplate`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded text-yellow-400 bg-yellow-400/10">Nổi bật</span>`} ${post.is_pinned === 1 && renderTemplate`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded text-tertiary bg-tertiary/10">Ghim</span>`} ${post.is_recommended === 1 && renderTemplate`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded text-primary bg-primary/10">Recommend</span>`} </div> </div> </div> </td> <td class="px-4 py-3 hidden md:table-cell"> ${post.category ? renderTemplate`<span class="text-xs font-semibold"${addAttribute(`color: ${post.category.color}`, "style")}> ${post.category.name} </span>` : renderTemplate`<span class="text-xs text-on-surface-variant/50">—</span>`} </td> <td class="px-4 py-3 hidden lg:table-cell"> <div class="flex flex-wrap gap-1"> ${post.tags.slice(0, 2).map((tag) => renderTemplate`<span class="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
#${tag.name} </span>`)} ${post.tags.length > 2 && renderTemplate`<span class="text-[10px] text-on-surface-variant">+${post.tags.length - 2}</span>`} </div> </td> <td class="px-4 py-3"> <span${addAttribute(`text-xs font-bold px-2 py-1 rounded-full ${post.status === "published" ? "text-green-400 bg-green-400/10" : "text-on-surface-variant bg-surface-container-high"}`, "class")}> ${post.status === "published" ? "Đã xuất bản" : "Bản nháp"} </span> </td> <td class="px-4 py-3 text-xs text-on-surface-variant hidden sm:table-cell"> ${formatDate(post.published_at)} </td> <td class="px-4 py-3 text-xs text-on-surface-variant hidden md:table-cell"> ${post.view_count.toLocaleString()} </td> <td class="px-4 py-3"> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"> ${post.status === "published" && renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} target="_blank" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all" title="Xem"> <span class="material-symbols-outlined text-[16px]">visibility</span> </a>`} <a${addAttribute(`/admin/blog/${post.id}`, "href")} class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all" title="Sửa"> <span class="material-symbols-outlined text-[16px]">edit</span> </a> <button type="button"${addAttribute(post.id, "data-delete-post")} class="p-1.5 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 transition-all" title="Xóa"> <span class="material-symbols-outlined text-[16px]">delete</span> </button> </div> </td> </tr>`)} </tbody> </table> </div>`} ${totalPages > 1 && renderTemplate`<div class="flex items-center justify-center gap-2"> ${page2 > 1 && renderTemplate`<a${addAttribute(`/admin/blog?page=${page2 - 1}&status=${status}&q=${search}`, "href")} class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:border-primary transition-all"> <span class="material-symbols-outlined text-[20px]">chevron_left</span> </a>`} <span class="px-4 py-2 text-sm text-on-surface-variant">
Trang ${page2} / ${totalPages} </span> ${page2 < totalPages && renderTemplate`<a${addAttribute(`/admin/blog?page=${page2 + 1}&status=${status}&q=${search}`, "href")} class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:border-primary transition-all"> <span class="material-symbols-outlined text-[20px]">chevron_right</span> </a>`} </div>`}` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/blog/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/blog/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/blog/index.astro";
const $$url = "/admin/blog";
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
