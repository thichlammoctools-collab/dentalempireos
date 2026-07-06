globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, m as maybeRenderHead, a as addAttribute, u as unescapeHTML } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
import { r as renderScript } from "./global_Ia4nBvKf.mjs";
import { $ as $$BaseLayout } from "./BaseLayout_NhufuOWg.mjs";
import { env } from "cloudflare:workers";
import { g } from "./marked.esm_10m2JtFV.mjs";
import { g as getSurveyDefinitionFull, a as parseScoringRules, p as parseAiConfig, b as parseScaleLabels } from "./survey-config-db_CRuLFWXk.mjs";
import { g as getScannerResponse, p as parseScores, h as getScoreLevel, c as parseResponses } from "./scanner-response-db_CWaYXhV5.mjs";
import { n as getChaptersByRefs, o as getChapterExcerpt } from "./book-db_DDcc_FYk.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { i as isResponseOwnedByUser } from "./scanner-history-db_dHxdXqnG.mjs";
import { g as getUserByEmail } from "./user-db_CM6xE649.mjs";
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const idParam = Astro2.params.id;
  const id = idParam ? parseInt(idParam, 10) : 0;
  if (!id || Number.isNaN(id)) {
    return Astro2.redirect("/");
  }
  const response = await getScannerResponse(env.DB, id);
  if (!response) {
    return new Response("Response not found", { status: 404 });
  }
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: Astro2.request.headers });
  if (!session?.user) {
    return Astro2.redirect(`/login?redirect=/scanner/result/${id}`);
  }
  const owned = await isResponseOwnedByUser(env.DB, session.user.id, id);
  const ownsByEmail = response.email ? (await getUserByEmail(env.DB, response.email))?.id === session.user.id : false;
  if (!owned && !ownsByEmail) {
    return new Response(
      "Bạn không có quyền xem kết quả này.",
      { status: 403 }
    );
  }
  const full = await getSurveyDefinitionFull(env.DB, response.survey_id);
  if (!full) {
    return new Response("Survey not found", { status: 404 });
  }
  const { definition } = full;
  const lang = response.lang === "en" ? "en" : "vi";
  const scoringRules = parseScoringRules(definition.scoring_rules);
  const aiConfig = parseAiConfig(definition.ai_config);
  const scores = parseScores(response.scores_json);
  const totalScore = scores.total ?? 0;
  const dimensions = [];
  if (scoringRules) {
    for (const dim of scoringRules.dimensions) {
      const score = scores[dim.id] ?? 0;
      dimensions.push({
        id: dim.id,
        name: lang === "vi" ? dim.name_vi ?? dim.id : dim.name_en ?? dim.name_vi ?? dim.id,
        score,
        level: getScoreLevel(score, scoringRules, lang)
      });
    }
  }
  const totalLevel = getScoreLevel(totalScore, scoringRules ?? { thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 } }, lang);
  g.setOptions({ gfm: true, breaks: true });
  const analysisHtml = response.ai_analysis ? g.parse(response.ai_analysis) : "";
  const hasAnalysis = !!analysisHtml;
  const hasPlan = !!response.ai_plan;
  const planHtml = response.ai_plan ? g.parse(response.ai_plan) : "";
  const insights = { strengths: [], needsWork: [] };
  const parsedResponses = parseResponses(response.responses_json);
  for (const section of full.sections) {
    for (const q of section.questions) {
      if (q.type === "select") {
        const v = parsedResponses[q.question_id];
        if (typeof v === "number") {
          const labels = parseScaleLabels(q.scale_labels_vi);
          const label = labels[String(v)] ?? String(v);
          const rawScore = v / 5 * 100;
          if (v >= 4) {
            insights.strengths.push({ question: lang === "vi" ? q.label_vi : q.label_en ?? q.label_vi, value: v, label, score: rawScore });
          } else {
            insights.needsWork.push({ question: lang === "vi" ? q.label_vi : q.label_en ?? q.label_vi, value: v, label, score: rawScore });
          }
        }
      }
    }
  }
  const chapterRefs = [];
  if (definition.chapter_refs) {
    try {
      const refs = JSON.parse(definition.chapter_refs);
      const chapters = await getChaptersByRefs(env.DB, refs);
      for (const ch of chapters) {
        const excerpt = await getChapterExcerpt(env.DB, ch.id);
        chapterRefs.push({ chapter_no: ch.chapter_no, title: ch.title, id: ch.id, excerpt });
      }
    } catch {
    }
  }
  let linkedProduct = null;
  try {
    const app = await env.DB.prepare('SELECT id FROM "ai_application" WHERE "slug" = ? OR "id" = ?').bind(definition.slug, `survey-${definition.id}`).first();
    if (app) {
      linkedProduct = await env.DB.prepare('SELECT id, name, price FROM "product" WHERE "app_id" = ? AND "is_active" = 1 ORDER BY "price" DESC LIMIT 1').bind(app.id).first();
    }
    if (!linkedProduct) {
      linkedProduct = await env.DB.prepare('SELECT id, name, price FROM "product" WHERE "reference_id" = ? AND "is_active" = 1 ORDER BY "price" DESC LIMIT 1').bind(definition.id).first();
    }
    if (!linkedProduct) {
      const packProduct = await env.DB.prepare(`SELECT id, name, price FROM "product" WHERE "id" = 'prod-scanner-pack' AND "is_active" = 1 LIMIT 1`).first();
      if (packProduct) linkedProduct = packProduct;
    }
  } catch {
  }
  const productId = linkedProduct?.id ?? `survey-${definition.id}`;
  const priceFormatted = linkedProduct ? new Intl.NumberFormat("vi-VN").format(linkedProduct.price) : linkedProduct === null && definition.is_free === 1 ? "0" : "199.000";
  const surveyTitle = lang === "vi" ? definition.title_vi : definition.title_en || definition.title_vi;
  aiConfig.analysis_sections ?? [];
  let crossSells = [];
  try {
    const result = await env.DB.prepare(
      `SELECT id, slug, title_vi, title_en, description_vi
       FROM "survey_definition"
       WHERE status = 'active' AND id != ?
       ORDER BY order_index ASC
       LIMIT 3`
    ).bind(definition.id).all();
    crossSells = (result.results ?? []).map((r) => ({
      id: r.id,
      slug: r.slug,
      title_vi: r.title_vi,
      title_en: r.title_en || r.title_vi,
      description_vi: r.description_vi
    }));
  } catch {
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${surveyTitle} #${id} | Dental Empire OS`, "description": lang === "vi" ? "Bản phân tích hệ thống quản trị phòng khám" : "Clinic management analysis", "noindex": true, "data-astro-cid-q36rctkm": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="result-wrap"${addAttribute(id, "data-response-id")}${addAttribute(id, "data-survey-id")}${addAttribute(productId, "data-product-id")}${addAttribute(lang, "data-lang")}${addAttribute(definition.slug, "data-survey-slug")}${addAttribute(definition.is_free, "data-is-free")} data-astro-cid-q36rctkm> <!-- Header --> <div class="result-header" data-astro-cid-q36rctkm> <div data-astro-cid-q36rctkm> <p class="text-xs uppercase tracking-wider text-amber-500 font-bold mb-1" data-astro-cid-q36rctkm> ${surveyTitle} </p> <h1 class="result-title" data-astro-cid-q36rctkm> ${response.clinic_name ?? (lang === "vi" ? "Phòng khám" : "Clinic")} </h1> <p class="text-sm text-on-surface-variant mt-1" data-astro-cid-q36rctkm> ${response.owner_name ? `${response.owner_name} · ` : ""} ${new Date(response.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })} </p> </div> <div class="flex gap-2 flex-wrap" data-astro-cid-q36rctkm> <a${addAttribute(`/scanner/${definition.slug}`, "href")} class="btn btn-ghost" data-astro-cid-q36rctkm> ${lang === "vi" ? "Làm khảo sát mới" : "New survey"} </a> </div> </div> <!-- Score Overview Card — ALWAYS FREE --> <div class="card score-card" data-astro-cid-q36rctkm> <div class="score-header" data-astro-cid-q36rctkm> <div data-astro-cid-q36rctkm> <p class="text-xs uppercase tracking-wider text-on-surface-variant font-bold" data-astro-cid-q36rctkm> ${lang === "vi" ? "Điểm tổng hợp" : "Overall Score"} </p> <div class="score-total" data-astro-cid-q36rctkm> <span class="score-num"${addAttribute(`color: ${totalLevel.color}`, "style")} data-astro-cid-q36rctkm>${totalScore}</span> <span class="score-suffix" data-astro-cid-q36rctkm>/100</span> </div> <p class="text-sm font-semibold"${addAttribute(`color: ${totalLevel.color}`, "style")} data-astro-cid-q36rctkm>${totalLevel.label_vi}</p> </div> <div class="score-summary" data-astro-cid-q36rctkm> ${lang === "vi" ? renderTemplate`<p data-astro-cid-q36rctkm> ${totalScore < 40 ? "Phòng khám đang ở giai đoạn sơ khai — đây là thời điểm tốt để soi chiếu." : totalScore < 70 ? "Phòng khám đang hình thành — tiếp tục đào sâu để vững mạnh." : "Phòng khám đang trưởng thành — giữ vững momentum và lan tỏa giá trị."} </p>` : renderTemplate`<p data-astro-cid-q36rctkm> ${totalScore < 40 ? "Your clinic is in the early stage — this is a good time to illuminate and deepen." : totalScore < 70 ? "Your clinic is forming — keep deepening to grow strong." : "Your clinic is maturing — keep the momentum and spread the value."} </p>`} </div> </div> <div class="score-bars" data-astro-cid-q36rctkm> ${dimensions.map((p) => renderTemplate`<div class="bar-item" data-astro-cid-q36rctkm> <div class="bar-label" data-astro-cid-q36rctkm> <span class="bar-name" data-astro-cid-q36rctkm>${p.name}</span> <span class="bar-value"${addAttribute(`color: ${p.level.color}`, "style")} data-astro-cid-q36rctkm> ${p.score} <span class="bar-level" data-astro-cid-q36rctkm>· ${lang === "vi" ? p.level.label_vi : p.level.label_en}</span> </span> </div> <div class="bar-track" data-astro-cid-q36rctkm> <div class="bar-fill"${addAttribute(`width: ${p.score}%; background: ${p.level.color}`, "style")} data-astro-cid-q36rctkm></div> </div> </div>`)} </div> </div> <!-- Section 1: What does this score mean? — ALWAYS FREE --> ${insights.strengths.length > 0 || insights.needsWork.length > 0 ? renderTemplate`<div class="card insight-card" data-astro-cid-q36rctkm> <div class="insight-header" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-amber-400 text-xl" data-astro-cid-q36rctkm>lightbulb</span> <h2 class="insight-title" data-astro-cid-q36rctkm> ${lang === "vi" ? "Điểm này có ý nghĩa gì?" : "What does this score mean?"} </h2> </div> ${insights.strengths.length > 0 && renderTemplate`<div class="insight-section" data-astro-cid-q36rctkm> <p class="insight-section-label success" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-sm" data-astro-cid-q36rctkm>thumb_up</span> ${lang === "vi" ? "Điểm mạnh" : "Strengths"} </p> <div class="insight-items" data-astro-cid-q36rctkm> ${insights.strengths.map((item) => renderTemplate`<div class="insight-item insight-item--success" data-astro-cid-q36rctkm> <div class="insight-item-header" data-astro-cid-q36rctkm> <span class="insight-question" data-astro-cid-q36rctkm>${item.question}</span> <span class="insight-badge success-badge" data-astro-cid-q36rctkm> ${item.value}/5 — ${item.label} </span> </div> <div class="insight-bar-track" data-astro-cid-q36rctkm> <div class="insight-bar-fill"${addAttribute(`width:${item.score}%;background:#22c55e`, "style")} data-astro-cid-q36rctkm></div> </div> </div>`)} </div> </div>`} ${insights.needsWork.length > 0 && renderTemplate`<div class="insight-section" data-astro-cid-q36rctkm> <p class="insight-section-label warning" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-sm" data-astro-cid-q36rctkm>construction</span> ${lang === "vi" ? "Cần cải thiện" : "Needs improvement"} </p> <div class="insight-items" data-astro-cid-q36rctkm> ${insights.needsWork.map((item) => renderTemplate`<div class="insight-item insight-item--warning" data-astro-cid-q36rctkm> <div class="insight-item-header" data-astro-cid-q36rctkm> <span class="insight-question" data-astro-cid-q36rctkm>${item.question}</span> <span class="insight-badge warning-badge" data-astro-cid-q36rctkm> ${item.value}/5 — ${item.label} </span> </div> <div class="insight-bar-track" data-astro-cid-q36rctkm> <div class="insight-bar-fill"${addAttribute(`width:${item.score}%;background:#f59e0b`, "style")} data-astro-cid-q36rctkm></div> </div> </div>`)} </div> </div>`} </div>` : null} <!-- Section 2: Nên đọc thêm — ALWAYS FREE --> ${chapterRefs.length > 0 && renderTemplate`<div class="card reading-card" data-astro-cid-q36rctkm> <div class="insight-header" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-amber-400 text-xl" data-astro-cid-q36rctkm>menu_book</span> <h2 class="insight-title" data-astro-cid-q36rctkm> ${lang === "vi" ? "Nên đọc thêm" : "Recommended reading"} </h2> </div> <div class="reading-list" data-astro-cid-q36rctkm> ${chapterRefs.map((ch) => renderTemplate`<a${addAttribute(`/book/${ch.id}`, "href")} class="reading-item" data-astro-cid-q36rctkm> <div class="reading-meta" data-astro-cid-q36rctkm> <span class="reading-tag" data-astro-cid-q36rctkm>Ch.${ch.chapter_no}</span> <h3 class="reading-title" data-astro-cid-q36rctkm>${ch.title}</h3> </div> ${ch.excerpt && renderTemplate`<p class="reading-excerpt" data-astro-cid-q36rctkm>${ch.excerpt}</p>`} <div class="reading-cta" data-astro-cid-q36rctkm> <span class="reading-link" data-astro-cid-q36rctkm> ${lang === "vi" ? "Đọc chương này" : "Read this chapter"} <span class="material-symbols-outlined text-base" data-astro-cid-q36rctkm>arrow_forward</span> </span> </div> </a>`)} </div> </div>`} <!-- Section 3: 30-day plan — FREE (AI-generated, polled) --> <div class="card plan-card" id="plan-section" data-astro-cid-q36rctkm> <div class="insight-header" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-amber-400 text-xl" data-astro-cid-q36rctkm>calendar_month</span> <h2 class="insight-title" data-astro-cid-q36rctkm> ${lang === "vi" ? "Kế hoạch 30 ngày" : "30-day action plan"} </h2> </div> ${hasPlan ? renderTemplate`<article class="prose-content" data-astro-cid-q36rctkm>${unescapeHTML(planHtml)}</article>` : renderTemplate`<div class="text-center py-6 text-on-surface-variant" id="plan-loading" data-astro-cid-q36rctkm> <div class="spinner mb-3" data-astro-cid-q36rctkm></div> <p class="text-sm" data-astro-cid-q36rctkm>${lang === "vi" ? "Đang tạo kế hoạch cá nhân hóa..." : "Creating your personalized plan..."}</p> </div>`} </div> <!-- AI Analysis — LOCKED behind paywall (unless is_free=1) --> <div class="card analysis-card" id="analysis-section" data-astro-cid-q36rctkm> <div class="analysis-header" data-astro-cid-q36rctkm> <div data-astro-cid-q36rctkm> <p class="text-xs uppercase tracking-wider text-amber-500 font-bold" data-astro-cid-q36rctkm> ${lang === "vi" ? "Phân tích AI" : "AI Analysis"} </p> <h2 class="analysis-title" data-astro-cid-q36rctkm> ${lang === "vi" ? "Bản soi chiếu hệ thống" : "System Illumination"} </h2> </div> </div> <div id="analysis-unlocked" class="hidden" data-astro-cid-q36rctkm> ${hasAnalysis ? renderTemplate`<article class="prose-content" data-astro-cid-q36rctkm>${unescapeHTML(analysisHtml)}</article>` : renderTemplate`<div class="text-center py-8 text-on-surface-variant" data-astro-cid-q36rctkm> <div class="spinner mb-4" data-astro-cid-q36rctkm></div> <p data-astro-cid-q36rctkm>${lang === "vi" ? "Bản phân tích AI đang được tạo..." : "AI analysis is being generated..."}</p> </div>`} </div> <div id="analysis-locked" data-astro-cid-q36rctkm> ${definition.is_free === 1 ? renderTemplate`<div class="text-center py-6 text-on-surface-variant" data-astro-cid-q36rctkm> <p data-astro-cid-q36rctkm>${lang === "vi" ? "Bản phân tích đang được tạo..." : "Analysis is being generated..."}</p> </div>` : renderTemplate`<div class="paywall-overlay" data-astro-cid-q36rctkm> <div class="paywall-icon" data-astro-cid-q36rctkm> <span class="material-symbols-outlined" style="font-size:3rem;color:#f59e0b;" data-astro-cid-q36rctkm>lock</span> </div> <h3 class="paywall-title" data-astro-cid-q36rctkm> ${lang === "vi" ? "Mở khóa Bản Phân Tích AI" : "Unlock AI Analysis"} </h3> <p class="paywall-desc" data-astro-cid-q36rctkm> ${lang === "vi" ? `Bản phân tích chi tiết theo framework — bao gồm gợi ý hành động ưu tiên và lời nhắn từ chuyên gia.` : `Detailed framework-based analysis — including priority actions and a personal note from the expert.`} </p> <div class="paywall-price" data-astro-cid-q36rctkm> <span class="paywall-amount" data-astro-cid-q36rctkm>${priceFormatted}</span> <span class="paywall-currency" data-astro-cid-q36rctkm>VND</span> </div> <button id="btn-unlock" class="btn btn-primary paywall-btn" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-base" data-astro-cid-q36rctkm>lock_open</span> ${lang === "vi" ? "Mở khóa ngay" : "Unlock now"} </button> <p class="paywall-note" data-astro-cid-q36rctkm> ${lang === "vi" ? "Thanh toán qua PayOS • Truy cập vĩnh viễn" : "Pay via PayOS • Lifetime access"} </p> </div>`} </div> </div> <!-- Cross-sell (other scanners) --> ${crossSells.length > 0 && renderTemplate`<div class="card cross-sell-card" data-astro-cid-q36rctkm> <h3 class="cross-sell-title" data-astro-cid-q36rctkm> ${lang === "vi" ? "Khám phá thêm các máy quét khác" : "Explore other scanners"} </h3> <div class="cross-sell-grid" data-astro-cid-q36rctkm> ${crossSells.map((s) => renderTemplate`<a${addAttribute(`/scanner/${s.slug}`, "href")} class="cross-sell-item" data-astro-cid-q36rctkm> <span class="material-symbols-outlined text-primary text-2xl" data-astro-cid-q36rctkm>fact_check</span> <div data-astro-cid-q36rctkm> <p class="text-sm font-semibold text-on-surface" data-astro-cid-q36rctkm>${lang === "vi" ? s.title_vi : s.title_en}</p> ${s.description_vi && renderTemplate`<p class="text-xs text-on-surface-variant line-clamp-2 mt-0.5" data-astro-cid-q36rctkm>${s.description_vi}</p>`} </div> <span class="material-symbols-outlined text-on-surface-variant/50" data-astro-cid-q36rctkm>arrow_forward</span> </a>`)} </div> </div>`} </section> ` })}  ${renderScript($$result, "C:/dentalempireos/src/pages/scanner/result/[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/dentalempireos/src/pages/scanner/result/[id].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/scanner/result/[id].astro";
const $$url = "/scanner/result/[id]";
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
