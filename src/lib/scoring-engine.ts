// Generic scoring engine for survey definitions.
// Calculates dimension scores + total from response data and configurable scoring rules.
// Replaces the hardcoded calculateScores() in survey-db.ts.

import type { ScoringRules, ScoringDimension } from './survey-config-db';

export type ResponseMap = Record<string, unknown>;

export interface ScoreLevel {
  label_vi: string;
  label_en: string;
  color: string;
}

const DEFAULT_THRESHOLDS = {
  excellent: 75,
  good: 55,
  needs_work: 35,
  critical: 0,
};

/** Convert a 1-5 average to a 0-100 score. */
export function scale1to5to100(avg5: number): number {
  if (!Number.isFinite(avg5)) return 0;
  return Math.round(((avg5 - 1) / 4) * 100 * 10) / 10;
}

/** Average the 1-5 numeric answers belonging to a dimension. */
export function dimensionAverage(
  responses: ResponseMap,
  questionIds: string[],
): number {
  const values: number[] = [];
  for (const id of questionIds) {
    const v = responses[id];
    if (typeof v === 'number' && v >= 1 && v <= 5) {
      values.push(v);
    }
  }
  if (values.length === 0) return 0;
  const sum = values.reduce((s, v) => s + v, 0);
  return sum / values.length;
}

/** Count responses matching a predicate (e.g. for yes/no or threshold counts). */
export function dimensionCountIf(
  responses: ResponseMap,
  questionIds: string[],
  predicate: (value: unknown) => boolean,
): number {
  let count = 0;
  for (const id of questionIds) {
    if (predicate(responses[id])) count++;
  }
  return count;
}

/** Calculate the score for a single dimension based on its formula. */
export function calculateDimensionScore(
  responses: ResponseMap,
  dimension: ScoringDimension,
): number {
  switch (dimension.formula) {
    case 'avg':
      return scale1to5to100(dimensionAverage(responses, dimension.question_ids));
    case 'sum':
      return dimensionCountIf(responses, dimension.question_ids, (v) => typeof v === 'number');
    case 'count_if':
      // Default: count truthy/string-equal "yes" responses
      return dimensionCountIf(
        responses,
        dimension.question_ids,
        (v) => v === 'yes' || v === true || v === 1,
      );
    default:
      return 0;
  }
}

/** Calculate all dimension scores + total. Returns { dim_id: score, ..., total: score }. */
export function calculateAllScores(
  responses: ResponseMap,
  rules: ScoringRules,
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const dim of rules.dimensions) {
    scores[dim.id] = calculateDimensionScore(responses, dim);
  }

  // Total — either simple average or weighted average
  const dimScores = rules.dimensions.map((d) => scores[d.id] ?? 0);

  if (rules.total_formula === 'weighted_average') {
    let totalWeight = 0;
    let weightedSum = 0;
    rules.dimensions.forEach((d, i) => {
      const w = d.weight ?? 1;
      totalWeight += w;
      weightedSum += dimScores[i] * w;
    });
    scores.total = totalWeight > 0
      ? Math.round((weightedSum / totalWeight) * 10) / 10
      : 0;
  } else {
    // average
    if (dimScores.length === 0) {
      scores.total = 0;
    } else {
      const avg = dimScores.reduce((s, v) => s + v, 0) / dimScores.length;
      scores.total = Math.round(avg * 10) / 10;
    }
  }

  return scores;
}

/** Determine the level/color for a numeric score. */
export function getScoreLevel(
  score: number,
  rules: ScoringRules,
  lang: 'vi' | 'en' = 'vi',
): ScoreLevel {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...rules.thresholds };

  if (score >= thresholds.excellent) {
    return lang === 'vi'
      ? { label_vi: 'Vững mạnh', label_en: 'Strong', color: '#10b981' }
      : { label_vi: 'Strong', label_en: 'Strong', color: '#10b981' };
  }
  if (score >= thresholds.good) {
    return lang === 'vi'
      ? { label_vi: 'Đang phát triển', label_en: 'Growing', color: '#3b82f6' }
      : { label_vi: 'Growing', label_en: 'Growing', color: '#3b82f6' };
  }
  if (score >= thresholds.needs_work) {
    return lang === 'vi'
      ? { label_vi: 'Cần chú ý', label_en: 'Needs attention', color: '#f59e0b' }
      : { label_vi: 'Needs attention', label_en: 'Needs attention', color: '#f59e0b' };
  }
  return lang === 'vi'
    ? { label_vi: 'Cần soi chiếu', label_en: 'Needs illumination', color: '#ef4444' }
    : { label_vi: 'Needs illumination', label_en: 'Needs illumination', color: '#ef4444' };
}

/** Get the level for a score regardless of language — useful for server-side rendering. */
export function getScoreLevelBilingual(score: number, rules: ScoringRules) {
  return {
    vi: getScoreLevel(score, rules, 'vi'),
    en: getScoreLevel(score, rules, 'en'),
  };
}