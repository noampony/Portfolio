/**
 * Content model types (spec §11.1–§11.9).
 *
 * Required vs optional fields mirror the spec tables exactly. Optional fields
 * use `?` so TBD content is representable as absent — never as empty strings
 * rendered in the UI.
 */

/** ISO year-month date string (e.g. `2022-10`). */
export type YearMonthDate = string;

/** Asset path or source reference in the repo or public folder. */
export type AssetReference = string;

/** Experience end date — a year-month or the literal `Present`. */
export type ExperienceEndDate = YearMonthDate | "Present";

/** §11.1 Profile Model */
export type Profile = {
  name: string;
  title: string;
  shortTagline?: string;
  oneLineSummary: string;
  heroText: string;
  location: string;
  /** Not used — owner prefers `Israel` only; kept optional for spec parity. */
  city?: string;
  profileImage?: AssetReference;
  logo?: AssetReference;
  yearsExperienceStartDate: YearMonthDate;
  projectsCountLabel?: string;
  technologiesCountLabel: string;
  coursesCountLabel: string;
  certificatesCountLabel?: string;
  mainFields: string[];
};

/** Known About stats only; TBD stats stay absent until owner-confirmed. */
export type AboutStats = {
  yearsExperienceCountLabel: string;
  coursesCountLabel: string;
  technologiesCountLabel: string;
  projectsCountLabel?: string;
  certificatesCountLabel?: string;
};

/** Education certificate reference for the About section viewer (file wired later). */
export type EducationCertificateRef = {
  id: string;
  title: string;
  viewLabel: string;
  file?: AssetReference;
};

/** Education highlight shown in the About section. */
export type AboutEducation = {
  dateRange: string;
  degree: string;
  institution: string;
  /** Optional institution logo (served from `/public`). */
  institutionLogo?: AssetReference;
  summary: string;
  honor?: string;
  degreeCertificate: EducationCertificateRef;
  honorCertificate?: EducationCertificateRef;
};

/** About section data (spec §8.2). */
export type AboutSectionData = {
  professionalSummary: string;
  yearsExperienceStartDate: YearMonthDate;
  stats: AboutStats;
  mainFields: string[];
  education: AboutEducation;
  professionalFocus?: string;
};

/** §11.2 Experience Model */
export type Experience = {
  organization: string;
  organizationType?: string;
  /** Optional organization logo (served from `/public`). */
  organizationLogo?: AssetReference;
  role: string;
  employmentType?: string;
  startDate: YearMonthDate;
  endDate?: ExperienceEndDate;
  durationLabel?: string;
  description: string;
  technologies?: string[];
  teamSize?: string;
  link?: string;
  screenshots?: AssetReference[];
  /** Optional certificate shown in the in-page viewer (e.g. a Certificate of Appreciation). */
  certificate?: EducationCertificateRef;
  /** Whether content has been reviewed for public sharing (§15.4). */
  confidentialityReviewed: boolean;
};

/** §11.3 Project Model */
export type Project = {
  name: string;
  role: string;
  /** Optional — the organisation where this project was built. */
  workplace?: {
    name: string;
    /** Logo path served from `/public` (e.g. `/logos/check-point.svg`). */
    logo: AssetReference;
    /** When true, renders the name text alongside the logo. */
    showName?: boolean;
  };
  year?: string | number;
  /** Optional — final categories are TBD (§19.6); omitted until owner-confirmed. */
  category?: string[];
  shortDescription: string;
  problemSolved: string;
  solution?: string;
  techStack: string[];
  /** Optional — TBD for some entries (e.g. Students Tracking System, §8.4); omitted when absent. */
  backendFocus?: string;
  whyImportant?: string;
  architecture?: string;
  database?: string[];
  securityConsiderations?: string;
  challenges?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  screenshots?: AssetReference[];
  isFeatured?: boolean;
  /** Whether content is safe for publication (§15.4). */
  confidentialityReviewed: boolean;
};

/** §11.4 Course Model */
export type Course = {
  name: string;
  provider: string;
  category: string[];
  completionDate: string | YearMonthDate;
  description: string;
  skillsSharpened: string[];
  numberOfHours?: number;
  certificateLink?: string;
  certificatePdfFile?: AssetReference;
  courseImage?: AssetReference;
  mainTopics?: string[];
  whyITookIt?: string;
  whatILearned?: string;
  relatedProjects?: string[];
  isFeatured?: boolean;
};

/**
 * Learning-path roadmap models (spec §8.5) — the compact homepage roadmap that
 * groups courses into ordered paths, each rendered as a header + small carousel.
 *
 * Deliberately lighter than {@link Course}: a roadmap card shows only an image,
 * name, and category. Categories and images are owner-supplied later (§19.7), so
 * `category` carries a placeholder default and `image` is omitted until provided.
 */

/** A single course shown as a compact roadmap card. */
export type RoadmapCourse = {
  name: string;
  /** Placeholder default until the owner supplies final categories (§19.7). */
  category: string;
  /** Optional; served from `/public`. Falls back to a gradient visual until provided. */
  image?: AssetReference;
};

/** An ordered group of related courses (a roadmap "path"). */
export type LearningPath = {
  /** Stable slug for React keys / aria, e.g. `python-foundation`. */
  id: string;
  /** 1-based position in the roadmap. */
  order: number;
  title: string;
  courses: RoadmapCourse[];
};

/** §11.5 Skill Model */
export type Skill = {
  name: string;
  category: string;
  notes?: string;
  icon?: AssetReference;
  proficiency?: string;
  displayOrder?: number;
};

/** §11.6 Resume Model */
export type Resume = {
  fileName: string;
  repoPath: string;
  publicUrl: string;
  lastUpdated?: YearMonthDate;
  downloadButtonText: string;
  previewEnabled: boolean;
  highlights?: string[];
};

/** §11.7 Contact Model */
export type Contact = {
  heading: string;
  message: string;
  email: string;
  linkedIn: string;
  phone: string;
  location: string;
  preferredContactMethod: string;
  contactFormEnabled: boolean;
};

/** §11.8 Social Link Model */
export type SocialLink = {
  label: string;
  url: string;
  icon?: AssetReference;
  openInNewTab: boolean;
};

/** §11.9 Terminal Command Model */
export type TerminalCommand = {
  command: string;
  description: string;
  output: string;
  aliases?: string[];
  isHidden?: boolean;
  requiresLink?: boolean;
};
