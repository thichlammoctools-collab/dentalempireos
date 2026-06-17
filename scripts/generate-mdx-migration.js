// scripts/generate-mdx-migration.js
// Reads MDX files from src/content/book/ and generates SQL INSERTs for D1.
// Run: node scripts/generate-mdx-migration.js > migrations/seed-books.sql
// Then apply: wrangler d1 execute DB --file=migrations/seed-books.sql

import { readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const BASE = 'src/content/book';
const tiers = readdirSync(BASE).filter(d => d.startsWith('tier'));

let sql = `-- Auto-generated seed from MDX files\n-- Run: wrangler d1 execute DB --file=migrations/seed-books.sql\n\n`;

const chapterIds = [];

for (const tierDir of tiers) {
  const dir = join(BASE, tierDir);
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf-8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) continue;

    const fm = parseFrontmatter(match[1]);
    const content = match[2];

    const chapterId = fm.slug || fm.id || file.replace('.mdx', '');
    chapterIds.push(chapterId);
    const ts = new Date().toISOString();

    // Insert chapter
    sql += insert('chapter', {
      id: chapterId,
      tier: fm.tier,
      chapter_no: fm.chapter,
      title: fm.title,
      description: fm.description ?? null,
      order: fm.order ?? fm.chapter,
      status: fm.draft ? 'draft' : 'published',
      createdAt: ts,
      updatedAt: ts,
    });

    // Parse content into sections by heading level
    const blocks = parseContent(content);

    let sectionOrder = 0;
    let currentSectionId = null;
    const parentMap = {}; // heading text -> section id for h2->h3 nesting

    for (const block of blocks) {
      if (block.type === 'heading') {
        const level = block.level;
        const title = block.text;
        const slug = toSlug(title);
        const sectionId = crypto.randomUUID();

        if (level === 2) {
          currentSectionId = sectionId;
          sql += insert('section', {
            id: sectionId,
            chapter_id: chapterId,
            parent_id: null,
            level: 2,
            title,
            slug,
            order: sectionOrder++,
          });
        } else if (level === 3 && currentSectionId) {
          sql += insert('section', {
            id: sectionId,
            chapter_id: chapterId,
            parent_id: currentSectionId,
            level: 3,
            title,
            slug,
            order: sectionOrder++,
          });
        }
      } else if (block.type === 'text' && block.text.trim() && currentSectionId) {
        const blockId = crypto.randomUUID();
        sql += insert('block', {
          id: blockId,
          section_id: currentSectionId,
          order: sectionOrder++,
          type: 'text',
          text_md: block.text.trim(),
          r2_key: null,
          filename: null,
          mime: null,
          alt: null,
          caption: null,
        });
      }
    }
    sql += '\n';
  }
}

// Print summary
console.error(`Generated INSERTs for ${chapterIds.length} chapters: ${chapterIds.join(', ')}`);

function parseFrontmatter(yaml) {
  const result = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^(\w+):\s*"?([^"]*)"?$/);
    if (m) {
      let val = m[2].trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (/^\d+$/.test(val)) val = Number(val);
      result[m[1]] = val;
    }
  }
  return result;
}

function parseContent(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let textBuffer = [];

  function flushText() {
    if (textBuffer.length > 0) {
      const text = textBuffer.join('\n').trim();
      if (text) {
        blocks.push({ type: 'text', text });
      }
      textBuffer = [];
    }
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch && headingMatch[1].length <= 3) {
      // Skip h1 (#)
      if (headingMatch[1].length === 1) {
        textBuffer.push(line);
        continue;
      }
      flushText();
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
    } else {
      // Strip MDX imports (lines starting with import)
      if (line.match(/^import\s/)) continue;
      // Strip Callout components, keep their text
      const calloutMatch = line.match(/^<Callout[^>]*>/);
      if (calloutMatch) continue;
      if (line.match(/^<\/Callout>/)) continue;
      // Keep other lines
      textBuffer.push(line);
    }
  }
  flushText();
  return blocks;
}

function insert(table, obj) {
  const cols = Object.keys(obj);
  const vals = cols.map(c => escape(obj[c]));
  return `INSERT OR IGNORE INTO "${table}" ("${cols.join('","')}") VALUES (${vals.join(',')});\n`;
}

function escape(val) {
  if (val === null) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? '1' : '0';
  // SQLite string escaping
  return `'${String(val).replace(/'/g, "''")}'`;
}

function toSlug(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

process.stdout.write(sql);
