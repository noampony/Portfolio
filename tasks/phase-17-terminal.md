# Phase 17 — Terminal Popup / Easter Egg (Nice-to-have)

> Part of the [Portfolio Website Task Breakdown](README.md). Shared rules live in the index: Planning Principles, Dependency Rules, the **Global Definition of Done** (applies to every task here), and the Task Format. Completion gates are in [gates.md](gates.md); the final checklist + blocking TBDs are in [release-checklist.md](release-checklist.md). `spec §X` refers to [../docs/SPECS.md](../docs/SPECS.md).

> Must not begin until Phase 13 is complete (Dependency Rule 10).
>
> **Defer rationale / risk:** Spec §8.10 explicitly forbids building this before the core site is complete. Highest a11y/JS risk of all features (live command input, output announcements, focus, reduced-motion typing) and bundle-size impact (§14.7 — keep it code-split / lazy-loaded). **Blocked** on: all command output content (`whoami`, `skills`, `projects`, `courses`, `experience`, `contact`, `resume`, `easteregg`) which are TBD (§8.10, §19.11).

---

### Task 17.1 — Define Terminal Commands and Deterministic Outputs

**Phase:** 17 · **Goal:** Encode the §8.10 command set + deterministic outputs (spec §11.9). · **Depends on:** 13.3 · **Scope:** Medium · **Files:** `lib/content/data/terminal.ts`. · **Inputs required (blocking):** All TBD command outputs (§19.11); unknown-command suggestion behavior (§19.11); session-history decision (§19.11). · **Implementation requirements:** Deterministic outputs only; `resume` returns the safe `/resume.pdf` link; no confidential content; outputs reuse public site data where possible. · **Acceptance criteria:** Command data validates; outputs non-confidential. · **Verification steps:** Build passes; review outputs for confidentiality. · **Security/privacy checks:** No confidential content; `resume` link safe. · **Accessibility checks:** N/A. · **Completion rule:** Done when command data validates with non-confidential outputs; blocked until outputs provided.

---

### Task 17.2 — Build the Accessible, Lazy-Loaded Terminal Popup

**Phase:** 17 · **Goal:** Implement the floating terminal with `help`/`clear`/commands and full accessibility (spec §7.7, §8.10, §16.6). · **Depends on:** 17.1 · **Scope:** Large · **Files:** `components/terminal/TerminalPopup.tsx`, `components/terminal/TerminalTrigger.tsx`, `app/layout.tsx`. · **Inputs required:** None beyond 17.1. · **Implementation requirements:** Floating button opens it; typed commands return predefined outputs; `help` lists commands; `clear` clears history; unknown → helpful message; keyboard operable; visible focus; output announced where feasible; Escape close; no keyboard trap; reduced motion disables/min typing (§7.7, §8.10). Code-split / lazy-loaded so it doesn't ship on initial load (§14.4, §14.7). Simplified on mobile (§16.6). · **Acceptance criteria:** All commands deterministic; close works by keyboard + pointer; not shipped in the initial bundle. · **Verification steps:** Run each command; reduced-motion check; confirm lazy chunk. · **Security/privacy checks:** Outputs non-confidential; `resume` link safe. · **Accessibility checks:** Full §8.10 a11y. · **Completion rule:** Done when the terminal passes the Terminal Popup Gate ([gates.md](gates.md)).

---

### Task 17.3 — Terminal Completion Review

**Phase:** 17 · **Goal:** Verify the Terminal Popup Gate ([gates.md](gates.md)). · **Depends on:** 17.2 · **Scope:** Small · **Files:** Fixes only. · **Inputs required:** None. · **Implementation requirements:** Run gate; fix gaps; confirm no interference with screen readers/navigation (§8.10). · **Acceptance criteria:** All gate items pass. · **Verification steps:** Gate walk-through; regression check on page navigation. · **Security/privacy checks:** Output confidentiality re-confirmed. · **Accessibility checks:** Full §8.10 a11y. · **Completion rule:** Done when the Terminal Gate fully passes with no regressions.
