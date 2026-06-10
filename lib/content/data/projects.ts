/**
 * Projects content (spec §8.4, §11.3) — used by the Projects Preview section.
 *
 * Confidentiality gating (spec §15.4, Dependency Rule 9): the three Check Point
 * projects are `confidentialityReviewed: false` and MUST NOT render until the owner
 * confirms publishability. The volunteer Students Tracking System is owner-safe
 * (`true`) and uses generalized language only — no sensitive teenager / health /
 * risk-evaluation detail (§8.4 privacy note), mirroring the published Max Impact
 * experience entry.
 *
 * Blocked inputs (TBD — listed, not invented):
 * - Publish approval for the Check Point project names, internal behaviors, and the
 *   "2 billion events per week" scale (§19.6). Held behind the `false` flags above.
 * - Project years (§19.6) — `year` omitted everywhere.
 * - Final project categories (§19.6) — `category` omitted everywhere.
 * - Students Tracking System backend focus (§8.4) — `backendFocus` omitted for it.
 */

import type { Project } from "../types";
import { validateProjectList } from "../validate";

const projectData = [
  {
    // §8.4 Project 1 — pending publish approval for name / behavior / scale (§19.6).
    name: "Microsoft Office Events",
    role: "Project Leader",
    shortDescription:
      "Developed a service that subscribes to Microsoft and Google APIs, retrieves events via webhook, processes them, and writes billions of events weekly to a database.",
    problemSolved:
      "Fetching important information from Microsoft and Google, crucial for analytics and security insights.",
    techStack: ["AWS", "Python", "Docker", "Jenkins", "System Design"],
    backendFocus: "High-scale system, 2 billion events per week",
    whyImportant:
      "The events fetched were crucial for cybersecurity scanning processes, identifying malicious operations.",
    confidentialityReviewed: false,
  },
  {
    // §8.4 Project 2 — pending approval for product-impact wording + tech list (§19.6).
    name: "Email Archiving Service",
    role: "Developer in a team",
    shortDescription:
      "Implemented a long-term email archiving solution together with the team.",
    problemSolved:
      "Users can archive emails long-term, mainly for legal purposes, search across email information including body and attachments, import and export emails, and more.",
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
      "The service served a main role in the product and helped attract more customers.",
    confidentialityReviewed: false,
  },
  {
    // §8.4 Project 3 — pending approval for name + operational behavior (§19.6).
    name: "Final Failure-Watchdog",
    role: "Project Leader",
    shortDescription:
      "A service acting as the final watchdog. It identifies stuck entities in the system and quickly releases them to the customer by bypassing the main entity-processing flow.",
    problemSolved:
      "Stuck entities are identified and released to the customer reliably.",
    techStack: [
      "AWS",
      "Python",
      "Docker",
      "Nagios",
      "Prometheus",
      "Grafana",
    ],
    backendFocus:
      "Very high scale, high resilience, high availability, closely monitored system",
    whyImportant:
      "This system had high product focus because it helped ensure entities did not get stuck and were delivered to users.",
    confidentialityReviewed: false,
  },
  {
    // §8.4 Project 4 — volunteer; owner-safe. Generalized language only (§8.4 privacy note).
    // `backendFocus` is TBD (§8.4) and intentionally omitted.
    name: "Students Tracking System",
    role: "Team Leader",
    shortDescription:
      "A web app used for tracking and managing school activity for a non-profit organization.",
    problemSolved:
      "The organization needed a more efficient way to track and manage student progress.",
    techStack: ["Bubble.io", "JavaScript", "Figma"],
    whyImportant:
      "A fully volunteer project that solved a real-life problem for a non-profit organization supporting hundreds of students.",
    confidentialityReviewed: true,
  },
] as const;

export const projects: Project[] = validateProjectList(projectData);
