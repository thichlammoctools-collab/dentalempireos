globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { g as getPayosSettings, c as getPayosEnv, d as getProduct, k as createOrder } from "./payos-db_0fnCQ6tl.mjs";
import { a as createPaymentLink } from "./payos_dJx_6scf.mjs";
const prerender = false;
const POST = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Chưa đăng nhập" }, 401);
  const settings = await getPayosSettings(env.DB);
  if (!settings?.client_id || !settings?.api_key) {
    return json({ error: "PayOS chưa được cấu hình. Vui lòng liên hệ admin." }, 500);
  }
  const creds = getPayosEnv(env.DB, settings, env);
  const body = await request.json().catch(() => null);
  if (!body?.product_id) return badRequest("Thiếu product_id");
  const product = await getProduct(env.DB, body.product_id);
  if (!product || !product.is_active) {
    return badRequest("Sản phẩm không tồn tại hoặc đã ngừng bán");
  }
  const orderCode = Date.now() % 1e9;
  const orderId = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const baseUrl = env.BETTER_AUTH_URL || "https://dentalempireos.com";
  const cancelUrl = `${baseUrl}/payment/cancel?order=${orderId}`;
  const returnUrl = `${baseUrl}/payment/return?order=${orderId}`;
  try {
    const payosResponse = await createPaymentLink(creds, {
      orderCode,
      amount: product.price,
      description: `Thanh toan: ${product.name}`,
      cancelUrl,
      returnUrl
    });
    await createOrder(env.DB, {
      id: orderId,
      user_id: locals.user.id,
      product_id: product.id,
      order_code: orderCode,
      amount: product.price,
      checkout_url: payosResponse.data.checkoutUrl,
      payment_link_id: payosResponse.data.paymentLinkId
    });
    return json({
      checkoutUrl: payosResponse.data.checkoutUrl,
      orderCode,
      orderId,
      qrCode: payosResponse.data.qrCode
    });
  } catch (err) {
    console.error("PayOS create payment error:", err);
    return json({ error: "Lỗi tạo thanh toán. Vui lòng thử lại." }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
