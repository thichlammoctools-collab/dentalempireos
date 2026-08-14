import assert from 'node:assert/strict';
import test from 'node:test';
import { markNotificationRead } from '../src/lib/question-db.ts';

test('markNotificationRead scopes the no-op update to notification owner', async () => {
  let sql = '';
  let bindings: unknown[] = [];
  const db = {
    prepare(statement: string) {
      sql = statement;
      return {
        bind(...values: unknown[]) {
          bindings = values;
          return { run: async () => ({ meta: { changes: 0 } }) };
        },
      };
    },
  } as unknown as D1Database;

  await markNotificationRead(db, 'notification-1', 'owner-1');

  assert.match(sql, /WHERE "id" = \? AND "user_id" = \?/);
  assert.deepEqual(bindings, ['notification-1', 'owner-1']);
});
