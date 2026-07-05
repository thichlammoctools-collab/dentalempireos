globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { upsertPost } from "./blog-db_CoZeeOQQ.mjs";
const prerender = false;
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.id || !body.title || !body.slug) {
      return new Response(JSON.stringify({ error: "Thiếu trường bắt buộc: id, title, slug" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await upsertPost(env.DB, {
      id: body.id,
      title: body.title,
      slug: body.slug,
      description: body.description ?? void 0,
      content_md: body.content_md ?? void 0,
      cover_url: body.cover_url ?? void 0,
      cover_alt: body.cover_alt ?? void 0,
      category_id: body.category_id ?? void 0,
      author_name: body.author_name ?? "Dental Empire",
      status: body.status ?? "draft",
      is_featured: body.is_featured != null ? Boolean(body.is_featured) : void 0,
      is_pinned: body.is_pinned != null ? Boolean(body.is_pinned) : void 0,
      is_recommended: body.is_recommended != null ? Boolean(body.is_recommended) : void 0,
      chapter_id: body.chapter_id ?? void 0,
      scanner_id: body.scanner_id ?? void 0
    });
    return new Response(JSON.stringify({ success: true, id: body.id, slug: body.slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Blog POST error:", err);
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
