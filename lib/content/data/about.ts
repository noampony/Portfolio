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

const yearsExperienceCountLabel = String(
  calculateFullYearsSince(profile.yearsExperienceStartDate),
);

const aboutData = {
  professionalSummary:
    "I'm a cloud backend engineer specializing in extreme-scale, real-time systems on AWS. " +
    "At Check Point I've built microservices from the ground up that process billions of entities a week.\n\n" +
    "I'm driven by continuous learning - 35+ professional courses - and by mentoring others, " +
    "including a year leading a developers team as a volunteer.\n\n" +
    "I build systems that work: fast, reliable, and scalable.",
  yearsExperienceStartDate: profile.yearsExperienceStartDate,
  stats: {
    yearsExperienceCountLabel,
    coursesCountLabel: profile.coursesCountLabel,
    technologiesCountLabel: profile.technologiesCountLabel,
  },
  mainFields: profile.mainFields,
  education: {
    dateRange: "Oct 2019 – Oct 2023",
    degree: "B.Sc. Computer Science",
    institution: "The Academic College Of Tel Aviv – Yaffo",
    honor: "Included in Dean's List",
    summary:
      "Focused on backend systems, Python, and cybersecurity throughout my degree, " +
      "while also completing professional courses outside the academy during this time.",
    degreeCertificate: {
      id: "bsc-degree",
      title: "B.Sc. Computer Science",
      viewLabel: "View degree certificate",
      file: "/certificates/noam-pony-graduation-certificate.pdf",
    },
    honorCertificate: {
      id: "deans-list",
      title: "Dean's List",
      viewLabel: "View Dean's List certificate",
      file: "/certificates/noam-pony-deans-list-certificate.pdf",
    },
  },
} as const;

export const about: AboutSectionData = validateAboutSectionData(aboutData);
