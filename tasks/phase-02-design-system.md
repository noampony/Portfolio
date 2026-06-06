# Phase 2 — Design System & Shared Layout

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 2.1 — Implement Color Tokens and Typography

**Phase:** 2 — Design System & Shared Layout
**Goal:** Encode the spec's color palette (§6.3) and typography (§6.4) as CSS custom properties / Tailwind theme tokens and self-hosted fonts.
**Depends on:** 1.2
**Estimated scope:** Medium
**Files likely to change:** `app/globals.css`, `tailwind.config.*`, `app/layout.tsx` (font loading), `app/fonts.ts` (if used).
**Inputs required:** None — palette and fonts are specified in §6.3 / §6.4.
**Implementation requirements:**
- Implement all §6.3 tokens (`--bg-base`, `--bg-surface`, `--bg-surface-raised`, `--border`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent`, `--accent-hover`, `--accent-contrast`, `--gradient-from`, `--gradient-to`, `--danger`) with the exact hex values.
- Enforce the §6.3 usage rules: one primary accent; filled accent buttons use `--accent` bg + `--accent-contrast` text; the blue gradient is for subtle accents only (not a second button color).
- Load Geist Sans (body/UI/headings) and JetBrains Mono (code/terminal/stat numbers/badges) via `next/font`, self-hosted, `display: swap`, primary family preloaded (spec §6.4). No render-blocking external font CSS.
- Implement the §6.4 type scale tokens (`display`, `h1`, `h2`, `body`, `small`) mobile-first, scaling up at `lg`. Cap body line length ~70–75ch.
**Acceptance criteria:**
- Tokens are usable from Tailwind classes and/or CSS variables across the app.
- Fonts render with correct fallback stacks and no layout shift / FOIT.
- A throwaway visual check confirms text/background pairings meet the §6.3 contrast targets.
**Verification steps:**
1. Build and inspect computed styles to confirm token values.
2. Run a contrast check on `--text-primary`/`--text-secondary` over `--bg-base` (expect AA+).
3. Confirm fonts are self-hosted (no external font network requests).
**Security/privacy checks:** No external font CDN calls (privacy); no third-party trackers introduced.
**Accessibility checks:** Contrast ratios meet AA (§20.4): ≥4.5:1 normal text, ≥3:1 large/UI.
**Completion rule:** Done when tokens + fonts are applied globally, contrast verified, and no external font requests occur.

---

### Task 2.2 — Build the Root Layout Shell, Skip Link, and Footer

**Phase:** 2 — Design System & Shared Layout
**Goal:** Establish semantic landmarks and the shared footer with a "Skip to content" link.
**Depends on:** 2.1
**Estimated scope:** Small
**Files likely to change:** `app/layout.tsx`, `components/layout/Footer.tsx`, `components/layout/SkipLink.tsx`, `app/globals.css`.
**Inputs required:** None.
**Implementation requirements:**
- Root layout uses real landmarks: `header`, `nav`, `main`, `footer` (spec §20.1). One `<h1>` per page is owned by page content, not the layout.
- "Skip to content" link is the first focusable element, targeting `<main>` (spec §20.6) — important because the navbar is sticky.
- Footer shows non-confidential, owner-approved info only (e.g. name, year, LinkedIn). No phone/email in the footer unless §15.6 confirmation exists; default to LinkedIn only.
**Acceptance criteria:**
- Skip link appears on first Tab and jumps focus to main content.
- Landmarks present and unique.
- Footer renders with no broken links.
**Verification steps:**
1. Tab from page load; confirm skip link is first and works.
2. Inspect DOM for one `header/nav/main/footer` structure.
**Security/privacy checks:** Footer exposes no contact data beyond what §15.6 permits; external links use `rel="noopener noreferrer"`.
**Accessibility checks:** Landmarks correct; skip link functional; visible focus on skip link.
**Completion rule:** Done when the shell renders with working skip link, correct landmarks, and a clean footer.

---

### Task 2.3 — Build the Sticky, Data-Driven Navbar

**Phase:** 2 — Design System & Shared Layout
**Goal:** Implement the sticky desktop navbar driven by a nav-config so section anchors can be registered incrementally without ever shipping broken links.
**Depends on:** 2.2
**Estimated scope:** Medium
**Files likely to change:** `components/layout/Navbar.tsx`, `lib/navigation.ts` (nav config), `app/layout.tsx`.
**Inputs required:** None for structure. (Resume nav behavior is **TBD** per §5.7 — see Implementation requirements.)
**Implementation requirements:**
- Sticky on scroll; must not cover section headings; sufficient contrast against page backgrounds on all breakpoints (spec §5.2).
- **Nav links are data-driven** from `lib/navigation.ts`. To honor "no broken links," the config initially contains only items whose targets exist. Section anchors (`#about`, `#experience`, etc. per §5.3) are appended by each section's completion task as those sections ship. Document this contract in the file.
- Per spec §5.1 the navbar must include Home, Projects, Courses, Resume. Until full Projects/Courses pages exist (nice-to-have/conditional), the Projects and Courses items point to the homepage preview anchors `#projects` / `#courses` (spec §5.3), and are re-pointed to dedicated pages only if/when Phases 15/16 build them. The Resume item's behavior is **TBD** (§5.7) and is wired in Task 10.2; until then it is not rendered (or rendered disabled with an accessible label) rather than pointing at a dead target.
- Active-state indication (spec §5.4): visible but not noisy; scroll-spy section highlighting is optional and, if added, must be in a later task — not here.
**Acceptance criteria:**
- Navbar is sticky and readable on desktop/tablet/mobile.
- No nav item points to a non-existent target at any commit.
- Nav config is the single source of truth for items.
**Verification steps:**
1. Scroll the page; confirm sticky behavior and that headings are not obscured.
2. Click each rendered nav item; confirm it resolves (no 404, no scroll-to-top dead anchor).
**Security/privacy checks:** No external/internal-only links; external links safe.
**Accessibility checks:** Keyboard operable, visible focus, sufficient contrast (§20.2–20.4).
**Completion rule:** Done when the sticky navbar renders from config with zero broken links and passes keyboard/contrast checks.

---

### Task 2.4 — Build the Accessible Mobile Navigation Menu

**Phase:** 2 — Design System & Shared Layout
**Goal:** Implement the responsive mobile menu that collapses the navbar.
**Depends on:** 2.3
**Estimated scope:** Medium
**Files likely to change:** `components/layout/MobileNav.tsx`, `components/layout/Navbar.tsx`.
**Inputs required:** Mobile menu visual style is **TBD** (spec §5.5). Use a conventional accessible pattern (e.g. a slide-down/overlay panel) as a non-product-decision default; do not invent branded visual flourishes beyond the design tokens.
**Implementation requirements:**
- Collapses into a mobile-friendly menu; keyboard accessible; closes when a nav item is selected; closes on outside click; never permanently blocks primary content (spec §5.5).
- Reuses the same nav-config as the desktop navbar.
**Acceptance criteria:**
- Menu opens/closes via pointer and keyboard.
- Selecting an item closes the menu and navigates.
- Outside click closes the menu.
**Verification steps:**
1. At mobile width, open menu, navigate with keyboard, select an item — menu closes.
2. Open menu, click outside — menu closes.
**Security/privacy checks:** No data exposure; links safe.
**Accessibility checks:** Focus moves into the menu when open; Escape/outside-click close; visible focus; no keyboard trap (§20.2–20.3).
**Completion rule:** Done when the mobile menu is fully keyboard- and pointer-operable with correct close behaviors and no broken links.
