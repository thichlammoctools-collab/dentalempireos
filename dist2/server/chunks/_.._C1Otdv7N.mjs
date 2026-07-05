globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const HEAD = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return new Response(null, { status: 400 });
  }
  const head = await env.MEDIA.head(key);
  if (!head) {
    return new Response(null, { status: 404 });
  }
  const headers = new Headers();
  headers.set("Content-Length", String(head.size));
  headers.set("Content-Type", head.httpMetadata?.contentType ?? "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(null, { status: 200, headers });
};
const GET = async ({ params }) => {
  const key = params.key;
  if (!key) {
    return json({ error: "Missing key" }, 400);
  }
  const object = await env.MEDIA.get(key);
  if (!object) {
    return json({ error: "File not found" }, 404);
  }
  const headers = new Headers();
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  const ct = object.httpMetadata?.contentType ?? "application/octet-stream";
  headers.set("Content-Type", ct);
  const filename = key.split("/").pop() || "download";
  const cd = object.httpMetadata?.contentDisposition;
  headers.set("Content-Disposition", cd || `attachment; filename="${filename}"`);
  return new Response(object.body, { status: 200, headers });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  HEAD,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
