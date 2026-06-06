# Phase 7 — Projects Preview Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 7.1 — Define Projects Preview Data with Confidentiality Flags

**Phase:** 7 — Projects Preview
**Goal:** Encode the 4 provided projects (spec §8.4) as validated data with confidentiality flags.
**Depends on:** 6.4, 3.2
**Estimated scope:** Medium
**Files likely to change:** `lib/content/data/projects.ts`.
**Inputs required (blocking):** Whether project names, internal behaviors, and the "2 billion events per week" scale are safe to publish — **TBD** (§8.4 security notes, §19.6). Project years and final categories — **TBD** (§19.6). Backend focus for Students Tracking System — **TBD** (§8.4).
**Implementation requirements:**
- Encode the four projects with §8.4 fields (name, role, short description, problem solved, tech stack, backend focus, why important).
- Set `confidentialityReviewed: false` on the three Check Point projects until the owner confirms publishability (§8.4 security notes, §15.4); the volunteer Students Tracking System uses generalized language only (no sensitive teenager/health details — §8.4 privacy note).
- TBD fields (years, Students Tracking backend focus) absent until provided; do not invent.
**Acceptance criteria:**
- Data validates; unreviewed projects excludable; no sensitive personal details.
**Verification steps:**
1. Confirm confidentiality filter excludes unconfirmed work projects.
2. Confirm Students project copy is generalized.
**Security/privacy checks:** No internal architecture/customer data/metrics beyond approved (§9.10, §15.2); scale claims gated behind review.
**Accessibility checks:** N/A.
**Completion rule:** Done when project data validates with confidentiality gating and no sensitive content; blocked approvals listed.

---

### Task 7.2 — Implement the Projects Preview Layout

**Phase:** 7 — Projects Preview
**Goal:** Build the 3–5 project cards (featured + smaller cards) with required fields and the `View All Projects` link (spec §8.4).
**Depends on:** 7.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/ProjectsPreview.tsx`, `components/ui/ProjectCard.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** `View All Projects` target — the full Projects page is nice-to-have/conditional (§4.3). Until it exists, the button must not link to a 404. Default: render the button but point it at an in-page behavior that exists, or hide it until Phase 15 builds the page. To avoid a product decision, **render the button disabled-with-accessible-label or omit it**, and record that it is wired in Task 15.3 when/if the Projects page ships. Do not ship a dead link.
**Implementation requirements:**
- Render only `confidentialityReviewed: true` projects; show 3–5 (the four provided, minus any unreviewed).
- Each card: project name, short description, problem solved, tech stack, backend focus (§8.4). Cards readable without images (§8.4 acceptance); tech stack as wrapping badges (mono per §6.4).
- Add `id="projects"`; append `#projects` to nav config (the Projects nav item from Task 2.3 points here until a full page exists).
**Acceptance criteria:**
- 3–5 reviewed projects render with all required fields; `View All Projects` has no broken link.
**Verification steps:**
1. Confirm card fields present and image-independent.
2. Confirm the View All control is not a dead link; `#projects` resolves.
**Security/privacy checks:** No confidential employer info; no sensitive personal data.
**Accessibility checks:** Accessible card links, visible focus, hover state not the only affordance (§7.4, §20).
**Completion rule:** Done when reviewed projects render with required fields and no broken `View All Projects` link.

---

### Task 7.3 — Style, Make Responsive, and Animate Project Cards

**Phase:** 7 — Projects Preview
**Goal:** Apply card styling, responsive stacking, and subtle hover/reveal (spec §8.4 layout, §6.7, §7.4).
**Depends on:** 7.2
**Estimated scope:** Medium
**Files likely to change:** `components/sections/ProjectsPreview.tsx`, `components/ui/ProjectCard.tsx`.
**Inputs required:** None.
**Implementation requirements:**
- Desktop featured-large + cards; mobile stacks vertically; featured card not overwhelming; badges wrap cleanly (§8.4). Subtle hover (elevation/border/glow), no large motion jumps (§7.4). Reduced-motion safe.
**Acceptance criteria:**
- Polished, responsive cards; badges wrap; hover subtle.
**Verification steps:**
1. Responsive pass; hover/focus pass; reduced-motion pass.
**Security/privacy checks:** None beyond global.
**Accessibility checks:** No hover-only critical info; focus visible.
**Completion rule:** Done when project cards are responsive, styled, and animation is reduced-motion-safe.

---

### Task 7.4 — Projects Preview Section Completion Review

**Phase:** 7 — Projects Preview
**Goal:** Verify Projects Preview passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 7.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** None (blocked approvals documented).
**Implementation requirements:** Run the Projects Preview Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Confidentiality audit, image-independence check, link check, responsive/reduced-motion/a11y passes.
**Security/privacy checks:** No confidential content; no dead links.
**Accessibility checks:** Full §20 baseline.
**Completion rule:** Done when the Projects Preview gate fully passes.
