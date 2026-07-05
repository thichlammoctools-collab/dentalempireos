globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_CMqveNVP.mjs";
import { $ as $$DevNotice } from "./DevNotice_1rjutr2a.mjs";
import { env } from "cloudflare:workers";
import { l as listCourses, a as getCourseVideos } from "./course-db_J4CV3PXm.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const db = env.DB;
  const courses = await listCourses(db, { publishedOnly: true });
  const coursesWithVideos = await Promise.all(
    courses.map(async (course) => {
      const videos = await getCourseVideos(db, course.id, { publishedOnly: true });
      return { course, videos };
    })
  );
  const allVideos = coursesWithVideos.flatMap(
    ({ course, videos }) => videos.map((video) => ({
      ...video,
      courseTitle: course.title,
      courseId: course.id,
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`
    }))
  );
  const featuredVideos = allVideos.slice(0, 6);
  const totalVideos = allVideos.length;
  const totalCourses = courses.length;
  function formatDuration(seconds) {
    if (!seconds) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  const user = Astro2.locals.user;
  const isLoggedIn = !!user;
  const isActivated = user?.is_active === 1;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Video Học Tập | Dental Empire OS", "description": "Thư viện video bài giảng YouTube từ Dental Empire OS, sắp xếp theo khóa học chuyên sâu." }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DevNotice", $$DevNotice, {})}  ${maybeRenderHead()}<section class="relative py-20 overflow-hidden"> <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div> <div class="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div> <div class="relative max-w-[1200px] mx-auto px-6 text-center space-y-6"> <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"> <span class="material-symbols-outlined text-[16px]">play_circle</span>
Thư Viện Video
</div> <h1 class="text-headline-large font-bold text-white">
Học tập qua <span class="text-primary">Video</span> </h1> <p class="text-on-surface-variant max-w-2xl mx-auto">
Tổng hợp bài giảng video chuyên sâu từ YouTube, được sắp xếp theo khóa học
        giúp bạn tiếp cận kiến thức quản trị nha khoa một cách bài bản.
</p> <div class="flex items-center justify-center gap-8 text-sm text-on-surface-variant"> <span class="flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">movie</span> <strong class="text-white">${totalVideos}</strong> video
</span> <span class="flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[18px]">school</span> <strong class="text-white">${totalCourses}</strong> khóa học
</span> </div> </div> </section>  ${!isLoggedIn ? renderTemplate`<section class="max-w-[1200px] mx-auto px-6 pb-20"> <div class="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto"> <div class="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-6"> <span class="material-symbols-outlined text-4xl text-on-surface-variant">lock</span> </div> <h2 class="text-2xl font-bold text-white mb-3">Đăng nhập để xem video</h2> <p class="text-on-surface-variant mb-6">
Nội dung video chỉ dành cho thành viên đã đăng ký. Vui lòng đăng nhập để tiếp tục.
</p> <a href="/login" class="inline-flex items-center gap-2 bg-primary-container text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"> <span class="material-symbols-outlined text-[20px]">login</span>
Đăng nhập
</a> </div> </section>` : !isActivated ? renderTemplate`<section class="max-w-[1200px] mx-auto px-6 pb-20"> <div class="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto"> <div class="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-6"> <span class="material-symbols-outlined text-4xl text-tertiary">hourglass_empty</span> </div> <h2 class="text-2xl font-bold text-white mb-3">Tài khoản chưa được kích hoạt</h2> <p class="text-on-surface-variant mb-6">
Tài khoản của bạn đang chờ được quản trị viên kích hoạt.
          Vui lòng liên hệ hỗ trợ nếu bạn cần kích hoạt ngay.
</p> <p class="text-sm text-on-surface-variant/60">
Đã đăng nhập với: <strong class="text-white">${user.email}</strong> </p> </div> </section>` : renderTemplate`<div class="max-w-[1200px] mx-auto px-6 pb-20 pt-10 flex flex-col gap-16"> <!-- Featured Videos --> ${featuredVideos.length > 0 && renderTemplate`<section> <div class="flex items-center justify-between mb-6"> <h2 class="text-xl font-bold text-white flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">play_circle</span>
Video nổi bật
</h2> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"> ${featuredVideos.map((video, i) => renderTemplate`<a${addAttribute(`/courses/${video.courseId}?v=${video.id}`, "href")} class="group"> <article class="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"> <!-- Thumbnail --> <div class="relative aspect-video overflow-hidden"> <img${addAttribute(video.thumbnailUrl, "src")}${addAttribute(video.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${addAttribute(i < 3 ? "eager" : "lazy", "loading")}> <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"> <span class="material-symbols-outlined text-6xl text-white">play_circle</span> </div> ${video.duration_seconds && renderTemplate`<span class="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded"> ${formatDuration(video.duration_seconds)} </span>`} </div> <!-- Content --> <div class="p-4"> <p class="text-[10px] font-bold uppercase tracking-wider text-primary mb-1"> ${video.courseTitle} </p> <h3 class="text-sm font-bold text-white line-clamp-2 group-hover:text-primary transition-colors leading-snug"> ${video.title} </h3> ${video.description && renderTemplate`<p class="text-xs text-on-surface-variant line-clamp-1 mt-1">${video.description}</p>`} </div> </article> </a>`)} </div> </section>`} <!-- Course Grid --> ${courses.length > 0 ? renderTemplate`<section> <div class="flex items-center justify-between mb-6"> <h2 class="text-xl font-bold text-white flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">school</span>
Khóa học
</h2> <a href="/courses" class="text-sm text-primary hover:text-white transition-colors flex items-center gap-1">
Xem tất cả
<span class="material-symbols-outlined text-[16px]">arrow_forward</span> </a> </div> <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${courses.map((course) => renderTemplate`<a${addAttribute(`/courses/${course.id}`, "href")} class="group"> <div class="glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"> <div class="relative aspect-video overflow-hidden"> ${course.thumbnail_url ? renderTemplate`<img${addAttribute(course.thumbnail_url, "src")}${addAttribute(course.title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">` : renderTemplate`<div class="w-full h-full bg-gradient-to-br from-primary/20 to-tertiary/10 flex items-center justify-center"> <span class="material-symbols-outlined text-5xl text-primary/40">play_circle</span> </div>`} <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"> <span class="material-symbols-outlined text-6xl text-white">play_circle</span> </div> <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5"> <span class="material-symbols-outlined text-[16px] text-white">play_arrow</span> <span class="text-xs font-bold text-white">${course.video_count} video${course.video_count !== 1 ? "s" : ""}</span> </div> </div> <div class="p-5"> <h3 class="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-2 mb-2"> ${course.title} </h3> ${course.description && renderTemplate`<p class="text-sm text-on-surface-variant line-clamp-2 leading-relaxed"> ${course.description} </p>`} <div class="mt-4 flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all"> <span>Xem khóa học</span> <span class="material-symbols-outlined text-[18px]">arrow_forward</span> </div> </div> </div> </a>`)} </div> </section>` : renderTemplate`<section class="text-center py-20"> <div class="w-24 h-24 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-6"> <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">movie</span> </div> <h2 class="text-2xl font-bold text-white mb-3">Chưa có khóa học nào</h2> <p class="text-on-surface-variant">Các khóa học video sẽ sớm được cập nhật.</p> </section>`} </div>`}` })}`;
}, "C:/dentalempireos/src/pages/videos/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/videos/index.astro";
const $$url = "/videos";
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
