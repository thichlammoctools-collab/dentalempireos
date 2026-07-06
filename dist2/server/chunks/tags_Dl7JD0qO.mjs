globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { setPostTags } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const { postId, tagIds } = body;
    if (!postId || !Array.isArray(tagIds)) {
      return new Response(JSON.stringify({ error: "Thiếu postId hoặc tagIds" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await setPostTags(env.DB, postId, tagIds);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog tags error:", err);
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
