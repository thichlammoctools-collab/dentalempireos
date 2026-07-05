globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_CcpFbi8U.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_lrzeJKgU.mjs";
import { env } from "cloudflare:workers";
import { t as getSurveyDefinitionFullBySlug, x as parseUiTranslations, y as parseLeadFields } from "./survey-config-db_CRuLFWXk.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { g as getClinicProfile } from "./clinic-profile-db_Pku6qJUb.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const slugParam = Astro2.params.slug;
  const slug = slugParam ?? "";
  let full;
  try {
    full = await getSurveyDefinitionFullBySlug(env.DB, slug);
  } catch (err) {
    console.error("[scanner/slug] DB error:", err);
    return new Response("Database error: " + String(err), { status: 500 });
  }
  if (!full) {
    return Astro2.redirect("/scanner");
  }
  if (full.definition.status !== "active") {
    return Astro2.redirect("/scanner");
  }
  const { definition, sections } = full;
  let clinicProfile = null;
  try {
    const auth = createAuth(env);
    const session = await auth.api.getSession({ headers: Astro2.request.headers });
    if (session?.user) {
      clinicProfile = await getClinicProfile(env.DB, session.user.id);
    }
  } catch (err) {
    console.error("[scanner/slug] Auth error:", err);
  }
  const surveyData = {
    id: definition.id,
    slug: definition.slug,
    title_vi: definition.title_vi,
    title_en: definition.title_en || definition.title_vi,
    description_vi: definition.description_vi || "",
    description_en: definition.description_en || "",
    lead_fields: parseLeadFields(definition.lead_fields),
    translations_vi: parseUiTranslations(definition.translations_vi),
    translations_en: parseUiTranslations(definition.translations_en),
    sections: sections.map((s) => ({
      id: s.id,
      title_vi: s.title_vi,
      title_en: s.title_en || s.title_vi,
      subtitle_vi: s.subtitle_vi || null,
      subtitle_en: s.subtitle_en || null,
      ref: s.ref || null,
      questions: s.questions.map((q) => ({
        id: q.id,
        question_id: q.question_id,
        type: q.type,
        label_vi: q.label_vi,
        label_en: q.label_en || q.label_vi,
        placeholder_vi: q.placeholder_vi || "",
        placeholder_en: q.placeholder_en || "",
        options_vi: q.options_vi ? JSON.parse(q.options_vi) : null,
        options_en: q.options_en ? JSON.parse(q.options_en) : null,
        scale_labels_vi: q.scale_labels_vi ? JSON.parse(q.scale_labels_vi) : null,
        scale_labels_en: q.scale_labels_en ? JSON.parse(q.scale_labels_en) : null,
        required: q.required || false,
        anchor: q.anchor || false
      }))
    }))
  };
  const defaultScaleVi = {
    "1": "Chưa có",
    "2": "Đang bắt đầu",
    "3": "Đã có nhưng chưa ổn định",
    "4": "Ổn định",
    "5": "Đầu tàu và nhất quán"
  };
  const defaultScaleEn = {
    "1": "None",
    "2": "Starting",
    "3": "Inconsistent",
    "4": "Stable",
    "5": "Exemplary"
  };
  return renderTemplate(_a || (_a = __template(["", ' <!-- External script to avoid SSR stream truncation with inline <script> tags --> <script src="/scripts/scanner-form-client.js"><\/script> '])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${definition.title_vi} | Dental Empire OS`, "description": definition.description_vi || void 0 }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative"> <div class="absolute inset-x-0 top-0 h-[420px] pointer-events-none opacity-50" style="background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15), transparent 60%);"></div> <div class="relative"> <!-- PASS DATA VIA DATA ATTRIBUTES — no define:vars to avoid SSR truncation --> <div id="survey-form" class="survey-wrap" data-default-lang="vi"${addAttribute(surveyData.id, "data-survey-id")}${addAttribute(surveyData.slug, "data-survey-slug")}${addAttribute(JSON.stringify(surveyData), "data-survey")}${addAttribute(clinicProfile ? JSON.stringify(clinicProfile) : "", "data-clinic")}${addAttribute(JSON.stringify(defaultScaleVi), "data-scale-vi")}${addAttribute(JSON.stringify(defaultScaleEn), "data-scale-en")}> <div class="lang-toggle"> <button type="button" class="lang-btn active" data-lang="vi">Tiếng Việt</button> <button type="button" class="lang-btn" data-lang="en">English</button> </div> <!-- Stepper --> <div class="stepper"> <div id="stepper-fill" class="stepper-fill"></div> <div id="step-labels" class="step-labels"></div> </div> <!-- Parts container --> <div id="parts-container"></div> <!-- Intro card --> <div id="card-intro" class="intro-card card"> <div class="intro-top"> <h1 class="intro-title">${definition.title_vi}</h1> <p class="intro-desc">${definition.description_vi}</p> </div> <div class="intro-info"> <p id="intro-info-title" class="intro-info-title">Thông tin cơ bản</p> </div> <div id="intro-fields"></div> <button type="button" class="btn btn-primary" id="btn-start">Bắt đầu →</button> </div> <!-- Sticky bottom nav (shows on section pages, always visible) --> <div id="sticky-nav" class="sticky-nav hidden"> <div class="sticky-nav-center"> <div class="sticky-nav-inner"> <button type="button" class="btn btn-ghost sticky-btn-back" id="sticky-btn-back">← <span class="sticky-btn-text-back">Quay lại</span></button> <div class="sticky-progress"> <span id="sticky-step-label">1/2</span> <div class="sticky-progress-bar"><div id="sticky-progress-fill" class="sticky-progress-fill"></div></div> </div> <button type="button" class="btn btn-primary sticky-btn-next" id="sticky-btn-next">Tiếp tục →</button> </div> </div> </div> <!-- Submit card --> <div id="card-submit" class="card submit-card hidden"> <div class="submit-top"> <p id="submit-title" class="submit-title">Sẵn sàng gửi?</p> <p id="submit-desc" class="submit-desc">Hệ thống sẽ lưu hồ sơ và bắt đầu phân tích...</p> </div> <div id="submit-fields"></div> <div class="flex gap-3 mt-4"> <button type="button" class="btn btn-ghost" id="btn-back-submit">← Quay lại</button> <button type="button" class="btn btn-primary" id="btn-submit"> <span id="submit-btn-label">Gửi Hồ Sơ</span> </button> </div> <p id="submit-error" class="error-text hidden"></p> </div> </div> </div> </section> ` }));
}, "C:/dentalempireos/src/pages/scanner/[slug].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/scanner/[slug].astro";
const $$url = "/scanner/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
