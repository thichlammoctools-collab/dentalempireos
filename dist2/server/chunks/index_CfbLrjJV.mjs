globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CSH0S1kB.mjs";
import { env } from "cloudflare:workers";
import { a as listApps } from "./app-db_BINE4Y41.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let apps = [];
  try {
    apps = await listApps(env.DB);
  } catch {
    apps = [];
  }
  const typeLabels = {
    survey: "Khảo sát",
    ebook_ai: "Ebook AI",
    course_ai: "Khóa học AI",
    tool: "Công cụ",
    generator: "Tạo nội dung"
  };
  const typeIcons = {
    survey: "quiz",
    ebook_ai: "menu_book",
    course_ai: "school",
    tool: "build",
    generator: "auto_awesome"
  };
  const typeColors = {
    survey: "bg-purple-500/20 text-purple-300",
    ebook_ai: "bg-blue-500/20 text-blue-300",
    course_ai: "bg-green-500/20 text-green-300",
    tool: "bg-amber-500/20 text-amber-300",
    generator: "bg-pink-500/20 text-pink-300"
  };
  const statusLabels = {
    draft: "Bản nháp",
    active: "Đang hoạt động",
    archived: "Lưu trữ"
  };
  const statusColors = {
    draft: "bg-gray-500/20 text-gray-400",
    active: "bg-green-500/20 text-green-300",
    archived: "bg-red-500/20 text-red-300"
  };
  const statusDotColors = {
    draft: "bg-gray-400",
    active: "bg-green-400",
    archived: "bg-red-400"
  };
  const totalApps = apps.length;
  const activeApps = apps.filter((a) => a.status === "active").length;
  const draftApps = apps.filter((a) => a.status === "draft").length;
  const freeApps = apps.filter((a) => a.is_free === 1).length;
  function formatDate(s) {
    return new Date(s).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function getInitials(name) {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }
  const avatarColors = [
    "from-blue-600 to-cyan-600",
    "from-purple-600 to-pink-600",
    "from-emerald-600 to-teal-600",
    "from-amber-600 to-orange-600",
    "from-rose-600 to-red-600"
  ];
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Ứng dụng AI", "data-astro-cid-srpfpfxd": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6" data-astro-cid-srpfpfxd> <!-- Header --> <div class="flex items-center justify-between" data-astro-cid-srpfpfxd> <div data-astro-cid-srpfpfxd> <h1 class="text-2xl font-bold text-on-surface tracking-tight" data-astro-cid-srpfpfxd>Ứng dụng AI</h1> <p class="text-sm text-on-surface-variant/70 mt-1" data-astro-cid-srpfpfxd>Quản lý các ứng dụng AI — cấu hình, prompt, trạng thái</p> </div> <button id="open-create-modal" class="btn-primary-metallic bg-primary text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[20px]" data-astro-cid-srpfpfxd>add</span>
Tạo ứng dụng
</button> </div> <!-- Stat cards --> <div class="grid grid-cols-2 lg:grid-cols-4 gap-4" data-astro-cid-srpfpfxd> <div class="glass-card rounded-2xl p-4 group" data-astro-cid-srpfpfxd> <div class="flex items-center justify-between mb-3" data-astro-cid-srpfpfxd> <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50" data-astro-cid-srpfpfxd>Tổng cộng</span> <div class="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-primary text-[18px]" data-astro-cid-srpfpfxd>apps</span> </div> </div> <p class="text-3xl font-bold text-on-surface" data-astro-cid-srpfpfxd>${totalApps}</p> <p class="text-xs text-on-surface-variant/50 mt-1" data-astro-cid-srpfpfxd>ứng dụng đã tạo</p> </div> <div class="glass-card rounded-2xl p-4 group" data-astro-cid-srpfpfxd> <div class="flex items-center justify-between mb-3" data-astro-cid-srpfpfxd> <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50" data-astro-cid-srpfpfxd>Đang hoạt động</span> <div class="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-green-400 text-[18px]" data-astro-cid-srpfpfxd>check_circle</span> </div> </div> <p class="text-3xl font-bold text-green-300" data-astro-cid-srpfpfxd>${activeApps}</p> <p class="text-xs text-on-surface-variant/50 mt-1" data-astro-cid-srpfpfxd>sẵn sàng sử dụng</p> </div> <div class="glass-card rounded-2xl p-4 group" data-astro-cid-srpfpfxd> <div class="flex items-center justify-between mb-3" data-astro-cid-srpfpfxd> <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50" data-astro-cid-srpfpfxd>Bản nháp</span> <div class="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-amber-400 text-[18px]" data-astro-cid-srpfpfxd>edit_note</span> </div> </div> <p class="text-3xl font-bold text-amber-300" data-astro-cid-srpfpfxd>${draftApps}</p> <p class="text-xs text-on-surface-variant/50 mt-1" data-astro-cid-srpfpfxd>đang chỉnh sửa</p> </div> <div class="glass-card rounded-2xl p-4 group" data-astro-cid-srpfpfxd> <div class="flex items-center justify-between mb-3" data-astro-cid-srpfpfxd> <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/50" data-astro-cid-srpfpfxd>Miễn phí</span> <div class="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-cyan-400 text-[18px]" data-astro-cid-srpfpfxd>volunteer_activism</span> </div> </div> <p class="text-3xl font-bold text-cyan-300" data-astro-cid-srpfpfxd>${freeApps}</p> <p class="text-xs text-on-surface-variant/50 mt-1" data-astro-cid-srpfpfxd>không cần thanh toán</p> </div> </div> <!-- Apps table --> <div class="glass-card rounded-2xl overflow-hidden" data-astro-cid-srpfpfxd> ${apps.length > 0 && renderTemplate`<div class="px-5 py-3.5 border-b border-outline-variant/15 flex items-center justify-between" data-astro-cid-srpfpfxd> <div class="flex items-center gap-2" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-on-surface-variant/50 text-[18px]" data-astro-cid-srpfpfxd>robot_2</span> <span class="text-sm font-semibold text-on-surface/80" data-astro-cid-srpfpfxd>Danh sách ứng dụng</span> <span class="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary" data-astro-cid-srpfpfxd>${totalApps}</span> </div> </div>`} ${apps.length === 0 ? (
    /* Empty state — enhanced */
    renderTemplate`<div class="py-20 px-6 text-center" data-astro-cid-srpfpfxd> <div class="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-primary/60 text-[40px]" data-astro-cid-srpfpfxd>smart_toy</span> </div> <h3 class="text-lg font-bold text-on-surface/80 mb-2" data-astro-cid-srpfpfxd>Chưa có ứng dụng AI nào</h3> <p class="text-sm text-on-surface-variant/50 max-w-sm mx-auto mb-6 leading-relaxed" data-astro-cid-srpfpfxd>
Bắt đầu tạo ứng dụng AI đầu tiên để quản lý prompt, cấu hình model và trạng thái hoạt động.
</p> <button id="open-create-modal-empty" class="btn-primary-metallic bg-primary text-white px-5 py-2.5 rounded-xl font-semibold inline-flex items-center gap-2" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[20px]" data-astro-cid-srpfpfxd>add</span>
Tạo ứng dụng đầu tiên
</button> </div>`
  ) : renderTemplate`<table class="w-full text-sm" data-astro-cid-srpfpfxd> <thead data-astro-cid-srpfpfxd> <tr class="border-b border-outline-variant/15 text-on-surface-variant/70" data-astro-cid-srpfpfxd> <th class="text-left py-3 px-5 font-semibold text-xs uppercase tracking-wider" data-astro-cid-srpfpfxd>Ứng dụng</th> <th class="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" data-astro-cid-srpfpfxd>Loại</th> <th class="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" data-astro-cid-srpfpfxd>Trạng thái</th> <th class="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" data-astro-cid-srpfpfxd>Giá</th> <th class="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider" data-astro-cid-srpfpfxd>Ngày tạo</th> <th class="text-right py-3 px-5 font-semibold text-xs uppercase tracking-wider" data-astro-cid-srpfpfxd>Thao tác</th> </tr> </thead> <tbody class="divide-y divide-outline-variant/10" data-astro-cid-srpfpfxd> ${apps.map((app, i) => renderTemplate`<tr class="hover:bg-primary/[0.03] transition-colors duration-150 group" data-astro-cid-srpfpfxd> <td class="py-3.5 px-5" data-astro-cid-srpfpfxd> <a${addAttribute(`/admin/apps/${app.id}`, "href")} class="flex items-center gap-3 group/link" data-astro-cid-srpfpfxd> <div${addAttribute(`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20`, "class")} data-astro-cid-srpfpfxd> <span class="text-white text-xs font-bold" data-astro-cid-srpfpfxd>${getInitials(app.name)}</span> </div> <div class="min-w-0" data-astro-cid-srpfpfxd> <span class="text-on-surface font-semibold group-hover/link:text-primary transition-colors block truncate" data-astro-cid-srpfpfxd> ${app.name} </span> <span class="text-xs text-on-surface-variant/50 font-mono" data-astro-cid-srpfpfxd>/${app.slug}</span> </div> </a> </td> <td class="py-3.5 px-4" data-astro-cid-srpfpfxd> <span${addAttribute(`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${typeColors[app.type] ?? "bg-gray-500/20 text-gray-400"}`, "class")} data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[14px]" data-astro-cid-srpfpfxd>${typeIcons[app.type] ?? "category"}</span> ${typeLabels[app.type] ?? app.type} </span> </td> <td class="py-3.5 px-4" data-astro-cid-srpfpfxd> <span${addAttribute(`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[app.status] ?? "bg-gray-500/20 text-gray-400"}`, "class")} data-astro-cid-srpfpfxd> <span${addAttribute(`w-1.5 h-1.5 rounded-full ${statusDotColors[app.status] ?? "bg-gray-400"} flex-shrink-0`, "class")} data-astro-cid-srpfpfxd></span> ${statusLabels[app.status] ?? app.status} </span> </td> <td class="py-3.5 px-4" data-astro-cid-srpfpfxd> ${app.is_free ? renderTemplate`<span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-400" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[16px]" data-astro-cid-srpfpfxd>volunteer_activism</span>
Miễn phí
</span>` : renderTemplate`<span class="inline-flex items-center gap-1 text-xs font-medium text-amber-400" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[16px]" data-astro-cid-srpfpfxd>paid</span>
Trả phí
</span>`} </td> <td class="py-3.5 px-4 text-on-surface-variant/60 text-xs" data-astro-cid-srpfpfxd> ${formatDate(app.created_at)} </td> <td class="py-3.5 px-5" data-astro-cid-srpfpfxd> <div class="flex items-center gap-1.5" data-astro-cid-srpfpfxd> ${app.status === "active" && renderTemplate`<a${addAttribute(app.type === "survey" ? `/scanner/${app.slug}` : `/app/${app.slug}`, "href")} target="_blank" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold transition-all" title="Mở công cụ" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[14px]" data-astro-cid-srpfpfxd>open_in_new</span>
Mở
</a>`} <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150 ml-auto" data-astro-cid-srpfpfxd> <a${addAttribute(`/admin/apps/${app.id}`, "href")} class="btn-icon w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all" title="Chỉnh sửa" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[18px]" data-astro-cid-srpfpfxd>edit</span> </a> <button class="delete-btn btn-icon w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-all"${addAttribute(app.id, "data-id")}${addAttribute(app.name, "data-name")} title="Xóa" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[18px]" data-astro-cid-srpfpfxd>delete</span> </button> </div> </div> </td> </tr>`)} </tbody> </table>`} </div> </div>  <div id="create-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/0" data-astro-cid-srpfpfxd> <!-- Backdrop --> <div id="create-modal-backdrop" class="absolute inset-0 bg-black/0 backdrop-blur-none transition-all duration-300" data-astro-cid-srpfpfxd></div> <!-- Panel --> <div id="create-modal-panel" class="relative glass-card rounded-2xl p-6 w-full max-w-md mx-4 space-y-4 shadow-2xl shadow-black/40 scale-95 opacity-0 transition-all duration-300 ease-out" data-astro-cid-srpfpfxd> <div class="flex items-center justify-between mb-1" data-astro-cid-srpfpfxd> <h2 class="text-lg font-bold text-on-surface" data-astro-cid-srpfpfxd>Tạo ứng dụng AI mới</h2> <button id="close-create-modal" class="btn-icon w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[20px]" data-astro-cid-srpfpfxd>close</span> </button> </div> <form id="create-form" class="space-y-4" data-astro-cid-srpfpfxd> <div data-astro-cid-srpfpfxd> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5" data-astro-cid-srpfpfxd>Tên ứng dụng <span class="text-tertiary" data-astro-cid-srpfpfxd>*</span></label> <input type="text" name="name" required placeholder="VD: Khảo sát sức khỏe răng miệng" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/30" data-astro-cid-srpfpfxd> </div> <div data-astro-cid-srpfpfxd> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5" data-astro-cid-srpfpfxd>Slug</label> <input type="text" name="slug" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/30" placeholder="tự tạo từ tên" data-astro-cid-srpfpfxd> </div> <div data-astro-cid-srpfpfxd> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5" data-astro-cid-srpfpfxd>Loại <span class="text-tertiary" data-astro-cid-srpfpfxd>*</span></label> <select name="type" required class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" data-astro-cid-srpfpfxd> <option value="" data-astro-cid-srpfpfxd>— Chọn loại —</option> <option value="survey" data-astro-cid-srpfpfxd>Khảo sát (Survey)</option> <option value="ebook_ai" data-astro-cid-srpfpfxd>Ebook AI</option> <option value="course_ai" data-astro-cid-srpfpfxd>Khóa học AI</option> <option value="tool" data-astro-cid-srpfpfxd>Công cụ (Tool)</option> <option value="generator" data-astro-cid-srpfpfxd>Tạo nội dung (Generator)</option> </select> </div> <div data-astro-cid-srpfpfxd> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5" data-astro-cid-srpfpfxd>Mô tả</label> <textarea name="description" rows="2" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/30 resize-none" placeholder="Mô tả ngắn về ứng dụng..." data-astro-cid-srpfpfxd></textarea> </div> <div data-astro-cid-srpfpfxd> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5" data-astro-cid-srpfpfxd>Trạng thái</label> <select name="status" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" data-astro-cid-srpfpfxd> <option value="draft" data-astro-cid-srpfpfxd>Bản nháp</option> <option value="active" data-astro-cid-srpfpfxd>Đang hoạt động</option> </select> </div> <div class="flex items-center gap-2.5 py-1" data-astro-cid-srpfpfxd> <input type="checkbox" name="is_free" id="is_free" class="accent-primary w-4 h-4 rounded" data-astro-cid-srpfpfxd> <label for="is_free" class="text-sm text-on-surface-variant cursor-pointer" data-astro-cid-srpfpfxd>Miễn phí (không cần thanh toán)</label> </div> <div class="flex gap-3 pt-2" data-astro-cid-srpfpfxd> <button type="submit" id="submit-create" class="flex-1 btn-primary-metallic bg-primary text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2" data-astro-cid-srpfpfxd> <span class="material-symbols-outlined text-[18px]" data-astro-cid-srpfpfxd>add</span>
Tạo mới
</button> <button type="button" id="close-create-modal-2" class="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all text-sm font-medium" data-astro-cid-srpfpfxd>
Hủy
</button> </div> </form> </div> </div> ${renderScript($$result2, "C:/dentalempireos/src/pages/admin/apps/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/admin/apps/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/apps/index.astro";
const $$url = "/admin/apps";
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
