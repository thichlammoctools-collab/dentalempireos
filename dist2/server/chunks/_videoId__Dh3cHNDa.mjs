globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { d as deleteCourseVideo, u as upsertCourseVideo } from "./course-db_J4CV3PXm.mjs";
const prerender = false;
const PUT = async ({ params, request }) => {
  try {
    const { videoId } = params;
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Thiếu video id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    if (!body.youtube_id || !body.title) {
      return new Response(JSON.stringify({ error: "Thiếu trường bắt buộc: youtube_id, title" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const video = await upsertCourseVideo(env.DB, {
      id: videoId,
      course_id: body.course_id,
      youtube_id: body.youtube_id,
      title: body.title,
      description: body.description ?? null,
      sort_order: body.sort_order ?? 0,
      duration_seconds: body.duration_seconds ?? null,
      is_published: body.is_published ?? 0
    });
    return new Response(JSON.stringify({ success: true, video }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Video PUT error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ params }) => {
  try {
    const { videoId } = params;
    if (!videoId) {
      return new Response(JSON.stringify({ error: "Thiếu video id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await deleteCourseVideo(env.DB, videoId);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Video DELETE error:", err);
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
