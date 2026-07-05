globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_CMqveNVP.mjs";
import { env } from "cloudflare:workers";
import { l as listLatestReviews } from "./review-db_BEpAiHjt.mjs";
import { $ as $$StarRating } from "./StarRating_CQPGVxgS.mjs";
const $$ReviewCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ReviewCard;
  const { review, showChapter = false, currentUserId = null } = Astro2.props;
  const displayName = review.user_name || review.author_name || "Ẩn danh";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = review.user_image || null;
  function relativeDate(iso) {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diff = Math.floor((now - then) / 1e3);
    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    const days = Math.floor(diff / 86400);
    if (days < 30) return `${days} ngày trước`;
    if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
    return `${Math.floor(days / 365)} năm trước`;
  }
  const canDelete = currentUserId && review.user_id === currentUserId;
  return renderTemplate`${maybeRenderHead()}<article class="review-card bg-surface-container rounded-2xl border border-outline-variant/40 p-5 transition-all duration-300 hover:border-outline-variant/70"${addAttribute(review.id, "data-review-id")}> <!-- Header --> <div class="flex items-start justify-between gap-3 mb-3"> <div class="flex items-center gap-3 min-w-0">  ${avatarUrl ? renderTemplate`<img${addAttribute(avatarUrl, "src")}${addAttribute(displayName, "alt")} class="w-10 h-10 rounded-full object-cover flex-shrink-0" loading="lazy">` : renderTemplate`<div class="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0"> ${initial} </div>`} <div class="min-w-0"> <p class="font-semibold text-white text-sm truncate">${displayName}</p> <div class="flex items-center gap-2"> ${showChapter && review.chapter_title && renderTemplate`<a${addAttribute(`/book/${review.chapter_id}`, "href")} class="text-xs text-primary hover:underline truncate"> ${review.chapter_title} </a>`} ${showChapter && review.chapter_title && renderTemplate`<span class="text-on-surface-variant/40 text-xs">·</span>`} <time class="text-xs text-on-surface-variant"${addAttribute(review.createdAt, "datetime")}> ${relativeDate(review.createdAt)} </time> </div> </div> </div> ${canDelete && renderTemplate`<button class="review-delete-btn flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant/50 hover:text-error hover:bg-error/10 transition-all" title="Xóa review"${addAttribute(review.id, "data-review-id")}> <span class="material-symbols-outlined text-[18px]">delete</span> </button>`} </div> <!-- Rating + Title --> <div class="flex items-center gap-2 mb-2"> ${renderComponent($$result, "StarRating", $$StarRating, { "name": `display-${review.id}`, "value": review.rating, "readonly": true, "size": "sm" })} </div> ${review.title && renderTemplate`<p class="font-semibold text-white text-sm mb-1">${review.title}</p>`} <!-- Content --> <p class="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">${review.content}</p> </article>`;
}, "C:/dentalempireos/src/components/book/ReviewCard.astro", void 0);
const prerender = false;
const $$Reviews = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Reviews;
  const reviews = await listLatestReviews(env.DB, 20, 0);
  const currentUser = Astro2.locals.user;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Cảm Nhận Từ Độc Giả - Dental Empire OS", "description": "Đọc những cảm nhận, đánh giá mới nhất từ độc giả về Dental Empire OS." }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="py-16 bg-surface-container-low"> <div class="px-6 max-w-[1200px] mx-auto text-center"> <span class="material-symbols-outlined text-primary text-5xl mb-4 block">reviews</span> <h1 class="text-headline-lg text-white mb-4">Cảm Nhận Từ Độc Giả</h1> <p class="text-on-surface-variant max-w-2xl mx-auto">
Những chia sẻ, đánh giá từ cộng đồng độc giả đã đồng hành cùng Dental Empire OS.
</p> </div> </section>  <section class="py-16"> <div class="px-6 max-w-[1200px] mx-auto"> ${reviews.length === 0 ? renderTemplate`<div class="text-center py-16"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4 block">rate_review</span> <p class="text-on-surface-variant text-lg mb-2">Chưa có đánh giá nào</p> <p class="text-on-surface-variant/70 text-sm">Hãy đọc một chương và chia sẻ cảm nhận của bạn!</p> <a href="/book" class="inline-flex items-center gap-2 mt-6 px-6 py-3 btn-primary-metallic font-bold rounded-xl"> <span class="material-symbols-outlined text-[20px]">menu_book</span>
Đọc Sách Ngay
</a> </div>` : renderTemplate`<div id="reviews-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4"> ${reviews.map((review) => renderTemplate`${renderComponent($$result2, "ReviewCard", $$ReviewCard, { "review": review, "showChapter": true, "currentUserId": currentUser?.id })}`)} </div>`} ${reviews.length >= 20 && renderTemplate`<div class="text-center mt-10"> <button id="load-more-reviews" class="px-8 py-3 bg-surface-container-high hover:bg-surface-container border border-outline-variant/40 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-white transition-all" data-offset="20">
Xem thêm đánh giá
</button> </div>`} </div> </section> ${renderScript($$result2, "C:/dentalempireos/src/pages/reviews.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/reviews.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/reviews.astro";
const $$url = "/reviews";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Reviews,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
