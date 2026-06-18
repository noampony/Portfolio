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
    name: "Microsoft & Google Events",
    role: "Project Leader",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "Developed a service that subscribes to Microsoft and Google APIs, retrieves events via webhook, processes them, and writes billions of events weekly to a database.",
    problemSolved:
      "Fetching important information from Microsoft and Google, crucial for analytics and security insights.",
    techStack: ["AWS", "Python", "Docker", "Jenkins", "System Design"],
    backendFocus: "High-scale system processing billions of events weekly",
    whyImportant:
      "The events fetched were crucial for cybersecurity scanning processes, identifying malicious operations.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 2 — owner-approved; public-safe product + tech-stack wording.
    name: "Email Archiving Service",
    role: "Developer in a team",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "Implemented a long-term email archiving solution together with my team.",
    problemSolved:
      "Users can archive their emails long-term (mainly for legal purposes), search across all email content including body and attachments, import and export emails, and more.",
    techStack: [
      "AWS",
      "Python",
      "Docker",
      "Vector Database",
      "AWS Iceberg",
      "AWS Athena",
      "System Design",
    ],
    backendFocus: "High scale, advanced search on huge data",
    whyImportant:
      "The service served a main role in the product, attracting more customers.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 3 — owner-approved; internal processing mechanics softened.
    name: "Final-Failure Watchdog",
    role: "Project Leader",
    workplace: { name: "Check Point", logo: "/logos/check-point.svg" },
    shortDescription:
      "A service acting as the final watchdog. It is responsible for identifying stuck entities in the system and quickly releasing them to the customer, bypassing normal processing flow.",
    problemSolved:
      "All stuck entities are identified and released to the customer reliably.",
    techStack: [
      "AWS",
      "Python",
      "Docker",
      "Nagios",
      "Prometheus",
      "Grafana",
    ],
    backendFocus:
      "Very high scale, high resilience, high availability, and closely monitored system",
    whyImportant:
      "This system had high product focus, giving confidence that no entity gets stuck and everything is delivered to the user.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 4 — volunteer; owner-approved content from planning doc.
    // `backendFocus` omitted (not applicable for this project).
    name: "At-Risk Teenagers Monitoring System",
    role: "Team Leader",
    workplace: { name: "Max Impact", logo: "/logos/max-impact.png", showName: true },
    shortDescription:
      "A web application for tracking and monitoring at-risk teenagers with eating disorders, developed through volunteer work for a non-profit organization.",
    problemSolved:
      "The organization had difficulty tracking and evaluating the risk level of each teenager. The system made tracking and assessment significantly more efficient.",
    techStack: ["Bubble.io", "JavaScript", "Figma"],
    whyImportant:
      "A 100% volunteer project that solved a real-life problem for hundreds of at-risk teenagers, improving their lives in practice.",
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 5 — personal; this very website. No workplace, fully public content.
    name: "Developer Portfolio Website",
    role: "Solo Developer",
    shortDescription:
      "The very site you are viewing — a personal portfolio and online CV with a custom dark developer aesthetic, content-driven sections, and subtle scroll-driven animations.",
    problemSolved:
      "Needed a single, technically-mature home for my CV, experience, projects, and courses that reflects real engineering craft rather than a generic template.",
    solution:
      "Built from scratch on the Next.js App Router with a typed, validated content layer driving every section, a reusable design system, and accessible, reduced-motion-aware animations.",
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "shadcn/ui",
      "Vercel",
    ],
    whyImportant:
      "As a backend developer, designing and building the entire frontend end-to-end — design system, animations, accessibility, and performance — stretched me well beyond my comfort zone and demonstrates full-stack range.",
    confidentialityReviewed: true,
  },
] as const;

export const projects: Project[] = validateProjectList(projectData);
