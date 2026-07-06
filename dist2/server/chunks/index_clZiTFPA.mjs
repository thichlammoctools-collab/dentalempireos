globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_B1DfdmGZ.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_saReXTnS.mjs";
import { env } from "cloudflare:workers";
import { l as listCourses } from "./course-db_J4CV3PXm.mjs";
const $$CourseCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$CourseCard;
  const { id, title, description, thumbnailUrl, videoCount, href } = Astro2.props;
  const fallbackGradient = [
    "from-[#2b98dd]/30 to-[#0088cc]/20",
    "from-[#92ccff]/20 to-[#2b98dd]/30",
    "from-[#ffb77a]/20 to-[#d37b1e]/20",
    "from-[#c6c6c6]/20 to-[#484949]/20"
  ][parseInt(id, 36) % 4];
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="group block bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/15 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"> <!-- Thumbnail --> <div class="relative aspect-video overflow-hidden"> ${thumbnailUrl ? renderTemplate`<img${addAttribute(thumbnailUrl, "src")}${addAttribute(title, "alt")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">` : renderTemplate`<div${addAttribute(`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`, "class")}> <span class="material-symbols-outlined text-5xl text-primary/40">play_circle</span> </div>`} <!-- Play overlay on hover --> <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"> <span class="material-symbols-outlined text-6xl text-white">play_circle</span> </div> <!-- Video count badge --> <div class="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5"> <span class="material-symbols-outlined text-[16px] text-white">play_arrow</span> <span class="text-xs font-bold text-white">${videoCount} video${videoCount !== 1 ? "s" : ""}</span> </div> </div> <!-- Content --> <div class="p-5"> <h3 class="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-2 mb-2"> ${title} </h3> ${description && renderTemplate`<p class="text-sm text-on-surface-variant line-clamp-2 leading-relaxed"> ${description} </p>`} <div class="mt-4 flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all"> <span>Xem khóa học</span> <span class="material-symbols-outlined text-[18px]">arrow_forward</span> </div> </div> </a>`;
}, "C:/dentalempireos/src/components/courses/CourseCard.astro", void 0);
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const db = env.DB;
  const courses = await listCourses(db, { publishedOnly: true });
  const user = Astro2.locals.user;
  const isActivated = user?.is_active === 1;
  const isLoggedIn = !!user;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Khóa Học Video | Dental Empire OS" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative py-20 overflow-hidden"> <div class="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div> <div class="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div> <div class="relative max-w-6xl mx-auto px-6 text-center"> <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"> <span class="material-symbols-outlined text-[16px]">play_circle</span>
Video Courses
</div> <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
Khóa Học Video
</h1> <p class="text-lg text-on-surface-variant max-w-2xl mx-auto">
Hệ thống bài giảng video chuyên sâu từ YouTube, được sắp xếp theo lộ trình khoa học
        giúp bạn tiếp cận kiến thức một cách bài bản.
</p> </div> </section>  ${!isLoggedIn ? renderTemplate`<section class="max-w-6xl mx-auto px-6 pb-20"> <div class="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto"> <div class="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-6"> <span class="material-symbols-outlined text-4xl text-on-surface-variant">lock</span> </div> <h2 class="text-2xl font-bold text-white mb-3">Đăng nhập để xem khóa học</h2> <p class="text-on-surface-variant mb-6">
Nội dung khóa học chỉ dành cho thành viên đã đăng ký. Vui lòng đăng nhập để tiếp tục.
</p> <a href="/login" class="inline-flex items-center gap-2 bg-primary-container text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"> <span class="material-symbols-outlined text-[20px]">login</span>
Đăng nhập
</a> </div> </section>` : !isActivated ? renderTemplate`<section class="max-w-6xl mx-auto px-6 pb-20"> <div class="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto"> <div class="w-20 h-20 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-6"> <span class="material-symbols-outlined text-4xl text-tertiary">hourglass_empty</span> </div> <h2 class="text-2xl font-bold text-white mb-3">Tài khoản chưa được kích hoạt</h2> <p class="text-on-surface-variant mb-6">
Tài khoản của bạn đang chờ được quản trị viên kích hoạt.
          Vui lòng liên hệ hỗ trợ nếu bạn cần kích hoạt ngay.
</p> <p class="text-sm text-on-surface-variant/60">
Đã đăng nhập với: <strong class="text-white">${user.email}</strong> </p> </div> </section>` : renderTemplate`<!-- Course Grid -->
    <section class="max-w-6xl mx-auto px-6 pb-20"> ${courses.length === 0 ? renderTemplate`<div class="text-center py-20"> <div class="w-24 h-24 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-6"> <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">school</span> </div> <h2 class="text-2xl font-bold text-white mb-3">Chưa có khóa học nào</h2> <p class="text-on-surface-variant">Các khóa học sẽ sớm được cập nhật.</p> </div>` : renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> ${courses.map((course) => renderTemplate`${renderComponent($$result2, "CourseCard", $$CourseCard, { "id": course.id, "title": course.title, "description": course.description, "thumbnailUrl": course.thumbnail_url, "videoCount": course.video_count, "href": `/courses/${course.id}` })}`)} </div>`} </section>`}` })}`;
}, "C:/dentalempireos/src/pages/courses/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/courses/index.astro";
const $$url = "/courses";
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
