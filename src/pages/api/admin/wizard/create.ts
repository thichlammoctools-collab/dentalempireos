import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, badRequest } from '../../../../lib/api-helpers';
import { upsertApp } from '../../../../lib/app-db';
import {
  upsertSurveyDefinition,
  addSection,
  addQuestion,
} from '../../../../lib/survey-config-db';
import type { GeneratedOutput } from '../../../../lib/product-wizard-ai';

export const prerender = false;

const VALID_TYPES = ['survey', 'ebook_ai', 'course_ai', 'tool', 'generator'];
const VALID_STATUSES = ['draft', 'active', 'archived'];

async function slugExists(db: D1Database, slug: string, table: 'ai_application' | 'survey_definition'): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 FROM "${table}" WHERE "slug" = ?`)
    .bind(slug)
    .first();
  return !!row;
}

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json().catch(() => null)) as {
    type?: string;
    name?: string;
    slug?: string;
    description?: string;
    status?: string;
    is_free?: number;
    config_json?: string;
    generated?: GeneratedOutput;
  } | null;

  if (!body) return badRequest('Invalid JSON body');
  if (!body.type || !VALID_TYPES.includes(body.type)) {
    return badRequest(`Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!body.name?.trim()) return badRequest('name is required');
  if (!body.generated) return badRequest('generated config is required');

  const type = body.type as 'survey' | 'ebook_ai' | 'course_ai' | 'tool' | 'generator';
  const name = body.name.trim();
  const status = VALID_STATUSES.includes(body.status ?? '') ? (body.status as 'draft' | 'active' | 'archived') : 'draft';
  const isFree = body.is_free === 1 ? 1 : 0;

  // Resolve slug uniqueness
  let slug = body.slug?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Strip type prefix if present
  slug = slug.replace(/^app-/, '').replace(/^scan-/, '');
  let suffix = 2;
  while (await slugExists(env.DB, slug, 'ai_application')) {
    slug = `${slug}-${suffix++}`;
  }

  const appId = crypto.randomUUID();
  let scannerId: string | undefined;
  let scannerSlug = '';

  // Build config_json — use what AI generated, merging any manual edits
  let configJsonStr = body.config_json;
  if (!configJsonStr && body.generated?.config_json) {
    configJsonStr = JSON.stringify(body.generated.config_json);
  }

  // Handle survey type: create scanner first
  if (type === 'survey' && body.generated?.config_json?.scanner_definition) {
    const scannerDef = body.generated.config_json.scanner_definition;

    // Resolve scanner slug uniqueness
    scannerSlug = scannerDef.title_vi
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    suffix = 2;
    while (await slugExists(env.DB, scannerSlug, 'survey_definition')) {
      scannerSlug = `${scannerSlug}-${suffix++}`;
    }

    scannerId = crypto.randomUUID();

    // Build ai_config from the generated config_json
    const aiConfig = {
      prompt_vi: body.generated.config_json.prompt_vi,
      prompt_en: body.generated.config_json.prompt_en || undefined,
      analysis_sections: body.generated.config_json.analysis_sections,
    };

    // Create scanner definition
    await upsertSurveyDefinition(env.DB, {
      id: scannerId,
      slug: scannerSlug,
      title_vi: scannerDef.title_vi,
      title_en: scannerDef.title_en || scannerDef.title_vi,
      description_vi: scannerDef.description_vi,
      description_en: scannerDef.description_vi,
      status: 'draft',
      is_free: isFree,
      survey_type: scannerDef.survey_type,
      scoring_rules: scannerDef.scoring_rules,
      ai_config: aiConfig,
      order_index: 999,
    });

    // Create sections and questions
    for (let sIdx = 0; sIdx < scannerDef.sections.length; sIdx++) {
      const sec = scannerDef.sections[sIdx];
      const sectionRow = await addSection(env.DB, {
        survey_id: scannerId,
        order_idx: sIdx,
        title_vi: sec.title_vi,
        title_en: sec.title_en || sec.title_vi,
        icon: sec.icon || null,
      });

      // Build question_id → dimension map for scoring rules
      const dimMap: Record<string, string> = {};
      if (scannerDef.scoring_rules?.dimensions) {
        for (const dim of scannerDef.scoring_rules.dimensions) {
          for (const qid of dim.question_ids) {
            dimMap[qid] = dim.id;
          }
        }
      }

      for (let qIdx = 0; qIdx < sec.questions.length; qIdx++) {
        const q = sec.questions[qIdx];
        const questionId = q.question_id || `q_${sIdx}_${qIdx}`;
        const dimension = dimMap[questionId] || q.dimension || null;

        await addQuestion(env.DB, {
          section_id: sectionRow.id,
          question_id: questionId,
          order_idx: qIdx,
          type: q.type,
          label_vi: q.label_vi,
          label_en: q.label_en || q.label_vi,
          scale_labels_vi: q.scale_labels_vi || null,
          options_vi: q.options_vi || null,
          required: q.required ?? 0,
          dimension: dimension,
          anchor: q.anchor ?? 0,
          weight: q.weight ?? null,
        });
      }
    }
  }

  // Create the app
  await upsertApp(env.DB, {
    id: appId,
    slug,
    name,
    description: body.description?.trim() || null,
    type,
    status,
    is_free: isFree,
    config_json: configJsonStr,
    linked_scanner_id: scannerId || null,
  });

  return json({ id: appId, linked_scanner_id: scannerId }, 201);
};
