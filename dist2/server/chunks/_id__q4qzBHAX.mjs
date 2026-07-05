globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_VoTlS2tl.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_Do1AQBaG.mjs";
import { env } from "cloudflare:workers";
import { g as getCourse, a as getCourseVideos } from "./course-db_J4CV3PXm.mjs";
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) return Astro2.redirect("/admin/courses");
  const course = await getCourse(env.DB, id);
  if (!course) return Astro2.redirect("/admin/courses");
  const videos = await getCourseVideos(env.DB, id);
  function nanoid() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  const newVideoId = nanoid();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": `${course.title} | Khóa Học` }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <div class="flex items-center gap-2 text-sm text-on-surface-variant mb-2"> <a href="/admin/courses" class="hover:text-primary transition-colors flex items-center gap-1"> <span class="material-symbols-outlined text-[16px]">arrow_back</span>
Khóa học
</a> <span class="material-symbols-outlined text-[16px]">chevron_right</span> <span>${course.title}</span> </div> <h2 class="text-3xl font-bold text-white">${course.title}</h2> <p class="text-on-surface-variant text-sm mt-1">${videos.length} video · ${course.is_published === 1 ? "Đã xuất bản" : "Bản nháp"}</p> </div> <div class="flex gap-2"> <a${addAttribute(`/courses/${id}`, "href")} target="_blank" class="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">visibility</span>
Xem
</a> </div> </div>  <section class="glass-card rounded-xl p-6"> <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">info</span>
Thông tin khóa học
</h3> <form id="course-form" class="flex flex-col sm:grid sm:grid-cols-2 gap-4"> <input type="hidden" name="id"${addAttribute(course.id, "value")}> <div class="sm:col-span-2"> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">Tiêu đề</label> <input type="text" name="title"${addAttribute(course.title, "value")} required class="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> </div> <div class="sm:col-span-2"> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">Mô tả</label> <textarea name="description" rows="2" class="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none resize-none">${course.description ?? ""}</textarea> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">Ảnh bìa (URL)</label> <input type="url" name="thumbnail_url"${addAttribute(course.thumbnail_url ?? "", "value")} class="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">Thứ tự hiển thị</label> <input type="number" name="sort_order"${addAttribute(course.sort_order, "value")} class="w-full px-4 py-2.5 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> </div> <div class="flex items-center gap-3"> <input type="checkbox" name="is_published" id="is-published" value="1"${addAttribute(course.is_published === 1, "checked")} class="w-4 h-4 accent-[#2b98dd]"> <label for="is-published" class="text-sm text-white">Xuất bản</label> </div> <div class="sm:col-span-2 flex justify-end"> <button type="submit" class="px-6 py-2.5 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">save</span>
Lưu thay đổi
</button> </div> </form> </section>  <section class="glass-card rounded-xl p-6"> <div class="flex items-center justify-between mb-4"> <h3 class="text-sm font-bold text-white flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">video_library</span>
Videos (${videos.length})
</h3> <button id="btn-add-video" class="px-4 py-2 bg-primary-container text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">add</span>
Thêm video
</button> </div> <!-- Add Video Form --> <div id="add-video-form" class="hidden mb-6 p-4 bg-surface-container-high rounded-xl flex flex-col gap-3"> <h4 class="text-sm font-bold text-white">Thêm video mới</h4> <input type="hidden" name="id" id="video-id"${addAttribute(newVideoId, "value")}> <div class="grid grid-cols-1 sm:grid-cols-2 gap-3"> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">YouTube ID <span class="text-red-400">*</span></label> <input type="text" id="video-youtube-id" required class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="dQw4w9WgXcQ"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">Tiêu đề <span class="text-red-400">*</span></label> <input type="text" id="video-title" required class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Tên bài giảng"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">Thứ tự</label> <input type="number" id="video-sort-order"${addAttribute(videos.length, "value")} class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">Thời lượng (giây)</label> <input type="number" id="video-duration" class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="600"> </div> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant mb-1">Mô tả</label> <textarea id="video-description" rows="2" class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-xl text-white text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none" placeholder="Mô tả bài giảng..."></textarea> </div> <div class="flex gap-2"> <button type="button" id="btn-cancel-video" class="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface transition-all">Hủy</button> <button type="button" id="btn-save-video" class="px-4 py-2 bg-primary-container text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2"> <span class="material-symbols-outlined text-[16px]">add</span>
Thêm
</button> </div> </div> <!-- Videos List --> ${videos.length === 0 ? renderTemplate`<div class="text-center py-10"> <span class="material-symbols-outlined text-5xl text-on-surface-variant/30">video_library</span> <p class="text-on-surface-variant mt-2 text-sm">Chưa có video nào. Thêm video đầu tiên.</p> </div>` : renderTemplate`<div class="flex flex-col gap-2"> ${videos.map((video, index) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`;
    return renderTemplate`<div class="flex items-start gap-3 p-3 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors group video-row"${addAttribute(video.id, "data-video-id")}> <span class="text-sm font-bold text-on-surface-variant/40 w-6 shrink-0 pt-1">${index + 1}</span> <img${addAttribute(thumbnailUrl, "src")}${addAttribute(video.title, "alt")} class="w-32 h-18 rounded-lg object-cover shrink-0"> <div class="flex-1 min-w-0"> <p class="font-semibold text-white text-sm">${video.title}</p> <p class="text-xs text-on-surface-variant/60 mt-0.5">${video.youtube_id} · Thứ tự: ${video.sort_order}</p> <span${addAttribute(`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${video.is_published === 1 ? "text-green-400 bg-green-400/10" : "text-on-surface-variant bg-surface-container"}`, "class")}> ${video.is_published === 1 ? "Đã xuất bản" : "Bản nháp"} </span> </div> <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"> <button type="button"${addAttribute(video.id, "data-edit-video")} class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface transition-all" title="Sửa"> <span class="material-symbols-outlined text-[16px]">edit</span> </button> <button type="button"${addAttribute(video.id, "data-delete-video")} class="p-1.5 rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-400/10 transition-all" title="Xóa"> <span class="material-symbols-outlined text-[16px]">delete</span> </button> </div> </div>`;
  })} </div>`} </section> ` })} ${renderScript($$result, "C:/dentalempireos/src/pages/admin/courses/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/admin/courses/[id].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/courses/[id].astro";
const $$url = "/admin/courses/[id]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
