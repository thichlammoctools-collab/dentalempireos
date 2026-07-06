globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_NhufuOWg.mjs";
import { env } from "cloudflare:workers";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { g as getUserHistory } from "./scanner-history-db_dHxdXqnG.mjs";
const prerender = false;
const $$ScannerHistory = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ScannerHistory;
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!session?.user) {
    return Astro2.redirect("/login?redirect=/account/scanner-history");
  }
  const history = await getUserHistory(env.DB, session.user.id, 50);
  function formatDate(iso) {
    const d = new Date(iso);
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 864e5);
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function scoreColor(label) {
    if (!label) return { bg: "bg-white/5", text: "text-on-surface-variant", border: "border-outline-variant/20" };
    const l = label.toLowerCase();
    if (l.includes("xuất sắc") || l.includes("excellent") || l.includes("tuyệt"))
      return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" };
    if (l.includes("tốt") || l.includes("good"))
      return { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" };
    if (l.includes("trung bình") || l.includes("cần") || l.includes("needs"))
      return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" };
    return { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" };
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Lịch Sử Scanner | Dental Empire OS", "description": "Lịch sử các lần làm scanner của bạn.", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-24 pb-16"> <div class="max-w-[1100px] mx-auto px-4 md:px-6"> <!-- Page Header --> <div class="flex items-center justify-between mb-6 md:mb-8"> <div> <h1 class="text-xl md:text-2xl font-bold text-white">Lịch sử Scanner</h1> <p class="text-xs md:text-sm text-on-surface-variant mt-1 hidden sm:block">Tất cả scanner bạn đã thực hiện.</p> </div> <div class="flex items-center gap-2"> <a href="/account/profile" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-outline-variant/20 text-sm text-on-surface-variant hover:text-white transition-all"> <span class="material-symbols-outlined text-base">arrow_back</span> <span class="hidden sm:inline">Tài khoản</span> </a> <a href="/scanner" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"> <span class="material-symbols-outlined text-base">add</span> <span class="hidden sm:inline">Làm mới</span> </a> </div> </div> ${history.length === 0 ? renderTemplate`<!-- Empty state -->
        <div class="glass-card rounded-2xl p-10 md:p-16 border border-outline-variant/20 text-center"> <span class="material-symbols-outlined text-7xl text-on-surface-variant/20 block mb-4 mx-auto">history</span> <h2 class="text-lg font-bold text-white mb-2">Chưa có lịch sử</h2> <p class="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
Bạn chưa làm scanner nào. Hãy bắt đầu để đánh giá phòng khám của bạn.
</p> <a href="/scanner" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all"> <span class="material-symbols-outlined text-base">explore</span>
Khám phá Scanner
</a> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <div class="grid grid-cols-3 gap-3 mb-6"> <div class="glass-card rounded-2xl p-4 text-center border border-outline-variant/20"> <p class="text-2xl font-bold text-white">${history.length}</p> <p class="text-[10px] text-on-surface-variant mt-1">Tổng Scanner</p> </div> <div class="glass-card rounded-2xl p-4 text-center border border-outline-variant/20"> <p class="text-2xl font-bold text-white"> ${history.filter((h) => h.score_total !== null).length} </p> <p class="text-[10px] text-on-surface-variant mt-1">Đã chấm điểm</p> </div> <div class="glass-card rounded-2xl p-4 text-center border border-outline-variant/20"> <p class="text-2xl font-bold text-white"> ${history.length > 0 ? Math.round(history.filter((h) => h.score_total !== null).reduce((s, h) => s + (h.score_total ?? 0), 0) / Math.max(1, history.filter((h) => h.score_total !== null).length)) : "—"} </p> <p class="text-[10px] text-on-surface-variant mt-1">Điểm TB</p> </div> </div>  <div class="flex flex-col gap-3"> ${history.map((entry) => {
    const colors = scoreColor(entry.score_label);
    return renderTemplate`<a${addAttribute(`/scanner/result/${entry.response_id}`, "href")} class="glass-card rounded-2xl p-4 md:p-5 border border-outline-variant/20 hover:border-primary/30 hover:bg-white/[0.06] transition-all group flex items-center gap-4"> <!-- Scanner icon --> <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors"> <span class="material-symbols-outlined text-primary text-xl">analytics</span> </div> <!-- Info --> <div class="flex-1 min-w-0"> <h3 class="text-sm font-semibold text-white group-hover:text-primary transition-colors truncate"> ${entry.scanner_title_vi ?? "Scanner"} </h3> <div class="flex items-center gap-2 mt-1 flex-wrap"> <span class="text-[11px] text-on-surface-variant flex items-center gap-1"> <span class="material-symbols-outlined text-[11px]">schedule</span> ${formatDate(entry.created_at)} </span> ${entry.scanner_slug && renderTemplate`<span class="text-[10px] text-on-surface-variant/50">${entry.scanner_slug}</span>`} </div> </div> <!-- Score --> <div class="flex flex-col items-end gap-1.5 flex-shrink-0"> ${entry.score_total !== null ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <div${addAttribute(["px-3 py-1 rounded-xl border text-xs font-bold", colors.bg, colors.text, colors.border], "class:list")}> ${entry.score_label} </div> <span class="text-[11px] text-on-surface-variant font-mono"> ${entry.score_total.toFixed(1)} điểm
</span> ` })}` : renderTemplate`<span class="text-[11px] text-on-surface-variant/50">—</span>`} </div> <!-- Arrow --> <span class="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors flex-shrink-0">
chevron_right
</span> </a>`;
  })} </div> ` })}`} </div> </div> ` })}`;
}, "C:/dentalempireos/src/pages/account/scanner-history.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/account/scanner-history.astro";
const $$url = "/account/scanner-history";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$ScannerHistory,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
