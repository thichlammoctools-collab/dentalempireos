globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, n as notFound, j as json } from "./api-helpers_DYIwbpI_.mjs";
import { g as getScannerResponse, m as maskEmail } from "./scanner-response-db_DlgoOmv3.mjs";
const prerender = false;
const GET = async ({ params, url }) => {
  const id = parseInt(params.id ?? "", 10);
  if (!id) return badRequest("id is required");
  const isAdmin = url.searchParams.get("admin") === "1";
  const response = await getScannerResponse(env.DB, id);
  if (!response) return notFound("Response not found");
  const masked = isAdmin ? response : {
    ...response,
    email: response.email ? maskEmail(response.email) : null
  };
  return json(masked);
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
