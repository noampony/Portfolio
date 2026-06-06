# Final Release Checklist & Outstanding Inputs

> Part of the [Portfolio Website Task Breakdown](README.md). Run the checklist before declaring the site launch-ready (spec §18). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

## Final Release Checklist

Each item must pass or be explicitly, acceptably deferred with an owner-owned note.

- [ ] **Build** — `pnpm build` succeeds with no errors/warnings.
- [ ] **Lint** — `pnpm lint` clean.
- [ ] **Type-check** — TypeScript passes with no errors.
- [ ] **Responsive QA** — desktop/tablet/mobile verified across every shipped section; no horizontal overflow; no layout shift (spec §16).
- [ ] **Accessibility QA** — §20 baseline holds site-wide; Lighthouse accessibility ≥ 95; keyboard-only pass; reduced-motion pass.
- [ ] **SEO metadata** — homepage title + meta description correct (§13.1/§13.2); titles/descriptions for any built pages set.
- [ ] **Open Graph preview** — OG tags valid; `og:image` present (or documented as the one remaining input) and renders a clean LinkedIn preview (§13.3/§13.4).
- [ ] **Resume download** — `/resume.pdf` resolves; `Download CV` works; resume privacy-reviewed (§8.7/§15.5).
- [ ] **Links** — all internal anchors resolve; all external links valid, open safely with `rel="noopener noreferrer"`; no dead CTAs; LinkedIn tracking params stripped (§8.3.1/§15.8).
- [ ] **Privacy/security review** — full §15 audit passed; no secrets/`.env`/keys/internal config; only `confidentialityReviewed: true` work content published; phone publication confirmed (§15.6).
- [ ] **Vercel deployment readiness** — production build deploys to Vercel; static assets resolve in production (§12.6).
- [ ] **Environment variables** — none required for the static site; if any are later added (contact form/analytics), they are documented and not committed.
- [ ] **Final content review** — no banned placeholders (`X years`, `10+`, invented certificate count); C3 stat rules honored; corrected Contact message and confirmed course spellings/dates; owner content sign-off recorded.
- [ ] **Sitemap & robots** — `/sitemap.xml` lists only existing routes; `/robots.txt` present and not exposing draft routes (§13.5/§13.6).
- [ ] **Structured data** — `Person` + `WebSite` JSON-LD validates (§13.7).

---

## Appendix — Outstanding Blocking Inputs (TBDs gating specific tasks)

These spec **TBD**s block the noted tasks until the owner provides them. They are tracked here so none becomes a silent open trail:

| Input | Spec ref | Blocks |
|---|---|---|
| Resume PDF file + last-updated date | §8.7, §17, §19.8 | 10.1 |
| Resume behavior (section/modal/direct) + Resume nav behavior | §4.5, §5.7, §8.7 | 10.2, 10.3 |
| Phone publication confirmation | §15.6 | 11.1, 11.2 |
| Check Point Experience/Project confidentiality approvals | §8.3.2, §8.4, §15.4 | 6.1/6.4, 7.1/7.4, 12.5 |
| CVE role title; Private Tutor dates | §8.3.3, §8.3.4 | 6.1 |
| Project years, categories, Students Tracking backend focus; "2B events/week" approval | §19.6 | 7.1, 15.2 |
| Course certificate links/files + Drive public-access; course images | §8.5, §10.9 | 8.1, 16.1 |
| Course spelling/date corrections (`Anthropic`, `March 2026`) | §8.5 notes | 8.1 |
| Profile image/logo; short tagline; CTA labels | §8.1, §11.1, §19.2 | 4.1, 4.3 (snippets), 14 |
| Open Graph image; production domain | §13.3, §13.8 | 12.2, 13.2 |
| Icon source (license-safe) | §6.8 | 9.2 (icons optional) |
| Projects count (page go/no-go); detail pattern | §4.3, §9.8 | 15.1, 15.3 |
| Full Courses Hub dataset; learning-path memberships; total hours | §10.2, §10.7, §10.8 | 16.1 |
| Terminal command outputs; unknown-command + history behavior | §8.10, §19.11 | 17.1 |
| Floating Business Card promotion; tagline; resume link; profile picture | §8.9, §19.10 | 14.1 |
