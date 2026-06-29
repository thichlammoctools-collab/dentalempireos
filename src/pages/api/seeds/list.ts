// Public API: List available bundled seeds (no auth needed).
// GET /api/seeds/list
// Returns: list of seeds with id/slug/title/type/stats
//   plus 'inDb' flag for each (checks against survey_definition table).

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json } from '../../../lib/api-helpers';
import { SEED_REGISTRY } from '../../../data/seeds/registry';

export const prerender = false;

export const GET: APIRoute = async () => {
  let existingIds = new Set<string>();
  try {
    const result = await env.DB
      .prepare('SELECT id FROM "survey_definition"')
      .all<{ id: string }>();
    existingIds = new Set((result.results ?? []).map((r) => r.id));
  } catch {
    // ignore
  }

  const seeds = Object.values(SEED_REGISTRY).map((s) => ({
    id: s.id,
    slug: s.slug,
    title_vi: s.title_vi,
    type: s.survey_type ?? 'full',
    is_free: s.is_free ?? 0,
    sections: s.sections.length,
    questions: s.sections.reduce((sum, sec) => sum + sec.questions.length, 0),
    inDb: existingIds.has(s.id),
  }));

  return json({ seeds });
};