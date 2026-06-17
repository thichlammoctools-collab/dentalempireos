/**
 * Simplified Astro content-collection helpers.
 *
 * The old MDX-first pipeline has been superseded by the D1-based
 * chapter/section/block system in book-db.ts.  This module now only
 * exports getTierLabel (used by book reader pages).
 */

export function getTierLabel(tier: number): string {
  const labels: Record<number, string> = {
    1: 'Dental Empire C++',
    2: 'Dental Empire U++',
    3: 'Dental Empire OS',
  };
  return labels[tier] || `Tầng ${tier}`;
}
