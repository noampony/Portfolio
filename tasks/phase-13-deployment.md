# Phase 13 — Final Polish & Deployment Readiness

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 13.1 — Full Homepage QA Sweep

**Phase:** 13 — Deployment Readiness
**Goal:** Run the cross-section QA: responsive, reduced-motion, links, console-clean, regression check across all completed sections (spec §16, §18.2).
**Depends on:** 12.5
**Estimated scope:** Medium
**Files likely to change:** Fixes only.
**Inputs required:** None.
**Implementation requirements:**
- Verify all sections render in order with working anchors and nav (incl. scroll-spy active state if implemented — §5.4), no console errors, no broken links, no horizontal overflow at any breakpoint (§16), and no banned placeholders (`X years`, `10+`, dead CTAs).
**Acceptance criteria:**
- Every completed section passes its gate simultaneously; whole-page navigation works.
**Verification steps:**
1. Full responsive + keyboard + reduced-motion pass over the entire homepage.
2. Click every nav item and CTA; confirm correct behavior.
**Security/privacy checks:** Re-confirm no dead links / confidential content.
**Accessibility checks:** Full §20 baseline across the page.
**Completion rule:** Done when the entire homepage passes QA with no regressions.

---

### Task 13.2 — Production Build & Vercel Deployment Readiness

**Phase:** 13 — Deployment Readiness
**Goal:** Confirm the site builds for production and deploys to Vercel with assets resolving (spec §12.6, §18.2).
**Depends on:** 13.1
**Estimated scope:** Medium
**Files likely to change:** `next.config.*`, deployment config/docs.
**Inputs required:** Production domain (for canonical/OG/sitemap finalization) — if still TBD, deploy on the default Vercel domain and record the domain swap as a follow-up (does not block deploy).
**Implementation requirements:**
- `pnpm build` clean; static generation used where possible (§14.2); resume + images resolve in a production build (§12.6). Confirm no env vars are required for the static site (contact form/analytics not built — §12.6).
- Verify `/resume.pdf` resolves in the production build (§4.5).
**Acceptance criteria:**
- Production build succeeds; deploys to Vercel; `/resume.pdf` and images resolve in production.
**Verification steps:**
1. Run `pnpm build` and a production start/preview; load `/resume.pdf` and images.
2. Deploy to Vercel (or a preview) and confirm.
**Security/privacy checks:** No secrets/env required or committed; org policy honored (no `.env` in VCS).
**Accessibility checks:** Spot-check a11y on the deployed build.
**Completion rule:** Done when the production build deploys to Vercel with all assets resolving and no env vars required.

---

### Task 13.3 — Final Release Checklist Sign-Off

**Phase:** 13 — Deployment Readiness
**Goal:** Run the Final Release Checklist ([release-checklist.md](release-checklist.md)) and record sign-off.
**Depends on:** 13.2
**Estimated scope:** Small
**Files likely to change:** Fixes only.
**Inputs required:** Owner content sign-off.
**Implementation requirements:** Execute every item in the Final Release Checklist ([release-checklist.md](release-checklist.md)); fix any failure; document any deferred TBD with its owner.
**Acceptance criteria:** All checklist items pass or are explicitly, acceptably deferred with documentation.
**Verification steps:** Walk the checklist top to bottom.
**Security/privacy checks:** Final §15 confirmation.
**Accessibility checks:** Final §20 confirmation.
**Completion rule:** Done when the checklist is fully satisfied and the MVP/full homepage is launch-ready.
