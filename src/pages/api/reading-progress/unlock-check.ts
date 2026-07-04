import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { getReadingStats } from '../../../lib/reading-progress-db';
import { hasAccess } from '../../../lib/payos-db';

export const prerender = false;

// GET /api/reading-progress/unlock-check
export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ qualified: false, reason: 'not_logged_in' });

  const stats = await getReadingStats(env.DB, locals.user.id);

  // Tier 1 chapters (Ch.1-5)
  const { results: tier1 } = await env.DB
    .prepare('SELECT "id" FROM "chapter" WHERE "status" = \'published\' AND "tier" = 1')
    .all<{ id: string }>();
  const tier1Set = new Set(tier1.map(c => c.id));

  const { results: progress } = await env.DB
    .prepare('SELECT "chapter_id", "max_pct" FROM "reading_progress" WHERE "user_id" = ?')
    .bind(locals.user.id)
    .all<{ chapter_id: string; max_pct: number }>();

  const completedTier1 = progress.filter(
    p => tier1Set.has(p.chapter_id) && p.max_pct >= 80,
  ).length;

  const qualified = completedTier1 >= 3;
  const hasPro = await hasAccess(env.DB, locals.user.id, 'prod-mini-scanner-pro');

  return json({
    qualified,
    completedTier1,
    totalTier1: tier1Set.size,
    hasPro,
    message: qualified && !hasPro
      ? 'Bạn đã đọc đủ 3 chương Tier 1 — mở khóa Mini Scanner miễn phí!'
      : qualified && hasPro
      ? 'Bạn đã có Mini Scanner Pro'
      : `Cần đọc thêm ${Math.max(0, 3 - completedTier1)} chương để mở khóa.`,
  });
};
