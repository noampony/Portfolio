# Implementation Prompts

One copy-paste prompt per task. Workflow: open this file → copy a task's prompt block (the fenced text) → paste it to your coding agent → let it implement, open a PR, and mark the task done here.

- Tasks run **in order** (1.1 → 17.3). Don't start a task until its dependencies are merged.
- Status icons: ⬜ = not started · 🔄 = in progress · ✅ = done. Each prompt tells the agent to flip its own ⬜ → ✅ when finished.
- Full plan: [tasks/README.md](../tasks/README.md) · gates: [tasks/gates.md](../tasks/gates.md) · checklist: [tasks/release-checklist.md](../tasks/release-checklist.md) · spec: [docs/SPECS.md](SPECS.md).

---

## One-time setup (do this once, before Task 1.1)

The repo is personal (`noampony/Portfolio`) but `gh` may be logged in as a different (work) account. Everything must be done **as your personal git user**.

1. **Git identity** (commits): confirm `git config user.name` → `Noam Pony` and `git config user.email` → `noampong@gmail.com`. Set them at repo level if not: `git config user.name "Noam Pony" && git config user.email "noampong@gmail.com"`.
2. **Push identity**: `origin` is `git@github-noampony:noampony/Portfolio.git` (SSH host alias → personal account). Leave it as-is; `git push -u origin <branch>` will act as `noampony`.
3. **PR identity** (`gh`): ensure a personal login exists — `gh auth login` for the **noampony** GitHub account, then `gh auth switch --user noampony` before opening PRs. If only the work account (`noampo_chkpsw`) is available, **do not open the PR as that account** — stop and ask.
4. **GitHub Actions**: any workflow that creates commits/PRs must use the `Noam Pony <noampong@gmail.com>` identity (set `git config user.*` in the workflow). CI triggered by your pushes/PRs runs as your personal account by default.

---

## Standing Workflow (applies to every prompt below)

Every task prompt ends by telling the agent to follow this. Full text, referenced by each prompt:

1. **One task only.** Implement exactly the named task. Do not start, refactor toward, or stub other tasks.
2. **Read first:** the task's entry in its `tasks/phase-NN-*.md` file (Implementation requirements, Acceptance criteria, Verification steps, Completion rule), plus [tasks/README.md](../tasks/README.md) (Dependency Rules + the **Global Definition of Done**, which applies to every task), plus the listed `docs/SPECS.md` sections. For review tasks, read the named gate in [tasks/gates.md](../tasks/gates.md).
3. **Blocked = stop.** If any required input is marked **TBD/blocked**, do not invent it — stop and ask the owner. Never make a product decision reserved for the owner.
4. **Branch** from an up-to-date `main`: `git switch main && git pull --ff-only && git switch -c <branch>` (branch name given per task).
5. **Implement** keeping the repo green the whole time: `pnpm build`, `pnpm lint`, and type-check must pass; no console errors; no open trails (no dead links, no placeholder UI, no leftover TODOs).
6. **Commit as Noam Pony** (`noampong@gmail.com`): message `Task X.Y: <concise summary>`.
7. **Push & PR as `noampony`** (see Setup §3): `git push -u origin <branch>`, then `gh pr create --base main --title "Task X.Y — <name>" --body "<summary + link to the task file + the Global Definition of Done checklist, ticked>"`. If `gh` is not on the personal account, stop and ask.
8. **Mark done:** edit this file (`PROMPTS.md`), change this task's ⬜ to ✅. Report the PR URL and the Definition-of-Done status.

---

# Phase 1 — Project Foundation
Phase file: [tasks/phase-01-foundation.md](../tasks/phase-01-foundation.md)

## ✅ Task 1.1 — Initialize Next.js + TypeScript Project with Planned Tooling

```text
Implement ONLY Task 1.1 — "Initialize Next.js + TypeScript Project with Planned Tooling" — for the Noam Pony portfolio website (Next.js App Router + TypeScript + Tailwind CSS + ESLint, pnpm, Vercel-ready).

Read before coding: tasks/phase-01-foundation.md (the "Task 1.1" entry — follow its Implementation requirements, Acceptance criteria, Verification steps, Completion rule); tasks/README.md (Dependency Rules + Global Definition of Done); docs/SPECS.md §12.1 (stack), §20.7 (lang).

Task focus: scaffold a buildable App-Router project on the authorized stack ONLY (no Framer Motion / shadcn yet). Strict TypeScript, `<html lang="en">`, single <h1>, .gitignore excludes .env*, README with install/dev/build commands. No lorem-ipsum/dummy marketing copy.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/1.1-project-init`, implement green, commit + push + PR into main as Noam Pony / GitHub noampony, then mark this task ✅).
```

## ✅ Task 1.2 — Add Framer Motion and shadcn/ui (Authorized Dependencies)

```text
Implement ONLY Task 1.2 — "Add Framer Motion and shadcn/ui" — for the Noam Pony portfolio. Depends on Task 1.1 (merged).

Read before coding: tasks/phase-01-foundation.md (the "Task 1.2" entry); tasks/README.md (Dependency Rules + Global Definition of Done); docs/SPECS.md §12.1.

Task focus: install Framer Motion and initialize shadcn/ui (config + `cn` util only — NO unused components, no client JS shipped to the home route). Verify both licenses are permissive (MIT-class, non-GPL) and record them in the PR. These two libs are authorized here only.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/1.2-add-ui-deps`, keep build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 2 — Design System & Shared Layout
Phase file: [tasks/phase-02-design-system.md](../tasks/phase-02-design-system.md)

## ✅ Task 2.1 — Implement Color Tokens and Typography

```text
Implement ONLY Task 2.1 — "Implement Color Tokens and Typography" — for the Noam Pony portfolio. Depends on Task 1.2.

Read before coding: tasks/phase-02-design-system.md (the "Task 2.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §6.3 (exact palette tokens + usage rules), §6.4 (Geist Sans + JetBrains Mono, type scale), §20.4 (contrast AA).

Task focus: encode all §6.3 color tokens (exact hex) as CSS variables / Tailwind theme; one primary accent only; load both fonts via next/font self-hosted (display: swap, primary preloaded — NO external font CDN); implement the §6.4 type-scale tokens; verify text/bg pairings meet AA.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/2.1-tokens-typography`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 2.2 — Build the Root Layout Shell, Skip Link, and Footer

```text
Implement ONLY Task 2.2 — "Build the Root Layout Shell, Skip Link, and Footer" — for the Noam Pony portfolio. Depends on Task 2.1.

Read before coding: tasks/phase-02-design-system.md (the "Task 2.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §20.1 (landmarks), §20.6 (skip link), §15.6 (contact-data privacy — footer = LinkedIn only unless phone/email confirmed).

Task focus: real landmarks (header/nav/main/footer); "Skip to content" as the first focusable element targeting <main>; footer with owner-safe info only (default LinkedIn). No broken links.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/2.2-layout-shell`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 2.3 — Build the Sticky, Data-Driven Navbar

```text
Implement ONLY Task 2.3 — "Build the Sticky, Data-Driven Navbar" — for the Noam Pony portfolio. Depends on Task 2.2.

Read before coding: tasks/phase-02-design-system.md (the "Task 2.3" entry); tasks/README.md (Dependency Rules — no broken links + Global Definition of Done); docs/SPECS.md §5.1, §5.2, §5.3, §5.4, §5.7 (nav items, sticky, anchors, active state, resume behavior TBD), §20.2–§20.4.

Task focus: sticky navbar driven by a `lib/navigation.ts` config that starts with ONLY existing targets (section anchors get appended by later section tasks). Projects/Courses items point to homepage anchors #projects/#courses until full pages exist; Resume item behavior is TBD (wired in Task 10.2) — render it disabled-with-label or omit, never a dead target. No scroll-spy here.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/2.3-navbar`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 2.4 — Build the Accessible Mobile Navigation Menu

```text
Implement ONLY Task 2.4 — "Build the Accessible Mobile Navigation Menu" — for the Noam Pony portfolio. Depends on Task 2.3.

Read before coding: tasks/phase-02-design-system.md (the "Task 2.4" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §5.5 (mobile nav — style is TBD, use a conventional accessible pattern), §20.2–§20.3.

Task focus: collapsible mobile menu reusing the same nav-config; keyboard accessible; closes on item select and on outside click; focus moves in when open and is not trapped; Escape closes; never permanently blocks content.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/2.4-mobile-nav`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 3 — Content / Data Model
Phase file: [tasks/phase-03-content-model.md](../tasks/phase-03-content-model.md)

## ✅ Task 3.1 — Define Content Model Types

```text
Implement ONLY Task 3.1 — "Define Content Model Types" — for the Noam Pony portfolio. Depends on Task 1.2.

Read before coding: tasks/phase-03-content-model.md (the "Task 3.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §11 (all models §11.1–§11.9, with required vs optional preserved), §11.2/§11.3 (confidentiality flags).

Task focus: TypeScript types in lib/content/types.ts for Profile, Experience, Project, Course, Skill, Resume, Contact, SocialLink, TerminalCommand — exact field/required parity with §11; include `confidentialityReviewed: boolean` on Experience & Project; optional fields are `?` so TBD is representable as absent. No data files here.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/3.1-content-types`, type-check green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 3.2 — Build the Build-Time Content Validator

```text
Implement ONLY Task 3.2 — "Build the Build-Time Content Validator" — for the Noam Pony portfolio. Depends on Task 3.1.

Read before coding: tasks/phase-03-content-model.md (the "Task 3.2" entry); tasks/README.md (Dependency Rule 6 — no new libs without approval + Global Definition of Done); docs/SPECS.md §12.5 (validation), §15.4 (confidentiality gate).

Task focus: a build/dev-time validator that fails on missing required fields and omits optionals cleanly, plus a helper that excludes work items where confidentialityReviewed !== true. Plain TypeScript only (no new validation dependency unless owner approves).

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/3.2-content-validator`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 3.3 — Create and Populate the Profile Data

```text
Implement ONLY Task 3.3 — "Create and Populate the Profile Data" — for the Noam Pony portfolio. Depends on Tasks 3.1, 3.2.

Read before coding: tasks/phase-03-content-model.md (the "Task 3.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.1, §8.2, §11.1.

Task focus: populate lib/content/data/profile.ts with ONLY spec-provided values (name, title, oneLineSummary, the §8.1 heroText, location=Israel, yearsExperienceStartDate=2022-10, technologiesCountLabel=18+, coursesCountLabel=35, mainFields per §8.2). Leave TBD fields ABSENT — no profileImage/logo/shortTagline, no `10+` projects count, no invented certificate count, no `city`. Must validate against the Profile type.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/3.3-profile-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 4 — Hero Section (MVP)
Phase file: [tasks/phase-04-hero.md](../tasks/phase-04-hero.md) · This phase is the MVP (spec §2.1).

## ✅ Task 4.1 — Implement the Hero Layout and Semantic Structure

```text
Implement ONLY Task 4.1 — "Implement the Hero Layout and Semantic Structure" — for the Noam Pony portfolio. Depends on Tasks 3.3, 2.4.

Read before coding: tasks/phase-04-hero.md (the "Task 4.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.1 (Hero required content + the intentional no-op CTA note), §15.8 (safe external links), §5.3 (#home anchor), §20.1–§20.3.

Task focus: render name (<h1>), title, the required two-line hero text, location, LinkedIn (new tab + rel="noopener noreferrer"), and BOTH CTAs as styled, keyboard-focusable, intentional NO-OPs (no href="#", no dead link). Default labels Resume/Contact (TBD — note as default). Add id="home" + append #home to nav config. Floating-code container marked aria-hidden (animation comes in 4.3). Profile image is TBD → token-based fallback, never a broken <img>.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/4.1-hero-layout`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 4.2 — Style the Hero and Make It Responsive

```text
Implement ONLY Task 4.2 — "Style the Hero and Make It Responsive" — for the Noam Pony portfolio. Depends on Task 4.1.

Read before coding: tasks/phase-04-hero.md (the "Task 4.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.1 (layout behavior), §16 (responsive), §6.3/§6.4 (tokens/type scale only).

Task focus: dark developer aesthetic using ONLY §6.3 tokens + §6.4 scale; desktop hero near/above fold; mobile readable text-before/alongside visual, tappable CTAs, floating code reduced/hidden if cluttering; no horizontal overflow, no layout shift; filled accent button uses --accent/--accent-contrast.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/4.2-hero-styling`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 4.3 — Add Hero Animations with Reduced-Motion Support

```text
Implement ONLY Task 4.3 — "Add Hero Animations with Reduced-Motion Support" — for the Noam Pony portfolio. Depends on Task 4.2.

Read before coding: tasks/phase-04-hero.md (the "Task 4.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §7.1/§7.3/§7.5 (animation + reduced motion), §8.1 (floating Python code), §14.8 (perf), §19.2 (exact snippets TBD), §20.5/§20.9.

Task focus: subtle entrance fade-in + animated floating Python code background (decorative, aria-hidden). Snippets are TBD → use short GENERIC non-confidential Python (never real/work code; note as default). Under prefers-reduced-motion: reduce → disable/minimize, content fully visible. Prefer transform/opacity, no CLS, no distracting infinite motion.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/4.3-hero-animation`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ✅ Task 4.4 — Add Homepage SEO Metadata

```text
Implement ONLY Task 4.4 — "Add Homepage SEO Metadata" — for the Noam Pony portfolio. Depends on Task 4.1.

Read before coding: tasks/phase-04-hero.md (the "Task 4.4" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §2.1, §13.1 (title), §13.2 (meta description), §13.3/§13.8 (OG image + domain are TBD → defer).

Task focus: set homepage <title> = "Noam Pony | Backend Developer" and the §13.2 meta description verbatim; confirm <html lang="en">. Do NOT add OG tags that reference the TBD image/domain (would be a broken trail) — those land in Phase 12.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/4.4-home-metadata`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 4.5 — Hero Section Completion Review (MVP Gate)

```text
Implement ONLY Task 4.5 — "Hero Section Completion Review (MVP Gate)" — for the Noam Pony portfolio. Depends on Tasks 4.2, 4.3, 4.4.

Read before coding: tasks/phase-04-hero.md (the "Task 4.5" entry); tasks/gates.md → "Hero Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.1, §18.1 (MVP acceptance).

Task focus: verify the Hero Gate + §18.1 fully pass (keyboard pass over Hero+nav; axe/Lighthouse a11y ≥ 95; responsive pass; reduced-motion pass). Fixes only. Confirm CTAs remain intentional no-ops with deferred wiring recorded for Tasks 10.3 (Resume) and 11.3 (Contact). The Hero is the deployable MVP.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/4.5-hero-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 5 — About Me Section
Phase file: [tasks/phase-05-about.md](../tasks/phase-05-about.md)

## ⬜ Task 5.1 — Define About Section Data

```text
Implement ONLY Task 5.1 — "Define About Section Data" — for the Noam Pony portfolio. Depends on Tasks 4.5, 3.2.

Read before coding: tasks/phase-05-about.md (the "Task 5.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.2 (About content + C3 stat-accuracy rules), §19.4 (paragraph/focus TBD; years runtime-vs-build → default build-time from 2022-10).

Task focus: encode stats per C3 rules — coursesCountLabel=35; certificates subset = OMIT until counted; projects = OMIT until known (never 10+); technologiesCountLabel=18+; main fields as badges. Resolve the `X years` token via build-time calc — the literal "X years" must never ship.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/5.1-about-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 5.2 — Implement the About Layout and Stats/Fields Display

```text
Implement ONLY Task 5.2 — "Implement the About Layout and Stats/Fields Display" — for the Noam Pony portfolio. Depends on Task 5.1.

Read before coding: tasks/phase-05-about.md (the "Task 5.2" entry); tasks/README.md (Dependency Rule 5 — no empty UI for TBD + Global Definition of Done); docs/SPECS.md §8.2 (layout), §5.3 (#about anchor), §6.4 (mono for stat numbers).

Task focus: professional summary + only-known stats + main fields as accessible badges; years computed at build time from 2022-10; add id="about" and append #about to nav config; OMIT any TBD stat entirely (no empty artifact). Profile image optional/TBD → omit unless provided.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/5.2-about-layout`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 5.3 — Add Visual Styling and Responsive Behavior + Reveal Animation to About

```text
Implement ONLY Task 5.3 — "Style and Add Responsive Behavior + Reveal Animation to About" — for the Noam Pony portfolio. Depends on Task 5.2.

Read before coding: tasks/phase-05-about.md (the "Task 5.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.2, §7.3/§7.5 (reveal + reduced motion), §16 (responsive), §6.6 (spacing).

Task focus: single-column mobile / card+badge larger screens, consistent padding; subtle scroll-reveal that never hides content without JS and is reduced-motion-safe (counters/reveals reduce to final/static values).

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/5.3-about-polish`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 5.4 — About Section Completion Review

```text
Implement ONLY Task 5.4 — "About Section Completion Review" — for the Noam Pony portfolio. Depends on Task 5.3.

Read before coding: tasks/phase-05-about.md (the "Task 5.4" entry); tasks/gates.md → "About Me Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.2.

Task focus: verify the About Gate fully passes (keyboard, responsive, reduced-motion, C3 data-accuracy, axe/Lighthouse). Fixes only. Confirm no `X years`, no `10+`, no empty TBD stats.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/5.4-about-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 6 — Experience Section
Phase file: [tasks/phase-06-experience.md](../tasks/phase-06-experience.md)

## ⬜ Task 6.1 — Define Experience Data with Confidentiality Flags

```text
Implement ONLY Task 6.1 — "Define Experience Data with Confidentiality Flags" — for the Noam Pony portfolio. Depends on Tasks 5.4, 3.2.

Read before coding: tasks/phase-06-experience.md (the "Task 6.1" entry); tasks/README.md (Dependency Rule 8 blocked + Rule 9 confidentiality + Global Definition of Done); docs/SPECS.md §8.3 incl. §8.3.1–§8.3.4, §15.2/§15.4 (confidentiality), §19.5 (TBDs).

Task focus: encode the 4 entries with §8.3 values; STRIP tracking params (lipi etc.) from the Max Impact LinkedIn URL; set confidentialityReviewed:false on the two Check Point entries (not rendered until owner confirms). BLOCKED inputs — CVE role title, Private Tutor dates, scale-metric approval — list them, do NOT invent.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/6.1-experience-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 6.2 — Implement the Experience Timeline Layout

```text
Implement ONLY Task 6.2 — "Implement the Experience Timeline Layout" — for the Noam Pony portfolio. Depends on Task 6.1.

Read before coding: tasks/phase-06-experience.md (the "Task 6.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.3 (timeline layout + acceptance).

Task focus: timeline/card layout showing org, role, dates, description for each RENDERED entry; current + volunteer roles clear; render only confidentialityReviewed:true entries; no invented fields; no screenshots; add id="experience" + append #experience to nav config; Check Point Cloud duration dynamic or "Present".

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/6.2-experience-timeline`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 6.3 — Style, Make Responsive, and Animate the Timeline

```text
Implement ONLY Task 6.3 — "Style, Make Responsive, and Animate the Timeline" — for the Noam Pony portfolio. Depends on Task 6.2.

Read before coding: tasks/phase-06-experience.md (the "Task 6.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.3, §7.3/§7.5 (animation + reduced motion), §16 (responsive).

Task focus: style + responsive (no overflow on tablet/mobile) + timeline scroll animation that never blocks content visibility; reduced-motion-safe.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/6.3-experience-polish`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 6.4 — Experience Section Completion Review

```text
Implement ONLY Task 6.4 — "Experience Section Completion Review" — for the Noam Pony portfolio. Depends on Task 6.3.

Read before coding: tasks/phase-06-experience.md (the "Task 6.4" entry); tasks/gates.md → "Experience Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.3, §15.

Task focus: verify the Experience Gate fully passes (confidentiality audit — only reviewed entries shown, tracking params stripped; keyboard; responsive; reduced-motion; axe/Lighthouse). Fixes only. Document any unresolved confidentiality/TBD items.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/6.4-experience-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 7 — Projects Preview Section
Phase file: [tasks/phase-07-projects-preview.md](../tasks/phase-07-projects-preview.md)

## ⬜ Task 7.1 — Define Projects Preview Data with Confidentiality Flags

```text
Implement ONLY Task 7.1 — "Define Projects Preview Data with Confidentiality Flags" — for the Noam Pony portfolio. Depends on Tasks 6.4, 3.2.

Read before coding: tasks/phase-07-projects-preview.md (the "Task 7.1" entry); tasks/README.md (Rule 8 blocked + Rule 9 confidentiality + Global Definition of Done); docs/SPECS.md §8.4 (4 projects + security notes), §9.10/§15.2/§15.4 (confidentiality), §19.6 (TBDs).

Task focus: encode the 4 projects with §8.4 fields; confidentialityReviewed:false on the three Check Point projects (not rendered until owner confirms); Students Tracking System uses generalized language only (no sensitive teen/health detail). BLOCKED — name/behavior/"2B events per week" publish approval, years, categories, Students backend focus — list, don't invent.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/7.1-projects-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 7.2 — Implement the Projects Preview Layout

```text
Implement ONLY Task 7.2 — "Implement the Projects Preview Layout" — for the Noam Pony portfolio. Depends on Task 7.1.

Read before coding: tasks/phase-07-projects-preview.md (the "Task 7.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.4 (card fields + "View All Projects"), §4.3 (full Projects page is conditional).

Task focus: render only confidentialityReviewed:true projects (3–5); each card = name, short description, problem solved, tech stack (wrapping mono badges), backend focus; readable WITHOUT images; add id="projects" + #projects to nav. "View All Projects" must NOT be a dead link — disabled-with-label or omit until Task 15.3 builds the page.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/7.2-projects-layout`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 7.3 — Style, Make Responsive, and Animate Project Cards

```text
Implement ONLY Task 7.3 — "Style, Make Responsive, and Animate Project Cards" — for the Noam Pony portfolio. Depends on Task 7.2.

Read before coding: tasks/phase-07-projects-preview.md (the "Task 7.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.4 (layout), §6.7 (cards), §7.4 (hover).

Task focus: desktop featured-large + cards, mobile stacks, badges wrap; subtle hover (elevation/border/glow, no large jumps); no hover-only critical info; reduced-motion-safe.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/7.3-projects-polish`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 7.4 — Projects Preview Section Completion Review

```text
Implement ONLY Task 7.4 — "Projects Preview Section Completion Review" — for the Noam Pony portfolio. Depends on Task 7.3.

Read before coding: tasks/phase-07-projects-preview.md (the "Task 7.4" entry); tasks/gates.md → "Projects Preview Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.4, §15.

Task focus: verify the Projects Preview Gate fully passes (confidentiality audit, image-independence, no dead "View All Projects" link, responsive/reduced-motion/a11y). Fixes only.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/7.4-projects-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 8 — Courses Preview Section
Phase file: [tasks/phase-08-courses-preview.md](../tasks/phase-08-courses-preview.md)

## ⬜ Task 8.1 — Define Courses Preview Data

```text
Implement ONLY Task 8.1 — "Define Courses Preview Data" — for the Noam Pony portfolio. Depends on Tasks 7.4, 3.2.

Read before coding: tasks/phase-08-courses-preview.md (the "Task 8.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.5 (5 courses + fields), §10.9 (certificate-link safety), §19.7 (TBDs).

Task focus: encode the 5 courses with §8.5 fields; missing certs/images = ABSENT (shown unavailable/omitted, not broken); access-check the Course 1 Google Drive link (mark unavailable if not public). FLAG for owner confirmation (don't silently ship/auto-fix): "Antrophic"→Anthropic, "Marc 2026"→March 2026.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/8.1-courses-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 8.2 — Implement the Courses Preview (Learning-Path Style) Layout

```text
Implement ONLY Task 8.2 — "Implement the Courses Preview (Learning-Path Style) Layout" — for the Noam Pony portfolio. Depends on Task 8.1.

Read before coding: tasks/phase-08-courses-preview.md (the "Task 8.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.5 (card fields + "Explore Courses Hub" + learning-path framing), §4.4 (full Courses Hub is conditional), §10.9 (cert links safe/new tab).

Task focus: 3–5 course cards with §8.5 fields where data exists; consistent non-generic fallback when no image; missing cert shown unavailable/omitted; framed as professional growth, not a random list; add id="courses" + #courses to nav. "Explore Courses Hub" must NOT be a dead link — disabled-with-label or omit until Task 16.2.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/8.2-courses-layout`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 8.3 — Style, Make Responsive, and Animate Course Cards

```text
Implement ONLY Task 8.3 — "Style, Make Responsive, and Animate Course Cards" — for the Noam Pony portfolio. Depends on Task 8.2.

Read before coding: tasks/phase-08-courses-preview.md (the "Task 8.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.5, §14.3/§14.4 (image opt + lazy-load), §16.7 (card grids).

Task focus: responsive grid → stack on mobile; subtle hover; lazy-load course images with width/height (no CLS); reduced-motion-safe.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/8.3-courses-polish`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 8.4 — Courses Preview Section Completion Review

```text
Implement ONLY Task 8.4 — "Courses Preview Section Completion Review" — for the Noam Pony portfolio. Depends on Task 8.3.

Read before coding: tasks/phase-08-courses-preview.md (the "Task 8.4" entry); tasks/gates.md → "Courses Preview Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.5, §10.9.

Task focus: verify the Courses Preview Gate fully passes (link checks incl. Drive access, fallback checks, no dead "Explore Courses Hub", responsive/reduced-motion/a11y). Fixes only. Confirm typo corrections handled.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/8.4-courses-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 9 — Technical Skills Section
Phase file: [tasks/phase-09-skills.md](../tasks/phase-09-skills.md)

## ⬜ Task 9.1 — Define Skills Data

```text
Implement ONLY Task 9.1 — "Define Skills Data" — for the Noam Pony portfolio. Depends on Tasks 8.4, 3.2.

Read before coding: tasks/phase-09-skills.md (the "Task 9.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.6 (skill categories + notes; proficiency TBD).

Task focus: encode all §8.6 categories/skills; keep only the REAL notes (AWS, Jenkins, Iceberg); TBD notes = ABSENT; NO invented proficiency levels.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/9.1-skills-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 9.2 — Implement the Skills Section Layout (Grouped Badges)

```text
Implement ONLY Task 9.2 — "Implement the Skills Section Layout (Grouped Badges)" — for the Noam Pony portfolio. Depends on Task 9.1.

Read before coding: tasks/phase-09-skills.md (the "Task 9.2" entry); tasks/README.md (Dependency Rule 6 — no new icon lib without approval + Global Definition of Done); docs/SPECS.md §8.6 (grouped badges + notes inline, not hover-only), §6.8 (icon source TBD, license-safe, no scraping).

Task focus: all categories grouped and scannable; accessible badge labels; notes inline (not hover-only); no empty note artifacts; add id="skills" + #skills to nav. Icons optional — if no license-safe source yet, ship text/badge labels with NO icons; decorative icons get aria-hidden.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/9.2-skills-layout`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 9.3 — Style, Make Responsive, and Animate the Skills Section

```text
Implement ONLY Task 9.3 — "Style, Make Responsive, and Animate the Skills Section" — for the Noam Pony portfolio. Depends on Task 9.2.

Read before coding: tasks/phase-09-skills.md (the "Task 9.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.6 (layout), §16 (responsive).

Task focus: desktop category cards/rows; mobile stacks; badges wrap; long AWS notes stay readable on mobile; subtle animation; reduced-motion-safe.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/9.3-skills-polish`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 9.4 — Technical Skills Section Completion Review

```text
Implement ONLY Task 9.4 — "Technical Skills Section Completion Review" — for the Noam Pony portfolio. Depends on Task 9.3.

Read before coding: tasks/phase-09-skills.md (the "Task 9.4" entry); tasks/gates.md → "Technical Skills Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.6.

Task focus: verify the Skills Gate fully passes (every §8.6 category present, no fake proficiency, icon licensing safe, responsive/reduced-motion/a11y). Fixes only.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/9.4-skills-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 10 — Resume Section
Phase file: [tasks/phase-10-resume.md](../tasks/phase-10-resume.md) · BLOCKED until the resume file + behavior decision are provided.

## ⬜ Task 10.1 — Add and Privacy-Review the Resume File

```text
Implement ONLY Task 10.1 — "Add and Privacy-Review the Resume File" — for the Noam Pony portfolio. Depends on Task 9.4.

Read before coding: tasks/phase-10-resume.md (the "Task 10.1" entry); tasks/README.md (Rule 8 blocked + Global Definition of Done); docs/SPECS.md §4.5 (repo path /public/resume.pdf → served at /resume.pdf), §8.7, §11.6 (Resume model), §15.5 (resume privacy review), §17/§19.8.

Task focus: BLOCKED on the actual resume PDF + owner privacy sign-off — if not provided, stop and ask. When provided: place at public/resume.pdf, confirm it serves at /resume.pdf (never link /public/...), encode the Resume model (downloadButtonText="Download CV", previewEnabled=true; lastUpdated/highlights absent until provided).

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/10.1-resume-file`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 10.2 — Implement the Resume Preview and Download (and Resolve Resume Behavior)

```text
Implement ONLY Task 10.2 — "Implement the Resume Preview and Download" — for the Noam Pony portfolio. Depends on Task 10.1.

Read before coding: tasks/phase-10-resume.md (the "Task 10.2" entry); tasks/README.md (Rule 8 blocked + Global Definition of Done); docs/SPECS.md §8.7 (preview + Download CV + behavior TBD), §16.8 (mobile resume).

Task focus: BLOCKED on the owner's resume-behavior decision (section vs modal vs direct) — do not choose for them. When decided: Download CV → /resume.pdf; embedded preview if performant else graceful fallback (no third-party trackers, mobile not broken); add id="resume" + #resume to nav; wire the Resume NAV ITEM (deferred from Task 2.3) to the chosen behavior — no dead target.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/10.2-resume-section`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 10.3 — Wire the Hero Resume CTA (Remove No-Op)

```text
Implement ONLY Task 10.3 — "Wire the Hero Resume CTA (Remove No-Op)" — for the Noam Pony portfolio. Depends on Task 10.2.

Read before coding: tasks/phase-10-resume.md (the "Task 10.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.1 + §8.7 wiring note, §19.2 (CTA label TBD → keep default).

Task focus: wire the Hero primary (Resume) CTA to the chosen resume behavior and REMOVE its no-op/disabled state; verify via mouse + keyboard; no dead link.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/10.3-hero-resume-cta`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 10.4 — Resume Section Completion Review

```text
Implement ONLY Task 10.4 — "Resume Section Completion Review" — for the Noam Pony portfolio. Depends on Task 10.3.

Read before coding: tasks/phase-10-resume.md (the "Task 10.4" entry); tasks/gates.md → "Resume Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.7, §15.5.

Task focus: verify the Resume Gate fully passes (download/preview/fallback, Hero Resume CTA wired, mobile not broken, resume privacy-reviewed, no trackers, a11y). Fixes only.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/10.4-resume-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 11 — Contact Section
Phase file: [tasks/phase-11-contact.md](../tasks/phase-11-contact.md)

## ⬜ Task 11.1 — Define Contact Data (with Phone-Display Confirmation)

```text
Implement ONLY Task 11.1 — "Define Contact Data (with Phone-Display Confirmation)" — for the Noam Pony portfolio. Depends on Tasks 10.4, 3.2.

Read before coding: tasks/phase-11-contact.md (the "Task 11.1" entry); tasks/README.md (Rule 8 blocked + Global Definition of Done); docs/SPECS.md §8.8 (contact values + corrected message), §11.7, §15.6 (phone publication must be confirmed).

Task focus: encode §8.8 values incl. the CORRECTED message ("Let's Work Together! ..."), email, LinkedIn, location=Israel, preferred=Phone, contactFormEnabled=false. Phone is BLOCKED on owner confirmation (spam risk) — include only if confirmed, else omit and flag. No contact form here.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/11.1-contact-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 11.2 — Implement the Contact Section (Direct Links)

```text
Implement ONLY Task 11.2 — "Implement the Contact Section (Direct Links)" — for the Noam Pony portfolio. Depends on Task 11.1.

Read before coding: tasks/phase-11-contact.md (the "Task 11.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.8 (acceptance).

Task focus: heading, corrected message, email (mailto:), LinkedIn (new tab + rel="noopener noreferrer"), phone (tel:, only if confirmed), location, preferred method; add id="contact" + #contact to nav. Do NOT build the contact form; no broken placeholder form.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/11.2-contact-section`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 11.3 — Wire the Hero Contact CTA (Remove No-Op)

```text
Implement ONLY Task 11.3 — "Wire the Hero Contact CTA (Remove No-Op)" — for the Noam Pony portfolio. Depends on Task 11.2.

Read before coding: tasks/phase-11-contact.md (the "Task 11.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §8.1 + §8.8 wiring note, §19.2 (label TBD → keep default).

Task focus: wire the Hero secondary (Contact) CTA to scroll to #contact and REMOVE its no-op; verify via mouse + keyboard.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/11.3-hero-contact-cta`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 11.4 — Contact Section Completion Review

```text
Implement ONLY Task 11.4 — "Contact Section Completion Review" — for the Noam Pony portfolio. Depends on Task 11.3.

Read before coding: tasks/phase-11-contact.md (the "Task 11.4" entry); tasks/gates.md → "Contact Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.8, §15.6.

Task focus: verify the Contact Gate fully passes (mailto/tel/LinkedIn behavior, Hero Contact CTA wired, mobile, a11y, phone confirmation honored). Fixes only. Confirm BOTH Hero CTAs are now wired.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/11.4-contact-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 12 — SEO, Accessibility, Performance & Privacy Hardening
Phase file: [tasks/phase-12-hardening.md](../tasks/phase-12-hardening.md)

## ⬜ Task 12.1 — Add Sitemap and robots.txt

```text
Implement ONLY Task 12.1 — "Add Sitemap and robots.txt" — for the Noam Pony portfolio. Depends on Task 11.4.

Read before coding: tasks/phase-12-hardening.md (the "Task 12.1" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §13.5 (sitemap), §13.6 (robots), §13.8 (domain TBD → relative/configurable base).

Task focus: sitemap lists ONLY existing public routes (Home now); robots.txt allows public pages and excludes any draft/private routes; no real domain hardcoded (configurable base).

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/12.1-sitemap-robots`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 12.2 — Add Open Graph and Structured Data

```text
Implement ONLY Task 12.2 — "Add Open Graph and Structured Data" — for the Noam Pony portfolio. Depends on Task 12.1.

Read before coding: tasks/phase-12-hardening.md (the "Task 12.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §13.3 (OG), §13.4 (LinkedIn preview), §13.7 (structured data), §13.8 (domain TBD), §19.3 (OG image TBD).

Task focus: OG title/description/type/url + Person & WebSite JSON-LD. OG image is TBD — do NOT ship og:image pointing at a missing asset; add it once provided and record as remaining input. Canonical once domain known.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/12.2-og-structured-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 12.3 — Homepage Accessibility Audit and Fixes

```text
Implement ONLY Task 12.3 — "Homepage Accessibility Audit and Fixes" — for the Noam Pony portfolio. Depends on Task 12.2.

Read before coding: tasks/phase-12-hardening.md (the "Task 12.3" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §20 (full baseline), §14.6 (Lighthouse a11y ≥ 95).

Task focus: end-to-end §20 audit (landmarks, single h1/heading order across the one-page site, keyboard, visible focus, contrast AA, alt text, skip link, lang, reduced motion, safe links); run axe + Lighthouse; fix to a11y ≥ 95, no critical violations.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/12.3-a11y-audit`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 12.4 — Performance Pass (Images, Bundle, Animation)

```text
Implement ONLY Task 12.4 — "Performance Pass (Images, Bundle, Animation)" — for the Noam Pony portfolio. Depends on Task 12.3.

Read before coding: tasks/phase-12-hardening.md (the "Task 12.4" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §14 (esp. §14.3 images, §14.4 lazy-load, §14.7 bundle, §14.8 animation).

Task focus: optimized responsive images with width/height; lazy-load non-critical (courses/projects) but NOT the Hero LCP image; minimal homepage JS, split optional components, tree-shakeable imports; transform/opacity animations; confirm no terminal/contact-form code ships. Target Lighthouse perf ≥ 90 or document gaps; no CLS regressions.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/12.4-performance`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 12.5 — Privacy & Confidentiality Review (Whole Site)

```text
Implement ONLY Task 12.5 — "Privacy & Confidentiality Review (Whole Site)" — for the Noam Pony portfolio. Depends on Task 12.4.

Read before coding: tasks/phase-12-hardening.md (the "Task 12.5" entry); tasks/README.md (Rule 9 confidentiality + Global Definition of Done); docs/SPECS.md §15 (all), §8.3.1 (LinkedIn tracking params), §15.5 (resume), §15.9 (assets).

Task focus: full §15 audit — no internal names/architecture/customer data/metrics/IPs/domains/hostnames/logs/work screenshots/sensitive cyber workflows; only confidentialityReviewed:true work items rendered; resume privacy-reviewed; LinkedIn tracking params stripped; no secrets/.env/keys in repo or public/; external links rel="noopener noreferrer" + valid. Grep for IPs/hostnames/lipi/.env/key patterns. Record results in the PR.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/12.5-privacy-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 13 — Final Polish & Deployment Readiness
Phase file: [tasks/phase-13-deployment.md](../tasks/phase-13-deployment.md)

## ⬜ Task 13.1 — Full Homepage QA Sweep

```text
Implement ONLY Task 13.1 — "Full Homepage QA Sweep" — for the Noam Pony portfolio. Depends on Task 12.5.

Read before coding: tasks/phase-13-deployment.md (the "Task 13.1" entry); tasks/gates.md (all section gates); tasks/README.md (Global Definition of Done); docs/SPECS.md §16 (responsive), §18.2 (global acceptance), §5.4 (active state).

Task focus: cross-section QA — all sections render in order, anchors + nav work (incl. scroll-spy if implemented), no console errors, no broken links, no horizontal overflow at any breakpoint, no banned placeholders (X years / 10+ / dead CTAs). Full responsive + keyboard + reduced-motion pass; click every nav item and CTA. Fixes only; no regressions.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/13.1-qa-sweep`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 13.2 — Production Build & Vercel Deployment Readiness

```text
Implement ONLY Task 13.2 — "Production Build & Vercel Deployment Readiness" — for the Noam Pony portfolio. Depends on Task 13.1.

Read before coding: tasks/phase-13-deployment.md (the "Task 13.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §12.6 (deployment), §14.2 (static generation), §4.5 (/resume.pdf).

Task focus: clean `pnpm build`; static generation where possible; resume + images resolve in a production build; confirm no env vars required for the static site; verify /resume.pdf resolves in production; deploy to Vercel (or a preview). If domain still TBD, deploy on the default Vercel domain and record the domain swap as a follow-up.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/13.2-vercel-readiness`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 13.3 — Final Release Checklist Sign-Off

```text
Implement ONLY Task 13.3 — "Final Release Checklist Sign-Off" — for the Noam Pony portfolio. Depends on Task 13.2.

Read before coding: tasks/phase-13-deployment.md (the "Task 13.3" entry); tasks/release-checklist.md (run every item + the blocking-TBD appendix); tasks/README.md (Global Definition of Done); docs/SPECS.md §18.

Task focus: execute every item in tasks/release-checklist.md; fix failures; document any acceptably deferred TBD with its owner. The MVP/full homepage must be launch-ready.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/13.3-release-signoff`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 14 — Floating Business Card (Nice-to-have)
Phase file: [tasks/phase-14-business-card.md](../tasks/phase-14-business-card.md) · Must not start before Phase 13 is merged (Dependency Rule 10).

## ⬜ Task 14.1 — Define Business Card Data and Confirm Promotion

```text
Implement ONLY Task 14.1 — "Define Business Card Data and Confirm Promotion" — for the Noam Pony portfolio. Depends on Task 13.3.

Read before coding: tasks/phase-14-business-card.md (the "Task 14.1" entry); tasks/README.md (Rule 8 blocked + Rule 10 MVP-first + Global Definition of Done); docs/SPECS.md §8.9, §19.1 (promotion decision), §19.10 (tagline/resume link/profile pic TBD).

Task focus: BLOCKED — confirm the feature is promoted, plus tagline/resume link/profile picture. If not provided, stop and ask. When provided: encode data (reuse Profile/Contact), TBD fields absent; do not build UI here.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/14.1-card-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 14.2 — Implement the Accessible Left-Side Drawer

```text
Implement ONLY Task 14.2 — "Implement the Accessible Left-Side Drawer" — for the Noam Pony portfolio. Depends on Task 14.1.

Read before coding: tasks/phase-14-business-card.md (the "Task 14.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §7.6 (interaction), §8.9 (content + a11y), §16.5 (responsive), §19.10 (style lean TBD).

Task focus: always-visible trigger NOT blocking Hero CTAs; opens left on desktop, mobile-friendly drawer; closes on outside click + Escape + close button; dialog/drawer semantics; focus trap when modal; focus restored to trigger on close; no hover-only; reduced-motion-safe. Style via tokens (don't invent beyond spec).

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/14.2-card-drawer`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 14.3 — Floating Business Card Completion Review

```text
Implement ONLY Task 14.3 — "Floating Business Card Completion Review" — for the Noam Pony portfolio. Depends on Task 14.2.

Read before coding: tasks/phase-14-business-card.md (the "Task 14.3" entry); tasks/gates.md → "Floating Business Card Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.9.

Task focus: verify the Business Card Gate fully passes (keyboard open/navigate/close, outside-click + Escape, focus returns to trigger; does not block Hero CTAs or page scroll). Fixes only; no regressions.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/14.3-card-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 15 — Full Projects Page (Nice-to-have / Conditional)
Phase file: [tasks/phase-15-projects-page.md](../tasks/phase-15-projects-page.md) · Must not start before Phase 13 is merged.

## ⬜ Task 15.1 — Decide and Document Whether to Build the Projects Page

```text
Implement ONLY Task 15.1 — "Decide and Document Whether to Build the Projects Page" — for the Noam Pony portfolio. Depends on Task 13.3.

Read before coding: tasks/phase-15-projects-page.md (the "Task 15.1" entry); tasks/README.md (Rule 8 blocked + Rule 10 + Global Definition of Done); docs/SPECS.md §4.3 (count-based go/no-go — page may be unnecessary under 10 projects).

Task focus: BLOCKED on total project count + owner go/no-go. Record the decision in docs/. Either way, ensure the homepage "View All Projects" control stays non-broken (disabled/omitted if no page).

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/15.1-projects-page-decision`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 15.2 — Define Full Project Detail Data

```text
Implement ONLY Task 15.2 — "Define Full Project Detail Data" — for the Noam Pony portfolio. Depends on Task 15.1 (go decision).

Read before coding: tasks/phase-15-projects-page.md (the "Task 15.2" entry); tasks/README.md (Rule 9 confidentiality + Global Definition of Done); docs/SPECS.md §9.6 (detail model), §9.9 (links), §9.10 (confidentiality).

Task focus: extend project data to the §9.6 model; only confidentialityReviewed:true projects; no internal detail; links validated. BLOCKED on years/categories/optional fields approvals — list, don't invent.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/15.2-projects-detail-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 15.3 — Build the Projects Page Layout, Cards, and Filters

```text
Implement ONLY Task 15.3 — "Build the Projects Page Layout, Cards, and Filters" — for the Noam Pony portfolio. Depends on Task 15.2.

Read before coding: tasks/phase-15-projects-page.md (the "Task 15.3" entry); tasks/README.md (Rule 8 blocked + Global Definition of Done); docs/SPECS.md §9.3 (layout), §9.4 (filters), §9.7 (cards), §9.8 (detail pattern TBD), §13.1 (page title).

Task focus: build app/projects/page.tsx — grid/list + featured + filters by technology/category; cards emphasize backend problem-solving, image-independent, graceful unavailable links; re-point the navbar Projects item AND the homepage "View All Projects" to this page; set page title/meta. Detail pattern is BLOCKED until decided.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/15.3-projects-page`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 15.4 — Projects Page Completion Review

```text
Implement ONLY Task 15.4 — "Projects Page Completion Review" — for the Noam Pony portfolio. Depends on Task 15.3.

Read before coding: tasks/phase-15-projects-page.md (the "Task 15.4" entry); tasks/gates.md → "Full Projects Page Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §9, §13.5 (sitemap).

Task focus: verify the Full Projects Page Gate fully passes (filters, responsive, confidentiality, no broken links); update the sitemap to include /projects. Fixes only.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/15.4-projects-page-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 16 — Full Courses Hub Page (Nice-to-have / Conditional)
Phase file: [tasks/phase-16-courses-page.md](../tasks/phase-16-courses-page.md) · Must not start before Phase 13 is merged.

## ⬜ Task 16.1 — Define Full Courses Hub Data and Learning Paths

```text
Implement ONLY Task 16.1 — "Define Full Courses Hub Data and Learning Paths" — for the Noam Pony portfolio. Depends on Task 13.3.

Read before coding: tasks/phase-16-courses-page.md (the "Task 16.1" entry); tasks/README.md (Rule 8 blocked + Global Definition of Done); docs/SPECS.md §10.5 (categories), §10.6 (card fields), §10.7 (learning paths), §10.8 (stats/C3 rules), §10.9 (certificate safety).

Task focus: BLOCKED on the full course dataset + learning-path memberships + certificate links/access + total hours. When provided: stats follow C3 rules (35 courses; certificates a subset; total hours only when provided); learning paths only when membership defined; access-check certificate links.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/16.1-courses-hub-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 16.2 — Build the Courses Hub Page (Stats, Breakdown, Paths, Filters)

```text
Implement ONLY Task 16.2 — "Build the Courses Hub Page" — for the Noam Pony portfolio. Depends on Task 16.1.

Read before coding: tasks/phase-16-courses-page.md (the "Task 16.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §10.3 (layout), §10.4 (filters), §13.1 (page title).

Task focus: build app/courses/page.tsx — heading/intro, total-courses stat, category breakdown, featured courses, learning paths (only when defined), filters by category/skills, course grid with consistent fallbacks; re-point the navbar Courses item AND homepage "Explore Courses Hub" to this page; set page title/meta.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/16.2-courses-hub-page`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 16.3 — Courses Hub Completion Review

```text
Implement ONLY Task 16.3 — "Courses Hub Completion Review" — for the Noam Pony portfolio. Depends on Task 16.2.

Read before coding: tasks/phase-16-courses-page.md (the "Task 16.3" entry); tasks/gates.md → "Full Courses Hub Page Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §10, §13.7 (optional Course structured data).

Task focus: verify the Full Courses Hub Page Gate fully passes (filters, cert-link safety, C3 stats, responsive, a11y); update the sitemap to include /courses; optionally add Course JSON-LD. Fixes only.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/16.3-courses-hub-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

---

# Phase 17 — Terminal Popup / Easter Egg (Nice-to-have)
Phase file: [tasks/phase-17-terminal.md](../tasks/phase-17-terminal.md) · Spec §8.10 forbids building before the core site is complete; must not start before Phase 13 is merged.

## ⬜ Task 17.1 — Define Terminal Commands and Deterministic Outputs

```text
Implement ONLY Task 17.1 — "Define Terminal Commands and Deterministic Outputs" — for the Noam Pony portfolio. Depends on Task 13.3.

Read before coding: tasks/phase-17-terminal.md (the "Task 17.1" entry); tasks/README.md (Rule 8 blocked + Global Definition of Done); docs/SPECS.md §8.10 (command set), §11.9 (TerminalCommand model), §19.11 (outputs TBD).

Task focus: BLOCKED on all command output content (whoami/skills/projects/courses/experience/contact/resume/easteregg) + unknown-command + history decisions. When provided: deterministic outputs only; `resume` returns the safe /resume.pdf link; non-confidential; reuse public site data.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/17.1-terminal-data`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 17.2 — Build the Accessible, Lazy-Loaded Terminal Popup

```text
Implement ONLY Task 17.2 — "Build the Accessible, Lazy-Loaded Terminal Popup" — for the Noam Pony portfolio. Depends on Task 17.1.

Read before coding: tasks/phase-17-terminal.md (the "Task 17.2" entry); tasks/README.md (Global Definition of Done); docs/SPECS.md §7.7 (interaction), §8.10 (commands + a11y), §16.6 (responsive), §14.4/§14.7 (lazy-load/bundle).

Task focus: floating-button terminal; typed commands → predefined outputs; help lists commands; clear clears history; unknown → helpful message; keyboard operable; visible focus; output announced where feasible; Escape close; no keyboard trap; reduced motion disables/min typing; code-split/lazy-loaded (NOT in initial bundle); simplified on mobile.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/17.2-terminal-popup`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```

## ⬜ Task 17.3 — Terminal Completion Review

```text
Implement ONLY Task 17.3 — "Terminal Completion Review" — for the Noam Pony portfolio. Depends on Task 17.2.

Read before coding: tasks/phase-17-terminal.md (the "Task 17.3" entry); tasks/gates.md → "Terminal Popup Gate"; tasks/README.md (Global Definition of Done); docs/SPECS.md §8.10.

Task focus: verify the Terminal Popup Gate fully passes (deterministic commands, keyboard + pointer close, reduced-motion typing, not in initial bundle, no interference with screen readers/navigation). Fixes only; no regressions.

Then follow the Standing Workflow at the top of PROMPTS.md (branch `task/17.3-terminal-review`, build green, commit + push + PR as Noam Pony / noampony, then mark ✅).
```
