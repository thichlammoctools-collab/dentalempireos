globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_BOB8F8DU.mjs";
import { env } from "cloudflare:workers";
import { g as getCourse, a as getCourseVideos } from "./course-db_J4CV3PXm.mjs";
const $$VideoPlayer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$VideoPlayer;
  const { youtubeId, title, autoplay = false } = Astro2.props;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
  return renderTemplate`${maybeRenderHead()}<div class="video-player-wrapper relative w-full" style="padding-top: 56.25%;"> <iframe class="absolute inset-0 w-full h-full rounded-xl"${addAttribute(embedUrl, "src")}${addAttribute(title ?? "YouTube video", "title")} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> </div>`;
}, "C:/dentalempireos/src/components/courses/VideoPlayer.astro", void 0);
const $$VideoList = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$VideoList;
  const { videos, activeVideoId, onSelect } = Astro2.props;
  function formatDuration(seconds) {
    if (!seconds) return "";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return renderTemplate`${maybeRenderHead()}<div class="flex flex-col gap-2"> ${videos.map((video, index) => {
    const isActive = video.id === activeVideoId;
    const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`;
    return renderTemplate`<button type="button"${addAttribute(video.youtube_id, "data-video-id")}${addAttribute(video.title, "data-video-title")}${addAttribute(JSON.stringify(video), "data-video-obj")}${addAttribute([
      "video-item group w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200",
      isActive ? "bg-primary/10 border border-primary/30" : "bg-surface-container hover:bg-surface-container-high border border-transparent hover:border-outline-variant/30"
    ], "class:list")}${addAttribute(onSelect ? `${onSelect}(this)` : void 0, "onclick")}> <!-- Index + Play --> <div class="relative shrink-0"> <img${addAttribute(thumbnailUrl, "src")}${addAttribute(video.title, "alt")} class="w-28 h-16 rounded-lg object-cover" loading="lazy"> <div class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40 group-hover:bg-black/60 transition-colors"> <span class="material-symbols-outlined text-white text-3xl">play_arrow</span> </div> ${video.duration_seconds && renderTemplate`<span class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1 rounded"> ${formatDuration(video.duration_seconds)} </span>`} </div> <!-- Info --> <div class="flex-1 min-w-0"> <p${addAttribute([
      "text-sm font-semibold line-clamp-2 transition-colors",
      isActive ? "text-primary" : "text-white group-hover:text-primary"
    ], "class:list")}> <span class="text-on-surface-variant/50 mr-1">${index + 1}.</span> ${video.title} </p> ${video.description && renderTemplate`<p class="text-xs text-on-surface-variant/60 mt-1 line-clamp-1 hidden sm:block"> ${video.description} </p>`} </div> </button>`;
  })} </div>`;
}, "C:/dentalempireos/src/components/courses/VideoList.astro", void 0);
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const db = env.DB;
  const courseId = Astro2.params.id;
  const [course, user] = await Promise.all([
    getCourse(db, courseId),
    Promise.resolve(Astro2.locals.user)
  ]);
  if (!course || !course.is_published) {
    return Astro2.redirect("/courses");
  }
  const isActivated = user?.is_active === 1;
  const isLoggedIn = !!user;
  const videos = await getCourseVideos(db, courseId, { publishedOnly: true });
  const firstVideo = videos[0];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${course.title} | Dental Empire OS` }, { "default": async ($$result2) => renderTemplate`  ${!isLoggedIn ? renderTemplate`${maybeRenderHead()}<div class="max-w-6xl mx-auto px-6 py-20 text-center"> <div class="glass-card rounded-2xl p-10 max-w-lg mx-auto"> <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">lock</span> <h2 class="text-2xl font-bold text-white mb-3">Đăng nhập để xem</h2> <a href="/login" class="inline-flex items-center gap-2 bg-primary-container text-white px-6 py-3 rounded-xl font-bold mt-4"> <span class="material-symbols-outlined text-[20px]">login</span>
Đăng nhập
</a> </div> </div>` : !isActivated ? renderTemplate`<div class="max-w-6xl mx-auto px-6 py-20 text-center"> <div class="glass-card rounded-2xl p-10 max-w-lg mx-auto"> <span class="material-symbols-outlined text-5xl text-tertiary mb-4 block">hourglass_empty</span> <h2 class="text-2xl font-bold text-white mb-3">Tài khoản chưa được kích hoạt</h2> <p class="text-on-surface-variant">Tài khoản của bạn đang chờ kích hoạt.</p> </div> </div>` : renderTemplate`<div class="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-8"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-on-surface-variant mb-6"> <a href="/courses" class="hover:text-primary transition-colors flex items-center gap-1"> <span class="material-symbols-outlined text-[16px]">home</span>
Khóa học
</a> <span class="material-symbols-outlined text-[16px]">chevron_right</span> <span class="text-white">${course.title}</span> </nav> <!-- Page header --> <div class="mb-8"> <h1 class="text-3xl font-bold text-white mb-2">${course.title}</h1> ${course.description && renderTemplate`<p class="text-on-surface-variant">${course.description}</p>`} <div class="flex items-center gap-3 mt-3"> <span class="inline-flex items-center gap-1.5 text-sm text-on-surface-variant"> <span class="material-symbols-outlined text-[16px]">play_circle</span> ${videos.length} video${videos.length !== 1 ? "s" : ""} </span> </div> </div> <!-- Main content: 2 columns --> <div class="flex flex-col lg:flex-row gap-6"> <!-- Video Player --> <div class="flex-1 min-w-0"> <div id="player-container"> ${firstVideo ? renderTemplate`${renderComponent($$result2, "VideoPlayer", $$VideoPlayer, { "youtubeId": firstVideo.youtube_id, "title": firstVideo.title })}` : renderTemplate`<div class="aspect-video bg-surface-container rounded-xl flex items-center justify-center"> <div class="text-center"> <span class="material-symbols-outlined text-6xl text-on-surface-variant/30">video_library</span> <p class="text-on-surface-variant mt-3">Khóa học chưa có video nào</p> </div> </div>`} </div> <!-- Current video title --> <div id="current-info" class="mt-4 p-4 bg-surface-container rounded-xl"> <h2 id="current-title" class="text-lg font-bold text-white"> ${firstVideo?.title ?? "Chọn một video để xem"} </h2> ${firstVideo?.description && renderTemplate`<p id="current-desc" class="text-sm text-on-surface-variant mt-2">${firstVideo.description}</p>`} </div> </div> <!-- Video List Sidebar --> <div class="lg:w-96 shrink-0"> <div class="bg-surface-container rounded-xl p-4 max-h-[70vh] overflow-y-auto scrollbar-hide"> <div class="flex items-center justify-between mb-4"> <h3 class="font-bold text-white text-sm uppercase tracking-wider">Danh sách bài</h3> <span class="text-xs text-on-surface-variant">${videos.length} video</span> </div> ${renderComponent($$result2, "VideoList", $$VideoList, { "videos": videos, "activeVideoId": firstVideo?.id, "onSelect": "selectVideo" })} </div> </div> </div> </div>`}` })} ${renderScript($$result, "C:/dentalempireos/src/pages/courses/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/courses/[id].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/courses/[id].astro";
const $$url = "/courses/[id]";
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
