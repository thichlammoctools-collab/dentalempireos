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
  const now = new Date().toISOString();
  const { results = [] } = await env.DB.prepare(
    `SELECT "id", "pdf_combined_key", "pdf_plan_key", "pdf_analysis_key", "image_analysis_key", "image_plan_key"
     FROM "scanner_response"
     WHERE "expires_at" <= ?
     ORDER BY "expires_at" ASC
     LIMIT ?`,
  ).bind(now, SCANNER_RESPONSE_PURGE_BATCH_SIZE).all<{
    id: number;
    pdf_combined_key: string | null;
    pdf_plan_key: string | null;
    pdf_analysis_key: string | null;
    image_analysis_key: string | null;
    image_plan_key: string | null;
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

    const keys = [
      response.pdf_combined_key,
      response.pdf_plan_key,
      response.pdf_analysis_key,
      response.image_analysis_key,
      response.image_plan_key,
    ].filter((key): key is string => Boolean(key));

    // R2 deletion is the privacy gate. If any artifact cannot be deleted, retain
    // the raw D1 row and retry this response on the next schedule; logging each
    // failed key keeps the failure observable without blocking later responses.
    let artifactsDeleted = true;
    for (const key of keys) {
      try {
        await env.MEDIA.delete(key);
      } catch (error) {
        artifactsDeleted = false;
        console.error('[scanner-retention] artifact deletion failed; response retained for retry', {
          responseId: response.id,
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    if (!artifactsDeleted) {
      await recordScannerPurgeAttempt(env.DB, response.id, 'pending', 'artifact_delete_failed').catch((error) => {
        console.error('[scanner-retention] unable to record artifact deletion failure', { responseId: response.id, error });
      });
      continue;
    }

    try {
      await recordScannerPurgeAttempt(env.DB, response.id, 'artifacts_deleted', null);
      const statements: D1PreparedStatement[] = [
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
      // removed by the scheduled lifecycle cleanup.
      await recordScannerPurgeAttempt(env.DB, response.id, 'completed', null);
      console.info('[scanner-retention] response purged', { responseId: response.id, artifactCount: keys.length });
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
    await Promise.all([
      purgeExpiredScannerResponses(env),
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
