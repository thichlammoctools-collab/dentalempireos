globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as getChapter } from "./book-db_DDcc_FYk.mjs";
import { g as getTierLabel } from "./collection-helpers_Dwl6Qbgw.mjs";
const prerender = false;
const W = 1200;
const H = 630;
function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function wrapText(text, maxChars, maxLines) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = w;
      if (lines.length >= maxLines) break;
    } else {
      current = candidate;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length > 0) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.length > maxChars - 1 ? last.slice(0, maxChars - 1) + "…" : last + "…";
  }
  return lines;
}
const TIER_PALETTE = {
  1: { bar: "#92ccff", pill: "rgba(146,204,255,0.12)", subtle: "rgba(146,204,255,0.4)" },
  2: { bar: "#a78bfa", pill: "rgba(167,139,250,0.12)", subtle: "rgba(167,139,250,0.4)" },
  3: { bar: "#92ccff", pill: "rgba(146,204,255,0.12)", subtle: "rgba(146,204,255,0.4)" }
};
const GET = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response("Not found", { status: 404 });
  let chapter = null;
  try {
    chapter = await getChapter(env.DB, slug);
  } catch (err) {
    console.error("OG image: failed to fetch chapter", err);
  }
  if (!chapter) return new Response("Chapter not found", { status: 404 });
  const title = chapter.title || "Chương";
  const desc = chapter.description || "";
  const tier = chapter.tier || 3;
  const palette = TIER_PALETTE[tier] ?? TIER_PALETTE[3];
  const tierLabel = getTierLabel(tier);
  const titleLines = wrapText(title, 22, 3);
  const descLines = wrapText(desc, 65, 2);
  const titleStartY = 280;
  const lineHeight = 82;
  const titleSvg = titleLines.map((line, i) => {
    const isAccent = i === titleLines.length - 1 && titleLines.length > 1;
    return `<text x="80" y="${titleStartY + i * lineHeight}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="800" fill="${isAccent ? palette.bar : "#ffffff"}">${escapeXml(line)}</text>`;
  }).join("");
  const descStartY = titleStartY + titleLines.length * lineHeight + 30;
  const descSvg = descLines.map((line, i) => {
    return `<text x="80" y="${descStartY + i * 36}" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="500" fill="#a8a8b8">${escapeXml(line)}</text>`;
  }).join("");
  const pillText = `TIER ${tier} · ${escapeXml(tierLabel).toUpperCase()}`;
  const pillWidth = Math.max(180, pillText.length * 11);
  const chapterBadge = `CHƯƠNG ${String(chapter.chapter_no || 0).padStart(2, "0")}`;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a14" />
      <stop offset="100%" stop-color="#1c1c2e" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${palette.bar}" />
      <stop offset="100%" stop-color="${palette.bar}" stop-opacity="0.7" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${palette.bar}" stop-opacity="0.18" />
      <stop offset="100%" stop-color="${palette.bar}" stop-opacity="0" />
    </radialGradient>
    <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${palette.bar}" fill-opacity="0.08" />
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)" />
  <rect width="${W}" height="${H}" fill="url(#dots)" />
  <circle cx="980" cy="315" r="340" fill="url(#glow)" />
  <rect x="80" y="80" width="48" height="4" fill="url(#accent)" rx="2" />
  <text x="148" y="92" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="${palette.bar}" letter-spacing="3">DENTAL EMPIRE OS</text>
  <g transform="translate(${W - pillWidth - 80}, 72)">
    <rect x="0" y="0" width="${pillWidth}" height="38" rx="19" fill="${palette.pill}" stroke="${palette.subtle}" />
    <text x="${pillWidth / 2}" y="25" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="${palette.bar}" text-anchor="middle" letter-spacing="2">${pillText}</text>
  </g>
  <text x="80" y="170" font-family="system-ui, sans-serif" font-size="18" font-weight="700" fill="#7a7a8c" letter-spacing="4">${chapterBadge}</text>
  ${titleSvg}
  ${descSvg}
  <g transform="translate(80, 540)">
    <rect x="0" y="0" width="140" height="42" rx="21" fill="${palette.pill}" stroke="${palette.subtle}" />
    <text x="70" y="27" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${palette.bar}" text-anchor="middle" letter-spacing="2">SKY</text>
    <rect x="160" y="0" width="180" height="42" rx="21" fill="${palette.pill}" stroke="${palette.subtle}" />
    <text x="250" y="27" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${palette.bar}" text-anchor="middle" letter-spacing="2">S.T.A.R.S</text>
    <rect x="360" y="0" width="200" height="42" rx="21" fill="${palette.pill}" stroke="${palette.subtle}" />
    <text x="460" y="27" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${palette.bar}" text-anchor="middle" letter-spacing="2">R.O.A.D.M.A.P</text>
  </g>
  <text x="80" y="610" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#7a7a8c" letter-spacing="2">dentalempireos.com/book/${escapeXml(slug)}</text>
</svg>`;
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
    }
  });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
