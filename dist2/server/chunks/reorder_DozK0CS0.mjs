globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { reorderBlocks } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.post_id || !Array.isArray(body.ordered_ids)) {
      return new Response(JSON.stringify({ error: "Thiếu post_id hoặc ordered_ids" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await reorderBlocks(env.DB, body.post_id, body.ordered_ids);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog blocks reorder error:", err);
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
