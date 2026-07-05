globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { getBlocksByPostId, upsertBlocks } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const GET = async ({ url }) => {
  try {
    const postId = url.searchParams.get("post_id");
    if (!postId) {
      return new Response(JSON.stringify({ error: "Thiếu post_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const blocks = await getBlocksByPostId(env.DB, postId);
    return new Response(JSON.stringify({ blocks }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog blocks GET error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.post_id || !Array.isArray(body.blocks)) {
      return new Response(JSON.stringify({ error: "Thiếu post_id hoặc blocks" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const ALLOWED_BLOCK_TYPES = /* @__PURE__ */ new Set(["text", "image", "form", "rich"]);
    const blocks = body.blocks.map((b, i) => ({
      id: b.id || crypto.randomUUID(),
      type: ALLOWED_BLOCK_TYPES.has(b.type ?? "") ? b.type : "text",
      content: b.content ?? "",
      sort_order: b.sort_order ?? i
    }));
    await upsertBlocks(env.DB, body.post_id, blocks);
    return new Response(JSON.stringify({ success: true, count: blocks.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog blocks POST error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
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
