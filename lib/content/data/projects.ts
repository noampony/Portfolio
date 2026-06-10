/**
 * Projects content (spec §8.4, §11.3) — used by the Projects Preview section.
 *
 * Confidentiality (spec §15.4, Dependency Rule 9): all four projects are
 * owner-approved for publication (`confidentialityReviewed: true`). The three Check
 * Point projects are published in generalized, public-safe form (owner sign-off):
 * the company is named per §15.3; scale is stated generically ("billions of events
 * weekly", not an exact non-public figure) to match the approved Experience wording;
 * internal processing mechanics are softened. The volunteer Students Tracking System
 * uses generalized language only — no sensitive teenager / health / risk-evaluation
 * detail (§8.4 privacy note).
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
    // §8.4 Project 1 — owner-approved; scale stated generically (was "2 billion/week").
    name: "Microsoft Office Events",
    role: "Project Leader",
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
    confidentialityReviewed: true,
  },
  {
    // §8.4 Project 3 — owner-approved; internal processing mechanics softened.
    name: "Final Failure-Watchdog",
    role: "Project Leader",
    shortDescription:
      "A service acting as the final watchdog. It identifies stuck entities in the system and reliably releases them so they reach the customer without delay.",
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
    confidentialityReviewed: true,
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
