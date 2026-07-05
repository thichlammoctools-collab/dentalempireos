globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CB59U0YH.mjs";
import { env } from "cloudflare:workers";
import { g as getSupportSettings } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const $$Support = createComponent(async ($$result, $$props, $$slots) => {
  const settings = await getSupportSettings(env.DB);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Cài đặt Ủng Hộ | Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-2xl w-full"> <!-- Header --> <div class="mb-6"> <h2 class="text-3xl font-bold text-white mb-1">Cài đặt Ủng Hộ Tác Giả</h2> <p class="text-on-surface-variant text-sm">
Tuỳ chỉnh nội dung widget hiển thị ở cuối mỗi chương sách.
</p> </div> <form id="support-form" class="flex flex-col gap-5"> <!-- Toggle enabled --> <div class="glass-card rounded-xl p-5"> <div class="flex items-center justify-between"> <div> <h3 class="text-base font-bold text-white mb-0.5">Hiển thị widget</h3> <p class="text-xs text-on-surface-variant">Bật/tắt mục ủng hộ ở cuối chương</p> </div> <label class="relative inline-flex items-center cursor-pointer"> <input type="checkbox" id="field-enabled" class="sr-only peer"${addAttribute(settings?.enabled === 1, "checked")}> <div class="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4.5 rtl:peer-checked:after:-translate-x-4.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-on-surface-variant after:border after:border-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-white"></div> </label> </div> </div> <!-- Content fields --> <div class="glass-card rounded-xl p-5 flex flex-col gap-4" id="content-fields"> <!-- Title --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-title">
Tiêu đề
</label> <input type="text" id="field-title"${addAttribute(settings?.title ?? "Ủng Hộ Tác Giả", "value")} class="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Ủng Hộ Tác Giả"> </div> <!-- Message --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-message">
Thông điệp
</label> <textarea id="field-message" rows="3" class="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-y" placeholder="Nếu cuốn sách đã mang lại giá trị cho bạn...">${settings?.message ?? ""}</textarea> </div> <!-- QR URL --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">
URL ảnh QR Code
</label> <!-- Upload area --> <div class="mb-3 p-4 border-2 border-dashed border-outline-variant rounded-lg hover:border-primary transition-colors cursor-pointer" id="qr-upload-area"> <input type="file" id="qr-file-input" accept="image/*" class="hidden"> <div class="flex flex-col items-center justify-center text-center"> <span class="material-symbols-outlined text-[32px] text-on-surface-variant mb-2">cloud_upload</span> <p class="text-sm text-on-surface-variant font-medium">Kéo thả hoặc click để upload</p> <p class="text-xs text-on-surface-variant mt-1">PNG, JPG, WebP, SVG (tối đa 10MB)</p> </div> <div id="qr-upload-progress" class="hidden mt-3"> <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden"> <div id="qr-progress-bar" class="h-full bg-primary transition-all duration-300" style="width: 0%"></div> </div> <p id="qr-upload-status" class="text-xs text-on-surface-variant mt-2">Đang upload...</p> </div> </div> <!-- URL input and preview --> <div class="flex items-center gap-3"> <input type="text" id="field-qr_url"${addAttribute(settings?.qr_url ?? "/images/qr/donation-qr.svg", "value")} class="flex-1 px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none font-mono" placeholder="/images/qr/donation-qr.svg"> ${settings?.qr_url && renderTemplate`<div class="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-outline-variant"> <img${addAttribute(settings.qr_url, "src")} alt="QR preview" class="w-full h-full object-cover"> </div>`} </div> <p class="text-xs text-on-surface-variant mt-1.5">Hoặc nhập đường dẫn URL trực tiếp.</p> </div> <!-- Payment Methods --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="field-payment_methods">
Phương thức thanh toán
</label> <input type="text" id="field-payment_methods"${addAttribute(settings?.payment_methods ?? "Vietcombank, Techcombank, Momo, ZaloPay", "value")} class="w-full px-3 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Vietcombank, Techcombank, Momo, ZaloPay"> <p class="text-xs text-on-surface-variant mt-1">Phân cách bằng dấu phẩy.</p> </div> </div> <!-- Save button --> <div class="flex items-center gap-3"> <button type="submit" class="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">save</span>
Lưu thay đổi
</button> <span id="save-status" class="text-sm text-on-surface-variant"></span> </div> </form> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/settings/support.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/settings/support.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/settings/support.astro";
const $$url = "/admin/settings/support";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Support,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
