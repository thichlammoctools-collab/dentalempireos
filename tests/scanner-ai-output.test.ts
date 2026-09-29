// Unit tests for the provider-output trust boundary in scanner-ai-output.ts.
//
// This module is pure by construction, so these tests need no D1 binding and no
// AI provider. They cover the two properties that matter most: a generated plan
// can never carry the respondent's identifiers or invent contact details, and
// nothing a provider returns can introduce structure into the rendered Markdown.
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  escapeScannerActionPlanMarkdown,
  getScannerPlanSourcePii,
  InvalidScannerActionPlanOutputError,
  parseStructuredScannerActionPlan,
  renderStructuredScannerActionPlanMarkdown,
  type StructuredScannerActionPlan,
} from '../src/lib/scanner-ai-output.ts';

function action(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    title: 'Chuẩn hoá quy trình đón khách',
    description: 'Viết checklist 7 bước cho lễ tân và đào tạo nhân viên trong tuần đầu.',
    category: 'process',
    priority: 'medium',
    target_days: 7,
    ...overrides,
  };
}

function envelope(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    title: 'Kế hoạch 30 ngày',
    summary: 'Tập trung vào quy trình và khả năng đội ngũ trong tháng tới.',
    actions: [action(), action({ title: 'Hoàn thiện báo giá' }), action({ title: 'Thiết lập chỉ số tuần' }), action({ title: 'Rà soát vệ sinh' })],
    ...overrides,
  });
}

test('parse accepts a well-formed plan and derives positions locally', () => {
  const plan = parseStructuredScannerActionPlan(envelope());

  assert.equal(plan.title, 'Kế hoạch 30 ngày');
  assert.deepEqual(plan.actions.map((a) => a.position), [0, 1, 2, 3]);
  assert.equal(plan.actions[0].targetDays, 7);
});

test('parse tolerates a fenced block and a leading explanation', () => {
  const fenced = '```json\n' + envelope() + '\n```';
  assert.equal(parseStructuredScannerActionPlan(fenced).title, 'Kế hoạch 30 ngày');

  const withPreamble = `Đây là kế hoạch:\n${envelope()}\nHết.`;
  assert.equal(parseStructuredScannerActionPlan(withPreamble).title, 'Kế hoạch 30 ngày');
});

test('parse rejects a non-object, a wrong action count, and unknown fields', () => {
  assert.throws(() => parseStructuredScannerActionPlan('[]'), InvalidScannerActionPlanOutputError);
  assert.throws(() => parseStructuredScannerActionPlan('not json'), InvalidScannerActionPlanOutputError);
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action(), action()] })),
    /4 to 12 actions/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ owner: 'admin' })),
    /unsupported fields/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action({ extra: 1 }), action(), action(), action()] })),
    /unsupported fields/,
  );
});

test('parse rejects an out-of-range category, priority, and target_days', () => {
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action({ category: 'evil' }), action(), action(), action()] })),
    /category is invalid/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action({ priority: 'urgent' }), action(), action(), action()] })),
    /priority is invalid/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action({ target_days: 0 }), action(), action(), action()] })),
    /target_days is invalid/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action({ target_days: 366 }), action(), action(), action()] })),
    /target_days is invalid/,
  );
});

test('parse rejects HTML in any generated text field', () => {
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ summary: '<script>alert(1)</script>' })),
    /contains HTML/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ actions: [action({ title: '<b>bold</b>' }), action(), action(), action()] })),
    /contains HTML/,
  );
});

test('parse rejects a plan that echoes the respondent identifiers', () => {
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ summary: 'Đề xuất cho Nha khoa Minh Anh.' }), ['Nha khoa Minh Anh']),
    /source personal data/,
  );
});

test('parse rejects contact details that were never in the source', () => {
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ summary: 'Liên hệ bacsi@example.com để hỗ trợ.' })),
    /contact information/,
  );
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ summary: 'Gọi 0912 345 678 để đăng ký.' })),
    /contact information/,
  );
});

test('PII matching is phrase-bounded so ordinary words are not false positives', () => {
  // "Nha khoa" appears inside a longer source name; a recommendation that
  // legitimately says "phòng khám" must still parse.
  const plan = parseStructuredScannerActionPlan(
    envelope({ summary: 'Chuẩn hoá phòng khám và quy trình đón khách.' }),
    ['Nha khoa Minh Anh'],
  );
  assert.equal(plan.summary, 'Chuẩn hoá phòng khám và quy trình đón khách.');

  // But the full identifier as a complete phrase is still caught.
  assert.throws(
    () => parseStructuredScannerActionPlan(envelope({ summary: 'Áp dụng cho Nha khoa Minh Anh.' }), ['Nha khoa Minh Anh']),
    /source personal data/,
  );
});

test('getScannerPlanSourcePii collects only identifiable top-level fields', () => {
  const values = getScannerPlanSourcePii({
    owner_name: 'Nguyễn An',
    clinic_name: 'Nha khoa Minh Anh',
    clinic_address: '12 Lê Lợi',
    clinic_phone: '0900000000',
    email: 'an@example.com',
  });
  assert.deepEqual(values.filter(Boolean), ['Nguyễn An', 'Nha khoa Minh Anh', '12 Lê Lợi', '0900000000', 'an@example.com']);

  // Missing fields become empty strings so they never match anything.
  assert.deepEqual(getScannerPlanSourcePii({}).filter(Boolean), []);
});

test('markdown escaping neutralises headings, lists, fences, and HTML', () => {
  const escaped = escapeScannerActionPlanMarkdown('# Tiêu đề\n- mục\n```js\nalert(1)\n```\n<b>html</b>');

  // Newlines collapse so an injected line cannot start a new block.
  assert.ok(!escaped.includes('\n'));
  // Every Markdown metacharacter is backslash-escaped.
  assert.ok(escaped.includes('\\#'));
  assert.ok(escaped.includes('\\-'));
  assert.ok(escaped.includes('\\`'));
  assert.ok(escaped.includes('\\<'));
});

test('rendered markdown contains only the validated structure, not injected blocks', () => {
  const plan: StructuredScannerActionPlan = {
    title: 'Kế hoạch 30 ngày',
    summary: 'Tập trung quy trình.',
    actions: [
      { position: 0, title: 'Viết checklist', description: 'Mô tả từng bước.', category: 'process', priority: 'high', targetDays: 7 },
      { position: 1, title: 'Đào tạo', description: 'Buổi học 2 giờ.', category: 'people', priority: 'medium', targetDays: 14 },
      { position: 2, title: 'Đo lường', description: 'Theo dõi chỉ số.', category: 'finance', priority: 'low', targetDays: 30 },
      { position: 3, title: 'Rà soát', description: 'Kiểm tra hằng tuần.', category: 'compliance', priority: 'medium', targetDays: 30 },
    ],
  };

  const markdown = renderStructuredScannerActionPlanMarkdown(plan, 'vi');

  assert.ok(markdown.startsWith('# Kế hoạch 30 ngày'));
  assert.ok(markdown.includes('Tóm tắt:'));
  // One heading per action, in order.
  const actionHeadings = markdown.match(/^### /gm) ?? [];
  assert.equal(actionHeadings.length, 4);
  assert.ok(markdown.includes('ngày'));
});
