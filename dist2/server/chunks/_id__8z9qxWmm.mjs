globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, b as defineScriptVars, a as addAttribute, u as unescapeHTML, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_Bgrinth3.mjs";
import { env } from "cloudflare:workers";
import { g as getQuestion, a as getReplies, u as updateQuestionStatus } from "./question-db_BOj0TAm2.mjs";
import { l as listChapters } from "./book-db_DDcc_FYk.mjs";
import { g } from "./marked.esm_10m2JtFV.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/admin/questions");
  const question = await getQuestion(env.DB, id);
  if (!question) return new Response("Không tìm thấy câu hỏi", { status: 404 });
  const replies = await getReplies(env.DB, id);
  const chapters = await listChapters(env.DB);
  const chapterTitle = chapters.find((c) => c.id === question.chapter_id)?.title ?? question.chapter_id;
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const newStatus = formData.get("status");
    if (["open", "answered", "closed"].includes(newStatus)) {
      await updateQuestionStatus(env.DB, id, newStatus);
      return Astro2.redirect(`/admin/questions/${id}`);
    }
  }
  g.use({ breaks: true });
  function renderMd(text) {
    return g.parse(text);
  }
  function statusBadge(status) {
    if (status === "open") return { label: "Chờ trả lời", cls: "bg-error/10 text-error border-error/20" };
    if (status === "answered") return { label: "Đã trả lời", cls: "bg-primary/10 text-primary border-primary/20" };
    return { label: "Đã đóng", cls: "bg-on-surface-variant/10 text-on-surface-variant border-outline-variant/20" };
  }
  const badge = statusBadge(question.status);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `${question.title} | Admin Câu Hỏi` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="max-w-[900px] w-full mx-auto flex flex-col gap-6"> <!-- Header --> <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4"> <div> <a href="/admin/questions" class="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-sm mb-3"> <span class="material-symbols-outlined text-lg">arrow_back</span> <span>Quay lại danh sách</span> </a> <div class="flex items-center gap-3 mb-2"> <span', "> ", ' </span> <span class="text-xs text-on-surface-variant">', '</span> </div> <h2 class="text-2xl md:text-3xl font-bold text-white">', '</h2> <div class="flex items-center gap-3 text-sm text-on-surface-variant mt-2"> <span class="flex items-center gap-1"> <span class="material-symbols-outlined text-base">person</span> ', ' </span> <span>·</span> <span class="flex items-center gap-1"> <span class="material-symbols-outlined text-base">menu_book</span> ', ' </span> </div> </div> <div class="flex gap-2 flex-shrink-0"> <form method="POST" class="flex gap-2"> ', " ", " ", ' </form> </div> </div> <!-- Original question --> <div class="glass-card rounded-xl p-6"> <div class="flex items-center gap-3 mb-4"> <div class="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center"> <span class="material-symbols-outlined text-primary text-base">person</span> </div> <div> <p class="text-sm font-bold text-white">', '</p> <p class="text-[10px] text-on-surface-variant">Câu hỏi ban đầu</p> </div> </div> <div class="prose prose-invert prose-sm max-w-none reader-content">', "</div> </div> <!-- Replies --> ", ' <!-- Reply form --> <div class="glass-card rounded-xl p-6"> <h3 class="text-sm font-bold text-white mb-4 uppercase tracking-wider">Trả lời câu hỏi này</h3> <form id="reply-form" class="flex flex-col gap-4"> <textarea id="reply-body" name="body"', ' placeholder="Nhập câu trả lời của bạn (hỗ trợ Markdown)..." class="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary resize-y" required></textarea> <div class="flex justify-end"> <button type="submit" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all">\nGửi câu trả lời\n</button> </div> </form> </div> </div> <script>(function(){', `
    const form = document.getElementById('reply-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const bodyEl = document.getElementById('reply-body');
      const body = bodyEl && bodyEl.value ? bodyEl.value.trim() : '';
      if (!body) return;

      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Đang gửi...'; btn.disabled = true; }

      try {
        const res = await fetch('/api/admin/questions/' + questionId + '/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ body }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          showToast(err.error || 'Có lỗi xảy ra', 'error');
          return;
        }
        window.location.reload();
      } catch {
        showToast('Lỗi kết nối', 'error');
      } finally {
        if (btn) { btn.textContent = 'Gửi câu trả lời'; btn.disabled = false; }
      }
    });
  })();<\/script> `])), maybeRenderHead(), addAttribute(["px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border", badge.cls], "class:list"), badge.label, question.createdAt, question.title, question.user_id, chapterTitle, question.status !== "answered" && renderTemplate`<button name="status" value="answered" class="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-sm font-bold hover:bg-primary/20 transition-all">
Đánh dấu Đã trả lời
</button>`, question.status !== "closed" && renderTemplate`<button name="status" value="closed" class="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant border border-outline-variant/15 text-sm font-bold hover:border-primary/30 transition-all">
Đóng
</button>`, question.status !== "open" && renderTemplate`<button name="status" value="open" class="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface-variant border border-outline-variant/15 text-sm font-bold hover:border-primary/30 transition-all">
Mở lại
</button>`, question.user_id, unescapeHTML(renderMd(question.body)), replies.length > 0 && renderTemplate`<div class="flex flex-col gap-3"> <h3 class="text-sm font-bold text-on-surface-variant uppercase tracking-wider">${replies.length} câu trả lời</h3> ${replies.map((reply) => renderTemplate`<div${addAttribute([
    "rounded-xl p-6",
    reply.is_admin ? "bg-primary/5 border border-primary/20" : "glass-card"
  ], "class:list")}> <div class="flex items-center gap-3 mb-3"> <div${addAttribute([
    "w-8 h-8 rounded-full flex items-center justify-center",
    reply.is_admin ? "bg-primary/20" : "bg-tertiary/15"
  ], "class:list")}> <span${addAttribute([
    "material-symbols-outlined text-base",
    reply.is_admin ? "text-primary" : "text-tertiary"
  ], "class:list")}> ${reply.is_admin ? "shield_person" : "person"} </span> </div> <div> <p class="text-sm font-bold text-white">${reply.user_name || reply.user_email}</p> <p class="text-[10px] text-on-surface-variant"> ${reply.is_admin ? "Admin" : "Độc giả"} · ${reply.createdAt} </p> </div> </div> <div class="prose prose-invert prose-sm max-w-none reader-content">${unescapeHTML(renderMd(reply.body))}</div> </div>`)} </div>`, addAttribute(5, "rows"), defineScriptVars({ questionId: id })) })}`;
}, "C:/dentalempireos/src/pages/admin/questions/[id].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/questions/[id].astro";
const $$url = "/admin/questions/[id]";
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
