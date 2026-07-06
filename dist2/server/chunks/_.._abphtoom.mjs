globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
const prerender = false;
const handler = async ({ request }) => {
  try {
    const url = new URL(request.url);
    console.log(`[Auth] ${request.method} ${url.pathname}`);
    const auth = createAuth(env);
    const response = await auth.handler(request);
    if (response.status >= 400) {
      const clone = response.clone();
      const body = await clone.text();
      console.error(`[Auth] ${response.status} → ${body}`);
    }
    return response;
  } catch (err) {
    console.error("[Auth] Handler crashed:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = handler;
const POST = handler;
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
