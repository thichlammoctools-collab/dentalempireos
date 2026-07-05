globalThis.process ??= {};
globalThis.process.env ??= {};
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
const prerender = false;
const POST = async () => {
  return json({
    ok: true,
    message: "Nội dung đã được lưu và hiển thị ngay lập tức."
  });
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
