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
    title: "Team Knowledge Base",
    description:
      "Built a central hub for services, guides, templates, and engineering knowledge.",
    impactBullets: [
      "Faster knowledge sharing across the team",
      "Easier onboarding and daily development",
      "Less time searching for information",
    ],
    displayOrder: 1,
    confidentialityReviewed: true,
  },
  {
    // §8.2.2
    title: "AI Agent Skills",
    description:
      "Created AI Agent plugins that simplify everyday engineering tasks, including PR creation, code reviews, and unit test improvements.",
    impactBullets: [
      "Made AI tools easier to use across the team",
      "Increased adoption of AI for daily engineering work",
      "Reduced effort for repetitive development tasks",
    ],
    displayOrder: 2,
    confidentialityReviewed: true,
  },
  {
    // §8.2.3
    title: "Crisis Scenario Management",
    description:
      "Designed and built the final safety layer that detects and reports critical production scenarios.",
    impactBullets: [
      "Improved product reliability",
      "Better visibility during incidents",
      "Greater confidence in production deployments",
    ],
    displayOrder: 3,
    confidentialityReviewed: true,
  },
  {
    // §8.2.4
    title: "Revealed Valuable Data Mine",
    description:
      "Exposed hundreds of Microsoft 365 event types through a single service, unlocking valuable security insights.",
    impactBullets: [
      "Powered multiple customer-facing features",
      "Enabled detection of malicious email activity",
      "Opened the door for many future product capabilities",
    ],
    displayOrder: 4,
    confidentialityReviewed: true,
  },
  {
    // §8.2.5
    title: "Weekly Security Reports",
    description:
      "Redesigned the weekly customer report to provide clearer insights into customers' security incidents and activity.",
    impactBullets: [
      "Increased transparency for customers",
      "Became valuable for technical leaders and managers",
      "Helped sales teams demonstrate product value",
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
      "Faster issue investigation",
      "Better operational visibility",
      "Became the team's Grafana expert",
    ],
    displayOrder: 6,
    confidentialityReviewed: true,
  },
  {
    // §8.2.7
    title: "System Architecture",
    description:
      "Designed 10+ backend systems from the ground up, including architecture, documentation, planning, testing, and implementation strategy.",
    impactBullets: [
      "Reduced rework and design changes",
      "Smoother development process",
      "Higher-quality, more reliable systems",
    ],
    displayOrder: 7,
    confidentialityReviewed: true,
  },
  {
    // §8.2.8
    title: "Legacy System Modernization",
    description:
      "Refactored three legacy systems to improve code quality, reliability, and maintainability.",
    impactBullets: [
      "Cleaner and easier-to-maintain code",
      "Better monitoring and debugging",
      "Improved scalability and production stability",
    ],
    displayOrder: 8,
    confidentialityReviewed: true,
  },
  {
    // §8.2.9
    title: "Supporting At-Risk Teenagers",
    description:
      "Enhanced the monitoring platform used by a non-profit organization supporting at-risk teenage girls.",
    impactBullets: [
      "3× faster monitoring and case management",
      "More reliable and accessible data",
      "Helped teams respond sooner to girls at higher risk",
      "Contributed to improving the safety and well-being of vulnerable teenagers",
    ],
    displayOrder: 9,
    confidentialityReviewed: true,
  },
] as const;

/** Validated My Impact cards, in specification order (spec §8.2). */
export const impacts: Impact[] = validateImpactList(impactData);
