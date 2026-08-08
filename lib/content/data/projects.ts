/**
 * Projects content (spec §8.4, §11.3) — used by the Projects Preview section.
 *
 * Confidentiality (spec §15.4, Dependency Rule 9): all projects are
 * owner-approved for publication (`confidentialityReviewed: true`). The three Check
 * Point projects are published in generalized, public-safe form (owner sign-off):
 * the company is named per §15.3; scale is stated generically ("billions of events
 * weekly", not an exact non-public figure) to match the approved Experience wording;
 * internal processing mechanics are softened. The volunteer Students Tracking System
 * uses generalized language only — no sensitive teenager / health / risk-evaluation
 * detail (§8.4 privacy note). The portfolio website is a personal project with fully
 * public content (no workplace, no confidential material).
 *
 * Still TBD (listed, not invented):
 * - Project years (§19.6) — `year` omitted everywhere.
 * - Final project categories (§19.6) — `category` omitted everywhere.
 * - Students Tracking System backend focus (§8.4) — `backendFocus` omitted for it.
 */

import type { Project } from "../types";
import { validateProjectList } from "../validate";

const projectData = [
  {
    // §8.4 Project 1 — owner-approved; scale stated generically (not "2 Billion Events").
    name: "Microsoft & Google Event Streaming",
    role: "Project Leader",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "Built an end-to-end service that subscribes to Microsoft and Google activity APIs, receives events through webhooks, and processes and stores billions of them every week.",
    problemSolved:
      "The product needs to know what's happening inside customers' Microsoft and Google accounts. This service brings in that raw activity data reliably, at full scale.",
    techStack: ["AWS", "Python", "Docker", "Jenkins", "System Design", "Prometheus", "DevOps"],
    backendFocus: "A high-scale pipeline processing billions of events weekly",
    whyImportant:
      "These events feed the security scans that catch malicious activity.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 2 — owner-approved; public-safe product + tech-stack wording.
    name: "Email Archiving Service",
    role: "Developer in a team",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "Implemented long-term email archiving together with my team - emails stored for years and searchable in full.",
    problemSolved:
      "Companies often must keep emails for years, mainly for legal reasons. The service stores them long-term and lets users search everything - email bodies and attachments included - and import or export their archive.",
    techStack: [
      "AWS",
      "Python",
      "Docker",
      "DevOps",
      "Vector Database",
      "Apache Iceberg",
      "AWS Athena",
      "System Design",
    ],
    backendFocus: "Fast search over a huge, always-growing dataset",
    whyImportant:
      "A major product capability that helped bring in new customers.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 3 — owner-approved; internal processing mechanics softened.
    name: "Delivery Safety Net",
    role: "Project Leader",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "Implemented the system's end-to-end \"last line of defense\". When something gets stuck in the processing pipeline, this service catches it and delivers it to the customer anyway.",
    problemSolved:
      "Nothing gets lost silently - anything that fails normal processing is found and still reaches the customer.",
    techStack: [
      "AWS",
      "Python",
      "Docker",
      "Nagios",
      "Prometheus",
      "DevOps",
      "System Design",
    ],
    backendFocus:
      "Very high scale and heavily monitored - the one component that must never fail.",
    whyImportant:
      "It backs the product's promise that everything customers expect actually arrives, even when something upstream breaks.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 4 — owner-approved; Check Point IAM migration, public-safe wording.
    name: "Securing a Shared Search Platform",
    role: "Project Leader (Developer)",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "Led the migration of a shared internal search platform from open internal access to strict per-service permissions, where every request must prove who sent it - with zero downtime for the live services using it.",
    problemSolved:
      "The shared search cluster accepted requests from anything inside the network. Every service using it had to start proving its identity and be limited to exactly what it's allowed to do - without interrupting production traffic.",
    techStack: ["AWS IAM", "AWS OpenSearch", "Python", "AWS Firehose", "DevOps"],
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 5 — volunteer; owner-approved content from planning doc.
    // `backendFocus` omitted (not applicable for this project).
    name: "At-Risk Teenagers Monitoring System",
    role: "Team Leader",
    workplace: { name: "Max Impact", logo: "/logos/max-impact.png", showName: true },
    shortDescription:
      "A web app that helps a non-profit organization track and support at-risk teenage girls with eating disorders, built through volunteer work.",
    problemSolved:
      "The organization struggled to track each teenager's situation and risk level. The system made that work significantly faster and more reliable.",
    techStack: ["Bubble.io", "JavaScript", "Figma"],
    whyImportant:
      "A 100% volunteer project that solved a real-life problem for hundreds of at-risk teenagers, improving their lives in practice.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 6 — personal initiative (2023); no workplace, fully public content.
    name: "TogetherIL",
    role: "Initiator & Lead Developer",
    shortDescription:
      "A marketplace site I founded during the Iron Swords war, connecting shoppers with local businesses that were financially hurt by the war - through direct war damage, lost tourism, or owners and staff called up for reserve duty.",
    problemSolved:
      "At the start of the war, many small businesses lost income - from war damage, disappearing tourism, or reserve call-ups. Customers who wanted to support them had no easy way to find them.",
    solution:
      "Built on WordPress, the site let businesses submit their details and how they were affected; once approved, each listing went live with example products so shoppers could find and support them directly.",
    techStack: ["WordPress", "PHP", "Product Management", "Community Building"],
    whyImportant:
      "I initiated and led it with one other developer. It ran for a few weeks and connected affected businesses with supportive shoppers, until larger, better-funded competitors launched similar platforms and the project became redundant.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 7 — personal; this very website. No workplace, fully public content.
    name: "Developer Portfolio Website",
    role: "Solo Developer",
    shortDescription:
      "The site you're reading right now - my portfolio and online CV, with a custom dark developer look and subtle scroll animations.",
    problemSolved:
      "I wanted one home for my CV, experience, projects, and courses - built with real engineering care, not from a generic template.",
    solution:
      "Built from scratch with Next.js. All content lives in typed, validated data files, the UI is a small reusable design system, and every animation respects reduced-motion preferences.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "Vercel",
      "AI Development",
    ],
    whyImportant:
      "As a backend developer, building the entire frontend myself - design, animations, accessibility, performance - pushed me far outside my comfort zone and shows full-stack range.",
    confidentialityReviewed: true,
  },
] as const;

export const projects: Project[] = validateProjectList(projectData);
