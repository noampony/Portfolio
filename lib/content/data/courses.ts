/**
 * Courses content (spec §8.5, §11.4) — used by the Courses Preview section.
 *
 * Ordered deliberately as a *learning path*, not a random completion list (§8.5
 * purpose): language depth → backend systems → engineering craft → AI-assisted
 * development. The UI frames this progression (Task 8.2).
 *
 * Absent-by-design (TBD — listed, never invented — §8.5, §19.7):
 * - Course images (all five): `courseImage` is omitted everywhere. The UI renders a
 *   consistent, non-generic fallback visual instead (Task 8.2/8.3, §8.5).
 * - Certificate links for courses 2–5: `certificateLink` is omitted (shown as
 *   "unavailable" in the UI, never as a broken link — §8.5, §10.9). Course 1's
 *   Google Drive link was access-checked on 2026-06-10 and is publicly viewable
 *   without a sign-in / "request access" wall (§10.9), so it ships live.
 *
 * ⚠️ Awaiting owner confirmation — flagged, NOT silently shipped or auto-fixed
 * (§8.5 notes, §19.7). The raw typos are obvious and must not ship as-is, but the
 * correction is a product decision reserved for the owner, so it is documented here
 * and surfaced in the task report rather than applied quietly:
 *   1. Course 4 provider — the planning template wrote "Antrophic". Recommended
 *      correction: "Anthropic" (kept as "Anthropic & Check Point"). Used here pending
 *      owner sign-off; revert if the owner intends otherwise.
 *   2. Course 5 completion date — the planning template wrote "Marc 2026".
 *      Recommended correction: "March 2026". Used here pending owner sign-off.
 *
 * Other course fields (full Courses Hub data, exact learning-path groupings, total
 * course count / total hours) remain TBD per §19.7 and are out of scope here.
 */

import type { Course } from "../types";
import { validateCourseList } from "../validate";

const courseData = [
  {
    // §8.5 Course 1 — certificate link access-checked (public Google Drive view).
    name: "Python Deep Dive (4 parts)",
    provider: "Udemy",
    category: ["Python", "Software Development"],
    completionDate: "Feb 2024",
    description:
      "Series of courses diving into the inner mechanics and complicated aspects of Python 3.",
    skillsSharpened: ["Python Programming"],
    numberOfHours: 140,
    certificateLink: "https://drive.google.com/file/d/1IQYFLg_E-U2Yoo5yci96UloToyTasQcZ/view",
  },
  {
    // §8.5 Course 2 — certificate link TBD (omitted → shown unavailable).
    name: "Fundamentals of Backend Engineering",
    provider: "Udemy",
    category: ["Backend Development"],
    completionDate: "April 2024",
    description:
      "Intermediate-to-advanced backend engineering course covering core client-server communication patterns, transport/application protocols, connection handling, request parsing, and backend execution models.",
    skillsSharpened: [
      "Client-server communication",
      "Backend optimization",
      "Scalability",
      "Concurrency",
      "Execution models",
    ],
    numberOfHours: 16,
  },
  {
    // §8.5 Course 3 — certificate link TBD (omitted → shown unavailable).
    name: "Clean Code",
    provider: "Udemy",
    category: ["Python", "Software Development"],
    completionDate: "May 2024",
    description:
      "Clean Code course focused on writing readable, maintainable, and well-structured code through effective naming, formatting, function design, error handling, class cohesion, and SOLID principles.",
    skillsSharpened: ["Code readability", "Abstraction", "DRY principles", "Maintainability"],
    numberOfHours: 16,
  },
  {
    // §8.5 Course 4 — provider spelling awaiting owner confirmation (see file header).
    // certificate link TBD (omitted → shown unavailable).
    name: "Coding Agents Hands-on Workshop",
    provider: "Anthropic & Check Point",
    category: ["Generative AI"],
    completionDate: "June 2026",
    description:
      "Workshop on working effectively with coding agents, focusing on context management, token efficiency, structured development workflows, and automation.",
    skillsSharpened: [
      "AI-assisted development",
      "Context management",
      "Token efficiency",
      "Prompt engineering",
    ],
    numberOfHours: 9,
  },
  {
    // §8.5 Course 5 — completion date awaiting owner confirmation (see file header).
    // certificate link TBD (omitted → shown unavailable).
    name: "Claude Code Beginner Crash Course",
    provider: "Udemy",
    category: ["Generative AI"],
    completionDate: "March 2026",
    description:
      "Claude Code crash course focused on building secure, context-aware, and automated AI-assisted development workflows using terminal commands, IDE integration, persistent memory, hooks, and sub-agents.",
    skillsSharpened: ["Context engineering", "AI-assisted development", "Token efficiency"],
    numberOfHours: 8.5,
  },
] as const;

export const courses: Course[] = validateCourseList(courseData);
