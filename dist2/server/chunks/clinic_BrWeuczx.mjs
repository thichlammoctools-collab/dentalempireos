globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_CcpFbi8U.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_lrzeJKgU.mjs";
import { env } from "cloudflare:workers";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { g as getClinicProfile } from "./clinic-profile-db_Pku6qJUb.mjs";
const prerender = false;
const $$Clinic = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Clinic;
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!session?.user) {
    return Astro2.redirect("/login?redirect=/account/clinic");
  }
  const profile = await getClinicProfile(env.DB, session.user.id);
  const initial = {
    name: profile?.name ?? session.user.name ?? "",
    clinic_name: profile?.clinic_name ?? "",
    clinic_address: profile?.clinic_address ?? "",
    phone: profile?.phone ?? "",
    logo_url: profile?.logo_url ?? null,
    updated_at: profile?.updated_at ?? null
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Hồ Sơ Phòng Khám | Dental Empire OS", "description": "Quản lý thông tin phòng khám.", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-24 pb-16"> <div class="max-w-[860px] mx-auto px-4 md:px-6"> <!-- Page Header --> <div class="flex items-center justify-between mb-6 md:mb-8"> <div> <h1 class="text-xl md:text-2xl font-bold text-white">Hồ sơ phòng khám</h1> <p class="text-xs md:text-sm text-on-surface-variant mt-1 hidden sm:block">Thông tin phòng khám dùng để prefill khi làm scanner.</p> </div> <a href="/account/profile" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-outline-variant/20 text-sm text-on-surface-variant hover:text-white transition-all"> <span class="material-symbols-outlined text-base">arrow_back</span> <span class="hidden sm:inline">Quay lại</span> </a> </div> <div class="flex flex-col gap-4 md:gap-6"> <!-- Logo Upload Card --> <div class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <h2 class="text-sm font-bold text-white mb-1">Logo phòng khám</h2> <p class="text-xs text-on-surface-variant mb-5">Logo sẽ hiển thị khi xuất kết quả scanner.</p> <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5"> <!-- Logo preview --> <div class="relative group" id="logo-container"> ${initial.logo_url ? renderTemplate`<img id="logo-preview"${addAttribute(initial.logo_url, "src")} alt="Clinic logo" class="w-24 h-24 rounded-2xl object-contain bg-white/5 border border-outline-variant/30">` : renderTemplate`<div id="logo-preview" class="w-24 h-24 rounded-2xl bg-white/5 border border-dashed border-outline-variant/40 flex items-center justify-center"> <span class="material-symbols-outlined text-4xl text-on-surface-variant/30">image</span> </div>`} <!-- Overlay actions --> <div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" id="logo-actions-overlay"> <button id="logo-change-btn" type="button" class="w-9 h-9 rounded-full bg-black/70 flex items-center justify-center hover:bg-black/80 transition-colors" title="Thay đổi logo"> <span class="material-symbols-outlined text-base text-white">edit</span> </button> ${initial.logo_url && renderTemplate`<button id="logo-delete-btn" type="button" class="w-9 h-9 rounded-full bg-rose-500/80 flex items-center justify-center hover:bg-rose-500 transition-colors" title="Xóa logo"> <span class="material-symbols-outlined text-base text-white">delete</span> </button>`} </div> </div> <div class="flex-1"> <p class="text-xs text-on-surface-variant mb-2">Hỗ trợ JPEG, PNG, WebP, SVG. Tối đa 2MB.</p> <button id="logo-upload-btn" type="button" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all active:scale-95"> <span class="flex items-center gap-2"> <span class="material-symbols-outlined text-base">cloud_upload</span>
Tải lên logo
</span> </button> <input id="logo-input" type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" class="hidden"> <p id="logo-error" class="hidden text-xs text-rose-400 mt-2"></p> </div> </div> </div> <!-- Clinic Info Form --> <div class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <h2 class="text-sm font-bold text-white mb-5">Thông tin phòng khám</h2> <div class="flex flex-col gap-4"> <!-- Owner name --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="name-input">
Tên người đại diện
</label> <input id="name-input" type="text"${addAttribute(initial.name, "value")} maxlength="100" placeholder="Nguyễn Văn A" class="w-full px-3 py-2.5 bg-white/5 border border-outline-variant rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> </div> <!-- Clinic name --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="clinic-name-input">
Tên phòng khám <span class="text-rose-400">*</span> </label> <input id="clinic-name-input" type="text"${addAttribute(initial.clinic_name, "value")} maxlength="200" placeholder="Nha Khoa Thẩm Mỹ Quốc Tế" class="w-full px-3 py-2.5 bg-white/5 border border-outline-variant rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> </div> <!-- Clinic address --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="clinic-address-input">
Địa chỉ phòng khám
</label> <input id="clinic-address-input" type="text"${addAttribute(initial.clinic_address, "value")} maxlength="300" placeholder="123 Đường ABC, Quận 1, TP. Hồ Chí Minh" class="w-full px-3 py-2.5 bg-white/5 border border-outline-variant rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> </div> <!-- Phone --> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="phone-input">
Số điện thoại
</label> <input id="phone-input" type="tel"${addAttribute(initial.phone, "value")} maxlength="20" placeholder="0901 234 567" class="w-full px-3 py-2.5 bg-white/5 border border-outline-variant rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> </div> <div class="pt-2"> <button id="save-btn" type="button" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"> <span id="save-btn-text">Lưu thông tin</span> </button> <p id="save-error" class="hidden text-xs text-rose-400 mt-2"></p> <p id="save-success" class="hidden text-xs text-emerald-400 mt-2"></p> </div> </div> </div> <!-- Info card --> <div class="glass-card rounded-2xl p-4 border border-outline-variant/20 bg-gradient-to-r from-primary/5 to-transparent"> <div class="flex items-start gap-3"> <span class="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">info</span> <div> <p class="text-sm font-semibold text-white">Thông tin được sử dụng thế nào?</p> <p class="text-xs text-on-surface-variant mt-1">
Khi bạn làm scanner, thông tin phòng khám sẽ được tự động điền vào form — bạn không cần nhập lại mỗi lần.
                Logo phòng khám sẽ xuất hiện trên kết quả scanner khi bạn chia sẻ.
</p> </div> </div> </div> </div> </div> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/account/clinic.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/account/clinic.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/account/clinic.astro";
const $$url = "/account/clinic";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Clinic,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
