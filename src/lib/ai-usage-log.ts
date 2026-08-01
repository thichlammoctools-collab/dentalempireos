/**
 * AI usage logging — counts requests per provider/model/feature.
 * User decision: only count requests, no token/cost tracking.
 */

export type AiFeature =
  | 'scanner_analysis'
  | 'scanner_plan'
  | 'mentor_chat'
  | 'app_chat'
  | 'app_run'
  | 'wizard'
  | 'website_chat'
  | 'knowledge_base_embedding';

export interface UsageLog {
  provider_id: string;
  model_id: string;
  user_id?: string;
  session_id?: string;
  feature: AiFeature;
  success: boolean;
  error_message?: string;
  latency_ms?: number;
  input_tokens?: number;
  output_tokens?: number;
  fallback_used?: boolean;
  retrieval_chunks?: number;
  request_id?: string;
  attempt_count?: number;
}

export async function logAiUsage(
  db: D1Database,
  log: UsageLog,
): Promise<void> {
  await db
    .prepare(`
       INSERT INTO "ai_usage_log" ("provider_id","model_id","user_id","session_id","feature","success","error_message","latency_ms","input_tokens","output_tokens","fallback_used","retrieval_chunks","request_id","attempt_count")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      log.provider_id,
      log.model_id,
      log.user_id ?? null,
      log.session_id ?? null,
      log.feature,
      log.success ? 1 : 0,
      log.error_message ?? null,
      log.latency_ms ?? null,
      log.input_tokens ?? null,
      log.output_tokens ?? null,
      log.fallback_used ? 1 : 0,
      log.retrieval_chunks ?? null,
      log.request_id ?? null,
      log.attempt_count ?? null,
    )
    .run();
}

export async function checkRateLimit(
  db: D1Database,
  providerId: string,
): Promise<boolean> {
  try {
    const provider = await db
      .prepare(`SELECT rate_limit_per_hour FROM "ai_provider" WHERE id = ?`)
      .bind(providerId)
      .first<{ rate_limit_per_hour: number }>();
    if (!provider) return true;

    const { results } = await db
      .prepare(`
        SELECT COUNT(*) as cnt FROM "ai_usage_log"
        WHERE provider_id = ? AND created_at > datetime('now', '-1 hour')
      `)
      .bind(providerId)
      .all<{ cnt: number }>();

    return (results[0]?.cnt ?? 0) < (provider.rate_limit_per_hour ?? 1000);
  } catch {
    return true;
  }
}

export interface UsageStats {
  period: string;
  provider_id: string;
  model_id: string;
  feature: string;
  user_id: string | null;
  total_requests: number;
  success_rate: number;
  avg_latency_ms: number;
}

export async function queryUsageStats(
  db: D1Database,
  opts: {
    from?: string;
    to?: string;
    provider_id?: string;
    group_by: 'day' | 'model' | 'feature' | 'user';
  },
): Promise<UsageStats[]> {
  const conditions: string[] = ['1=1'];
  const params: unknown[] = [];

  if (opts.from) {
    conditions.push(`created_at >= '${opts.from.replace(/'/g, "''")}'`);
  }
  if (opts.to) {
    conditions.push(`created_at <= '${opts.to.replace(/'/g, "''")}'`);
  }
  if (opts.provider_id) {
    conditions.push(`provider_id = '${opts.provider_id.replace(/'/g, "''")}'`);
  }

  const groupCols = {
    day: "strftime('%Y-%m-%d', created_at)",
    model: 'model_id',
    feature: 'feature',
    user: 'COALESCE(user_id, "(anonymous)")',
  };

  const groupCol = groupCols[opts.group_by];

  const sql = `
    SELECT
      ${groupCol} as period,
      provider_id,
      model_id,
      feature,
      COALESCE(user_id, "(anonymous)") as user_id,
      COUNT(*) as total_requests,
      ROUND(AVG(success) * 100, 1) as success_rate,
      ROUND(AVG(latency_ms)) as avg_latency_ms
    FROM "ai_usage_log"
    WHERE ${conditions.join(' AND ')}
    GROUP BY ${groupCol}, provider_id, model_id, feature
    ORDER BY period DESC, total_requests DESC
    LIMIT 500
  `;

  const { results } = await db.prepare(sql).all<UsageStats>();
  return results ?? [];
}

export async function getUsageTotals(
  db: D1Database,
  opts: { from?: string; to?: string; provider_id?: string } = {},
): Promise<{ requests: number; success_rate: number; avg_latency_ms: number; avg_input_tokens: number; avg_output_tokens: number; fallback_rate: number; avg_retrieval_chunks: number }> {
  const conditions: string[] = ['1=1'];
  if (opts.from) conditions.push(`created_at >= '${opts.from.replace(/'/g, "''")}'`);
  if (opts.to) conditions.push(`created_at <= '${opts.to.replace(/'/g, "''")}'`);
  if (opts.provider_id) conditions.push(`provider_id = '${opts.provider_id.replace(/'/g, "''")}'`);

  const { results } = await db
    .prepare(`
      SELECT
        COUNT(*) as requests,
        ROUND(AVG(success) * 100, 1) as success_rate,
        ROUND(AVG(latency_ms)) as avg_latency_ms
        ,ROUND(AVG(input_tokens)) as avg_input_tokens
        ,ROUND(AVG(output_tokens)) as avg_output_tokens
        ,ROUND(AVG(fallback_used) * 100, 1) as fallback_rate
        ,ROUND(AVG(retrieval_chunks), 1) as avg_retrieval_chunks
      FROM "ai_usage_log"
      WHERE ${conditions.join(' AND ')}
    `)
    .all<{ requests: number; success_rate: number; avg_latency_ms: number; avg_input_tokens: number; avg_output_tokens: number; fallback_rate: number; avg_retrieval_chunks: number }>();

  return results?.[0] ?? { requests: 0, success_rate: 0, avg_latency_ms: 0, avg_input_tokens: 0, avg_output_tokens: 0, fallback_rate: 0, avg_retrieval_chunks: 0 };
}

export async function getOperationalSummary(db: D1Database, days = 30): Promise<{
  by_feature: Array<Record<string, unknown>>;
  by_model: Array<Record<string, unknown>>;
  daily: Array<Record<string, unknown>>;
}> {
  const since = `-${Math.max(1, Math.min(days, 90))} days`;
  const [byFeature, byModel, daily] = await Promise.all([
    db.prepare(`SELECT feature, COUNT(*) requests, ROUND(AVG(success) * 100, 1) success_rate, ROUND(AVG(latency_ms)) avg_latency_ms, ROUND(AVG(input_tokens)) avg_input_tokens, ROUND(AVG(output_tokens)) avg_output_tokens, ROUND(AVG(retrieval_chunks), 1) avg_retrieval_chunks FROM ai_usage_log WHERE created_at >= datetime('now', ?) GROUP BY feature ORDER BY requests DESC`).bind(since).all(),
    db.prepare(`SELECT provider_id, model_id, COUNT(*) requests, ROUND(AVG(success) * 100, 1) success_rate, ROUND(AVG(latency_ms)) avg_latency_ms FROM ai_usage_log WHERE created_at >= datetime('now', ?) GROUP BY provider_id, model_id ORDER BY requests DESC`).bind(since).all(),
    db.prepare(`SELECT strftime('%Y-%m-%d', created_at) day, COUNT(*) requests, ROUND(AVG(success) * 100, 1) success_rate, ROUND(AVG(latency_ms)) avg_latency_ms FROM ai_usage_log WHERE created_at >= datetime('now', ?) GROUP BY day ORDER BY day`).bind(since).all(),
  ]);
  return { by_feature: byFeature.results ?? [], by_model: byModel.results ?? [], daily: daily.results ?? [] };
}

export async function deleteOldLogs(
  db: D1Database,
  olderThan: string,
): Promise<number> {
  const result = await db
    .prepare(`DELETE FROM "ai_usage_log" WHERE created_at < '${olderThan.replace(/'/g, "''")}'`)
    .run();
  return result.meta.changes ?? 0;
}
