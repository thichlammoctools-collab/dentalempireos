// Unit tests for the scanner credit run price-capture invariant.
//
// The critical property is that a retry is always priced from the immutable
// capture taken with the original run. A row that predates that capture must
// fail closed rather than silently re-pricing from today's active rule — that
// path is where a member could otherwise be charged a different amount than
// the one they were quoted.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getCapturedScannerCreditRunPrice,
  type ScannerCreditRun,
} from '../src/lib/scanner-credit-run-price.ts';

function run(overrides: Partial<ScannerCreditRun> = {}): ScannerCreditRun {
  return {
    id: 'run-1',
    user_id: 'user-1',
    survey_id: 'survey-1',
    idempotency_key: 'idem-1',
    reservation_id: 'res-1',
    response_id: null,
    status: 'reserved',
    retry_token: null,
    credit_amount: 25,
    price_snapshot_json: JSON.stringify({ credits: 25, unit: 'per_run' }),
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

test('a run with a consistent capture yields the captured credits', () => {
  const price = getCapturedScannerCreditRunPrice(run());

  assert.equal(price.credits, 25);
  assert.equal(price.priceSnapshot.unit, 'per_run');
});

test('a run without a durable capture fails closed', () => {
  // Rows written before the capture existed cannot be re-priced safely.
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ price_snapshot_json: null })),
    /lacks a durable price capture/,
  );
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ credit_amount: null })),
    /lacks a durable price capture/,
  );
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ credit_amount: 0 })),
    /lacks a durable price capture/,
  );
});

test('a run with an unparsable snapshot fails closed', () => {
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ price_snapshot_json: '{not json' })),
    /invalid durable price snapshot/,
  );
});

test('a run whose snapshot disagrees with credit_amount fails closed', () => {
  // A mismatch means the capture was tampered with or partially written; it
  // must not be allowed to charge the quoted amount.
  assert.throws(
    () => getCapturedScannerCreditRunPrice(
      run({ price_snapshot_json: JSON.stringify({ credits: 99 }) }),
    ),
    /inconsistent durable price capture/,
  );
});

test('a non-object or non-integer snapshot is rejected', () => {
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ price_snapshot_json: '[25]' })),
    /inconsistent durable price capture/,
  );
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ price_snapshot_json: '"25"' })),
    /inconsistent durable price capture/,
  );
  assert.throws(
    () => getCapturedScannerCreditRunPrice(run({ price_snapshot_json: JSON.stringify({ credits: 2.5 }) })),
    /inconsistent durable price capture/,
  );
});
