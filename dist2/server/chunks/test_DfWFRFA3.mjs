globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Cl17k-Kx.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_BOB8F8DU.mjs";
import { env } from "cloudflare:workers";
import { t as getSurveyDefinitionFullBySlug } from "./survey-config-db_AxTlbaW3.mjs";
const prerender = false;
const $$Test = createComponent(async ($$result, $$props, $$slots) => {
  const slug = "marketing-check";
  const full = await getSurveyDefinitionFullBySlug(env.DB, slug);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Test Scanner" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative"> <div class="absolute inset-x-0 top-0 h-[420px] pointer-events-none opacity-50" style="background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15), transparent 60%);"></div> <div class="relative max-w-[860px] mx-auto px-4 pt-32 pb-16"> <h1 class="text-2xl font-bold text-white mb-4">TEST PAGE</h1> <p class="text-on-surface-variant mb-4">Slug: ${full ? full.definition.title_vi : "NOT FOUND"}</p> <p class="text-on-surface-variant mb-4">Sections: ${full ? full.sections.length : 0}</p> <div class="glass-card rounded-2xl p-6 border border-outline-variant/20"> <p class="text-white">Testing survey page render...</p> <pre class="text-xs text-on-surface-variant mt-4 overflow-auto max-h-64">${JSON.stringify(full ? { title: full.definition.title_vi, sections: full.sections.length } : null, null, 2)}</pre> </div> </div> </section> ` })}`;
}, "C:/dentalempireos/src/pages/scanner/test.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/scanner/test.astro";
const $$url = "/scanner/test";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Test,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
