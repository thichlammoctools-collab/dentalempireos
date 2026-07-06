globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { m as maybeRenderHead, a as addAttribute, F as Fragment, r as renderTemplate } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_Q6Er6zLO.mjs";
const $$StarRating = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$StarRating;
  const { name, value = 0, readonly = false, size = "md" } = Astro2.props;
  const uid = `sr-${name}-${Math.random().toString(36).slice(2, 8)}`;
  const sizeMap = { sm: "text-lg", md: "text-xl", lg: "text-2xl" };
  const starSize = sizeMap[size];
  return renderTemplate`<!--
  Star rating using pure CSS sibling selectors.
  RTL direction so star 5 is on the right, star 1 on the left visually.
  DOM order: 5,4,3,2,1 → visual order (RTL): 1,2,3,4,5
  input:checked ~ label highlights all labels after it in DOM (= lower stars visually).
-->${maybeRenderHead()}<div${addAttribute(["star-rating flex items-center gap-1", { "pointer-events-none": readonly }], "class:list")} style="direction: rtl;"> ${[5, 4, 3, 2, 1].map((star) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <input type="radio"${addAttribute(name, "name")}${addAttribute(star, "value")}${addAttribute(`${uid}-${star}`, "id")}${addAttribute(star === value, "checked")}${addAttribute(readonly, "disabled")} class="sr-only"> <label${addAttribute(`${uid}-${star}`, "for")}${addAttribute([
    "star-label cursor-pointer transition-all duration-150 -mr-0.5",
    starSize,
    readonly ? "!cursor-default" : "hover:scale-110"
  ], "class:list")}> <span${addAttribute([
    "material-symbols-outlined",
    star <= value ? "text-amber-400" : "text-on-surface-variant/30"
  ], "class:list")} style="font-variation-settings: 'FILL' 1;">
star
</span> </label> ` })}`)} </div>`;
}, "C:/dentalempireos/src/components/book/StarRating.astro", void 0);
export {
  $$StarRating as $
};
