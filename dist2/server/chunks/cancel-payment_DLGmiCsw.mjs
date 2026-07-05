globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { i as getOrderByCode, g as getPayosSettings, c as getPayosEnv, j as updateOrderStatus } from "./payos-db_0fnCQ6tl.mjs";
import { c as cancelPaymentLink } from "./payos_dJx_6scf.mjs";
const prerender = false;
const POST = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Chưa đăng nhập" }, 401);
  const body = await request.json().catch(() => null);
  if (!body?.order_code) return badRequest("Thiếu order_code");
  const orderCode = Number(body.order_code);
  const order = await getOrderByCode(env.DB, orderCode);
  if (!order) return badRequest("Đ��n hàng không tồn tại");
  if (order.user_id !== locals.user.id) return json({ error: "Forbidden" }, 403);
  if (order.status !== "pending") return badRequest("Đơn hàng không ở trạng thái chờ");
  if (order.payment_link_id) {
    const settings = await getPayosSettings(env.DB);
    const creds = getPayosEnv(env.DB, settings, env);
    try {
      await cancelPaymentLink(creds, order.payment_link_id);
    } catch (err) {
      console.error("PayOS cancel error:", err);
    }
  }
  await updateOrderStatus(env.DB, order.id, "cancelled");
  return json({ success: true });
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
