import type { ConsultationRequest } from './consultation-request-db';

const TELEGRAM_API = 'https://api.telegram.org';

function escapeHtml(value: string | null | undefined): string {
  return (value ?? 'Chưa cung cấp').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function buildConsultationMessage(request: ConsultationRequest): string {
  const interestLabels = {
    guided: 'Đồng hành tư vấn',
    implementation: 'Tư vấn triển khai',
    general: 'Nhu cầu khác',
  } as const;

  return [
    '<b>YÊU CẦU TƯ VẤN MỚI</b>',
    '',
    `<b>Họ và tên:</b> ${escapeHtml(request.name)}`,
    `<b>Số điện thoại:</b> ${escapeHtml(request.phone)}`,
    `<b>Email:</b> ${escapeHtml(request.email)}`,
    `<b>Phòng khám:</b> ${escapeHtml(request.clinic_name)}`,
    `<b>Quy mô nhân sự:</b> ${escapeHtml(request.team_size)}`,
    `<b>Nhu cầu:</b> ${interestLabels[request.service_interest]}`,
    `<b>Nội dung:</b> ${escapeHtml(request.message)}`,
    '',
    `<b>Mã yêu cầu:</b> <code>${escapeHtml(request.id)}</code>`,
    `<b>Thời gian:</b> ${escapeHtml(new Date(request.created_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }))}`,
  ].join('\n');
}

export async function sendConsultationTelegramNotification(
  request: ConsultationRequest,
  token: string | undefined,
  chatId: string | undefined,
): Promise<void> {
  if (!token || !chatId) return;

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildConsultationMessage(request),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API returned ${response.status}.`);
  }
}
