globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CSH0S1kB.mjs";
import { env } from "cloudflare:workers";
import { a as listOrders } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const db = env.DB;
  const status = Astro2.url.searchParams.get("status") ?? void 0;
  const limit = 50;
  const offset = 0;
  const { orders, total } = await listOrders(db, { status, limit, offset });
  const statusColors = {
    pending: "bg-amber-500/20 text-amber-400",
    paid: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-white/10 text-white/50",
    expired: "bg-rose-500/20 text-rose-400"
  };
  const statusLabels = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    cancelled: "Đã hủy",
    expired: "Hết hạn"
  };
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Đơn Hàng | Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <h2 class="text-3xl font-bold text-white mb-1">Quản lý Đơn Hàng</h2> <p class="text-on-surface-variant">${total} đơn hàng</p> </div> <!-- Status filter --> <div class="flex gap-2"> <a href="/admin/orders"${addAttribute(`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!status ? "bg-primary text-white" : "bg-white/5 text-on-surface-variant hover:bg-white/10"}`, "class")}>
Tất cả
</a> ${Object.entries(statusLabels).map(([key, label]) => renderTemplate`<a${addAttribute(`/admin/orders?status=${key}`, "href")}${addAttribute(`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${status === key ? "bg-primary text-white" : "bg-white/5 text-on-surface-variant hover:bg-white/10"}`, "class")}> ${label} </a>`)} </div> </div>  <div class="mt-8 glass-card rounded-2xl border border-outline-variant/20 overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full text-sm"> <thead> <tr class="border-b border-outline-variant/20 text-on-surface-variant"> <th class="text-left px-4 py-3 font-semibold">Mã đơn</th> <th class="text-left px-4 py-3 font-semibold">User ID</th> <th class="text-left px-4 py-3 font-semibold">Sản phẩm</th> <th class="text-right px-4 py-3 font-semibold">Số tiền</th> <th class="text-center px-4 py-3 font-semibold">Trạng thái</th> <th class="text-left px-4 py-3 font-semibold">Ngày tạo</th> <th class="text-left px-4 py-3 font-semibold">Ngày thanh toán</th> </tr> </thead> <tbody> ${orders.length === 0 ? renderTemplate`<tr> <td colspan="7" class="px-4 py-8 text-center text-on-surface-variant">
Chưa có đơn hàng nào.
</td> </tr>` : orders.map((o) => renderTemplate`<tr class="border-b border-outline-variant/10 hover:bg-white/5 transition-colors"> <td class="px-4 py-3 text-white font-mono text-xs">${o.order_code}</td> <td class="px-4 py-3 text-on-surface-variant font-mono text-xs">${o.user_id.slice(0, 8)}...</td> <td class="px-4 py-3 text-on-surface-variant font-mono text-xs">${o.product_id}</td> <td class="px-4 py-3 text-right text-white">${o.amount.toLocaleString("vi-VN")}₫</td> <td class="px-4 py-3 text-center"> <span${addAttribute(`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[o.status] ?? ""}`, "class")}> ${statusLabels[o.status] ?? o.status} </span> </td> <td class="px-4 py-3 text-on-surface-variant text-xs"> ${new Date(o.created_at).toLocaleDateString("vi-VN")} </td> <td class="px-4 py-3 text-on-surface-variant text-xs"> ${o.paid_at ? new Date(o.paid_at).toLocaleDateString("vi-VN") : "—"} </td> </tr>`)} </tbody> </table> </div> </div> ` })}`;
}, "C:/dentalempireos/src/pages/admin/orders/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/orders/index.astro";
const $$url = "/admin/orders";
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
