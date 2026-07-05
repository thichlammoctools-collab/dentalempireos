globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { b as createAuth } from "./index_CZ-nCjtb.mjs";
import { g as getClinicProfile, u as upsertClinicProfile } from "./clinic-profile-db_Pku6qJUb.mjs";
const prerender = false;
const GET = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: "unauthorized" }, 401);
  }
  const profile = await getClinicProfile(env.DB, session.user.id);
  return json(profile ?? {
    id: session.user.id,
    name: session.user.name,
    clinic_name: null,
    clinic_address: null,
    phone: null,
    logo_url: null,
    updated_at: null
  });
};
const PUT = async ({ request }) => {
  const auth = createAuth(env);
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return json({ error: "unauthorized" }, 401);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  await upsertClinicProfile(env.DB, {
    id: session.user.id,
    name: typeof body.name === "string" ? body.name.trim() || null : null,
    clinic_name: typeof body.clinic_name === "string" ? body.clinic_name.trim() || null : null,
    clinic_address: typeof body.clinic_address === "string" ? body.clinic_address.trim() || null : null,
    phone: typeof body.phone === "string" ? body.phone.trim() || null : null
  });
  const updated = await getClinicProfile(env.DB, session.user.id);
  return json(updated);
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  GET,
  PUT,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
