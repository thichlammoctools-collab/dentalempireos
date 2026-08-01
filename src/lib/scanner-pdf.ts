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
    section2: 'II. KẾ HOẠCH HÀNH ĐỘNG 30 NGÀY',
    section3: 'III. BẢN SOI CHIẾU HỆ THỐNG',
    section4: 'IV. CHI TIẾT TỰ SOI CHIẾU',
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
    section2: 'II. 30-DAY ACTION PLAN',
    section3: 'III. SYSTEM ILLUMINATION',
    section4: 'IV. SELF-ASSESSMENT DETAILS',
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

function drawResponseDetails(ctx: PdfContext, response: ScannerResponseRow, questions: PdfQuestionRow[]) {
  const answers = parseResponses(response.responses_json);
  let activeSection = '';

  for (const question of questions) {
    const answer = answers[question.question_id];
    if (answer === undefined || answer === null || answer === '') continue;

    const sectionTitle = ctx.lang === 'vi' ? question.section_title_vi : question.section_title_en || question.section_title_vi;
    if (sectionTitle !== activeSection) {
      activeSection = sectionTitle;
      drawParagraph(ctx, sectionTitle, { bold: true, size: 11, color: NAVY });
    }

    const questionText = ctx.lang === 'vi' ? question.label_vi : question.label_en || question.label_vi;
    drawParagraph(ctx, questionText, { bold: true, size: 9.5, color: TEXT });

    let answerText = String(answer);
    if (question.type === 'select' || question.type === 'yesno') {
      const labels = parseScaleLabels(ctx.lang === 'vi' ? question.scale_labels_vi : question.scale_labels_en);
      answerText = `${answer}/5${labels[String(answer)] ? ` - ${labels[String(answer)]}` : ''}`;
    }
    drawParagraph(ctx, answerText, { size: 9.5, color: MUTED });
    ctx.y -= 5;
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

  cover.drawRectangle({
    x: 0, y: PAGE_HEIGHT - 200, width: PAGE_WIDTH, height: 200,
    color: NAVY,
  });
  cover.drawRectangle({
    x: 0, y: PAGE_HEIGHT - 205, width: PAGE_WIDTH, height: 5,
    color: AMBER,
  });

  cover.drawText('DENTAL EMPIRE OS', {
    x: 50, y: PAGE_HEIGHT - 70, size: 11,
    font: fontBold, color: AMBER,
  });

  if (identity?.logo) {
    try {
      const logo = identity.logoType === 'image/png'
        ? await doc.embedPng(identity.logo)
        : await doc.embedJpg(identity.logo);
      const scale = Math.min(90 / logo.width, 54 / logo.height, 1);
      cover.drawImage(logo, {
        x: PAGE_WIDTH - 50 - logo.width * scale,
        y: PAGE_HEIGHT - 102,
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
    x: 50, y: PAGE_HEIGHT - 130, size: 28,
    font: fontBold, color: rgb(1, 1, 1),
  });

  cover.drawText(type === 'combined'
    ? (lang === 'vi' ? 'Báo cáo phân tích hệ thống quản trị' : 'Clinic management analysis report')
    : (lang === 'vi' ? 'Tài liệu hành động dành cho phòng khám' : 'Clinic action document'), {
    x: 50, y: PAGE_HEIGHT - 155, size: 12,
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

  if (type === 'combined') {
    const total = parseScores(response.scores_json).total ?? 0;
    cover.drawText(t.totalLabel, { x: 50, y: 410, size: 10, font, color: MUTED });
    cover.drawText(String(total), { x: 50, y: 345, size: 72, font: fontBold, color: scoreColor(total, scoringRules) });
    cover.drawText('/100', { x: 160, y: 370, size: 20, font, color: MUTED });
  }

  cover.drawText(`Generated by Dental Empire OS · ${t.siteUrl}`, {
    x: 50, y: 50, size: 9, font, color: MUTED,
  });

  // ── Report content ─────────────────────────────────
  // The summary page also begins the report. A standalone cover previously
  // left most of page one empty and made every export feel one page longer.
  const ctx: PdfContext = {
    page: cover,
    doc, font, fontBold,
    y: type === 'combined' ? 315 : 430,
    pageNum: 1,
    lang,
  };

  if (type === 'combined') {
    drawSectionTitle(ctx, t.section1);
    for (const dim of scoringRules.dimensions) {
      const score = parseScores(response.scores_json)[dim.id] ?? 0;
      const label = lang === 'vi' ? dim.name_vi : (dim.name_en ?? dim.name_vi);
      drawScoreBar(ctx, label, score, scoringRules);
    }
    ctx.y -= 8;
  }

  if (type === 'combined' || type === 'plan') {
    drawSectionTitle(ctx, type === 'combined' ? t.section2 : reportTitle);
    if (response.ai_plan) {
      renderMarkdownToPdf(ctx, response.ai_plan);
    } else {
      drawParagraph(ctx, lang === 'vi'
        ? 'Kế hoạch 30 ngày đang được tạo. Vui lòng tải lại sau vài phút.'
        : 'The 30-day action plan is being generated. Please download the report again in a few minutes.', { color: MUTED });
    }
  }

  if (type === 'combined' || type === 'analysis') {
    drawSectionTitle(ctx, type === 'combined' ? t.section3 : reportTitle);
    if (response.ai_analysis) {
      renderMarkdownToPdf(ctx, response.ai_analysis);
    } else {
      drawParagraph(ctx, lang === 'vi'
        ? 'Bản phân tích AI đang được tạo. Vui lòng tải lại sau vài phút.'
        : 'The AI analysis is being generated. Please download the report again in a few minutes.', { color: MUTED });
    }
  }

  // Score bars summarize the result; the answers below provide the full audit
  // trail required to review the assessment and assign 30-day actions.
  if (questions?.length) {
    drawSectionTitle(ctx, type === 'plan' ? t.section3 : t.section4);
    drawResponseDetails(ctx, response, questions);
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
