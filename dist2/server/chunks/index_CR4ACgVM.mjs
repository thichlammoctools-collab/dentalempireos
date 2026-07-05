globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_VoTlS2tl.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_Do1AQBaG.mjs";
import { env } from "cloudflare:workers";
import { l as listUsers } from "./user-db_CM6xE649.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const users = await listUsers(env.DB);
  const total = users.length;
  const activeCount = users.filter((u) => u.is_active === 1).length;
  const inactiveCount = total - activeCount;
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Người dùng | Dental Empire Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <h2 class="text-3xl font-bold text-white mb-1">Quản lý Người dùng</h2> <p class="text-on-surface-variant"> ${total} người dùng · ${activeCount} kích hoạt · ${inactiveCount} chờ kích hoạt
</p> </div> </div> ${total === 0 ? renderTemplate`<div class="text-center py-16 glass-card rounded-xl"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/40">people</span> <p class="text-on-surface-variant mt-3">Chưa có người dùng nào</p> </div>` : renderTemplate`<div class="glass-card rounded-xl overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full text-sm text-left"> <thead> <tr class="border-b border-outline-variant/20 text-on-surface-variant uppercase text-xs tracking-wider"> <th class="px-6 py-4 font-bold">Tên</th> <th class="px-6 py-4 font-bold">Email</th> <th class="px-6 py-4 font-bold">Ngày đăng ký</th> <th class="px-6 py-4 font-bold text-center">Trạng thái</th> <th class="px-6 py-4 font-bold text-center">Thao tác</th> </tr> </thead> <tbody> ${users.map((user) => renderTemplate`<tr class="border-b border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors"${addAttribute(user.id, "data-user-id")}> <td class="px-6 py-4 font-medium text-on-surface">${user.name}</td> <td class="px-6 py-4 text-on-surface-variant">${user.email}</td> <td class="px-6 py-4 text-on-surface-variant"> ${new Date(user.createdAt).toLocaleDateString("vi-VN")} </td> <td class="px-6 py-4 text-center"> ${user.is_active === 1 ? renderTemplate`<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/30"> <span class="material-symbols-outlined text-[14px]">check_circle</span>
Kích hoạt
</span>` : renderTemplate`<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"> <span class="material-symbols-outlined text-[14px]">pending</span>
Chờ kích hoạt
</span>`} </td> <td class="px-6 py-4 text-center"> <button type="button"${addAttribute(["toggle-active-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer", [
    user.is_active === 1 ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25" : "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
  ]], "class:list")}${addAttribute(user.id, "data-user-id")}> <span class="material-symbols-outlined text-[16px]"> ${user.is_active === 1 ? "person_off" : "person_add"} </span> ${user.is_active === 1 ? "Vô hiệu hóa" : "Kích hoạt"} </button> </td> </tr>`)} </tbody> </table> </div> </div>`}${renderScript($$result2, "C:/dentalempireos/src/pages/admin/users/index.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/admin/users/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/users/index.astro";
const $$url = "/admin/users";
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
