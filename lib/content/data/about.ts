/**
 * About section content (spec §8.2).
 *
 * Product TBDs are intentionally absent: project count, certificate subset
 * count, and current professional focus.
 */

import type { AboutSectionData } from "../types";
import { validateAboutSectionData } from "../validate";
import { profile } from "./profile";

function calculateFullYearsSince(startDate: string, currentDate = new Date()): number {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (!startYear || !startMonth) {
    return 0;
  }

  const yearDelta = currentYear - startYear;
  const hasReachedStartMonth = currentMonth >= startMonth;

  return Math.max(0, hasReachedStartMonth ? yearDelta : yearDelta - 1);
}

function formatYearsExperience(years: number): string {
  return years === 1 ? "1 year" : `${years} years`;
}

const yearsExperienceCountLabel = String(
  calculateFullYearsSince(profile.yearsExperienceStartDate),
);
const yearsExperienceText = formatYearsExperience(Number(yearsExperienceCountLabel));

const aboutData = {
  professionalSummary:
    `Experienced cloud backend software developer with a degree in Computer Science and ` +
    `${yearsExperienceText} of hands-on experience and 35 professional courses during my role ` +
    "as a software developer to continuously enhance my technical and soft skills.",
  yearsExperienceStartDate: profile.yearsExperienceStartDate,
  stats: {
    yearsExperienceCountLabel,
    coursesCountLabel: profile.coursesCountLabel,
    technologiesCountLabel: profile.technologiesCountLabel,
  },
  mainFields: profile.mainFields,
} as const;

export const about: AboutSectionData = validateAboutSectionData(aboutData);
