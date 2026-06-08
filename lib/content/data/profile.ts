/**
 * Profile content (spec §8.1, §8.2, §11.1) — used by Hero, About, and Contact.
 *
 * TBD fields (logo, shortTagline, projectsCountLabel, certificatesCountLabel,
 * city) are intentionally omitted.
 */

import type { Profile } from "../types";
import { validateProfile } from "../validate";

const profileData = {
  name: "Noam Pony",
  title: "Backend Developer",
  oneLineSummary: "A passionate experienced cloud backend developer",
  heroText:
    "A passionate experienced cloud backend developer.\nBuilding scalable & reliable cloud backend systems.",
  location: "Israel",
  profileImage: "/profile.png",
  yearsExperienceStartDate: "2022-10",
  technologiesCountLabel: "18+",
  coursesCountLabel: "35",
  mainFields: [
    "Backend Development",
    "Python",
    "Cloud / AWS",
    "Generative AI",
    "Agentic AI",
    "Databases",
    "Docker",
    "CI/CD",
    "DevOps",
    "System Design",
    "Cybersecurity",
  ],
} as const;

export const profile: Profile = validateProfile(profileData);
