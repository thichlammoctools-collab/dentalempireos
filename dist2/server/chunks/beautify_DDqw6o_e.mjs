globalThis.process ??= {};
globalThis.process.env ??= {};
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const BOLD_TERMS = [
  "Patient Experience",
  "Referral",
  "Testimonial",
  "CRM",
  "Dental Empire OS",
  "R\\.O\\.A\\.D\\.M\\.A\\.P",
  "S\\.T\\.A\\.R\\.S",
  "TO BE SKY",
  "SKY",
  "ROOTS",
  "ONE LIGHT",
  "AWAKEN",
  "DEEPEN",
  "MATURE",
  "ALIGN",
  "PROSPER",
  "Skills",
  "Traits",
  "Actions",
  "Results",
  "Synergy",
  "Sincerity",
  "Kindness",
  "Yielding",
  "KPI",
  "Onboarding",
  "Mentoring",
  "Self\\-audit",
  "Role mapping",
  "Monthly review"
];
function beautifyMarkdown(text) {
  let t = text;
  t = t.replace(/\\([.\-()])/g, "$1");
  t = t.replace(/\\"/g, '"');
  t = t.replace(/\\\n/g, "\n");
  t = t.replace(/\\{2,}\s*$/gm, "");
  t = t.replace(/[ \t]+$/gm, "");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(/^(Lưu ý\s*:\s*)\n/gm, "> **Lưu ý:**\n\n");
  t = t.replace(
    /^(> \*\*Lưu ý:\*\*)\n((?:.+\n?)+?)(?=\n\n|\n(?=\S)|$)/gm,
    (_match, head, body) => {
      const lines = body.trimEnd().split("\n").map((l) => `> ${l}`).join("\n");
      return `${head}
${lines}`;
    }
  );
  t = t.replace(/(?:^|\n)(- [^\n]+(?:\n(?!\n)[^\n]+)*)/gm, (_match, list) => {
    return "\n" + list.split("\n").map((l) => {
      const trimmed = l.trim();
      if (trimmed.startsWith("- ")) return trimmed;
      return `- ${trimmed}`;
    }).join("\n") + "\n";
  });
  t = t.replace(/(?:^|\n)((?:\d+\.\s+[^\n]+(?:\n(?!\n)[^\n]+)*)+)/gm, (_match, list) => {
    let idx = 0;
    return "\n" + list.split("\n").map((l) => {
      const trimmed = l.trim();
      if (/^\d+\.\s/.test(trimmed)) {
        idx++;
        return `${idx}. ${trimmed.replace(/^\d+\.\s*/, "")}`;
      }
      return trimmed;
    }).join("\n") + "\n";
  });
  for (const term of BOLD_TERMS) {
    const raw = term.replace(/\\\./g, "\\.").replace(/\\-/g, "\\-");
    const regex = new RegExp(`(?<!\\*\\*)\\b${raw}\\b(?!\\*\\*)`, "g");
    t = t.replace(regex, `**${term.replace(/\\/g, "")}**`);
  }
  t = t.replace(/^(?![->|#\d*])(.{350,})$/gm, (_match, paragraph) => {
    if ((paragraph.match(/\*\*/g) || []).length > 6) return paragraph;
    const sentences = paragraph.match(/[^.!?]+[.!?]+\s*/g) || [paragraph];
    if (sentences.length < 3) return paragraph;
    const groups = [];
    let current = [];
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
    return groups.map((g) => g.join(" ").trim()).join("\n\n");
  });
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.trim();
  return t;
}
const POST = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { text_md } = body;
  if (text_md === void 0) return badRequest("text_md is required");
  const beautified = beautifyMarkdown(text_md);
  return json({ text_md: beautified });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  beautifyMarkdown,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
