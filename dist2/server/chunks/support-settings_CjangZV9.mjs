globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getSupportSettings } from "./book-db_DDcc_FYk.mjs";
const prerender = false;
const GET = async () => {
  const settings = await getSupportSettings(env.DB);
  return json(settings ?? { enabled: 0 });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
