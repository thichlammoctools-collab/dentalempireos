// Generic PDF generator for scanner responses.
// Reads dimension names from survey_definition.scoring_rules + responses from scanner_response.
// Replaces the hardcoded generateSurveyPdf() in pdf-generator.ts.

import { PDFDocument, rgb, PDFPage, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { marked } from 'marked';
import {
  type ScannerResponseRow,
  parseResponses,
  parseScores,
} from './scanner-response-db';
import {
  type SurveyDefinitionFull,
  type ScoringRules,
  parseScoringRules,
  parseJSON,
} from './survey-config-db';
import { BE_VIETNAM_PRO_REGULAR, BE_VIETNAM_PRO_BOLD } from './fonts/bvn-fonts';
import { getScoreLevel } from './scoring-engine';

const NAVY = rgb(0.13, 0.27, 0.55);
const AMBER = rgb(0.96, 0.62, 0.04);
const TEXT = rgb(0.15, 0.15, 0.18);
const MUTED = rgb(0.45, 0.45, 0.5);
const LIGHT = rgb(0.92, 0.92, 0.94);
const SUCCESS = rgb(0.06, 0.7, 0.45);
const WARN = rgb(0.96, 0.62, 0.04);
const DANGER = rgb(0.9, 0.25, 0.3);

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
    section2: 'II. CHI TIẾT CÂU TRẢ LỜI',
    section3: 'III. PHÂN TÍCH AI',
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
    section2: 'II. ANSWERS IN DETAIL',
    section3: 'III. AI ANALYSIS',
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
  ctx.y = PAGE_HEIGHT - MARGIN_TOP;
  ctx.pageNum++;
  drawHeader(ctx);
  drawFooter(ctx);
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
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // Load full definition
  const definitionRow = await db
    .prepare('SELECT * FROM "survey_definition" WHERE "id" = ?')
    .bind(response.survey_id)
    .first<{ id: string; title_vi: string; title_en: string }>();
  if (!definitionRow) throw new Error('Survey definition not found');

  const sectionsResult = await db
    .prepare(
      `SELECT s.*, q.* FROM "survey_section" s
       LEFT JOIN "survey_question" q ON q."section_id" = s."id"
       WHERE s."survey_id" = ?
       ORDER BY s."order_idx" ASC, q."order_idx" ASC`,
    )
    .bind(response.survey_id)
    .all<any>();

  const sectionsMap = new Map<number, { section: any; questions: any[] }>();
  for (const row of sectionsResult.results ?? []) {
    if (!sectionsMap.has(row.id)) {
      sectionsMap.set(row.id, { section: row, questions: [] });
    }
    const entry = sectionsMap.get(row.id)!;
    if (row.question_id) {
      entry.questions.push(row);
    }
  }

  const sections = Array.from(sectionsMap.values()).map((e) => ({
    ...e.section,
    questions: e.questions,
  }));

  const scoringRules: ScoringRules = parseScoringRules(
    (await db.prepare('SELECT scoring_rules FROM "survey_definition" WHERE id = ?').bind(response.survey_id).first<{ scoring_rules: string | null }>())?.scoring_rules,
  ) ?? { dimensions: [], total_formula: 'average', thresholds: { excellent: 75, good: 55, needs_work: 35, critical: 0 } };

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

  cover.drawText(lang === 'vi' ? definitionRow.title_vi : (definitionRow.title_en || definitionRow.title_vi), {
    x: 50, y: PAGE_HEIGHT - 130, size: 28,
    font: fontBold, color: rgb(1, 1, 1),
  });

  cover.drawText('Báo cáo phân tích hệ thống quản trị', {
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

  cover.drawText(t.date, { x: 50, y: infoY, size: 10, font, color: MUTED });
  cover.drawText(response.created_at.slice(0, 10), { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });

  const total = parseScores(response.scores_json).total ?? 0;
  cover.drawText(t.totalLabel, { x: 50, y: 240, size: 10, font, color: MUTED });
  cover.drawText(String(total), { x: 50, y: 170, size: 90, font: fontBold, color: scoreColor(total, scoringRules) });
  cover.drawText('/100', { x: 180, y: 200, size: 22, font, color: MUTED });

  cover.drawText(`Generated by Dental Empire OS · ${t.siteUrl}`, {
    x: 50, y: 50, size: 9, font, color: MUTED,
  });

  // ── Content pages ──────────────────────────────────
  const ctx: PdfContext = {
    page: doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    doc, font, fontBold,
    y: PAGE_HEIGHT - MARGIN_TOP,
    pageNum: 1,
    lang,
  };
  drawHeader(ctx);
  drawFooter(ctx);

  // Section 1: Overall scores
  drawSectionTitle(ctx, t.section1);
  for (const dim of scoringRules.dimensions) {
    const score = parseScores(response.scores_json)[dim.id] ?? 0;
    const label = lang === 'vi' ? dim.name_vi : (dim.name_en ?? dim.name_vi);
    drawScoreBar(ctx, label, score, scoringRules);
  }
  ctx.y -= 8;

  // Section 2: Detailed answers (highlight scoring dimensions first)
  drawSectionTitle(ctx, t.section2);

  const responses = parseResponses(response.responses_json);

  for (const section of sections) {
    if (section.questions.length === 0) continue;
    drawParagraph(ctx, section.title_vi, { bold: true, size: 11, color: NAVY });
    ctx.y -= 4;

    for (const q of section.questions) {
      const val = responses[q.question_id];
      const questionText = lang === 'vi' ? q.label_vi : (q.label_en || q.label_vi);
      drawParagraph(ctx, `${questionText}`, { bold: false, size: 9, color: MUTED });

      let answerText: string;
      if (val === undefined || val === null || val === '') {
        answerText = '—';
      } else if (q.type === 'select' || q.type === 'yesno') {
        const labels = parseJSON<Record<string, string> | null>(q.scale_labels_vi, null);
        const label = labels?.[String(val)] ?? String(val);
        answerText = `${val} — ${label}`;
      } else if (q.type === 'radio') {
        answerText = String(val);
      } else {
        answerText = String(val);
      }

      drawParagraph(ctx, answerText, { bold: false, size: 9 });
      ctx.y -= 2;
    }
    ctx.y -= 6;
  }

  // Section 3: AI analysis
  if (response.ai_analysis) {
    drawSectionTitle(ctx, t.section3);
    renderMarkdownToPdf(ctx, response.ai_analysis);
  } else {
    drawSectionTitle(ctx, t.section3);
    drawParagraph(ctx, 'Bản phân tích AI đang được tạo. Vui lòng tải lại sau vài phút.', { color: MUTED });
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
      const text = (tok.tokens ?? [])
        .filter((t: any) => t.type === 'text')
        .map((t: any) => t.raw ?? t.text ?? '')
        .join('');
      drawParagraph(ctx, stripMarkdown(text));
    } else if (tok.type === 'list') {
      for (const item of tok.items) {
        const text = item.tokens
          .filter((t: any) => t.type === 'text' || t.type === 'paragraph')
          .map((t: any) => t.text ?? t.raw ?? '')
          .join(' ');
        drawBullet(ctx, stripMarkdown(text));
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
      const text = (tok.tokens ?? [])
        .filter((t: any) => t.type === 'text' || t.type === 'paragraph')
        .map((t: any) => t.text ?? t.raw ?? '')
        .join(' ');
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
    }
  }
}