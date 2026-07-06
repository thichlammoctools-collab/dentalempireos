globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, r as renderTemplate, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { r as renderScript } from "./global_CZrsF2AQ.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_BOB8F8DU.mjs";
import { env } from "cloudflare:workers";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { h as listQuestionsByUser } from "./question-db_BOj0TAm2.mjs";
import { l as listChapters } from "./book-db_DDcc_FYk.mjs";
const $$NotificationBell = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<!-- Notification bell -->${maybeRenderHead()}<div class="relative"> <button id="notif-bell-btn" class="relative flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all" title="Thông báo"> <span class="material-symbols-outlined text-xl">notifications</span> <span id="notif-badge" class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[9px] font-bold text-white bg-error rounded-full hidden">0</span> </button> <!-- Dropdown --> <div id="notif-dropdown" class="hidden absolute right-0 top-full mt-2 z-[70] w-[360px] max-h-[420px] glass-panel-dark rounded-xl shadow-2xl border border-outline-variant/20 overflow-hidden"> <div class="flex items-center justify-between px-4 py-3 border-b border-outline-variant/15"> <h4 class="text-sm font-bold text-white">Thông báo</h4> <button id="notif-mark-all" class="text-[11px] text-primary hover:underline font-bold">Đánh dấu tất cả đã đọc</button> </div> <div id="notif-list" class="overflow-y-auto max-h-[350px] divide-y divide-outline-variant/10"> <div class="p-6 text-center text-sm text-on-surface-variant/50"> <span class="material-symbols-outlined text-3xl block mb-2 opacity-50">notifications_none</span>
Chưa có thông báo
</div> </div> </div> </div> ${renderScript($$result, "C:/dentalempireos/src/components/layout/NotificationBell.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/components/layout/NotificationBell.astro", void 0);
const prerender = false;
const $$Profile = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Profile;
  const auth = createAuth(env);
  const result = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!result?.user) {
    return Astro2.redirect("/login?redirect=/account/profile");
  }
  const user = Astro2.locals.user;
  const questions = await listQuestionsByUser(env.DB, result.user.id);
  const chapters = await listChapters(env.DB);
  const chapterMap = new Map(chapters.map((c) => [c.id, { title: c.title, tier: c.tier, chapter_no: c.chapter_no }]));
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const { results: purchases } = await env.DB.prepare(
    `SELECT
       a."granted_at",
       a."expires_at",
       a."is_active"  as "access_active",
       p."id"         as "product_id",
       p."name"       as "product_name",
       p."type"       as "product_type",
       p."price"      as "product_price",
       p."reference_id",
       o."amount"     as "paid_amount",
       o."paid_at"
     FROM "access" a
     JOIN "product" p ON a."product_id" = p."id"
     JOIN "order"   o ON a."order_id"   = o."id"
     WHERE a."user_id" = ? AND a."is_active" = 1
       AND (a."expires_at" IS NULL OR a."expires_at" > ?)
     ORDER BY a."granted_at" DESC`
  ).bind(result.user.id, now).all();
  const productTypeMap = {
    course_unlock: { label: "Khóa học", icon: "school" },
    document_unlock: { label: "Tài liệu", icon: "description" },
    booking: { label: "Đặt lịch", icon: "event" },
    event_ticket: { label: "Vé sự kiện", icon: "confirmation_number" },
    survey_unlock: { label: "Khảo sát", icon: "analytics" }
  };
  function productLink(p) {
    if (p.product_type === "course_unlock" && p.reference_id) return `/courses/${p.reference_id}`;
    if (p.product_type === "document_unlock") return "/resources";
    return "#";
  }
  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function formatPrice(vnd) {
    return vnd.toLocaleString("vi-VN") + "đ";
  }
  function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} giờ trước`;
    const days = Math.floor(hrs / 24);
    return `${days} ngày trước`;
  }
  function statusInfo(status) {
    if (status === "open") return { label: "Chờ trả lời", icon: "pending", color: "text-error bg-error/10" };
    if (status === "answered") return { label: "Đã trả lời", icon: "check_circle", color: "text-primary bg-primary/10" };
    return { label: "Đã đóng", icon: "archive", color: "text-on-surface-variant bg-surface-container-high" };
  }
  const totalSpent = purchases.reduce((sum, p) => sum + (p.paid_amount || 0), 0);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Hồ Sơ Cá Nhân | Dental Empire OS", "description": "Quản lý thông tin hồ sơ cá nhân.", "noindex": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-surface pt-24 pb-16"> <div class="max-w-[1100px] mx-auto px-4 md:px-6"> <!-- Page Header --> <div class="flex items-center justify-between mb-6 md:mb-8"> <div> <h1 class="text-xl md:text-2xl font-bold text-white">Hồ sơ cá nhân</h1> <p class="text-xs md:text-sm text-on-surface-variant mt-1 hidden sm:block">Quản lý thông tin, sản phẩm đã mua và câu hỏi của bạn.</p> </div> ${renderComponent($$result2, "NotificationBell", $$NotificationBell, {})} </div> <div class="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 md:gap-6"> <!-- LEFT COLUMN: Profile Card (sticky on desktop) --> <div class="flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-24 lg:self-start"> <!-- Identity Card --> <div class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <!-- Avatar --> <div class="flex flex-col items-center gap-3"> <div class="relative group"> ${user?.image ? renderTemplate`<img id="avatar-preview"${addAttribute(user.image, "src")} alt="Avatar" class="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-outline-variant/30">` : renderTemplate`<div id="avatar-preview" class="w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/10 flex items-center justify-center border-2 border-outline-variant/30"> <span class="material-symbols-outlined text-5xl text-primary/40">person</span> </div>`} <button id="avatar-trigger" type="button" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Thay đổi ảnh"> <span class="material-symbols-outlined text-white text-2xl">photo_camera</span> </button> </div> <input id="avatar-input" type="file" accept="image/jpeg,image/png,image/webp" class="hidden"> <div class="text-center"> <p id="display-name" class="text-base md:text-lg font-bold text-white truncate max-w-[260px]">${user?.name}</p> <p class="text-xs text-on-surface-variant mt-0.5 truncate max-w-[260px]">${user?.email}</p> </div> <p id="avatar-error" class="hidden text-xs text-rose-400 text-center"></p> <p class="text-[10px] text-on-surface-variant/60 text-center">JPEG/PNG/WebP · tối đa 5MB</p> </div> <!-- Divider --> <div class="h-px bg-outline-variant/15 my-5"></div> <!-- Stats --> <div class="grid grid-cols-2 gap-3"> <div class="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5"> <span class="material-symbols-outlined text-primary text-lg">shopping_bag</span> <p class="text-base font-bold text-white mt-1">${purchases.length}</p> <p class="text-[10px] text-on-surface-variant">Sản phẩm</p> </div> <div class="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5"> <span class="material-symbols-outlined text-primary text-lg">forum</span> <p class="text-base font-bold text-white mt-1">${questions.length}</p> <p class="text-[10px] text-on-surface-variant">Câu hỏi</p> </div> </div> </div> <!-- Edit Profile Card --> <div class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <h2 class="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">Thông tin</h2> <!-- Name --> <div class="mb-4"> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5" for="name-input">Tên hiển thị</label> <input id="name-input" type="text"${addAttribute(user?.name ?? "", "value")} maxlength="100" class="w-full px-3 py-2.5 bg-white/5 border border-outline-variant rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:outline-none text-sm"> <p id="name-error" class="hidden text-xs text-rose-400 mt-1.5"></p> </div> <!-- Email (read-only) --> <div class="mb-4"> <label class="block text-xs font-semibold text-on-surface-variant mb-1.5">Email</label> <div class="flex items-center gap-2 px-3 py-2.5 bg-white/5 border border-outline-variant/30 rounded-lg text-on-surface-variant text-sm"> <span class="material-symbols-outlined text-base">lock</span> <span class="truncate flex-1">${user?.email}</span> </div> <p class="text-[10px] text-on-surface-variant/60 mt-1">Không thể thay đổi</p> </div> <button id="name-save-btn" type="button" disabled class="w-full px-4 py-2.5 btn-primary-metallic font-bold rounded-lg text-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
Lưu thay đổi
</button> </div> <!-- Quick links --> <div class="rounded-2xl border border-outline-variant/20 overflow-hidden"> <div class="bg-white/[0.03] px-5 py-3 border-b border-outline-variant/10"> <h2 class="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Quản lý</h2> </div> <div class="flex flex-col"> <a href="/account/clinic" class="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.05] transition-colors group"> <span class="material-symbols-outlined text-primary text-lg">local_hospital</span> <div class="flex-1"> <p class="text-sm font-semibold text-white group-hover:text-primary transition-colors">Hồ sơ phòng khám</p> <p class="text-[10px] text-on-surface-variant">Tên, địa chỉ, logo</p> </div> <span class="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors text-lg">chevron_right</span> </a> <div class="h-px bg-outline-variant/10"></div> <a href="/account/scanner-history" class="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.05] transition-colors group"> <span class="material-symbols-outlined text-primary text-lg">history</span> <div class="flex-1"> <p class="text-sm font-semibold text-white group-hover:text-primary transition-colors">Lịch sử Scanner</p> <p class="text-[10px] text-on-surface-variant">Kết quả đã làm</p> </div> <span class="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors text-lg">chevron_right</span> </a> </div> </div> </div> <!-- RIGHT COLUMN: Products + Questions --> <div class="flex flex-col gap-4 md:gap-6"> <!-- Purchased Products --> <section class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <div class="flex items-center justify-between mb-4"> <div> <h2 class="text-sm md:text-base font-bold text-white">Sản phẩm đã mua</h2> ${purchases.length > 0 && renderTemplate`<p class="text-[11px] text-on-surface-variant mt-0.5">Tổng chi: ${formatPrice(totalSpent)}</p>`} </div> <span class="px-2 py-0.5 text-[11px] font-bold bg-primary/10 text-primary rounded-full">${purchases.length}</span> </div> ${purchases.length === 0 ? renderTemplate`<div class="text-center py-8"> <span class="material-symbols-outlined text-5xl text-on-surface-variant/20 block mb-3">shopping_bag</span> <p class="text-sm text-on-surface-variant mb-1">Chưa có sản phẩm nào</p> <p class="text-xs text-on-surface-variant/70 mb-4">Khám phá các khóa học và tài liệu của chúng tôi.</p> <a href="/#courses" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all"> <span class="material-symbols-outlined text-sm">school</span>
Khám phá ngay
</a> </div>` : renderTemplate`<div class="grid grid-cols-1 sm:grid-cols-2 gap-2"> ${purchases.map((p) => {
    const typeInfo = productTypeMap[p.product_type] || { label: p.product_type, icon: "inventory_2" };
    const link = productLink(p);
    const expiry = p.expires_at ? formatDate(p.expires_at) : null;
    return renderTemplate`<a${addAttribute(link, "href")} class="relative flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group border border-transparent hover:border-primary/20"> <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"> <span class="material-symbols-outlined text-base text-primary">${typeInfo.icon}</span> </div> <div class="flex-1 min-w-0"> <h3 class="text-sm font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">${p.product_name}</h3> <div class="flex items-center gap-1.5 mt-1.5 text-[10px] text-on-surface-variant"> <span class="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant/80">${typeInfo.label}</span> <span class="font-bold text-on-surface">${formatPrice(p.paid_amount)}</span> </div> <div class="flex items-center gap-1 mt-1.5 text-[10px]"> <span class="material-symbols-outlined text-[11px] text-primary">verified</span> <span class="text-primary font-bold">Đã mua</span> ${expiry ? renderTemplate`<span class="text-on-surface-variant/60">· HSD ${expiry}</span>` : renderTemplate`<span class="text-primary/70">· Vĩnh viễn</span>`} </div> </div> </a>`;
  })} </div>`} </section> <!-- Reading Progress --> <section class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20" id="reading-stats-section"> <div class="flex items-center justify-between mb-4"> <h2 class="text-sm md:text-base font-bold text-white">Tiến độ đọc</h2> <span class="material-symbols-outlined text-primary text-lg">auto_stories</span> </div> <div class="grid grid-cols-2 sm:grid-cols-4 gap-3" id="reading-stats-grid"> <div class="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5"> <span class="material-symbols-outlined text-primary text-lg" id="rp-completed-icon">trending_up</span> <p class="text-base font-bold text-white mt-1" id="rp-completed">...</p> <p class="text-[10px] text-on-surface-variant">Đã đọc</p> </div> <div class="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5"> <span class="material-symbols-outlined text-primary text-lg" id="rp-progress-icon">menu_book</span> <p class="text-base font-bold text-white mt-1" id="rp-progress">...</p> <p class="text-[10px] text-on-surface-variant">Đang đọc</p> </div> <div class="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5"> <span class="material-symbols-outlined text-primary text-lg">bookmark</span> <p class="text-base font-bold text-white mt-1" id="rp-bookmarked">...</p> <p class="text-[10px] text-on-surface-variant">Đánh dấu</p> </div> <div class="flex flex-col items-center text-center p-2.5 rounded-xl bg-white/5"> <span class="material-symbols-outlined text-primary text-lg">calendar_today</span> <p class="text-base font-bold text-white mt-1" id="rp-last-read">...</p> <p class="text-[10px] text-on-surface-variant">Lần cuối</p> </div> </div> <!-- Week bar --> <div class="mt-4 pt-4 border-t border-outline-variant/15"> <p class="text-[10px] text-on-surface-variant mb-2">Tuần này</p> <div class="flex gap-1" id="week-bar"> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-0"></div> <span class="text-[9px] text-on-surface-variant/60">T2</span> </div> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-1"></div> <span class="text-[9px] text-on-surface-variant/60">T3</span> </div> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-2"></div> <span class="text-[9px] text-on-surface-variant/60">T4</span> </div> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-3"></div> <span class="text-[9px] text-on-surface-variant/60">T5</span> </div> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-4"></div> <span class="text-[9px] text-on-surface-variant/60">T6</span> </div> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-5"></div> <span class="text-[9px] text-on-surface-variant/60">T7</span> </div> <div class="flex-1 flex flex-col items-center gap-1"> <div class="w-full h-8 rounded bg-white/5" id="day-bar-6"></div> <span class="text-[9px] text-on-surface-variant/60">CN</span> </div> </div> </div> </section> <!-- Scanner unlock banner --> <div id="scanner-unlock-banner" class="hidden glass-card rounded-2xl p-5 border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent"> <div class="flex items-center gap-3"> <span class="material-symbols-outlined text-primary text-2xl">workspace_premium</span> <div class="flex-1"> <p class="text-sm font-bold text-white">Bạn đủ điều kiện nhận Mini Scanner Pro miễn phí!</p> <p class="text-xs text-on-surface-variant mt-0.5" id="unlock-msg">Đã hoàn thành 3+ chương Tier 1 — mã kích hoạt đang chờ bạn.</p> </div> <button id="claim-scanner-btn" class="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
Nhận ngay
</button> </div> </div> <!-- Scanner access --> <section class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <div class="flex items-center justify-between mb-4"> <h2 class="text-sm md:text-base font-bold text-white">Scanners & AI Mentor</h2> <span class="material-symbols-outlined text-primary text-lg">psychology</span> </div> <div id="scanner-access-list" class="flex flex-col gap-2"> <p class="text-xs text-on-surface-variant">Đang tải...</p> </div> </section> <!-- My Questions --> <section class="glass-card rounded-2xl p-5 md:p-6 border border-outline-variant/20"> <div class="flex items-center justify-between mb-4"> <h2 class="text-sm md:text-base font-bold text-white">Câu hỏi của tôi</h2> <span class="px-2 py-0.5 text-[11px] font-bold bg-primary/10 text-primary rounded-full">${questions.length}</span> </div> ${questions.length === 0 ? renderTemplate`<div class="text-center py-8"> <span class="material-symbols-outlined text-5xl text-on-surface-variant/20 block mb-3">question_answer</span> <p class="text-sm text-on-surface-variant mb-1">Chưa có câu hỏi nào</p> <p class="text-xs text-on-surface-variant/70 mb-4">Hãy đọc sách và nhấn nút "Hỏi Tác Giả" để đặt câu hỏi.</p> <a href="/book" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:opacity-90 transition-all"> <span class="material-symbols-outlined text-sm">menu_book</span>
Đọc sách
</a> </div>` : renderTemplate`<div class="flex flex-col gap-2"> ${questions.slice(0, 5).map((q) => {
    const ch = chapterMap.get(q.chapter_id);
    const st = statusInfo(q.status);
    return renderTemplate`<a${addAttribute(`/my-questions/${q.id}`, "href")} class="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"> <div${addAttribute(["w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", st.color], "class:list")}> <span class="material-symbols-outlined text-base">${st.icon}</span> </div> <div class="flex-1 min-w-0"> <h3 class="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">${q.title}</h3> <div class="flex items-center gap-1.5 mt-1 text-[11px] text-on-surface-variant"> <span${addAttribute(["px-1.5 py-0.5 rounded text-[10px] font-bold", st.color], "class:list")}>${st.label}</span> ${ch && renderTemplate`<span>Tier ${ch.tier} · Ch${String(ch.chapter_no).padStart(2, "0")}</span>`} <span>· ${timeAgo(q.createdAt)}</span> </div> </div> <span class="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors self-center">chevron_right</span> </a>`;
  })} ${questions.length > 5 && renderTemplate`<p class="text-xs text-center text-on-surface-variant/60 mt-2">
Và ${questions.length - 5} câu hỏi khác...
</p>`} </div>`} </section> </div> </div> </div> </div> ${renderScript($$result2, "C:/dentalempireos/src/pages/account/profile.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/dentalempireos/src/pages/account/profile.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/account/profile.astro";
const $$url = "/account/profile";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
