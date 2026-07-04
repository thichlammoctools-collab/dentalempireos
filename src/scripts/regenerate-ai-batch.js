/**
 * Batch regenerate AI analysis + plan for all scanner responses without AI.
 * Run: node src/scripts/regenerate-ai-batch.js
 *
 * This script:
 * 1. Fetches all responses without ai_analysis
 * 2. For each response, calls the AI API directly and updates the DB
 */

const API_KEY = 'AGOP-2145-28C4-D090';
const BASE_URL = 'https://api.nkq.vn';
const DB_URL = 'https://api.cloudflare.com/client/v4/accounts';
const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
const D1_DB_ID = 'dc3b8890-c22f-4ebb-8172-1db5f4317241';
const CF_TOKEN = process.env.CF_API_TOKEN;

async function cfD1(sql) {
  const res = await fetch(
    `${DB_URL}/${ACCOUNT_ID}/d1/databases/${D1_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql }),
    }
  );
  const data = await res.json();
  if (!res.ok || data.errors?.length) {
    throw new Error(`D1 error: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

async function updateResponse(id, field, value) {
  const escaped = value.replace(/'/g, "''");
  return cfD1(`UPDATE scanner_response SET "${field}" = '${escaped}', "ai_analyzed_at" = datetime('now') WHERE id = ${id};`);
}

async function callClaude(prompt, model = 'claude-opus-4-8', maxTokens = 4096) {
  const res = await fetch(`${BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: prompt,
      messages: [{ role: 'user', content: 'Generate analysis.' }],
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content.filter(b => b.type === 'text').map(b => b.text).join('');
}

async function regenerateResponse(id) {
  console.log(`\n--- Processing response ${id} ---`);

  // Get response data
  const [r] = (await cfD1(`SELECT * FROM scanner_response WHERE id = ${id};`)).results;
  if (!r) { console.log('Response not found'); return; }

  // Get survey definition
  const [def] = (await cfD1(`SELECT * FROM survey_definition WHERE id = '${r.survey_id}';`)).results;
  if (!def) { console.log('Survey definition not found'); return; }

  const aiConfig = JSON.parse(def.ai_config || '{}');
  const scoringRules = JSON.parse(def.scoring_rules || '{}');
  const scores = JSON.parse(r.scores_json || '{}');
  const responses = JSON.parse(r.responses_json || '{}');
  const lang = r.lang === 'en' ? 'en' : 'vi';

  // Get questions for context
  const qRows = (await cfD1(`
    SELECT q.question_id, q.label_vi, q.label_en, q.type, q.scale_labels_vi, s.title_vi
    FROM survey_question q
    JOIN survey_section s ON q.section_id = s.id
    WHERE s.survey_id = '${r.survey_id}'
    ORDER BY s.order_idx, q.order_idx;
  `)).results;

  // Build enriched responses for AI context
  const enrichedResponses = {};
  for (const q of qRows) {
    const v = responses[q.question_id];
    if (v === undefined) continue;
    if (q.type === 'select') {
      const labels = JSON.parse(q.scale_labels_vi || '{}');
      enrichedResponses[q.question_id] = {
        value: v,
        label: labels[String(v)] || String(v),
        question: q.label_vi,
      };
    } else {
      enrichedResponses[q.question_id] = {
        value: v,
        question: q.label_vi,
      };
    }
  }

  const context = `
Survey: ${def.title_vi}
Clinic: ${r.clinic_name || 'N/A'}
Owner: ${r.owner_name || 'N/A'}
Language: ${lang}
Scores: ${JSON.stringify(scores, null, 2)}
Answers: ${JSON.stringify(enrichedResponses, null, 2)}
`.trim();

  // Replace placeholders in prompts
  function buildPrompt(template) {
    if (!template) return null;
    let p = template
      .replace(/\{\{SCORE_TOTAL\}\}/g, String(scores.total ?? 0));
    if (scoringRules.dimensions) {
      for (const dim of scoringRules.dimensions) {
        const val = scores[dim.id] ?? 0;
        p = p.replace(new RegExp(`\\{\\{SCORE_${dim.id.toUpperCase()}\\}\\}`, 'g'), String(val));
      }
    }
    // Open responses
    if (p.includes('{{OPEN_RESPONSES}}')) {
      const openItems = qRows
        .filter(q => q.type === 'textarea' && responses[q.question_id])
        .map(q => `[${q.label_vi}]: ${responses[q.question_id]}`);
      p = p.replace(/\{\{OPEN_RESPONSES\}\}/g, openItems.join('\n') || '(no open answers)');
    }
    return p;
  }

  // Generate analysis
  if (aiConfig.prompt_vi || aiConfig.prompt_en) {
    const promptTemplate = lang === 'en'
      ? (aiConfig.prompt_en || aiConfig.prompt_vi)
      : (aiConfig.prompt_vi || aiConfig.prompt_en);
    const systemPrompt = buildPrompt(promptTemplate);

    if (systemPrompt) {
      try {
        console.log(`  Generating AI analysis...`);
        const analysis = await callClaude(systemPrompt + '\n\nContext:\n' + context);
        await updateResponse(id, 'ai_analysis', analysis);
        console.log(`  AI analysis saved (${analysis.length} chars)`);
      } catch (err) {
        console.error(`  AI analysis FAILED: ${err.message}`);
      }
    }
  } else {
    console.log(`  No analysis prompt configured`);
  }

  // Generate plan
  if (aiConfig.plan_prompt_vi || aiConfig.plan_prompt_en) {
    const planTemplate = lang === 'en'
      ? (aiConfig.plan_prompt_en || aiConfig.plan_prompt_vi)
      : (aiConfig.plan_prompt_vi || aiConfig.plan_prompt_en);
    const systemPrompt = buildPrompt(planTemplate);

    if (systemPrompt) {
      try {
        console.log(`  Generating AI plan...`);
        const plan = await callClaude(systemPrompt + '\n\nContext:\n' + context);
        await updateResponse(id, 'ai_plan', plan);
        console.log(`  AI plan saved (${plan.length} chars)`);
      } catch (err) {
        console.error(`  AI plan FAILED: ${err.message}`);
      }
    }
  } else {
    console.log(`  No plan prompt configured`);
  }
}

// Main
async function main() {
  console.log('Fetching responses without AI...');
  const data = await cfD1(`
    SELECT id, survey_id, clinic_name FROM scanner_response
    WHERE ai_analysis IS NULL
    ORDER BY id DESC;
  `);
  const rows = data.results;
  console.log(`Found ${rows.length} responses to process`);

  if (rows.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  for (const row of rows) {
    await regenerateResponse(row.id);
    // Small delay between calls
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n=== Done ===');
}

main().catch(console.error);
