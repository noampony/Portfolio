/**
 * My Impact content (spec §8.2, §11.1A) — the cards shown in the My Impact carousel.
 *
 * Each entry is an outcome-focused, public-safe summary of a career impact. Order
 * follows the specification (§8.2.1 → §8.2.9) via `displayOrder`; the carousel (Task
 * 5.2) is free to consume the array directly. The data is intentionally
 * presentation-agnostic — no UI logic, styling, or icons are embedded here.
 *
 * Confidentiality gating (spec §15.4, Dependency Rule 9): every card is
 * owner-confirmed public-safe (`confidentialityReviewed: true`). Wording is
 * deliberately outcome-focused and contains no internal project names, customer
 * data, architecture details, or proprietary implementation specifics (§8.2 rules).
 *
 * `icon` is omitted for every card — it is optional and TBD (§11.1A); no placeholder
 * asset is invented here.
 */

import type { Impact } from "../types";
import { validateImpactList } from "../validate";

const impactData = [
  {
    // §8.2.1
    title: "Catching Production Failures",
    description:
      "Built the last line of defense that catches and reports critical failures in production.",
    impactBullets: [
      "More reliable product",
      "Clearer picture during incidents",
      "Safer, more confident deployments",
    ],
    displayOrder: 1,
    confidentialityReviewed: true,
  },
  {
    // §8.2.2
    title: "System Architecture",
    description:
      "Designed 10+ backend systems from the ground up - architecture, documentation, planning, testing, and rollout.",
    impactBullets: [
      "Less rework and fewer late design changes",
      "Smoother path from design to delivery",
      "Higher-quality, more reliable systems",
    ],
    displayOrder: 2,
    confidentialityReviewed: true,
  },
  {
    // §8.2.3
    title: "Legacy System Modernization",
    description:
      "Refactored three legacy systems to improve code quality, reliability, and maintainability.",
    impactBullets: [
      "Cleaner, easier-to-maintain code",
      "Better monitoring and debugging",
      "More stable and scalable in production",
    ],
    displayOrder: 3,
    confidentialityReviewed: true,
  },
  {
    // §8.2.4
    title: "Supporting At-Risk Teenagers",
    description:
      "Enhanced the monitoring platform used by a non-profit organization supporting at-risk teenage girls.",
    impactBullets: [
      "3× faster monitoring and case management",
      "More reliable, easier-to-access data",
      "Helped staff reach the girls most at risk sooner",
    ],
    displayOrder: 4,
    confidentialityReviewed: true,
  },
  {
    // §8.2.5
    title: "AI Tooling for the Team",
    description:
      "Built plugins for AI coding agents that automate everyday engineering tasks - opening PRs, reviewing code, and improving unit tests.",
    impactBullets: [
      "Made AI tools easier for the whole team to use",
      "More of the team using AI in daily work",
      "Less time spent on repetitive development tasks",
    ],
    displayOrder: 5,
    confidentialityReviewed: true,
  },
  {
    // §8.2.6
    title: "Grafana Dashboards",
    description:
      "Created dozens of Grafana dashboards to monitor services, performance, and production health in real time.",
    impactBullets: [
      "Faster investigation when something breaks",
      "Clear view of production health at all times",
      "Became the team's go-to for Grafana",
    ],
    displayOrder: 6,
    confidentialityReviewed: true,
  },
  {
    // §8.2.7
    title: "Team Knowledge Base",
    description:
      "Built a central hub for services, guides, templates, and engineering knowledge.",
    impactBullets: [
      "Faster knowledge sharing across the team",
      "Easier onboarding and daily development",
      "Less time hunting for information",
    ],
    displayOrder: 7,
    confidentialityReviewed: true,
  },
  {
    // §8.2.8
    title: "Weekly Security Reports",
    description:
      "Redesigned the weekly report customers receive, making their security incidents and activity easy to understand.",
    impactBullets: [
      "Customers see clearly what the product does for them",
      "Read by technical leaders and managers alike",
      "Helped sales teams demonstrate product value",
    ],
    displayOrder: 8,
    confidentialityReviewed: true,
  },
  {
    // §8.2.9
    title: "Unlocking Microsoft 365 Data",
    description:
      "Made hundreds of Microsoft 365 event types available through a single service, turning raw data into security insight.",
    impactBullets: [
      "Powers multiple customer-facing features",
      "Enables detection of malicious email activity",
      "Opened the door to future product capabilities",
    ],
    displayOrder: 9,
    confidentialityReviewed: true,
  },
] as const;

/** Validated My Impact cards, in specification order (spec §8.2). */
export const impacts: Impact[] = validateImpactList(impactData);
