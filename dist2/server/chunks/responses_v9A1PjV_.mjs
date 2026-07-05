globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_VoTlS2tl.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_Do1AQBaG.mjs";
import { env } from "cloudflare:workers";
import { d as getSurveyDefinitionById } from "./survey-config-db_FzodKoeP.mjs";
import { l as listScannerResponses, d as countScannerResponses, p as parseScores } from "./scanner-response-db_DlgoOmv3.mjs";
const prerender = false;
const $$Responses = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Responses;
  const idParam = Astro2.params.id;
  const surveyId = idParam ?? "";
  const def = await getSurveyDefinitionById(env.DB, surveyId);
  if (!def) {
    return Astro2.redirect("/admin/scanners");
  }
  let responses = [];
  let total = 0;
  try {
    responses = await listScannerResponses(env.DB, { surveyId, limit: 100 });
    total = await countScannerResponses(env.DB, surveyId);
  } catch {
    responses = [];
  }
  function formatDate(s) {
    return new Date(s).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function scoreLevel(score) {
    if (score >= 75) return { label: "Vững mạnh", color: "text-green-400" };
    if (score >= 55) return { label: "Đang phát triển", color: "text-blue-400" };
    if (score >= 35) return { label: "Cần chú ý", color: "text-amber-400" };
    return { label: "Cần soi chiếu", color: "text-red-400" };
  }
  function maskEmail(email) {
    if (!email) return "—";
    const at = email.indexOf("@");
    if (at <= 0) return "***";
    return email.slice(0, 2) + "***" + email.slice(at);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `Responses — ${def.title_vi}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<header class="flex flex-wrap items-start justify-between gap-4"> <div class="flex items-start gap-4 min-w-0"> <a${addAttribute(`/admin/scanners/${def.id}`, "href")} class="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors shrink-0"> <span class="material-symbols-outlined">arrow_back</span> </a> <div class="min-w-0"> <p class="text-xs uppercase tracking-wider text-on-surface-variant/70 font-bold mb-1">Responses</p> <h1 class="text-2xl font-bold text-on-surface truncate">${def.title_vi}</h1> <p class="text-sm text-on-surface-variant mt-0.5">${total} responses</p> </div> </div> </header> ${responses.length === 0 && renderTemplate`<div class="glass-card rounded-2xl p-12 text-center"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">inbox</span> <p class="text-on-surface font-semibold mt-4">Chưa có response nào</p> <p class="text-sm text-on-surface-variant mt-2">
Khi người dùng hoàn thành scanner, responses sẽ xuất hiện ở đây.
</p> </div>`}${responses.length > 0 && renderTemplate`<div class="glass-card rounded-2xl border border-outline-variant/20 overflow-hidden"> <table class="w-full"> <thead> <tr class="border-b border-outline-variant/15"> <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold">ID</th> <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold">Phòng khám</th> <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden md:table-cell">Email</th> <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold">Tổng điểm</th> <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden lg:table-cell">AI</th> <th class="text-left px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold hidden lg:table-cell">Ngày</th> <th class="text-right px-4 py-3 text-xs uppercase tracking-wider text-on-surface-variant/70 font-semibold">Xem</th> </tr> </thead> <tbody> ${responses.map((r) => {
    const scores = parseScores(r.scores_json);
    const total2 = scores.total ?? 0;
    const level = scoreLevel(total2);
    return renderTemplate`<tr class="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors"> <td class="px-4 py-3 text-sm font-mono text-on-surface">#${r.id}</td> <td class="px-4 py-3"> <p class="text-sm font-semibold text-on-surface truncate">${r.clinic_name ?? "—"}</p> <p class="text-xs text-on-surface-variant truncate">${r.owner_name ?? ""}</p> </td> <td class="px-4 py-3 hidden md:table-cell text-sm text-on-surface-variant font-mono">${maskEmail(r.email)}</td> <td class="px-4 py-3"> <span${addAttribute(`text-base font-bold ${level.color}`, "class")}>${total2}</span> <span class="text-xs text-on-surface-variant ml-1.5">/100</span> </td> <td class="px-4 py-3 hidden lg:table-cell"> ${r.ai_analysis ? renderTemplate`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-green-500/20 text-green-300"> <span class="material-symbols-outlined text-[14px]">check_circle</span>
Done
</span>` : renderTemplate`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300"> <span class="material-symbols-outlined text-[14px]">schedule</span>
Pending
</span>`} </td> <td class="px-4 py-3 hidden lg:table-cell text-xs text-on-surface-variant">${formatDate(r.created_at)}</td> <td class="px-4 py-3 text-right"> <a${addAttribute(`/admin/scanners/${def.id}/response/${r.id}`, "href")} class="p-2 inline-flex items-center gap-1 rounded-lg hover:bg-surface-container text-primary hover:text-primary transition-colors"> <span class="material-symbols-outlined text-[18px]">visibility</span> </a> </td> </tr>`;
  })} </tbody> </table> </div>`}` })}`;
}, "C:/dentalempireos/src/pages/admin/scanners/[id]/responses.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/scanners/[id]/responses.astro";
const $$url = "/admin/scanners/[id]/responses";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Responses,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
