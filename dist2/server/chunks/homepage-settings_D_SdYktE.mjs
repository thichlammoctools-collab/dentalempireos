globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { s as seedHomepageSettings, g as getHomepageSettings, a as getDefaults, u as upsertHomepageSettings } from "./homepage-db_DaEeUQAE.mjs";
const prerender = false;
const GET = async () => {
  await seedHomepageSettings(env.DB);
  const settings = await getHomepageSettings(env.DB);
  return json(settings ?? getDefaults());
};
const PUT = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const allowedKeys = [
    "badge_text",
    "hero_title_line1",
    "hero_title_line2",
    "hero_description",
    "hero_cta_primary",
    "hero_cta_secondary",
    "hero_stats_text",
    "hero_image_url",
    "tier_section_heading",
    "tier_section_subheading",
    "tier1_name",
    "tier1_subtitle",
    "tier1_icon",
    "tier2_name",
    "tier2_subtitle",
    "tier2_icon",
    "tier3_name",
    "tier3_subtitle",
    "tier3_icon",
    "testimonial_section_heading",
    "testimonial_section_subheading",
    "testimonial1_quote",
    "testimonial1_name",
    "testimonial1_role",
    "testimonial1_avatar",
    "testimonial2_quote",
    "testimonial2_name",
    "testimonial2_role",
    "testimonial2_avatar",
    "testimonial3_quote",
    "testimonial3_name",
    "testimonial3_role",
    "testimonial3_avatar",
    "founder_badge",
    "founder_heading",
    "founder_bio",
    "founder_stat1_value",
    "founder_stat1_label",
    "founder_stat2_value",
    "founder_stat2_label",
    "founder_name",
    "founder_title",
    "founder_image_url",
    "founder_link_text",
    "cta_heading",
    "cta_subtext",
    "cta_primary_text",
    "cta_secondary_text",
    "cta_primary_icon",
    "cta_secondary_icon",
    "cta_primary_link",
    "cta_secondary_link",
    // About page
    "about_hero_badge",
    "about_hero_line1",
    "about_hero_line2",
    "about_hero_gradient",
    "about_hero_description",
    "about_hero_cta_primary",
    "about_hero_cta_secondary",
    "about_story_image_url",
    "about_story_heading",
    "about_story_para1",
    "about_story_para2",
    "about_story_stat1_value",
    "about_story_stat1_label",
    "about_story_stat2_value",
    "about_story_stat2_label",
    "about_founder_image_url",
    "about_founder_name",
    "about_founder_title",
    "about_founder_quote",
    "about_founder_role1_label",
    "about_founder_role1_desc",
    "about_founder_role2_label",
    "about_founder_role2_desc",
    "about_values_heading",
    "about_values_card1_title",
    "about_values_card1_desc",
    "about_values_card2_title",
    "about_values_card2_desc",
    "about_values_card3_title",
    "about_values_card3_desc",
    "about_values_card4_title",
    "about_values_card4_desc",
    "about_cta_line1",
    "about_cta_line2",
    "about_cta_primary",
    "about_cta_secondary",
    "about_cta_primary_link",
    "about_cta_secondary_link"
  ];
  const input = {};
  for (const key of allowedKeys) {
    if (key in body && body[key] !== void 0) {
      input[key] = body[key];
    }
  }
  if (Object.keys(input).length === 0) {
    return badRequest("No valid fields to update");
  }
  await upsertHomepageSettings(env.DB, input);
  return json({ ok: true });
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
