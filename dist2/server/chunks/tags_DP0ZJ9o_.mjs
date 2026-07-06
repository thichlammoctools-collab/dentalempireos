globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CSH0S1kB.mjs";
import { env } from "cloudflare:workers";
import { upsertTag, deleteTag, getTags as listTags } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Tags;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = form.get("_action");
    if (action === "upsert") {
      const id = form.get("id");
      const name = form.get("name");
      const slug = form.get("slug");
      if (id && name && slug) {
        await upsertTag(env.DB, { id, name, slug });
      }
    } else if (action === "delete") {
      const id = form.get("id");
      if (id) await deleteTag(env.DB, id);
    }
    return Astro2.redirect("/admin/blog/tags");
  }
  const tags = await listTags(env.DB);
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Tags | Blog Admin" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-[600px] w-full mx-auto flex flex-col gap-6"> <!-- Header --> <div class="flex items-center justify-between"> <div> <h2 class="text-3xl font-bold text-white">Tags</h2> <p class="text-on-surface-variant text-sm mt-1">${tags.length} tags</p> </div> <a href="/admin/blog" class="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">arrow_back</span>
Quay lại blog
</a> </div> <!-- Add new --> <section class="glass-card rounded-xl p-5"> <h3 class="text-sm font-bold text-white mb-4">Thêm tag mới</h3> <form method="post" class="flex flex-col gap-4"> <input type="hidden" name="_action" value="upsert"> <input type="hidden" name="id" id="new-id" value=""> <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">Tên <span class="text-red-400">*</span></label> <input type="text" name="name" id="tag-name" required placeholder="VD: Marketing" class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">Slug <span class="text-red-400">*</span></label> <input type="text" name="slug" id="tag-slug" required placeholder="VD: marketing" class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none"> </div> </div> <div class="flex gap-2"> <button type="submit" class="px-6 py-2.5 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all">Lưu</button> <button type="button" onclick="resetForm()" class="px-4 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl font-bold hover:border-primary hover:text-primary transition-all">Hủy</button> </div> </form> </section> <!-- Tags grid --> <div class="grid grid-cols-1 gap-2"> ${tags.map((tag) => renderTemplate`<div class="glass-card rounded-xl p-4 flex items-center justify-between group"> <div class="flex items-center gap-3"> <span class="text-xs font-mono text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">#${tag.slug}</span> <span class="font-semibold text-white">${tag.name}</span> <span class="text-xs text-on-surface-variant">${tag.post_count} bài</span> </div> <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"> <button type="button"${addAttribute(`editTag('${tag.id}','${tag.name}','${tag.slug}')`, "onclick")} class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"> <span class="material-symbols-outlined text-[16px]">edit</span> </button> <form method="post" class="inline"> <input type="hidden" name="_action" value="delete"> <input type="hidden" name="id"${addAttribute(tag.id, "value")}> <button type="submit" onclick="return confirm('Xóa tag này?')" class="p-1.5 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 transition-all"> <span class="material-symbols-outlined text-[16px]">delete</span> </button> </form> </div> </div>`)} </div> </div> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/blog/tags.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/blog/tags.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/blog/tags.astro";
const $$url = "/admin/blog/tags";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Tags,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
