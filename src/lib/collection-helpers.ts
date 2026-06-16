import { getCollection, type CollectionEntry } from 'astro:content';

export type BookEntry = CollectionEntry<'book'>;

export async function getAllChapters(): Promise<BookEntry[]> {
  const entries = await getCollection('book', ({ data }) => !data.draft);
  return entries.sort((a, b) => a.data.tier - b.data.tier || a.data.order - b.data.order);
}

export async function getChaptersByTier(tier: number): Promise<BookEntry[]> {
  const all = await getAllChapters();
  return all.filter((e) => e.data.tier === tier);
}

export async function getAdjacentChapters(currentSlug: string): Promise<{ prev: BookEntry | null; next: BookEntry | null }> {
  const all = await getAllChapters();
  const idx = all.findIndex((e) => e.id === currentSlug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function getTierLabel(tier: number): string {
  const labels: Record<number, string> = {
    1: 'Dental Empire C++',
    2: 'Dental Empire U++',
    3: 'Dental Empire OS',
  };
  return labels[tier] || `Tầng ${tier}`;
}
