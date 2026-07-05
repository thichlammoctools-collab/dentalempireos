globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate, e as renderSlot, f as renderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_VoTlS2tl.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
const adminNav = [
  {
    key: "overview",
    label: "TỔNG QUAN",
    items: [
      { href: "/admin", label: "Bảng điều khiển", icon: "dashboard", match: "/admin" }
    ]
  },
  {
    key: "content",
    label: "NỘI DUNG & ĐÀO TẠO",
    items: [
      { href: "/admin/ebooks", label: "Sách điện tử", icon: "menu_book", match: "/admin/ebooks" },
      { href: "/admin/blog", label: "Bài viết", icon: "newsmode", match: "/admin/blog" },
      { href: "/admin/resources", label: "Tài liệu", icon: "folder_shared", match: "/admin/resources" },
      { href: "/admin/courses", label: "Khóa học", icon: "school", match: "/admin/courses" },
      { href: "/admin/homepage", label: "Trang chủ", icon: "home", match: "/admin/homepage" }
    ]
  },
  {
    key: "community",
    label: "CỘNG ĐỒNG",
    items: [
      { href: "/admin/questions", label: "Hỏi đáp", icon: "question_answer", match: "/admin/questions" },
      { href: "/admin/users", label: "Người dùng", icon: "people", match: "/admin/users" }
    ]
  },
  {
    key: "commerce",
    label: "THƯƠNG MẠI",
    items: [
      { href: "/admin/products", label: "Sản phẩm", icon: "inventory_2", match: "/admin/products" },
      { href: "/admin/orders", label: "Đơn hàng", icon: "receipt_long", match: "/admin/orders" },
      { href: "/admin/settings/payos", label: "Cổng thanh toán", icon: "payment", match: "/admin/settings/payos" },
      { href: "/admin/settings/support", label: "Ủng hộ tác giả", icon: "volunteer_activism", match: "/admin/settings/support" }
    ]
  },
  {
    key: "ai",
    label: "AI & CẤU HÌNH",
    items: [
      { href: "/admin/scanners", label: "Máy quét", icon: "fact_check", match: "/admin/scanners" },
      { href: "/admin/apps", label: "Ứng dụng AI", icon: "smart_toy", match: "/admin/apps" },
      { href: "/admin/ai-settings", label: "Cài đặt AI", icon: "tune", match: "/admin/ai-settings" }
    ]
  }
];
const $$Sidebar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Sidebar;
  const currentPath = Astro2.url.pathname.replace(/\/$/, "") || "/";
  function isActive(item) {
    if (!item.match) return false;
    if (item.match === "/admin") return currentPath === "/admin";
    return currentPath === item.match || currentPath.startsWith(item.match + "/");
  }
  return renderTemplate`${maybeRenderHead()}<aside class="h-screen w-64 fixed left-0 top-0 bg-surface border-r border-outline-variant/15 flex flex-col p-4 gap-6 z-50"> <!-- Brand --> <a href="/admin" class="flex items-center gap-2.5 mb-2 px-1 hover:opacity-80 transition-opacity"> <img src="/icons/icon-192.png" alt="Dental Empire" class="w-10 h-10 rounded-lg shrink-0" width="40" height="40"> <div class="flex flex-col gap-0.5 min-w-0"> <h1 class="text-lg font-bold text-primary tracking-tight leading-none">Dental Empire</h1> <span class="text-[10px] text-on-surface-variant/70 leading-none">Knowledge Hub Admin</span> </div> </a> <!-- Sections nav: scrollable list of grouped items --> <nav class="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-hide" aria-label="Menu quản trị"> ${adminNav.map((section) => renderTemplate`<div class="flex flex-col gap-1"> <h3 class="px-3 pb-1 text-[11px] font-bold tracking-wider text-on-surface-variant/60 uppercase"> ${section.label} </h3> ${section.items.map((item) => {
    const active = isActive(item);
    return renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(active ? "page" : void 0, "aria-current")}${addAttribute([
      "flex items-center gap-3 p-3 rounded-lg font-medium transition-colors active:scale-95 duration-150",
      active ? "text-primary font-bold border-r-2 border-primary bg-surface-container-high" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
    ], "class:list")}> <span class="material-symbols-outlined"${addAttribute(active ? "font-variation-settings: 'FILL' 1;" : void 0, "style")}> ${item.icon} </span> <span class="text-sm">${item.label}</span> </a>`;
  })} </div>`)} </nav> <!-- Footer area: quick-create CTA + logout --> <div class="mt-auto flex flex-col gap-2 pt-4 border-t border-outline-variant/15"> <a href="/admin/ebooks/new" class="bg-primary-container text-white py-3 px-4 rounded-lg font-bold cyan-glow hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-2"> <span class="material-symbols-outlined text-[20px]">add</span> <span class="text-sm">New Content</span> </a> <button id="admin-logout" type="button" class="flex items-center gap-3 p-3 rounded-lg font-medium text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors text-left"> <span class="material-symbols-outlined">logout</span> <span class="text-sm">Đăng xuất</span> </button> </div> </aside> ${renderScript($$result, "C:/dentalempireos/src/components/admin/Sidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/admin/Sidebar.astro", void 0);
const $$Topbar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Topbar;
  const { searchPlaceholder = "Search resources, users, content..." } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<header class="fixed top-0 right-0 w-[calc(100%-256px)] bg-surface-container/80 backdrop-blur-md border-b border-outline-variant/15 shadow-sm flex justify-between items-center h-16 px-6 z-40"> <!-- Search --> <div class="flex items-center gap-6"> <div class="relative flex items-center"> <span class="material-symbols-outlined absolute left-3 text-on-surface-variant pointer-events-none">search</span> <input type="text"${addAttribute(searchPlaceholder, "placeholder")} class="bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm rounded-full pl-10 pr-6 py-2 w-80 focus:ring-1 focus:ring-primary focus:border-primary outline-none"> </div> </div> <!-- Actions --> <div class="flex items-center gap-6"> <div class="flex items-center gap-3"> <a href="/" class="text-on-surface-variant hover:text-primary transition-opacity active:opacity-80 flex items-center gap-2"> <span class="material-symbols-outlined">visibility</span> <span class="text-sm font-semibold">Preview Site</span> </a> <!-- No publish button needed — D1 data is live immediately (SSR, no CDN cache) --> </div> <div class="h-6 w-px bg-outline-variant/30"></div> <div class="flex items-center gap-4"> <button type="button" class="text-on-surface-variant hover:text-primary relative" aria-label="Thông báo"> <span class="material-symbols-outlined">notifications</span> <span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span> </button> <button type="button" class="text-on-surface-variant hover:text-primary" aria-label="Tài khoản"> <span class="material-symbols-outlined">settings_power</span> </button> <div class="w-8 h-8 rounded-full border border-primary/30 bg-surface-container-high flex items-center justify-center text-primary" aria-label="Admin"> <span class="material-symbols-outlined text-[20px]">person</span> </div> </div> </div> </header>`;
}, "C:/dentalempireos/src/components/admin/Topbar.astro", void 0);
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminLayout;
  const {
    title,
    description = "Trang quản trị nội dung Dental Empire OS Knowledge Hub.",
    searchPlaceholder
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="vi" class="dark" data-astro-cid-2kanml4j> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="generator"', '><meta name="robots" content="noindex,nofollow"><title>', '</title><meta name="description"', `><!-- Favicon --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Be Vietnam Pro font --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"><!-- Material Symbols --><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"><script>
      document.documentElement.classList.add('dark');
    <\/script>`, '</head> <body class="bg-surface text-on-surface min-h-screen flex overflow-hidden" data-astro-cid-2kanml4j> ', ' <main class="flex-1 ml-64 h-screen min-h-0 overflow-y-auto scrollbar-hide flex flex-col" data-astro-cid-2kanml4j> ', ' <div class="mt-16 p-6 flex-1 flex flex-col gap-6" data-astro-cid-2kanml4j> ', ' </div> <!-- Toast container --> <div id="toast-container" class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" aria-live="polite" aria-atomic="true" data-astro-cid-2kanml4j></div> <footer class="mt-auto p-6 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-3 bg-surface" data-astro-cid-2kanml4j> <span class="text-sm text-on-surface-variant/50" data-astro-cid-2kanml4j>\n© ', ` Dental Empire Knowledge Hub — Admin Control Unit
</span> <div class="flex gap-6" data-astro-cid-2kanml4j> <a href="/" class="text-xs uppercase tracking-[0.1em] font-bold text-on-surface-variant hover:text-white transition-colors" data-astro-cid-2kanml4j>
Về site
</a> </div> </footer> </main> <!-- Toast notification system -->  <script>
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
          '<span class="material-symbols-outlined text-base flex-shrink-0" style="color:' +
          (type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa') +
          '">' + icons[type] + '</span>' +
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
    <\/script> </body> </html>`])), addAttribute(Astro2.generator, "content"), title, addAttribute(description, "content"), renderHead(), renderComponent($$result, "Sidebar", $$Sidebar, { "data-astro-cid-2kanml4j": true }), renderComponent($$result, "Topbar", $$Topbar, { "searchPlaceholder": searchPlaceholder, "data-astro-cid-2kanml4j": true }), renderSlot($$result, $$slots["default"]), (/* @__PURE__ */ new Date()).getFullYear());
}, "C:/dentalempireos/src/layouts/AdminLayout.astro", void 0);
export {
  $$AdminLayout as $
};
