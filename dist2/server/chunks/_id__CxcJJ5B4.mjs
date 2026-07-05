globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as deleteCourse, g as getCourse, c as upsertCourse } from "./course-db_J4CV3PXm.mjs";
const prerender = false;
const GET = async ({ params }) => {
  try {
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Thiếu id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const course = await getCourse(env.DB, id);
    if (!course) {
      return new Response(JSON.stringify({ error: "Không tìm thấy" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(course), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Course GET error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
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
    if (!body.title) {
      return new Response(JSON.stringify({ error: "Thiếu title" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const course = await upsertCourse(env.DB, {
      id,
      title: body.title,
      description: body.description ?? null,
      thumbnail_url: body.thumbnail_url ?? null,
      sort_order: body.sort_order ?? 0,
      is_published: body.is_published ?? 0
    });
    return new Response(JSON.stringify({ success: true, course }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Course PUT error:", err);
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
    await deleteCourse(env.DB, id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Course DELETE error:", err);
    return new Response(JSON.stringify({ error: "Lỗi server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
