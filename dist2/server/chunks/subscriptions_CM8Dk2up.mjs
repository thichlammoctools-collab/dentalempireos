globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, F as Fragment, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_NhufuOWg.mjs";
import { env } from "cloudflare:workers";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { l as listUserAccess } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const $$Subscriptions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Subscriptions;
  const auth = createAuth(env);
  const result = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!result?.user) {
    return Astro2.redirect("/login?redirect=/account/subscriptions");
  }
  const accesses = await listUserAccess(env.DB, result.user.id);
  const accessDetails = await Promise.all(
    accesses.map(async (a) => {
      const prod = await env.DB.prepare('SELECT * FROM "product" WHERE "id" = ?').bind(a.product_id).first();
      const isExpiring = a.expires_at ? new Date(a.expires_at).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1e3 : false;
      return { ...a, product: prod, isExpiring };
    })
  );
  function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  const totalSpent = accessDetails.reduce(
    (sum, a) => sum + (a.product?.price ?? 0),
    0
  );
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Quản lý Subscription | Dental Empire OS", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-24 pb-16"> <div class="max-w-3xl mx-auto px-4"> <!-- Back --> <a href="/account/profile" class="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"> <span class="material-symbols-outlined text-lg">arrow_back</span>
Quay lại hồ sơ
</a> <h1 class="text-2xl font-bold text-white mb-2">Quản lý Subscription</h1> <p class="text-sm text-on-surface-variant mb-6">
Các sản phẩm và dịch vụ bạn đã mua.
</p> ${accessDetails.length === 0 ? renderTemplate`<div class="glass-card rounded-2xl p-8 text-center"> <span class="material-symbols-outlined text-5xl text-on-surface-variant/20 block mb-3">workspace_premium</span> <p class="text-on-surface mb-4">Chưa có subscription nào</p> <a href="/scanner/pack" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm">
Khám phá Scanner Pack
</a> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`  <div class="flex items-center justify-between mb-4"> <p class="text-sm text-on-surface-variant"> ${accessDetails.length} sản phẩm
</p> <p class="text-sm font-bold text-white">
Tổng: ${totalSpent.toLocaleString("vi-VN")}đ
</p> </div> <div class="flex flex-col gap-3"> ${accessDetails.map((a) => renderTemplate`<div class="glass-card rounded-2xl p-5 border border-outline-variant/20"> <div class="flex items-start justify-between gap-4"> <div class="flex-1 min-w-0"> <div class="flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-xl"> ${a.product?.type === "survey_unlock" ? "analytics" : "inventory_2"} </span> <h3 class="text-white font-bold truncate">${a.product?.name ?? a.product_id}</h3> </div> ${a.product?.description && renderTemplate`<p class="text-xs text-on-surface-variant mt-1 line-clamp-2"> ${a.product.description} </p>`} <p class="text-[11px] text-on-surface-variant mt-2"> ${a.is_active ? renderTemplate`<span class="text-emerald-400 font-semibold">Hoạt động</span>` : renderTemplate`<span class="text-rose-400 font-semibold">Hết hạn</span>`} ${a.expires_at ? ` · HSD: ${formatDate(a.expires_at)}` : " · Vĩnh viễn"} </p> ${a.isExpiring && renderTemplate`<span class="inline-block mt-2 px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
Sắp hết hạn
</span>`} </div> <div class="text-right shrink-0"> ${a.product?.price ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate` <p class="text-white font-bold">${a.product.price.toLocaleString("vi-VN")}đ</p> <p class="text-[10px] text-on-surface-variant">Mua: ${formatDate(a.granted_at)}</p> ` })}` : renderTemplate`<span class="text-xs text-on-surface-variant">—</span>`} </div> </div> ${a.product?.type === "survey_unlock" && a.product?.app_id && renderTemplate`<div class="mt-4 pt-4 border-t border-outline-variant/15"> <a${addAttribute(`/ai-mentor/${a.product.app_id}`, "href")} class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"> <span class="material-symbols-outlined text-base">psychology</span>
Mở AI Mentor
</a> </div>`} ${a.product?.type === "survey_unlock" && !a.product?.app_id && renderTemplate`<div class="mt-4 pt-4 border-t border-outline-variant/15"> <a href="/scanner" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"> <span class="material-symbols-outlined text-base">analytics</span>
Mở Scanner
</a> </div>`} </div>`)} </div> ` })}`} <!-- Navigation --> <div class="mt-8 flex flex-wrap gap-3"> <a href="/account/profile" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-on-surface-variant transition-colors">
Hồ sơ cá nhân
</a> <a href="/scanner/pack" class="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors">
Mua thêm
</a> </div> </div> </div> ` })}`;
}, "C:/dentalempireos/src/pages/account/subscriptions.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/account/subscriptions.astro";
const $$url = "/account/subscriptions";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Subscriptions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
