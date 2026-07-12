// HTML sanitization for rich text block content.
// Works without DOM Purify in Cloudflare Workers / Vite SSR.
// Whitelist-based: keeps allowed tags & attrs, strips everything else.

// Shared DOMPurify config — matches the whitelist used by sanitizeRichHtml()
// below. Kept as a const so client-side bundles (e.g. richtext-editor.ts)
// can pass the same configuration into DOMPurify without duplicating it.

export const RICH_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4', 'blockquote',
    'ul', 'ol', 'li',
    'a', 'img', 'hr',
    'figure', 'figcaption', 'span', 'div',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'mark', 'sup', 'sub',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'title',
    'class', 'width', 'height',
    'id', 'style',
    'colspan', 'rowspan',
  ],
} as const;

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
  'h1', 'h2', 'h3', 'h4', 'blockquote',
  'ul', 'ol', 'li',
  'a', 'img', 'hr',
  'figure', 'figcaption', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'mark', 'sup', 'sub',
]);

const ALLOWED_ATTR = new Set([
  'href', 'target', 'rel',
  'src', 'alt', 'title',
  'class', 'width', 'height',
  'id', 'style',
  'colspan', 'rowspan',
]);

const ATTR_DENY_PREFIXES = ['on', 'javascript:', 'data-'];
const URI_SCHEME = /^(https?|mailto):/i;

function isSafeAttr(name: string, value: string): boolean {
  for (const p of ATTR_DENY_PREFIXES) {
    if (name.startsWith(p)) return false;
  }
  if (!ALLOWED_ATTR.has(name)) return false;
  if (name === 'href' || name === 'src') {
    if (!URI_SCHEME.test(value) && !value.startsWith('/') && !value.startsWith('#')) {
      return false;
    }
  }
  return true;
}

export function sanitizeRichHtml(html: string): string {
  if (!html) return '';

  // Strip comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Parse and rebuild using regex-based stack
  const tagRe = /<\/?(\w+)((?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/gi;
  let result = '';
  let lastIndex = 0;

  tagRe.lastIndex = 0;
  let match: RegExpExecArray | null;

  // Use a copy and search sequentially
  const text = html;
  const re = /<(\/?)(\w+)((?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>/gi;

  // This approach: replace everything that isn't a tag, then check tags
  result = html.replace(/<[^>]*>/g, (fullTag) => {
    const closeMatch = fullTag.match(/^<\/(\w+)\s*>$/);
    if (closeMatch) {
      const tagName = closeMatch[1].toLowerCase();
      if (ALLOWED_TAGS.has(tagName)) {
        return `</${tagName}>`;
      }
      return '';
    }

    const openMatch = fullTag.match(/^<(\w+)((?:\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>$/i);
    if (openMatch) {
      const tagName = openMatch[1].toLowerCase();
      if (!ALLOWED_TAGS.has(tagName)) return '';

      const selfClose = openMatch[3] === '/';
      const attrsRaw = openMatch[2].trim();
      const safeAttrs: string[] = [];

      if (attrsRaw) {
        const attrRe = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
        let am: RegExpExecArray | null;
        while ((am = attrRe.exec(attrsRaw)) !== null) {
          const name = am[1].toLowerCase();
          const value = am[2] ?? am[3] ?? am[4] ?? '';
          if (isSafeAttr(name, value)) {
            safeAttrs.push(value ? `${name}="${value.replace(/"/g, '&quot;')}"` : name);
          }
        }
      }

      if (tagName === 'img' || tagName === 'br' || tagName === 'hr' || selfClose) {
        return safeAttrs.length > 0
          ? `<${tagName} ${safeAttrs.join(' ')} />`
          : `<${tagName} />`;
      }
      return safeAttrs.length > 0
        ? `<${tagName} ${safeAttrs.join(' ')}>`
        : `<${tagName}>`;
    }

    // Not a recognized tag, strip it
    return '';
  });

  return result;
}
