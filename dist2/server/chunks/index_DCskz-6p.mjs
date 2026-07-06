globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute, F as Fragment } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout, a as $$StructuredData } from "./BaseLayout_NhufuOWg.mjs";
import { env } from "cloudflare:workers";
import { getCategoryBySlug, getCategories as listCategories, getTags as listTags, getPopularPosts, buildCategoryTree, listPosts } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const { category: categorySlug } = Astro2.params;
  if (!categorySlug) return Astro2.redirect("/blog");
  const db = env.DB;
  const page2 = Math.max(1, parseInt(Astro2.url.searchParams.get("page") ?? "1", 10));
  const perPage = 12;
  const sort = Astro2.url.searchParams.get("sort") ?? "recent";
  const [category, flatCategories, tags, popular] = await Promise.all([
    getCategoryBySlug(db, categorySlug),
    listCategories(db),
    listTags(db),
    getPopularPosts(db, 5)
  ]);
  if (!category) {
    return new Response("Không tìm thấy chuyên mục", { status: 404 });
  }
  const categoryTree = buildCategoryTree(flatCategories);
  const currentNode = categoryTree.find((c) => c.slug === categorySlug);
  const descendantSlugs = [categorySlug];
  if (currentNode) {
    for (const child of currentNode.children) {
      descendantSlugs.push(child.slug);
    }
  }
  const [{ posts, total }, popularInCategory] = await Promise.all([
    listPosts(db, {
      limit: perPage,
      offset: (page2 - 1) * perPage,
      categoryId: categorySlug,
      sort
    }),
    listPosts(db, { limit: 5, sort: "popular", categoryId: categorySlug })
  ]);
  const totalPages = Math.ceil(total / perPage);
  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
  }
  const canonicalURL = new URL(`/blog/category/${categorySlug}`, Astro2.site ?? "https://dentalempireos.com");
  const siteOrigin = Astro2.site?.origin ?? "https://dentalempireos.com";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${siteOrigin}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteOrigin}/blog` },
      { "@type": "ListItem", position: 3, name: category.name, item: canonicalURL.toString() }
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${category.name} | Blog Dental Empire OS`, "description": category.description || `Bài viết về ${category.name} từ Dental Empire OS.`, "ogImage": category.icon ? void 0 : void 0, "noindex": false }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "StructuredData", $$StructuredData, { "type": "breadcrumb", "data": breadcrumbSchema })}  ${maybeRenderHead()}<section class="relative py-12 sm:py-16 overflow-hidden"> ${category.color && renderTemplate`<div class="absolute inset-0 opacity-10"${addAttribute(`background: radial-gradient(ellipse at 50% 0%, ${category.color} 0%, transparent 70%)`, "style")}></div>`} <div class="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface"></div> <div class="relative z-10 px-6 max-w-[1200px] mx-auto"> <!-- Breadcrumb --> <nav class="flex items-center justify-center gap-2 text-xs text-on-surface-variant mb-6" aria-label="Breadcrumb"> <a href="/" class="hover:text-primary transition-colors">Trang chủ</a> <span class="material-symbols-outlined text-[12px]">chevron_right</span> <a href="/blog" class="hover:text-primary transition-colors">Blog</a> <span class="material-symbols-outlined text-[12px]">chevron_right</span> <span class="text-white font-semibold"${addAttribute(category.color ? `color: ${category.color}` : "", "style")}>${category.name}</span> </nav> <!-- Category icon + name --> <div class="text-center space-y-4"> ${category.icon && renderTemplate`<div class="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-2"${addAttribute(`background: ${category.color}22; border: 1px solid ${category.color}44`, "style")}> ${category.icon} </div>`} <h1 class="text-headline-large font-bold text-white"> ${category.name} </h1> ${category.description && renderTemplate`<p class="text-on-surface-variant max-w-xl mx-auto">${category.description}</p>`} <p class="text-sm text-on-surface-variant"> ${total} bài viết
${currentNode && currentNode.children.length > 0 && renderTemplate`<span> · ${currentNode.children.length} chuyên mục con</span>`} </p> </div> </div> </section>  <section class="px-6 max-w-[1200px] mx-auto py-8"> <div class="flex flex-col lg:flex-row gap-8"> <!-- Left: Posts --> <div class="flex-1 min-w-0"> <!-- Subcategory pills --> ${currentNode && currentNode.children.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mb-6"> <a${addAttribute(`/blog/category/${categorySlug}`, "href")} class="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95"${addAttribute(`background: ${category.color}; border-color: ${category.color}; color: white;`, "style")}>
Tất cả
</a> ${currentNode.children.map((sub) => renderTemplate`<a${addAttribute(`/blog/category/${sub.slug}`, "href")} class="px-4 py-1.5 rounded-full text-xs font-semibold border border-outline-variant text-on-surface-variant hover:border-primary hover:text-white transition-all active:scale-95"> ${sub.name} <span class="opacity-60 ml-1">(${sub.post_count})</span> </a>`)} </div>`} <!-- Sort bar --> <div class="flex flex-wrap items-center gap-3 mb-6"> <button type="button" data-sort="recent"${addAttribute(`px-4 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${sort === "recent" ? "bg-primary text-white border-primary" : "bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-primary"}`, "class")}>
Mới nhất
</button> <button type="button" data-sort="popular"${addAttribute(`px-4 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${sort === "popular" ? "bg-primary text-white border-primary" : "bg-surface-container-high text-on-surface-variant border-outline-variant hover:border-primary"}`, "class")}>
Phổ biến
</button> </div> <!-- Posts Grid --> ${posts.length === 0 ? renderTemplate`<div class="text-center py-20 glass-card rounded-2xl"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">newsmode</span> <p class="text-on-surface-variant mt-4">Chưa có bài viết nào trong chuyên mục này.</p> <a href="/blog" class="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Xem tất cả bài</a> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"> ${posts.map((post) => renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="group"> <article class="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-all duration-300">  <div class="relative h-44 overflow-hidden"> ${post.cover_url ? renderTemplate`<img${addAttribute(post.cover_url, "src")}${addAttribute(post.cover_alt, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">` : renderTemplate`<div class="w-full h-full"${addAttribute(`background: linear-gradient(135deg, ${category.color}33, ${category.color}11)`, "style")}></div>`} ${post.is_pinned === 1 && renderTemplate`<div class="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-tertiary/90 text-white text-[10px] font-bold uppercase rounded-full"> <span class="material-symbols-outlined text-[11px]">push_pin</span>
Ghim
</div>`} ${post.is_recommended === 1 && renderTemplate`<div class="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-primary/90 text-white text-[10px] font-bold uppercase rounded-full"> <span class="material-symbols-outlined text-[11px]">recommend</span>
Recommend
</div>`} </div>  <div class="p-4 flex flex-col flex-1"> ${post.category && renderTemplate`<span class="inline-block text-[10px] font-bold uppercase tracking-wider mb-2"${addAttribute(`color: ${post.category.color}`, "style")}> ${post.category.name} </span>`} <h2 class="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2"> ${post.title} </h2> <p class="text-xs text-on-surface-variant line-clamp-2 flex-1">${post.description}</p> ${post.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-1.5 mt-3"> ${post.tags.slice(0, 3).map((tag) => renderTemplate`<span class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant">
#${tag.name} </span>`)} </div>`} <div class="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/50"> <div class="flex items-center gap-1 text-[11px] text-on-surface-variant"> <span class="material-symbols-outlined text-[13px]">calendar_today</span> ${formatDate(post.published_at)} </div> <div class="flex items-center gap-1 text-[11px] text-on-surface-variant"> <span class="material-symbols-outlined text-[13px]">schedule</span> ${post.read_time_minutes} phút
</div> </div> </div> </article> </a>`)} </div>  ${totalPages > 1 && renderTemplate`<div class="flex items-center justify-center gap-2 mt-10"> ${page2 > 1 && renderTemplate`<a${addAttribute(`/blog/category/${categorySlug}?page=${page2 - 1}&sort=${sort}`, "href")} class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95"> <span class="material-symbols-outlined text-[20px]">chevron_left</span> </a>`} ${Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    const p = i + 1;
    return renderTemplate`<a${addAttribute(`/blog/category/${categorySlug}?page=${p}&sort=${sort}`, "href")}${addAttribute(`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all active:scale-95 ${p === page2 ? "bg-primary text-white" : "bg-surface-container-high border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"}`, "class")}> ${p} </a>`;
  })} ${page2 < totalPages && renderTemplate`<a${addAttribute(`/blog/category/${categorySlug}?page=${page2 + 1}&sort=${sort}`, "href")} class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all active:scale-95"> <span class="material-symbols-outlined text-[20px]">chevron_right</span> </a>`} </div>`}` })}`} </div> <!-- Right: Sidebar --> <aside class="w-full lg:w-72 shrink-0 space-y-6">  <div class="glass-card rounded-2xl p-5"> <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">folder_open</span>
Chuyên mục
</h3> <ul class="space-y-1"> <li> <a href="/blog" class="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-all"> <span>Tất cả</span> </a> </li> ${categoryTree.map((cat) => renderTemplate`<li> <a${addAttribute(`/blog/category/${cat.slug}`, "href")}${addAttribute(`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all group ${categorySlug === cat.slug ? "bg-primary/10 text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"}`, "class")}> <div class="flex items-center gap-2"> <span class="w-2 h-2 rounded-full shrink-0"${addAttribute(`background: ${cat.color}`, "style")}></span> <span>${cat.name}</span> </div> <span class="text-xs opacity-60">${cat.total_post_count}</span> </a> ${cat.children.length > 0 && renderTemplate`<ul class="mt-1 space-y-0.5"> ${cat.children.map((sub) => renderTemplate`<li> <a${addAttribute(`/blog/category/${sub.slug}`, "href")}${addAttribute(`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group ${categorySlug === sub.slug ? "bg-primary/10 text-primary font-semibold" : "text-on-surface-variant hover:bg-surface-container-high hover:text-white"}`, "class")}> <div class="flex items-center gap-2 pl-4"> <span class="w-1.5 h-1.5 rounded-full shrink-0"${addAttribute(`background: ${sub.color}`, "style")}></span> <span class="truncate">${sub.name}</span> </div> <span class="text-xs opacity-60">${sub.post_count}</span> </a> </li>`)} </ul>`} </li>`)} </ul> </div>  ${popularInCategory.length > 0 && renderTemplate`<div class="glass-card rounded-2xl p-5"> <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">trending_up</span>
Phổ biến trong ${category.name} </h3> <div class="space-y-3"> ${popularInCategory.map((post, i) => renderTemplate`<a${addAttribute(`/blog/${post.slug}`, "href")} class="flex items-start gap-3 group"> <span class="text-2xl font-black text-outline-variant/30 leading-none mt-1 w-6 shrink-0 group-hover:text-primary transition-colors"> ${String(i + 1).padStart(2, "0")} </span> <div class="flex-1 min-w-0"> ${post.category && renderTemplate`<span class="text-[10px] font-bold uppercase tracking-wider"${addAttribute(`color: ${post.category.color}`, "style")}> ${post.category.name} </span>`} <p class="text-sm font-semibold text-white/80 line-clamp-2 group-hover:text-primary transition-colors leading-snug mt-0.5"> ${post.title} </p> <div class="flex items-center gap-2 mt-1"> <span class="text-[10px] text-on-surface-variant">${post.view_count.toLocaleString()} lượt xem</span> </div> </div> </a>`)} </div> </div>`}  ${tags.length > 0 && renderTemplate`<div class="glass-card rounded-2xl p-5"> <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">tag</span>
Tags
</h3> <div class="flex flex-wrap gap-2"> ${tags.map((tag) => renderTemplate`<a${addAttribute(`/blog?tag=${tag.slug}`, "href")} class="px-3 py-1.5 text-xs font-semibold rounded-full border border-outline-variant text-on-surface-variant hover:border-primary hover:text-white transition-all active:scale-95">
#${tag.name} </a>`)} </div> </div>`}  <div class="glass-card rounded-2xl p-5"> <h3 class="text-sm font-bold text-white mb-2 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">rss_feed</span>
RSS Feed
</h3> <p class="text-xs text-on-surface-variant mb-4">Theo dõi bài viết mới qua RSS reader.</p> <a href="/rss.xml" target="_blank" rel="noopener" class="w-full py-2.5 btn-primary-metallic text-sm font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"> <span class="material-symbols-outlined text-[18px]">rss_feed</span>
Đăng ký RSS
</a> </div> </aside> </div> </section> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/blog/category/[category]/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/blog/category/[category]/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/blog/category/[category]/index.astro";
const $$url = "/blog/category/[category]";
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
