# Phase 10 — Resume Section

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

> **Blocked until inputs provided:** the actual resume file at `/public/resume.pdf` and the resume behavior decision (§4.5, §8.7, §19.8). This phase must not invent a resume or pick the behavior.

---

### Task 10.1 — Add and Privacy-Review the Resume File

**Phase:** 10 — Resume
**Goal:** Place the resume PDF at the repo path `/public/resume.pdf` (served at `/resume.pdf`) after a privacy review.
**Depends on:** 9.4
**Estimated scope:** Small
**Files likely to change:** `public/resume.pdf`, `lib/content/data/resume.ts`.
**Inputs required (blocking):** The actual resume file (§17, §19.8). Last-updated date is **TBD** (§8.7). Resume highlights are **TBD** (§8.7).
**Implementation requirements:**
- Store the provided file at `public/resume.pdf`. Confirm it is served at URL `/resume.pdf` (not `/public/resume.pdf`) per §4.5.
- Resume must be privacy-reviewed before publication: no personal address, no internal project names, no confidential metrics, no customer names, no internal systems, no sensitive cybersecurity detail (§15.5). Do not commit the file if review is not done.
- Encode the Resume model (§11.6): `fileName` = `Noam Pony CV.pdf`, `repoPath` = `/public/resume.pdf`, `publicUrl` = `/resume.pdf`, `downloadButtonText` = `Download CV`, `previewEnabled` = `true`; `lastUpdated`/`highlights` absent until provided.
**Acceptance criteria:**
- `/resume.pdf` resolves in dev; resume data validates; privacy review recorded.
**Verification steps:**
1. Request `/resume.pdf` in the running app; confirm 200.
2. Confirm `/public/resume.pdf` is not used as a link target anywhere.
**Security/privacy checks:** Privacy review complete (§15.5); no secrets; file is the intended public CV.
**Accessibility checks:** N/A.
**Completion rule:** Done when the reviewed resume resolves at `/resume.pdf` and resume data validates. **Blocked** if no file/owner sign-off.

---

### Task 10.2 — Implement the Resume Preview and Download (and Resolve Resume Behavior)

**Phase:** 10 — Resume
**Goal:** Build the resume preview + `Download CV` button, implementing the owner's chosen resume behavior (§8.7).
**Depends on:** 10.1
**Estimated scope:** Medium
**Files likely to change:** `components/sections/Resume.tsx`, `app/page.tsx`, `lib/navigation.ts`.
**Inputs required (blocking):** The resume behavior decision — section vs modal vs direct open/download (§4.5, §8.7). Do not choose for the owner.
**Implementation requirements:**
- `Download CV` button links to `/resume.pdf` (§8.7). Embedded PDF preview if feasible/performant; clear fallback link if embedding unsupported; preview must not break mobile and must not use third-party trackers (§8.7).
- Add `id="resume"`; append `#resume` to nav config; if the chosen behavior re-points the Resume **nav item** (Task 2.3 left it deferred), wire it now to the confirmed behavior — no dead target.
- `lastUpdated` shown only if provided (§8.7); highlights only if provided.
**Acceptance criteria:**
- `Download CV` works; preview renders or falls back gracefully; Resume nav item now resolves.
**Verification steps:**
1. Click `Download CV`; confirm the PDF opens/downloads from `/resume.pdf`.
2. On mobile width, confirm preview/fallback does not break layout (§16.8).
**Security/privacy checks:** No third-party trackers in the preview; external/embedded resources safe.
**Accessibility checks:** Button labelled; preview has an accessible fallback; keyboard operable.
**Completion rule:** Done when preview + download work, mobile is not broken, and the Resume nav behavior is resolved. **Blocked** on the behavior decision.

---

### Task 10.3 — Wire the Hero Resume CTA (Remove No-Op)

**Phase:** 10 — Resume
**Goal:** Connect the Hero's primary (Resume) CTA to the now-existing resume behavior and remove its MVP no-op (spec §8.1, §8.7 wiring note).
**Depends on:** 10.2
**Estimated scope:** Small
**Files likely to change:** `components/sections/Hero.tsx`.
**Inputs required:** Resume behavior (from 10.2). Final CTA label is **TBD** (§19.2) — keep the existing default unless owner confirms.
**Implementation requirements:**
- Wire the Hero Resume CTA to the chosen behavior (scroll to `#resume`, open `/resume.pdf`, or open the modal — §8.7 wiring note). Remove the no-op handler/disabled state.
**Acceptance criteria:**
- Hero Resume CTA performs the chosen action; no broken link; no remaining no-op.
**Verification steps:**
1. Activate the Hero Resume CTA via mouse and keyboard; confirm correct behavior.
**Security/privacy checks:** Target safe; no dead link.
**Accessibility checks:** CTA labelled, keyboard operable, focus visible.
**Completion rule:** Done when the Hero Resume CTA is wired and the no-op is fully removed.

---

### Task 10.4 — Resume Section Completion Review

**Phase:** 10 — Resume
**Goal:** Verify Resume passes its Completion Gate ([gates.md](gates.md)).
**Depends on:** 10.3
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** None.
**Implementation requirements:** Run the Resume Completion Gate ([gates.md](gates.md)); fix gaps.
**Acceptance criteria:** All gate items pass.
**Verification steps:** Download/preview/fallback checks, Hero CTA check, mobile check, a11y check.
**Security/privacy checks:** Resume privacy-reviewed; no trackers.
**Accessibility checks:** Full §20 baseline.
**Completion rule:** Done when the Resume gate fully passes and the Hero Resume CTA wiring is confirmed.
