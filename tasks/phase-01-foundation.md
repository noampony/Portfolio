# Phase 1 — Project Foundation

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

---

### Task 1.1 — Initialize Next.js + TypeScript Project with Planned Tooling

**Phase:** 1 — Project Foundation
**Goal:** Create a buildable Next.js (App Router) + TypeScript project with pnpm, Tailwind CSS, and ESLint configured, deployable to Vercel.
**Depends on:** —
**Estimated scope:** Medium
**Files likely to change:** `package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `next.config.*`, `tailwind.config.*`, `postcss.config.*`, `.eslintrc*`/`eslint.config.*`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `README.md`.
**Inputs required:** None (stack is fixed by spec §12.1).
**Implementation requirements:**
- Use the authorized stack only: Next.js, TypeScript, Tailwind CSS, ESLint, pnpm (spec §12.1). Do not add Framer Motion or shadcn/ui yet (added in later authorized tasks).
- App Router, strict TypeScript (`strict: true`).
- A minimal home route renders a placeholder-free, valid page (a single `<main>` with an `<h1>` is acceptable as scaffolding — it will be replaced in Phase 4; it must not contain lorem ipsum or dummy marketing copy).
- `.gitignore` excludes `.env*`, build output, and `node_modules` (org policy: never commit `.env`/secrets).
- README documents install/dev/build commands.
**Acceptance criteria:**
- `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, and type-check all succeed.
- App serves a home route with no console errors.
- Project layout is compatible with Vercel zero-config deployment.
**Verification steps:**
1. Run `pnpm install && pnpm build && pnpm lint`.
2. Run `pnpm dev`, open the home route, confirm no console errors.
3. Confirm `.env*` is gitignored.
**Security/privacy checks:** Confirm no secrets, tokens, or `.env` files are committed; TLS verification not disabled anywhere.
**Accessibility checks:** `<html lang="en">` set (spec §20.7); document has a single `<h1>`.
**Completion rule:** Done when the project builds, lints, type-checks, runs locally with no console errors, and `<html lang>` is set.

---

### Task 1.2 — Add Framer Motion and shadcn/ui (Authorized Dependencies)

**Phase:** 1 — Project Foundation
**Goal:** Install and configure the two remaining authorized UI dependencies so later phases can use them, without using them yet.
**Depends on:** 1.1
**Estimated scope:** Small
**Files likely to change:** `package.json`, `pnpm-lock.yaml`, `components.json` (shadcn), `lib/utils.ts`, `tailwind.config.*`, `app/globals.css`.
**Inputs required:** None.
**Implementation requirements:**
- Add Framer Motion and initialize shadcn/ui (spec §12.1). These are explicitly authorized here and only here for foundation.
- Do not generate unused components; only initialize the shadcn config and the `cn` utility.
- Verify licenses are permissive (MIT-class) and record them in the task output (org policy: license check before adding deps).
**Acceptance criteria:**
- Build/lint/type-check still pass.
- shadcn config present; Framer Motion importable.
- No component is shipped/rendered yet (no bundle bloat in the home route).
**Verification steps:**
1. `pnpm build && pnpm lint`.
2. Confirm the home route bundle did not grow with unused client JS (no Framer Motion shipped to a route that doesn't use it).
**Security/privacy checks:** Confirm dependency licenses are non-GPL/permissive; no postinstall scripts introduce risk.
**Accessibility checks:** N/A (no UI added).
**Completion rule:** Done when both libraries are installed, licensed-checked, configured, and the build stays green with no unused client JS shipped.
