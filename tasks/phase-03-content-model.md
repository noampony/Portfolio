# Phase 3 — Content / Data Model

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 3.1 — Define Content Model Types

**Phase:** 3 — Content / Data Model
**Goal:** Translate the spec's content models (§11) into TypeScript types, including the confidentiality flags.
**Depends on:** 1.2
**Estimated scope:** Medium
**Files likely to change:** `lib/content/types.ts`.
**Inputs required:** None — models are fully specified in §11.1–§11.9.
**Implementation requirements:**
- Define types for Profile, Experience, Project, Course, Skill, Resume, Contact, SocialLink, and TerminalCommand exactly per §11 (required vs optional fields preserved).
- Include `confidentialityReviewed: boolean` on Experience and Project (§11.2/§11.3).
- Optional fields are `?`-optional so TBD content is representable as absent, never as empty strings rendered in UI.
- Do not create data files here (those belong to each section's data task) except as required by Task 3.3.
**Acceptance criteria:**
- Types compile; required/optional split matches the spec tables.
**Verification steps:**
1. Type-check passes.
2. Spot-check three models against §11 tables for field/required parity.
**Security/privacy checks:** Types encode confidentiality flags; no real data embedded in types.
**Accessibility checks:** N/A.
**Completion rule:** Done when all §11 models exist as types matching the spec and type-check passes.

---

### Task 3.2 — Build the Build-Time Content Validator

**Phase:** 3 — Content / Data Model
**Goal:** Validate content data against the models at build/dev time so missing required fields fail fast (spec §12.5).
**Depends on:** 3.1
**Estimated scope:** Medium
**Files likely to change:** `lib/content/validate.ts`, integration point in data loaders.
**Inputs required:** None.
**Implementation requirements:**
- Missing required fields fail during development or build (spec §12.5).
- Optional fields omit cleanly when absent.
- Provide a helper to flag work-related items where `confidentialityReviewed !== true` so unreviewed items are excluded from published output (spec §12.5, §15.4).
- Implement with plain TypeScript (no new validation dependency) unless the agent first gets owner approval; if a schema lib is desired, mark blocked pending authorization (Dependency Rule 6).
**Acceptance criteria:**
- Removing a required field from sample data causes a build/dev failure with a clear message.
- An item with `confidentialityReviewed: false` is filterable/excludable.
**Verification steps:**
1. Temporarily remove a required Profile field; confirm build/dev errors; restore.
2. Confirm the confidentiality filter excludes an unreviewed sample item.
**Security/privacy checks:** Validator enforces the confidentiality gate (§15.4); no data logged to external destinations.
**Accessibility checks:** N/A.
**Completion rule:** Done when invalid data fails the build and the confidentiality filter works.

---

### Task 3.3 — Create and Populate the Profile Data

**Phase:** 3 — Content / Data Model
**Goal:** Provide the validated Profile data used by Hero, About, and Contact.
**Depends on:** 3.1, 3.2
**Estimated scope:** Small
**Files likely to change:** `lib/content/data/profile.ts` (or `.json`).
**Inputs required:** Profile image/logo source is **TBD** (§8.1/§11.1) — leave `profileImage`/`logo` absent. `shortTagline` is **TBD** (§11.1) — leave absent. `projectsCountLabel` and `certificatesCountLabel` are **TBD** (§8.2/§11.1) — leave absent (do **not** use `10+` or invent a certificate count).
**Implementation requirements:**
- Populate only spec-provided values: `name` = `Noam Pony`; `title` = `Backend Developer`; `oneLineSummary` = `A passionate experienced cloud backend developer`; `heroText` = the two-line block in §8.1; `location` = `Israel`; `yearsExperienceStartDate` = `2022-10`; `technologiesCountLabel` = `18+`; `coursesCountLabel` = `35`; `mainFields` per §8.2.
- `city` is unused — owner prefers `Israel` only (§11.1). Do not populate it.
- Validate against the Profile type; build must fail if a required field is missing.
**Acceptance criteria:**
- Profile data validates; contains no invented values; TBD fields are absent.
**Verification steps:**
1. Build passes with Profile validated.
2. Grep the file for `10+` and `X years` — must be absent.
**Security/privacy checks:** No phone/email embedded here beyond what later Contact task governs; no confidential content.
**Accessibility checks:** N/A.
**Completion rule:** Done when Profile validates with only spec-provided values and all TBD fields omitted.
