# Phase 11 — Contact Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 11.1 — Define Contact Data (with Phone-Display Confirmation)

**Phase:** 11 — Contact
**Goal:** Encode contact data (spec §8.8) with the corrected message text.
**Depends on:** 10.4, 3.2
**Estimated scope:** Small
**Files likely to change:** `lib/content/data/contact.ts`.
**Inputs required (blocking):** Owner confirmation that the phone number may be published (§15.6 — phone is preferred contact but increases spam risk; acceptable only if intentionally confirmed). Contact form is nice-to-have and **not** built here (§8.8 decision).
**Implementation requirements:**
- Encode §8.8 values: heading `Get In Touch`; message = the **corrected** text `Let's Work Together! Have something interesting to work on? Feel free to contact me.` (§8.8 correction); email `noampony2@gmail.com`; LinkedIn URL; phone `+972 50 4377257`; location `Israel`; preferred method `Phone`; `contactFormEnabled: false` (§11.7).
- Phone is included only if owner confirms publication; otherwise mark blocked and omit phone rather than guessing.
**Acceptance criteria:**
- Data validates; corrected message used; phone gated on confirmation.
**Verification steps:**
1. Build passes; confirm corrected apostrophe text.
**Security/privacy checks:** Phone publication explicitly confirmed (§15.6); no secrets.
**Accessibility checks:** N/A.
**Completion rule:** Done when contact data validates with the corrected message and confirmed phone handling.

---

### Task 11.2 — Implement the Contact Section (Direct Links)

**Phase:** 11 — Contact
**Goal:** Build the contact section with direct `mailto:`/`tel:`/LinkedIn/location, no broken placeholder form (spec §8.8).
**Depends on:** 11.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Contact.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required:** None beyond 11.1.
**Implementation requirements:**
- Display heading, message, email (`mailto:`), LinkedIn (new tab, `rel="noopener noreferrer"`), phone (`tel:`, only if confirmed), location, preferred method (§8.8 acceptance).
- Do **not** build the contact form (nice-to-have; direct links must be implemented before any form — §8.8). No broken placeholder form.
- Add `id="contact"`; append `#contact` to nav config.
**Acceptance criteria:**
- All confirmed contact methods render and work; no broken form.
**Verification steps:**
1. Click email (`mailto:`), phone (`tel:` if present), LinkedIn (new tab); confirm correct behavior.
2. Confirm `#contact` resolves.
**Security/privacy checks:** No secrets; external links safe; only confirmed personal data shown.
**Accessibility checks:** Links have accessible names; mobile readable (§8.8).
**Completion rule:** Done when direct contact links work and no placeholder form is shipped.

---

### Task 11.3 — Wire the Hero Contact CTA (Remove No-Op)

**Phase:** 11 — Contact
**Goal:** Connect the Hero's secondary (Contact) CTA to the Contact section and remove its no-op (spec §8.1, §8.8 wiring note).
**Depends on:** 11.2
**Estimated scope:** Small
**Files likely to change:** `components/sections/Hero.tsx`.
**Inputs required:** Final Contact CTA label is **TBD** (§19.2) — keep default unless confirmed.
**Implementation requirements:**
- Wire the Hero Contact CTA to scroll to `#contact` (§8.8 wiring note). Remove the no-op.
**Acceptance criteria:**
- Hero Contact CTA scrolls to Contact; no remaining no-op.
**Verification steps:**
1. Activate via mouse + keyboard; confirm scroll to `#contact`.
**Security/privacy checks:** No dead link.
**Accessibility checks:** CTA labelled, keyboard operable, focus visible.
**Completion rule:** Done when the Hero Contact CTA is wired and the no-op removed.

---

### Task 11.4 — Contact Section Completion Review

**Phase:** 11 — Contact
**Goal:** Verify Contact passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 11.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** None.
**Implementation requirements:** Run the Contact Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Link behavior checks, Hero CTA check, mobile check, a11y check.
**Security/privacy checks:** Phone confirmation honored; links safe.
**Accessibility checks:** Full §20 baseline.
**Completion rule:** Done when the Contact gate fully passes and both Hero CTAs are confirmed wired.
