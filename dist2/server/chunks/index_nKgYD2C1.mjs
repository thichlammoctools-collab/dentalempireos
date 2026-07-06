globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_BOB8F8DU.mjs";
import { env } from "cloudflare:workers";
import { g as getHomepageSettings, a as getDefaults } from "./homepage-db_DaEeUQAE.mjs";
import { $ as $$DonateWidget } from "./DonateWidget_BmV9Szvi.mjs";
import { g as getSupportSettings, m as getTierStats } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const homepage = await getHomepageSettings(env.DB) ?? getDefaults();
  const supportSettings = await getSupportSettings(env.DB) ?? {
    enabled: 0,
    title: "Ủng Hộ Dental Empire OS",
    message: "",
    qr_url: "/images/qr/donation-qr.svg",
    payment_methods: ""
  };
  const tiers = [
    { tier: 1, name: homepage.tier1_name, subtitle: homepage.tier1_subtitle, icon: homepage.tier1_icon },
    { tier: 2, name: homepage.tier2_name, subtitle: homepage.tier2_subtitle, icon: homepage.tier2_icon },
    { tier: 3, name: homepage.tier3_name, subtitle: homepage.tier3_subtitle, icon: homepage.tier3_icon }
  ];
  const [tier1Stats, tier2Stats, tier3Stats] = await Promise.all([
    getTierStats(env.DB, 1),
    getTierStats(env.DB, 2),
    getTierStats(env.DB, 3)
  ]);
  const tierStatsMap = {
    1: tier1Stats,
    2: tier2Stats,
    3: tier3Stats
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Dental Empire OS - Hệ Điều Hành Quản Trị Nha Khoa Toàn Diện" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative min-h-[560px] flex items-center overflow-hidden"> <div class="absolute inset-0 z-0"> <div class="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/90 to-transparent"></div> </div> <div class="relative z-10 w-full px-6 max-w-[1200px] mx-auto grid md:grid-cols-2 gap-10 items-center py-12"> <div class="space-y-5"> <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary"> <span class="material-symbols-outlined text-[18px]">verified</span> <span class="font-semibold text-sm tracking-wider">${homepage.badge_text}</span> </div> <h1 class="text-headline-xl leading-loose text-white"> ${homepage.hero_title_line1.split(":")[0]}:<br> <span class="text-primary">${homepage.hero_title_line1.split(":").slice(1).join(":").trim()}</span> ${homepage.hero_title_line2} </h1> <p class="text-on-surface-variant max-w-lg leading-relaxed">${homepage.hero_description}</p> <div class="flex flex-wrap gap-4 pt-2"> <a href="/book" class="px-7 py-3 btn-primary-metallic font-bold rounded-xl hover:-translate-y-1 active:scale-95 transition-all">${homepage.hero_cta_primary}</a> </div> <div class="flex items-center gap-6 pt-4 border-t border-outline-variant"> <p class="text-on-surface-variant font-semibold">${homepage.hero_stats_text}</p> </div> <div class="flex flex-col gap-1.5 text-xs text-on-surface-variant/90 leading-relaxed"> <p class="flex items-start gap-2"> <span class="material-symbols-outlined text-[16px] text-primary leading-none mt-0.5 shrink-0">phone_iphone</span> <span><span class="font-semibold text-white">iOS:</span> Mở Safari → nhấn nút Chia sẻ → chọn <span class="font-semibold">"Thêm vào Màn hình chính"</span>.</span> </p> <p class="flex items-start gap-2"> <span class="material-symbols-outlined text-[16px] text-primary leading-none mt-0.5 shrink-0">android</span> <span><span class="font-semibold text-white">Android:</span> Mở Chrome → nhấn <span class="font-semibold">⋮</span> → chọn <span class="font-semibold">"Cài đặt ứng dụng"</span>.</span> </p> </div> </div> <div class="hidden md:block relative"> <div class="absolute inset-0 bg-primary-container/10 rounded-[2rem] -rotate-3 blur-2xl"></div> <img${addAttribute(homepage.hero_image_url, "src")} alt="Dental Empire OS - Bìa sách" class="relative z-10 w-full rounded-[2rem] shadow-2xl border-4 border-surface-container-high object-cover" loading="eager" onerror="this.style.display='none'"> </div> </div> </section>  <section class="py-20 bg-surface-container-low"> <div class="px-6 max-w-[1200px] mx-auto"> <div class="text-center mb-16 space-y-4"> <h2 class="text-headline-lg text-white">${homepage.tier_section_heading}</h2> <p class="text-on-surface-variant max-w-2xl mx-auto">${homepage.tier_section_subheading}</p> </div> <div class="flex flex-col gap-8 max-w-4xl mx-auto"> ${tiers.map((mod, index) => {
    const stats = tierStatsMap[mod.tier];
    if (index === 0) {
      return renderTemplate`<div class="group relative p-8 rounded-[2rem] border transition-all duration-500 bg-surface-container border-primary/30 hover:border-primary hover:shadow-[0_0_40px_rgba(146,204,255,0.15)] shadow-[0_0_30px_rgba(146,204,255,0.1)]"> <div class="absolute top-0 right-0 p-6 transition-opacity opacity-20 group-hover:opacity-100"> <span class="material-symbols-outlined text-6xl text-primary">${mod.icon}</span> </div> <div class="relative z-10"> <div class="flex flex-wrap items-center gap-3 mb-4"> <div class="inline-block px-4 py-1 rounded-full font-semibold text-sm tracking-wider bg-primary/10 text-primary whitespace-nowrap">
TẦNG ${mod.tier} </div> <div class="flex items-center gap-3 text-xs whitespace-nowrap"> <span class="flex items-center gap-1 text-primary font-medium"> <span class="material-symbols-outlined text-[16px]">menu_book</span> ${stats.chapterCount} chương
</span> <span class="flex items-center gap-1 text-primary font-medium"> <span class="material-symbols-outlined text-[16px]">toc</span> ${stats.sectionCount} đề mục
</span> </div> </div> <h3 class="text-headline-md text-white mb-2 group-hover:text-primary transition-colors">${mod.name}</h3> <p class="text-on-surface-variant leading-relaxed max-w-2xl"> ${mod.subtitle} </p> <div class="mt-6 flex flex-wrap gap-3"> <a href="/book" class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 active:scale-95 transition-all"> <span class="material-symbols-outlined text-[18px]">menu_book</span>
Đọc sách
</a> </div> </div> </div>`;
    }
    return renderTemplate`<a href="/book"${addAttribute([
      "group relative p-8 rounded-[2rem] border transition-all duration-500 block",
      "bg-surface-container border-outline-variant hover:border-primary/50 hover:shadow-[0_0_30px_rgba(146,204,255,0.08)]"
    ], "class:list")}> <div class="absolute top-0 right-0 p-6 transition-opacity opacity-10 group-hover:opacity-50"> <span class="material-symbols-outlined text-6xl text-primary">${mod.icon}</span> </div> <div class="relative z-10"> <div class="flex flex-wrap items-center gap-3 mb-4"> <div class="inline-block px-4 py-1 rounded-full font-semibold text-sm tracking-wider bg-primary/10 text-primary whitespace-nowrap">
TẦNG ${mod.tier} </div> <div class="flex items-center gap-3 text-xs whitespace-nowrap"> <span class="flex items-center gap-1 text-primary font-medium"> <span class="material-symbols-outlined text-[16px]">menu_book</span> ${stats.chapterCount} chương
</span> <span class="flex items-center gap-1 text-primary font-medium"> <span class="material-symbols-outlined text-[16px]">toc</span> ${stats.sectionCount} đề mục
</span> </div> </div> <h3 class="text-headline-md text-white mb-2 group-hover:text-primary transition-colors">${mod.name}</h3> <p class="text-on-surface-variant leading-relaxed max-w-2xl"> ${mod.subtitle} </p> <div class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
Xem sách
<span class="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span> </div> </div> </a>`;
  })} </div> </div> </section>  <section class="py-20 bg-surface-container-lowest text-on-surface overflow-hidden"> <div class="px-6 max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 items-center"> <div class="relative group"> <div class="absolute -inset-4 bg-primary-container/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div> <div class="relative z-10 w-full aspect-[3/4] rounded-3xl shadow-2xl border-2 border-outline-variant bg-gradient-to-br from-surface-container to-surface-container-high flex items-center justify-center overflow-hidden"> ${homepage.founder_image_url ? renderTemplate`<img${addAttribute(homepage.founder_image_url, "src")}${addAttribute(homepage.founder_name, "alt")} class="w-full h-full object-cover rounded-3xl" onerror="this.parentElement.innerHTML=\`<div class='text-center space-y-4 p-8'><span class='material-symbols-outlined text-9xl text-primary/30'>person</span><div class='text-headline-md font-bold text-white'>\${this.alt}</div><div class='text-on-surface-variant text-sm'>\${this.dataset.title || ''}</div></div>\`"${addAttribute(homepage.founder_title, "data-title")}>` : renderTemplate`<div class="text-center space-y-4 p-8"> <span class="material-symbols-outlined text-9xl text-primary/30">person</span> <div class="text-headline-md font-bold text-white">${homepage.founder_name}</div> <div class="text-on-surface-variant text-sm">${homepage.founder_title}</div> </div>`} </div> </div> <div class="space-y-8"> <div class="inline-block px-4 py-1 rounded-full border border-outline bg-white/5 font-semibold text-sm tracking-wider">${homepage.founder_badge}</div> <h2 class="text-headline-lg text-white">${homepage.founder_heading}</h2> <p class="text-on-surface-variant leading-relaxed">${homepage.founder_bio}</p> <div class="grid grid-cols-2 gap-8 py-4"> <div> <div class="text-4xl font-bold text-primary mb-2">${homepage.founder_stat1_value}</div> <div class="text-sm text-on-surface-variant">${homepage.founder_stat1_label}</div> </div> <div> <div class="text-4xl font-bold text-primary mb-2">${homepage.founder_stat2_value}</div> <div class="text-sm text-on-surface-variant">${homepage.founder_stat2_label}</div> </div> </div> <a class="inline-flex items-center gap-2 group font-bold text-primary hover:text-white transition-colors" href="/about"> ${homepage.founder_link_text} <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span> </a> </div> </div> </section>    <section class="py-12 bg-transparent"> <div class="px-6 max-w-[900px] mx-auto"> ${renderComponent($$result2, "DonateWidget", $$DonateWidget, { "settings": supportSettings, "variant": "inline" })} </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/index.astro";
const $$url = "";
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
