# Claude Agent Guidance for dentalempireos

## Project Overview

**dentalempireos** is an Astro-based static content site for the "Dental Empire OS" book — a comprehensive guide to building and managing modern dental clinics as a system, not a machine.

- **Framework**: Astro 6.4.7 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with typography plugin
- **Content**: 32 chapters across 3 tiers, managed via `astro:content` with MDX support
- **Deployment**: Cloudflare adapter
- **Build**: `npm run build` → `npm run preview` to validate, `npm run dev` for local dev
- **Node**: v22.12.0+ required

---

## Architecture & Key Patterns

### Content Structure (`src/content/book/`)

The book is organized into **3 tiers** (32 chapters total), managed through:

1. **Frontmatter schema** (`src/content.config.ts`):
   - `title`, `description`, `tier` (1–3), `chapter` (1–32), `order`, `draft`
   - Optional `modules[]` to override h2 heading extraction
   
2. **Chapter metadata** (`src/data/modules.ts`):
   - Golden source of truth for all 32 chapters: title, slug, tier, description
   - Helper functions: `getChaptersByTier()`, `getChapterBySlug()`, `getAdjacentChapterMeta()`
   - Testimonials for homepage social proof

3. **Collection helpers** (`src/lib/collection-helpers.ts`):
   - `getAllChapters()` — returns non-draft chapters sorted by tier then order
   - `getAdjacentChapters()` — pagination (prev/next)
   - `getModulesFromHeadings()` — extracts h2 headings or uses frontmatter modules
   - `getAllChaptersGroupedByTier()` — for sidebar navigation

### Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero, tier overview, testimonials |
| `/book/[...slug]` | Chapter reader (dynamic) |
| `/book/` | Book index/tier selector |
| `/resources/` | Digital assets & downloads |
| `/admin.astro` | Admin panel (if needed) |

### Component Stack

- **Layout**: `BookLayout.astro` (sidebar, TOC, header/footer)
- **Book-specific**: `ChapterNav` (prev/next), `ModuleNav` (h2 chips), `TableOfContents`, `SidebarNav`, `DonateWidget`
- **UI primitives**: `Badge`, `Button`, `Callout`, `Card`, `ThemeToggle`

### Styling Approach

- **Colors**: Navy/medical blue (trust), white/light gray (clean), accent orange/yellow (CTA)
- **Typography**: Be Vietnam Pro preferred (fallback: Inter/Roboto); `@tailwindcss/typography` for `.prose`
- **Themes**: Dark-first (medical, reading-friendly) + light mode toggle
- **Responsive**: Mobile-first, sticky sidebar on desktop

---

## Common Tasks & Workflows

### 📝 Adding or Editing Chapter Content

1. **Create or update** `.mdx` file in `src/content/book/tier-X/`
2. **Add frontmatter**:
   ```yaml
   ---
   title: "Chapter Title"
   tier: 1
   chapter: 1
   description: "Short summary"
   order: 1
   draft: false
   modules: 
     - title: "Module A"
       slug: "module-a"
     - title: "Module B"
       slug: "module-b"
   ---
   ```
3. **Update** `src/data/modules.ts` if adding a new chapter to the golden source
4. **Build & preview**: `npm run build && npm run preview`

### 🎨 Component Updates

- Astro components in `src/components/` are the single source of truth
- Use `@apply` or Tailwind utility classes; avoid inline styles
- Keep props typed via TypeScript interfaces
- Test responsive behavior on mobile (sticky sidebar, readable widths)

### 🔍 SEO & Metadata

- Frontmatter `description` becomes meta tags on chapter pages
- `astro:sitemap` generates `sitemap.xml` (site: dentalempireos.com)
- Astro's head management is automatic; use `<Head>` in layouts for custom tags

### 🛠 Build & Deploy

- **Local dev**: `npm run dev` → http://localhost:3000 (hot reload)
- **Build**: `npm run build` → outputs to `dist/`
- **Preview**: `npm run preview` → simulates production
- **Deploy**: Cloudflare adapter handles deployment; wrangler config in `.wrangler/`

---

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| Chapter doesn't appear in sidebar | Check `draft: false` in frontmatter; update `src/data/modules.ts` |
| MDX syntax errors (JSX in `.mdx`) | Ensure balanced braces; use Astro components with correct imports |
| Sidebar nav out of sync | Run `getAllChaptersGroupedByTier()` after updating modules; clear `.astro/` cache |
| Styling not applied | Check Tailwind config in `astro.config.mjs`; restart dev server |
| Build fails on TypeScript | Check `tsconfig.json` (strict mode); run `npm run astro -- check` |

---

## File Editing Guidelines

- **Content files** (`.mdx`): Use standard Markdown + JSX. Indent nested JSX by 2 spaces.
- **Astro components**: Frontmatter (YAML) → HTML/slots. Use fragments `<>...</>` for multiple roots.
- **Styling**: Prefer utility classes; use `@apply` for repeated patterns in `global.css`.
- **TypeScript**: All data access is typed. Leverage `CollectionEntry<'book'>` for safety.

---

## Quick Links

- **Book metadata** → [src/data/modules.ts](src/data/modules.ts)
- **Collection schema** → [src/content.config.ts](src/content.config.ts)  
- **Helper functions** → [src/lib/collection-helpers.ts](src/lib/collection-helpers.ts)
- **Book layout** → [src/layouts/BookLayout.astro](src/layouts/BookLayout.astro)
- **Chapter template** → [src/pages/book/[...slug].astro](src/pages/book/[...slug].astro)
- **README** → [README.md](README.md) (project vision & design system)

---

## Next Steps for Agent

When asked to work on this codebase:

1. **Content edits** → Update `.mdx` files and `src/data/modules.ts` in lockstep
2. **Component changes** → Verify responsive design; test dark/light mode toggle
3. **Build issues** → Run `npm run astro -- check` to diagnose; inspect `.astro/` cache if needed
4. **Performance** → Astro static generation is fast; monitor `.wrangler/` for CF deployments

---

**Last updated**: 2026-06-17
