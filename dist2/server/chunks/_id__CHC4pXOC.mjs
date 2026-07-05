globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, u as unescapeHTML, a as addAttribute, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_CcpFbi8U.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_lrzeJKgU.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { g } from "./marked.esm_10m2JtFV.mjs";
import { env } from "cloudflare:workers";
import { g as getQuestion, a as getReplies } from "./question-db_BOj0TAm2.mjs";
import { l as listChapters } from "./book-db_DDcc_FYk.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
const $$QuestionThread = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$QuestionThread;
  const {
    questionId,
    questionTitle,
    questionBody,
    questionUser,
    questionDate,
    replies,
    showReplyForm = true,
    status = "open"
  } = Astro2.props;
  g.use({ breaks: true });
  function renderMd(text) {
    return g.parse(text);
  }
  return renderTemplate`<!-- Question Thread -->${maybeRenderHead()}<div class="flex flex-col gap-4"> <!-- Original Question --> <div class="glass-card rounded-xl p-5"> <div class="flex items-center gap-3 mb-3"> <div class="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"> <span class="material-symbols-outlined text-primary text-base">person</span> </div> <div class="flex-1 min-w-0"> <p class="text-sm font-bold text-white">${questionUser}</p> <p class="text-[11px] text-on-surface-variant">${questionDate}</p> </div> </div> <div class="prose prose-invert prose-sm max-w-none reader-content">${unescapeHTML(renderMd(questionBody))}</div> </div> <!-- Replies --> ${replies.length > 0 && renderTemplate`<div class="flex flex-col gap-3"> ${replies.map((reply) => renderTemplate`<div${addAttribute([
    "rounded-xl p-5",
    reply.is_admin ? "bg-primary/5 border border-primary/15 ml-4 sm:ml-8" : "glass-card mr-4 sm:mr-8"
  ], "class:list")}> <div class="flex items-center gap-2.5 mb-2.5"> <div${addAttribute([
    "w-7 h-7 rounded-full flex items-center justify-center",
    reply.is_admin ? "bg-primary/20" : "bg-tertiary/15"
  ], "class:list")}> <span${addAttribute([
    "material-symbols-outlined text-sm",
    reply.is_admin ? "text-primary" : "text-tertiary"
  ], "class:list")}> ${reply.is_admin ? "shield_person" : "person"} </span> </div> <div class="flex-1 min-w-0"> <p class="text-xs font-bold text-white">${reply.user_name || reply.user_email}</p> <p class="text-[10px] text-on-surface-variant"> ${reply.is_admin ? "Tác giả" : "Bạn"} · ${reply.createdAt} </p> </div> </div> <div class="prose prose-invert prose-sm max-w-none reader-content">${unescapeHTML(renderMd(reply.body))}</div> </div>`)} </div>`} <!-- Reply form --> ${showReplyForm && status !== "closed" && renderTemplate`<div class="glass-card rounded-xl p-5"> <form${addAttribute(`reply-form-${questionId}`, "id")} class="flex flex-col gap-3"> <textarea${addAttribute(`reply-body-${questionId}`, "id")}${addAttribute(3, "rows")} placeholder="Viết câu trả lời..." class="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary resize-y" required></textarea> <div class="flex justify-end"> <button type="submit"${addAttribute(questionId, "data-question-id")} class="reply-submit-btn px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-base">send</span>
Gửi
</button> </div> </form> </div>`} ${status === "closed" && showReplyForm && renderTemplate`<div class="text-center py-4 text-on-surface-variant/50 text-sm"> <span class="material-symbols-outlined text-2xl block mb-2">lock</span>
Câu hỏi này đã đóng.
</div>`} </div> ${renderScript($$result, "C:/dentalempireos/src/components/questions/QuestionThread.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/questions/QuestionThread.astro", void 0);
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const auth = createAuth(env);
  const result = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!result?.user) {
    return Astro2.redirect("/login?redirect=/my-questions/" + Astro2.params.id);
  }
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/my-questions");
  const question = await getQuestion(env.DB, id);
  if (!question || question.user_id !== result.user.id) {
    return Astro2.redirect("/my-questions");
  }
  const replies = await getReplies(env.DB, id);
  const chapters = await listChapters(env.DB);
  const ch = chapters.find((c) => c.id === question.chapter_id);
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
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${question.title} - Câu Hỏi`, "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-24 pb-16"> <div class="max-w-[800px] mx-auto px-6"> <!-- Back link --> <a href="/my-questions" class="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm mb-6"> <span class="material-symbols-outlined text-lg">arrow_back</span> <span>Quay lại câu hỏi</span> </a> <!-- Chapter reference --> ${ch && renderTemplate`<div class="flex items-center gap-2 mb-3"> <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-primary/10 text-primary">
Tier ${ch.tier} · Ch${String(ch.chapter_no).padStart(2, "0")} </span> <a${addAttribute(`/book/${question.chapter_id}`, "href")} class="text-xs text-on-surface-variant hover:text-primary transition-colors"> ${ch.title} →
</a> </div>`} <!-- Question title --> <h1 class="text-xl md:text-2xl font-bold text-white mb-6">${question.title}</h1> <!-- Thread --> ${renderComponent($$result2, "QuestionThread", $$QuestionThread, { "questionId": question.id, "questionTitle": question.title, "questionBody": question.body, "questionUser": result.user.name || result.user.email, "questionDate": timeAgo(question.createdAt), "replies": replies, "showReplyForm": true, "status": question.status })} </div> </div> ` })}`;
}, "C:/dentalempireos/src/pages/my-questions/[id].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/my-questions/[id].astro";
const $$url = "/my-questions/[id]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
