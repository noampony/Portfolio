# Section Completion Gates

> Part of the [Portfolio Website Task Breakdown](README.md). Each gate must fully pass before the next section/phase begins. Every gate also requires the **Global Definition of Done** in [README.md](README.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Hero Gate (spec §8.1, §18.1) — Phase 4
- [ ] Name, title, required two-line hero text, location, LinkedIn, and both CTAs present.
- [ ] Layout matches spec (above/near fold desktop; readable mobile sequence).
- [ ] Responsive on desktop/tablet/mobile; no layout shift.
- [ ] Accessibility: single `<h1>`, heading order, keyboard, visible focus, contrast AA, CTA labels.
- [ ] Animations present (entrance + floating code) and reduced-motion-safe; background code is generic/non-confidential.
- [ ] Content from validated Profile data (not hardcoded ad hoc).
- [ ] No placeholders/TBDs visible; CTAs are intentional no-ops with no broken links.
- [ ] No sensitive information; LinkedIn opens safely.
- [ ] Build/lint/type-check pass; homepage title + meta description correct.

### About Me Gate (spec §8.2) — Phase 5
- [ ] Professional summary, known stats, and main fields present.
- [ ] Layout matches spec (paragraph + stats/badges; single column mobile).
- [ ] Responsive verified.
- [ ] Accessibility met (badge labels, heading order).
- [ ] Reveal animation implemented and reduced-motion-safe.
- [ ] Data not hardcoded; stats follow C3 rules (35 courses; certs subset/omitted; projects omitted; never `10+`).
- [ ] No `X years` placeholder; no TBD stats rendered as empty UI.
- [ ] No confidential info.
- [ ] Build/lint/type-check pass.

### Experience Gate (spec §8.3) — Phase 6
- [ ] Each rendered entry has organization, role, dates, description; current + volunteer roles clear.
- [ ] Timeline/card layout matches spec.
- [ ] Responsive verified.
- [ ] Accessibility met; animation does not block content.
- [ ] Data not hardcoded; only `confidentialityReviewed: true` entries shown; LinkedIn tracking params stripped.
- [ ] No internal names/architecture/customer data/metrics/screenshots; TBD fields not invented.
- [ ] Build/lint/type-check pass.

### Projects Preview Gate (spec §8.4) — Phase 7
- [ ] 3–5 reviewed projects with name, short description, problem solved, tech stack, backend focus.
- [ ] Layout matches spec (featured + cards); cards readable without images.
- [ ] Responsive verified; badges wrap; hover subtle and not the only affordance.
- [ ] Accessibility met (card links, focus).
- [ ] Data not hardcoded; only reviewed projects; volunteer project uses generalized language.
- [ ] `View All Projects` has no broken link (disabled/omitted until full page exists).
- [ ] No confidential employer info.
- [ ] Build/lint/type-check pass.

### Courses Preview Gate (spec §8.5) — Phase 8
- [ ] 3–5 courses framed as professional growth; required fields where data exists.
- [ ] Layout matches spec (learning-path style).
- [ ] Responsive verified; images lazy-loaded; no CLS.
- [ ] Accessibility met; fallback visuals handled.
- [ ] Data not hardcoded; missing certs/images handled gracefully; Drive link access-checked.
- [ ] `Explore Courses Hub` has no broken link.
- [ ] No private info; external links safe; typo corrections confirmed or flagged.
- [ ] Build/lint/type-check pass.

### Technical Skills Gate (spec §8.6) — Phase 9
- [ ] All listed categories represented and grouped.
- [ ] Layout matches spec (grouped badges).
- [ ] Responsive verified (incl. long AWS notes).
- [ ] Accessibility met (badge labels, decorative icons `aria-hidden`, notes not hover-only).
- [ ] Animation reduced-motion-safe.
- [ ] Data not hardcoded; no invented proficiency; no empty note artifacts.
- [ ] Icons (if any) license-safe.
- [ ] Build/lint/type-check pass.

### Resume Gate (spec §8.7) — Phase 10
- [ ] Embedded preview (or graceful fallback) + `Download CV` present.
- [ ] Layout matches spec; mobile not broken.
- [ ] Responsive verified.
- [ ] Accessibility met (labelled button, accessible fallback).
- [ ] No required animation; reduced motion N/A or honored.
- [ ] Resume served at `/resume.pdf`; Hero Resume CTA wired (no-op removed); Resume nav behavior resolved.
- [ ] No placeholders; `lastUpdated` shown only if provided.
- [ ] Resume privacy-reviewed; no trackers in preview.
- [ ] Build/lint/type-check pass.

### Contact Gate (spec §8.8) — Phase 11
- [ ] Heading, corrected message, email, LinkedIn, phone (if confirmed), location, preferred method present.
- [ ] Layout matches spec; mobile readable.
- [ ] Responsive verified.
- [ ] Accessibility met (link names).
- [ ] No required animation (subtle reveal optional, reduced-motion-safe).
- [ ] `mailto:`/`tel:`/LinkedIn work; Hero Contact CTA wired (no-op removed).
- [ ] No broken placeholder form; only confirmed personal data shown.
- [ ] No sensitive info beyond confirmed; external links safe.
- [ ] Build/lint/type-check pass.

### Floating Business Card Gate (spec §8.9) — Phase 14 · Nice-to-have
- [ ] Required contact fields present (missing fields omitted, not broken UI).
- [ ] Layout matches spec (left-side drawer desktop; mobile-friendly drawer/sheet).
- [ ] Responsive verified; does not block content/navigation.
- [ ] Accessibility met: keyboard operable, accessible trigger label, dialog/drawer semantics, focus trap when modal, focus restored on close, Escape close, no hover-only.
- [ ] Animation reduced-motion-safe.
- [ ] Data not hardcoded; TBD fields omitted.
- [ ] No sensitive info; resume/links safe.
- [ ] Build/lint/type-check pass.

### Full Projects Page Gate (spec §9) — Phase 15 · Nice-to-have / conditional
- [ ] Structured grid/list of projects using the §9.6 content model.
- [ ] Layout matches the resolved §9.3 layout.
- [ ] Filters by technology/category work if implemented.
- [ ] Responsive verified; handles projects without screenshots.
- [ ] Accessibility met.
- [ ] Animations reduced-motion-safe (if any).
- [ ] Data not hardcoded; optional links shown only when valid.
- [ ] No confidential employer info; page title/meta set (§13.1).
- [ ] Build/lint/type-check pass.

### Full Courses Hub Page Gate (spec §10) — Phase 16 · Nice-to-have / conditional
- [ ] Structured course display + total-courses stat + category breakdown.
- [ ] Layout matches resolved §10.3 layout; learning paths shown only when membership defined.
- [ ] Filters by category/skills work if implemented.
- [ ] Responsive verified; fallback visuals consistent.
- [ ] Accessibility met.
- [ ] Animations reduced-motion-safe (if any).
- [ ] Data not hardcoded; certificates link correctly or omitted; stats follow C3 rules (35 courses; certs subset).
- [ ] No private info; external links safe; page title/meta set (§13.1).
- [ ] Build/lint/type-check pass.

### Terminal Popup Gate (spec §8.10) — Phase 17 · Nice-to-have
- [ ] Not built until the core site is complete.
- [ ] Opens from a floating terminal button; closeable by keyboard and pointer.
- [ ] All commands return deterministic predefined output; unknown commands return a helpful message; `help` and `clear` work; `resume` gives a safe link.
- [ ] Layout matches spec (dark console style).
- [ ] Responsive verified (simplified on mobile).
- [ ] Accessibility met: keyboard operable, visible focus, output announced where feasible, Escape close, no keyboard trap, reduced motion disables/min typing.
- [ ] Command outputs are non-confidential.
- [ ] Build/lint/type-check pass.
