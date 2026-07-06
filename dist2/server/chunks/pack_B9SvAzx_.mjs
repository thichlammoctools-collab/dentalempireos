globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_B1DfdmGZ.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_saReXTnS.mjs";
import { env } from "cloudflare:workers";
const prerender = false;
const $$Pack = createComponent(async ($$result, $$props, $$slots) => {
  let scanners = [];
  try {
    const { results } = await env.DB.prepare(`SELECT id, slug, title_vi, chapter_refs, is_free FROM "survey_definition" WHERE status = 'active' ORDER BY order_index ASC`).all();
    scanners = results ?? [];
  } catch {
    scanners = [];
  }
  const scannerIcons = {
    "he-thong-check": "settings",
    "nhan-su-check": "groups",
    "quy-trinh-check": "account_tree",
    "tiep-don-check": "sentiment_satisfied",
    "tai-chinh-check": "payments",
    "an-toan-check": "health_and_safety",
    "marketing-check": "campaign",
    "cskh-check": "support_agent",
    "van-hoa-check": "diversity_3",
    "thuong-hieu-check": "stars"
  };
  const colorClasses = {
    blue: { border: "border-blue-500/30", bg: "from-blue-600/10", text: "text-blue-400" },
    emerald: { border: "border-emerald-500/30", bg: "from-emerald-600/10", text: "text-emerald-400" },
    amber: { border: "border-amber-500/30", bg: "from-amber-600/10", text: "text-amber-400" },
    pink: { border: "border-pink-500/30", bg: "from-pink-600/10", text: "text-pink-400" },
    violet: { border: "border-violet-500/30", bg: "from-violet-600/10", text: "text-violet-400" },
    red: { border: "border-red-500/30", bg: "from-red-600/10", text: "text-red-400" },
    cyan: { border: "border-cyan-500/30", bg: "from-cyan-600/10", text: "text-cyan-400" },
    purple: { border: "border-purple-500/30", bg: "from-purple-600/10", text: "text-purple-400" },
    teal: { border: "border-teal-500/30", bg: "from-teal-600/10", text: "text-teal-400" },
    orange: { border: "border-orange-500/30", bg: "from-orange-600/10", text: "text-orange-400" }
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Scanner Pack | Dental Empire OS", "description": "Bộ 10 Mini Scanner + AI Analysis — chỉ 499K" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-20 pb-12"> <div class="max-w-4xl mx-auto px-4 text-center"> <!-- Header --> <div class="mb-2"> <span class="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 rounded-full mb-4">Bundle Deal</span> <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">Scanner Pack</h1> <p class="text-on-surface-variant text-lg mb-2">Bộ 10 Mini Scanner + AI Analysis</p> <p class="text-on-surface-variant text-sm">Mua 1 lần — mở khóa AI Analysis cho tất cả scanners. Dùng mãi mãi.</p> </div> <!-- Price --> <div class="my-8"> <div class="inline-flex items-baseline gap-1"> <span class="text-5xl font-black text-white">499K</span> <span class="text-xl text-on-surface-variant">/ lần</span> </div> <p class="text-xs text-emerald-400 mt-2">Tiết kiệm 95% so với mua lẻ từng scanner</p> </div> <!-- Scanner list — dynamically loaded from DB --> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left mb-8"> ${scanners.map((s) => {
    const icon = scannerIcons[s.id] ?? "fact_check";
    const colorKey = colorClasses[s.id] ? s.id : "blue";
    const c = colorClasses[colorKey];
    const refs = s.chapter_refs ? JSON.parse(s.chapter_refs) : [];
    return renderTemplate`<a${addAttribute(`/scanner/${s.slug}`, "href")}${addAttribute(`glass-card rounded-xl p-4 border ${c.border} bg-gradient-to-br ${c.bg} to-transparent hover:border-opacity-60 transition-all hover:scale-[1.02]`, "class")}> <div class="flex items-start justify-between gap-2 mb-1"> <span${addAttribute(`material-symbols-outlined ${c.text} text-xl`, "class")}>${icon}</span> ${s.is_free === 1 && renderTemplate`<span class="text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5 shrink-0">Miễn phí</span>`} </div> <h3 class="text-sm font-bold text-white mb-1">${s.title_vi}</h3> ${refs.length > 0 && renderTemplate`<p class="text-xs text-on-surface-variant">${refs[0]}</p>`} </a>`;
  })} <div class="glass-card rounded-xl p-4 border border-surface-container bg-surface-container-high flex flex-col items-center justify-center gap-2"> <span class="material-symbols-outlined text-primary text-2xl">auto_awesome</span> <p class="text-xs text-primary font-bold text-center">+ AI Analysis<br>cho mỗi scanner</p> </div> </div> <!-- Feature highlights --> <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left mb-8"> <div class="glass-card rounded-xl p-4"> <span class="material-symbols-outlined text-amber-400 text-2xl mb-2 block">auto_awesome</span> <h3 class="text-sm font-bold text-white mb-1">AI Phân Tích Cá Nhân</h3> <p class="text-xs text-on-surface-variant">Mỗi scanner đi kèm bản phân tích chi tiết từ BS. Vinh, dựa trên kết quả riêng của bạn.</p> </div> <div class="glass-card rounded-xl p-4"> <span class="material-symbols-outlined text-emerald-400 text-2xl mb-2 block">verified</span> <h3 class="text-sm font-bold text-white mb-1">Mua 1 Lần, Dùng Mãi Mãi</h3> <p class="text-xs text-on-surface-variant">Thanh toán 1 lần — truy cập vĩnh viễn cho tất cả scanners trong pack.</p> </div> <div class="glass-card rounded-xl p-4"> <span class="material-symbols-outlined text-blue-400 text-2xl mb-2 block">school</span> <h3 class="text-sm font-bold text-white mb-1">Bám Sát Framework Sách</h3> <p class="text-xs text-on-surface-variant">Mỗi câu hỏi được thiết kế dựa trên nội dung Dental Empire OS, Chương 1-10.</p> </div> </div> <!-- CTA --> <button id="buy-pack-btn" class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mb-4">
Mua Scanner Pack — 499.000đ
</button> <p class="text-xs text-on-surface-variant/60">Thanh toán qua PayOS · Mua 1 lần dùng mãi mãi</p> <!-- Note --> <div class="mt-8 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 text-left"> <p class="text-xs text-on-surface-variant"> <strong class="text-white">Bao gồm:</strong> AI Analysis cá nhân hóa cho mỗi scanner, dựa trên kết quả của riêng bạn. Không giới hạn số lần sử dụng.
</p> </div> </div> </div> ${renderScript($$result2, "C:/dentalempireos/src/pages/scanner/pack.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/scanner/pack.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/scanner/pack.astro";
const $$url = "/scanner/pack";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Pack,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
