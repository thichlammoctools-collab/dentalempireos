globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
const prerender = false;
const ALLOWED_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp"
};
const MAX_SIZE = 5 * 1024 * 1024;
const POST = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: "unauthorized" }, 401);
  }
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return badRequest("Expected multipart/form-data");
  }
  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return badRequest("No file provided");
  }
  if (file.size > MAX_SIZE) {
    return badRequest(`File too large (max ${MAX_SIZE / 1024 / 1024}MB)`);
  }
  const mime = file.type;
  const ext = ALLOWED_MIME[mime];
  if (!ext) {
    return badRequest(`File type "${mime}" is not allowed`);
  }
  const key = `avatars/${session.user.id}-${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      contentDisposition: "inline"
    }
  });
  return json({ url: `/media/${key}`, r2_key: key }, 201);
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
