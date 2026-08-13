// Generic PDF generator for scanner responses.
// Reads dimension names from survey_definition.scoring_rules + responses from scanner_response.
// Replaces the hardcoded generateSurveyPdf() in pdf-generator.ts.

import { PDFDocument, rgb, PDFPage, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { marked } from 'marked';
import {
  type ScannerResponseRow,
  parseScores,
  parseResponses,
} from './scanner-response-db';
import {
  type ScoringRules,
  parseScoringRules,
  parseScaleLabels,
} from './survey-config-db';
import { getScoreLevel } from './scoring-engine';
import { BE_VIETNAM_PRO_REGULAR, BE_VIETNAM_PRO_BOLD } from './fonts/bvn-fonts';

const NAVY = rgb(0.13, 0.27, 0.55);
const AMBER = rgb(0.96, 0.62, 0.04);
const TEXT = rgb(0.15, 0.15, 0.18);
const MUTED = rgb(0.45, 0.45, 0.5);
const LIGHT = rgb(0.92, 0.92, 0.94);
const SUCCESS = rgb(0.06, 0.7, 0.45);
const WARN = rgb(0.96, 0.62, 0.04);
const DANGER = rgb(0.9, 0.25, 0.3);
const WHITE = rgb(1, 1, 1);

export type ScannerPdfType = 'plan' | 'analysis' | 'combined';

interface PdfContext {
  page: PDFPage;
  doc: PDFDocument;
  font: PDFFont;
  fontBold: PDFFont;
  y: number;
  pageNum: number;
  lang: 'vi' | 'en';
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 50;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const T = {
  vi: {
    date: 'Ngày',
    clinic: 'Phòng khám',
    owner: 'Chủ phòng khám',
    address: 'Địa chỉ',
    years: 'Số năm',
    staff: 'Nhân sự',
    section1: 'I. ĐIỂM TỔNG HỢP',
    section2: 'II. BẢN SOI CHIẾU HỆ THỐNG',
    section3: 'III. KẾ HOẠCH HÀNH ĐỘNG 30 NGÀY',
    totalLabel: 'TỔNG ĐIỂM',
    siteUrl: 'dentalempireos.com',
    pageLabel: 'Trang',
  },
  en: {
    date: 'Date',
    clinic: 'Clinic',
    owner: 'Owner',
    address: 'Address',
    years: 'Years',
    staff: 'Staff',
    section1: 'I. OVERALL SCORE',
    section2: 'II. SYSTEM ILLUMINATION',
    section3: 'III. 30-DAY ACTION PLAN',
    totalLabel: 'TOTAL SCORE',
    siteUrl: 'dentalempireos.com',
    pageLabel: 'Page',
  },
};

function scoreColor(s: number, rules: ScoringRules) {
  if (s >= rules.thresholds.excellent) return SUCCESS;
  if (s >= rules.thresholds.good) return NAVY;
  if (s >= rules.thresholds.needs_work) return WARN;
  return DANGER;
}

function ensureSpace(ctx: PdfContext, needed: number) {
  if (ctx.y - needed < MARGIN_BOTTOM) addPage(ctx);
}

function addPage(ctx: PdfContext) {
  ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawPageBackground(ctx.page);
  ctx.y = PAGE_HEIGHT - MARGIN_TOP;
  ctx.pageNum++;
  drawHeader(ctx);
  drawFooter(ctx);
}

function drawPageBackground(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: WHITE });
}

function drawHeader(ctx: PdfContext) {
  ctx.page.drawText('Dental Empire OS', {
    x: MARGIN_X, y: PAGE_HEIGHT - 35, size: 9,
    font: ctx.font, color: AMBER,
  });
  ctx.page.drawText('Clinic Management Audit', {
    x: PAGE_WIDTH - MARGIN_X - 130, y: PAGE_HEIGHT - 35, size: 9,
    font: ctx.font, color: MUTED,
  });
  ctx.page.drawLine({
    start: { x: MARGIN_X, y: PAGE_HEIGHT - 45 },
    end: { x: PAGE_WIDTH - MARGIN_X, y: PAGE_HEIGHT - 45 },
    thickness: 0.5, color: LIGHT,
  });
}

function drawFooter(ctx: PdfContext) {
  ctx.page.drawText(`${T[ctx.lang].pageLabel} ${ctx.pageNum}`, {
    x: MARGIN_X, y: 30, size: 8,
    font: ctx.font, color: MUTED,
  });
  ctx.page.drawText(T[ctx.lang].siteUrl, {
    x: PAGE_WIDTH - MARGIN_X - 110, y: 30, size: 8,
    font: ctx.font, color: MUTED,
  });
}

function drawSectionTitle(ctx: PdfContext, title: string) {
  ensureSpace(ctx, 40);
  ctx.page.drawText(title, {
    x: MARGIN_X, y: ctx.y - 18, size: 12,
    font: ctx.fontBold, color: NAVY,
  });
  ctx.page.drawRectangle({
    x: MARGIN_X, y: ctx.y - 22, width: CONTENT_WIDTH, height: 0.8,
    color: AMBER,
  });
  ctx.y -= 32;
}

function drawParagraph(
  ctx: PdfContext,
  text: string,
  opts: { bold?: boolean; size?: number; color?: any; italic?: boolean } = {},
) {
  const font = opts.bold ? ctx.fontBold : ctx.font;
  const size = opts.size ?? 10;
  const color = opts.color ?? TEXT;
  const lineHeight = size * 1.5;
  const lines = wrapText(text, font, size, CONTENT_WIDTH);

  for (const line of lines) {
    ensureSpace(ctx, lineHeight);
    ctx.page.drawText(line, {
      x: MARGIN_X, y: ctx.y - size, size, font, color,
    });
    ctx.y -= lineHeight;
  }
  ctx.y -= 4;
}

function drawBullet(ctx: PdfContext, text: string) {
  const lines = wrapText(text, ctx.font, 10, CONTENT_WIDTH - 15);
  let first = true;
  for (const line of lines) {
    ensureSpace(ctx, 15);
    if (first) {
      ctx.page.drawText('•', {
        x: MARGIN_X + 2, y: ctx.y - 10, size: 10,
        font: ctx.font, color: AMBER,
      });
    }
    ctx.page.drawText(line, {
      x: MARGIN_X + 15, y: ctx.y - 10, size: 10,
      font: ctx.font, color: TEXT,
    });
    ctx.y -= 15;
    first = false;
  }
}

function drawScoreBar(ctx: PdfContext, label: string, score: number, rules: ScoringRules) {
  const barH = 8;
  const barW = CONTENT_WIDTH - 130;
  const x = MARGIN_X + 120;

  ensureSpace(ctx, 30);
  ctx.page.drawText(label, {
    x: MARGIN_X, y: ctx.y - 10, size: 10,
    font: ctx.font, color: TEXT,
  });
  ctx.page.drawText(String(score), {
    x: MARGIN_X + 100, y: ctx.y - 10, size: 10,
    font: ctx.fontBold, color: scoreColor(score, rules),
  });
  ctx.y -= 14;

  ctx.page.drawRectangle({
    x, y: ctx.y - barH, width: barW, height: barH, color: LIGHT,
  });
  const w = Math.max(1, (barW * score) / 100);
  ctx.page.drawRectangle({
    x, y: ctx.y - barH, width: w, height: barH, color: scoreColor(score, rules),
  });
  ctx.y -= 24;
}

interface PdfQuestionRow {
  question_id: string;
  order_idx: number;
  type: string;
  label_vi: string;
  label_en: string;
  scale_labels_vi: string | null;
  scale_labels_en: string | null;
  section_title_vi: string;
  section_title_en: string;
}

function maturityMessage(score: number, lang: 'vi' | 'en'): string {
  if (lang === 'en') {
    if (score < 40) return 'Your clinic is in the early stage - this is a good time to illuminate and deepen.';
    if (score < 70) return 'Your clinic is forming - keep deepening to grow strong.';
    return 'Your clinic is maturing - keep the momentum and spread the value.';
  }
  if (score < 40) return 'Phòng khám đang ở giai đoạn đầu - đây là lúc tốt để soi chiếu và đi sâu.';
  if (score < 70) return 'Phòng khám đang hình thành - tiếp tục đi sâu để lớn mạnh.';
  return 'Phòng khám đang trưởng thành - giữ vững momentum và lan tỏa giá trị.';
}

function drawQuestionInsight(
  ctx: PdfContext,
  question: PdfQuestionRow,
  value: number,
  label: string,
  color: ReturnType<typeof scoreColor>,
) {
  const questionText = ctx.lang === 'vi' ? question.label_vi : question.label_en || question.label_vi;
  const lineHeight = 13;
  const questionLines = wrapText(questionText, ctx.fontBold, 9.5, CONTENT_WIDTH - 155);
  const needed = Math.max(58, questionLines.length * lineHeight + 46);
  ensureSpace(ctx, needed);

  questionLines.forEach((line, index) => {
    ctx.page.drawText(line, { x: MARGIN_X, y: ctx.y - 10 - index * lineHeight, size: 9.5, font: ctx.fontBold, color: TEXT });
  });

  const badge = `${value}/5 - ${label}`;
  const badgeWidth = Math.min(CONTENT_WIDTH, ctx.fontBold.widthOfTextAtSize(badge, 8.5) + 16);
  const badgeLines = wrapText(badge, ctx.fontBold, 8.5, badgeWidth - 16);
  const badgeHeight = Math.max(18, badgeLines.length * 11 + 7);
  const badgeY = ctx.y - questionLines.length * lineHeight - badgeHeight - 2;
  ctx.page.drawRectangle({
    x: MARGIN_X,
    y: badgeY,
    width: badgeWidth,
    height: badgeHeight,
    color,
    opacity: 0.16,
  });
  badgeLines.forEach((line, index) => ctx.page.drawText(line, {
    x: MARGIN_X + 8,
    y: badgeY + badgeHeight - 12 - index * 11,
    size: 8.5,
    font: ctx.fontBold,
    color,
  }));

  const barY = badgeY - 10;
  ctx.page.drawRectangle({ x: MARGIN_X, y: barY - 5, width: CONTENT_WIDTH, height: 5, color: LIGHT });
  ctx.page.drawRectangle({ x: MARGIN_X, y: barY - 5, width: CONTENT_WIDTH * (value / 5), height: 5, color });
  ctx.y = barY - 16;
}

function drawScoreDashboard(
  ctx: PdfContext,
  response: ScannerResponseRow,
  rules: ScoringRules,
  questions: PdfQuestionRow[],
) {
  const scores = parseScores(response.scores_json);
  const total = scores.total ?? 0;
  const totalLevel = getScoreLevel(total, rules, ctx.lang);
  ensureSpace(ctx, 100);

  ctx.page.drawText(ctx.lang === 'vi' ? 'ĐIỂM TỔNG HỢP' : 'OVERALL SCORE', {
    x: MARGIN_X, y: ctx.y - 10, size: 9, font: ctx.fontBold, color: MUTED,
  });
  const scoreText = String(total);
  const scoreSize = 46;
  const scoreY = ctx.y - 66;
  const scoreColorValue = scoreColor(total, rules);
  const scoreWidth = ctx.fontBold.widthOfTextAtSize(scoreText, scoreSize);

  ctx.page.drawText(scoreText, {
    x: MARGIN_X, y: scoreY, size: scoreSize,
    font: ctx.fontBold, color: scoreColorValue,
  });
  ctx.page.drawText('/100', {
    x: MARGIN_X + scoreWidth + 6, y: scoreY + 10, size: 16,
    font: ctx.fontBold, color: TEXT,
  });
  ctx.page.drawText(totalLevel.label_vi, {
    x: MARGIN_X, y: ctx.y - 84, size: 10,
    font: ctx.fontBold, color: scoreColorValue,
  });
  ctx.y -= 102;
  drawParagraph(ctx, maturityMessage(total, ctx.lang), { bold: true, size: 10, color: TEXT });
  ctx.y -= 4;

  for (const dimension of rules.dimensions) {
    const label = ctx.lang === 'vi' ? dimension.name_vi : dimension.name_en ?? dimension.name_vi;
    drawScoreBar(ctx, label ?? dimension.id, scores[dimension.id] ?? 0, rules);
  }

  const answers = parseResponses(response.responses_json);
  const strengths: Array<{ question: PdfQuestionRow; value: number; label: string }> = [];
  const needsWork: Array<{ question: PdfQuestionRow; value: number; label: string }> = [];
  for (const question of questions) {
    const value = answers[question.question_id];
    if (question.type !== 'select' || typeof value !== 'number') continue;
    const labels = parseScaleLabels(ctx.lang === 'vi' ? question.scale_labels_vi : question.scale_labels_en);
    const item = { question, value, label: labels[String(value)] ?? String(value) };
    if (value >= 4) strengths.push(item); else needsWork.push(item);
  }

  if (!strengths.length && !needsWork.length) return;
  drawSectionTitle(ctx, ctx.lang === 'vi' ? 'ĐIỂM NÀY CÓ Ý NGHĨA GÌ?' : 'WHAT DOES THIS SCORE MEAN?');
  if (strengths.length) {
    drawParagraph(ctx, ctx.lang === 'vi' ? 'ĐIỂM MẠNH' : 'STRENGTHS', { bold: true, size: 10, color: SUCCESS });
    for (const item of strengths) drawQuestionInsight(ctx, item.question, item.value, item.label, SUCCESS);
  }
  if (needsWork.length) {
    drawParagraph(ctx, ctx.lang === 'vi' ? 'CẦN CẢI THIỆN' : 'NEEDS IMPROVEMENT', { bold: true, size: 10, color: WARN });
    for (const item of needsWork) drawQuestionInsight(ctx, item.question, item.value, item.label, WARN);
  }
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    if (!para.trim()) { lines.push(''); continue; }
    const words = para.split(/\s+/);
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      try {
        const width = font.widthOfTextAtSize(test, size);
        if (width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = test;
        }
      } catch {
        current += ' ' + word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1');
}

// ── Main export ─────────────────────────────────────────

export async function generateScannerPdf(
  db: D1Database,
  response: ScannerResponseRow,
  identity?: { logo?: Uint8Array; logoType?: 'image/png' | 'image/jpeg'; phone?: string | null },
  type: ScannerPdfType = 'combined',
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // Load full definition
  const definitionRow = await db
    .prepare('SELECT * FROM "survey_definition" WHERE "id" = ?')
    .bind(response.survey_id)
    .first<{ id: string; title_vi: string; title_en: string }>();
  if (!definitionRow) throw new Error('Survey definition not found');

  const scoringRules: ScoringRules = parseScoringRules(
    (await db.prepare('SELECT scoring_rules FROM "survey_definition" WHERE id = ?').bind(response.survey_id).first<{ scoring_rules: string | null }>())?.scoring_rules,
  ) ?? { dimensions: [], total_formula: 'average', thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 } };

  const { results: questions } = await db.prepare(`
    SELECT q.question_id, q.order_idx, q.type, q.label_vi, q.label_en,
           q.scale_labels_vi, q.scale_labels_en, s.title_vi AS section_title_vi,
           s.title_en AS section_title_en
    FROM survey_question q
    JOIN survey_section s ON s.id = q.section_id
    WHERE s.survey_id = ?
    ORDER BY s.order_idx, q.order_idx
  `).bind(response.survey_id).all<PdfQuestionRow>();

  const lang = (response.lang === 'en' ? 'en' : 'vi') as 'vi' | 'en';
  const t = T[lang];

  doc.setTitle(`${definitionRow.title_vi} — ${response.clinic_name ?? ''}`);
  doc.setAuthor('Dental Empire OS');
  doc.setProducer('Dental Empire OS — dentalempireos.com');

  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(new Uint8Array(BE_VIETNAM_PRO_REGULAR));
  const fontBold = await doc.embedFont(new Uint8Array(BE_VIETNAM_PRO_BOLD));

  // ── Cover page ──────────────────────────────────────
  const cover = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  drawPageBackground(cover);

  // Keep clinic logos on a white header so they remain legible regardless of
  // their original colors; reserve navy for the report title only.
  cover.drawRectangle({
    x: 0, y: PAGE_HEIGHT - 230, width: PAGE_WIDTH, height: 160,
    color: NAVY,
  });
  cover.drawRectangle({
    x: 0, y: PAGE_HEIGHT - 235, width: PAGE_WIDTH, height: 5,
    color: AMBER,
  });

  cover.drawText('DENTAL EMPIRE OS', {
    x: 50, y: PAGE_HEIGHT - 43, size: 11,
    font: fontBold, color: NAVY,
  });

  if (identity?.logo) {
    try {
      const logo = identity.logoType === 'image/png'
        ? await doc.embedPng(identity.logo)
        : await doc.embedJpg(identity.logo);
      const scale = Math.min(90 / logo.width, 40 / logo.height, 1);
      cover.drawImage(logo, {
        x: PAGE_WIDTH - 50 - logo.width * scale,
        y: PAGE_HEIGHT - 55,
        width: logo.width * scale,
        height: logo.height * scale,
      });
    } catch {
      // A logo must never prevent a report from being generated.
    }
  }

  const reportTitle = type === 'plan'
    ? t.section2.replace(/^II\.\s*/, '')
    : type === 'analysis'
      ? t.section3.replace(/^III\.\s*/, '')
      : (lang === 'vi' ? definitionRow.title_vi : (definitionRow.title_en || definitionRow.title_vi));
  cover.drawText(reportTitle, {
    x: 50, y: PAGE_HEIGHT - 145, size: 28,
    font: fontBold, color: rgb(1, 1, 1),
  });

  cover.drawText(type === 'combined'
    ? (lang === 'vi' ? 'Báo cáo phân tích hệ thống quản trị' : 'Clinic management analysis report')
    : (lang === 'vi' ? 'Tài liệu hành động dành cho phòng khám' : 'Clinic action document'), {
    x: 50, y: PAGE_HEIGHT - 170, size: 12,
    font, color: rgb(0.85, 0.85, 0.9),
  });

  let infoY = PAGE_HEIGHT - 280;
  cover.drawText(t.clinic, { x: 50, y: infoY, size: 10, font, color: MUTED });
  cover.drawText(response.clinic_name ?? '—', { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });
  infoY -= 22;

  if (response.owner_name) {
    cover.drawText(t.owner, { x: 50, y: infoY, size: 10, font, color: MUTED });
    cover.drawText(response.owner_name, { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });
    infoY -= 22;
  }
  if (response.clinic_address) {
    cover.drawText(t.address, { x: 50, y: infoY, size: 10, font, color: MUTED });
    cover.drawText(response.clinic_address, { x: 200, y: infoY, size: 11, font, color: TEXT });
    infoY -= 22;
  }
  if (response.years_in_operation !== null) {
    cover.drawText(t.years, { x: 50, y: infoY, size: 10, font, color: MUTED });
    cover.drawText(String(response.years_in_operation), { x: 200, y: infoY, size: 11, font, color: TEXT });
    infoY -= 22;
  }
  if (response.staff_count !== null) {
    cover.drawText(t.staff, { x: 50, y: infoY, size: 10, font, color: MUTED });
    cover.drawText(String(response.staff_count), { x: 200, y: infoY, size: 11, font, color: TEXT });
    infoY -= 22;
  }
  if (identity?.phone) {
    cover.drawText(lang === 'vi' ? 'Điện thoại' : 'Phone', { x: 50, y: infoY, size: 10, font, color: MUTED });
    cover.drawText(identity.phone, { x: 200, y: infoY, size: 11, font, color: TEXT });
    infoY -= 22;
  }

  cover.drawText(t.date, { x: 50, y: infoY, size: 10, font, color: MUTED });
  cover.drawText(response.created_at.slice(0, 10), { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });

  cover.drawText(`Generated by Dental Empire OS · ${t.siteUrl}`, {
    x: 50, y: 50, size: 9, font, color: MUTED,
  });

  // ── Report content ─────────────────────────────────
  // The summary page also begins the report. A standalone cover previously
  // left most of page one empty and made every export feel one page longer.
  const ctx: PdfContext = {
    page: cover,
    doc, font, fontBold,
    // The dashboard is the single source of the overall score. Start it below
    // the cover details instead of rendering a duplicate score on the cover.
    y: type === 'combined' ? infoY - 32 : 480,
    pageNum: 1,
    lang,
  };

  if (type === 'combined' || type === 'plan') {
    drawScoreDashboard(ctx, response, scoringRules, questions ?? []);
    ctx.y -= 8;
  }

  if (type === 'combined' || type === 'analysis') {
    drawSectionTitle(ctx, type === 'combined' ? t.section2 : reportTitle);
    if (response.ai_analysis) {
      renderMarkdownToPdf(ctx, response.ai_analysis);
    } else {
      drawParagraph(ctx, lang === 'vi'
        ? 'Bản phân tích AI đang được tạo. Vui lòng tải lại sau vài phút.'
        : 'The AI analysis is being generated. Please download the report again in a few minutes.', { color: MUTED });
    }
  }

  if (type === 'combined' || type === 'plan') {
    drawSectionTitle(ctx, type === 'combined' ? t.section3 : reportTitle);
    if (response.ai_plan) {
      renderMarkdownToPdf(ctx, response.ai_plan);
    } else {
      drawParagraph(ctx, lang === 'vi'
        ? 'Kế hoạch 30 ngày đang được tạo. Vui lòng tải lại sau vài phút.'
        : 'The 30-day action plan is being generated. Please download the report again in a few minutes.', { color: MUTED });
    }
  }

  return doc.save();
}

function renderMarkdownToPdf(ctx: PdfContext, markdown: string) {
  marked.setOptions({ gfm: true, breaks: true });
  const tokens = marked.lexer(markdown);

  for (const tok of tokens) {
    if (tok.type === 'heading') {
      ctx.y -= 6;
      const text = tok.text.replace(/[*_`#]/g, '');
      const level = tok.depth ?? 1;
      const size = level === 1 ? 13 : level === 2 ? 11.5 : 10.5;
      drawParagraph(ctx, text, { bold: true, size, color: NAVY });
      ctx.y -= 4;
    } else if (tok.type === 'paragraph') {
      drawParagraph(ctx, stripMarkdown(tokenText(tok)));
    } else if (tok.type === 'list') {
      for (const item of tok.items) {
        drawBullet(ctx, stripMarkdown(tokenText(item)));
      }
      ctx.y -= 4;
    } else if (tok.type === 'hr') {
      ctx.y -= 4;
      ensureSpace(ctx, 10);
      ctx.page.drawLine({
        start: { x: MARGIN_X, y: ctx.y - 4 },
        end: { x: PAGE_WIDTH - MARGIN_X, y: ctx.y - 4 },
        thickness: 0.5, color: LIGHT,
      });
      ctx.y -= 10;
    } else if (tok.type === 'blockquote') {
      const text = tokenText(tok);
      ensureSpace(ctx, 20);
      ctx.page.drawRectangle({
        x: MARGIN_X, y: ctx.y - 14, width: 2, height: 14, color: AMBER,
      });
      const lines = wrapText(text, ctx.font, 10, CONTENT_WIDTH - 12);
      for (const line of lines) {
        ensureSpace(ctx, 15);
        ctx.page.drawText(line, {
          x: MARGIN_X + 10, y: ctx.y - 10, size: 10,
          font: ctx.font, color: MUTED,
        });
        ctx.y -= 15;
      }
      ctx.y -= 4;
    } else if (tok.type === 'table') {
      const rows = [tok.header, ...(tok.rows ?? [])] as Array<Array<{ text?: string }>>;
      for (const row of rows) {
        drawParagraph(ctx, row.map((cell) => stripMarkdown(cell.text ?? '')).join(' | '), {
          bold: row === tok.header,
          size: 9,
        });
      }
    } else {
      // Preserve any Markdown construct not styled above instead of silently
      // dropping it from a downloadable report.
      const text = tokenText(tok);
      if (text.trim()) drawParagraph(ctx, stripMarkdown(text));
    }
  }
}

function tokenText(token: any): string {
  if (typeof token.text === 'string' && token.text.trim()) return token.text;
  if (typeof token.raw === 'string' && token.raw.trim()) return token.raw;
  if (Array.isArray(token.tokens)) return token.tokens.map(tokenText).join(' ');
  if (Array.isArray(token.items)) return token.items.map(tokenText).join(' ');
  return '';
}
