import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getScannerActionPlanReminderDueAt,
  getScannerActionPlanReminderScheduleKey,
  isScannerActionPlanReminderClaimStale,
  isScannerActionPlanReminderEligible,
  SCANNER_ACTION_PLAN_REMINDER_CLAIM_STALE_AFTER_MS,
} from '../src/lib/scanner-action-plan-reminders.ts';

const activePlan = {
  id: 'plan-1',
  user_id: 'user-1',
  status: 'active' as const,
  generation_state: 'ready' as const,
  retention_visibility: 'available' as const,
  created_at: '2026-01-01T00:00:00.000Z',
};

const dueAction = {
  id: 'action-1',
  plan_id: activePlan.id,
  status: 'not_started' as const,
  target_days: 14,
  created_at: activePlan.created_at,
};

test('schedules plan, action, and rescan reminders from normalized timestamps', () => {
  assert.equal(getScannerActionPlanReminderDueAt(activePlan, 'plan_not_started')?.toISOString(), '2026-01-08T00:00:00.000Z');
  assert.equal(getScannerActionPlanReminderDueAt(activePlan, 'action_due', dueAction)?.toISOString(), '2026-01-15T00:00:00.000Z');
  assert.equal(getScannerActionPlanReminderDueAt(activePlan, 'action_overdue', dueAction)?.toISOString(), '2026-01-22T00:00:00.000Z');
  assert.equal(getScannerActionPlanReminderDueAt(activePlan, 'rescan_due')?.toISOString(), '2026-01-31T00:00:00.000Z');
  assert.equal(getScannerActionPlanReminderDueAt(activePlan, 'action_due', { ...dueAction, target_days: null }), null);
});

test('suppresses reminder delivery for archived, unavailable, terminal, and untargeted work', () => {
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'plan_not_started', dueAction), true);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'plan_not_started', { ...dueAction, status: 'in_progress' }), false);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'action_due', dueAction), true);
  assert.equal(isScannerActionPlanReminderEligible({ ...activePlan, status: 'archived' }, 'rescan_due'), false);
  assert.equal(isScannerActionPlanReminderEligible({ ...activePlan, retention_visibility: 'unavailable' }, 'plan_not_started'), false);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'action_due', { ...dueAction, status: 'completed' }), false);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'action_overdue', { ...dueAction, status: 'skipped' }), false);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'action_due', { ...dueAction, target_days: null }), false);
});

test('reclaims aged action_due claims using current lifecycle eligibility, not their original due window', () => {
  const now = new Date('2026-02-01T12:00:00.000Z');
  const staleAt = new Date(now.getTime() - SCANNER_ACTION_PLAN_REMINDER_CLAIM_STALE_AFTER_MS - 1).toISOString();
  const thresholdAt = new Date(now.getTime() - SCANNER_ACTION_PLAN_REMINDER_CLAIM_STALE_AFTER_MS).toISOString();

  // The action_due schedule was Jan 15, but it remains valid work on Feb 1. Recovery
  // must therefore retry it rather than reapply the original seven-day due window.
  assert.equal(getScannerActionPlanReminderDueAt(activePlan, 'action_due', dueAction)?.toISOString(), '2026-01-15T00:00:00.000Z');
  assert.equal(isScannerActionPlanReminderClaimStale(staleAt, now), true);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'action_due', dueAction), true);
  assert.equal(isScannerActionPlanReminderClaimStale(thresholdAt, now), false);
  assert.equal(isScannerActionPlanReminderClaimStale(null, now), true);
  assert.equal(isScannerActionPlanReminderClaimStale('not-a-date', now), true);
  assert.equal(isScannerActionPlanReminderEligible(activePlan, 'action_due', { ...dueAction, status: 'completed' }), false);
});

test('uses deterministic plan/action scoped schedule keys for durable dedupe', () => {
  const candidate = { planId: activePlan.id, actionId: dueAction.id, userId: activePlan.user_id, kind: 'action_due' as const };
  assert.equal(getScannerActionPlanReminderScheduleKey(candidate), getScannerActionPlanReminderScheduleKey(candidate));
  assert.notEqual(
    getScannerActionPlanReminderScheduleKey(candidate),
    getScannerActionPlanReminderScheduleKey({ ...candidate, kind: 'action_overdue' }),
  );
  assert.notEqual(
    getScannerActionPlanReminderScheduleKey(candidate),
    getScannerActionPlanReminderScheduleKey({ ...candidate, actionId: 'action-2' }),
  );
});
