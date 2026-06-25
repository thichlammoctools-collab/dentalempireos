import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../lib/api-helpers';
import {
  createSurveyResponse,
  buildAnalysisContext,
  getSurveyResponse,
  updateAiAnalysis,
  type SurveyInput,
} from '../../lib/survey-db';
import { analyzeSurvey } from '../../lib/ai-survey-analysis';
import { getAiSettings, isAiEnabled } from '../../lib/ai-settings-db';

export const prerender = false;

// POST /api/survey — submit a survey response
// Triggers AI analysis in the background, returns the new ID.
export const POST: APIRoute = async ({ request, waitUntil }) => {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return badRequest('Invalid JSON body');

  // Basic validation
  const lang = body.lang === 'en' ? 'en' : 'vi';
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    return badRequest('email is required');
  }
  if (!body.clinic_name || typeof body.clinic_name !== 'string') {
    return badRequest('clinic_name is required');
  }

  const input: SurveyInput = {
    lang,
    owner_name: asString(body.owner_name),
    clinic_name: asString(body.clinic_name),
    clinic_address: asString(body.clinic_address),
    email: asString(body.email),
    years_in_operation: asInt(body.years_in_operation),
    staff_count: asInt(body.staff_count),
    // ROOTS
    roots_q1: asString(body.roots_q1),
    roots_q2: asString(body.roots_q2),
    roots_q3: asString(body.roots_q3),
    roots_q4: asString(body.roots_q4),
    roots_d1: asInt(body.roots_d1),
    roots_d2: asInt(body.roots_d2),
    roots_d3: asInt(body.roots_d3),
    roots_q4_choice: asString(body.roots_q4_choice),
    // SKY
    sky_sin_open: asString(body.sky_sin_open),
    sky_s_d1: asInt(body.sky_s_d1),
    sky_s_d2: asInt(body.sky_s_d2),
    sky_k_open: asString(body.sky_k_open),
    sky_k_d1: asInt(body.sky_k_d1),
    sky_k_d2: asInt(body.sky_k_d2),
    sky_y_open: asString(body.sky_y_open),
    sky_y_d1: asInt(body.sky_y_d1),
    sky_y_d2: asInt(body.sky_y_d2),
    // STARS
    stars_s_d: asInt(body.stars_s_d),
    stars_s_open: asString(body.stars_s_open),
    stars_t_d: asInt(body.stars_t_d),
    stars_t_open: asString(body.stars_t_open),
    stars_a_d: asInt(body.stars_a_d),
    stars_a_open: asString(body.stars_a_open),
    stars_r_d: asInt(body.stars_r_d),
    stars_syn_choice: asString(body.stars_syn_choice),
    stars_syn_d: asInt(body.stars_syn_d),
    stars_syn_open: asString(body.stars_syn_open),
    // Living
    living_o1: asString(body.living_o1),
    living_o2: asString(body.living_o2),
    living_d1: asInt(body.living_d1),
    living_d2: asInt(body.living_d2),
    living_d3: asInt(body.living_d3),
    living_d4: asInt(body.living_d4),
    // Future
    future_o1: asString(body.future_o1),
    future_o2: asString(body.future_o2),
    future_o3: asString(body.future_o3),
    // Commit
    commit_o1: asString(body.commit_o1),
    commit_o2: asString(body.commit_o2),
    commit_choice: asString(body.commit_choice),
    signature: asString(body.signature),
  };

  const { id } = await createSurveyResponse(env.DB, input);

  // Fire-and-forget AI analysis in the background.
  // Read config from DB ai_settings table.
  if (await isAiEnabled(env.DB)) {
    // @ts-ignore — waitUntil is provided by Astro Cloudflare adapter at runtime
    waitUntil?.(runAiAnalysis(env.DB, id));
  }

  return json({ success: true, id, redirect: `/survey/result/${id}` }, 201);
};

// GET /api/survey?id=xxx — fetch a single response (for result page reload)
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = parseInt(url.searchParams.get('id') ?? '');
  if (!id) return badRequest('id is required');

  const row = await getSurveyResponse(env.DB, id);
  if (!row) return json({ error: 'not_found' }, 404);

  // Hide email from public unless requested by admin
  if (!url.searchParams.has('admin')) {
    row.email = row.email ? maskEmail(row.email) : null;
  }

  return json(row);
};

// ── helpers ───────────────────────────────────────────────

function asString(v: unknown): string | null {
  if (typeof v === 'string') return v.trim() || null;
  if (typeof v === 'number') return String(v);
  return null;
}

function asInt(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.length > 2 ? local.slice(0, 2) : local;
  return `${visible}***@${domain}`;
}

async function runAiAnalysis(db: D1Database, id: number): Promise<void> {
  try {
    const row = await getSurveyResponse(db, id);
    if (!row) return;
    if (row.ai_analysis) return; // already analyzed

    const settings = await getAiSettings(db);
    if (settings.is_active !== 1 || !settings.api_key) return;

    const context = buildAnalysisContext(row);
    const analysis = await analyzeSurvey(settings.api_key, row, context, {
      baseUrl: settings.base_url,
      model: settings.model,
      maxTokens: settings.max_tokens,
    });
    await updateAiAnalysis(db, id, analysis);
  } catch (err) {
    // Log to console — UI will show "analysis pending" if ai_analysis is still null
    // eslint-disable-next-line no-console
    console.error(`AI analysis failed for survey ${id}:`, err);
  }
}
