import type { APIRoute } from 'astro';
import { json, badRequest } from '../../../lib/api-helpers';

export const prerender = false;

// ── Domain-specific terms to bold ──────────────────────────────
const BOLD_TERMS = [
  'Patient Experience',
  'Referral',
  'Testimonial',
  'CRM',
  'Dental Empire OS',
  'R\\.O\\.A\\.D\\.M\\.A\\.P',
  'S\\.T\\.A\\.R\\.S',
  'TO BE SKY',
  'SKY',
  'ROOTS',
  'ONE LIGHT',
  'AWAKEN',
  'DEEPEN',
  'MATURE',
  'ALIGN',
  'PROSPER',
  'Skills',
  'Traits',
  'Actions',
  'Results',
  'Synergy',
  'Sincerity',
  'Kindness',
  'Yielding',
  'KPI',
  'Onboarding',
  'Mentoring',
  'Self\\-audit',
  'Role mapping',
  'Monthly review',
];

// ── Core beautify function ─────────────────────────────────────
export function beautifyMarkdown(text: string): string {
  let t = text;

  // 1. Clean escaped characters
  t = t.replace(/\\([.\-()])/g, '$1');
  t = t.replace(/\\"/g, '"');
  t = t.replace(/\\\n/g, '\n');
  // Trailing backslash on its own line
  t = t.replace(/\\{2,}\s*$/gm, '');

  // 2. Normalize whitespace
  t = t.replace(/[ \t]+$/gm, '');                         // trailing spaces
  t = t.replace(/\n{3,}/g, '\n\n');                        // 3+ newlines → 2

  // 3. Blockquote for "Lưu note" patterns
  t = t.replace(/^(Lưu ý\s*:\s*)\n/gm, '> **Lưu ý:**\n\n');
  // Multi-line "Lưu note" block — wrap following lines until blank line
  t = t.replace(
    /^(> \*\*Lưu ý:\*\*)\n((?:.+\n?)+?)(?=\n\n|\n(?=\S)|$)/gm,
    (_match, head, body) => {
      const lines = body.trimEnd().split('\n').map((l: string) => `> ${l}`).join('\n');
      return `${head}\n${lines}`;
    }
  );

  // 4. Fix bullet points — lines starting with "- " should have proper spacing
  // Convert "- Con người..." list items to proper markdown list
  t = t.replace(/(?:^|\n)(- [^\n]+(?:\n(?!\n)[^\n]+)*)/gm, (_match, list) => {
    // Ensure each line starts with "- "
    return '\n' + list.split('\n').map((l: string) => {
      const trimmed = l.trim();
      if (trimmed.startsWith('- ')) return trimmed;
      return `- ${trimmed}`;
    }).join('\n') + '\n';
  });

  // 5. Numbered lists — normalize "1. " "2. " patterns
  t = t.replace(/(?:^|\n)((?:\d+\.\s+[^\n]+(?:\n(?!\n)[^\n]+)*)+)/gm, (_match, list) => {
    let idx = 0;
    return '\n' + list.split('\n').map((l: string) => {
      const trimmed = l.trim();
      if (/^\d+\.\s/.test(trimmed)) {
        idx++;
        return `${idx}. ${trimmed.replace(/^\d+\.\s*/, '')}`;
      }
      return trimmed;
    }).join('\n') + '\n';
  });

  // 6. Bold domain-specific terms (only if not already bold)
  for (const term of BOLD_TERMS) {
    const raw = term.replace(/\\\./g, '\\.').replace(/\\-/g, '\\-');
    const regex = new RegExp(`(?<!\\*\\*)\\b${raw}\\b(?!\\*\\*)`, 'g');
    t = t.replace(regex, `**${term.replace(/\\/g, '')}**`);
  }

  // 7. Split very long paragraphs at sentence boundaries
  t = t.replace(/^(?![->|#\d*])(.{350,})$/gm, (_match, paragraph: string) => {
    // Don't split if already formatted (bold-heavy, or list-like)
    if ((paragraph.match(/\*\*/g) || []).length > 6) return paragraph;
    // Split at sentence boundary (period + space + uppercase) — every 2-3 sentences
    const sentences = paragraph.match(/[^.!?]+[.!?]+\s*/g) || [paragraph];
    if (sentences.length < 3) return paragraph;
    const groups: string[][] = [];
    let current: string[] = [];
    let charCount = 0;
    for (const s of sentences) {
      current.push(s);
      charCount += s.length;
      if (charCount > 250) {
        groups.push(current);
        current = [];
        charCount = 0;
      }
    }
    if (current.length) groups.push(current);
    return groups.map(g => g.join(' ').trim()).join('\n\n');
  });

  // 8. Final cleanup
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.trim();

  return t;
}

// POST /api/admin/beautify — beautify markdown text
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest('Invalid JSON body');

  const { text_md } = body as { text_md?: string };
  if (text_md === undefined) return badRequest('text_md is required');

  const beautified = beautifyMarkdown(text_md);
  return json({ text_md: beautified });
};
