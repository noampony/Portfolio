# Phase 15 — Full Projects Page (Nice-to-have / Conditional)

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

> Must not begin until Phase 13 is complete (Dependency Rule 10).
>
> **Defer rationale / risk:** Conditional on having enough projects (spec §4.3 — possibly unnecessary under 10 projects). Requires the §9.6 detail model and a resolved detail pattern (pages/modals/expandable — §9.8, TBD). **Blocked** on: project-count decision, project years/categories, detail-pattern decision, and per-project confidentiality approvals.

---

### Task 15.1 — Decide and Document Whether to Build the Projects Page

**Phase:** 15 · **Goal:** Record the count-based go/no-go (spec §4.3). · **Depends on:** 13.3 · **Scope:** Small · **Files:** `docs/` decision note. · **Inputs required (blocking):** Total project count; owner decision. · **Implementation requirements:** If < threshold and owner declines, stop here and ensure the homepage `View All Projects` control remains non-broken (disabled/omitted). · **Acceptance criteria:** Decision documented; homepage link state consistent. · **Verification steps:** Confirm no dead `View All Projects` link regardless of decision. · **Security/privacy checks:** N/A. · **Accessibility checks:** N/A. · **Completion rule:** Done when the decision is recorded and the homepage link is consistent.

---

### Task 15.2 — Define Full Project Detail Data

**Phase:** 15 · **Goal:** Extend project data to the §9.6 model. · **Depends on:** 15.1 (go) · **Scope:** Medium · **Files:** `lib/content/data/projects.ts`. · **Inputs required (blocking):** Years, categories, optional architecture/security/challenges/links — all public-safe and reviewed (§9.10). · **Implementation requirements:** Only `confidentialityReviewed: true` projects; no internal detail (§9.10); links validated (§9.9). · **Acceptance criteria:** Data validates; only reviewed projects. · **Verification steps:** Validation + confidentiality audit. · **Security/privacy checks:** §9.10 enforced. · **Accessibility checks:** N/A. · **Completion rule:** Done when extended data validates under confidentiality rules.

---

### Task 15.3 — Build the Projects Page Layout, Cards, and Filters

**Phase:** 15 · **Goal:** Implement the page per resolved §9.3 layout with filters by technology/category (§9.4). · **Depends on:** 15.2 · **Scope:** Large · **Files:** `app/projects/page.tsx`, project components. · **Inputs required:** Detail pattern decision (§9.8). · **Implementation requirements:** Grid/list + featured area + filters; cards emphasize backend problem-solving; image-independent; graceful unavailable links (§9.7); re-point the navbar Projects item + homepage `View All Projects` to this page; page title/meta (§13.1). · **Acceptance criteria:** Page renders; filters work; nav re-pointed; no broken links. · **Verification steps:** Filter behavior, responsive, link checks. · **Security/privacy checks:** No confidential info; links safe. · **Accessibility checks:** Filters keyboard-operable; §20 baseline. · **Completion rule:** Done when the page passes the Full Projects Page Gate ([gates.md](gates.md)).

---

### Task 15.4 — Projects Page Completion Review

**Phase:** 15 · **Goal:** Verify the Full Projects Page Gate ([gates.md](gates.md)). · **Depends on:** 15.3 · **Scope:** Small · **Files:** Fixes only. · **Inputs required:** None. · **Implementation requirements:** Run gate; fix gaps. · **Acceptance criteria:** All gate items pass. · **Verification steps:** Gate walk-through; sitemap updated to include `/projects` (§13.5). · **Security/privacy checks:** Confidentiality audit. · **Accessibility checks:** Full §20. · **Completion rule:** Done when the gate fully passes and the sitemap includes the new route.
