globalThis.process ??= {};
globalThis.process.env ??= {};
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
function uid() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}
async function listProducts(db) {
  const { results } = await db.prepare('SELECT * FROM "product" ORDER BY "created_at" DESC').all();
  return results;
}
async function getProduct(db, id) {
  return db.prepare('SELECT * FROM "product" WHERE "id" = ?').bind(id).first();
}
async function upsertProduct(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "product" ("id","name","type","price","description","duration_days","reference_id","app_id","is_active","created_at","updated_at")
       VALUES (?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "name"=excluded."name",
         "type"=excluded."type",
         "price"=excluded."price",
         "description"=excluded."description",
         "duration_days"=excluded."duration_days",
         "reference_id"=excluded."reference_id",
         "app_id"=excluded."app_id",
         "is_active"=excluded."is_active",
         "updated_at"=excluded."updated_at"`
  ).bind(
    input.id,
    input.name,
    input.type,
    input.price,
    input.description ?? null,
    input.duration_days ?? null,
    input.reference_id ?? null,
    input.app_id ?? null,
    input.is_active ?? 1,
    ts,
    ts
  ).run();
  return getProduct(db, input.id);
}
async function deleteProduct(db, id) {
  await db.prepare('DELETE FROM "product" WHERE "id" = ?').bind(id).run();
}
async function createOrder(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "order" ("id","user_id","product_id","order_code","amount","status","payment_link_id","checkout_url","created_at")
       VALUES (?,?,?,?,?,?,?,?,?)`
  ).bind(
    input.id,
    input.user_id,
    input.product_id,
    input.order_code,
    input.amount,
    "pending",
    input.payment_link_id,
    input.checkout_url,
    ts
  ).run();
  return getOrder(db, input.id);
}
async function getOrder(db, id) {
  return db.prepare('SELECT * FROM "order" WHERE "id" = ?').bind(id).first();
}
async function getOrderByCode(db, orderCode) {
  return db.prepare('SELECT * FROM "order" WHERE "order_code" = ?').bind(orderCode).first();
}
async function listOrders(db, opts = {}) {
  const conditions = [];
  const binds = [];
  if (opts.status) {
    conditions.push('"status" = ?');
    binds.push(opts.status);
  }
  if (opts.user_id) {
    conditions.push('"user_id" = ?');
    binds.push(opts.user_id);
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit = opts.limit ?? 20;
  const offset = opts.offset ?? 0;
  const row = await db.prepare(`SELECT COUNT(*) as count FROM "order" ${where}`).bind(...binds).first();
  const { results } = await db.prepare(`SELECT * FROM "order" ${where} ORDER BY "created_at" DESC LIMIT ? OFFSET ?`).bind(...binds, limit, offset).all();
  return { orders: results, total: row?.count ?? 0 };
}
async function updateOrderStatus(db, orderId, status) {
  const ts = now();
  if (status === "paid") {
    await db.prepare('UPDATE "order" SET "status" = ?, "paid_at" = ? WHERE "id" = ?').bind(status, ts, orderId).run();
  } else {
    await db.prepare('UPDATE "order" SET "status" = ? WHERE "id" = ?').bind(status, orderId).run();
  }
}
async function grantAccess(db, input) {
  const ts = now();
  const id = uid();
  await db.prepare(
    `UPDATE "access" SET "is_active" = 0
       WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1`
  ).bind(input.user_id, input.product_id).run();
  await db.prepare(
    `INSERT INTO "access" ("id","user_id","product_id","order_id","granted_at","expires_at","is_active")
       VALUES (?,?,?,?,?,?,1)`
  ).bind(id, input.user_id, input.product_id, input.order_id, ts, input.expires_at).run();
  return db.prepare('SELECT * FROM "access" WHERE "id" = ?').bind(id).first();
}
async function hasAccess(db, userId, productId) {
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const row = await db.prepare(
    `SELECT 1 FROM "access"
       WHERE "user_id" = ? AND "product_id" = ? AND "is_active" = 1
         AND ("expires_at" IS NULL OR "expires_at" > ?)
       LIMIT 1`
  ).bind(userId, productId, now2).first();
  if (row) return true;
  const prodRow = await db.prepare('SELECT "type" FROM "product" WHERE "id" = ?').bind(productId).first();
  if (prodRow?.type === "survey_unlock") {
    const packRow = await db.prepare(
      `SELECT 1 FROM "access"
         WHERE "user_id" = ? AND "product_id" = 'prod-scanner-pack'
           AND "is_active" = 1
           AND ("expires_at" IS NULL OR "expires_at" > ?)
         LIMIT 1`
    ).bind(userId, now2).first();
    if (packRow) return true;
  }
  return false;
}
async function listUserAccess(db, userId) {
  const { results } = await db.prepare(
    `SELECT * FROM "access" WHERE "user_id" = ? AND "is_active" = 1
       ORDER BY "granted_at" DESC`
  ).bind(userId).all();
  return results;
}
async function logWebhook(db, orderCode, payload) {
  await db.prepare(
    `INSERT INTO "payos_webhook_log" ("order_code","payload","received_at") VALUES (?,?,?)`
  ).bind(orderCode, payload, now()).run();
}
async function getPayosSettings(db) {
  return db.prepare('SELECT * FROM "payos_settings" WHERE "id" = 1').first();
}
function getPayosEnv(db, settings, env) {
  return {
    PAYOS_CLIENT_ID: settings?.client_id || env.PAYOS_CLIENT_ID || "",
    PAYOS_API_KEY: settings?.api_key || env.PAYOS_API_KEY || "",
    PAYOS_CHECKSUM_KEY: settings?.checksum_key || env.PAYOS_CHECKSUM_KEY || "",
    PAYOS_WEBHOOK_URL: settings?.webhook_url || env.PAYOS_WEBHOOK_URL || ""
  };
}
async function upsertPayosSettings(db, input) {
  const ts = now();
  await db.prepare(
    `INSERT INTO "payos_settings" ("id","client_id","api_key","checksum_key","webhook_url","sandbox_mode","is_active","updated_at")
       VALUES (1,?,?,?,?,?,?,?)
       ON CONFLICT("id") DO UPDATE SET
         "client_id"=COALESCE(excluded."client_id","payos_settings"."client_id"),
         "api_key"=COALESCE(excluded."api_key","payos_settings"."api_key"),
         "checksum_key"=COALESCE(excluded."checksum_key","payos_settings"."checksum_key"),
         "webhook_url"=COALESCE(excluded."webhook_url","payos_settings"."webhook_url"),
         "sandbox_mode"=COALESCE(excluded."sandbox_mode","payos_settings"."sandbox_mode"),
         "is_active"=COALESCE(excluded."is_active","payos_settings"."is_active"),
         "updated_at"=excluded."updated_at"`
  ).bind(
    input.client_id ?? "",
    input.api_key ?? "",
    input.checksum_key ?? "",
    input.webhook_url ?? "",
    input.sandbox_mode ?? 1,
    input.is_active ?? 0,
    ts
  ).run();
}
export {
  listOrders as a,
  listProducts as b,
  getPayosEnv as c,
  getProduct as d,
  deleteProduct as e,
  upsertProduct as f,
  getPayosSettings as g,
  hasAccess as h,
  getOrderByCode as i,
  updateOrderStatus as j,
  createOrder as k,
  listUserAccess as l,
  logWebhook as m,
  grantAccess as n,
  upsertPayosSettings as u
};
