globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_VoTlS2tl.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_Do1AQBaG.mjs";
const $$New = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Thêm Nội Dung | Dental Empire Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-[720px] w-full mx-auto"> <div class="mb-8"> <h2 class="text-3xl font-bold text-white mb-2">Thêm Nội Dung Mới</h2> <p class="text-on-surface-variant">
Tạo chương mới — sau khi tạo, bạn sẽ vào editor để thêm đề mục, nội dung, ảnh minh họa và biểu mẫu.
</p> </div> <form id="new-chapter-form" class="space-y-5"> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1">Tầng</label> <select name="tier" required class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-white focus:ring-2 focus:ring-primary focus:outline-none"> <option value="1">Tầng 1 — Dental Empire C++</option> <option value="2">Tầng 2 — Dental Empire U++</option> <option value="3" selected>Tầng 3 — Dental Empire OS</option> </select> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1">Số chương</label> <input type="number" name="chapter_no" min="1" max="99" required class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-white focus:ring-2 focus:ring-primary focus:outline-none"> </div> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1">Tiêu đề chương</label> <input type="text" name="title" required placeholder="VD: Tổng Quan Hệ Thống" class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none"> <p class="text-xs text-on-surface-variant mt-1">Slug sẽ tự tạo từ tiêu đề (vd: "tong-quan-he-thong").</p> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1">Mô tả ngắn</label> <input type="text" name="description" placeholder="1-2 dòng mô tả nội dung chương" class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none"> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-1">Trạng thái</label> <select name="status" class="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl text-white focus:ring-2 focus:ring-primary focus:outline-none"> <option value="draft">Bản nháp</option> <option value="published">Xuất bản</option> </select> </div> <div class="flex flex-col sm:flex-row gap-3 pt-2"> <button type="submit" class="flex-1 px-6 py-3 btn-primary-metallic font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"> <span class="material-symbols-outlined text-[18px]">add</span>
Tạo chương
</button> <a href="/admin/ebooks" class="flex-1 px-6 py-3 border-2 border-outline text-on-surface-variant font-bold rounded-xl hover:border-primary hover:text-primary text-center transition-all">
Hủy
</a> </div> <p id="form-error" class="hidden text-sm text-error"></p> </form> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/ebooks/new.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/ebooks/new.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/ebooks/new.astro";
const $$url = "/admin/ebooks/new";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
