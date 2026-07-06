globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate, u as unescapeHTML, e as renderSlot, f as renderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Header;
  const navLinks = [
    { href: "/book", label: "Đọc sách" },
    { href: "/videos", label: "Xem Video" },
    { href: "/resources", label: "Tài liệu" },
    { href: "/ai-tools", label: "Công cụ", badge: "AI" },
    { href: "/blog", label: "Blog" }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<header class="fixed top-0 w-full z-50 bg-surface-container-lowest/80 glass-nav border-b border-outline-variant h-20"> <div class="flex justify-between items-center w-full px-6 max-w-[1200px] mx-auto h-full"> <!-- Logo --> <a href="/" class="flex items-center hover:opacity-80 transition-opacity"> <img src="/images/logo-header.png" alt="Dental Empire" class="h-10 w-auto" width="140" height="46"> </a> <!-- Desktop Nav --> <nav class="hidden md:flex items-center gap-8" aria-label="Điều hướng chính"> ${navLinks.map((link) => {
    const isActive = link.href === "/" ? currentPath === "/" : currentPath.startsWith(link.href);
    return renderTemplate`<a${addAttribute(link.href, "href")}${addAttribute(isActive ? "page" : void 0, "aria-current")}${addAttribute([
      "label-md font-semibold transition-colors flex items-center gap-1.5",
      isActive ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
    ], "class:list")}> ${link.label} ${link.badge && renderTemplate`<span class="px-1.5 py-0.5 bg-amber-500 text-[9px] font-bold text-black rounded-full leading-none"> ${link.badge} </span>`} </a>`;
  })} </nav> <!-- Mobile: search input (top-right) — hidden on /resources which has its own search --> ${!currentPath.startsWith("/resources") && renderTemplate`<a href="/search" class="md:hidden flex-1 max-w-[240px] ml-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant text-sm"> <span class="material-symbols-outlined text-xl">search</span> <span class="truncate">Tìm kiếm...</span> </a>`} <!-- Mobile: resources icon --> <a href="/resources" class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" aria-label="Tài liệu"> <span class="material-symbols-outlined text-xl">description</span> </a> <!-- Mobile: blog icon --> <a href="/blog" class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" aria-label="Blog"> <span class="material-symbols-outlined text-xl">newsmode</span> </a> <!-- Mobile: courses icon --> <a href="/courses" class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" aria-label="Khóa học"> <span class="material-symbols-outlined text-xl">play_circle</span> </a> <!-- Mobile: profile icon (top-right, only when logged in) --> <a id="mobile-profile-link" href="/account/profile" class="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all hidden"> <span class="material-symbols-outlined text-xl">account_circle</span> </a> <!-- Right side (desktop only) --> <div class="hidden md:flex items-center gap-4"> <!-- Auth: logged-out state --> <div id="auth-logged-out" class="hidden items-center gap-2"> <a href="/login" class="px-4 py-2 label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">
Đăng nhập
</a> <a href="/register" class="px-5 py-2.5 btn-primary-metallic font-bold rounded-lg label-md">
Đăng ký
</a> </div> <!-- Auth: logged-in state --> <div id="auth-logged-in" class="hidden items-center gap-3"> <a id="auth-profile-link" href="/account/profile" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-primary rounded-lg hover:bg-surface-container transition-all"> <span class="material-symbols-outlined text-base">account_circle</span> <span id="auth-user-email" class="max-w-[180px] truncate"></span> </a> <button id="auth-logout" class="flex items-center gap-2 px-4 py-2 label-md font-semibold btn-icon text-on-surface-variant hover:text-primary"> <span class="material-symbols-outlined text-[20px]">logout</span>
Đăng xuất
</button> </div> </div> </div> </header> ${renderScript($$result, "C:/dentalempireos/src/components/layout/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/layout/Header.astro", void 0);
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const social = {
    facebook: "https://facebook.com/dentalempireos",
    youtube: "https://youtube.com/@dentalempireos",
    email: "mailto:contact@dentalempireos.com"
  };
  return renderTemplate`${maybeRenderHead()}<footer class="hidden md:block w-full py-20 bg-surface-container-lowest text-on-surface border-t border-outline-variant"> <div class="grid grid-cols-1 md:grid-cols-4 gap-6 w-full px-6 max-w-[1200px] mx-auto"> <!-- Brand --> <div class="space-y-6"> <div class="flex items-center gap-2.5"> <img src="/icons/icon-192.png" alt="Dental Empire" class="w-9 h-9 rounded-lg" width="36" height="36"> <span class="text-headline-md font-bold text-white">Dental Empire</span> </div> <p class="text-on-surface-variant">
Nền tảng chia sẻ tri thức quản trị nha khoa hàng đầu Việt Nam. Giúp bác sĩ làm chủ vận hành — Nâng tầm dịch vụ.
</p> <div class="flex gap-4"> <a${addAttribute(social.facebook, "href")} target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white/5 border border-outline-variant flex items-center justify-center btn-icon hover:bg-primary hover:text-white transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path> </svg> </a> <a${addAttribute(social.youtube, "href")} target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="w-10 h-10 rounded-full bg-white/5 border border-outline-variant flex items-center justify-center btn-icon hover:bg-primary hover:text-white transition-colors"> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path> </svg> </a> <a${addAttribute(social.email, "href")} aria-label="Email" class="w-10 h-10 rounded-full bg-white/5 border border-outline-variant flex items-center justify-center btn-icon hover:bg-primary hover:text-white transition-colors"> <span class="material-symbols-outlined">mail</span> </a> <a href="/rss.xml" target="_blank" rel="noopener noreferrer" aria-label="RSS Feed" class="w-10 h-10 rounded-full bg-white/5 border border-outline-variant flex items-center justify-center btn-icon hover:bg-primary hover:text-white transition-colors"> <span class="material-symbols-outlined">rss_feed</span> </a> </div> </div> <!-- Nội Dung --> <div> <h4 class="font-bold text-lg mb-6 text-primary">Nội Dung</h4> <ul class="space-y-4"> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/book">Thư viện E-book</a></li> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/courses">Khóa học Academy</a></li> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/blog">Blog Quản Trị</a></li> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/resources">Tài liệu miễn phí</a></li> <li> <a class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5" href="/ai-tools">
Công cụ AI
<span class="px-1.5 py-0.5 bg-amber-500 text-[9px] font-bold text-black rounded-full leading-none">AI</span> </a> </li> </ul> </div> <!-- Về Chúng Tôi --> <div> <h4 class="font-bold text-lg mb-6 text-primary">Về Chúng Tôi</h4> <ul class="space-y-4"> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/about">Dr. Vinh &amp; Đội ngũ</a></li> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/about">Câu chuyện thương hiệu</a></li> <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="/reviews">Cảm nhận độc giả</a></li> </ul> </div> <!-- Newsletter --> <div> <h4 class="font-bold text-lg mb-6 text-primary">Newsletter</h4> <p class="mb-4 text-on-surface-variant">Nhận kiến thức quản trị mới nhất hàng tuần.</p> <form action="/api/newsletter" method="post" class="flex flex-col gap-2"> <input type="email" name="email" required placeholder="Email của bác sĩ..." class="px-4 py-3 bg-white/5 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-white/20 text-white"> <button type="submit" class="w-full py-3 btn-primary-metallic font-bold rounded-xl active:scale-95 transition-all">
Đăng Ký
</button> </form> </div> </div> <!-- Bottom bar --> <div class="w-full px-6 max-w-[1200px] mx-auto mt-20 pt-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant"> <div>&copy; ${currentYear} Dental Empire Knowledge Hub. All rights reserved.</div> <div class="flex gap-8"> <a href="/about" class="hover:text-primary transition-colors">Về chúng tôi</a> <a href="/book" class="hover:text-primary transition-colors">Nội dung</a> </div> </div> </footer>`;
}, "C:/dentalempireos/src/components/layout/Footer.astro", void 0);
const $$MobileBottomNav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MobileBottomNav;
  const { currentPath, groupedChapters = [], currentSlug = "" } = Astro2.props;
  const getNavState = () => {
    if (currentPath === "/") return "home";
    if (currentPath.startsWith("/book") && !currentPath.includes("/book/")) return "library";
    if (currentPath.startsWith("/blog")) return "blog";
    if (currentPath.startsWith("/resources")) return "resources";
    if (currentPath.startsWith("/ai-tools")) return "aitools";
    return "";
  };
  const activeNav = getNavState();
  return renderTemplate`<!-- ========== MENU DRAWER ========== -->${maybeRenderHead()}<div id="menu-overlay" class="fixed inset-0 z-[104] bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden" data-astro-cid-wsizw3ik></div> <div id="menu-drawer" class="fixed top-0 right-0 z-[105] w-[85vw] max-w-xs h-full bg-surface-container-lowest transform translate-x-full transition-transform duration-300 ease-out flex flex-col shadow-2xl lg:hidden" data-astro-cid-wsizw3ik> <!-- Header --> <div class="flex items-center justify-between px-5 py-4 border-b" style="border-color: var(--color-outline-variant);" data-astro-cid-wsizw3ik> <div class="flex items-center gap-2" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-primary" data-astro-cid-wsizw3ik>menu</span> <span class="text-sm font-medium text-on-surface" data-astro-cid-wsizw3ik>Menu</span> </div> <button id="menu-close" class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container-high transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-on-surface-variant" data-astro-cid-wsizw3ik>close</span> </button> </div> <!-- Content --> <div class="flex-1 overflow-y-auto" data-astro-cid-wsizw3ik> <!-- Auth: Logged Out --> <div id="menu-auth-logged-out" class="px-4 pt-4 pb-2 space-y-2" data-astro-cid-wsizw3ik> <a href="/signin" class="flex items-center gap-3 p-3 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm" data-astro-cid-wsizw3ik>login</span> <span data-astro-cid-wsizw3ik>Đăng nhập</span> </a> <a href="/signup" class="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>person_add</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Đăng ký</span> </a> </div> <!-- Auth: Logged In --> <div id="menu-auth-logged-in" class="hidden px-4 pt-4 pb-2" data-astro-cid-wsizw3ik> <div class="flex items-center gap-3 p-3 rounded-xl bg-surface-container mb-2" data-astro-cid-wsizw3ik> <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-primary" data-astro-cid-wsizw3ik>person</span> </div> <div class="flex-1 min-w-0" data-astro-cid-wsizw3ik> <p id="menu-user-name" class="text-sm font-medium text-on-surface truncate" data-astro-cid-wsizw3ik>Người dùng</p> <p id="menu-user-email" class="text-xs text-on-surface-variant truncate" data-astro-cid-wsizw3ik></p> </div> </div> <a href="/account/profile" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>manage_accounts</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Hồ sơ cá nhân</span> </a> <button id="menu-logout" class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-left" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>logout</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Đăng xuất</span> </button> </div> <div class="mx-4 my-2 border-t" style="border-color: var(--color-outline-variant);" data-astro-cid-wsizw3ik></div> <!-- Navigation --> <nav class="px-4 py-2 space-y-1" data-astro-cid-wsizw3ik> <a href="/#courses" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>school</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Khóa học</span> </a> <a href="/#resources" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>folder_special</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Tài nguyên</span> </a> <a href="/ai-tools" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>psychology</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Công cụ AI</span> <span class="ml-auto px-1.5 py-px bg-amber-500 text-[9px] font-bold text-black rounded-full leading-none" data-astro-cid-wsizw3ik>AI</span> </a> <a href="/#reviews" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>rate_review</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Đánh giá</span> </a> <a href="/#about" class="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>info</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Giới thiệu</span> </a> </nav> <div class="mx-4 my-2 border-t" style="border-color: var(--color-outline-variant);" data-astro-cid-wsizw3ik></div> <!-- Bookmarks --> <div id="menu-bookmarks" class="hidden px-4 py-2" data-astro-cid-wsizw3ik> <p class="text-xs font-medium text-on-surface-variant uppercase tracking-wider px-3 mb-2" data-astro-cid-wsizw3ik>Đã lưu gần đây</p> <div id="menu-bookmarks-list" class="space-y-1" data-astro-cid-wsizw3ik></div> </div> <!-- Theme Toggle --> <div class="px-4 py-3" data-astro-cid-wsizw3ik> <button id="menu-theme-toggle" class="flex items-center justify-between w-full p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors" data-astro-cid-wsizw3ik> <div class="flex items-center gap-3" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-wsizw3ik>dark_mode</span> <span class="text-sm text-on-surface" data-astro-cid-wsizw3ik>Chế độ tối</span> </div> <div class="relative w-10 h-6 bg-surface-container-high rounded-full p-0.5" data-astro-cid-wsizw3ik> <div id="menu-theme-knob" class="w-5 h-5 bg-on-surface-variant rounded-full transition-transform duration-200" data-astro-cid-wsizw3ik></div> </div> </button> </div> </div> </div> <!-- ========== BOTTOM NAV ========== --> <nav id="mobile-bottom-nav" class="fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-xl border-t lg:hidden" style="background: var(--reader-chrome-bg, var(--color-surface-container-lowest)); border-color: var(--reader-border, var(--color-outline-variant)); padding-bottom: env(safe-area-inset-bottom, 0px);" data-astro-cid-wsizw3ik> <div class="flex items-center justify-around h-16" data-astro-cid-wsizw3ik> <!-- Trang chủ --> <a href="/"${addAttribute([
    "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200",
    activeNav === "home" ? "text-primary" : "text-on-surface-variant"
  ], "class:list")} data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-2xl" data-astro-cid-wsizw3ik>home</span> <span class="text-[10px] font-medium" data-astro-cid-wsizw3ik>Trang chủ</span> </a> <!-- Blog --> <a href="/blog"${addAttribute([
    "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200",
    activeNav === "blog" ? "text-primary" : "text-on-surface-variant"
  ], "class:list")} data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-2xl" data-astro-cid-wsizw3ik>article</span> <span class="text-[10px] font-medium" data-astro-cid-wsizw3ik>Blog</span> </a> <!-- Đọc sách --> <a href="/book"${addAttribute([
    "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200",
    activeNav === "library" ? "text-primary" : "text-on-surface-variant"
  ], "class:list")} data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-2xl" data-astro-cid-wsizw3ik>menu_book</span> <span class="text-[10px] font-medium" data-astro-cid-wsizw3ik>Đọc sách</span> </a> <!-- Tài nguyên --> <a href="/resources"${addAttribute([
    "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200",
    activeNav === "resources" ? "text-primary" : "text-on-surface-variant"
  ], "class:list")} data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-2xl" data-astro-cid-wsizw3ik>folder_special</span> <span class="text-[10px] font-medium" data-astro-cid-wsizw3ik>Tài nguyên</span> </a> <!-- Công cụ --> <a href="/ai-tools"${addAttribute([
    "relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all duration-200",
    activeNav === "aitools" ? "text-primary" : "text-on-surface-variant"
  ], "class:list")} data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-2xl" data-astro-cid-wsizw3ik>psychology</span> <span class="text-[10px] font-medium" data-astro-cid-wsizw3ik>Công cụ</span> <span class="absolute top-1 right-1/2 translate-x-[14px] top-[6px] px-1 py-px bg-amber-500 text-[7px] font-bold text-black rounded-full leading-none" data-astro-cid-wsizw3ik>AI</span> </a> </div> </nav> <!-- ========== CHAPTER DRAWER ========== --> <div id="mobile-chapter-drawer" class="fixed inset-x-0 bottom-0 z-[95] rounded-t-3xl shadow-2xl transform translate-y-full transition-transform duration-300 ease-out lg:hidden flex flex-col" style="background: var(--reader-chrome-bg, var(--color-surface-container-lowest)); max-height: 70vh;" data-astro-cid-wsizw3ik> <div id="chapter-drawer-handle" class="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" data-astro-cid-wsizw3ik> <div class="w-12 h-1.5 rounded-full bg-outline-variant" data-astro-cid-wsizw3ik></div> </div> <div class="px-5 pb-3 border-b" style="border-color: var(--reader-border, var(--color-outline-variant));" data-astro-cid-wsizw3ik> <h3 class="text-lg font-bold r-text" data-astro-cid-wsizw3ik>Thư viện sách</h3> <p class="text-xs r-text-muted mt-1" data-astro-cid-wsizw3ik>Chọn chương để đọc</p> </div> <div class="flex-1 overflow-y-auto px-4 py-3 space-y-2" id="chapter-drawer-content" data-astro-cid-wsizw3ik> ${groupedChapters.map((group) => renderTemplate`<div class="tier-group"${addAttribute(group.tier, "data-tier")} data-astro-cid-wsizw3ik> <button class="tier-toggle w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-surface-container-high/50 hover:bg-surface-container-high transition-colors"${addAttribute(group.tier, "data-tier")} data-astro-cid-wsizw3ik> <div class="flex items-center gap-2" data-astro-cid-wsizw3ik> <span class="material-symbols-outlined text-primary text-lg" data-astro-cid-wsizw3ik>folder</span> <span class="text-sm font-semibold r-text" data-astro-cid-wsizw3ik>${group.label}</span> </div> <div class="flex items-center gap-2" data-astro-cid-wsizw3ik> <span class="text-xs r-text-muted r-surface px-2 py-0.5 rounded-full" data-astro-cid-wsizw3ik> ${group.chapters.length} chương
</span> <span class="material-symbols-outlined r-text-muted tier-chevron transition-transform" data-astro-cid-wsizw3ik>expand_more</span> </div> </button> <div class="tier-chapters hidden space-y-1 mt-1 pl-2" data-astro-cid-wsizw3ik> ${group.chapters.map((ch) => {
    const isActive = ch.id === currentSlug;
    return renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")}${addAttribute([
      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
      isActive ? "bg-primary/10 text-primary border-l-2 border-primary" : "r-text-muted r-hover-text r-hover"
    ], "class:list")} data-astro-cid-wsizw3ik> <span class="text-xs font-mono text-on-surface-variant/60 w-8" data-astro-cid-wsizw3ik>
Ch${String(ch.data.chapter).padStart(2, "0")} </span> <span class="flex-1 truncate" data-astro-cid-wsizw3ik>${ch.data.title}</span> ${isActive && renderTemplate`<span class="material-symbols-outlined text-primary text-lg" data-astro-cid-wsizw3ik>play_arrow</span>`} </a>`;
  })} </div> </div>`)} </div> </div> <!-- Chapter drawer overlay --> <div id="mobile-drawer-overlay" class="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 lg:hidden" data-astro-cid-wsizw3ik></div>  ${renderScript($$result, "C:/dentalempireos/src/components/mobile/MobileBottomNav.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/mobile/MobileBottomNav.astro", void 0);
const $$PwaInstallPrompt = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="pwa-install-prompt" class="fixed left-3 right-3 z-[101] lg:hidden hidden transition-all duration-300" style="bottom: calc(64px + env(safe-area-inset-bottom, 0px) + 10px);" role="alert" data-astro-cid-lryo33yu> <div class="rounded-2xl bg-surface-container-highest border shadow-2xl overflow-hidden transition-all duration-300" style="border-color: var(--color-outline-variant);" data-astro-cid-lryo33yu> <!-- ========== ANDROID (collapsed → expandable) ========== --> <div data-variant="android" class="hidden" data-astro-cid-lryo33yu> <!-- Collapsed state (default) --> <div id="android-collapsed" class="flex items-center gap-3 p-3" data-astro-cid-lryo33yu> <img src="/icons/icon-192.png" alt="" class="w-10 h-10 rounded-lg shrink-0" width="40" height="40" data-astro-cid-lryo33yu> <div class="flex-1 min-w-0" data-astro-cid-lryo33yu> <p class="text-sm font-bold text-on-surface leading-tight" data-astro-cid-lryo33yu>📖 Hướng dẫn cài Android</p> <p class="text-[11px] text-on-surface-variant leading-snug mt-0.5" data-astro-cid-lryo33yu>Đọc offline, mở nhanh từ màn hình chính</p> </div> <button id="pwa-expand-btn" type="button" class="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary/90 active:scale-95 transition-all" data-astro-cid-lryo33yu>
Xem ngay →
</button> <button id="pwa-install-close-android" type="button" aria-label="Đóng" class="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors" data-astro-cid-lryo33yu> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-lryo33yu>close</span> </button> </div> <!-- Expanded state --> <div id="android-expanded" class="hidden p-4 pt-3" data-astro-cid-lryo33yu> <div class="flex items-center justify-between mb-3" data-astro-cid-lryo33yu> <p class="text-sm font-bold text-on-surface" data-astro-cid-lryo33yu>📖 Hướng dẫn cài Android</p> <button id="pwa-collapse-btn" type="button" class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors" data-astro-cid-lryo33yu> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-lryo33yu>expand_less</span> </button> </div> <div class="space-y-2.5" data-astro-cid-lryo33yu> <!-- Step 1 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>1</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Mở trang này bằng <strong class="text-primary" data-astro-cid-lryo33yu>Chrome</strong></p> </div> <!-- Step 2 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>2</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Bấm <strong class="text-primary" data-astro-cid-lryo33yu>⋮</strong> (3 chấm trên cùng)</p> </div> <!-- Step 3 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>3</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Bấm <strong class="text-primary" data-astro-cid-lryo33yu>Cài ứng dụng</strong> hoặc <strong class="text-primary" data-astro-cid-lryo33yu>Thêm vào MH chính</strong></p> </div> <!-- Step 4 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>4</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Đổi tên → <strong class="text-primary" data-astro-cid-lryo33yu>Dental Empire</strong></p> </div> <!-- Step 5 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-green-500/10" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="material-symbols-outlined text-green-400 text-base" data-astro-cid-lryo33yu>check_circle</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu><strong class="text-green-400" data-astro-cid-lryo33yu>Bấm THÊM</strong> ✅ — Icon Dental Empire sẽ xuất hiện trên MH chính</p> </div> </div> <!-- Email capture --> <div class="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20" data-astro-cid-lryo33yu> <p class="text-xs text-on-surface mb-2" data-astro-cid-lryo33yu>📧 Để lại email, mình sẽ báo khi có ebook mới (miễn phí).</p> <div class="flex gap-2" data-astro-cid-lryo33yu> <input type="email" id="pwa-email-input" placeholder="email@gmail.com" class="flex-1 px-3 py-2 text-xs bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary" data-astro-cid-lryo33yu> <button id="pwa-email-submit" type="button" class="shrink-0 px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all" data-astro-cid-lryo33yu>
Gửi
</button> </div> <p id="pwa-email-msg" class="text-[10px] text-green-400 mt-1 hidden" data-astro-cid-lryo33yu></p> </div> </div> </div> <!-- ========== iOS (always expanded) ========== --> <div data-variant="ios" class="hidden" data-astro-cid-lryo33yu> <div class="p-4" data-astro-cid-lryo33yu> <div class="flex items-center justify-between mb-3" data-astro-cid-lryo33yu> <p class="text-sm font-bold text-on-surface" data-astro-cid-lryo33yu>📖 Hướng dẫn cài iOS</p> <button id="pwa-install-close-ios" type="button" aria-label="Đóng" class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors" data-astro-cid-lryo33yu> <span class="material-symbols-outlined text-sm text-on-surface-variant" data-astro-cid-lryo33yu>close</span> </button> </div> <div class="space-y-2.5" data-astro-cid-lryo33yu> <!-- Step 1 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>1</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Mở trang này trên <strong class="text-primary" data-astro-cid-lryo33yu>Safari</strong></p> </div> <!-- Step 2 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>2</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Bấm <strong class="text-primary" data-astro-cid-lryo33yu>↗️ Chia sẻ</strong> (icon mũi tên trên cùng)</p> </div> <!-- Step 3 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>3</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Cuộn xuống → chọn <strong class="text-primary" data-astro-cid-lryo33yu>"Thêm vào MH chính"</strong></p> </div> <!-- Step 4 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-surface-container" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="text-xs font-black text-primary" data-astro-cid-lryo33yu>4</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu>Đổi tên → <strong class="text-primary" data-astro-cid-lryo33yu>Dental Empire</strong></p> </div> <!-- Step 5 --> <div class="flex items-center gap-3 p-2.5 rounded-xl bg-green-500/10" data-astro-cid-lryo33yu> <div class="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0" data-astro-cid-lryo33yu> <span class="material-symbols-outlined text-green-400 text-base" data-astro-cid-lryo33yu>check_circle</span> </div> <p class="text-xs text-on-surface leading-snug" data-astro-cid-lryo33yu><strong class="text-green-400" data-astro-cid-lryo33yu>Bấm THÊM</strong> ✅ — Icon Dental Empire sẽ xuất hiện trên MH chính</p> </div> </div> <!-- Email capture --> <div class="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/20" data-astro-cid-lryo33yu> <p class="text-xs text-on-surface mb-2" data-astro-cid-lryo33yu>📧 Để lại email, mình sẽ báo khi có ebook mới (miễn phí).</p> <div class="flex gap-2" data-astro-cid-lryo33yu> <input type="email" id="pwa-email-input" placeholder="email@gmail.com" class="flex-1 px-3 py-2 text-xs bg-surface-container border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary" data-astro-cid-lryo33yu> <button id="pwa-email-submit" type="button" class="shrink-0 px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all" data-astro-cid-lryo33yu>
Gửi
</button> </div> <p id="pwa-email-msg" class="text-[10px] text-green-400 mt-1 hidden" data-astro-cid-lryo33yu></p> </div> </div> </div> </div> </div>  ${renderScript($$result, "C:/dentalempireos/src/components/mobile/PwaInstallPrompt.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/mobile/PwaInstallPrompt.astro", void 0);
var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$StructuredData = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StructuredData;
  const { type, data } = Astro2.props;
  const schema = {
    "@context": "https://schema.org",
    ...data
  };
  const typeMap = {
    website: "WebSite",
    organization: "Organization",
    person: "Person",
    article: "Article",
    blogposting: "BlogPosting",
    book: "Book",
    course: "Course",
    faq: "FAQPage",
    breadcrumb: "BreadcrumbList",
    review: "Review"
  };
  schema["@type"] = typeMap[type] ?? type;
  const cleanSchema = {};
  for (const [k, v] of Object.entries(schema)) {
    if (v !== void 0 && v !== null && v !== "") cleanSchema[k] = v;
  }
  const json = JSON.stringify(cleanSchema);
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/ld+json">', "<\/script>"])), unescapeHTML(json));
}, "C:/dentalempireos/src/components/seo/StructuredData.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "Nền tảng chia sẻ tri thức quản trị nha khoa hàng đầu Việt Nam. Giúp bác sĩ làm chủ vận hành — Nâng tầm dịch vụ.",
    ogImage = "/images/og-image.png",
    ogImageAlt,
    isReading = false,
    currentSlug = "",
    groupedChapters = [],
    noindex = false,
    ogType = "website",
    keywords = "quản trị nha khoa, dental clinic management, bác sĩ nha khoa, vận hành phòng khám, Dental Empire OS"
  } = Astro2.props;
  const siteOrigin = Astro2.site ? Astro2.site.origin : "https://dentalempireos.com";
  const canonicalURL = new URL(Astro2.url.pathname, siteOrigin).href;
  const ogImageURL = (() => {
    try {
      const parsed = new URL(ogImage, siteOrigin);
      const isSameZone = parsed.origin === siteOrigin;
      const isAlreadyTransformed = parsed.pathname.startsWith("/cdn-cgi/image/");
      const isSvgEndpoint = parsed.pathname.startsWith("/api/");
      if (isSameZone && !isAlreadyTransformed && !isSvgEndpoint) {
        return new URL(
          `/cdn-cgi/image/width=1200,height=630,fit=cover,quality=85${parsed.pathname}${parsed.search}`,
          siteOrigin
        );
      }
      return parsed;
    } catch {
      return new URL("/images/og-image.png", siteOrigin);
    }
  })();
  const finalOgImageAlt = ogImageAlt ?? title;
  const robotsContent = noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  const sameAs = [
    "https://facebook.com/dentalempireos",
    "https://youtube.com/@dentalempireos"
  ];
  return renderTemplate(_a || (_a = __template(['<html lang="vi" class="dark scroll-smooth" data-astro-cid-37fxchfa> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><!-- Disable Cloudflare Browser Insights to prevent HTML injection that breaks SSR --><meta name="cf-admin-accelerate" content="off"><!-- SEO Core --><title>', '</title><meta name="description"', '><meta name="keywords"', '><meta name="author" content="Bác sĩ Nguyễn Phước Vinh"><meta name="robots"', '><link rel="canonical"', '><!-- Search engine verification (placeholders — user fills in from GSC) --><meta name="google-site-verification" content=""><meta name="msvalidate.01" content=""><!-- Open Graph --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt"', '><meta property="og:locale" content="vi_VN"><meta property="og:site_name" content="Dental Empire OS"><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="twitter:image:alt"', `><meta name="twitter:site" content="@dentalempireos"><!-- Favicon & App Icons --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#0a0a14"><!-- Be Vietnam Pro font — self-hosted via @fontsource (see global.css) --><!-- Material Symbols — kept from Google Fonts CDN with display=swap to avoid FOIT --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap" rel="stylesheet"><!-- Prevent flash of wrong theme on page load --><script>
      (function() {
        var t = localStorage.getItem('theme');
        if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    <\/script><!-- Structured Data: WebSite + Organization + Person -->`, "", "", "", '</head> <body class="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container selection:text-white" data-astro-cid-37fxchfa> ', ' <main class="flex-1 pt-20 lg:pt-20 pb-20 lg:pb-0" data-astro-cid-37fxchfa> ', " </main> ", " <!-- Mobile Navigation --> ", " <!-- PWA Install Prompt --> ", ` <!-- Toast container --> <div id="toast-container" class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-atomic="true" data-astro-cid-37fxchfa></div> <!-- Ripple effect: spawns expanding circle at click point --> <script>
      document.addEventListener('click', function (e) {
        var el = e.target.closest('button, .btn-primary-metallic, .btn-ghost, .btn-solid, .btn-chip, .btn-fab, [role="button"]');
        if (!el || el.closest('.ripple-span')) return;
        el.style.position = el.style.position || 'relative';
        el.style.overflow = 'hidden';
        var rect = el.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height) * 2;
        var span = document.createElement('span');
        span.className = 'ripple-span';
        span.style.width = span.style.height = size + 'px';
        span.style.left = (e.clientX - rect.left - size / 2) + 'px';
        span.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(span);
        span.addEventListener('animationend', function () { span.remove(); });
      });
    <\/script> <!-- Toast notification system -->  <script>
      function showToast(message, type, duration) {
        type = type || 'info';
        duration = duration || 4000;
        var container = document.getElementById('toast-container');
        if (!container) return;
        var icons = {
          success: 'check_circle',
          error:   'error',
          info:    'info'
        };
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.setAttribute('role', 'alert');
        toast.innerHTML =
          '<span class="material-symbols-outlined text-base flex-shrink-0" style="color:var(--c,' +
          (type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa') +
          ')">' + icons[type] + '</span>' +
          '<span class="text-sm text-white flex-1 leading-snug">' + message + '</span>' +
          '<div class="toast-progress" style="animation-duration:' + duration + 'ms"></div>';
        container.appendChild(toast);
        toast.addEventListener('mouseenter', function() { toast.querySelector('.toast-progress').style.animationPlayState = 'paused'; });
        toast.addEventListener('mouseleave', function() { toast.querySelector('.toast-progress').style.animationPlayState = 'running'; });
        setTimeout(function() {
          toast.classList.add('toast-out');
          setTimeout(function() { toast.remove(); }, 300);
        }, duration);
      }
      window.showToast = showToast;
    <\/script> <!-- PWA: register service worker --> <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').then(function (reg) {
            console.log('SW registered:', reg.scope);
          }).catch(function (err) {
            console.warn('SW registration failed:', err);
          });
        });
      }
    <\/script> </body> </html>`])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), addAttribute(keywords, "content"), addAttribute(robotsContent, "content"), addAttribute(canonicalURL, "href"), addAttribute(ogType, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImageURL, "content"), addAttribute(finalOgImageAlt, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImageURL, "content"), addAttribute(finalOgImageAlt, "content"), renderComponent($$result, "StructuredData", $$StructuredData, { "type": "website", "data": {
    name: "Dental Empire OS",
    url: "https://dentalempireos.com",
    description: "Nền tảng chia sẻ tri thức quản trị nha khoa hàng đầu Việt Nam",
    inLanguage: "vi"
  }, "data-astro-cid-37fxchfa": true }), renderComponent($$result, "StructuredData", $$StructuredData, { "type": "organization", "data": {
    name: "Dental Empire OS",
    url: "https://dentalempireos.com",
    logo: "https://dentalempireos.com/icons/icon-512.png",
    description: "Nền tảng chia sẻ tri thức quản trị nha khoa hàng đầu Việt Nam. Giúp bác sĩ làm chủ vận hành — Nâng tầm dịch vụ.",
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Vietnamese", "English"],
      url: "https://dentalempireos.com/about"
    }
  }, "data-astro-cid-37fxchfa": true }), renderComponent($$result, "StructuredData", $$StructuredData, { "type": "person", "data": {
    name: "Bác sĩ Nguyễn Phước Vinh",
    jobTitle: "Founder & Author",
    url: "https://dentalempireos.com/about",
    worksFor: "Dental Empire OS",
    sameAs
  }, "data-astro-cid-37fxchfa": true }), renderHead(), renderComponent($$result, "Header", $$Header, { "data-astro-cid-37fxchfa": true }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-37fxchfa": true }), renderComponent($$result, "MobileBottomNav", $$MobileBottomNav, { "currentPath": Astro2.url.pathname, "currentSlug": currentSlug, "groupedChapters": groupedChapters, "data-astro-cid-37fxchfa": true }), renderComponent($$result, "PwaInstallPrompt", $$PwaInstallPrompt, { "data-astro-cid-37fxchfa": true }));
}, "C:/dentalempireos/src/layouts/BaseLayout.astro", void 0);
export {
  $$BaseLayout as $,
  $$StructuredData as a
};
