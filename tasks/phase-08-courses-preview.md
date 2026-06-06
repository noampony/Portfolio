# Phase 8 — Courses Preview Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 8.1 — Define Courses Preview Data

**Phase:** 8 — Courses Preview
**Goal:** Encode the 5 provided courses (spec §8.5) as validated data.
**Depends on:** 7.4, 3.2
**Estimated scope:** Medium
**Files likely to change:** `lib/content/data/courses.ts`.
**Inputs required (blocking/clarification):** Several certificate links are **TBD** (§8.5); course images are **TBD** (§8.5). Provider spelling for "Coding Agents Hands-on Workshop" (`Anthropic & Check Point`, correcting the "Antrophic" typo) and "Marc 2026" → "March 2026" correction need owner confirmation (§8.5 notes, §19.7).
**Implementation requirements:**
- Encode the five courses with §8.5 fields. Use corrected spellings **only if** owner confirms; otherwise mark blocked and keep as-provided is **not** acceptable for an obvious typo in published copy — flag the correction as a required confirmation rather than shipping a typo or auto-correcting silently. (Document the recommendation: `Anthropic`, `March 2026`.)
- Missing certificate links represented as absent (shown as unavailable/omitted, not broken — §8.5 acceptance).
- Verify the Google Drive certificate link for Course 1 is publicly accessible before treating it as live (§10.9); if not public, mark it unavailable.
**Acceptance criteria:**
- Data validates; missing certs/images representable as absent; typo corrections flagged for confirmation.
**Verification steps:**
1. Build passes; confirm absent fields don't render as empty UI.
2. Test the Course 1 Drive link for public access.
**Security/privacy checks:** Certificate links must not expose private directories/account info (§10.9); no trackers.
**Accessibility checks:** N/A.
**Completion rule:** Done when course data validates, the Drive link is access-checked, and typo/spelling corrections are flagged for owner confirmation.

---

### Task 8.2 — Implement the Courses Preview (Learning-Path Style) Layout

**Phase:** 8 — Courses Preview
**Goal:** Build 3–5 course cards in a learning-path framing with the `Explore Courses Hub` link (spec §8.5).
**Depends on:** 8.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/CoursesPreview.tsx`, `components/ui/CourseCard.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** `Explore Courses Hub` target — the full Courses Hub is conditional/nice-to-have (§4.4). Same rule as Task 7.2: no dead link — render disabled-with-label or omit until Phase 16, wired there (Task 16.2).
**Implementation requirements:**
- Render 3–5 courses; each card includes the §8.5 fields where data exists (name, provider, image-or-fallback, short description, skills sharpened, category, completion date, hours, certificate).
- Course image fallback: consistent, non-generic visual when no image (§8.5); missing certificate shown as unavailable/omitted.
- Frame as professional growth / learning path, not a random list (§8.5 purpose/acceptance).
- Add `id="courses"`; append `#courses` to nav config.
**Acceptance criteria:**
- 3–5 courses render; required fields present where data exists; `Explore Courses Hub` not a broken link.
**Verification steps:**
1. Confirm fallback image renders for image-less courses; missing certs handled gracefully.
2. Confirm `#courses` resolves and the Explore control is not dead.
**Security/privacy checks:** External certificate links open safely (`rel="noopener noreferrer"`, new tab — §10.9).
**Accessibility checks:** Cards responsive/accessible; image fallback has appropriate alt or decorative handling.
**Completion rule:** Done when courses render with graceful fallbacks and no broken links.

---

### Task 8.3 — Style, Make Responsive, and Animate Course Cards

**Phase:** 8 — Courses Preview
**Goal:** Apply styling, responsive behavior, and subtle hover/reveal; lazy-load course images (spec §8.5, §14.4).
**Depends on:** 8.2
**Estimated scope:** Medium
**Files likely to change:** `components/sections/CoursesPreview.tsx`, `components/ui/CourseCard.tsx`.
**Inputs required:** None.
**Implementation requirements:**
- Responsive card grid → stack on mobile (§16.7); subtle hover (§7.4); lazy-load course images (§14.4) with width/height to avoid CLS (§14.3); reduced-motion safe.
**Acceptance criteria:**
- Polished, responsive cards; images lazy-loaded; no layout shift.
**Verification steps:**
1. Responsive/hover/reduced-motion passes; confirm images lazy-load.
**Security/privacy checks:** None beyond global.
**Accessibility checks:** Focus visible; no hover-only info.
**Completion rule:** Done when course cards are responsive, styled, lazy-loaded, and reduced-motion-safe.

---

### Task 8.4 — Courses Preview Section Completion Review

**Phase:** 8 — Courses Preview
**Goal:** Verify Courses Preview passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 8.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** Owner confirmation of typo corrections and certificate availability (documented if pending).
**Implementation requirements:** Run the Courses Preview Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Link checks (incl. Drive access), fallback checks, responsive/reduced-motion/a11y passes.
**Security/privacy checks:** Certificate links safe; no private info exposed.
**Accessibility checks:** Full §20 baseline.
**Completion rule:** Done when the Courses Preview gate fully passes.
