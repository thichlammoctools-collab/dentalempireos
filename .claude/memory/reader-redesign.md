---
name: reader-redesign
description: Reader UX redesign — full rearchitecture of book reader for desktop + mobile optimization
metadata:
  type: project
---

## Reader Redesign (2026-06-17)

### What changed

**Layout Architecture:**
- Collapsed 3-panel layout (Left nav + Main + Right TOC) into a **2-panel layout**: TOC sidebar (desktop) + Reader scroll area
- Reader now uses its own dedicated container (`#reader-app`) separate from the global site layout
- Fixed toolbar at top, content scrolls in the middle, status bar at bottom (desktop)

**Desktop:**
- Toolbar with back button, breadcrumb, progress bar, and controls
- Collapsible TOC sidebar (288px) on the left
- Focus mode: hides toolbar/sidebar/status until hover
- Status bar at bottom with word count, fullscreen

**Mobile:**
- Fixed bottom navigation bar (5 controls: Mục lục, Cỡ chữ, Nền, Focus, Đánh dấu)
- FAB button for TOC drawer
- Bottom sheet with drag-to-close gesture
- Progress bar as thin line at top
- Safe area inset support

**Features:**
- 3 themes: Dark (default) → Light → Sepia (cycle via button)
- 5 font sizes: sm/md/lg/xl/2xl
- Focus mode (hide all chrome)
- Bookmark toggle
- Search overlay (Ctrl+K shortcut)
- Real-time reading progress tracking
- Word count display
- Fullscreen support

### Files changed
- `src/layouts/BookLayout.astro` — complete rewrite
- `src/components/book/SidebarMobile.astro` — bottom sheet redesign
- `src/components/book/ModuleNav.astro` — reader styling
- `src/styles/global.css` — reader theme vars + focus mode
- `src/pages/book/[...slug].astro` — added reader-content class

### Standalone demo
- `redesigned-reader.html` — complete standalone preview of the new reader design
