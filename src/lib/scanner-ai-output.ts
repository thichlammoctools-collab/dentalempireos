// Pure validation and rendering for scanner action plans.
//
// This module performs no I/O: it never touches D1, the AI gateway, or the
// filesystem. It is deliberately separated from the scanner-ai orchestrator so
// the provider-output trust boundary (schema validation, PII containment, and
// Markdown escaping) is directly unit-testable with `node:test`.
//
// Security contract for anything in this file:
//   - Provider output is untrusted. Nothing here returns HTML, and a generated
//     value can never introduce markup structure into the rendered artifact.
//   - Source personal data must not survive into the plan, and contact details
//     are rejected outright.
//   - A schema violation is terminal, not retryable. Callers distinguish this
//     with InvalidScannerActionPlanOutputError.

import type { ScannerActionPlanActionInput, ScannerActionPriority } from './scanner-action-plan-db';

const ACTION_PRIORITIES = ['low', 'medium', 'high'] as const;
const ACTION_CATEGORIES = [
  'operations',
  'people',
  'process',
  'finance',
  'marketing',
  'patient_experience',
  'compliance',
  'technology',
  'strategy',
] as const;
const MAX_PLAN_TITLE_LENGTH = 120;
const MAX_PLAN_SUMMARY_LENGTH = 600;
const MAX_ACTION_TITLE_LENGTH = 160;
const MAX_ACTION_DESCRIPTION_LENGTH = 1_200;
const MAX_ACTION_CATEGORY_LENGTH = 32;
const MAX_TARGET_DAYS = 365;
const MIN_ACTIONS = 4;
const MAX_ACTIONS = 12;

export interface StructuredScannerActionPlan {
  title: string;
  summary: string;
  actions: Array<ScannerActionPlanActionInput & { category: string; priority: ScannerActionPriority; targetDays: number }>;
}

/** A non-provider error: schema violations are terminal and must not be retried. */
export class InvalidScannerActionPlanOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidScannerActionPlanOutputError';
  }
}

function hasHtml(value: string): boolean {
  return /<\/?[a-z][^>]*>/i.test(value);
}

function readPlanText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string') throw new InvalidScannerActionPlanOutputError(`${field} must be a string.`);
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength || hasHtml(normalized)) {
    throw new InvalidScannerActionPlanOutputError(`${field} is empty, too long, or contains HTML.`);
  }
  return normalized;
}

function normalizeForPiiCheck(value: string): string {
  return value.toLocaleLowerCase('vi').replace(/\s+/g, ' ').trim();
}

/**
 * Rejects a plan that echoes the respondent's own identifiers or that invents
 * contact details. Matched values must appear as complete phrases so generic
 * words from ordinary free-text answers cannot cause false positives.
 */
export function assertNoPlanPii(plan: StructuredScannerActionPlan, sourcePii: string[]): void {
  const content = [plan.title, plan.summary, ...plan.actions.flatMap((action) => [action.title, action.description ?? ''])]
    .map(normalizeForPiiCheck)
    .join('\n');
  // Only compare identifiable top-level fields. Free-text answers are never sent
  // to the provider, so treating their ordinary words as PII creates false
  // positives (for example, matching "phòng khám" in a valid recommendation).
  const sourceValues = sourcePii.map(normalizeForPiiCheck).filter(Boolean);
  // Match source identifiers as complete phrases, not arbitrary substrings.
  // This prevents generic names or codes from matching ordinary words while
  // still catching an exact clinic name, address, or owner name.
  const echoesSourceValue = (value: string): boolean => new RegExp(
    `(^|[^\\p{L}\\p{N}])${value.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}(?=$|[^\\p{L}\\p{N}])`,
    'iu',
  ).test(content);
  if (sourceValues.some(echoesSourceValue)) {
    throw new InvalidScannerActionPlanOutputError('AI plan output contains source personal data.');
  }
  if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(content) || /(?:\+?\d[\s().-]*){8,}\d/.test(content)) {
    throw new InvalidScannerActionPlanOutputError('AI plan output contains contact information.');
  }
}

export interface ScannerPlanSourceFields {
  owner_name?: string | null;
  clinic_name?: string | null;
  clinic_address?: string | null;
  clinic_phone?: string | null;
  email?: string | null;
}

/**
 * Identifiable top-level fields only. Free-form answers are excluded by design —
 * they are never sent to the provider, so their words are not personal data in
 * this context.
 */
export function getScannerPlanSourcePii(response: ScannerPlanSourceFields): string[] {
  return [
    response.owner_name ?? '',
    response.clinic_name ?? '',
    response.clinic_address ?? '',
    response.clinic_phone ?? '',
    response.email ?? '',
  ];
}

/**
 * Parses only the strict JSON envelope requested from the provider. The output
 * never becomes executable HTML and positions are derived locally, not trusted.
 */
export function parseStructuredScannerActionPlan(output: string, sourcePii: string[] = []): StructuredScannerActionPlan {
  let value: unknown;
  try {
    const trimmed = output.trim();
    const unfenced = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    try {
      value = JSON.parse(unfenced);
    } catch {
      // Some providers prepend a short explanation despite the JSON-only rule.
      // Extract only the outer JSON object; schema validation below remains strict.
      const start = unfenced.indexOf('{');
      const end = unfenced.lastIndexOf('}');
      if (start < 0 || end <= start) throw new Error('No JSON object found');
      value = JSON.parse(unfenced.slice(start, end + 1));
    }
  } catch {
    throw new InvalidScannerActionPlanOutputError('AI plan output is not valid JSON.');
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new InvalidScannerActionPlanOutputError('AI plan output must be a JSON object.');
  }

  const envelope = value as Record<string, unknown>;
  const allowedEnvelopeKeys = new Set(['title', 'summary', 'actions']);
  if (Object.keys(envelope).some((key) => !allowedEnvelopeKeys.has(key))) {
    throw new InvalidScannerActionPlanOutputError('AI plan output contains unsupported fields.');
  }
  if (!Array.isArray(envelope.actions) || envelope.actions.length < MIN_ACTIONS || envelope.actions.length > MAX_ACTIONS) {
    throw new InvalidScannerActionPlanOutputError('AI plan must contain 4 to 12 actions.');
  }

  const actions = envelope.actions.map((value, index) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new InvalidScannerActionPlanOutputError(`Action ${index + 1} must be an object.`);
    }
    const action = value as Record<string, unknown>;
    const allowedActionKeys = new Set(['title', 'description', 'category', 'priority', 'target_days']);
    if (Object.keys(action).some((key) => !allowedActionKeys.has(key))) {
      throw new InvalidScannerActionPlanOutputError(`Action ${index + 1} contains unsupported fields.`);
    }
    const category = readPlanText(action.category, `Action ${index + 1} category`, MAX_ACTION_CATEGORY_LENGTH);
    if (!(ACTION_CATEGORIES as readonly string[]).includes(category)) {
      throw new InvalidScannerActionPlanOutputError(`Action ${index + 1} category is invalid.`);
    }
    if (typeof action.priority !== 'string' || !(ACTION_PRIORITIES as readonly string[]).includes(action.priority)) {
      throw new InvalidScannerActionPlanOutputError(`Action ${index + 1} priority is invalid.`);
    }
    if (!Number.isInteger(action.target_days) || (action.target_days as number) < 1 || (action.target_days as number) > MAX_TARGET_DAYS) {
      throw new InvalidScannerActionPlanOutputError(`Action ${index + 1} target_days is invalid.`);
    }
    return {
      position: index,
      title: readPlanText(action.title, `Action ${index + 1} title`, MAX_ACTION_TITLE_LENGTH),
      description: readPlanText(action.description, `Action ${index + 1} description`, MAX_ACTION_DESCRIPTION_LENGTH),
      category,
      priority: action.priority as ScannerActionPriority,
      targetDays: action.target_days as number,
    };
  });

  const plan = {
    title: readPlanText(envelope.title, 'Plan title', MAX_PLAN_TITLE_LENGTH),
    summary: readPlanText(envelope.summary, 'Plan summary', MAX_PLAN_SUMMARY_LENGTH),
    actions,
  };
  assertNoPlanPii(plan, sourcePii);
  return plan;
}

export function escapeScannerActionPlanMarkdown(value: string): string {
  // Prefix every physical line so generated values cannot start headings, lists,
  // block quotes, fenced code, or HTML in the compatibility Markdown artifact.
  return value
    .replace(/[\r\n]+/g, ' ')
    .replace(/([\\`*_{}\[\]<>#+!|~-])/g, '\\$1');
}

/** Derives the legacy Markdown artifact exclusively from already validated data. */
export function renderStructuredScannerActionPlanMarkdown(
  plan: StructuredScannerActionPlan,
  lang: 'vi' | 'en',
): string {
  const labels = lang === 'vi'
    ? { summary: 'Tóm tắt', category: 'Danh mục', priority: 'Ưu tiên', target: 'Mục tiêu hoàn thành' }
    : { summary: 'Summary', category: 'Category', priority: 'Priority', target: 'Target completion' };
  const priorityLabels: Record<ScannerActionPriority, string> = lang === 'vi'
    ? { low: 'Thấp', medium: 'Trung bình', high: 'Cao' }
    : { low: 'Low', medium: 'Medium', high: 'High' };
  const targetDays = (days: number) => lang === 'vi' ? `${days} ngày` : `${days} days`;

  return [
    `# ${escapeScannerActionPlanMarkdown(plan.title)}`,
    '',
    `**${labels.summary}:** ${escapeScannerActionPlanMarkdown(plan.summary)}`,
    '',
    `## ${lang === 'vi' ? 'Kế hoạch hành động' : 'Action plan'}`,
    '',
    ...plan.actions.flatMap((action, index) => [
      `### ${lang === 'vi' ? 'Hành động' : 'Action'} ${index + 1}: ${escapeScannerActionPlanMarkdown(action.title)}`,
      '',
       escapeScannerActionPlanMarkdown(action.description ?? ''),
      '',
      `- **${labels.category}:** ${escapeScannerActionPlanMarkdown(action.category ?? '')}`,
      `- **${labels.priority}:** ${priorityLabels[action.priority ?? 'medium']}`,
      `- **${labels.target}:** ${targetDays(action.targetDays ?? 0)}`,
      '',
    ]),
  ].join('\n').trim();
}
