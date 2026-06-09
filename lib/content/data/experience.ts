/**
 * Experience content (spec §8.3, §11.2) — used by the Experience timeline.
 *
 * Confidentiality gating (spec §15.2/§15.4, Dependency Rule 9): every entry below
 * is owner-confirmed public-safe (`confidentialityReviewed: true`). The Check Point
 * Cloud scale metric is published in the owner-approved generic form ("over 2 billion
 * entities" — entity type deliberately unstated). Descriptions are kept short and
 * engaging per owner direction (§19.5). No previously-TBD field is invented: the
 * CVE/Protections role title (§8.3.3) and Private Tutor dates (§8.3.4) were supplied
 * by the owner.
 */

import type { Experience } from "../types";
import { validateExperienceList } from "../validate";

/**
 * Experience entries — stored current-role-first (reverse chronological);
 * final ordering is the timeline's concern (Task 6.2).
 */
const experienceData = [
  {
    // §8.3.2 — current role. Scale metric published in the owner-approved generic form.
    organization: "Check Point Software Technologies",
    organizationLogo: "/logos/check-point.svg",
    role: "Cloud Backend Software Developer",
    startDate: "2022-10",
    endDate: "Present",
    description:
      "I've been developing and owning cloud-based backend services for a large-scale email security product, designing and building multiple high-traffic systems from the ground up using Python, Docker, AWS, and modern cloud technologies. I worked closely with developers, QA, and product teams to deliver reliable solutions at scale, while leading monitoring and operational improvements across the team. Along the way, I developed deep expertise in AI-assisted and agentic development workflows. I became a go-to person for service ownership, troubleshooting, and knowledge sharing across the team.",
    confidentialityReviewed: true,
  },
  {
    // §8.3.1 — public-safe volunteer leadership; LinkedIn URL stored tracking-param-free.
    organization: "Max Impact",
    organizationType: "Non-Profit Association",
    role: "Team Leader",
    employmentType: "Volunteer",
    startDate: "2024-09",
    endDate: "2025-10",
    durationLabel: "1 year, 1 month",
    teamSize: "3–5 volunteer developers",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7305508419812126722/",
    certificate: {
      id: "max-impact-appreciation",
      title: "Certificate of Appreciation",
      viewLabel: "View Max Impact Certificate of Appreciation",
      file: "/certificates/noam-pony-certificate-of-appreciation.pdf",
    },
    description:
      "As a volunteer Team Lead at Max Impact, I led a team of junior developers in building a web platform that helps a non-profit organization provide better support for at-risk teenage girls. Beyond delivering the product, I mentored aspiring developers, helping them gain real industry experience and launch their careers, while combining technology with meaningful social impact.",
    confidentialityReviewed: true,
  },
  {
    // §8.3.4 — self-employed, public-safe. `organization` is required by the model;
    // "Self-Employed" is the honest representation of freelance work (no company invented).
    organization: "Self-Employed",
    role: "Private Tutor",
    employmentType: "Self-employed",
    startDate: "2022-02",
    endDate: "2023-03",
    durationLabel: "1 year, 1 month",
    description: "Taught private C# programming lessons to high school students.",
    confidentialityReviewed: true,
  },
  {
    // §8.3.3 — earlier Check Point role; title supplied by the owner (was §19.5 TBD).
    organization: "Check Point Software Technologies",
    organizationLogo: "/logos/check-point.svg",
    role: "Malware Analyst",
    startDate: "2021-12",
    endDate: "2022-10",
    durationLabel: "11 months",
    description:
      "Researched CVEs to reproduce attacks and build protections for Check Point's customers. Wrote Python automation to broaden protection coverage and streamline team workflows, with a focus on network attacks.",
    confidentialityReviewed: true,
  },
] as const;

export const experiences: Experience[] = validateExperienceList(experienceData);
