# Phase 6 — Experience Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 6.1 — Define Experience Data with Confidentiality Flags

**Phase:** 6 — Experience
**Goal:** Encode the four experience entries (spec §8.3) as validated data with confidentiality review flags.
**Depends on:** 5.4, 3.2
**Estimated scope:** Medium
**Files likely to change:** `lib/content/data/experience.ts`.
**Inputs required (blocking per entry):**
- Check Point Cloud role description scale metrics approved for public sharing? **TBD** (§8.3.2 confidentiality note, §19.5).
- Dec 2021–Oct 2022 role **title is TBD** (§8.3.3, §19.5).
- Private Tutor **dates are TBD** (§8.3.4, §19.5).
- Whether descriptions should be shortened for public display — **TBD** (§19.5).
**Implementation requirements:**
- Encode Max Impact, Check Point (Cloud), Check Point (CVE/Protections), Private Tutor with the §8.3 field values.
- **Strip tracking params** from the Max Impact LinkedIn URL (remove `lipi` and any session/tracking query params) before storing (§8.3.1 — these encode a personal tracking token).
- Set `confidentialityReviewed: false` initially on the two Check Point entries; they must not render until the owner confirms (§9.2 confidentiality, §15.4). Max Impact and Private Tutor are volunteer/self-employed and public-safe but still carry the flag.
- Represent TBD fields (CVE role title, tutor dates) as absent; the UI must show the entry without inventing those fields, or omit the entry if a *required* field (role) is missing — flag this as blocked rather than inventing a title.
**Acceptance criteria:**
- Data validates; LinkedIn URL has no tracking params; unreviewed entries are excludable.
**Verification steps:**
1. Grep the stored LinkedIn URL for `lipi`/`?` tracking params (absent).
2. Confirm `confidentialityReviewed` filter excludes unconfirmed Check Point entries.
**Security/privacy checks:** No internal project names, architecture, customer data, metrics, hostnames, or logs (§8.3 confidentiality rules, §15.2); tracking token stripped.
**Accessibility checks:** N/A.
**Completion rule:** Done when experience data validates, tracking params are stripped, and confidentiality gating works. **Blocked** items (CVE role title, tutor dates, metric approval) are listed and not invented.

---

### Task 6.2 — Implement the Experience Timeline Layout

**Phase:** 6 — Experience
**Goal:** Build the timeline/card layout for experience entries (spec §8.3 layout).
**Depends on:** 6.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Experience.tsx`, `components/ui/TimelineEntry.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** None beyond 6.1's blocked items.
**Implementation requirements:**
- Timeline or timeline-like card layout; each rendered entry shows organization, role, dates, and description (§8.3 acceptance). Current role clearly marked; volunteer leadership clearly represented.
- Only render entries with `confidentialityReviewed: true`; entries with missing required fields are not rendered with invented data.
- Screenshots omitted (optional + confidentiality — §8.3); do not add any.
- Add `id="experience"`; append `#experience` to nav config.
- Compute the Check Point Cloud duration dynamically or mark "Present" (§8.3.2).
**Acceptance criteria:**
- Timeline renders reviewed entries with correct fields; current + volunteer roles clear.
**Verification steps:**
1. Confirm only reviewed entries appear; dates accurate or marked.
2. Confirm `#experience` anchor + nav item resolve.
**Security/privacy checks:** No screenshots; no confidential content; only reviewed entries published.
**Accessibility checks:** Timeline is semantic (ordered structure), keyboard reachable; headings logical.
**Completion rule:** Done when the timeline renders reviewed entries correctly with a working anchor.

---

### Task 6.3 — Style, Make Responsive, and Animate the Timeline

**Phase:** 6 — Experience
**Goal:** Apply styling, responsive behavior, and timeline scroll animation that never blocks content (spec §8.3, §7.5, §16).
**Depends on:** 6.2
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Experience.tsx`, `components/ui/TimelineEntry.tsx`.
**Inputs required:** None.
**Implementation requirements:**
- Timeline animations must not block content visibility (§8.3 acceptance); reduced-motion safe (§7.3).
- Responsive: timeline adapts cleanly to tablet/mobile without overflow (§16).
**Acceptance criteria:**
- Polished, responsive, animated timeline; content always visible.
**Verification steps:**
1. Responsive pass; reduced-motion pass.
**Security/privacy checks:** None beyond global.
**Accessibility checks:** Animation does not hide content; reduced motion honored.
**Completion rule:** Done when the timeline is responsive, animated, and content remains visible in all states.

---

### Task 6.4 — Experience Section Completion Review

**Phase:** 6 — Experience
**Goal:** Verify Experience passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 6.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** Owner confirmation of Check Point entries' confidentiality (to publish them) — if not yet given, the gate passes with only reviewed entries shown and the blocked entries documented.
**Implementation requirements:** Run the Experience Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Confidentiality audit, keyboard pass, responsive pass, reduced-motion pass, automated a11y check.
**Security/privacy checks:** Confirm no confidential content; tracking params stripped; only reviewed entries shown.
**Accessibility checks:** Full §20 baseline.
**Completion rule:** Done when the Experience gate fully passes and all unresolved confidentiality/TBD items are explicitly documented.
