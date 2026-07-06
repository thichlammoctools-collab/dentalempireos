globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { b as badRequest, j as json, n as notFound } from "./api-helpers_DYIwbpI_.mjs";
import { m as deleteSection, j as getSectionById, n as updateSection } from "./survey-config-db_CRuLFWXk.mjs";
const prerender = false;
const GET = async ({ params }) => {
  const sid = parseInt(params.sid ?? "", 10);
  if (!sid) return badRequest("sid is required");
  const row = await getSectionById(env.DB, sid);
  if (!row) return notFound("Section not found");
  return json(row);
};
const PATCH = async ({ params, request }) => {
  const sid = parseInt(params.sid ?? "", 10);
  if (!sid) return badRequest("sid is required");
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const updated = await updateSection(env.DB, sid, body);
  if (!updated) return notFound("Section not found");
  return json({ id: sid, updated: true });
};
const DELETE = async ({ params }) => {
  const sid = parseInt(params.sid ?? "", 10);
  if (!sid) return badRequest("sid is required");
  await deleteSection(env.DB, sid);
  return json({ deleted: true });
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
