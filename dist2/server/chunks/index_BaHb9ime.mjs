globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CSH0S1kB.mjs";
import { $ as $$StatCard } from "./StatCard_B3AnrmIR.mjs";
import { env } from "cloudflare:workers";
import { l as listChapters } from "./book-db_DDcc_FYk.mjs";
import { a as resources } from "./resources_CSvvhQvX.mjs";
const $$PipelineItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PipelineItem;
  const { title, meta, status, statusNote, icon = "description", thumb, href = "#" } = Astro2.props;
  const statusStyles = {
    published: { text: "text-primary", bg: "bg-primary/10", label: "Published" },
    scheduled: { text: "text-tertiary", bg: "bg-tertiary/10", label: "Scheduled" },
    draft: { text: "text-on-surface-variant", bg: "bg-surface-variant", label: "Draft" }
  };
  const s = statusStyles[status];
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-lg border border-outline-variant/10 hover:border-primary/30 transition-all cursor-pointer group"> <div class="flex items-center gap-6"> <div class="w-12 h-12 rounded bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant/15 shrink-0"> ${thumb ? renderTemplate`<img${addAttribute(thumb, "src")} alt="" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" loading="lazy">` : renderTemplate`<div class="w-full h-full flex items-center justify-center bg-surface-variant text-on-surface-variant"> <span class="material-symbols-outlined">${icon}</span> </div>`} </div> <div class="min-w-0"> <h5 class="text-base text-white font-semibold truncate">${title}</h5> <p class="text-sm text-on-surface-variant/70 truncate">${meta}</p> </div> </div> <div class="flex items-center gap-6 shrink-0"> <div class="flex flex-col items-end"> <span${addAttribute(`text-[10px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded ${s.text} ${s.bg}`, "class")}> ${s.label} </span> <span class="text-[12px] text-on-surface-variant mt-0.5">${statusNote}</span> </div> <span class="material-symbols-outlined text-on-surface-variant group-hover:text-white transition-colors">
more_vert
</span> </div> </a>`;
}, "C:/dentalempireos/src/components/admin/PipelineItem.astro", void 0);
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const chapters = await listChapters(env.DB);
  const totalChapters = chapters.length;
  const publishedChapters = chapters.filter((c) => c.status === "published").length;
  const draftChapters = totalChapters - publishedChapters;
  const totalResources = resources.length;
  const recentPublished = chapters.find((c) => c.status === "published");
  const firstDraft = chapters.find((c) => c.status === "draft");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard | Dental Empire Admin" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <h2 class="text-3xl md:text-[32px] leading-tight font-bold text-white mb-1">Knowledge Hub Dashboard</h2> <p class="text-base text-on-surface-variant">
Welcome back, Admin. Hệ thống nội dung đang vận hành ổn định.
</p> </div> <div class="flex items-center gap-3 bg-surface-container-high px-6 py-3 rounded-xl border border-outline-variant/15 self-start md:self-auto"> <div class="status-dot text-primary bg-primary"></div> <span class="text-[12px] font-bold tracking-[0.1em] uppercase text-primary">
System Online · Live Data
</span> </div> </div>  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"> ${renderComponent($$result2, "StatCard", $$StatCard, { "icon": "menu_book", "label": "Tổng số chương", "value": String(totalChapters), "trend": "3 Tier", "trendDir": "flat", "accent": "primary", "progress": 100 })} ${renderComponent($$result2, "StatCard", $$StatCard, { "icon": "task_alt", "label": "Đã xuất bản", "value": String(publishedChapters), "trend": `${Math.round(publishedChapters / totalChapters * 100)}%`, "trendDir": "up", "accent": "primary", "progress": publishedChapters / totalChapters * 100 })} ${renderComponent($$result2, "StatCard", $$StatCard, { "icon": "edit_note", "label": "Bản nháp", "value": String(draftChapters), "trend": `${Math.round(draftChapters / totalChapters * 100)}%`, "trendDir": "flat", "accent": "tertiary", "progress": draftChapters / totalChapters * 100 })} ${renderComponent($$result2, "StatCard", $$StatCard, { "icon": "folder_shared", "label": "Tài nguyên miễn phí", "value": String(totalResources), "trend": `${resources.filter((r) => r.tier === "premium").length} Premium`, "trendDir": "up", "accent": "error", "progress": totalResources / 12 * 100 })} </div>  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6"> <!-- Content Pipeline --> <div class="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col gap-6"> <div class="flex flex-wrap items-center justify-between gap-3"> <h3 class="text-xl font-bold text-white">Content Pipeline</h3> <div class="flex flex-wrap gap-2"> <span class="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold tracking-[0.1em] uppercase text-on-surface-variant border border-outline-variant/15">
All (${totalChapters})
</span> <span class="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase text-primary border border-primary/20">
Published (${publishedChapters})
</span> <span class="px-3 py-1 bg-tertiary/10 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase text-tertiary border border-tertiary/20">
Drafts (${draftChapters})
</span> </div> </div> <div class="flex flex-col gap-2"> ${recentPublished && renderTemplate`${renderComponent($$result2, "PipelineItem", $$PipelineItem, { "title": `Chapter ${recentPublished.chapter_no}: ${recentPublished.title}`, "meta": `Tier ${recentPublished.tier} · ${recentPublished.description ?? ""}`, "status": "published", "statusNote": "Đang hoạt động", "icon": "menu_book", "href": `/book/${recentPublished.id}` })}`} ${firstDraft && renderTemplate`${renderComponent($$result2, "PipelineItem", $$PipelineItem, { "title": `Chapter ${firstDraft.chapter_no}: ${firstDraft.title}`, "meta": firstDraft.description ?? "", "status": "draft", "statusNote": "Chưa hoàn thiện", "icon": "description", "href": `/admin/ebooks/${firstDraft.id}` })}`} ${totalChapters === 0 && renderTemplate`${renderComponent($$result2, "PipelineItem", $$PipelineItem, { "title": "Chưa có chương nào", "meta": "Bấm 'Thêm chương mới' để bắt đầu", "status": "scheduled", "statusNote": "Khởi tạo", "icon": "schedule", "href": "/admin/ebooks/new" })}`} </div> <a href="/admin/ebooks" class="w-full py-3 border border-dashed border-outline-variant/30 rounded-lg text-on-surface-variant text-sm hover:border-primary/50 hover:text-primary transition-all text-center">
+ Xem toàn bộ pipeline
</a> </div> <!-- Right rail: Quick Actions + Activity --> <div class="flex flex-col gap-6"> <h3 class="text-xl font-bold text-white px-2">Quick Actions</h3> <div class="grid grid-cols-2 gap-4"> <a href="/admin/ebooks/new" class="glass-card aspect-square rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-all active:scale-95"> <span class="material-symbols-outlined text-primary text-[32px] group-hover:scale-110 transition-transform">menu_book</span> <span class="text-[10px] text-center text-on-surface-variant uppercase tracking-[0.1em] font-bold px-2">Thêm chương mới</span> </a> <a href="/admin/ebooks" class="glass-card aspect-square rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-tertiary/50 transition-all active:scale-95"> <span class="material-symbols-outlined text-tertiary text-[32px] group-hover:scale-110 transition-transform">edit_note</span> <span class="text-[10px] text-center text-on-surface-variant uppercase tracking-[0.1em] font-bold px-2">Xem bản nháp</span> </a> <a href="/admin/resources" class="glass-card aspect-square rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-primary/50 transition-all active:scale-95"> <span class="material-symbols-outlined text-primary text-[32px] group-hover:scale-110 transition-transform">folder_shared</span> <span class="text-[10px] text-center text-on-surface-variant uppercase tracking-[0.1em] font-bold px-2">Quản lý Resources</span> </a> <a href="/" class="glass-card aspect-square rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-error/50 transition-all active:scale-95"> <span class="material-symbols-outlined text-error text-[32px] group-hover:scale-110 transition-transform">visibility</span> <span class="text-[10px] text-center text-on-surface-variant uppercase tracking-[0.1em] font-bold px-2">Preview Site</span> </a> </div> <!-- Activity Feed --> <div class="glass-card rounded-xl p-6 flex flex-col gap-4 flex-1"> <div class="flex items-center justify-between"> <h4 class="text-base font-bold text-white">Hoạt động gần đây</h4> <span class="material-symbols-outlined text-on-surface-variant text-sm">history</span> </div> <div class="flex flex-col gap-4"> <div class="flex gap-3"> <div class="w-1 h-8 bg-primary rounded-full shrink-0"></div> <div class="flex flex-col"> <p class="text-[13px] text-white leading-snug">
Đã xuất bản <span class="text-primary underline">Chapter ${recentPublished?.chapter ?? 1}</span> </p> <span class="text-[10px] tracking-[0.1em] uppercase font-bold text-on-surface-variant">2 phút trước</span> </div> </div> <div class="flex gap-3"> <div class="w-1 h-8 bg-tertiary rounded-full shrink-0"></div> <div class="flex flex-col"> <p class="text-[13px] text-white leading-snug">
Bản nháp mới: <span class="text-tertiary underline">${firstDraft?.title ?? "New chapter"}</span> </p> <span class="text-[10px] tracking-[0.1em] uppercase font-bold text-on-surface-variant">14 phút trước</span> </div> </div> <div class="flex gap-3"> <div class="w-1 h-8 bg-on-surface-variant rounded-full shrink-0"></div> <div class="flex flex-col"> <p class="text-[13px] text-white leading-snug">
Tài nguyên <span class="underline">${resources[0]?.title}</span> được cập nhật
</p> <span class="text-[10px] tracking-[0.1em] uppercase font-bold text-on-surface-variant">1 giờ trước</span> </div> </div> </div> </div> </div> </div>  <div class="glass-card rounded-xl p-6 flex flex-col gap-6 h-80 relative overflow-hidden"> <div class="flex justify-between items-center relative z-10"> <div> <h3 class="text-xl font-bold text-white">Traffic Analytics</h3> <p class="text-sm text-on-surface-variant">Lượt truy cập trong 7 ngày qua (mẫu)</p> </div> <select class="bg-surface-container border border-outline-variant/30 text-on-surface-variant text-sm rounded-lg px-3 py-1 focus:ring-1 focus:ring-primary focus:border-primary outline-none"> <option>7 ngày qua</option> <option>30 ngày qua</option> <option>Tất cả</option> </select> </div> <div class="flex-1 w-full relative flex items-end gap-2 px-2 pb-4"> ${[
    { label: "T2", val: 1240, h: 60 },
    { label: "T3", val: 890, h: 45 },
    { label: "T4", val: 2105, h: 85, peak: true },
    { label: "T5", val: 1640, h: 70 },
    { label: "T6", val: 1120, h: 55 },
    { label: "T7", val: 650, h: 30 },
    { label: "CN", val: 720, h: 40 }
  ].map((d) => renderTemplate`<div class="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-lg relative group"${addAttribute(`height: ${d.h}%`, "style")}> ${d.peak && renderTemplate`<div class="absolute inset-0 bg-primary/30 cyan-glow animate-pulse rounded-t-lg"></div>`} <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"> ${d.label}: ${d.val.toLocaleString("vi-VN")} </div> </div>`)} </div> </div> ` })}`;
}, "C:/dentalempireos/src/pages/admin/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/index.astro";
const $$url = "/admin";
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
