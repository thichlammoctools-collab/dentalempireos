import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Email không hợp lệ' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: save to newsletter subscribers table or send via email API (Resend)
    // For now, just acknowledge
    return new Response(JSON.stringify({ success: true, message: 'Đăng ký thành công!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Lỗi server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
