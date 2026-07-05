globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { post_id, fields } = body;
    if (!post_id) {
      return new Response(JSON.stringify({ error: "Thiếu post_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const id = crypto.randomUUID();
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    const fieldsJson = JSON.stringify(fields ?? {});
    await env.DB.prepare(
      `INSERT INTO "form_submission" ("id","post_id","fields","status","created_at")
         VALUES (?,?,?,?,?)`
    ).bind(id, post_id, fieldsJson, "new", ts).run();
    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog form submission error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
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
