# Phase 12 — SEO, Accessibility, Performance & Privacy Hardening

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 12.1 — Add Sitemap and robots.txt

**Phase:** 12 — Hardening
**Goal:** Provide a sitemap and robots.txt for public pages (spec §13.5, §13.6).
**Depends on:** 11.4
**Estimated scope:** Small
**Files likely to change:** `app/sitemap.ts`, `app/robots.ts`.
**Inputs required:** Production domain is **TBD** (§13.8) — use a relative/configurable base so this isn't blocked; substitute the real domain when known (record this).
**Implementation requirements:**
- Sitemap lists implemented public routes only (Home now; Projects/Courses/Resume pages only if/when they exist — §13.5). robots.txt allows public pages, excludes any draft/private routes (§13.6).
**Acceptance criteria:**
- `/sitemap.xml` and `/robots.txt` serve and reference only existing routes.
**Verification steps:**
1. Fetch both; confirm only existing routes listed; no draft routes exposed.
**Security/privacy checks:** No private/draft routes exposed (§13.6).
**Accessibility checks:** N/A.
**Completion rule:** Done when sitemap + robots serve correctly with only existing routes.

---

### Task 12.2 — Add Open Graph and Structured Data

**Phase:** 12 — Hardening
**Goal:** Add Open Graph metadata and `Person`/`WebSite` structured data (spec §13.3, §13.4, §13.7).
**Depends on:** 12.1
**Estimated scope:** Medium
**Files likely to change:** `app/layout.tsx`/page metadata, structured-data component.
**Inputs required (blocking for image):** Open Graph image is **TBD** (§13.3, §19.3) and production domain is **TBD** (§13.8). Do not ship `og:image` pointing at a non-existent asset (broken trail). If no OG image yet, ship `og:title`/`og:description`/`og:type`/`og:url` and add `og:image` once provided — record this as the remaining input.
**Implementation requirements:**
- OG tags for the homepage (§13.3); `Person` and `WebSite` JSON-LD (§13.7). Optional `ProfilePage` allowed. Canonical URL once domain known (§13.8).
**Acceptance criteria:**
- OG tags valid; JSON-LD validates; no broken `og:image` reference.
**Verification steps:**
1. Validate JSON-LD (schema validator); inspect OG tags in head.
**Security/privacy checks:** No private data in metadata.
**Accessibility checks:** N/A.
**Completion rule:** Done when OG + structured data are valid with no broken asset references; missing OG image documented as a remaining input.

---

### Task 12.3 — Homepage Accessibility Audit and Fixes

**Phase:** 12 — Hardening
**Goal:** Run a full §20 accessibility pass over the complete homepage and fix issues to reach Lighthouse a11y ≥ 95 (spec §14.6, §20).
**Depends on:** 12.2
**Estimated scope:** Medium
**Files likely to change:** Any section/layout files with a11y gaps.
**Inputs required:** None.
**Implementation requirements:**
- Verify §20 baseline end-to-end: landmarks, single `<h1>`/heading order across the one-page site, keyboard operability, visible focus, contrast AA, alt text, skip link, `lang`, reduced motion, safe external links.
- Run axe/Lighthouse; fix findings.
**Acceptance criteria:**
- Lighthouse accessibility ≥ 95; no critical axe violations.
**Verification steps:**
1. Keyboard-only pass over the whole homepage.
2. Run Lighthouse + axe; record scores.
**Security/privacy checks:** External links safe.
**Accessibility checks:** Full §20 baseline across the homepage.
**Completion rule:** Done when a11y ≥ 95 and the §20 baseline holds across the homepage.

---

### Task 12.4 — Performance Pass (Images, Bundle, Animation)

**Phase:** 12 — Hardening
**Goal:** Optimize images, lazy-loading, and bundle to meet the recommended performance targets (spec §14).
**Depends on:** 12.3
**Estimated scope:** Medium
**Files likely to change:** Image usages, dynamic imports, animation code.
**Inputs required:** None.
**Implementation requirements:**
- Optimized responsive images with width/height; lazy-load non-critical images (courses/projects) but not the critical Hero LCP image (§14.3, §14.4). Keep homepage JS minimal; split optional components; tree-shakeable imports (§14.7). Prefer transform/opacity animations (§14.8).
- Confirm no terminal/contact-form code ships (not built yet — §14.7).
**Acceptance criteria:**
- Lighthouse performance ≥ 90 (recommended target) or gaps documented with rationale; no CLS regressions.
**Verification steps:**
1. Run Lighthouse performance; record. Check for layout shift and oversized initial images.
**Security/privacy checks:** No external trackers introduced.
**Accessibility checks:** Reduced motion still honored after changes.
**Completion rule:** Done when performance targets are met or documented and no CLS regressions exist.

---

### Task 12.5 — Privacy & Confidentiality Review (Whole Site)

**Phase:** 12 — Hardening
**Goal:** Audit the entire homepage and assets against the spec's security/privacy rules (spec §15).
**Depends on:** 12.4
**Estimated scope:** Medium
**Files likely to change:** Data/content fixes if violations found.
**Inputs required:** Owner confirmations on any still-unreviewed Experience/Project entries and phone publication.
**Implementation requirements:**
- Verify no internal project names, architecture, customer data, internal metrics, IPs, domains, hostnames, logs, work screenshots, or sensitive cybersecurity workflows are present (§15.2, §15.4).
- Confirm only `confidentialityReviewed: true` work items render (§15.4); resume privacy-reviewed (§15.5); LinkedIn tracking params stripped (§8.3.1); no secrets/`.env`/keys/internal config in the repo or `public/` (§15.9).
- Confirm external links use `rel="noopener noreferrer"` and are valid (§15.8).
**Acceptance criteria:**
- No §15 violations present anywhere on the site or in committed assets.
**Verification steps:**
1. Grep repo/data for IPs, hostnames, `lipi`, `.env`, key patterns.
2. Manual read of published Experience/Project copy for internal terms.
3. Confirm unreviewed items are excluded.
**Security/privacy checks:** This task *is* the privacy review; record results.
**Accessibility checks:** N/A.
**Completion rule:** Done when the site passes the full §15 review with results recorded and no violations.
