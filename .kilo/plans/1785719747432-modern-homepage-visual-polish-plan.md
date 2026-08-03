# Modern Homepage Visual Polish Plan

## Goal

Modernize the homepage visual language with restrained CSS/vector effects and recognizable iconography for `SKY`, `S.T.A.R.S`, `R.O.A.D.M.A.P`, `ONE LIGHT`, and `Nha khoa · Răng Hàm Mặt`, while preserving the existing CMS, payment, navigation, theme, and responsive behavior.

## Confirmed Decisions

- Scope is limited to the homepage and reusable global utility CSS.
- Visual style is CSS/vector-based, using the existing Material Symbols convention; no new icon package or external artwork dependency.
- The dental concept is labeled `Nha khoa · Răng Hàm Mặt` and represented with a tooth/clinical icon.
- Reader, admin, header, footer, and site-wide layout structure remain unchanged.
- Existing light mode and dark mode must both remain readable.

## Current Context

- The homepage is monolithic in `src/pages/index.astro:96-245`.
- The current hero has a simple radial-gradient background and a process panel in the right column (`src/pages/index.astro:96-137`).
- Framework semantics already exist in `src/data/modules.ts:64-70` and links/descriptions in `src/data/keywords.ts:10-38,96-100`.
- Existing reusable effects include `glass-card`, `glass-panel-dark`, `cyan-glow`, `text-gradient-cyan`, and `status-dot` in `src/styles/global.css:388-417`.
- Material Symbols are already loaded by `src/layouts/BaseLayout.astro:122-136`.

## Implementation Steps

1. **Create a framework visual component**
   - Add `src/components/home/FrameworkVisual.astro`.
   - Keep the component presentational and self-contained; do not move D1/payment logic into it.
   - Render a responsive visual composition with five labeled nodes or orbit items:
     - `SKY`: `cloud`/`north`/`height` motif, cyan-blue atmosphere, linked to `/book/tier-3/24-to-be-sky#sky-la-gi`.
     - `S.T.A.R.S`: `auto_awesome`/`star` motif, small constellation points, linked to `/book/tier-3/25-s-t-a-r-s`.
     - `R.O.A.D.M.A.P`: `route`/`alt_route`/`map` motif, connected sequential path, linked to `/book/tier-3/26-r-o-a-d-m-a-p`.
     - `ONE LIGHT`: `light_mode`/`flare` motif, central warm light/origin point, linked to the `ONE LIGHT` anchor.
     - `Nha khoa · Răng Hàm Mặt`: `dentistry` or the closest existing Material Symbol, placed as the clinical identity anchor.
   - Use semantic links, visible labels, `aria-label`, and a `prefers-reduced-motion`-safe presentation. Decorative elements must be `aria-hidden`.
   - Use CSS borders, pseudo-elements, gradients, and Material Symbols rather than hand-authored large SVG artwork.

2. **Integrate the component into the homepage hero**
   - Update `src/pages/index.astro:96-137` to import and render `FrameworkVisual` in the current right-side hero area.
   - Preserve the existing three-step “Vận hành không phụ thuộc” content either as supporting copy inside the visual panel or immediately below it; do not remove its meaning.
   - Keep hero CTAs, `PaymentButton`, `canPurchaseBook`, `activeBookProduct`, `paymentCopy`, and all existing anchor IDs unchanged.
   - Make the hero composition responsive: stacked visual below the copy on small screens and a balanced two-column layout on large screens.
   - Add a small “framework map” eyebrow/legend only if it does not compete with the existing primary heading and CTA.

3. **Add reusable visual background utilities**
   - Extend `src/styles/global.css` in the utility/effects area near `src/styles/global.css:380-417` with narrowly scoped classes, for example:
     - layered homepage background with theme-aware cyan/blue and warm amber radial lighting;
     - subtle grid or constellation texture with low opacity;
     - animated glow/orbit/path state;
     - a panel treatment that supports glass surfaces without reducing text contrast.
   - Prefer CSS custom properties and semantic theme tokens over hard-coded light-only colors.
   - Add `@media (prefers-reduced-motion: reduce)` overrides that disable orbit/pulse/path animation and retain static highlights.
   - Avoid a full-page background change so reader/admin pages are unaffected.

4. **Give related homepage sections a lighter visual refresh**
   - Apply the new utility classes selectively to the roadmap section (`src/pages/index.astro:152-161`) and tier overview (`src/pages/index.astro:163-184`) so the visual system feels intentional beyond the hero.
   - Add small Material Symbol icon blocks to roadmap cards and tier cards using existing metadata where appropriate; do not introduce new database fields.
   - Keep content, links, tier counts, and resources notice behavior unchanged.
   - Avoid nested card-on-card composition and excessive shadows; maintain the existing restrained operational/product feel.

5. **Accessibility and compatibility pass**
   - Verify text contrast in both `:root` light tokens and `.dark` tokens.
   - Ensure all framework links have meaningful accessible names and keyboard-visible focus states.
   - Ensure decorative animation does not affect layout dimensions or cause horizontal overflow.
   - Keep Material Symbol fallbacks legible if the font loads late.
   - Preserve responsive behavior around the fixed header and mobile bottom navigation.

## Data and Scope Boundaries

- No changes to `src/lib/homepage-db.ts`, migrations, admin forms, or API allowlists are required because the five concept labels and icon mapping are static presentation content.
- No changes to `src/data/modules.ts` or `src/data/keywords.ts` are required unless implementation chooses to import existing framework destinations rather than duplicate literal paths. Prefer importing or defining a small local mapping to avoid broad data refactoring.
- No changes to `src/layouts/BaseLayout.astro`, `Header.astro`, `Footer.astro`, reader components, or admin pages.
- Do not add remote images, new fonts, or a new icon dependency.

## Validation Plan

1. Run `npm run astro -- check` to catch Astro/TypeScript/template issues.
2. Run `npm run build` to validate Cloudflare SSR/static generation and all homepage imports.
3. Start the dev server with `npm run dev`; use the configured local URL to inspect the homepage.
4. Check desktop and mobile widths for:
   - no horizontal overflow;
   - hero visual and labels fitting within their panel;
   - CTA and payment states unchanged;
   - roadmap/tier links still functional.
5. Toggle light/dark theme and verify contrast, borders, glow opacity, and icon labels.
6. Test `prefers-reduced-motion: reduce` and confirm all content remains visible without animation.
7. Review the final diff to ensure only the new component, homepage presentation, and narrowly scoped CSS utilities changed.

## Risks

- Overly strong glows or glass opacity can reduce readability in light mode; use low-opacity decorative layers and semantic text colors.
- Material Symbols names may vary by font version; use broadly supported symbols such as `cloud`, `star`, `route`, `light_mode`, and `dentistry` with graceful visual fallback.
- A dense orbit composition may become cramped on mobile; switch to a two-row or vertical arrangement below the large-screen breakpoint rather than scaling text or fixed artwork.
- Existing Tailwind v4 arbitrary classes are used heavily in the homepage; keep custom CSS class names explicit and avoid broad selectors that affect other routes.
