// Scanner Action Plan in-app reminder scheduling and idempotent delivery.
// Payloads intentionally contain no raw Scanner answers, scores, action titles,
// descriptions, or progress notes.

import type { ScannerActionPlanActionRow, ScannerActionPlanRow } from './scanner-action-plan-db';

export const SCANNER_ACTION_PLAN_REMINDER_BATCH_SIZE = 25;
const CLAIM_STALE_AFTER_MS = 30 * 60 * 1_000;
const PLAN_NOT_STARTED_AFTER_DAYS = 7;
const ACTION_OVERDUE_AFTER_DAYS = 7;
const RESCAN_AFTER_DAYS = 30;

export type ScannerActionPlanReminderKind =
  | 'plan_not_started'
  | 'action_due'
  | 'action_overdue'
  | 'rescan_due';

export interface ScannerActionPlanReminderCandidate {
  planId: string;
  actionId: string | null;
  userId: string;
  kind: ScannerActionPlanReminderKind;
}

type ReminderPlanRow = Pick<ScannerActionPlanRow,
  'id' | 'user_id' | 'status' | 'generation_state' | 'retention_visibility' | 'created_at'>;
type ReminderActionRow = Pick<ScannerActionPlanActionRow,
  'id' | 'plan_id' | 'status' | 'target_days' | 'created_at'>;

function addDays(value: string, days: number): Date | null {
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) return null;
  return new Date(milliseconds + days * 24 * 60 * 60 * 1_000);
}

/** Returns the one-shot due time for a reminder kind, or null when no schedule exists. */
export function getScannerActionPlanReminderDueAt(
  plan: Pick<ReminderPlanRow, 'created_at'>,
  kind: ScannerActionPlanReminderKind,
  action?: Pick<ReminderActionRow, 'created_at' | 'target_days'> | null,
): Date | null {
  if (kind === 'plan_not_started') return addDays(plan.created_at, PLAN_NOT_STARTED_AFTER_DAYS);
  if (kind === 'rescan_due') return addDays(plan.created_at, RESCAN_AFTER_DAYS);
  if (!action || action.target_days === null) return null;
  return addDays(action.created_at, action.target_days + (kind === 'action_overdue' ? ACTION_OVERDUE_AFTER_DAYS : 0));
}

/** Pure lifecycle guard shared by candidate scheduling and delivery claiming. */
export function isScannerActionPlanReminderEligible(
  plan: Pick<ReminderPlanRow, 'status' | 'generation_state' | 'retention_visibility'>,
  kind: ScannerActionPlanReminderKind,
  action?: Pick<ReminderActionRow, 'status' | 'target_days'> | null,
): boolean {
  if (plan.status !== 'active' || plan.generation_state !== 'ready' || plan.retention_visibility !== 'available') return false;
  if (kind === 'rescan_due') return true;
  if (kind === 'plan_not_started') return action?.status === 'not_started';
  return action !== null
    && action !== undefined
    && action.target_days !== null
    && action.status !== 'completed'
    && action.status !== 'skipped';
}

/** The durable schedule key prevents retries, concurrent cron invocations, and deploy replays from duplicating delivery. */
export function getScannerActionPlanReminderScheduleKey(candidate: ScannerActionPlanReminderCandidate): string {
  return `scanner-action-plan-reminder:v1:${candidate.kind}:${candidate.planId}:${candidate.actionId ?? 'plan'}`;
}

function reminderCopy(kind: ScannerActionPlanReminderKind): { type: string; title: string; body: string } {
  switch (kind) {
    case 'plan_not_started':
      return {
        type: 'scanner_action_plan_reminder',
        title: 'Kế hoạch Scanner đang chờ bắt đầu',
        body: 'Mở kế hoạch hành động để xem việc ưu tiên tiếp theo.',
      };
    case 'action_due':
      return {
        type: 'scanner_action_due',
        title: 'Một việc trong kế hoạch Scanner đến hạn',
        body: 'Mở kế hoạch hành động để cập nhật tiến độ.',
      };
    case 'action_overdue':
      return {
        type: 'scanner_action_overdue',
        title: 'Một việc trong kế hoạch Scanner đã quá hạn',
        body: 'Mở kế hoạch hành động để rà soát tiến độ.',
      };
    case 'rescan_due':
      return {
        type: 'scanner_rescan_due',
        title: 'Đến lúc quét lại Scanner',
        body: 'Thực hiện một lần quét lại để so sánh tiến độ hệ thống.',
      };
  }
}

function reminderId(): string {
  return crypto.randomUUID();
}

async function listReminderCandidates(db: D1Database, now: string): Promise<ScannerActionPlanReminderCandidate[]> {
  const limit = SCANNER_ACTION_PLAN_REMINDER_BATCH_SIZE;
  const planEligibility = `plan."status" = 'active'
    AND plan."generation_state" = 'ready'
    AND plan."retention_visibility" = 'available'`;
  const [notStarted, due, overdue, rescan] = await Promise.all([
    db.prepare(
      `SELECT plan."id" AS "plan_id", plan."user_id" AS "user_id"
       FROM "scanner_action_plan" plan
       WHERE ${planEligibility}
         AND julianday(?) >= julianday(plan."created_at") + ?
         AND EXISTS (
           SELECT 1 FROM "scanner_action_plan_action" action
           WHERE action."plan_id" = plan."id" AND action."status" = 'not_started'
         )
         AND NOT EXISTS (
           SELECT 1 FROM "scanner_action_plan_action" action
           WHERE action."plan_id" = plan."id" AND action."status" IN ('in_progress', 'completed')
         )
       ORDER BY plan."created_at" ASC, plan."id" ASC
       LIMIT ?`,
    ).bind(now, PLAN_NOT_STARTED_AFTER_DAYS, limit).all<{ plan_id: string; user_id: string }>(),
    db.prepare(
      `SELECT action."id" AS "action_id", action."plan_id" AS "plan_id", plan."user_id" AS "user_id"
       FROM "scanner_action_plan_action" action
       INNER JOIN "scanner_action_plan" plan ON plan."id" = action."plan_id"
       WHERE ${planEligibility}
         AND action."target_days" IS NOT NULL
         AND action."status" NOT IN ('completed', 'skipped')
         AND julianday(?) >= julianday(action."created_at") + action."target_days"
         AND julianday(?) < julianday(action."created_at") + action."target_days" + ?
       ORDER BY action."created_at" ASC, action."id" ASC
       LIMIT ?`,
    ).bind(now, now, ACTION_OVERDUE_AFTER_DAYS, limit).all<{ action_id: string; plan_id: string; user_id: string }>(),
    db.prepare(
      `SELECT action."id" AS "action_id", action."plan_id" AS "plan_id", plan."user_id" AS "user_id"
       FROM "scanner_action_plan_action" action
       INNER JOIN "scanner_action_plan" plan ON plan."id" = action."plan_id"
       WHERE ${planEligibility}
         AND action."target_days" IS NOT NULL
         AND action."status" NOT IN ('completed', 'skipped')
         AND julianday(?) >= julianday(action."created_at") + action."target_days" + ?
       ORDER BY action."created_at" ASC, action."id" ASC
       LIMIT ?`,
    ).bind(now, ACTION_OVERDUE_AFTER_DAYS, limit).all<{ action_id: string; plan_id: string; user_id: string }>(),
    db.prepare(
      `SELECT plan."id" AS "plan_id", plan."user_id" AS "user_id"
       FROM "scanner_action_plan" plan
       WHERE ${planEligibility}
         AND julianday(?) >= julianday(plan."created_at") + ?
         AND NOT EXISTS (
           SELECT 1 FROM "scanner_action_plan_score_snapshot" snapshot
           WHERE snapshot."plan_id" = plan."id" AND snapshot."snapshot_kind" = 'rescan'
         )
       ORDER BY plan."created_at" ASC, plan."id" ASC
       LIMIT ?`,
    ).bind(now, RESCAN_AFTER_DAYS, limit).all<{ plan_id: string; user_id: string }>(),
  ]);

  return [
    ...(notStarted.results ?? []).map((row) => ({ planId: row.plan_id, actionId: null, userId: row.user_id, kind: 'plan_not_started' as const })),
    ...(due.results ?? []).map((row) => ({ planId: row.plan_id, actionId: row.action_id, userId: row.user_id, kind: 'action_due' as const })),
    ...(overdue.results ?? []).map((row) => ({ planId: row.plan_id, actionId: row.action_id, userId: row.user_id, kind: 'action_overdue' as const })),
    ...(rescan.results ?? []).map((row) => ({ planId: row.plan_id, actionId: null, userId: row.user_id, kind: 'rescan_due' as const })),
  ];
}

async function deliverReminder(db: D1Database, candidate: ScannerActionPlanReminderCandidate, now: string): Promise<void> {
  const scheduleKey = getScannerActionPlanReminderScheduleKey(candidate);
  const deliveryId = reminderId();
  const notificationId = reminderId();
  const staleBefore = new Date(Date.parse(now) - CLAIM_STALE_AFTER_MS).toISOString();

  // The unique schedule key is the idempotency boundary. This insert is also guarded
  // by the migration trigger so an archive/retention race never creates new work.
  try {
    await db.prepare(
      `INSERT OR IGNORE INTO "scanner_action_plan_reminder"
       ("id","notification_id","schedule_key","plan_id","action_id","user_id","kind","state","claimed_at","delivered_at","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,'pending',NULL,NULL,?,?)`,
    ).bind(deliveryId, notificationId, scheduleKey, candidate.planId, candidate.actionId, candidate.userId, candidate.kind, now, now).run();
  } catch (error) {
    // The trigger may reject a plan that changed after candidate selection. It is an
    // expected lifecycle race, not a scheduler-wide error.
    console.info('[scanner-reminders] candidate suppressed before ledger insert', { planId: candidate.planId, kind: candidate.kind });
    return;
  }

  const claimed = await db.prepare(
    `UPDATE "scanner_action_plan_reminder"
     SET "state" = 'claimed', "claimed_at" = ?, "updated_at" = ?
     WHERE "schedule_key" = ?
       AND ("state" = 'pending' OR ("state" = 'claimed' AND "claimed_at" < ?))
       AND EXISTS (
         SELECT 1 FROM "scanner_action_plan" plan
         WHERE plan."id" = "scanner_action_plan_reminder"."plan_id"
           AND plan."user_id" = "scanner_action_plan_reminder"."user_id"
           AND plan."status" = 'active'
           AND plan."generation_state" = 'ready'
           AND plan."retention_visibility" = 'available'
       )
       AND (
         "action_id" IS NULL OR EXISTS (
           SELECT 1 FROM "scanner_action_plan_action" action
           WHERE action."id" = "scanner_action_plan_reminder"."action_id"
             AND action."plan_id" = "scanner_action_plan_reminder"."plan_id"
             AND action."status" NOT IN ('completed', 'skipped')
         )
       )
       AND (
         "kind" != 'plan_not_started' OR (
           EXISTS (
             SELECT 1 FROM "scanner_action_plan_action" action
             WHERE action."plan_id" = "scanner_action_plan_reminder"."plan_id"
               AND action."status" = 'not_started'
           )
           AND NOT EXISTS (
             SELECT 1 FROM "scanner_action_plan_action" action
             WHERE action."plan_id" = "scanner_action_plan_reminder"."plan_id"
               AND action."status" IN ('in_progress', 'completed')
           )
         )
       )
       AND (
         "kind" != 'rescan_due' OR NOT EXISTS (
           SELECT 1 FROM "scanner_action_plan_score_snapshot" snapshot
           WHERE snapshot."plan_id" = "scanner_action_plan_reminder"."plan_id"
             AND snapshot."snapshot_kind" = 'rescan'
         )
       )`,
  ).bind(now, now, scheduleKey, staleBefore).run();
  if ((claimed.meta.changes ?? 0) !== 1) return;

  const copy = reminderCopy(candidate.kind);
  const link = `/account/action-plans/${candidate.planId}`;
  // Delivery is one D1 batch: notification creation and ledger finalization commit
  // together. A worker crash therefore leaves a stale claim for safe retry rather
  // than creating an untracked notification that could be sent again.
  const delivery = await db.batch([
    db.prepare(
      `INSERT OR IGNORE INTO "notification" ("id","user_id","type","title","body","link","read","createdAt")
       SELECT reminder."notification_id", reminder."user_id", ?, ?, ?, ?, 0, ?
       FROM "scanner_action_plan_reminder" reminder
       WHERE reminder."schedule_key" = ? AND reminder."state" = 'claimed'
         AND EXISTS (
           SELECT 1 FROM "scanner_action_plan" plan
           WHERE plan."id" = reminder."plan_id" AND plan."user_id" = reminder."user_id"
             AND plan."status" = 'active' AND plan."generation_state" = 'ready'
             AND plan."retention_visibility" = 'available'
         )
          AND (reminder."action_id" IS NULL OR EXISTS (
            SELECT 1 FROM "scanner_action_plan_action" action
            WHERE action."id" = reminder."action_id" AND action."plan_id" = reminder."plan_id"
              AND action."status" NOT IN ('completed', 'skipped')
          ))
          AND (reminder."kind" != 'plan_not_started' OR (
            EXISTS (
              SELECT 1 FROM "scanner_action_plan_action" action
              WHERE action."plan_id" = reminder."plan_id" AND action."status" = 'not_started'
            )
            AND NOT EXISTS (
              SELECT 1 FROM "scanner_action_plan_action" action
              WHERE action."plan_id" = reminder."plan_id" AND action."status" IN ('in_progress', 'completed')
            )
          ))
          AND (reminder."kind" != 'rescan_due' OR NOT EXISTS (
           SELECT 1 FROM "scanner_action_plan_score_snapshot" snapshot
           WHERE snapshot."plan_id" = reminder."plan_id" AND snapshot."snapshot_kind" = 'rescan'
         ))`,
    ).bind(copy.type, copy.title, copy.body, link, now, scheduleKey),
    db.prepare(
      `UPDATE "scanner_action_plan_reminder"
       SET "state" = CASE WHEN EXISTS (
             SELECT 1 FROM "notification" notification
             WHERE notification."id" = "scanner_action_plan_reminder"."notification_id"
           ) THEN 'delivered' ELSE 'canceled' END,
           "delivered_at" = CASE WHEN EXISTS (
             SELECT 1 FROM "notification" notification
             WHERE notification."id" = "scanner_action_plan_reminder"."notification_id"
           ) THEN ? ELSE NULL END,
           "updated_at" = ?
       WHERE "schedule_key" = ? AND "state" = 'claimed'`,
    ).bind(now, now, scheduleKey),
  ]);
  if ((delivery[1]?.meta.changes ?? 0) !== 1) throw new Error('Scanner reminder ledger delivery finalization failed.');
}

/** Schedules a bounded, independently isolated batch of in-app reminders. */
export async function scheduleScannerActionPlanReminders(db: D1Database): Promise<void> {
  const now = new Date().toISOString();
  let candidates: ScannerActionPlanReminderCandidate[];
  try {
    candidates = await listReminderCandidates(db, now);
  } catch (error) {
    console.error('[scanner-reminders] candidate query failed', error);
    return;
  }

  for (const candidate of candidates) {
    try {
      await deliverReminder(db, candidate, now);
    } catch (error) {
      console.error('[scanner-reminders] reminder delivery failed', {
        planId: candidate.planId,
        actionId: candidate.actionId,
        kind: candidate.kind,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/** Retention policy: ledger and in-app notification stay only for visible active plans. */
export async function cleanupScannerActionPlanReminders(db: D1Database): Promise<void> {
  const now = new Date().toISOString();
  await db.batch([
    // Pending/claimed work is canceled as soon as its lifecycle condition ceases
    // to be true. Delivered notifications remain as ordinary in-app history until
    // the parent plan is archived or unavailable.
    db.prepare(
      `UPDATE "scanner_action_plan_reminder"
       SET "state" = 'canceled', "updated_at" = ?
       WHERE "state" IN ('pending', 'claimed')
         AND (
           EXISTS (
             SELECT 1 FROM "scanner_action_plan" plan
             WHERE plan."id" = "scanner_action_plan_reminder"."plan_id"
               AND (plan."status" != 'active' OR plan."retention_visibility" != 'available')
           )
           OR ("action_id" IS NOT NULL AND EXISTS (
             SELECT 1 FROM "scanner_action_plan_action" action
             WHERE action."id" = "scanner_action_plan_reminder"."action_id"
               AND action."status" IN ('completed', 'skipped')
           ))
           OR ("kind" = 'plan_not_started' AND EXISTS (
             SELECT 1 FROM "scanner_action_plan_action" action
             WHERE action."plan_id" = "scanner_action_plan_reminder"."plan_id"
               AND action."status" IN ('in_progress', 'completed')
           ))
           OR ("kind" = 'rescan_due' AND EXISTS (
             SELECT 1 FROM "scanner_action_plan_score_snapshot" snapshot
             WHERE snapshot."plan_id" = "scanner_action_plan_reminder"."plan_id"
               AND snapshot."snapshot_kind" = 'rescan'
           ))
         )`,
    ).bind(now),
    db.prepare(
      `DELETE FROM "notification"
       WHERE "id" IN (
         SELECT reminder."notification_id"
         FROM "scanner_action_plan_reminder" reminder
         INNER JOIN "scanner_action_plan" plan ON plan."id" = reminder."plan_id"
         WHERE plan."status" != 'active' OR plan."retention_visibility" != 'available'
       )`,
    ),
    db.prepare(
      `DELETE FROM "scanner_action_plan_reminder"
       WHERE "plan_id" IN (
         SELECT "id" FROM "scanner_action_plan"
         WHERE "status" != 'active' OR "retention_visibility" != 'available'
       )`,
    ),
  ]);
}
