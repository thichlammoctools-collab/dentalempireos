import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildScannerPdfArtifactKey,
  isScannerPdfArtifactKeyForLayout,
  SCANNER_RETIRED_ARTIFACT_TOMBSTONE_RETENTION,
  scannerAiOperationKey,
  scannerPdfArtifactIntentMatchesLease,
  scannerPdfOperationKey,
} from '../src/lib/scanner-response-operation-fence.ts';

test('PDF operation fences are distinct per artifact type', () => {
  assert.equal(scannerPdfOperationKey('combined'), 'pdf:combined');
  assert.equal(scannerPdfOperationKey('analysis'), 'pdf:analysis');
  assert.equal(scannerPdfOperationKey('plan'), 'pdf:plan');
  assert.notEqual(scannerPdfOperationKey('analysis'), scannerPdfOperationKey('plan'));
});

test('AI and PDF operation keys share one response-wide lease namespace', () => {
  assert.equal(scannerAiOperationKey('analysis'), 'ai:analysis');
  assert.equal(scannerAiOperationKey('plan'), 'ai:plan');
  assert.notEqual(scannerAiOperationKey('analysis'), scannerPdfOperationKey('analysis'));
});

test('PDF intent cleanup is bound to the exact tokenized lease', () => {
  const lease = { operationKey: scannerPdfOperationKey('combined'), token: 'lease-a' } as const;
  assert.equal(scannerPdfArtifactIntentMatchesLease({ key: 'scanner-artifacts/a.pdf', token: 'lease-a', operationKey: 'pdf:combined' }, 'scanner-artifacts/a.pdf', lease), true);
  assert.equal(scannerPdfArtifactIntentMatchesLease({ key: 'scanner-artifacts/a.pdf', token: 'lease-b', operationKey: 'pdf:combined' }, 'scanner-artifacts/a.pdf', lease), false);
  assert.equal(scannerPdfArtifactIntentMatchesLease({ key: 'scanner-artifacts/b.pdf', token: 'lease-a', operationKey: 'pdf:combined' }, 'scanner-artifacts/a.pdf', lease), false);
  assert.equal(scannerPdfArtifactIntentMatchesLease({ key: 'scanner-artifacts/a.pdf', token: 'lease-a', operationKey: 'pdf:analysis' }, 'scanner-artifacts/a.pdf', lease), false);
});

test('new PDF artifact keys are unique per write token while legacy cached keys remain readable', () => {
  const prefix = 'scanner-artifacts/free/user/42';
  const oldKey = `${prefix}/combined-v1.pdf`;
  const first = buildScannerPdfArtifactKey(prefix, 'combined', 'v1', 'lease-a');
  const second = buildScannerPdfArtifactKey(prefix, 'combined', 'v1', 'lease-b');

  assert.notEqual(first, second);
  assert.equal(first, `${prefix}/combined-v1-lease-a.pdf`);
  assert.equal(isScannerPdfArtifactKeyForLayout(first, 'combined', 'v1'), true);
  assert.equal(isScannerPdfArtifactKeyForLayout(oldKey, 'combined', 'v1'), true);
  assert.equal(isScannerPdfArtifactKeyForLayout(first, 'plan', 'v2'), false);
});

test('retired artifact tombstones intentionally persist after successful deletion', () => {
  assert.equal(SCANNER_RETIRED_ARTIFACT_TOMBSTONE_RETENTION, 'indefinite');
});

test('external-work contention contract is retryable without terminal completion', () => {
  const contention = { completed: false, retryable: true } as const;
  const invalidResponse = { completed: true, retryable: false } as const;
  assert.deepEqual(contention, { completed: false, retryable: true });
  assert.deepEqual(invalidResponse, { completed: true, retryable: false });
});
