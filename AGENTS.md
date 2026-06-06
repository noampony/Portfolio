# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before doing anything. It is intentionally short and points to the authoritative docs rather than repeating them.

## What this project is

A personal portfolio website / online CV for **Noam Pony**, a backend developer based in Israel. Goal: a polished, technically-mature, **non-generic** dark developer-aesthetic site. The MVP is the **Hero section only**; the rest of the homepage is built one section at a time.

## Source-of-truth documents (read these, in this order)

1. **[docs/SPECS.md](docs/SPECS.md)** — the specification. **The single source of truth.** Do not contradict it, do not rewrite it, do not invent requirements not in it.
2. **[tasks/README.md](tasks/README.md)** — the phased implementation plan: planning principles, phase overview, **Dependency Rules**, the **Global Definition of Done**, task format.
3. **[tasks/phase-NN-*.md](tasks/)** — the atomic tasks for each phase. One file per phase.
4. **[tasks/gates.md](tasks/gates.md)** — Section Completion Gates (the "is this section actually done?" checklists).
5. **[tasks/release-checklist.md](tasks/release-checklist.md)** — final release checklist + the appendix of outstanding blocking inputs (TBDs).
6. **[PROMPTS.md](PROMPTS.md)** — one copy-paste prompt per task, plus the **Standing Workflow** and **One-time setup** (git/PR identity). Most work enters through here.

When a prompt or task references `spec §X`, that means section X of `docs/SPECS.md`.

## Tech stack (authorized dependencies only)

Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Framer Motion · shadcn/ui · `next/font` · pnpm · deploy to Vercel.

**Do not add any other dependency** without explicit owner approval and a license check (no GPL in proprietary modules). See Dependency Rule 6.

> Note: the codebase is scaffolded in **Task 1.1**. Until that lands, there is no app to build yet.

## How to work here

- **One task at a time.** Implement exactly the task you were given; do not start, stub, or refactor toward other tasks. Tasks run in order (1.1 → 17.3); don't begin a task until its dependencies are merged.
- **Section by section, no open trails.** Finish and verify a section (its gate passes) before moving on. No half-finished components, dead links, placeholder UI, or leftover `TODO`/`FIXME`.
- **Keep the build green at all times:** `pnpm build`, `pnpm lint`, and the type-check must pass; no browser console errors.
- **Blocked = stop.** If a required input is marked **TBD** in the spec, do not invent it and do not make the product decision — stop and ask the owner. (Examples: resume file & behavior, phone publication, project/experience publish approval, course typo fixes, OG image, production domain. Full list: the appendix in `tasks/release-checklist.md`.)
- **MVP first.** Nice-to-have phases (14–17: business card, full Projects/Courses pages, terminal) must not start before Phase 13 is merged.
- Every task must satisfy the **Global Definition of Done** in `tasks/README.md`.

## Non-negotiable content rules (easy to get wrong)

- **Stats (C3 rules):** `35 courses` completed. Certificates are a **subset** of those 35 — show the count only once known, otherwise omit; **never** present 35 courses as 35 certificates. **Do not** ship a projects count of `10+` (omit until the real number is known). Technologies = `18+`. Main fields render as badges, not a counter.
- **No `X years` placeholder.** Years of experience are computed from `2022-10` (build-time by default).
- **Resume URL:** the file lives at repo path `public/resume.pdf` but is served at **`/resume.pdf`**. Always link `/resume.pdf`, never `/public/resume.pdf`. Download button text is exactly `Download CV`.
- **LinkedIn:** `https://www.linkedin.com/in/noam-pony/`. Strip tracking params (e.g. `lipi`) from any LinkedIn URL before storing — they encode a personal token.
- **Location** is always `Israel` (do not add a city).
- **Hero CTAs** ship as intentional **no-ops** in the MVP (styled, focusable, no dead links); they get wired later (Resume → Task 10.3, Contact → Task 11.3).
- Contact message uses the corrected wording: `Let's Work Together! Have something interesting to work on? Feel free to contact me.`

## Security, privacy & confidentiality (hard rules)

This site represents an employee of Check Point. Treat work content conservatively (spec §15, and the organization policy that governs this environment).

- **Never publish** internal project names, internal architecture, customer data/names, internal repos, internal/non-public metrics, IPs, domains, hostnames, logs, work-system screenshots, or sensitive cybersecurity workflows.
- Work-related Experience/Project entries carry a `confidentialityReviewed` flag and **must not render until it is `true`** (owner-confirmed). This overrides delivery speed (Dependency Rule 9).
- **No secrets in the repo:** never commit `.env*`, API keys, tokens, private certs (`.pem`/`.key`), or internal config. Never disable TLS verification.
- The resume PDF must be privacy-reviewed before it is committed/published (spec §15.5).
- External links: `target="_blank"` requires `rel="noopener noreferrer"`; verify links resolve.
- If a tool call is denied by policy, **stop** — report what was denied and ask; do not work around it.

## Accessibility & performance baseline

- Meet the spec §20 baseline: semantic landmarks, one `<h1>` per page with logical heading order, full keyboard operability, visible focus, AA contrast, alt text, a skip link, `<html lang="en">`, and respect `prefers-reduced-motion`.
- Animations are subtle (transform/opacity), cause no layout shift, and are disabled/minimized under reduced motion. Lazy-load non-critical images; do not lazy-load the Hero LCP image. Targets: Lighthouse a11y ≥ 95, perf ≥ 90 (recommended).

## Git & PR workflow (act as the owner's personal user)

Full details in **PROMPTS.md → "One-time setup"** and **"Standing Workflow."** Summary:

- **Branch per task** off an up-to-date `main`: `task/X.Y-<slug>`.
- **Commit identity:** `Noam Pony <noampong@gmail.com>`. Verify `git config user.name` / `user.email` before committing.
- **Push** via `origin` (the `github-noampony` SSH alias routes to the personal account).
- **Open a PR** into `main` as the **`noampony`** GitHub account. ⚠️ `gh` may be logged in as a different (work) account — if it is not on the personal account, **stop and ask**; do not open the PR as the work account. GitHub Actions that create commits must use the `Noam Pony` identity.
- **Do not commit or push unless the task/owner explicitly calls for it**, and prefer leaving the commit/PR step to the human if there's any doubt. Never force-push `main`.
- When a task is finished, flip its `⬜` to `✅` in PROMPTS.md and report the PR link + Definition-of-Done status.

## Definition of "done" for a task

Build + lint + type-check pass · no console errors · responsive at mobile/tablet/desktop · a11y baseline met · no sensitive data · no broken links · no unresolved TODOs/placeholders · previously completed sections not regressed · the task's own Acceptance criteria and Completion rule satisfied · its Section Completion Gate passes (for review tasks).
