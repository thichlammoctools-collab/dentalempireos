globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CSH0S1kB.mjs";
import { env } from "cloudflare:workers";
import { l as listSurveyDefinitions, e as countResponsesBySurvey } from "./survey-config-db_AxTlbaW3.mjs";
import { S as SEED_REGISTRY } from "./registry_DJyaE1zC.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let definitions = [];
  try {
    definitions = await listSurveyDefinitions(env.DB);
  } catch {
    definitions = [];
  }
  const existingIds = new Set(definitions.map((d) => d.id));
  const responseCounts = /* @__PURE__ */ new Map();
  for (const def of definitions) {
    try {
      responseCounts.set(def.id, await countResponsesBySurvey(env.DB, def.id));
    } catch {
      responseCounts.set(def.id, 0);
    }
  }
  const bundledSeeds = Object.values(SEED_REGISTRY).map((s) => ({
    id: s.id,
    slug: s.slug,
    title_vi: s.title_vi,
    type: s.survey_type ?? "full",
    is_free: s.is_free ?? 0,
    sections: s.sections.length,
    questions: s.sections.reduce((sum, sec) => sum + sec.questions.length, 0),
    inDb: existingIds.has(s.id)
  }));
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
  const typeLabels = {
    mini: "Mini",
    full: "Full",
    checklist: "Checklist"
  };
  const typeColors = {
    mini: "bg-blue-500/20 text-blue-300",
    full: "bg-purple-500/20 text-purple-300",
    checklist: "bg-amber-500/20 text-amber-300"
  };
  function formatDate(s) {
    return new Date(s).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
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
  const totalDefs = definitions.length;
  const activeDefs = definitions.filter((d) => d.status === "active").length;
  const draftDefs = definitions.filter((d) => d.status === "draft").length;
  const archivedDefs = definitions.filter((d) => d.status === "archived").length;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Scanners", "searchPlaceholder": "Tìm scanner..." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<header class="flex flex-wrap items-center justify-between gap-3 mb-5"> <div> <div class="flex items-center gap-2 mb-0.5"> <h1 class="text-xl font-bold text-on-surface">Scanners</h1> <span class="text-xs font-mono bg-surface-container border border-outline-variant/30 rounded-md px-2 py-0.5 text-on-surface-variant"> <span class="text-green-400">${activeDefs}</span> <span class="text-on-surface-variant/40">/</span> <span>${totalDefs}</span> ${draftDefs > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<span class="text-on-surface-variant/40"> · </span><span class="text-gray-400">${draftDefs} nháp</span>` })}`} ${archivedDefs > 0 && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<span class="text-on-surface-variant/40"> · </span><span class="text-red-400">${archivedDefs} lưu</span>` })}`} </span> </div> <p class="text-xs text-on-surface-variant hidden sm:block">
Máy quét / khảo sát tự chẩn đoán — bộ câu hỏi + AI analysis theo framework sách.
</p> </div> <div class="flex gap-2 flex-wrap items-center"> ${bundledSeeds.length > 0 && renderTemplate`<div class="flex items-center gap-1.5 text-xs text-on-surface-variant"> <span class="material-symbols-outlined text-primary text-[14px]">inventory_2</span> <span>${bundledSeeds.filter((s) => !s.inDb).length} mới</span> </div>`} <button type="button" id="btn-create" class="bg-primary-container text-white px-4 py-2 rounded-xl font-bold text-sm cyan-glow hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"> <span class="material-symbols-outlined text-[16px]">add</span>
Tạo mới
</button> </div> </header>  ${bundledSeeds.length > 0 && renderTemplate`<div class="mb-5 flex flex-col gap-2"> <div class="flex items-center gap-1.5"> <span class="material-symbols-outlined text-primary text-[14px]">inventory_2</span> <span class="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Seed từ thư viện</span> </div> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5"> ${bundledSeeds.map((seed) => renderTemplate`<div${addAttribute(`rounded-lg p-2 border flex flex-col gap-1 ${seed.inDb ? "bg-surface-container border-outline-variant/30" : "bg-surface border-primary/20"}`, "class")}> <div class="flex items-start justify-between gap-1"> <p class="text-xs font-semibold text-on-surface truncate flex-1 leading-tight">${seed.title_vi}</p> ${seed.inDb ? renderTemplate`<span class="material-symbols-outlined text-green-400 text-[12px] shrink-0">check_circle</span>` : renderTemplate`<span class="material-symbols-outlined text-amber-400 text-[12px] shrink-0">new_releases</span>`} </div> <div class="flex items-center gap-1 text-[10px] text-on-surface-variant"> <span class="px-1 py-0.5 rounded bg-surface-high font-semibold text-[9px]">${seed.type}</span> <span>${seed.sections}s · ${seed.questions}q</span> ${seed.is_free === 1 && renderTemplate`<span class="text-green-400 font-semibold">Free</span>`} </div> <div class="flex gap-1 mt-0.5"> <a${addAttribute(`/scanner/${seed.slug}`, "href")} target="_blank" rel="noopener" class="flex-1 px-1.5 py-1 rounded text-[10px] font-semibold bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-center transition-colors" title="Xem public"> <span class="material-symbols-outlined text-[11px] align-bottom">visibility</span> </a> <button type="button"${addAttribute(`flex-1 px-1.5 py-1 rounded text-[10px] font-semibold transition-colors flex items-center justify-center gap-1 ${seed.inDb ? "bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container" : "bg-primary-container text-white cyan-glow hover:opacity-90 active:scale-95"}`, "class")}${addAttribute(seed.id, "data-seed-id")}${addAttribute(seed.title_vi, "data-seed-name")}${addAttribute(seed.inDb ? "1" : "0", "data-reimport")}> <span class="material-symbols-outlined text-[11px] align-bottom">${seed.inDb ? "refresh" : "download"}</span> ${seed.inDb ? "Re" : "Import"} </button> </div> </div>`)} </div> </div>`} ${definitions.length === 0 && renderTemplate`<div class="glass-card rounded-2xl p-12 text-center"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">fact_check</span> <p class="text-on-surface font-semibold mt-4">Chưa có scanner nào</p> <p class="text-sm text-on-surface-variant mt-2">
Bắt đầu bằng cách seed bộ câu hỏi mặc định "Hồ Sơ Gốc Rễ" hoặc tạo mới.
</p> <div class="flex gap-2 justify-center mt-6"> <button type="button" id="btn-seed-default-2" class="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm cyan-glow hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">download</span>
Seed "Hồ Sơ Gốc Rễ"
</button> <button type="button" id="btn-create-2" class="bg-surface-container border border-outline-variant/30 text-on-surface px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-colors">
Tạo mới
</button> </div> </div>`} ${definitions.length > 0 && renderTemplate`<div class="glass-card rounded-xl border border-outline-variant/20 overflow-hidden"> <table class="w-full"> <thead> <tr class="border-b border-outline-variant/15"> <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">Scanner</th> <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden md:table-cell">Loại</th> <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden sm:table-cell">Trạng thái</th> <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden lg:table-cell">Responses</th> <th class="text-left px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden lg:table-cell">Cập nhật</th> <th class="text-right px-3 py-2 text-[10px] uppercase tracking-wider text-on-surface-variant/70 font-semibold">Hành động</th> </tr> </thead> <tbody> ${definitions.map((def, idx) => {
    const initials = getInitials(def.title_vi);
    const avatar = avatarColors[idx % avatarColors.length];
    const responseCount = responseCounts.get(def.id) ?? 0;
    return renderTemplate`<tr class="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors group"> <td class="px-3 py-2"> <a${addAttribute(`/admin/scanners/${def.id}`, "href")} class="flex items-center gap-2 group"> <div${addAttribute(`w-8 h-8 rounded-lg bg-gradient-to-br ${avatar} flex items-center justify-center text-white font-bold text-[11px] shrink-0`, "class")}> ${initials} </div> <div class="min-w-0"> <p class="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors truncate max-w-[160px] sm:max-w-[240px]"> ${def.title_vi} </p> <p class="text-[10px] text-on-surface-variant truncate font-mono">${def.id}</p> </div> </a> </td> <td class="px-3 py-2 hidden md:table-cell"> <span${addAttribute(`px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeColors[def.survey_type] ?? "bg-gray-500/20 text-gray-300"}`, "class")}> ${typeLabels[def.survey_type] ?? def.survey_type} </span> </td> <td class="px-3 py-2 hidden sm:table-cell"> <span${addAttribute(`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusColors[def.status] ?? "bg-gray-500/20 text-gray-300"}`, "class")}> <span${addAttribute(`w-1.5 h-1.5 rounded-full ${statusDotColors[def.status] ?? "bg-gray-400"}`, "class")}></span> ${statusLabels[def.status] ?? def.status} </span> </td> <td class="px-3 py-2 hidden lg:table-cell text-xs text-on-surface-variant font-semibold"> ${responseCount} </td> <td class="px-3 py-2 hidden lg:table-cell text-xs text-on-surface-variant"> ${formatDate(def.updated_at)} </td> <td class="px-3 py-2 text-right"> <div class="flex items-center justify-end gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity"> <a${addAttribute(`/scanner/${def.slug}`, "href")} target="_blank" rel="noopener" class="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors" title="Xem public"> <span class="material-symbols-outlined text-[15px]">visibility</span> </a> <a${addAttribute(`/admin/scanners/${def.id}/responses`, "href")} class="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Xem responses"> <span class="material-symbols-outlined text-[15px]">list_alt</span> </a> <a${addAttribute(`/admin/scanners/${def.id}`, "href")} class="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Chỉnh sửa"> <span class="material-symbols-outlined text-[15px]">edit</span> </a> <button type="button" class="btn-delete p-1.5 rounded hover:bg-red-500/20 text-on-surface-variant hover:text-red-400 transition-colors"${addAttribute(def.id, "data-id")}${addAttribute(def.title_vi, "data-name")} title="Xóa"> <span class="material-symbols-outlined text-[15px]">delete</span> </button> </div> </td> </tr>`;
  })} </tbody> </table> </div>`} <div id="create-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center p-4"> <div id="create-modal-backdrop" class="absolute inset-0 bg-black/0 transition-colors"></div> <div id="create-modal-panel" class="relative glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide scale-95 opacity-0 transition-all"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-on-surface">Tạo scanner mới</h3> <button id="modal-close" type="button" class="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"> <span class="material-symbols-outlined text-[20px]">close</span> </button> </div> <form id="create-form" class="flex flex-col gap-4"> <div> <label class="text-xs font-semibold text-on-surface-variant block mb-1">Tiêu đề (VI) <span class="text-red-400">*</span></label> <input type="text" name="title_vi" required class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary" placeholder="Hệ Thống Check"> </div> <div> <label class="text-xs font-semibold text-on-surface-variant block mb-1">Tiêu đề (EN)</label> <input type="text" name="title_en" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary" placeholder="Systems Check"> </div> <div> <label class="text-xs font-semibold text-on-surface-variant block mb-1">Slug (URL)</label> <input type="text" name="slug" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary font-mono" placeholder="he-thong-check (tự sinh nếu trống)"> </div> <div> <label class="text-xs font-semibold text-on-surface-variant block mb-1">Loại</label> <select name="survey_type" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary"> <option value="full" selected>Full — Bản đầy đủ</option> <option value="mini">Mini — Phiên bản ngắn</option> <option value="checklist">Checklist — Chỉ yes/no</option> </select> </div> <div> <label class="text-xs font-semibold text-on-surface-variant block mb-1">Trạng thái</label> <select name="status" class="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary"> <option value="draft" selected>Bản nháp</option> <option value="active">Đang hoạt động</option> <option value="archived">Lưu trữ</option> </select> </div> <p id="form-error" class="text-sm text-red-400 hidden"></p> <div class="flex justify-end gap-2 pt-2"> <button type="button" id="modal-cancel" class="px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Huỷ</button> <button type="submit" class="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm cyan-glow hover:opacity-90 active:scale-95 transition-all">Tạo scanner</button> </div> </form> </div> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/scanners/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/scanners/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/scanners/index.astro";
const $$url = "/admin/scanners";
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
