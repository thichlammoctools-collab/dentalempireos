globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_Bgrinth3.mjs";
import { env } from "cloudflare:workers";
import { g as getPayosSettings } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const $$Payos = createComponent(async ($$result, $$props, $$slots) => {
  const settings = await getPayosSettings(env.DB);
  function maskKey(key) {
    if (!key || key.length < 14) return "••••••••••";
    return key.slice(0, 6) + "••••••" + key.slice(-4);
  }
  const apiKeyMasked = settings?.api_key ? maskKey(settings.api_key) : "";
  const checksumKeyMasked = settings?.checksum_key ? maskKey(settings.checksum_key) : "";
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Cài đặt PayOS | Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl w-full"> <!-- Header --> <div class="mb-6"> <h2 class="text-3xl font-bold text-white mb-1">Cài đặt PayOS</h2> <p class="text-on-surface-variant text-sm">
Cấu hình cổng thanh toán PayOS cho hệ thống.
</p> </div> <form id="payos-form" class="flex flex-col gap-5"> <!-- Toggle enabled --> <div class="glass-card rounded-xl p-5"> <div class="flex items-center justify-between"> <div> <h3 class="text-base font-bold text-white mb-0.5">Kích hoạt PayOS</h3> <p class="text-xs text-on-surface-variant">Bật/tắt cổng thanh toán tự động</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" id="field-is_active" class="sr-only peer"${addAttribute(settings?.is_active === 1, "checked")}> <div class="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4.5 rtl:peer-checked:after:-translate-x-4.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-on-surface-variant after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white"></div> </label> </div> </div> <!-- Credentials --> <div class="glass-card rounded-xl p-5 flex flex-col gap-4" id="credentials-fields"> <!-- Sandbox mode --> <div> <div class="flex items-center justify-between mb-1"> <label class="text-sm font-semibold text-on-surface-variant">Chế độ Sandbox</label> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" id="field-sandbox_mode" class="sr-only peer"${addAttribute(settings?.sandbox_mode === 1, "checked")}> <div class="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-on-surface-variant after:border after:border-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white"></div> </label> </div> <p class="text-xs text-on-surface-variant">
Bật = sandbox (test), Tắt = production (thật).
</p> </div> <!-- Client ID --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-client_id">
Client ID <span class="text-red-400">*</span> </label> <input type="text" id="field-client_id"${addAttribute(settings?.client_id ?? "", "value")} class="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none font-mono" placeholder="Nhập Client ID từ PayOS dashboard"> </div> <!-- API Key --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-api_key">
API Key <span class="text-red-400">*</span> </label> <input type="password" id="field-api_key"${addAttribute(settings?.api_key ?? "", "value")}${addAttribute(apiKeyMasked, "data-masked")} class="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none font-mono" placeholder="Nhập API Key từ PayOS dashboard"> ${apiKeyMasked && renderTemplate`<p class="text-xs text-on-surface-variant mt-1" id="api-key-hint">
Hiện tại: <span class="font-mono">${apiKeyMasked}</span> </p>`} </div> <!-- Checksum Key --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-checksum_key">
Checksum Key <span class="text-red-400">*</span> </label> <input type="password" id="field-checksum_key"${addAttribute(settings?.checksum_key ?? "", "value")}${addAttribute(checksumKeyMasked, "data-masked")} class="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none font-mono" placeholder="Nhập Checksum Key từ PayOS dashboard"> ${checksumKeyMasked && renderTemplate`<p class="text-xs text-on-surface-variant mt-1" id="checksum-key-hint">
Hiện tại: <span class="font-mono">${checksumKeyMasked}</span> </p>`} </div> <!-- Webhook URL --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-webhook_url">
Webhook URL
</label> <div class="flex items-center gap-2"> <input type="text" id="field-webhook_url"${addAttribute(settings?.webhook_url ?? "https://dentalempireos.com/api/payos/webhook", "value")} class="flex-1 px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none font-mono" placeholder="https://dentalempireos.com/api/payos/webhook"> <button type="button" id="btn-register-webhook" class="shrink-0 px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-white/10 transition-colors">
Đăng ký
</button> </div> <p class="text-xs text-on-surface-variant mt-1">
Nhấn "Đăng ký" để gửi URL này tới PayOS dashboard.
</p> </div> </div> <!-- Save button --> <div class="flex items-center gap-3"> <button type="submit" class="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">save</span>
Lưu thay đổi
</button> <span id="save-status" class="text-sm text-on-surface-variant"></span> </div> </form> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/settings/payos.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/settings/payos.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/settings/payos.astro";
const $$url = "/admin/settings/payos";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Payos,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
