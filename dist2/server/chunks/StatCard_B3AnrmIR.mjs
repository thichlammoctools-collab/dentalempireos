globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
const $$StatCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StatCard;
  const {
    icon,
    label,
    value,
    trend,
    trendDir = "up",
    accent = "primary",
    progress
  } = Astro2.props;
  const accentClasses = {
    primary: { text: "text-primary", bg: "bg-primary/10", bar: "bg-primary", glow: true },
    tertiary: { text: "text-tertiary", bg: "bg-tertiary/10", bar: "bg-tertiary", glow: false },
    error: { text: "text-error", bg: "bg-error/10", bar: "bg-error", glow: false }
  };
  const trendIcon = {
    up: "trending_up",
    down: "trending_down",
    flat: "remove"
  };
  const trendColor = trendDir === "flat" ? "text-on-surface-variant" : accentClasses[accent].text;
  const a = accentClasses[accent];
  const pct = Math.max(0, Math.min(100, progress));
  return renderTemplate`${maybeRenderHead()}<div class="glass-card p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden group"> <div class="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"></div> <div class="flex justify-between items-center relative"> <span${addAttribute(`material-symbols-outlined ${a.text} ${a.bg} p-2 rounded-lg`, "class")}>${icon}</span> <span${addAttribute(`${trendColor} font-bold text-sm flex items-center gap-1`, "class")}> ${trend} <span class="material-symbols-outlined text-sm">${trendIcon[trendDir]}</span> </span> </div> <h4 class="text-[12px] font-bold tracking-[0.1em] uppercase text-on-surface-variant">${label}</h4> <span class="text-3xl text-white font-bold leading-tight">${value}</span> <div class="w-full bg-surface-container-low h-1 rounded-full overflow-hidden"> <div${addAttribute([a.bar, "h-full", a.glow && "cyan-glow"], "class:list")}${addAttribute(`width: ${pct}%`, "style")}></div> </div> </div>`;
}, "C:/dentalempireos/src/components/admin/StatCard.astro", void 0);
export {
  $$StatCard as $
};
