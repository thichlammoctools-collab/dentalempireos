globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_CcpFbi8U.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_lrzeJKgU.mjs";
import { env } from "cloudflare:workers";
import { l as listSurveyDefinitions } from "./survey-config-db_CRuLFWXk.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let scanners = [];
  try {
    scanners = await listSurveyDefinitions(env.DB, { status: "active" });
  } catch {
    scanners = [];
  }
  const typeLabels = {
    mini: "Mini",
    full: "Full",
    checklist: "Checklist"
  };
  const typeColors = {
    mini: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    full: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    checklist: "bg-amber-500/20 text-amber-300 border-amber-500/30"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Máy quét Scanner — Tự chẩn đoán phòng khám | Dental Empire OS", "description": "Các công cụ scanner tự chẩn đoán theo framework Dental Empire OS. Tự đánh giá phòng khám và nhận phân tích AI từ chuyên gia." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-6xl mx-auto px-4 py-8 md:py-12"> <header class="text-center mb-12"> <p class="text-xs uppercase tracking-wider text-amber-500 font-bold mb-2">Công cụ Scanner</p> <h1 class="text-4xl md:text-5xl font-bold text-on-surface mb-4">
Tự chẩn đoán phòng khám của bạn
</h1> <p class="text-on-surface-variant max-w-2xl mx-auto text-lg">
Mỗi scanner là một "máy quét" giúp bạn nhìn rõ điểm mạnh, điểm yếu và tiềm năng phát triển của phòng khám — theo framework ROOTS, SKY, S.T.A.R.S và Hệ thống sống.
</p> </header> ${scanners.length === 0 && renderTemplate`<div class="text-center py-16 glass-card rounded-2xl"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">fact_check</span> <p class="text-on-surface font-semibold mt-4">Chưa có scanner nào đang hoạt động</p> </div>`} <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"> ${scanners.map((s) => renderTemplate`<a${addAttribute(`/scanner/${s.slug}`, "href")} class="glass-card rounded-2xl p-6 border border-outline-variant/20 hover:border-primary/50 transition-all hover:-translate-y-0.5 group"> <div class="flex items-center justify-between mb-3"> <span${addAttribute(`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border ${typeColors[s.survey_type] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30"}`, "class")}> ${typeLabels[s.survey_type] ?? s.survey_type} </span> ${s.is_free === 1 ? renderTemplate`<span class="inline-flex items-center gap-1 text-xs font-semibold text-green-400"> <span class="material-symbols-outlined text-[14px]">verified</span>
Miễn phí
</span>` : renderTemplate`<span class="text-xs text-amber-400 font-semibold">AI trả phí</span>`} </div> <h3 class="text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors"> ${s.title_vi} </h3> <p class="text-sm text-on-surface-variant line-clamp-3 mb-4 min-h-[3.6em]"> ${s.description_vi ?? "Khám phá điểm mạnh và tiềm năng phòng khám của bạn."} </p> <div class="flex items-center justify-between"> ${s.subtitle_vi && renderTemplate`<p class="text-xs text-on-surface-variant/70 truncate">${s.subtitle_vi}</p>`} <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span> </div> </a>`)} </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/scanner/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/scanner/index.astro";
const $$url = "/scanner";
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
