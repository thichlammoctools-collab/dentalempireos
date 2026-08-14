import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('..', import.meta.url);

async function source(path: string): Promise<string> {
  return readFile(new URL(path, root), 'utf8');
}

test('rescan responses resolve the originally linked action plan before a generated source plan', async () => {
  const database = await source('src/lib/scanner-action-plan-db.ts');
  const functionStart = database.indexOf('export async function getScannerActionPlanForResponseForUser');
  const functionEnd = database.indexOf('export async function getScannerActionPlanForUser', functionStart);
  const functionBody = database.slice(functionStart, functionEnd);

  assert.ok(functionBody.includes('getLinkedScannerActionPlanForRescanResponse'));
  assert.ok(functionBody.indexOf('getLinkedScannerActionPlanForRescanResponse') < functionBody.indexOf('SELECT plan.* FROM "scanner_action_plan" plan'));
});

test('plan generation recognizes a linked rescan before creating a source plan', async () => {
  const scannerAi = await source('src/lib/scanner-ai.ts');
  const recoveryStart = scannerAi.indexOf('const committedPlan =');
  const recoveryEnd = scannerAi.indexOf('if (committedPlan?.generation_state', recoveryStart);
  const recovery = scannerAi.slice(recoveryStart, recoveryEnd);

  assert.ok(recovery.includes('getLinkedScannerActionPlanForRescanResponse'));
  assert.ok(recovery.indexOf('getLinkedScannerActionPlanForRescanResponse') < recovery.indexOf('getReadyScannerActionPlanForResponse'));
});
