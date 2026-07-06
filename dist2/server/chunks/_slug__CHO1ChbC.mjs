globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, r as renderTemplate, a as addAttribute, F as Fragment, u as unescapeHTML } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$BaseLayout, a as $$StructuredData } from "./BaseLayout_BOB8F8DU.mjs";
import { g } from "./marked.esm_10m2JtFV.mjs";
import { env } from "cloudflare:workers";
import { getPost, getPopularPosts, getCategories as listCategories, getBlocksByPostId, incrementViewCount, getRelatedPosts } from "./blog-db_CoZeeOQQ.mjs";
import { s as sanitizeRichHtml } from "./sanitize_C-b3_hmt.mjs";
const $$BlogSectionNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BlogSectionNav;
  const { items, postTitle = "" } = Astro2.props;
  const h2Count = items.filter((s) => s.level === 2).length;
  const h3Count = items.filter((s) => s.level === 3).length;
  return renderTemplate`<!-- Floating trigger button (mobile only, above bottom nav) -->${maybeRenderHead()}<div id="blog-section-fab" class="lg:hidden fixed right-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-[55] pointer-events-none" data-astro-cid-cztwtgcr> <button id="blog-section-nav-trigger" class="pointer-events-auto w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90 bg-surface border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary" aria-label="Mở mục lục" data-astro-cid-cztwtgcr> <span class="material-symbols-outlined text-lg" data-astro-cid-cztwtgcr>format_list_numbered</span> </button> </div> <!-- Overlay --> <div id="blog-section-nav-overlay" class="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm hidden transition-opacity" aria-hidden="true" data-astro-cid-cztwtgcr></div> <!-- Bottom Sheet Drawer --> <div id="blog-section-nav-sheet" class="blog-section-sheet fixed inset-x-0 bottom-0 z-[95] rounded-t-3xl overflow-hidden flex flex-col shadow-2xl" style="background: var(--color-surface-container-lowest, #1a1a2e); max-height: 80vh;" data-astro-cid-cztwtgcr> <!-- Handle --> <div class="flex justify-center pt-3 pb-2 cursor-pointer select-none" id="blog-section-nav-handle" data-astro-cid-cztwtgcr> <div class="w-10 h-1 rounded-full" style="background: var(--color-outline-variant, #333);" data-astro-cid-cztwtgcr></div> </div> <!-- Header --> <div class="px-5 pb-3 flex items-center justify-between" style="border-bottom: 1px solid var(--color-outline-variant, #333);" data-astro-cid-cztwtgcr> <div data-astro-cid-cztwtgcr> <h3 class="text-sm font-bold flex items-center gap-2" style="color: var(--color-on-surface, #fff);" data-astro-cid-cztwtgcr> <span class="material-symbols-outlined text-primary text-base" data-astro-cid-cztwtgcr>format_list_numbered</span>
Mục lục
</h3> ${postTitle && renderTemplate`<p class="text-[10px] mt-0.5 truncate max-w-[200px]" style="color: var(--color-on-surface-variant, #aaa);" data-astro-cid-cztwtgcr>${postTitle}</p>`} </div> <div class="flex items-center gap-2" data-astro-cid-cztwtgcr> <div class="w-24 h-1.5 rounded-full overflow-hidden" style="background: var(--color-surface-container-high, #252540);" data-astro-cid-cztwtgcr> <div id="blog-section-nav-progress" class="h-full rounded-full" style="width: 0%; background: var(--color-primary, #92ccff); transition: width 0.3s;" data-astro-cid-cztwtgcr></div> </div> <button id="blog-section-nav-close" class="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style="background: var(--color-surface-container-high, #252540);" data-astro-cid-cztwtgcr> <span class="material-symbols-outlined text-base" style="color: var(--color-on-surface-variant, #aaa);" data-astro-cid-cztwtgcr>close</span> </button> </div> </div> <!-- Scrollable section list --> <nav id="blog-section-nav-panel" class="flex-1 overflow-y-auto px-3 py-3" data-astro-cid-cztwtgcr> ${items.map((item) => {
    const indentPx = (item.level - 2) * 16;
    return renderTemplate`<a${addAttribute(`#${item.id}`, "href")} class="flex items-center gap-3 py-2.5 rounded-xl text-sm transition-all border-l-[3px] border-transparent hover:border-primary"${addAttribute(`padding-left: ${12 + indentPx}px; color: var(--color-on-surface-variant, #aaa);`, "style")}${addAttribute(item.id, "data-blog-section-link")} data-astro-cid-cztwtgcr> <span class="shrink-0 text-[11px] font-bold w-5 h-5 rounded flex items-center justify-center text-[10px]"${addAttribute(`background: var(--color-surface-container-high, #252540); color: var(--color-on-surface-variant, #aaa);`, "style")} data-astro-cid-cztwtgcr> ${item.level} </span> <span class="text-xs font-medium" data-astro-cid-cztwtgcr>${item.text}</span> </a>`;
  })} ${items.length === 0 && renderTemplate`<div class="py-8 text-center" data-astro-cid-cztwtgcr> <span class="material-symbols-outlined text-3xl block mb-2 opacity-30" style="color: var(--color-on-surface-variant, #aaa);" data-astro-cid-cztwtgcr>article</span> <p class="text-xs" style="color: var(--color-on-surface-variant, #aaa);" data-astro-cid-cztwtgcr>Chưa có đề mục</p> </div>`} </nav> <!-- Footer --> <div class="px-5 py-3 shrink-0" style="border-top: 1px solid var(--color-outline-variant, #333);" data-astro-cid-cztwtgcr> <p class="text-[10px] font-semibold" style="color: var(--color-on-surface-variant, #aaa);" data-astro-cid-cztwtgcr> ${h2Count} mục chính · ${h3Count} mục con
</p> </div> </div>   ${renderScript($$result, "C:/dentalempireos/src/components/blog/BlogSectionNav.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/blog/BlogSectionNav.astro", void 0);
const $$BlogEbookCta = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BlogEbookCta;
  const { position = "mid", postSlug = "" } = Astro2.props;
  const utmParams = postSlug ? `utm_source=blog&utm_medium=cta&utm_campaign=ebook&utm_content=${postSlug}` : "utm_source=blog&utm_medium=cta&utm_campaign=ebook";
  return renderTemplate`${position === "mid" && renderTemplate`${maybeRenderHead()}<div class="prose-callout my-8 bg-primary/[0.08] border border-primary/20 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-start gap-5"><div class="shrink-0 w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center"><span class="material-symbols-outlined text-primary text-[28px]">menu_book</span></div><div class="flex-1"><h3 class="text-base lg:text-lg font-bold text-white mb-2 leading-snug">
Mục này nằm trong Dental Empire OS — Sách điện tử
</h3><p class="text-sm text-on-surface-variant mb-4 leading-relaxed">
Tìm hiểu đầy đủ chủ đề này trong chương sách chi tiết của chúng tôi, cùng hàng chục chiến lược vận hành phòng khám được đúc kết từ thực tế.
</p><a${addAttribute(`/book?${utmParams}`, "href")} class="inline-flex items-center gap-2 px-5 py-2.5 btn-primary-metallic text-sm font-bold rounded-xl active:scale-95 transition-all"><span class="material-symbols-outlined text-[18px]">download</span>
Đọc ebook miễn phí
</a></div></div>`}${position === "end" && renderTemplate`<div class="my-10 relative rounded-2xl overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-tertiary/15"></div><div class="relative z-10 p-8 lg:p-10 flex flex-col md:flex-row items-start gap-6"><div class="shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20"><span class="material-symbols-outlined text-primary text-[40px] lg:text-[48px]">auto_stories</span></div><div class="flex-1"><h3 class="text-xl lg:text-2xl font-bold text-white mb-3 leading-snug">
Muốn đọc sâu hơn chủ đề này?
</h3><p class="text-sm lg:text-base text-on-surface-variant mb-5 leading-relaxed"><strong class="text-white">Dental Empire OS</strong> — Sách điện tử miễn phí dành cho bác sĩ muốn làm chủ vận hành phòng khám. Hơn 30 chương, hàng trăm chiến lược thực tế, case study phòng khám Việt Nam.
</p><div class="flex flex-col sm:flex-row gap-3"><a${addAttribute(`/book?${utmParams}`, "href")} class="inline-flex items-center justify-center gap-2 px-6 py-3 btn-primary-metallic text-sm font-bold rounded-xl active:scale-95 transition-all"><span class="material-symbols-outlined text-[18px]">auto_stories</span>
Đọc Dental Empire OS
</a><a${addAttribute(`/survey?${utmParams}`, "href")} class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-container-high border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:border-primary hover:text-white transition-all active:scale-95"><span class="material-symbols-outlined text-[18px]">quiz</span>
Làm bài Quiz miễn phí
</a></div></div></div></div>`}`;
}, "C:/dentalempireos/src/components/blog/BlogEbookCta.astro", void 0);
const $$AuthorBio = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AuthorBio;
  const { name } = Astro2.props;
  const isHouse = name === "Dental Empire";
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return renderTemplate`${maybeRenderHead()}<aside class="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5 mt-10"> <div class="shrink-0 w-16 h-16 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center"> <span class="text-lg font-bold text-primary">${initials || "DE"}</span> </div> <div class="flex-1 min-w-0"> <div class="flex flex-wrap items-baseline gap-2 mb-2"> <p class="text-base font-bold text-white">${name}</p> <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
Tác giả
</span> </div> ${isHouse ? renderTemplate`<p class="text-sm text-on-surface-variant leading-relaxed">
Đội ngũ <strong class="text-white">Dental Empire</strong> — chia sẻ kiến thức quản trị nha khoa, mẹo vận hành và case study thực tế từ hệ thống phòng khám trên toàn quốc.
</p>` : renderTemplate`<p class="text-sm text-on-surface-variant leading-relaxed">
Bác sĩ quản lý phòng khám, chia sẻ kinh nghiệm thực chiến trong vận hành và phát triển doanh nghiệp nha khoa.
</p>`} <a href="/about" class="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-primary hover:underline">
Tìm hiểu thêm về chúng tôi
<span class="material-symbols-outlined text-[16px]">arrow_forward</span> </a> </div> </aside>`;
}, "C:/dentalempireos/src/components/blog/AuthorBio.astro", void 0);
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  if (!slug) return Astro2.redirect("/blog");
  const db = env.DB;
  let post = null;
  let popular = [];
  let categories = [];
  try {
    [post, popular, categories] = await Promise.all([
      getPost(db, slug),
      getPopularPosts(db, 5),
      listCategories(db)
    ]);
  } catch {
    try {
      post = await getPost(db, slug);
    } catch {
      post = null;
    }
  }
  if (!post) {
    return new Response("Không tìm thấy bài viết", { status: 404 });
  }
  let blocks = [];
  try {
    blocks = await getBlocksByPostId(db, post.id);
  } catch {
    blocks = [];
  }
  incrementViewCount(db, post.id).catch(() => {
  });
  let related = [];
  try {
    related = await getRelatedPosts(db, post.id, post.category_id, 4);
  } catch {
    related = [];
  }
  let linkedChapter = null;
  let linkedScanner = null;
  if (post.chapter_id) {
    try {
      const ch = await env.DB.prepare('SELECT id, title, chapter_number, slug FROM "chapter" WHERE id = ?').bind(post.chapter_id).first();
      if (ch) linkedChapter = ch;
    } catch {
    }
  }
  if (post.scanner_id) {
    try {
      const sc = await env.DB.prepare('SELECT id, name, description FROM "survey_definition" WHERE id = ?').bind(post.scanner_id).first();
      if (sc) linkedScanner = sc;
    } catch {
    }
  }
  const htmlContent = g(post.content_md);
  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" });
  }
  const tocItems = (() => {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const items = [];
    const source = blocks.length > 0 ? blocks.map((b) => {
      if (b.type === "rich") {
        return b.content.replace(/<h2[^>]*>(.*?)<\/h2>/gi, (_, t) => `## ${t.replace(/<[^>]+>/g, "")}`).replace(/<h3[^>]*>(.*?)<\/h3>/gi, (_, t) => `### ${t.replace(/<[^>]+>/g, "")}`);
      }
      return b.type === "text" ? b.content : "";
    }).join("\n") : post.content_md;
    let match;
    while ((match = headingRegex.exec(source)) !== null) {
      const text = match[2].replace(/[*_`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      items.push({ level: match[1].length, text, id });
    }
    return items;
  })();
  const ogImage = post.cover_url || "/images/og-image.png";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.cover_url ? [post.cover_url] : void 0,
    datePublished: post.published_at,
    dateModified: post.updated_at ?? post.published_at,
    author: {
      "@type": "Person",
      name: post.author_name,
      url: "https://dentalempireos.com/about"
    },
    publisher: {
      "@type": "Organization",
      name: "Dental Empire OS",
      logo: {
        "@type": "ImageObject",
        url: "https://dentalempireos.com/icons/icon-512.png"
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/blog/${post.slug}`, Astro2.site ?? "https://dentalempireos.com").toString()
    },
    articleSection: post.category?.name,
    keywords: post.tags.map((t) => t.name).join(", "),
    inLanguage: "vi"
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
        name: "Blog",
        item: "https://dentalempireos.com/blog"
      },
      ...post.category ? [
        {
          "@type": "ListItem",
          position: 3,
          name: post.category.name,
          item: `https://dentalempireos.com/blog?cat=${post.category.slug}`
        },
        {
          "@type": "ListItem",
          position: 4,
          name: post.title,
          item: new URL(`/blog/${post.slug}`, Astro2.site ?? "https://dentalempireos.com").toString()
        }
      ] : [
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: new URL(`/blog/${post.slug}`, Astro2.site ?? "https://dentalempireos.com").toString()
        }
      ]
    ]
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${post.title} | Blog Dental Empire`, "description": post.description, "ogImage": ogImage, "ogImageAlt": post.title, "ogType": "article" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "StructuredData", $$StructuredData, { "type": "article", "data": articleSchema })} ${renderComponent($$result2, "StructuredData", $$StructuredData, { "type": "breadcrumb", "data": breadcrumbSchema })}  ${maybeRenderHead()}<div id="read-progress" class="fixed top-20 left-0 h-0.5 read-progress z-50" style="width: 0"></div>  <section class="relative py-8 sm:py-12 overflow-hidden"> ${post.cover_url && renderTemplate`<div class="absolute inset-0"> <img${addAttribute(post.cover_url, "src")}${addAttribute(post.cover_alt, "alt")} class="w-full h-full object-cover opacity-20"> <div class="absolute inset-0 bg-gradient-to-b from-surface via-surface/80 to-surface"></div> </div>`} ${!post.cover_url && renderTemplate`<div class="absolute inset-0 bg-gradient-to-b from-surface-container-lowest to-surface"></div>`} <div class="relative z-10 px-6 xl:max-w-[1200px] xl:mx-auto max-w-[800px] mx-auto text-center xl:text-left xl:max-w-none"> <!-- Breadcrumb --> <div class="flex items-center justify-center gap-2 text-xs text-on-surface-variant mb-6"> <a href="/" class="hover:text-primary transition-colors">Home</a> <span class="material-symbols-outlined text-[12px]">chevron_right</span> <a href="/blog" class="hover:text-primary transition-colors">Blog</a> ${post.category && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span class="material-symbols-outlined text-[12px]">chevron_right</span> <a${addAttribute(`/blog?cat=${post.category.slug}`, "href")} class="hover:text-primary transition-colors"${addAttribute(`color: ${post.category.color}`, "style")}> ${post.category.name} </a> ` })}`} </div> <!-- Category badge --> ${post.category && renderTemplate`<a${addAttribute(`/blog?cat=${post.category.slug}`, "href")} class="inline-block mb-4"> <span class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full"${addAttribute(`background: ${post.category.color}22; color: ${post.category.color}; border: 1px solid ${post.category.color}44`, "style")}> ${post.category.name} </span> </a>`} <h1 class="text-headline-medium font-bold text-white mb-4 leading-tight"> ${post.title} </h1> <p class="text-on-surface-variant text-base mb-6">${post.description}</p> <!-- Meta --> <div class="flex flex-wrap items-center justify-center xl:justify-start gap-x-4 gap-y-2 text-sm text-on-surface-variant"> <div class="flex items-center gap-2"> <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"> <span class="text-xs font-bold text-primary">${post.author_name.charAt(0)}</span> </div> <span class="font-semibold text-white">${post.author_name}</span> </div> <span class="opacity-40 hidden sm:inline">·</span> <span class="flex items-center gap-1"> <span class="material-symbols-outlined text-[16px]">calendar_today</span> <time${addAttribute(post.published_at ?? "", "datetime")}>${formatDate(post.published_at)}</time> </span> <span class="opacity-40 hidden sm:inline">·</span> <span class="flex items-center gap-1"> <span class="material-symbols-outlined text-[16px]">schedule</span> ${post.read_time_minutes} phút đọc
</span> ${post.updated_at && post.published_at && new Date(post.updated_at) > new Date(post.published_at) && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span class="opacity-40 hidden sm:inline">·</span> <span class="flex items-center gap-1 text-primary font-semibold"${addAttribute(`Cập nhật lần cuối: ${formatDate(post.updated_at)}`, "title")}> <span class="material-symbols-outlined text-[16px]">edit</span>
Cập nhật: ${formatDate(post.updated_at)} </span> ` })}`} <span class="opacity-40 hidden sm:inline">·</span> <span class="flex items-center gap-1"> <span class="material-symbols-outlined text-[16px]">visibility</span> ${post.view_count.toLocaleString()} </span> </div> ${post.tags.length > 0 && renderTemplate`<div class="flex flex-wrap gap-2 mt-4 justify-center xl:justify-start"> ${post.tags.map((tag) => renderTemplate`<a${addAttribute(`/blog?tag=${tag.slug}`, "href")} class="px-2.5 py-1 text-xs font-semibold rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant hover:border-primary transition-all">
#${tag.name} </a>`)} </div>`} </div> </section>  <section class="px-6 max-w-[1200px] mx-auto pb-16"> <div class="flex flex-col lg:flex-row gap-10"> <!-- TOC (desktop sidebar) --> ${tocItems.length > 2 && renderTemplate`<aside class="hidden lg:block w-64 shrink-0"> <div class="sticky top-28"> <div class="glass-card rounded-2xl p-4"> <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-2"> <span class="material-symbols-outlined text-[16px]">list</span>
Mục lục
</h3> <nav class="space-y-1"> ${tocItems.map((item) => renderTemplate`<a${addAttribute(`#${item.id}`, "href")} class="block text-sm py-2 border-l-2 border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 toc-item"${addAttribute(item.level === 3 ? "padding-left: 1.5rem" : "padding-left: 0.75rem", "style")}${addAttribute(item.id, "data-id")}> ${item.text} </a>`)} </nav> </div> </div> </aside>`} <!-- Content --> <article class="flex-1 min-w-0 max-w-[760px]"> <div class="glass-card rounded-2xl px-5 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10"> <div class="reader-content" id="article-content"> ${blocks.length > 0 ? renderTemplate`<div class="blocks-render flex flex-col gap-6" id="blocks-container"${addAttribute(post.id, "data-post-id")}> ${blocks.map((block) => {
    if (block.type === "text") {
      return renderTemplate`<div class="block-text">${unescapeHTML(g(block.content))}</div>`;
    } else if (block.type === "image") {
      const parsed = (() => {
        try {
          return JSON.parse(block.content);
        } catch {
          return { url: block.content, alt: "" };
        }
      })();
      return parsed.url ? renderTemplate`<figure class="block-image my-4"> <img${addAttribute(parsed.url, "src")}${addAttribute(parsed.alt || "", "alt")} class="w-full rounded-xl object-cover" loading="lazy"> ${parsed.alt && renderTemplate`<figcaption class="text-center text-xs text-on-surface-variant mt-2">${parsed.alt}</figcaption>`} </figure>` : null;
    } else if (block.type === "form") {
      const cfg = (() => {
        try {
          return JSON.parse(block.content);
        } catch {
          return { title: "", fields: [] };
        }
      })();
      return renderTemplate`<div class="block-form my-4 p-6 bg-surface-container rounded-2xl border border-outline-variant"> ${cfg.title && renderTemplate`<h3 class="text-base font-bold text-white mb-4">${cfg.title}</h3>`} <form class="form-render flex flex-col gap-3" data-action="/api/contact"> ${cfg.fields.map((field) => renderTemplate`<div class="flex flex-col gap-1"> <label class="text-xs font-semibold text-on-surface-variant">${field.label}${field.required && renderTemplate`<span class="text-red-400 ml-1">*</span>`}</label> ${field.type === "textarea" ? renderTemplate`<textarea${addAttribute(field.id, "name")}${addAttribute(field.placeholder || "", "placeholder")}${addAttribute(field.required, "required")} rows="4" class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary resize-none"></textarea>` : renderTemplate`<input${addAttribute(field.type === "phone" ? "tel" : field.type, "type")}${addAttribute(field.id, "name")}${addAttribute(field.placeholder || "", "placeholder")}${addAttribute(field.required, "required")} class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary">`} </div>`)} <button type="submit" class="mt-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">Gửi</button> </form> </div>`;
    } else if (block.type === "rich") {
      return renderTemplate`<div class="block-rich">${unescapeHTML(sanitizeRichHtml(block.content))}</div>`;
    }
    return null;
  })} </div>` : renderTemplate`<div>${unescapeHTML(htmlContent)}</div>`} </div> </div> <!-- In-body CTA + Author + End CTA --> ${renderComponent($$result2, "BlogEbookCta", $$BlogEbookCta, { "position": "mid", "postSlug": post.slug })} ${renderComponent($$result2, "AuthorBio", $$AuthorBio, { "name": post.author_name })} ${renderComponent($$result2, "BlogEbookCta", $$BlogEbookCta, { "position": "end", "postSlug": post.slug })} <!-- Share --> <div class="flex items-center justify-between mt-6 glass-card rounded-2xl p-5"> <div> <p class="text-sm font-semibold text-white mb-1">Chia sẻ bài viết</p> <div class="flex gap-2 mt-2 flex-wrap"> <a${addAttribute(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(Astro2.url.href)}`, "href")} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên Facebook" class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all"> <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg> </a> <a${addAttribute(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(Astro2.url.href)}`, "href")} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ lên LinkedIn" class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all"> <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path> </svg> </a> <a${addAttribute(`https://sp.zalo.me/share_inline?url=${encodeURIComponent(Astro2.url.href)}&title=${encodeURIComponent(post.title)}`, "href")} target="_blank" rel="noopener noreferrer" aria-label="Chia sẻ qua Zalo" class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all"> <svg class="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 48 48" aria-hidden="true"> <path d="M24 4C12.954 4 4 11.611 4 21.24c0 5.802 3.061 10.945 7.852 14.31-.284 1.078-1.045 3.389-1.232 4.146-.18.728.255.733.563.508.247-.18 2.886-1.802 4.236-2.61C18.6 38.51 21.236 39 24 39c11.046 0 20-7.611 20-17.76C44 11.611 35.046 4 24 4z"></path> </svg> </a> <button type="button" id="copy-link-btn" aria-label="Sao chép liên kết" class="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all"${addAttribute(Astro2.url.href, "data-url")}> <span class="material-symbols-outlined text-[18px]">link</span> </button> </div> </div> <a href="/blog" class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"> <span class="material-symbols-outlined text-[18px]">arrow_back</span>
Quay lại blog
</a> </div> <!-- Linked Content CTAs --> ${(linkedChapter || linkedScanner) && renderTemplate`<div class="mt-6 space-y-4"> ${linkedChapter && renderTemplate`<a${addAttribute(`/book/${linkedChapter.slug}`, "href")} class="block glass-card rounded-2xl p-5 border border-primary/20 hover:border-primary/50 transition-all group"> <div class="flex items-start gap-4"> <div class="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"> <span class="material-symbols-outlined text-2xl text-primary">menu_book</span> </div> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-1"> <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/10 border border-primary/20 text-primary">SÁCH</span> <span class="text-[10px] text-on-surface-variant">Chương ${linkedChapter.chapter_number}</span> </div> <h3 class="font-bold text-white group-hover:text-primary transition-colors">${linkedChapter.title}</h3> <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">Tìm hiểu đầy đủ chủ đề này trong chương sách chi tiết của chúng tôi, cùng hàng chục chiến lược vận hành phòng khám được đúc kết từ thực tế.</p> <div class="flex items-center gap-1 mt-2 text-primary text-xs font-bold"> <span>Đọc chương sách</span> <span class="material-symbols-outlined text-[14px]">arrow_forward</span> </div> </div> </div> </a>`} ${linkedScanner && renderTemplate`<a${addAttribute(`/app/${linkedScanner.id}`, "href")} class="block glass-card rounded-2xl p-5 border border-tertiary/20 hover:border-tertiary/50 transition-all group"> <div class="flex items-start gap-4"> <div class="w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center shrink-0"> <span class="material-symbols-outlined text-2xl text-tertiary">quiz</span> </div> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-1"> <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary">BÀI TEST</span> </div> <h3 class="font-bold text-white group-hover:text-tertiary transition-colors">${linkedScanner.name}</h3> <p class="text-xs text-on-surface-variant mt-1 line-clamp-2">${linkedScanner.description || "Làm bài test để đánh giá kiến thức và nhận kết quả chi tiết."}</p> <div class="flex items-center gap-1 mt-2 text-tertiary text-xs font-bold"> <span>Làm bài test</span> <span class="material-symbols-outlined text-[14px]">arrow_forward</span> </div> </div> </div> </a>`} </div>`} <!-- Related Posts --> ${related.length > 0 && renderTemplate`<div class="mt-10"> <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
Bài viết liên quan
</h2> <div class="grid grid-cols-1 sm:grid-cols-2 gap-5"> ${related.map((r) => renderTemplate`<a${addAttribute(`/blog/${r.slug}`, "href")} class="group"> <article class="glass-card rounded-2xl overflow-hidden flex hover:-translate-y-1 transition-all duration-300"> ${r.cover_url ? renderTemplate`<img${addAttribute(r.cover_url, "src")}${addAttribute(r.cover_alt, "alt")} class="w-24 h-24 object-cover shrink-0 group-hover:scale-105 transition-transform duration-500" loading="lazy">` : renderTemplate`<div class="w-24 h-24 shrink-0 bg-gradient-to-br from-primary/30 to-tertiary/20"></div>`} <div class="p-4 flex flex-col justify-center min-w-0"> ${r.category && renderTemplate`<span class="text-[10px] font-bold uppercase tracking-wider"${addAttribute(`color: ${r.category.color}`, "style")}> ${r.category.name} </span>`} <h3 class="text-sm font-bold text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug mt-1"> ${r.title} </h3> <div class="flex items-center gap-2 mt-2 text-[11px] text-on-surface-variant"> <span>${r.read_time_minutes} phút</span> <span>·</span> <span>${r.view_count.toLocaleString()} lượt xem</span> </div> </div> </article> </a>`)} </div> </div>`} </article> </div> </section>  ${tocItems.length > 2 && renderTemplate`${renderComponent($$result2, "BlogSectionNav", $$BlogSectionNav, { "items": tocItems, "postTitle": post.title })}`}` })} ${renderScript($$result, "C:/dentalempireos/src/pages/blog/[slug].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/blog/[slug].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/blog/[slug].astro";
const $$url = "/blog/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
