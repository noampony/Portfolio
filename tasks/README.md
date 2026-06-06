# Portfolio Website Task Breakdown

> Derived from [../docs/SPECS.md](../docs/SPECS.md). This is an **implementation plan only** — it does not implement code, rewrite the specification, or invent requirements not present in the spec. Where the spec says **TBD**, this plan treats it as a blocking input, not a license to invent content.

This breakdown is split across files so each phase can be handed to an AI agent in isolation:

- **This file** — shared rules: planning principles, phase overview, dependency rules, the Global Definition of Done (applies to every task), and the task format.
- **`phase-NN-*.md`** — the tasks for one phase. Self-contained; hand the relevant one to the agent.
- **[gates.md](gates.md)** — all Section Completion Gates.
- **[release-checklist.md](release-checklist.md)** — final release checklist + outstanding blocking-input (TBD) appendix.

Cross-references: `spec §X` → [../docs/SPECS.md](../docs/SPECS.md). Bare `gates.md` / `release-checklist.md` / `phase-NN-*.md` refer to files in this folder. "Dependency Rule N" and "Global Definition of Done" refer to sections below.

### Phase files

| # | Phase | File | Tier |
|---|---|---|---|
| 1 | Project Foundation | [phase-01-foundation.md](phase-01-foundation.md) | MVP |
| 2 | Design System & Shared Layout | [phase-02-design-system.md](phase-02-design-system.md) | MVP |
| 3 | Content / Data Model | [phase-03-content-model.md](phase-03-content-model.md) | MVP |
| 4 | Hero Section (MVP) | [phase-04-hero.md](phase-04-hero.md) | MVP |
| 5 | About Me Section | [phase-05-about.md](phase-05-about.md) | MVP |
| 6 | Experience Section | [phase-06-experience.md](phase-06-experience.md) | MVP |
| 7 | Projects Preview Section | [phase-07-projects-preview.md](phase-07-projects-preview.md) | MVP |
| 8 | Courses Preview Section | [phase-08-courses-preview.md](phase-08-courses-preview.md) | MVP |
| 9 | Technical Skills Section | [phase-09-skills.md](phase-09-skills.md) | MVP |
| 10 | Resume Section | [phase-10-resume.md](phase-10-resume.md) | MVP |
| 11 | Contact Section | [phase-11-contact.md](phase-11-contact.md) | MVP |
| 12 | SEO, Accessibility, Performance & Privacy Hardening | [phase-12-hardening.md](phase-12-hardening.md) | MVP |
| 13 | Final Polish & Deployment Readiness | [phase-13-deployment.md](phase-13-deployment.md) | MVP |
| 14 | Floating Business Card | [phase-14-business-card.md](phase-14-business-card.md) | Nice-to-have |
| 15 | Full Projects Page | [phase-15-projects-page.md](phase-15-projects-page.md) | Nice-to-have |
| 16 | Full Courses Hub Page | [phase-16-courses-page.md](phase-16-courses-page.md) | Nice-to-have |
| 17 | Terminal Popup / Easter Egg | [phase-17-terminal.md](phase-17-terminal.md) | Nice-to-have |

---

## 1. Planning Principles

The implementation strategy for this project:

- **Section-by-section delivery.** Build the homepage one section at a time, in the spec's order. The Hero section is the MVP (spec §2.1) and ships first and complete.
- **One task per AI-agent prompt.** Each task is scoped to be implementable in a single focused prompt (target 30–90 minutes of agent work).
- **No open trails.** No half-finished components, temporary placeholders, dead links, or unresolved TODOs. The only exception is content the spec *explicitly* marks **TBD**; those are represented as typed-but-empty/omitted data and never rendered as broken UI. Any deferred wiring (e.g. Hero CTAs) is recorded against the specific later task that resolves it.
- **Build must pass after each task.** Every task leaves the repo building, type-checking, and linting clean, with the dev server running and no console errors.
- **Complete-and-verify before moving on.** A section is not "done" until its Section Completion Gate ([gates.md](gates.md)) passes. The next section does not start until then.
- **Vertical slices over horizontal work.** Each section is delivered end-to-end (data → layout → styling/responsive → animation → review) rather than building all layouts, then all styling, etc.
- **MVP first, nice-to-have later.** Must-have scope (spec §2.3) ships before any nice-to-have (spec §2.4): Floating Business Card, full Projects page, full Courses Hub page, Terminal popup, contact form, filters, dark/light mode, analytics, blog.
- **No major product decisions by the agent.** Where the spec leaves a product decision open (resume behavior, contact form, etc.), the task is marked **blocked** with the required input listed. The agent must not pick for the owner.
- **Privacy and confidentiality are gating.** No confidential employer content (spec §15) ships. Experience/project entries carry a `confidentialityReviewed` flag (spec §11.2/§11.3) and are not published until the owner confirms.

---

## 2. Phase Overview

> **Deviation note (allowed by "adjust phases according to the specification"):** The recommended template lists the Floating Business Card and full Projects/Courses pages *before* SEO/accessibility/performance hardening and deployment. Because the spec marks those three as **nice-to-have / conditional** (§2.4, §4.3, §4.4, §8.9) and the homepage must-have set + hardening + deployment constitute the launchable product (§2.3, §18.2), hardening (Phase 12) and deployment readiness (Phase 13) are sequenced **before** the nice-to-have phases (14–17). This keeps the plan MVP-first. All deviations are documented per the Dependency Rules.

| # | Phase | Goal | Main deliverable | Depends on | Exit criteria | Scope tier |
|---|---|---|---|---|---|---|
| 1 | Project Foundation | Stand up a buildable Next.js + TypeScript + Tailwind project with the planned stack and tooling. | Running Next.js app on Vercel-compatible config, lint/type-check/build green. | — | `pnpm build`, `pnpm lint`, type-check all pass; app runs locally with an empty home route and no console errors. | MVP |
| 2 | Design System & Shared Layout | Implement the spec's color tokens, typography, and the shared app shell (navbar, mobile nav, footer, skip link, root layout). | Theme tokens + layout shell with sticky, data-driven navbar. | 1 | Tokens and fonts applied; sticky navbar + accessible mobile menu + skip link + footer render and pass keyboard/contrast checks; nav link list is data-driven and currently empty of section anchors (no broken links). | MVP |
| 3 | Content / Data Model | Define typed content models and a build-time validation utility; create the Profile data used by Hero/About/Contact. | TypeScript model types + validator + populated Profile data. | 1 | All spec §11 model types defined; validator fails build on missing required fields; Profile data validates against the model with no invented values. | MVP |
| 4 | Hero Section (MVP) | Deliver the complete, production-ready Hero — the MVP per spec §2.1. | Fully implemented, responsive, accessible, animated Hero + homepage SEO metadata. | 2, 3 | Hero Completion Gate passes; homepage metadata present; CTAs render as intentional no-ops (spec §8.1); deployable as the MVP. | MVP |
| 5 | About Me Section | Build the About section with accurate stats and main fields. | About section wired to validated data. | 4 | About Completion Gate passes; stats follow C3 accuracy rules; no `X years` placeholder shipped. | MVP |
| 6 | Experience Section | Build the timeline of professional + leadership experience under confidentiality rules. | Experience timeline wired to reviewed data. | 5 | Experience Completion Gate passes; only `confidentialityReviewed: true` entries render; TBD fields omitted. | MVP |
| 7 | Projects Preview Section | Show 3–5 projects on the homepage with a link to the (future/conditional) full page. | Projects preview wired to reviewed project data. | 6 | Projects Preview Completion Gate passes; `View All Projects` target resolved (anchor or page) with no broken link. | MVP |
| 8 | Courses Preview Section | Show 3–5 courses framed as a learning path, with a link to the (future/conditional) Courses Hub. | Courses preview wired to course data. | 7 | Courses Preview Completion Gate passes; `Explore Courses Hub` target resolved with no broken link. | MVP |
| 9 | Technical Skills Section | Present grouped, scannable skills with no invented proficiency. | Skills section wired to skill data. | 8 | Skills Completion Gate passes; all categories represented; no fake proficiency. | MVP |
| 10 | Resume Section | Provide resume preview + `Download CV`; wire the Hero Resume CTA. | Resume section + resolved resume behavior + Hero CTA wired. | 9 | Resume Completion Gate passes; `/resume.pdf` resolves; Hero Resume CTA no-op removed. **Blocked** until resume file + behavior decision provided. | MVP |
| 11 | Contact Section | Provide direct contact methods; wire the Hero Contact CTA. | Contact section + resolved contact links + Hero CTA wired. | 10 | Contact Completion Gate passes; `mailto:`/`tel:`/LinkedIn work; Hero Contact CTA no-op removed; phone display confirmed by owner. | MVP |
| 12 | SEO, Accessibility, Performance & Privacy Hardening | Add sitemap, robots, Open Graph, structured data; verify a11y, performance, and privacy across the homepage. | Hardening pass with measurable checks. | 11 | Sitemap + robots.txt present; OG + structured data valid; Lighthouse a11y ≥ 95 and the recommended targets met or gaps documented; privacy review complete. | MVP |
| 13 | Final Polish & Deployment Readiness | Verify the full homepage, run the release checklist, confirm Vercel deployability. | Launch-ready homepage. | 12 | Final Release Checklist passes; deploys to Vercel; resume + assets resolve in a production build. | MVP |
| 14 | Floating Business Card | Add the left-side drawer business card. | Accessible floating card drawer. | 13 | Business Card Completion Gate passes. **Nice-to-have** — does not block launch. **Blocked** on owner promotion decision + tagline/resume link/profile picture inputs. | Nice-to-have |
| 15 | Full Projects Page | Build the dedicated Projects page if justified. | Projects page (or documented decision not to build). | 13 | Conditional on project count ≥ threshold (spec §4.3). If built, Projects Page Completion Gate passes. **Nice-to-have / conditional.** | Nice-to-have |
| 16 | Full Courses Hub Page | Build the dedicated Courses Hub if pursued. | Courses Hub page. | 13 | If built, Courses Hub Completion Gate passes. **Nice-to-have / conditional**; needs full Courses Hub source data. | Nice-to-have |
| 17 | Terminal Popup / Easter Egg | Add the interactive terminal after the core site is complete. | Accessible terminal popup with deterministic commands. | 13 | Terminal Completion Gate passes. **Nice-to-have**; spec §8.10 forbids building it before the core site is done. **Blocked** on command output content. | Nice-to-have |

---

## 3. Dependency Rules

The AI agent must follow these rules when proceeding through the plan:

1. **Phase gating.** A phase cannot start until every task in the previous phase has passed its acceptance criteria and the relevant Section Completion Gate ([gates.md](gates.md)).
2. **Task gating.** A task cannot start until all tasks listed in its `Depends on` field are complete.
3. **Green build invariant.** Any failing build, lint, type-check, or test must be fixed before continuing. Never leave the repo red between tasks.
4. **No unresolved TODOs.** No `TODO`/`FIXME`/placeholder comments are allowed in shipped code unless the owner explicitly approves a specific one.
5. **No placeholder content.** No placeholder copy or dummy data may be visible to users unless the spec explicitly marks that field **TBD**, in which case it is omitted from the UI (not shown empty/broken) and represented as optional/empty in data.
6. **No unauthorized libraries.** No new dependency may be added unless a task explicitly authorizes it. Authorized stack: Next.js, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, `next/font` (spec §12.1). Adding anything else requires the owner's approval and a license-compatibility check (org policy: no GPL in proprietary modules).
7. **Spec is the source of truth.** Any deviation from the specification must be documented inline in the relevant task and surfaced in the task's output summary.
8. **Blocked tasks stay blocked.** If a task depends on missing information (a **TBD**), it must be marked **blocked**, list the required inputs, and must not proceed by guessing. The agent must not make product decisions reserved for the owner.
9. **Confidentiality precedence.** No work-related content publishes until its `confidentialityReviewed` flag is `true` (spec §11.2/§11.3, §15.4). This rule overrides delivery speed.
10. **MVP precedence.** No nice-to-have phase (14–17) may begin until Phase 13 (deployment readiness) is complete.

---

## 4. Global Definition of Done

This checklist applies to **every** task in this plan. A task is not done until all of these are true:

- [ ] Code builds successfully (`pnpm build`).
- [ ] TypeScript type-check passes with no errors.
- [ ] Lint passes (`pnpm lint`) with no new warnings.
- [ ] No console errors or warnings in the browser at runtime.
- [ ] Responsive behavior checked at mobile, tablet, and desktop breakpoints (spec §16).
- [ ] Accessibility basics checked against the spec §20 baseline (semantics, keyboard, visible focus, contrast, alt text, reduced motion as applicable).
- [ ] No sensitive data introduced (no secrets, `.env`, keys, internal config, customer data, internal project names, internal metrics, hostnames/IPs — spec §15).
- [ ] No broken links introduced (internal anchors resolve; external links valid and use `rel="noopener noreferrer"` on `target="_blank"`).
- [ ] No unresolved TODOs/placeholders (per Dependency Rule 4 & 5).
- [ ] Existing behavior not regressed (previously completed sections still render and pass their gates).

---

## 5. Task Format

Every task uses this exact format:

### Task X.Y — Task Name

**Phase:**
**Goal:**
**Depends on:**
**Estimated scope:** Small / Medium / Large
**Files likely to change:**
**Inputs required:**
**Implementation requirements:**
**Acceptance criteria:**
**Verification steps:**
**Security/privacy checks:**
**Accessibility checks:**
**Completion rule:**

Each task is specific enough to paste into an AI coding agent with the instruction to implement *only that task*.
