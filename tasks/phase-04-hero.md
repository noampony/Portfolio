# Phase 4 — Hero Section (MVP)

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

> This is the MVP (spec §2.1). It must be fully complete and production-ready before any other section starts.

---

### Task 4.1 — Implement the Hero Layout and Semantic Structure

**Phase:** 4 — Hero Section
**Goal:** Build the Hero markup with correct heading order, content from Profile data, both CTAs (as intentional no-ops), the LinkedIn link, and location.
**Depends on:** 3.3, 2.4
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Hero.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** Profile image/logo is **TBD** (§8.1) — if absent, render an approved non-broken visual fallback (e.g. a monogram/logo block built from tokens), never a broken `<img>`.
**Implementation requirements:**
- Render name (`<h1>`), professional title, the required two-line hero text (§8.1), location, and the LinkedIn link (`https://www.linkedin.com/in/noam-pony/`) opening in a new tab with `rel="noopener noreferrer"` (§8.1, §15.8).
- Render both CTAs — Primary (Resume) and Secondary (Contact) — **styled, keyboard-focusable, and intentionally no-op** (spec §8.1, §8.1 Implementation note). No `href="#"`, no dead `/public/...` link. A no-op handler or disabled-but-labelled state is acceptable. Suggested default labels `Resume` / `Contact` (labels are TBD; use the suggested defaults and note this is a default, not a product decision — final labels owner-confirmable).
- Add an `id="home"` anchor for the Hero and append the `#home` item to the nav config (§5.3).
- Mark the floating-code background container now but leave the animation to Task 4.3; it must be `aria-hidden`/decorative.
**Acceptance criteria:**
- Hero shows name, title, summary, location, LinkedIn, and both CTAs.
- CTAs are focusable but perform no navigation/action (no broken links).
- LinkedIn opens safely in a new tab.
**Verification steps:**
1. Tab through the Hero: `h1` → text → CTAs → LinkedIn, all reachable.
2. Activate each CTA; confirm no navigation and no console error.
3. Confirm `#home` resolves and is in the nav config.
**Security/privacy checks:** No broken/placeholder destinations; external link safe; no confidential content.
**Accessibility checks:** Single `<h1>`, logical heading order, CTA labels present, visible focus (§20.1–20.3).
**Completion rule:** Done when the Hero renders all required content with no-op CTAs and zero broken links.

---

### Task 4.2 — Style the Hero and Make It Responsive

**Phase:** 4 — Hero Section
**Goal:** Apply the dark developer aesthetic and responsive behavior (spec §8.1 layout, §16).
**Depends on:** 4.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Hero.tsx`, related styles.
**Inputs required:** None.
**Implementation requirements:**
- Desktop: Hero near/above the fold; text + CTAs immediately visible; profile visual visible without overwhelming layout (§8.1).
- Mobile: text appears before/alongside the visual in a readable sequence; CTAs easy to tap; floating code reduced/hidden if it clutters (§8.1, §16.3).
- Use only the §6.3 tokens and §6.4 type scale. Filled accent button uses `--accent`/`--accent-contrast`.
**Acceptance criteria:**
- Hero is readable and well-composed at mobile, tablet, desktop with no horizontal overflow or layout shift.
**Verification steps:**
1. Resize across breakpoints; confirm sequence, tap targets, and no overflow.
2. Confirm CTA contrast meets AA.
**Security/privacy checks:** None beyond global.
**Accessibility checks:** Tap targets adequately sized; contrast AA; no content hidden behind hover-only (§20.4).
**Completion rule:** Done when the Hero is polished and correct across all breakpoints with no layout shift.

---

### Task 4.3 — Add Hero Animations with Reduced-Motion Support

**Phase:** 4 — Hero Section
**Goal:** Add subtle entrance animation and the animated floating Python code background, fully respecting reduced motion (spec §7, §8.1).
**Depends on:** 4.2
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Hero.tsx`, `components/sections/FloatingCode.tsx`.
**Inputs required:** Exact Python snippets to display are **TBD** (§19.2). Use short, generic, non-confidential Python that does not reference any employer/internal system (e.g. trivial language constructs). Mark snippet content as a default pending owner confirmation; never include real work code.
**Implementation requirements:**
- Subtle fade-in for hero content; animated floating Python code blocks in the background that support the aesthetic without harming readability (§7.1, §8.1).
- Under `prefers-reduced-motion: reduce`: disable/greatly reduce the floating animation and entrance motion; content stays fully visible (§7.3, §7.5).
- Prefer transform/opacity; no layout shift; no infinite battery-draining animation that distracts (§14.8). Use Framer Motion intentionally or CSS where sufficient.
- Floating code is decorative: `aria-hidden="true"`, not announced to screen readers, not focusable.
**Acceptance criteria:**
- Animations are subtle and do not reduce readability or cause layout shift.
- With reduced motion on, animations are off/minimal and all content is visible.
- Background code does not contain any real/work-derived code.
**Verification steps:**
1. Load Hero; confirm subtle entrance + floating code.
2. Enable OS reduced-motion; reload; confirm animations disabled/minimal and content intact.
3. Confirm no CLS in the build/devtools.
**Security/privacy checks:** Snippet content is generic and non-confidential (§15.2).
**Accessibility checks:** Decorative code is `aria-hidden`; reduced motion honored (§20.5, §20.9).
**Completion rule:** Done when animations are polished, reduced-motion-safe, and the background contains no confidential code.

---

### Task 4.4 — Add Homepage SEO Metadata

**Phase:** 4 — Hero Section
**Goal:** Implement the homepage page metadata required by the MVP (spec §2.1, §13.1, §13.2).
**Depends on:** 4.1
**Estimated scope:** Small
**Files likely to change:** `app/layout.tsx` and/or `app/page.tsx` metadata, `app/globals.css`.
**Inputs required:** Production domain and OG image are **TBD** (§13.3, §13.8) — defer OG/canonical specifics to Phase 12; do not invent a domain.
**Implementation requirements:**
- Set homepage `<title>` = `Noam Pony | Backend Developer` (§13.1) and meta description = the §13.2 homepage description, verbatim.
- Ensure `<html lang="en">` (already from 1.1) and a meaningful document structure.
- Do not add OG tags requiring the TBD image/domain yet (added in Phase 12 once inputs exist); avoid shipping OG tags that reference a non-existent image (would be a broken trail).
**Acceptance criteria:**
- Title and description render in the document head exactly as specified.
**Verification steps:**
1. View page source/head; confirm title and description match §13.1/§13.2.
**Security/privacy checks:** No tracking scripts; no analytics (nice-to-have, not now).
**Accessibility checks:** Title is descriptive; `lang` set.
**Completion rule:** Done when homepage title + meta description are present and correct, with no broken OG references.

---

### Task 4.5 — Hero Section Completion Review (MVP Gate)

**Phase:** 4 — Hero Section
**Goal:** Verify the Hero satisfies the Hero Completion Gate ([gates.md](gates.md)) and the MVP acceptance criteria (spec §18.1).
**Depends on:** 4.2, 4.3, 4.4
**Estimated scope:** Small
**Files likely to change:** Fixes only, if the review surfaces gaps.
**Inputs required:** None.
**Implementation requirements:**
- Run the Hero Completion Gate ([gates.md](gates.md)) and spec §18.1 checklist. Fix any gap found.
- Confirm CTAs remain intentional no-ops with no broken links and that the deferred wiring is recorded against Tasks 10.3 (Resume CTA) and 11.3 (Contact CTA).
**Acceptance criteria:**
- Every item in the Hero gate and §18.1 passes.
**Verification steps:**
1. Keyboard-only pass over Hero + nav.
2. Automated a11y check (axe/Lighthouse a11y ≥ 95).
3. Responsive pass at all breakpoints.
4. Reduced-motion pass.
**Security/privacy checks:** No confidential content; no broken/dead links; LinkedIn safe.
**Accessibility checks:** Full §20 baseline over Hero + nav.
**Completion rule:** Done when the Hero gate fully passes and the MVP is deployable (handed to Phase 13 for actual deploy, or deployable now as the standalone MVP).
