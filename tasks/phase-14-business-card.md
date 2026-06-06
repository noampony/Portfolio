# Phase 14 — Floating Business Card (Nice-to-have)

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

> Must not begin until Phase 13 is complete (Dependency Rule 10).
>
> **Defer rationale / risk:** Marked nice-to-have unless promoted (spec §8.9). Adds focus-management complexity (focus trap, restore, Escape) and another always-visible floating control that must not block the Hero CTAs. **Blocked** on: owner promotion decision, short tagline (TBD), resume link (TBD), profile picture (TBD).

---

### Task 14.1 — Define Business Card Data and Confirm Promotion

**Phase:** 14
**Goal:** Encode business-card data (spec §8.9) and confirm the feature is promoted.
**Depends on:** 13.3
**Estimated scope:** Small
**Files likely to change:** `lib/content/data/businessCard.ts`.
**Inputs required (blocking):** Promotion decision (§19.1); tagline, resume link, profile picture (§19.10).
**Implementation requirements:** Reuse Profile/Contact data where possible; TBD fields absent. Do not build UI until promoted.
**Acceptance criteria:** Data validates; TBD fields omitted.
**Verification steps:** Build passes; confirm absent fields not rendered later.
**Security/privacy checks:** Only confirmed contact data; links safe.
**Accessibility checks:** N/A.
**Completion rule:** Done when data validates and promotion is confirmed; otherwise remains blocked.

---

### Task 14.2 — Implement the Accessible Left-Side Drawer

**Phase:** 14
**Goal:** Build the floating trigger + left-opening drawer with full accessibility (spec §7.6, §8.9, §16.5).
**Depends on:** 14.1
**Estimated scope:** Large
**Files likely to change:** `components/business-card/FloatingCard.tsx`, `components/business-card/CardTrigger.tsx`, `app/layout.tsx`.
**Inputs required:** Visual lean (glassmorphism vs terminal-style) is TBD (§19.10) — implement with tokens; do not invent beyond spec styles.
**Implementation requirements:** Always-visible trigger not blocking core CTAs; opens left on desktop; mobile-friendly drawer; closes on outside click, Escape, and close button; dialog/drawer semantics; focus trap when modal; focus restored on close; no hover-only; reduced-motion-safe (§7.6, §8.9).
**Acceptance criteria:** Drawer opens/closes via all specified methods; focus managed correctly.
**Verification steps:** Keyboard-only open/navigate/close; outside-click and Escape close; focus returns to trigger.
**Security/privacy checks:** Only confirmed data; links safe.
**Accessibility checks:** Full §8.9 a11y requirements.
**Completion rule:** Done when the drawer passes the Business Card Gate ([gates.md](gates.md)).

---

### Task 14.3 — Floating Business Card Completion Review

**Phase:** 14
**Goal:** Verify the Business Card Gate ([gates.md](gates.md)).
**Depends on:** 14.2
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** None.
**Implementation requirements:** Run the gate; fix gaps; confirm it does not block Hero CTAs or page scroll.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Gate walk-through; regression check on Hero CTAs.
**Security/privacy checks:** No sensitive data.
**Accessibility checks:** Full §8.9 a11y.
**Completion rule:** Done when the Business Card Gate fully passes with no regressions.
