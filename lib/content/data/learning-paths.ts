/**
 * Learning roadmap content (spec §8.5) — the homepage Courses section, framed as a
 * roadmap of ordered learning paths rather than a flat completion list.
 *
 * Each path is a header + a small carousel of compact course cards (image · name ·
 * category). The ordering within and across paths is deliberate (language depth →
 * networking → API design → architecture → security → AI-augmented dev → career).
 *
 * Absent-by-design (TBD — listed, never invented — §8.5, §19.7):
 * - Per-course categories: owner-supplied later. Every course uses {@link DEFAULT_CATEGORY}
 *   as a placeholder until the real categories arrive (single find-and-replace target).
 * - Course images: `image` is omitted everywhere. The UI renders a consistent gradient
 *   fallback (see `RoadmapCourseCard`) instead of a broken image.
 *
 * Note: the previously-shipped "Coding Agents Hands-on Workshop" is kept as the last course
 * of the AI-Augmented Dev path; its earlier descriptive detail was intentionally dropped here
 * (category/image to be supplied with the rest).
 */

import type { LearningPath } from "../types";
import { validateLearningPathList } from "../validate";

/** Placeholder category until the owner supplies final per-course categories (§19.7). */
const DEFAULT_CATEGORY = "General";

/** Build a roadmap course with the placeholder category (image omitted until provided). */
const course = (name: string) => ({ name, category: DEFAULT_CATEGORY });

const learningPathData = [
  {
    id: "python-foundation",
    order: 1,
    title: "Python Foundation",
    courses: [
      course("self.py"),
      course("Next.py"),
      course("Python3: Deep Dive Part 1 – Functional"),
      course("Python3: Deep Dive Part 2 – Iterators & Generators"),
      course("Python3: Deep Dive Part 3 – Dictionaries, Sets, JSON"),
      course("Python3: Deep Dive Part 4 – OOP"),
    ],
  },
  {
    id: "networking-protocols",
    order: 2,
    title: "Networking & Protocols",
    courses: [
      course("Cisco – TCP/IP & OSI Network Architecture Models"),
      course("Fundamentals of Backend Engineering"),
    ],
  },
  {
    id: "api-design",
    order: 3,
    title: "API Design",
    courses: [
      course("REST API vs GraphQL vs gRPC – The Complete Guide"),
      course("Software Architecture: REST API Design – The Complete Guide"),
    ],
  },
  {
    id: "software-architecture",
    order: 4,
    title: "Software Architecture",
    courses: [
      course("Clean Code"),
      course("SOLID Principles of OO Design and Architecture"),
      course("Microservices Architecture – The Complete Guide"),
      course("Event Driven Architecture – The Complete Guide"),
      course("The Complete Guide to Becoming a Software Architect"),
    ],
  },
  {
    id: "security",
    order: 5,
    title: "Security",
    courses: [
      course("Unlocking Information Security (Tel Aviv University)"),
      course("WEBSEC – לזהות חולשות, לבנות הגנות"),
    ],
  },
  {
    id: "ai-augmented-dev",
    order: 6,
    title: "AI-Augmented Dev",
    courses: [
      course("Intro to AI Agents and Agentic AI"),
      course("Intro to OpenAI Codex: Fully Agentic Coding"),
      course("Codex Tutorial"),
      course("Claude Code Beginner Crash Course"),
      course("Vibe Coding: AI-Driven Software Development and Testing"),
      course("Coding Agents Hands-on Workshop"),
    ],
  },
  {
    id: "career-growth",
    order: 7,
    title: "Career Growth",
    courses: [course("How to Become a Senior Developer – Beyond Coding Skills")],
  },
] as const;

export const learningPaths: LearningPath[] = validateLearningPathList(learningPathData);
