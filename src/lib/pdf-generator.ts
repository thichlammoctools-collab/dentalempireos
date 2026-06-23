// PDF Generator for the Hồ Sơ Gốc Rễ Survey
// Uses pdf-lib (Workers-compatible) to render a structured report.
// Font: Be Vietnam Pro (embedded, full Vietnamese support).

import { PDFDocument, rgb, PDFPage, PDFFont } from 'pdf-lib';
import { marked } from 'marked';
import type { SurveyResponseRow } from './survey-db';
import { BE_VIETNAM_PRO_REGULAR, BE_VIETNAM_PRO_BOLD } from './fonts/bvn-fonts';

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

const PAGE_WIDTH = 595.28;   // A4
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 50;
const MARGIN_TOP = 60;
const MARGIN_BOTTOM = 60;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const T = {
  vi: {
    coverTitle: 'HỒ SƠ GỐC RỄ',
    coverSubtitle: 'Bản soi chiếu hệ thống quản trị phòng khám',
    date: 'Ngày',
    clinic: 'Phòng khám',
    owner: 'Chủ phòng khám',
    section1: 'I. ĐIỂM TỔNG HỢP',
    section2: 'II. CHI TIẾT 4 CHIỀU',
    section3: 'III. PHÂN TÍCH TỪ BS. VINH',
    label: {
      roots: 'ROOTS — Bản sắc & Giá trị cốt lõi',
      sky: 'SKY — Trục đạo đức',
      stars: 'S.T.A.R.S — Bản đồ năng lực',
      living: 'Hệ thống sống',
    },
  },
  en: {
    coverTitle: 'ROOTS PROFILE',
    coverSubtitle: 'Clinic Management System Illumination',
    date: 'Date',
    clinic: 'Clinic',
    owner: 'Owner',
    section1: 'I. OVERALL SCORE',
    section2: 'II. FOUR DIMENSIONS IN DETAIL',
    section3: 'III. ANALYSIS FROM DR. VINH',
    label: {
      roots: 'ROOTS — Identity & Core Values',
      sky: 'SKY — Ethical Pillar',
      stars: 'S.T.A.R.S — Capability Map',
      living: 'Living System',
    },
  },
};

function scoreColor(s: number) {
  if (s >= 75) return SUCCESS;
  if (s >= 55) return NAVY;
  if (s >= 35) return WARN;
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
  ctx.page.drawText(T[ctx.lang].coverSubtitle, {
    x: PAGE_WIDTH - MARGIN_X - 200, y: PAGE_HEIGHT - 35, size: 9,
    font: ctx.font, color: MUTED,
  });
  ctx.page.drawLine({
    start: { x: MARGIN_X, y: PAGE_HEIGHT - 45 },
    end: { x: PAGE_WIDTH - MARGIN_X, y: PAGE_HEIGHT - 45 },
    thickness: 0.5, color: LIGHT,
  });
}

function drawFooter(ctx: PdfContext) {
  ctx.page.drawText(`Trang ${ctx.pageNum}`, {
    x: MARGIN_X, y: 30, size: 8,
    font: ctx.font, color: MUTED,
  });
  ctx.page.drawText('dentalempireos.com', {
    x: PAGE_WIDTH - MARGIN_X - 90, y: 30, size: 8,
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
  opts: { bold?: boolean; size?: number; color?: any } = {},
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

function drawScoreBar(ctx: PdfContext, label: string, score: number) {
  const barH = 8;
  const barW = CONTENT_WIDTH - 110;
  const x = MARGIN_X + 100;

  ensureSpace(ctx, 30);
  ctx.page.drawText(label, {
    x: MARGIN_X, y: ctx.y - 10, size: 10,
    font: ctx.font, color: TEXT,
  });
  ctx.page.drawText(String(score), {
    x: MARGIN_X + 80, y: ctx.y - 10, size: 10,
    font: ctx.fontBold, color: scoreColor(score),
  });
  ctx.y -= 14;

  // Track
  ctx.page.drawRectangle({
    x, y: ctx.y - barH, width: barW, height: barH, color: LIGHT,
  });
  // Fill
  const w = Math.max(1, (barW * score) / 100);
  ctx.page.drawRectangle({
    x, y: ctx.y - barH, width: w, height: barH, color: scoreColor(score),
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
        // Fallback: just append (some chars may not have glyphs, but we try anyway)
        current += ' ' + word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

// ── Main export ──────────────────────────────────────────

export async function generateSurveyPdf(row: SurveyResponseRow): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Hồ Sơ Gốc Rễ — ${row.clinic_name ?? ''}`);
  doc.setAuthor('Dental Empire OS');
  doc.setSubject('Roots Profile Survey Report');
  doc.setProducer('Dental Empire OS — dentalempireos.com');

  // Embed Unicode fonts (Be Vietnam Pro — supports Vietnamese fully)
  const font = await doc.embedFont(new Uint8Array(BE_VIETNAM_PRO_REGULAR));
  const fontBold = await doc.embedFont(new Uint8Array(BE_VIETNAM_PRO_BOLD));

  const lang = row.lang === 'en' ? 'en' : 'vi';
  const t = T[lang];

  // ── Cover page ──────────────────────────────────────
  const cover = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  // Background band
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

  cover.drawText(t.coverTitle, {
    x: 50, y: PAGE_HEIGHT - 130, size: 32,
    font: fontBold, color: rgb(1, 1, 1),
  });

  cover.drawText(t.coverSubtitle, {
    x: 50, y: PAGE_HEIGHT - 155, size: 12,
    font, color: rgb(0.85, 0.85, 0.9),
  });

  // Info box
  let infoY = PAGE_HEIGHT - 280;
  cover.drawText(t.clinic, { x: 50, y: infoY, size: 10, font, color: MUTED });
  cover.drawText(row.clinic_name ?? '—', { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });
  infoY -= 22;

  if (row.owner_name) {
    cover.drawText(t.owner, { x: 50, y: infoY, size: 10, font, color: MUTED });
    cover.drawText(row.owner_name, { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });
    infoY -= 22;
  }

  cover.drawText(t.date, { x: 50, y: infoY, size: 10, font, color: MUTED });
  cover.drawText(row.created_at, { x: 200, y: infoY, size: 11, font: fontBold, color: TEXT });

  // Big score
  const total = row.score_total ?? 0;
  cover.drawText('TOTAL', { x: 50, y: 240, size: 10, font, color: MUTED });
  cover.drawText(String(total), { x: 50, y: 170, size: 90, font: fontBold, color: scoreColor(total) });
  cover.drawText('/100', { x: 180, y: 200, size: 22, font, color: MUTED });

  cover.drawText('Generated by Dental Empire OS · dentalempireos.com', {
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

  // Section 1: Overall score
  drawSectionTitle(ctx, t.section1);
  drawScoreBar(ctx, t.label.roots, row.score_roots ?? 0);
  drawScoreBar(ctx, t.label.sky, row.score_sky ?? 0);
  drawScoreBar(ctx, t.label.stars, row.score_stars ?? 0);
  drawScoreBar(ctx, t.label.living, row.score_living ?? 0);
  ctx.y -= 8;

  // Section 2: Detailed dimensions
  drawSectionTitle(ctx, t.section2);

  drawParagraph(ctx, `${t.label.roots} (${row.score_roots ?? 0}/100)`, { bold: true, size: 11, color: NAVY });
  drawParagraph(ctx, row.roots_q2 || row.roots_q1 || '—', { bold: false });
  ctx.y -= 4;

  drawParagraph(ctx, `${t.label.sky} (${row.score_sky ?? 0}/100)`, { bold: true, size: 11, color: NAVY });
  if (row.sky_sin_open) drawParagraph(ctx, `Sincerity: ${row.sky_sin_open}`);
  if (row.sky_k_open) drawParagraph(ctx, `Kindness: ${row.sky_k_open}`);
  if (row.sky_y_open) drawParagraph(ctx, `Yielding: ${row.sky_y_open}`);
  ctx.y -= 4;

  drawParagraph(ctx, `${t.label.stars} (${row.score_stars ?? 0}/100)`, { bold: true, size: 11, color: NAVY });
  if (row.stars_t_open) drawParagraph(ctx, `Traits: ${row.stars_t_open}`);
  if (row.stars_a_open) drawParagraph(ctx, `Actions: ${row.stars_a_open}`);
  ctx.y -= 4;

  drawParagraph(ctx, `${t.label.living} (${row.score_living ?? 0}/100)`, { bold: true, size: 11, color: NAVY });
  if (row.living_o1) drawParagraph(ctx, row.living_o1);
  ctx.y -= 8;

  // Section 3: AI analysis
  drawSectionTitle(ctx, t.section3);

  if (row.ai_analysis) {
    renderMarkdownToPdf(ctx, row.ai_analysis);
  } else {
    drawParagraph(ctx, 'Bản phân tích AI đang được tạo. Vui lòng tải lại trang sau vài phút.', { bold: false, color: MUTED });
  }

  return doc.save();
}

/** Render AI markdown into the PDF */
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
      const text = tok.tokens
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

function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/(?<!\*)\*([^\*]+)\*(?!\*)/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1');
}
