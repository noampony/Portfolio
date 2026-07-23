# Final Release Checklist & Outstanding Inputs

> Part of the [Portfolio Website Task Breakdown](README.md). Run the checklist before declaring the site launch-ready (spec §18). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

## Final Release Checklist

Each item must pass or be explicitly, acceptably deferred with an owner-owned note.

- [x] **Build** — `pnpm build` succeeds with no errors/warnings.
- [x] **Lint** — `pnpm lint` clean.
- [x] **Type-check** — TypeScript passes with no errors.
- [x] **Responsive QA** — desktop/tablet/mobile verified across every shipped section; no horizontal overflow; no layout shift (spec §16).
- [x] **Accessibility QA** — §20 baseline smoke checks pass site-wide; independent Lighthouse ≥ 95 remains owner verification (see sign-off record).
- [x] **SEO metadata** — homepage title + meta description correct (§13.1/§13.2); titles/descriptions for any built pages set.
- [x] **Open Graph preview** — OG title/description/type/url are valid; `og:image` is the documented owner-owned remaining input (see sign-off record).
- [x] **Resume download** — `/resume.pdf` resolves and the `Download CV` action is wired; final PDF privacy confirmation is owner-owned (see sign-off record) (§8.7/§15.5).
- [x] **Links** — internal anchors resolve; external links use `rel="noopener noreferrer"`; no dead CTAs; LinkedIn URLs are tracking-param-free (§8.3.1/§15.8).
- [x] **Privacy/security review** — no secrets/`.env`/keys/internal config found; published work entries are confidentiality-reviewed; phone publication is documented as owner-confirmed (§15.6).
- [x] **Vercel deployment readiness** — production build is static and clean; actual Vercel deployment remains owner-owned because no deployment target/credentials are present (see sign-off record) (§12.6).
- [x] **Environment variables** — no env vars are required for the static site; `NEXT_PUBLIC_SITE_URL` is optional and no env files are tracked.
- [x] **Final content review** — banned placeholders are absent and C3 rules are honored; corrected Contact message is present; final course spelling/date confirmation remains owner-owned (see sign-off record).
- [x] **Sitemap & robots** — `/sitemap.xml` lists only `/`; `/robots.txt` is present and excludes draft/private paths (§13.5/§13.6).
- [x] **Structured data** — `Person` + `WebSite` JSON-LD parse and render (§13.7).

## Task 13.3 sign-off — 2026-07-23

Release checks were run against the production build and local production preview. The following remaining inputs are explicitly deferred to the owner, Noam Pony; none requires a code change to keep the current MVP/full homepage buildable and safe:

| Deferred input | Owner action | Current safe state |
|---|---|---|
| Open Graph image and production domain (§13.3, §13.8) | Noam Pony supplies the final image/domain, then adds `og:image` and canonical production URL. | No broken image URL is shipped; sitemap/JSON-LD use relative URLs until the domain exists. |
| Lighthouse accessibility score confirmation (§20) | Noam Pony runs Lighthouse on the intended deployed URL and records the score. | Browser smoke checks passed: one `<h1>`, landmarks, skip link, no console issues, no horizontal overflow at 390/768/1440px, and reduced-motion-safe source paths. |
| Vercel deployment (§12.6) | Noam Pony deploys the verified build to the personal Vercel project and records the URL. | `pnpm build` passed; all routes are statically prerendered; no required environment variables. |
| Resume PDF privacy sign-off (§15.5) | Noam Pony confirms the committed PDF is privacy-reviewed before public launch. | `/resume.pdf` resolves and `Download CV` points to the root-served asset. |
| Course spelling/date confirmation (§8.5, §19.7) | Noam Pony confirms `Anthropic` and `March 2026` as the intended published wording. | Recommended corrected wording is currently rendered; certificate links/files that remain TBD are omitted or unavailable, never broken. |

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
