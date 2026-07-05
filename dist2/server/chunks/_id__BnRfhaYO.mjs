globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { deleteBlock, upsertBlock } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const PUT = async ({ params, request }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Thiếu id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    if (!body.post_id || !body.type || !["text", "image", "form"].includes(body.type)) {
      return new Response(JSON.stringify({ error: "Thiếu hoặc sai post_id / type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await upsertBlock(env.DB, {
      id,
      post_id: body.post_id,
      type: body.type,
      content: body.content ?? "",
      sort_order: body.sort_order ?? 0
    });
    return new Response(JSON.stringify({ success: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog block PUT error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Thiếu id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await deleteBlock(env.DB, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog block DELETE error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
