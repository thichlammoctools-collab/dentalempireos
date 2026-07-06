globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_B1DfdmGZ.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_saReXTnS.mjs";
import { env } from "cloudflare:workers";
import { l as listSurveyDefinitions } from "./survey-config-db_AxTlbaW3.mjs";
import { a as listApps } from "./app-db_BINE4Y41.mjs";
const prerender = false;
const $$AiTools = createComponent(async ($$result, $$props, $$slots) => {
  let scanners = [];
  let apps = [];
  try {
    scanners = await listSurveyDefinitions(env.DB, { status: "active" });
  } catch {
    scanners = [];
  }
  try {
    apps = await listApps(env.DB).then((a) => a.filter((app) => app.status === "active"));
  } catch {
    apps = [];
  }
  const typeColors = {
    mini: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300", icon: "flash_on" },
    full: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300", icon: "radio_button_checked" },
    checklist: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300", icon: "checklist" }
  };
  function getScannerColor(s) {
    return typeColors[s.survey_type] ?? { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-300", icon: "quiz" };
  }
  const appTypeLabels = {
    survey: "Khảo sát",
    ebook_ai: "Ebook AI",
    course_ai: "Khóa học AI",
    tool: "Công cụ",
    generator: "Tạo nội dung"
  };
  const appTypeColors = {
    survey: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-300" },
    ebook_ai: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300" },
    course_ai: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-300" },
    tool: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-300" },
    generator: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-300" }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Công cụ AI — Dental Empire OS", "description": "Tổng hợp các công cụ AI: máy quét tự chẩn đoán, scanner, ebook generator và nhiều hơn nữa. Giúp bạn đánh giá và phát triển phòng khám nha khoa." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative overflow-hidden"> <!-- Ambient background --> <div class="absolute inset-0 pointer-events-none"> <div class="absolute inset-0 opacity-[0.03]" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(146,204,255,0.1) 35px, rgba(146,204,255,0.1) 70px);"></div> <div class="absolute top-0 inset-x-0 h-[500px]" style="background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(146,204,255,0.12), transparent);"></div> </div> <div class="relative max-w-5xl mx-auto px-4 pt-16 pb-20"> <!-- Hero --> <header class="text-center mb-16"> <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6"> <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
Công cụ AI
</div> <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight">
Trí tuệ AI<br> <span class="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">cho phòng khám</span> <br>của bạn
</h1> <p class="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
Tổng hợp các công cụ AI giúp bạn tự đánh giá, phân tích và phát triển phòng khám nha khoa — dựa trên framework Dental Empire OS.
</p> </header> <!-- Scanner Cards --> ${scanners.length > 0 && renderTemplate`<div class="mb-16"> <div class="flex items-center gap-3 mb-6"> <div class="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center"> <span class="material-symbols-outlined text-amber-400 text-[20px]">psychology</span> </div> <div> <h2 class="text-xl font-bold text-on-surface">Máy quét tự chẩn đoán</h2> <p class="text-sm text-on-surface-variant">Scanner — đánh giá toàn diện với AI phân tích</p> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-5"> ${scanners.map((s) => {
    const color = getScannerColor(s);
    return renderTemplate`<a${addAttribute(`/scanner/${s.slug}`, "href")} class="group glass-card rounded-2xl p-6 border border-outline-variant/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(146,204,255,0.12)] flex flex-col"> <div class="flex items-start justify-between gap-3 mb-4"> <div${addAttribute(`w-12 h-12 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center group-hover:scale-110 transition-transform`, "class")}> <span${addAttribute(`material-symbols-outlined ${color.text} text-[22px]`, "class")}>${color.icon}</span> </div> <div class="flex items-center gap-2 shrink-0"> <span${addAttribute(`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold border ${color.bg} ${color.border} ${color.text}`, "class")}> ${s.survey_type} </span> ${s.is_free === 1 ? renderTemplate`<span class="inline-flex items-center gap-1 text-xs font-semibold text-green-400"> <span class="material-symbols-outlined text-[12px]">verified</span>
Miễn phí
</span>` : renderTemplate`<span class="text-xs text-amber-400 font-semibold">AI trả phí</span>`} </div> </div> <h3 class="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors"> ${s.title_vi} </h3> <p class="text-sm text-on-surface-variant leading-relaxed flex-1 line-clamp-3"> ${s.description_vi ?? "Đánh giá toàn diện giúp bạn hiểu rõ thực trạng và tiềm năng phát triển của phòng khám."} </p> <div class="flex items-center justify-between mt-5 pt-4 border-t border-outline-variant/10"> <div class="flex items-center gap-2 text-xs text-on-surface-variant/60"> <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
Bắt đầu quét
</div> <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span> </div> </a>`;
  })} </div> </div>`} <!-- Other AI Apps --> ${apps.length > 0 && renderTemplate`<div class="mb-16"> <div class="flex items-center gap-3 mb-6"> <div class="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center"> <span class="material-symbols-outlined text-purple-400 text-[20px]">smart_toy</span> </div> <div> <h2 class="text-xl font-bold text-on-surface">Ứng dụng AI khác</h2> <p class="text-sm text-on-surface-variant">Ebook, khóa học, công cụ và generator</p> </div> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> ${apps.map((app) => {
    const color = appTypeColors[app.type] ?? { bg: "bg-gray-500/10", border: "border-gray-500/30", text: "text-gray-300" };
    return renderTemplate`<a${addAttribute(`/app/${app.slug}`, "href")} class="group glass-card rounded-2xl p-5 border border-outline-variant/15 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 flex flex-col"> <div class="flex items-center gap-3 mb-3"> <div${addAttribute(`w-10 h-10 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center group-hover:scale-105 transition-transform`, "class")}> <span${addAttribute(`material-symbols-outlined ${color.text} text-[20px]`, "class")}> ${app.type === "survey" ? "quiz" : app.type === "ebook_ai" ? "menu_book" : app.type === "course_ai" ? "school" : app.type === "tool" ? "build" : "auto_awesome"} </span> </div> <div class="flex-1 min-w-0"> <span${addAttribute(`text-[11px] font-bold px-2 py-0.5 rounded-md border ${color.bg} ${color.border} ${color.text}`, "class")}> ${appTypeLabels[app.type] ?? app.type} </span> </div> </div> <h3 class="text-sm font-bold text-on-surface mb-1.5 group-hover:text-primary transition-colors truncate"> ${app.name} </h3> ${app.description && renderTemplate`<p class="text-xs text-on-surface-variant leading-relaxed line-clamp-2 flex-1"> ${app.description} </p>`} <div class="flex items-center justify-end mt-3"> <span class="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span> </div> </a>`;
  })} </div> </div>`} <!-- Empty state --> ${scanners.length === 0 && apps.length === 0 && renderTemplate`<div class="text-center py-20 glass-card rounded-2xl border border-outline-variant/20"> <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10"> <span class="material-symbols-outlined text-primary/60 text-[40px]">smart_toy</span> </div> <h3 class="text-xl font-bold text-on-surface/80 mb-2">Chưa có công cụ AI nào</h3> <p class="text-sm text-on-surface-variant/50 max-w-sm mx-auto leading-relaxed">
Các công cụ AI đang được phát triển. Quay lại sau để khám phá.
</p> </div>`} <!-- Back link --> <div class="text-center mt-12"> <a href="/" class="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"> <span class="material-symbols-outlined text-[18px]">arrow_back</span>
Quay về trang chủ
</a> </div> </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/ai-tools.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/ai-tools.astro";
const $$url = "/ai-tools";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$AiTools,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
