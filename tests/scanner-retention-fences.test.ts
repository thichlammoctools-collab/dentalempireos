import assert from 'node:assert/strict';
import test from 'node:test';
import { scannerPdfOperationKey } from '../src/lib/scanner-response-operation-fence.ts';

test('PDF operation fences are distinct per artifact type', () => {
  assert.equal(scannerPdfOperationKey('combined'), 'pdf:combined');
  assert.equal(scannerPdfOperationKey('analysis'), 'pdf:analysis');
  assert.equal(scannerPdfOperationKey('plan'), 'pdf:plan');
  assert.notEqual(scannerPdfOperationKey('analysis'), scannerPdfOperationKey('plan'));
});
