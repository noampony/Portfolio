# Phase 9 — Technical Skills Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 9.1 — Define Skills Data

**Phase:** 9 — Technical Skills
**Goal:** Encode the skill categories and skills (spec §8.6) as validated data with no invented proficiency.
**Depends on:** 8.4, 3.2
**Estimated scope:** Medium
**Files likely to change:** `lib/content/data/skills.ts`.
**Inputs required:** Proficiency display is **TBD** (§8.6) — do not show numeric proficiency unless explicitly provided. Notes marked TBD are absent (not empty UI).
**Implementation requirements:**
- Encode all §8.6 categories and skills with the provided notes (AWS, Jenkins, Iceberg notes are real; others are TBD → absent).
- No invented proficiency levels (§8.6 acceptance).
**Acceptance criteria:**
- Data validates; only real notes present; no proficiency invented.
**Verification steps:**
1. Build passes; confirm TBD notes are absent.
**Security/privacy checks:** No confidential tooling/internal detail beyond the public-safe notes provided.
**Accessibility checks:** N/A.
**Completion rule:** Done when skills data validates with real notes only and no fake proficiency.

---

### Task 9.2 — Implement the Skills Section Layout (Grouped Badges)

**Phase:** 9 — Technical Skills
**Goal:** Build grouped, scannable skill categories with badges and accessible labels (spec §8.6).
**Depends on:** 9.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Skills.tsx`, `components/ui/SkillBadge.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** Icon source is **TBD** (§6.8, §8.6) and must be license-safe — do not scrape; if no approved icon source yet, ship text/badge labels without icons (icons are optional/decorative — §8.6). No new icon dependency without authorization (Dependency Rule 6).
**Implementation requirements:**
- All categories represented and grouped clearly (§8.6 acceptance). Skill badges scannable; notes shown inline (not hover-only — §8.6). Missing notes do not render empty artifacts.
- Icons decorative unless meaningful; if used, from a license-safe source only.
- Add `id="skills"`; append `#skills` to nav config.
**Acceptance criteria:**
- All categories shown; badges scannable; no empty note artifacts; no hover-only notes.
**Verification steps:**
1. Confirm every §8.6 category present; `#skills` resolves.
**Security/privacy checks:** Icon source license-safe (no scraping); no confidential content.
**Accessibility checks:** Accessible labels on badges; decorative icons `aria-hidden`; notes not hover-only.
**Completion rule:** Done when all skill categories render as grouped accessible badges with no banned patterns.

---

### Task 9.3 — Style, Make Responsive, and Animate the Skills Section

**Phase:** 9 — Technical Skills
**Goal:** Apply styling, responsive stacking/wrapping, and subtle icon/reveal animation (spec §8.6 layout, §16).
**Depends on:** 9.2
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Skills.tsx`, `components/ui/SkillBadge.tsx`.
**Inputs required:** None.
**Implementation requirements:**
- Desktop category cards/rows; mobile stacks; badges wrap; long AWS notes remain readable (§8.6). Subtle animation; reduced-motion safe.
**Acceptance criteria:**
- Readable and polished across breakpoints, including long AWS notes.
**Verification steps:**
1. Responsive/reduced-motion passes; verify AWS note readability on mobile.
**Security/privacy checks:** None beyond global.
**Accessibility checks:** Contrast, focus, reduced motion.
**Completion rule:** Done when the skills section is responsive, styled, and reduced-motion-safe.

---

### Task 9.4 — Technical Skills Section Completion Review

**Phase:** 9 — Technical Skills
**Goal:** Verify Skills passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 9.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** None.
**Implementation requirements:** Run the Skills Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Category-completeness check, responsive/reduced-motion/a11y passes.
**Security/privacy checks:** No fake proficiency; icon licensing safe.
**Accessibility checks:** Full §20 baseline.
**Completion rule:** Done when the Skills gate fully passes.
