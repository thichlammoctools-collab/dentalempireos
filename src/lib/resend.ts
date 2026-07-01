import { Resend } from 'resend';
import { env } from 'cloudflare:workers';

let _client: Resend | null = null;

function getClient(): Resend {
  if (_client) return _client;
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  _client = new Resend(apiKey);
  return _client;
}

function getFromEmail(): string {
  const from = env.RESEND_FROM_EMAIL;
  if (!from) throw new Error('RESEND_FROM_EMAIL is not set');
  return from;
}

interface SendWelcomeEmailOptions {
  email: string;
  postSlug?: string;
  postTitle?: string;
}

export async function sendWelcomeEmail({ email, postSlug, postTitle }: SendWelcomeEmailOptions): Promise<void> {
  const resend = getClient();
  const from = getFromEmail();

  const utmParams = postSlug
    ? `utm_source=blog&utm_medium=email&utm_campaign=welcome&utm_content=${postSlug}`
    : 'utm_source=blog&utm_medium=email&utm_campaign=welcome';

  const bookUrl = `https://dentalempireos.com/book?${utmParams}`;
  const blogUrl = `https://dentalempireos.com/blog?${utmParams}`;

  const postRefLine = postTitle
    ? `<p style="margin: 0 0 20px; color: #94a3b8; font-size: 14px;">
        Bài viết bạn vừa đọc: <strong style="color: #e2e8f0;">${escapeHtml(postTitle)}</strong>
      </p>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chào mừng đến Dental Empire OS</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a14; font-family: 'Segoe UI', system-ui, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding: 0 0 32px; text-align: center;">
              <p style="margin: 0 0 4px; font-size: 24px; font-weight: 800; color: #22d3ee; letter-spacing: -0.5px;">
                🦷 Dental Empire OS
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">
                Nền tảng quản trị nha khoa
              </p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1e2e 0%, #13131f 100%); border: 1px solid rgba(34,211,238,0.15); border-radius: 16px; padding: 40px 36px;">

              <!-- Greeting -->
              <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.2;">
                Chào mừng bạn! 🎉
              </h1>
              <p style="margin: 0 0 24px; font-size: 16px; color: #94a3b8; line-height: 1.6;">
                Bạn đã đăng ký nhận bài viết mới nhất từ Dental Empire OS — nền tảng chia sẻ tri thức quản trị nha khoa hàng đầu Việt Nam.
              </p>

              ${postRefLine}

              <!-- Ebook CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 28px 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: 1px solid rgba(34,211,238,0.2); border-radius: 12px; padding: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #22d3ee; text-transform: uppercase; letter-spacing: 1.5px;">
                      📘 Tài liệu miễn phí
                    </p>
                    <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 800; color: #ffffff;">
                      Dental Empire OS — Ebook
                    </h2>
                    <p style="margin: 0 0 16px; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                      Bộ sưu tập 32 chương đầy đủ về quản trị, vận hành, marketing, tài chính, và nhân sự phòng khám nha khoa.
                    </p>
                    <a href="${bookUrl}"
                       style="display: inline-block; background: linear-gradient(135deg, #0891b2, #22d3ee); color: #0a0a14; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
                      📖 Đọc Ebook miễn phí →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Blog CTA -->
              <p style="margin: 0 0 20px; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                Ngoài ra, đừng bỏ lỡ những bài viết chuyên sâu mới nhất trên blog:
              </p>
              <a href="${blogUrl}"
                 style="display: inline-block; background: transparent; color: #22d3ee; font-weight: 700; font-size: 14px; padding: 10px 20px; border: 1px solid rgba(34,211,238,0.3); border-radius: 8px; text-decoration: none;">
                📰 Xem Blog ngay →
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 0 0; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #475569;">
                Bạn nhận được email này vì đã đăng ký nhận tin từ Dental Empire OS.
              </p>
              <p style="margin: 0 0 12px; font-size: 12px; color: #475569;">
                Không muốn nhận email nữa?
                <a href="https://dentalempireos.com/unsubscribe?email=${encodeURIComponent(email)}"
                   style="color: #64748b; text-decoration: underline;">
                  Hủy đăng ký
                </a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                © 2026 Dental Empire OS ·
                <a href="https://dentalempireos.com/" style="color: #334155;">Giới thiệu</a> ·
                <a href="https://dentalempireos.com/privacy" style="color: #334155;">Chính sách</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: postTitle
        ? `📖 "${postTitle}" — và Ebook miễn phí cho bạn!`
        : '🦷 Chào mừng đến Dental Empire OS!',
      html,
    });
  } catch (err) {
    console.error('[resend] Failed to send welcome email:', err);
    throw err;
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
