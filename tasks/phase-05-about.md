# Phase 5 — About Me Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 5.1 — Define About Section Data

**Phase:** 5 — About Me
**Goal:** Provide validated data for the About stats, main fields, and professional summary.
**Depends on:** 4.5, 3.2
**Estimated scope:** Small
**Files likely to change:** `lib/content/data/about.ts` (or extend `profile.ts`).
**Inputs required:** Final About paragraph is **TBD** (§19.4); current professional focus is **TBD** (§19.4); projects count and certificates subset count are **TBD** (§8.2). Years-of-experience runtime-vs-build decision is **TBD** (§19.4) — default to build-time calculation from `2022-10` (§8.2 allows either; build-time is the safer static default, noted as default not product decision).
**Implementation requirements:**
- Encode stats per the **C3 accuracy rules** (§8.2): `coursesCountLabel` = `35`; certificates = subset of 35 — **omit until counted**; projects count — **omit until known** (never `10+`); `technologiesCountLabel` = `18+`; main fields rendered as badges (Python, AWS, Docker) not a counter.
- Main fields list per §8.2 (Backend Development, Python, Cloud/AWS, Docker, CI/CD, Automation, Cybersecurity, DevOps, Testing, System Design).
- Use the §8.2 paragraph draft only as a typed field, with the `X years` token resolved by the dynamic/build-time calc — the literal `X years` placeholder must never ship (§8.2 acceptance criteria).
**Acceptance criteria:**
- Data validates; no `X years`, no `10+`, no invented certificate count.
**Verification steps:**
1. Build passes; grep for `X years` and `10+` (absent).
**Security/privacy checks:** No confidential employer details (§8.2).
**Accessibility checks:** N/A.
**Completion rule:** Done when About data validates under the C3 rules with no banned placeholders.

---

### Task 5.2 — Implement the About Layout and Stats/Fields Display

**Phase:** 5 — About Me
**Goal:** Build the About section markup: professional summary on one side, stats + main fields as cards/badges (spec §8.2 layout).
**Depends on:** 5.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/About.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** Profile image in About is optional/**TBD** (§8.2) — omit unless provided; if provided, optimized with descriptive alt (§8.2).
**Implementation requirements:**
- Render the professional summary, the stats (only those with known values), and main fields as accessible badges (§8.2). Stat numbers use the mono family per §6.4.
- Years of experience computed at build time from `2022-10` (per 5.1 default).
- Add `id="about"`; append `#about` to nav config (§5.3).
- Omit any TBD stat entirely — no empty UI artifact (§8.2 acceptance, Dependency Rule 5).
**Acceptance criteria:**
- Section communicates background clearly; only known stats shown; main fields accessible.
**Verification steps:**
1. Confirm rendered stats match known values; TBD stats absent.
2. Confirm `#about` anchor + nav item resolve.
**Security/privacy checks:** No confidential details exposed.
**Accessibility checks:** Badges have accessible text; heading order continues logically (§20.1).
**Completion rule:** Done when About renders correct stats/fields with no placeholders and a working anchor.

---

### Task 5.3 — Style and Add Responsive Behavior + Reveal Animation to About

**Phase:** 5 — About Me
**Goal:** Apply visual styling, responsive single-column mobile layout, and a subtle scroll-reveal (spec §8.2, §7.5, §16).
**Depends on:** 5.2
**Estimated scope:** Medium
**Files likely to change:** `components/sections/About.tsx`.
**Inputs required:** None.
**Implementation requirements:**
- Responsive single-column on mobile (§8.2); card/badge layout on larger screens; consistent section padding (§6.6).
- Subtle scroll reveal that does not hide content without JS and triggers in a controlled way (§7.5); reduced-motion safe (§7.3) — counters/reveals reduce to final/static values (§20.9).
**Acceptance criteria:**
- Looks polished across breakpoints; reveal is subtle; content always available.
**Verification steps:**
1. Responsive pass; reduced-motion pass (content visible, no animation).
**Security/privacy checks:** None beyond global.
**Accessibility checks:** Reveal does not hide content from screen readers; reduced motion honored.
**Completion rule:** Done when About is responsive, styled, and reveal is reduced-motion-safe.

---

### Task 5.4 — About Section Completion Review

**Phase:** 5 — About Me
**Goal:** Verify About passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 5.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** None.
**Implementation requirements:** Run the About Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Keyboard pass, responsive pass, reduced-motion pass, data-accuracy pass (C3 rules), automated a11y check.
**Security/privacy checks:** No confidential content; no banned placeholders.
**Accessibility checks:** Full §20 baseline over the section.
**Completion rule:** Done when the About gate fully passes.
