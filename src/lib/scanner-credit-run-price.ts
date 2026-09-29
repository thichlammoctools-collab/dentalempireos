// The durable price capture attached to a scanner credit run.
//
// This is the contract between a quoted price and a charged price. It is kept
// separate from the run state machine in scanner-credit-run.ts — and free of any
// runtime import — so the fail-closed behaviour can be unit tested directly.
//
// Invariant: a retry is always priced from the capture taken with the original
// run, never from the active pricing rule at retry time. A run without a usable
// capture must fail closed; re-pricing it would let a member be charged a
// different amount than the one they were quoted.

export interface ScannerCreditRun {
  id: string;
  user_id: string;
  survey_id: string;
  idempotency_key: string;
  reservation_id: string;
  response_id: number | null;
  status: 'reserved' | 'completed' | 'failed';
  retry_token: string | null;
  credit_amount: number | null;
  price_snapshot_json: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScannerCreditRunPrice {
  credits: number;
  priceSnapshot: Record<string, unknown>;
}

export function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

/**
 * A retry must be priced from the immutable capture made with the original run.
 * Rows predating that capture cannot safely be recovered and must fail closed.
 */
export function getCapturedScannerCreditRunPrice(run: ScannerCreditRun): ScannerCreditRunPrice {
  if (!isPositiveSafeInteger(run.credit_amount) || !run.price_snapshot_json) {
    throw new Error('Scanner Credit run lacks a durable price capture.');
  }

  let priceSnapshot: unknown;
  try {
    priceSnapshot = JSON.parse(run.price_snapshot_json);
  } catch {
    throw new Error('Scanner Credit run has an invalid durable price snapshot.');
  }
  if (!priceSnapshot || Array.isArray(priceSnapshot) || typeof priceSnapshot !== 'object'
    || !isPositiveSafeInteger((priceSnapshot as Record<string, unknown>).credits)
    || (priceSnapshot as Record<string, unknown>).credits !== run.credit_amount) {
    throw new Error('Scanner Credit run has inconsistent durable price capture.');
  }
  return { credits: run.credit_amount, priceSnapshot: priceSnapshot as Record<string, unknown> };
}
