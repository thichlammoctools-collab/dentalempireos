import { handle } from '@astrojs/cloudflare/handler';
import {
  getScannerAiQueue,
  processScannerAiQueueMessage,
  retryDelaySeconds,
  type ScannerAiQueueMessage,
} from './lib/scanner-ai-queue';
import {
  claimScannerAiJobDispatch,
  confirmScannerAiJobDispatched,
  failScannerAiJobWithResponseStatus,
  getScannerAiJobsPendingDispatch,
  reclaimStaleScannerAiJobs,
  requeueScannerAiJob,
} from './lib/ai-operations';
import {
  linkScannerSubmissionSnapshot,
  listPendingScannerSubmissionSnapshots,
} from './lib/scanner-submission-db';
import { hasActiveScannerResponseOperationLease } from './lib/scanner-response-operation-fence';
import {
  cleanupScannerActionPlanReminders,
  reclaimStaleScannerActionPlanReminderClaims,
  scheduleScannerActionPlanReminders,
} from './lib/scanner-action-plan-reminders';

const SCANNER_RESPONSE_PURGE_BATCH_SIZE = 100;

async function hasTable(db: D1Database, tableName: string): Promise<boolean> {
  return Boolean(await db.prepare(
    `SELECT 1 FROM "sqlite_master" WHERE "type" = 'table' AND "name" = ? LIMIT 1`,
  ).bind(tableName).first());
}

async function recordScannerPurgeAttempt(
  db: D1Database,
  responseId: number,
  status: 'pending' | 'artifacts_deleted' | 'completed',
  error: string | null,
): Promise<void> {
  const timestamp = new Date().toISOString();
  await db.prepare(
    `INSERT INTO "scanner_response_purge"
     ("response_id","status","attempt_count","last_error","created_at","updated_at","completed_at")
     VALUES (?,?,1,?,?,?,CASE WHEN ? = 'completed' THEN ? ELSE NULL END)
     ON CONFLICT("response_id") DO UPDATE SET
       "status" = excluded."status",
       "attempt_count" = "scanner_response_purge"."attempt_count" + 1,
       "last_error" = excluded."last_error",
       "updated_at" = excluded."updated_at",
       "completed_at" = CASE WHEN excluded."status" = 'completed' THEN excluded."updated_at" ELSE "scanner_response_purge"."completed_at" END`,
  ).bind(responseId, status, error, timestamp, timestamp, status, timestamp).run();
}

async function purgeExpiredScannerResponses(env: Cloudflare.Env): Promise<void> {
  // 0101 records put-before-persist writes; 0102 retains their cleanup handles
  // after raw response purge, including after a successful R2.delete.
  if (!await hasTable(env.DB, 'scanner_pdf_artifact_intent')
    || !await hasTable(env.DB, 'scanner_retired_artifact_tombstone')) {
    console.error('[scanner-retention] PDF intent/tombstone migration missing; purge deferred');
    return;
  }
  const now = new Date().toISOString();
  const { results = [] } = await env.DB.prepare(
    `SELECT response."id", response."pdf_combined_key", response."pdf_plan_key", response."pdf_analysis_key",
            response."image_analysis_key", response."image_plan_key", intent."storage_key" AS "pending_pdf_key"
     FROM "scanner_response" response
     LEFT JOIN "scanner_pdf_artifact_intent" intent ON intent."response_id" = response."id"
     WHERE response."expires_at" <= ?
     ORDER BY response."expires_at" ASC
     LIMIT ?`,
  ).bind(now, SCANNER_RESPONSE_PURGE_BATCH_SIZE).all<{
    id: number;
    pdf_combined_key: string | null;
    pdf_plan_key: string | null;
    pdf_analysis_key: string | null;
    image_analysis_key: string | null;
    image_plan_key: string | null;
    pending_pdf_key: string | null;
  }>();

  let hasLegacyImageCreditRun = false;
  let hasLegacyImageJob = false;
  try {
    hasLegacyImageCreditRun = await hasTable(env.DB, 'scanner_report_image_credit_run');
    hasLegacyImageJob = await hasTable(env.DB, 'scanner_report_image_job');
  } catch (error) {
    // Do not risk raw-response deletion if schema inspection is unavailable;
    // this response remains retryable and its failure is recorded per response.
    console.error('[scanner-retention] legacy schema inspection failed; purge deferred', {
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }

  for (const response of results) {
    // A PDF request that began before expiry owns this short write lease. Let it
    // finish and fail its conditional persistence, then purge on the next run.
    // This prevents a list/delete race with an R2 upload that appears afterward.
    if (await hasActiveScannerResponseOperationLease(env.DB, response.id)) {
      await recordScannerPurgeAttempt(env.DB, response.id, 'pending', 'response_operation_in_progress').catch((error) => {
        console.error('[scanner-retention] unable to record operation lease deferral', { responseId: response.id, error });
      });
      continue;
    }

    // Tombstones are inserted in the same D1 batch as response deletion. This is
    // deliberately before the delete statement, so no cleanup handle can vanish
    // with its FK-bound intent when raw PII is removed.
    try {
      await recordScannerPurgeAttempt(env.DB, response.id, 'artifacts_deleted', null);
      const statements: D1PreparedStatement[] = [
        // Re-read the response and intent inside the same D1 batch that deletes
        // them. A writer which committed its intent/key after the candidate list
        // was read is therefore still tombstoned before its response can vanish.
        env.DB.prepare(
          `INSERT OR IGNORE INTO "scanner_retired_artifact_tombstone"
             ("storage_key","write_token","artifact_kind","retired_at","created_at")
           SELECT "storage_key", "lease_token", 'pdf', datetime('now'), datetime('now')
           FROM "scanner_pdf_artifact_intent" WHERE "response_id" = ?`,
        ).bind(response.id),
        env.DB.prepare(
          `INSERT OR IGNORE INTO "scanner_retired_artifact_tombstone"
             ("storage_key","write_token","artifact_kind","retired_at","created_at")
           SELECT "storage_key", NULL, "artifact_kind", datetime('now'), datetime('now')
           FROM (
             SELECT "pdf_combined_key" AS "storage_key", 'pdf' AS "artifact_kind" FROM "scanner_response" WHERE "id" = ?
             UNION ALL SELECT "pdf_plan_key", 'pdf' FROM "scanner_response" WHERE "id" = ?
             UNION ALL SELECT "pdf_analysis_key", 'pdf' FROM "scanner_response" WHERE "id" = ?
             UNION ALL SELECT "image_analysis_key", 'image' FROM "scanner_response" WHERE "id" = ?
             UNION ALL SELECT "image_plan_key", 'image' FROM "scanner_response" WHERE "id" = ?
           ) AS artifacts WHERE "storage_key" IS NOT NULL`,
        ).bind(response.id, response.id, response.id, response.id, response.id),
        // New normalized plans are retention-safe and remain readable. Legacy
        // ai_plan-derived plans are not destructively rewritten; source purge
        // marks them unavailable because their historical content may be raw.
        env.DB.prepare(
          `UPDATE "scanner_action_plan"
           SET "source_response_id" = NULL,
                "source_response_purged_at" = COALESCE("source_response_purged_at", ?),
                "retention_visibility" = CASE
                  WHEN "retention_visibility" = 'legacy_source_bound' THEN 'unavailable'
                  ELSE "retention_visibility"
                END
           WHERE "source_response_id" = ?`,
        ).bind(now, response.id),
        env.DB.prepare('UPDATE "scanner_action_plan_score_snapshot" SET "response_id" = NULL WHERE "response_id" = ?').bind(response.id),
        env.DB.prepare('DELETE FROM "scanner_guest_report" WHERE "response_id" = ?').bind(response.id),
        env.DB.prepare('DELETE FROM "scanner_history" WHERE "response_id" = ?').bind(response.id),
        env.DB.prepare('DELETE FROM "scanner_ai_job" WHERE "response_id" = ?').bind(response.id),
        // Intent entries name uploads that may have succeeded before the process
        // crashed, even when no PDF key reached scanner_response.
        env.DB.prepare('DELETE FROM "scanner_pdf_artifact_intent" WHERE "response_id" = ?').bind(response.id),
      ];
      // 0087 removes these tables, but long-retained deployments can still have
      // them. Probe first: normal migrated D1 never prepares a nonexistent table.
      if (hasLegacyImageCreditRun) statements.push(
        env.DB.prepare('DELETE FROM "scanner_report_image_credit_run" WHERE "response_id" = ?').bind(response.id),
      );
      if (hasLegacyImageJob) statements.push(
        env.DB.prepare('DELETE FROM "scanner_report_image_job" WHERE "response_id" = ?').bind(response.id),
      );
      // scanner_credit_run references scanner_response. Its audit row must remain
      // after purge to preserve charged-run history, so detach instead of delete.
      statements.push(
        env.DB.prepare('UPDATE "scanner_credit_run" SET "response_id" = NULL, "updated_at" = ? WHERE "response_id" = ?').bind(now, response.id),
        // Preserve durable idempotency identity after raw-response purge. A
        // same-key replay can return a privacy-safe expired result, never create
        // another report or attach a different plan.
        env.DB.prepare(
          `UPDATE "scanner_submission"
           SET "response_id" = NULL,
               "response_purged_at" = COALESCE("response_purged_at", ?),
               "updated_at" = ?
           WHERE "response_id" = ?
              OR "id" = (
                SELECT "submission_id" FROM "scanner_response"
                WHERE "id" = ? AND "submission_id" IS NOT NULL
              )`,
        ).bind(now, now, response.id, response.id),
        env.DB.prepare('DELETE FROM "scanner_response" WHERE "id" = ?').bind(response.id),
      );
      const outcome = await env.DB.batch(statements);
      const deleted = outcome[outcome.length - 1]?.meta.changes ?? 0;
      if (deleted !== 1) throw new Error('scanner_response delete did not affect exactly one row');
      // Normalized plans and their opaque reminder ledger survive raw-response
      // purge. Legacy plans become unavailable and their reminder metadata is
      // removed by the scheduled lifecycle cleanup. R2 deletion is intentionally
      // asynchronous from this point: tombstones retry forever to catch late puts.
      await recordScannerPurgeAttempt(env.DB, response.id, 'completed', null);
      console.info('[scanner-retention] response purged with durable artifact tombstones', {
        responseId: response.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await recordScannerPurgeAttempt(env.DB, response.id, 'artifacts_deleted', message).catch((recordError) => {
        console.error('[scanner-retention] unable to record database purge failure', { responseId: response.id, error: recordError });
      });
      console.error('[scanner-retention] database purge failed; raw response retained for retry', { responseId: response.id, error: message });
    }
  }

  try {
    await env.DB.prepare('DELETE FROM "scanner_guest_request" WHERE "created_at" < ?')
      .bind(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .run();
  } catch (error) {
    // The guest-report tables may not exist until the corresponding migration runs.
    console.warn('[scanner-retention] Guest request cleanup skipped:', error);
  }
}

/**
 * Converts dead PDF write intents into independent cleanup handles before an
 * intent can be removed or cascaded. The tombstone is then the sole durable
 * cleanup authority, including if the writer's stale R2.put arrives later.
 */
async function reconcileScannerPdfArtifactIntents(env: Cloudflare.Env): Promise<void> {
  if (!await hasTable(env.DB, 'scanner_pdf_artifact_intent')
    || !await hasTable(env.DB, 'scanner_retired_artifact_tombstone')) return;
  const { results = [] } = await env.DB.prepare(
    `SELECT intent."response_id", intent."storage_key", intent."lease_token"
     FROM "scanner_pdf_artifact_intent" intent
     LEFT JOIN "scanner_response_operation_lease" lease
       ON lease."response_id" = intent."response_id"
       AND julianday(lease."lease_expires_at") > julianday('now')
     WHERE lease."response_id" IS NULL
     ORDER BY intent."updated_at" ASC
     LIMIT ?`,
  ).bind(SCANNER_RESPONSE_PURGE_BATCH_SIZE).all<{
    response_id: number;
    storage_key: string;
    lease_token: string;
  }>();

  for (const intent of results) {
    try {
      // This insert must complete before removing the FK-bound intent.
      await env.DB.prepare(
        `INSERT INTO "scanner_retired_artifact_tombstone"
           ("storage_key","write_token","artifact_kind","retired_at","created_at")
         VALUES (?,?,'pdf',datetime('now'),datetime('now'))
         ON CONFLICT("storage_key") DO NOTHING`,
      ).bind(intent.storage_key, intent.lease_token).run();
      await env.DB.prepare(
        `DELETE FROM "scanner_pdf_artifact_intent"
         WHERE "response_id" = ? AND "storage_key" = ? AND "lease_token" = ?`,
      ).bind(intent.response_id, intent.storage_key, intent.lease_token).run();
    } catch (error) {
      console.error('[scanner-retention] pending PDF intent tombstone failed; intent retained for retry', {
        responseId: intent.response_id,
        key: intent.storage_key,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/**
 * Tombstones are intentionally never deleted. A delete that succeeded today
 * cannot prove that a lease-fenced writer will not complete its stale put later.
 * Token-scoped keys make repeat deletion safe: no later valid artifact can share
 * this object name. The bounded schedule records every outcome for review.
 */
async function reconcileRetiredScannerArtifactTombstones(env: Cloudflare.Env): Promise<void> {
  if (!await hasTable(env.DB, 'scanner_retired_artifact_tombstone')) return;
  const { results = [] } = await env.DB.prepare(
    `SELECT "storage_key"
     FROM "scanner_retired_artifact_tombstone"
     ORDER BY COALESCE("last_delete_attempt_at", "retired_at") ASC
     LIMIT ?`,
  ).bind(SCANNER_RESPONSE_PURGE_BATCH_SIZE).all<{ storage_key: string }>();

  for (const tombstone of results) {
    const timestamp = new Date().toISOString();
    try {
      await env.MEDIA.delete(tombstone.storage_key);
      await env.DB.prepare(
        `UPDATE "scanner_retired_artifact_tombstone"
         SET "last_delete_attempt_at" = ?, "last_delete_succeeded_at" = ?,
             "last_error" = NULL, "delete_attempt_count" = "delete_attempt_count" + 1
         WHERE "storage_key" = ?`,
      ).bind(timestamp, timestamp, tombstone.storage_key).run();
      console.info('[scanner-retention] retired artifact tombstone delete succeeded', {
        key: tombstone.storage_key,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await env.DB.prepare(
        `UPDATE "scanner_retired_artifact_tombstone"
         SET "last_delete_attempt_at" = ?, "last_delete_failed_at" = ?, "last_error" = ?,
             "delete_attempt_count" = "delete_attempt_count" + 1
         WHERE "storage_key" = ?`,
      ).bind(timestamp, timestamp, message.slice(0, 500), tombstone.storage_key).run().catch((updateError) => {
        console.error('[scanner-retention] unable to record tombstone delete failure', {
          key: tombstone.storage_key,
          error: updateError instanceof Error ? updateError.message : String(updateError),
        });
      });
      console.error('[scanner-retention] retired artifact tombstone delete failed; retained indefinitely', {
        key: tombstone.storage_key,
        error: message,
      });
    }
  }
}

async function retryPendingScannerSubmissionSnapshots(env: Cloudflare.Env): Promise<void> {
  let pending;
  try {
    pending = await listPendingScannerSubmissionSnapshots(env.DB, SCANNER_RESPONSE_PURGE_BATCH_SIZE);
  } catch (error) {
    console.error('[scanner-rescan-link] unable to load pending submissions:', error);
    return;
  }
  for (const submission of pending) {
    try {
      await linkScannerSubmissionSnapshot(env.DB, submission.id);
    } catch (error) {
      console.error('[scanner-rescan-link] snapshot retry failed:', {
        submissionId: submission.id,
        responseId: submission.response_id,
        planId: submission.action_plan_id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

const MAX_QUEUE_ATTEMPTS = 3;
const SCANNER_AI_QUEUE_CONCURRENCY = 3;

async function dispatchScannerAiJob(
  env: Cloudflare.Env,
  job: ScannerAiQueueMessage,
  retryAfterSeconds = 0,
): Promise<void> {
  if (!await claimScannerAiJobDispatch(env.DB, job.responseId, job.jobType, job.runId, retryAfterSeconds)) return;
  try {
    await getScannerAiQueue(env, job.jobType).send(job);
    await confirmScannerAiJobDispatched(env.DB, job.responseId, job.jobType, job.runId);
  } catch (error) {
    // The conditional claim leaves dispatch_pending_at set. A later scheduled
    // run retries only this producer-failed candidate, not ordinary queued work.
    console.error('[scanner-ai-reaper] Queue dispatch failed:', error);
  }
}

async function processQueueMessage(
  message: Message<ScannerAiQueueMessage>,
  env: Cloudflare.Env,
): Promise<void> {
  const result = await processScannerAiQueueMessage(env, message.body);
  if (result.completed || !result.retryable) return;

  if (message.attempts < MAX_QUEUE_ATTEMPTS) {
    // Only the active same-run lease can be requeued; a late redelivery must
    // never replace a newer run or start provider work concurrently.
    if (await requeueScannerAiJob(env.DB, message.body.responseId, message.body.jobType, message.body.runId)) {
      message.retry({ delaySeconds: retryDelaySeconds(message.attempts) });
    }
    return;
  }

  // A stale duplicate may have been superseded while it was executing. Fail
  // only the matching active lease, atomically with the visible response status.
  await failScannerAiJobWithResponseStatus(
    env.DB,
    message.body.responseId,
    message.body.jobType,
    message.body.runId,
    'Queue retry limit reached',
  );
}

async function reapStaleScannerAiJobs(env: Cloudflare.Env): Promise<void> {
  // Reclaim fencing produces a fresh run ID before the replacement is queued.
  const reclaimed = await reclaimStaleScannerAiJobs(env.DB);
  for (const job of reclaimed) await dispatchScannerAiJob(env, job);

  // Retry only jobs whose prior Queue.send did not confirm; routine queued jobs
  // are Queue-owned and intentionally never polled or spammed by the scheduler.
  const pendingDispatch = await getScannerAiJobsPendingDispatch(env.DB);
  for (const job of pendingDispatch) await dispatchScannerAiJob(env, job, 60);
}

async function maintainScannerActionPlanReminders(db: D1Database): Promise<void> {
  // Run lifecycle cancellation before recovery, then run normal candidate scheduling
  // after recovery. This prevents cleanup from racing a claimed-row finalization.
  try {
    await cleanupScannerActionPlanReminders(db);
  } catch (error) {
    console.error('[scanner-reminders] lifecycle cleanup failed', error);
  }
  await reclaimStaleScannerActionPlanReminderClaims(db);
  await scheduleScannerActionPlanReminders(db);
}

export default {
  fetch: handle,

  async scheduled(_controller: ScheduledController, env: Cloudflare.Env): Promise<void> {
    // Purge first, then transform detached intents, then repeatedly sweep every
    // tombstone. This ordering prevents intent cleanup from losing the only
    // handle for a late R2 write.
    await purgeExpiredScannerResponses(env);
    await reconcileScannerPdfArtifactIntents(env);
    await Promise.all([
      reconcileRetiredScannerArtifactTombstones(env),
      retryPendingScannerSubmissionSnapshots(env),
      reapStaleScannerAiJobs(env),
      maintainScannerActionPlanReminders(env.DB),
    ]);
  },

  async queue(batch: MessageBatch<ScannerAiQueueMessage>, env: Cloudflare.Env): Promise<void> {
    // Queue batches may contain unrelated reports. A bounded pool prevents one
    // slow model response from making every later Scanner wait in sequence.
    for (let index = 0; index < batch.messages.length; index += SCANNER_AI_QUEUE_CONCURRENCY) {
      await Promise.all(batch.messages
        .slice(index, index + SCANNER_AI_QUEUE_CONCURRENCY)
        .map((message) => processQueueMessage(message, env)));
    }
  },
} satisfies ExportedHandler<Cloudflare.Env, ScannerAiQueueMessage>;
