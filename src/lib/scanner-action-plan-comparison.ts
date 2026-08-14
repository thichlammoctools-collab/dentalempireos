// Deterministic, score-snapshot-only Scanner action plan comparison.
// This intentionally reports measured changes only; it never attributes changes to plan actions.

import {
  getScannerActionPlanActions,
  getScannerActionPlanForUser,
  getScannerActionPlanSnapshots,
  type ScannerActionPlanScoreSnapshotRow,
  type ScannerActionStatus,
} from './scanner-action-plan-db';
import { parseScores } from './scanner-response-db';

export type ScannerActionPlanComparisonQuality = 'complete' | 'partial' | 'invalid';

export interface ScannerActionPlanComparison {
  planId: string;
  surveyId: string;
  baseline: ScoreSnapshotView | null;
  selectedRescan: ScoreSnapshotView | null;
  totals: { baseline: number | null; rescan: number | null; delta: number | null };
  dimensions: Array<{ dimension: string; baseline: number | null; rescan: number | null; delta: number | null }>;
  actionStatusSummary: Record<ScannerActionStatus, number>;
  quality: ScannerActionPlanComparisonQuality;
  reason: 'ok' | 'no_baseline' | 'no_rescan' | 'invalid_scores';
}

export interface ScoreSnapshotView {
  id: string;
  responseCreatedAt: string;
  scoreTotal: number | null;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function snapshotView(snapshot: ScannerActionPlanScoreSnapshotRow): ScoreSnapshotView {
  return {
    id: snapshot.id,
    responseCreatedAt: snapshot.response_created_at,
    scoreTotal: numberOrNull(snapshot.score_total),
  };
}

function pickRescan(
  rescans: ScannerActionPlanScoreSnapshotRow[],
  selectedId?: string,
): ScannerActionPlanScoreSnapshotRow | null {
  if (selectedId) return rescans.find((snapshot) => snapshot.id === selectedId) ?? null;
  return rescans.length > 0 ? rescans[rescans.length - 1] : null;
}

export async function getScannerActionPlanComparison(
  db: D1Database,
  input: { planId: string; userId: string; rescanSnapshotId?: string },
): Promise<ScannerActionPlanComparison | null> {
  const plan = await getScannerActionPlanForUser(db, input.planId, input.userId);
  if (!plan || plan.retention_visibility === 'unavailable') return null;

  const [snapshots, actions] = await Promise.all([
    getScannerActionPlanSnapshots(db, plan.id),
    getScannerActionPlanActions(db, plan.id),
  ]);
  const baseline = snapshots.find((snapshot) => snapshot.snapshot_kind === 'baseline') ?? null;
  const rescans = snapshots.filter((snapshot) => snapshot.snapshot_kind === 'rescan');
  const selectedRescan = pickRescan(rescans, input.rescanSnapshotId);
  const actionStatusSummary: Record<ScannerActionStatus, number> = {
    not_started: 0,
    in_progress: 0,
    completed: 0,
    skipped: 0,
  };
  for (const action of actions) actionStatusSummary[action.status] += 1;

  const common = {
    planId: plan.id,
    surveyId: plan.survey_id,
    baseline: baseline ? snapshotView(baseline) : null,
    selectedRescan: selectedRescan ? snapshotView(selectedRescan) : null,
    actionStatusSummary,
  };
  if (!baseline) {
    return { ...common, totals: { baseline: null, rescan: null, delta: null }, dimensions: [], quality: 'invalid', reason: 'no_baseline' };
  }
  if (!selectedRescan) {
    return { ...common, totals: { baseline: numberOrNull(baseline.score_total), rescan: null, delta: null }, dimensions: [], quality: 'partial', reason: 'no_rescan' };
  }

  const baselineScores = parseScores(baseline.scores_json);
  const rescanScores = parseScores(selectedRescan.scores_json);
  const baselineTotal = numberOrNull(baselineScores.total) ?? numberOrNull(baseline.score_total);
  const rescanTotal = numberOrNull(rescanScores.total) ?? numberOrNull(selectedRescan.score_total);
  const dimensionNames = [...new Set([
    ...Object.keys(baselineScores).filter((key) => key !== 'total'),
    ...Object.keys(rescanScores).filter((key) => key !== 'total'),
  ])].sort();
  const dimensions = dimensionNames.map((dimension) => {
    const baselineScore = numberOrNull(baselineScores[dimension]);
    const rescanScore = numberOrNull(rescanScores[dimension]);
    return {
      dimension,
      baseline: baselineScore,
      rescan: rescanScore,
      delta: baselineScore !== null && rescanScore !== null ? rescanScore - baselineScore : null,
    };
  });
  const scoresValid = baselineTotal !== null && rescanTotal !== null && dimensions.every(
    (dimension) => dimension.baseline !== null && dimension.rescan !== null,
  );

  return {
    ...common,
    totals: {
      baseline: baselineTotal,
      rescan: rescanTotal,
      delta: baselineTotal !== null && rescanTotal !== null ? rescanTotal - baselineTotal : null,
    },
    dimensions,
    quality: scoresValid ? 'complete' : 'partial',
    reason: scoresValid ? 'ok' : 'invalid_scores',
  };
}
