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
 *
 * Course images are owner-supplied (§19.7), served from `/public/courses`: each is the cover
 * the owner exported from the Notion "Courses List", renamed to a stable slug. A course without
 * an `image` falls back to the card's gradient (see `RoadmapCourseCard`), never a broken image.
 *
 * Note: "Coding Agents Hands-on Workshop" is kept as the last course of the AI-Augmented Dev path.
 */

import type { LearningPath } from "../types";
import { validateLearningPathList } from "../validate";

/** Placeholder category until the owner supplies final per-course categories (§19.7). */
const DEFAULT_CATEGORY = "General";

/**
 * Build a roadmap course with the placeholder category. Pass `image` — a path under
 * `/public` (e.g. `/courses/clean-code.png`) — once the owner supplies the course art;
 * courses without an image fall back to the card's gradient visual.
 */
const course = (name: string, image?: string) => ({
  name,
  category: DEFAULT_CATEGORY,
  ...(image ? { image } : {}),
});

const learningPathData = [
  {
    id: "python-foundation",
    order: 1,
    title: "Python Foundation",
    courses: [
      course("self.py", "/courses/self-py.png"),
      course("Next.py", "/courses/next-py.png"),
      course("Python3: Deep Dive Part 1 – Functional", "/courses/python-deep-dive-1.png"),
      course(
        "Python3: Deep Dive Part 2 – Iterators & Generators",
        "/courses/python-deep-dive-2.png",
      ),
      course(
        "Python3: Deep Dive Part 3 – Dictionaries, Sets, JSON",
        "/courses/python-deep-dive-3.png",
      ),
      course("Python3: Deep Dive Part 4 – OOP", "/courses/python-deep-dive-4.png"),
    ],
  },
  {
    id: "networking-protocols",
    order: 2,
    title: "Networking & Protocols",
    courses: [
      course("Cisco – TCP/IP & OSI Network Architecture Models", "/courses/cisco-tcpip-osi.png"),
      course("Fundamentals of Backend Engineering", "/courses/backend-fundamentals.png"),
    ],
  },
  {
    id: "api-design",
    order: 3,
    title: "API Design",
    courses: [
      course("REST API vs GraphQL vs gRPC – The Complete Guide", "/courses/rest-graphql-grpc.png"),
      course(
        "Software Architecture: REST API Design – The Complete Guide",
        "/courses/rest-api-design.png",
      ),
    ],
  },
  {
    id: "software-architecture",
    order: 4,
    title: "Software Architecture",
    courses: [
      course("Clean Code", "/courses/clean-code.png"),
      course("SOLID Principles of OO Design and Architecture", "/courses/solid-principles.png"),
      course(
        "Microservices Architecture – The Complete Guide",
        "/courses/microservices-architecture.png",
      ),
      course(
        "Event Driven Architecture – The Complete Guide",
        "/courses/event-driven-architecture.png",
      ),
      course(
        "The Complete Guide to Becoming a Software Architect",
        "/courses/becoming-software-architect.png",
      ),
      course("AWS Lambda Deep Dive", "/courses/aws-lambda-deep-dive.webp"),
    ],
  },
  {
    id: "security",
    order: 5,
    title: "Security",
    courses: [
      course(
        "Unlocking Information Security (Tel Aviv University)",
        "/courses/unlocking-information-security.webp",
      ),
      course("WEBSEC - Mitigating Vulnerabilities", "/courses/websec.png"),
    ],
  },
  {
    id: "ai-augmented-dev",
    order: 6,
    title: "AI-Augmented Dev",
    courses: [
      course(
        "The complete prompt engineering AI bootcamp",
        "/courses/prompt-engineering-bootcamp.png",
      ),
      course("Intro to AI Agents and Agentic AI", "/courses/intro-ai-agents.png"),
      course("Intro to OpenAI Codex: Fully Agentic Coding", "/courses/intro-openai-codex.png"),
      course("Codex Tutorial", "/courses/codex-tutorial.png"),
      course("Claude Code Beginner Crash Course", "/courses/claude-code-crash-course.png"),
      course("Claude Code Online Workshop", "/courses/claude-code-online-workshop.png"),
      course("Claude Code - The Practical Guide", "/courses/claude-code-practical-guide.png"),
      course(
        "Vibe Coding: AI-Driven Software Development and Testing",
        "/courses/vibe-coding.png",
      ),
      course(
        "Vibe Coding Bootcamp: Build Any App, Game or Website with AI",
        "/courses/vibe-coding-bootcamp.png",
      ),
      course("Coding Agents Hands-on Workshop", "/courses/coding-agents-workshop.png"),
    ],
  },
  {
    id: "career-growth",
    order: 7,
    title: "Career Growth",
    courses: [
      course(
        "How to Become a Senior Developer – Beyond Coding Skills",
        "/courses/become-senior-developer.png",
      ),
    ],
  },
] as const;

export const learningPaths: LearningPath[] = validateLearningPathList(learningPathData);
