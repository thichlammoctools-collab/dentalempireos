// Notification helpers for scanner AI completion.
// Wraps createNotification() from question-db.ts.

import { createNotification } from './question-db';

export type ScannerNotificationType = 'analysis' | 'plan';

/** Look up user_id from scanner_history for a given response_id. */
async function getUserIdForResponse(
  db: D1Database,
  responseId: number,
): Promise<string | null> {
  const row = await db
    .prepare('SELECT user_id FROM scanner_history WHERE response_id = ? LIMIT 1')
    .bind(responseId)
    .first<{ user_id: string }>();
  return row?.user_id ?? null;
}

export async function sendScannerNotification(
  db: D1Database,
  responseId: number,
  type: ScannerNotificationType,
): Promise<void> {
  const userId = await getUserIdForResponse(db, responseId);
  if (!userId) {
    console.warn(`[notification] No user found for scanner response ${responseId}`);
    return;
  }

  const baseUrl = 'https://dentalempireos.com';
  const link = `${baseUrl}/scanner/result/${responseId}`;

  const titles: Record<ScannerNotificationType, { vi: string; en: string }> = {
    analysis: {
      vi: 'Bản soi chiếu hệ thống đã sẵn sàng',
      en: 'Your AI Analysis is Ready',
    },
    plan: {
      vi: 'Kế hoạch 30 ngày đã được tạo',
      en: 'Your 30-Day Plan is Ready',
    },
  };

  const bodies: Record<ScannerNotificationType, { vi: string; en: string }> = {
    analysis: {
      vi: 'Bản phân tích AI của bạn đã hoàn thành. Nhấn để xem chi tiết.',
      en: 'Your AI analysis has been generated. Tap to view the results.',
    },
    plan: {
      vi: 'Kế hoạch hành động 30 ngày của bạn đã sẵn sàng. Nhấn để xem chi tiết.',
      en: 'Your 30-day action plan is ready. Tap to view the details.',
    },
  };

  const t = titles[type];
  const b = bodies[type];

  await createNotification(db, userId, `scanner_${type}_done`, t.vi, b.vi, link);
}
