globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const ALLOWED_MIME = {
  // Images
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  // Documents
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  // Video
  "video/mp4": "mp4",
  // Presentation
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx"
};
const MAX_SIZE_DEFAULT = 10 * 1024 * 1024;
const MAX_SIZE_RESOURCE = 100 * 1024 * 1024;
const POST = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return badRequest("Expected multipart/form-data");
  }
  const formData = await request.formData();
  const file = formData.get("file");
  const purpose = formData.get("purpose") || "book";
  const chapterId = formData.get("chapterId") || "unsorted";
  if (!file || !(file instanceof File)) {
    return badRequest("No file provided");
  }
  const maxSize = purpose === "resource" ? MAX_SIZE_RESOURCE : MAX_SIZE_DEFAULT;
  if (file.size > maxSize) {
    return badRequest(`File too large (max ${maxSize / 1024 / 1024}MB)`);
  }
  const mime = file.type;
  if (!ALLOWED_MIME[mime]) {
    return badRequest(`File type "${mime}" is not allowed`);
  }
  const ext = ALLOWED_MIME[mime];
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const baseName = safeName.replace(/\.[^.]+$/, "");
  const folder = purpose === "resource" ? "resources" : purpose === "blog" ? "blog" : `book/${chapterId}`;
  const key = `${folder}/${crypto.randomUUID()}-${baseName}.${ext}`;
  const safeDispositionName = safeName.replace(/["\\]/g, "_");
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      contentDisposition: mime.startsWith("image/") ? `inline; filename="${safeDispositionName}"` : `attachment; filename="${safeDispositionName}"`
    }
  });
  return json({ r2_key: key, url: `/media/${key}`, mime, filename: file.name }, 201);
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
