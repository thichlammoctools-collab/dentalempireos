globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_BOB8F8DU.mjs";
import { env } from "cloudflare:workers";
import { h as listQuestionsByUser } from "./question-db_BOj0TAm2.mjs";
import { l as listChapters } from "./book-db_DDcc_FYk.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const auth = createAuth(env);
  const result = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!result?.user) {
    return Astro2.redirect("/login?redirect=/my-questions");
  }
  const questions = await listQuestionsByUser(env.DB, result.user.id);
  const chapters = await listChapters(env.DB);
  const chapterMap = new Map(chapters.map((c) => [c.id, { title: c.title, tier: c.tier, chapter_no: c.chapter_no }]));
  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.floor(hrs / 24);
    return `${days} ngày trước`;
  }
  function statusInfo(status) {
    if (status === "open") return { label: "Chờ trả lời", icon: "pending", color: "text-error bg-error/10" };
    if (status === "answered") return { label: "Đã trả lời", icon: "check_circle", color: "text-primary bg-primary/10" };
    return { label: "Đã đóng", icon: "archive", color: "text-on-surface-variant bg-surface-container-high" };
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Câu Hỏi Của Tôi - Dental Empire OS", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-24 pb-16"> <div class="max-w-[800px] mx-auto px-6"> <!-- Header --> <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"> <div> <h1 class="text-2xl md:text-3xl font-bold text-white mb-1">Câu Hỏi Của Tôi</h1> <p class="text-sm text-on-surface-variant">Quản lý tất cả câu hỏi và câu trả lời từ tác giả.</p> </div> <a href="/book" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all"> <span class="material-symbols-outlined text-base">menu_book</span>
Đọc sách
</a> </div> <!-- Questions list --> ${questions.length === 0 ? renderTemplate`<div class="glass-card rounded-xl p-12 text-center"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/20 block mb-4">question_answer</span> <p class="text-lg font-bold text-white mb-2">Chưa có câu hỏi nào</p> <p class="text-sm text-on-surface-variant mb-6">Hãy đọc sách và nhấn nút "Hỏi Tác Giả" để đặt câu hỏi.</p> <a href="/book" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all"> <span class="material-symbols-outlined text-base">menu_book</span>
Bắt đầu đọc
</a> </div>` : renderTemplate`<div class="flex flex-col gap-3"> ${questions.map((q) => {
    const ch = chapterMap.get(q.chapter_id);
    const st = statusInfo(q.status);
    return renderTemplate`<a${addAttribute(`/my-questions/${q.id}`, "href")} class="glass-card rounded-xl p-5 hover:border-primary/20 transition-all group"> <div class="flex items-start gap-4"> <div${addAttribute(["w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", st.color], "class:list")}> <span class="material-symbols-outlined text-lg">${st.icon}</span> </div> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2 mb-1"> <h3 class="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">${q.title}</h3> ${Number(q.reply_count) > 0 && renderTemplate`<span class="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full"> <span class="material-symbols-outlined text-[10px]">chat</span> ${q.reply_count} </span>`} </div> <div class="flex items-center gap-2 text-[11px] text-on-surface-variant"> ${ch && renderTemplate`<span>Tier ${ch.tier} · Ch${String(ch.chapter_no).padStart(2, "0")} ${ch.title}</span>`} </div> <div class="flex items-center gap-3 mt-2 text-[11px] text-on-surface-variant/70"> <span>${timeAgo(q.createdAt)}</span> <span class="flex items-center gap-1"> <span class="material-symbols-outlined text-[10px]">${st.icon}</span> ${st.label} </span> </div> </div> <span class="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors">chevron_right</span> </div> </a>`;
  })} </div>`} </div> </div> ` })}`;
}, "C:/dentalempireos/src/pages/my-questions/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/my-questions/index.astro";
const $$url = "/my-questions";
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
