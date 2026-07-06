globalThis.process ??= {};
globalThis.process.env ??= {};
const ALLOWED_TAGS = /* @__PURE__ */ new Set([
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "h2",
  "h3",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "hr",
  "figure",
  "figcaption",
  "span",
  "div",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td"
]);
const ALLOWED_ATTR = /* @__PURE__ */ new Set([
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "class",
  "width",
  "height",
  "id",
  "style"
]);
const ATTR_DENY_PREFIXES = ["on", "javascript:", "data-"];
const URI_SCHEME = /^(https?|mailto):/i;
function isSafeAttr(name, value) {
  for (const p of ATTR_DENY_PREFIXES) {
    if (name.startsWith(p)) return false;
  }
  if (!ALLOWED_ATTR.has(name)) return false;
  if (name === "href" || name === "src") {
    if (!URI_SCHEME.test(value) && !value.startsWith("/") && !value.startsWith("#")) {
      return false;
    }
  }
  return true;
}
function sanitizeRichHtml(html) {
  if (!html) return "";
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  const tagRe = /<\/?(\w+)((?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/gi;
  let result = "";
  tagRe.lastIndex = 0;
  result = html.replace(/<[^>]*>/g, (fullTag) => {
    const closeMatch = fullTag.match(/^<\/(\w+)\s*>$/);
    if (closeMatch) {
      const tagName = closeMatch[1].toLowerCase();
      if (ALLOWED_TAGS.has(tagName)) {
        return `</${tagName}>`;
      }
      return "";
    }
    const openMatch = fullTag.match(/^<(\w+)((?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>$/i);
    if (openMatch) {
      const tagName = openMatch[1].toLowerCase();
      if (!ALLOWED_TAGS.has(tagName)) return "";
      const selfClose = openMatch[3] === "/";
      const attrsRaw = openMatch[2].trim();
      const safeAttrs = [];
      if (attrsRaw) {
        const attrRe = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
        let am;
        while ((am = attrRe.exec(attrsRaw)) !== null) {
          const name = am[1].toLowerCase();
          const value = am[2] ?? am[3] ?? am[4] ?? "";
          if (isSafeAttr(name, value)) {
            safeAttrs.push(value ? `${name}="${value.replace(/"/g, "&quot;")}"` : name);
          }
        }
      }
      if (tagName === "img" || tagName === "br" || tagName === "hr" || selfClose) {
        return safeAttrs.length > 0 ? `<${tagName} ${safeAttrs.join(" ")} />` : `<${tagName} />`;
      }
      return safeAttrs.length > 0 ? `<${tagName} ${safeAttrs.join(" ")}>` : `<${tagName}>`;
    }
    return "";
  });
  return result;
}
export {
  sanitizeRichHtml as s
};
