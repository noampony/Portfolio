/**
 * Minimal non-confidential fixtures used to verify the build-time validator (Task 3.2).
 * Replaced by real data modules in later tasks (e.g. Task 3.3 profile data).
 */

export const sampleProfile = {
  name: "Sample Name",
  title: "Backend Developer",
  oneLineSummary: "Sample summary for validator self-check.",
  heroText: "Sample hero line one.\nSample hero line two.",
  location: "Israel",
  yearsExperienceStartDate: "2022-10",
  technologiesCountLabel: "18+",
  coursesCountLabel: "35",
  mainFields: ["Python", "AWS"],
} as const;

export const sampleExperienceReviewed = {
  organization: "Sample Org",
  role: "Backend Developer",
  startDate: "2022-10",
  description: "Public-safe sample description for validator self-check.",
  confidentialityReviewed: true,
} as const;

export const sampleExperienceUnreviewed = {
  organization: "Pending Review Org",
  role: "Backend Developer",
  startDate: "2023-01",
  description: "Unreviewed sample entry — must be excluded from published output.",
  confidentialityReviewed: false,
} as const;

export const sampleProjectReviewed = {
  name: "Sample Project",
  role: "Developer",
  category: ["Backend"],
  shortDescription: "Sample project summary.",
  problemSolved: "Sample problem statement.",
  techStack: ["Python"],
  backendFocus: "API design",
  confidentialityReviewed: true,
} as const;

export const sampleProjectUnreviewed = {
  name: "Pending Review Project",
  role: "Developer",
  category: ["Cloud"],
  shortDescription: "Unreviewed project — must be excluded from published output.",
  problemSolved: "Sample problem statement.",
  techStack: ["AWS"],
  backendFocus: "Infrastructure",
  confidentialityReviewed: false,
} as const;
