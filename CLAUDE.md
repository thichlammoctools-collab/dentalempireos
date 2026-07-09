# CLAUDE.md

Project-specific guidelines for Dental Empire OS.

## Project Overview

**Dental Empire OS** — Nền tảng CMS/learning management cho nội dung sách về quản lý clinic nha khoa.

- **Framework:** Astro v6 với SSR (`output: 'server'`)
- **Adapter:** Cloudflare Workers (`@astrojs/cloudflare`)
- **UI:** Tailwind CSS v4 (class-based dark mode), Be Vietnam Pro font (self-hosted via @fontsource)
- **Auth:** better-auth với Cloudflare KV (`SESSION` namespace)
- **Database:** Cloudflare D1 (`DB` binding) + Kysely ORM
- **Storage:** Cloudflare R2 (`MEDIA` bucket) cho media files
- **Vector Search:** Cloudflare Vectorize cho AI content retrieval
- **Payments:** PayOS integration
- **Email:** Resend
- **AI:** Multi-provider AI (OpenAI, Claude, etc.) với configurable providers

**Ngôn ngữ:** Tiếng Việt (vi-VN) — code comments, UI text, commit messages đều bằng tiếng Việt.

## Tech Stack Quick Reference

```
src/pages/          → Astro pages (SSR endpoints + .astro components)
src/pages/api/       → API routes (.ts files)
src/lib/            → Server-side logic (DB, auth, utilities)
src/components/     → Astro components (UI)
src/data/           → Static data/constants
src/content/        → MDX content (book chapters)
src/styles/         → global.css (Tailwind v4, Material Design 3 tokens)
migrations/         → D1 schema migrations
```

### Environment Bindings (wrangler.jsonc)
- `DB` — D1 database
- `SESSION` — KV namespace cho sessions
- `MEDIA` — R2 bucket cho media
- `VECTORIZE` — Vector search index

### Key Commands
```bash
npm run dev          # Local dev (Astro dev server)
npm run build        # Production build
npm run db:migrate   # Apply D1 migrations (local + remote)
npm run db:seed      # Seed books content (local + remote)
npm run db:seed:local  # Seed books content (local only)
npm run db:seed:blog # Seed blog content (remote)
```

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Trước khi implement:
- Nêu assumptions rõ ràng. Nếu không chắc, hỏi.
- Nếu có nhiều cách interpret, present tất cả — đừng chọn âm thầm.
- Nếu có cách đơn giản hơn, nói ra. Push back khi cần.
- Nếu có gì không rõ, dừng lại. Nêu rõ điều gì đang confuse. Hỏi.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- Không thêm features ngoài phạm vi request.
- Không tạo abstractions cho code dùng một lần.
- Không thêm "flexibility" chưa được request.
- Không xử lý error cho scenarios không thể xảy ra.
- Nếu viết 200 dòng mà có thể 50 dòng, rewrite.

**Với Astro SSR:** Giữ logic server-side trong `.ts` files ở `src/pages/api/`, không đẩy xuống client. Chỉ gửi data thực sự cần thiết tới frontend.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

Khi edit code hiện có:
- Không "improve" code xung quanh, comments, hoặc formatting.
- Không refactor thứ không hỏng.
- Match existing style, kể cả khi bạn sẽ viết khác.
- Nếu thấy dead code không liên quan, mention — không xóa.

Khi changes tạo orphans:
- Xóa imports/variables/functions mà YOUR changes làm unused.
- Không xóa pre-existing dead code trừ khi được request.

**Test:** Mỗi dòng changed phải trace trực tiếp về user request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Chuyển tasks thành verifiable goals:
- "Add validation" → "Write test cho invalid inputs, rồi make them pass"
- "Fix bug" → "Write test reproduce bug, rồi make it pass"
- "Refactor X" → "Ensure tests pass before and after"

Với multi-step tasks, nêu brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

## 5. Cloudflare-Specific Guidelines

### D1 Database
- **Luôn dùng Kysely** (`src/lib/*-db.ts`) cho tất cả DB queries — không viết raw SQL strings trong page/API code.
- Migration files đặt trong `migrations/` với format `XXXX_name.sql`.
- Mỗi migration nên có: descriptive name, idempotent (chạy lại không lỗi).
- **SQLite ≠ PostgreSQL:** D1 dùng SQLite. Tránh features không supported: `GENERATED ALWAYS AS`, certain JSON functions, array types. Khi doubt, check SQLite docs.

### API Response Patterns
- Dùng pattern từ `src/lib/api-helpers.ts` (`json()`, `errorResponse()`).
- Luôn handle errors với try/catch, return appropriate HTTP status codes.
- Admin endpoints kiểm tra auth via `better-auth` session — không bypass.

### R2 Media
- Media files access qua `src/pages/media/[...key].ts` endpoint (signed URLs nếu cần).
- KHÔNG hardcode R2 URLs trong code — dùng helper functions.

### Vectorize
- Content chunks được upsert khi blog/chapter được publish.
- Query Vectorize cho RAG (AI responses) — nhưng LUÔN verify AI response context, không trust blindly.

## 6. Astro SSR Patterns

### Server vs Client Logic
- **`.astro` files:** HTML rendering, minimal logic. Auth checks OK.
- **`.ts` API files:** Business logic, DB operations, auth validation.
- KHÔNG dùng `client:*` directives cho critical functionality — dùng vanilla JS progressive enhancement.

### Content
- Book chapters: MDX trong `src/content/book/` — dùng Astro Content Collections.
- Blog posts: D1 database, không phải Content Collections.
- Resources: D1 database.

### Auth
- `better-auth` với Cloudflare KV session storage.
- `src/lib/auth-client.ts` cho client-side auth helpers.
- Admin routes protected bởi `AdminLayout.astro` hoặc explicit session checks.

## 7. UI / Styling Conventions

- **Tailwind CSS v4** với `@theme {}` block cho design tokens (Material Design 3 system).
- Dark mode: `.dark` class trên `<html>`. Dùng `@variant dark (&:where(.dark, .dark *))` cho conditional styles.
- **Không dùng inline styles** cho colors/spacing — dùng Tailwind utilities hoặc theme variables.
- Font: Be Vietnam Pro 400/500/600/700 + italic, self-hosted trong `src/lib/fonts/`.

## 8. Những lỗi thường gặp cần tránh

1. **Chạy migration rồi không seed** — nhiều features phụ thuộc seed data (products, scanners, blog categories).
2. **Thay đổi schema mà không tạo migration** — mọi schema change phải có migration file.
3. **Dùng Cloudflare D1 features không có trong SQLite** — kiểm tra trước khi dùng advanced SQL.
4. **Hardcode environment-specific values** — dùng `env` từ `Astro.locals` hoặc wrangler vars.
5. **Gửi quá nhiều data tới client** — SSR means có thể filter ở server, không cần gửi rồi hide bằng CSS.
6. **Bỏ qua dark mode** — mọi UI component mới phải hỗ trợ cả light và dark theme.
7. **Sử dụng Google Fonts CDN** — đã dùng @fontsource self-hosted, không quay lại CDN.

## 9. Working with External Services

- **PayOS:** Webhook phải handle idempotency — same request có thể đến nhiều lần.
- **Resend:** Email templates dùng React Email syntax nếu có, không inline HTML strings.
- **AI Providers:** Multi-provider via `src/lib/ai-provider-db.ts`. Mỗi provider có model config. Khi thêm provider mới, cập nhật cả UI selector và API routing.
- **Cloudflare Vectorize:** Index name: `dental-content`. Vector dimension phải match embedding model (thường 1536 cho OpenAI text-embedding-3-small).

---

**Các guidelines này hiệu quả khi:** diff có ít thay đổi không cần thiết, ít rewrite do overcomplication, và clarifying questions đến trước implementation thay vì sau mistakes.
