# Phase 16 — Full Courses Hub Page (Nice-to-have / Conditional)

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

> Must not begin until Phase 13 is complete (Dependency Rule 10).
>
> **Defer rationale / risk:** The full hub needs the complete Courses Hub source data (spec §10.2, §19.7) and resolved learning-path groupings (§10.7, all TBD). **Blocked** on: full course dataset, learning-path memberships, certificate availability/access, total hours.

---

### Task 16.1 — Define Full Courses Hub Data and Learning Paths

**Phase:** 16 · **Goal:** Encode the full course set + category breakdown + learning paths (spec §10.5–§10.8). · **Depends on:** 13.3 · **Scope:** Large · **Files:** `lib/content/data/courses.ts`. · **Inputs required (blocking):** Full course list, learning-path memberships, certificate links/files + public-access checks (§10.9), total hours. · **Implementation requirements:** Stats follow C3 rules (35 courses; certificates a subset; total hours TBD until provided — §10.8); learning paths only when membership defined (§10.7). · **Acceptance criteria:** Data validates; C3 rules honored; access-checked certificate links. · **Verification steps:** Validation; test certificate links for public access. · **Security/privacy checks:** No private directory/account exposure (§10.9). · **Accessibility checks:** N/A. · **Completion rule:** Done when full course data validates under C3 rules with access-checked links.

---

### Task 16.2 — Build the Courses Hub Page (Stats, Breakdown, Paths, Filters)

**Phase:** 16 · **Goal:** Implement the page per §10.3 with filters by category/skills (§10.4). · **Depends on:** 16.1 · **Scope:** Large · **Files:** `app/courses/page.tsx`, course components. · **Inputs required:** None beyond 16.1. · **Implementation requirements:** Heading/intro, total-courses stat, category breakdown, featured courses, learning paths (only when defined), filters, course grid; consistent image fallbacks; re-point navbar Courses item + homepage `Explore Courses Hub`; page title/meta (§13.1). · **Acceptance criteria:** Page renders; filters work; nav re-pointed; no broken links. · **Verification steps:** Filter behavior, responsive, certificate-link checks. · **Security/privacy checks:** Certificate links safe; no private info. · **Accessibility checks:** Filters keyboard-operable; §20 baseline. · **Completion rule:** Done when the page passes the Full Courses Hub Page Gate ([gates.md](gates.md)).

---

### Task 16.3 — Courses Hub Completion Review

**Phase:** 16 · **Goal:** Verify the Full Courses Hub Page Gate ([gates.md](gates.md)). · **Depends on:** 16.2 · **Scope:** Small · **Files:** Fixes only. · **Inputs required:** None. · **Implementation requirements:** Run gate; fix gaps; add `Course` structured data optionally (§13.7). · **Acceptance criteria:** All gate items pass. · **Verification steps:** Gate walk-through; sitemap updated to include `/courses`. · **Security/privacy checks:** Link safety audit. · **Accessibility checks:** Full §20. · **Completion rule:** Done when the gate fully passes and the sitemap includes the new route.
