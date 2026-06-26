// HTML sanitization for rich text block content.
// Runs on both client (editor onChange) and server (render side).
// Uses isomorphic-dompurify which works on Cloudflare Workers via linkedom shim.

import DOMPurify from 'isomorphic-dompurify';

export const RICH_CONFIG: import('isomorphic-dompurify').Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
    'h2', 'h3', 'blockquote',
    'ul', 'ol', 'li',
    'a', 'img', 'hr',
    'figure', 'figcaption', 'span',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel',
    'src', 'alt', 'title',
    'class', 'width', 'height',
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onstyle', 'style'],
};

export function sanitizeRichHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, RICH_CONFIG) as string;
}
