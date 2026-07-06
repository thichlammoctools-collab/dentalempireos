globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { a as sendWelcomeEmail } from "./resend_BvoaNmB7.mjs";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function validateEmail(email) {
  if (!email || typeof email !== "string") return "Email là bắt buộc.";
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_RE.test(trimmed)) return "Email không hợp lệ.";
  if (trimmed.length > 254) return "Email quá dài.";
  return null;
}
async function hashIp(ip) {
  if (!ip) return null;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip.trim());
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
}
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1e3;
const RATE_LIMIT_MAX = 5;
async function checkRateLimit(db, ipHash) {
  const cutoff = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const result = await db.prepare(
    `SELECT COUNT(*) as count FROM "newsletter_subscriber"
       WHERE "ip_hash" = ? AND "created_at" > ? AND "status" = 'active'`
  ).bind(ipHash, cutoff).first();
  if (!result || result.count < RATE_LIMIT_MAX) {
    return { allowed: true };
  }
  const oldest = await db.prepare(
    `SELECT "created_at" FROM "newsletter_subscriber"
       WHERE "ip_hash" = ? AND "created_at" > ? AND "status" = 'active'
       ORDER BY "created_at" ASC LIMIT 1`
  ).bind(ipHash, cutoff).first();
  if (oldest) {
    const oldestMs = new Date(oldest.created_at).getTime();
    const retryAfterMs = oldestMs + RATE_LIMIT_WINDOW_MS - Date.now();
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs) };
  }
  return { allowed: false, retryAfterMs: RATE_LIMIT_WINDOW_MS };
}
async function subscribe(db, opts) {
  const email = opts.email.trim().toLowerCase();
  const source = opts.source ?? "blog";
  const existing = await db.prepare(
    `SELECT "id", "status" FROM "newsletter_subscriber" WHERE "email" = ?`
  ).bind(email).first();
  if (existing) {
    if (existing.status === "unsubscribed") {
      await db.prepare(
        `UPDATE "newsletter_subscriber"
           SET "status" = 'active', "source" = ?, "post_slug" = COALESCE(?, "post_slug"),
               "ip_hash" = COALESCE(?, "ip_hash"), "unsubscribed_at" = NULL
           WHERE "email" = ?`
      ).bind(source, opts.postSlug ?? null, opts.ip ?? null, email).run();
      return { success: true };
    }
    return { success: true, alreadySubscribed: true };
  }
  const id = crypto.randomUUID();
  const now = (/* @__PURE__ */ new Date()).toISOString();
  await db.prepare(
    `INSERT INTO "newsletter_subscriber"
         ("id","email","source","post_slug","ip_hash","status","created_at")
       VALUES (?, ?, ?, ?, ?, 'active', ?)`
  ).bind(id, email, source, opts.postSlug ?? null, opts.ip ?? null, now).run();
  return { success: true };
}
async function unsubscribe(db, email) {
  const result = await db.prepare(
    `UPDATE "newsletter_subscriber"
       SET "status" = 'unsubscribed', "unsubscribed_at" = ?
       WHERE "email" = ? AND "status" = 'active'`
  ).bind((/* @__PURE__ */ new Date()).toISOString(), email.trim().toLowerCase()).run();
  return result.meta?.changes !== void 0 && result.meta.changes > 0;
}
const prerender = false;
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  const emailError = validateEmail(body.email ?? "");
  if (emailError) return badRequest(emailError);
  const ip = request.headers.get("CF-Connecting-IP") ?? request.headers.get("x-forwarded-for") ?? null;
  const ipHash = await hashIp(ip);
  if (ipHash) {
    const { allowed, retryAfterMs } = await checkRateLimit(env.DB, ipHash);
    if (!allowed) {
      return json(
        { error: "Quá nhiều lần đăng ký. Vui lòng thử lại sau." },
        429
      );
    }
  }
  const result = await subscribe(env.DB, {
    email: body.email,
    source: body.source ?? "blog",
    postSlug: body.post_slug,
    ip: ipHash ?? void 0
  });
  if (!result.success) {
    return json({ error: result.error ?? "Lỗi đăng ký." }, 500);
  }
  if (!result.alreadySubscribed) {
    const waitUntil = env.ctx.waitUntil;
    waitUntil?.(
      sendWelcomeEmail({
        email: body.email,
        postSlug: body.post_slug,
        postTitle: body.post_title
      }).catch((err) => {
        console.error("[newsletter] Failed to send welcome email:", err);
      })
    );
  }
  return json({
    success: true,
    message: result.alreadySubscribed ? "Email đã được đăng ký trước đó." : "Đăng ký thành công! Vui lòng kiểm tra email."
  });
};
const GET = async ({ url }) => {
  const action = url.searchParams.get("action");
  const email = url.searchParams.get("email");
  if (action === "unsubscribe" && email) {
    const ok = await unsubscribe(env.DB, email);
    const html = ok ? `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Đã hủy đăng ký</title><style>body{font-family:system-ui,sans-serif;background:#0a0a14;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}div{background:#1e1e2e;border:1px solid rgba(34,211,238,0.2);border-radius:16px;padding:40px;text-align:center;max-width:480px}h1{color:#22d3ee;font-size:24px;margin:0 0 12px}p{color:#94a3b8;font-size:14px;line-height:1.6;margin:0}</style></head><body><div><h1>Đã hủy đăng ký</h1><p>Bạn sẽ không nhận email nào từ Dental Empire OS nữa. Cảm ơn bạn đã đồng hành cùng chúng tôi!</p></div></body></html>` : `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Không tìm thấy</title><style>body{font-family:system-ui,sans-serif;background:#0a0a14;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}div{background:#1e1e2e;border:1px solid rgba(34,211,238,0.2);border-radius:16px;padding:40px;text-align:center;max-width:480px}h1{color:#22d3ee;font-size:24px;margin:0 0 12px}p{color:#94a3b8;font-size:14px;line-height:1.6;margin:0}</style></head><body><div><h1>Không tìm thấy</h1><p>Email không có trong danh sách đăng ký của chúng tôi.</p></div></body></html>`;
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
  return badRequest("Invalid action");
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
