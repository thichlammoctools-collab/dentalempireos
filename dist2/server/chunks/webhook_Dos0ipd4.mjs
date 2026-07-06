globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { v as verifySignature } from "./payos_dJx_6scf.mjs";
import { m as logWebhook, g as getPayosSettings, c as getPayosEnv, i as getOrderByCode, j as updateOrderStatus, d as getProduct, n as grantAccess } from "./payos-db_0fnCQ6tl.mjs";
const prerender = false;
const POST = async ({ request }) => {
  const rawBody = await request.text();
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  const { data, signature } = body;
  if (!data || !signature || data.orderCode == null) {
    return new Response("Bad request", { status: 400 });
  }
  await logWebhook(env.DB, data.orderCode, rawBody);
  const settings = await getPayosSettings(env.DB);
  const creds = getPayosEnv(env.DB, settings, env);
  const sigData = {
    amount: data.amount ?? 0,
    cancelUrl: data.cancelUrl ?? "",
    description: data.description ?? "",
    orderCode: data.orderCode,
    returnUrl: data.returnUrl ?? ""
  };
  const valid = await verifySignature(sigData, signature, creds.PAYOS_CHECKSUM_KEY);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }
  const order = await getOrderByCode(env.DB, data.orderCode);
  if (!order) {
    return new Response("Order not found", { status: 200 });
  }
  if (order.status === "paid") {
    return new Response("Already processed", { status: 200 });
  }
  const isSuccess = data.status === "PAID" || body.code === "00";
  if (isSuccess) {
    await updateOrderStatus(env.DB, order.id, "paid");
    const product = await getProduct(env.DB, order.product_id);
    let expiresAt = null;
    if (product?.duration_days) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() + product.duration_days);
      expiresAt = d.toISOString();
    }
    await grantAccess(env.DB, {
      user_id: order.user_id,
      product_id: order.product_id,
      order_id: order.id,
      expires_at: expiresAt
    });
  } else {
    await updateOrderStatus(env.DB, order.id, "cancelled");
  }
  return new Response("OK", { status: 200 });
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
