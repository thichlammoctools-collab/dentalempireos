globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_NhufuOWg.mjs";
import { env } from "cloudflare:workers";
import { g as getApp } from "./app-db_BINE4Y41.mjs";
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const slug = Astro2.params.slug ?? "";
  const app = await getApp(env.DB, slug);
  if (!app || app.status !== "active") {
    return new Response("AI Mentor không tìm thấy hoặc chưa được kích hoạt.", { status: 404 });
  }
  const title = app.name;
  const description = app.description ?? "Trợ lý AI đọc sách Dental Empire OS";
  const chapterId = Astro2.url.searchParams.get("chapter") ?? "";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${title} | Dental Empire OS`, "description": description }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-20 pb-8"> <div class="max-w-3xl mx-auto px-4"> <!-- Header --> <div class="flex items-center gap-3 mb-6"> <a href="/#ai-tools" class="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors"> <span class="material-symbols-outlined text-lg">arrow_back</span> <span>Quay lại</span> </a> ${chapterId && renderTemplate`<span class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
Ch. ${chapterId} </span>`} </div> <div class="mb-4"> <h1 class="text-2xl font-bold text-white flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-3xl">psychology</span> ${title} </h1> <p class="text-sm text-on-surface-variant mt-1">Hỏi đáp về nội dung sách Dental Empire OS</p> </div> <!-- Chat Messages --> <div id="chat-messages" class="flex flex-col gap-3 mb-4 min-h-[50vh]"> <!-- Welcome message --> <div class="flex justify-start"> <div class="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-surface-container-high text-on-surface"> <p class="text-sm leading-relaxed whitespace-pre-wrap">
Xin chào! Tôi là AI Mentor của Dental Empire OS. Hãy hỏi tôi bất cứ điều gì về quản trị phòng khám nha khoa — từ chiến lược, quy trình, nhân sự, marketing, tài chính...
</p> </div> </div> </div> <!-- Input --> <div class="glass-card rounded-2xl p-4 border border-outline-variant/20 sticky bottom-4"> <form id="chat-form" class="flex gap-3"> <input id="chat-input" type="text" class="flex-1 px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm" placeholder="Hỏi về nội dung sách, quản trị phòng khám..." required> <button type="submit" id="send-btn" class="btn-primary-metallic px-5 py-3 rounded-xl font-bold flex items-center gap-2"> <span class="material-symbols-outlined text-lg">send</span> </button> </form> <p id="ai-warning" class="hidden text-xs text-center text-amber-400 mt-2">
Không có nội dung sách để tham khảo — câu trả lời dựa trên kiến thức chung.
</p> </div> </div> </div> ${renderScript($$result2, "C:/dentalempireos/src/pages/ai-mentor/[slug].astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/ai-mentor/[slug].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/ai-mentor/[slug].astro";
const $$url = "/ai-mentor/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
