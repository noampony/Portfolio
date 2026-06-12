/**
 * Build/dev-time content validation (spec §12.5).
 *
 * Plain TypeScript — no external schema library. Missing required fields throw
 * {@link ContentValidationError}; optional fields are omitted when absent.
 */

import type {
  AboutEducation,
  AboutSectionData,
  AboutStats,
  Contact,
  Course,
  EducationCertificateRef,
  Experience,
  ExperienceEndDate,
  LearningPath,
  Profile,
  Project,
  Resume,
  Skill,
  SocialLink,
  TerminalCommand,
  YearMonthDate,
} from "./types";

export class ContentValidationError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`Content validation failed at ${path}: ${message}`);
    this.name = "ContentValidationError";
    this.path = path;
  }
}

const FORBIDDEN_YEARS_PLACEHOLDER = `X ${"years"}`;
const FORBIDDEN_PROJECTS_PLACEHOLDER = `10${"+"}`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertObject(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ContentValidationError(path, "expected an object");
  }
  return value;
}

function assertRequiredString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ContentValidationError(path, "required non-empty string");
  }
  return value;
}

function assertOptionalString(value: unknown, path: string): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim() === "") {
    throw new ContentValidationError(path, "optional string must be omitted or a non-empty string");
  }
  return value;
}

function assertRequiredBoolean(value: unknown, path: string): boolean {
  if (typeof value !== "boolean") {
    throw new ContentValidationError(path, "required boolean");
  }
  return value;
}

function assertOptionalBoolean(value: unknown, path: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "boolean") {
    throw new ContentValidationError(path, "optional boolean must be omitted or a boolean");
  }
  return value;
}

function assertRequiredNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ContentValidationError(path, "required finite number");
  }
  return value;
}

function assertOptionalNumber(value: unknown, path: string): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ContentValidationError(path, "optional number must be omitted or a finite number");
  }
  return value;
}

function assertRequiredStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) {
    throw new ContentValidationError(path, "required array of strings");
  }
  return value.map((item, index) => assertRequiredString(item, `${path}[${index}]`));
}

function assertNoForbiddenToken(value: string, path: string, token: string): void {
  if (value.includes(token)) {
    throw new ContentValidationError(path, `must not include ${token}`);
  }
}

function assertOptionalStringArray(value: unknown, path: string): string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  return assertRequiredStringArray(value, path);
}

function assertYearMonthDate(value: unknown, path: string): YearMonthDate {
  const date = assertRequiredString(value, path);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(date)) {
    throw new ContentValidationError(path, "expected ISO year-month date (YYYY-MM)");
  }
  return date;
}

function assertOptionalYearMonthDate(value: unknown, path: string): YearMonthDate | undefined {
  if (value === undefined) {
    return undefined;
  }
  return assertYearMonthDate(value, path);
}

function assertExperienceEndDate(value: unknown, path: string): ExperienceEndDate | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === "Present") {
    return value;
  }
  return assertYearMonthDate(value, path);
}

function assertOptionalYearOrNumber(value: unknown, path: string): string | number | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }
  throw new ContentValidationError(path, "optional year must be omitted, a string, or a number");
}

function assertCompletionDate(value: unknown, path: string): string | YearMonthDate {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ContentValidationError(path, "required completion date string");
  }
  return value;
}

/** Omit keys whose values are `undefined` so optional fields stay absent in output. */
function omitUndefined<T extends Record<string, unknown>>(value: T): T {
  const result = {} as T;
  for (const [key, fieldValue] of Object.entries(value)) {
    if (fieldValue !== undefined) {
      result[key as keyof T] = fieldValue as T[keyof T];
    }
  }
  return result;
}

/** §11.1 Profile */
export function validateProfile(data: unknown): Profile {
  const path = "Profile";
  const raw = assertObject(data, path);

  return omitUndefined({
    name: assertRequiredString(raw.name, `${path}.name`),
    title: assertRequiredString(raw.title, `${path}.title`),
    shortTagline: assertOptionalString(raw.shortTagline, `${path}.shortTagline`),
    oneLineSummary: assertRequiredString(raw.oneLineSummary, `${path}.oneLineSummary`),
    heroText: assertRequiredString(raw.heroText, `${path}.heroText`),
    location: assertRequiredString(raw.location, `${path}.location`),
    city: assertOptionalString(raw.city, `${path}.city`),
    profileImage: assertOptionalString(raw.profileImage, `${path}.profileImage`),
    logo: assertOptionalString(raw.logo, `${path}.logo`),
    yearsExperienceStartDate: assertYearMonthDate(
      raw.yearsExperienceStartDate,
      `${path}.yearsExperienceStartDate`,
    ),
    projectsCountLabel: assertOptionalString(raw.projectsCountLabel, `${path}.projectsCountLabel`),
    technologiesCountLabel: assertRequiredString(
      raw.technologiesCountLabel,
      `${path}.technologiesCountLabel`,
    ),
    coursesCountLabel: assertRequiredString(raw.coursesCountLabel, `${path}.coursesCountLabel`),
    certificatesCountLabel: assertOptionalString(
      raw.certificatesCountLabel,
      `${path}.certificatesCountLabel`,
    ),
    mainFields: assertRequiredStringArray(raw.mainFields, `${path}.mainFields`),
  });
}

function validateAboutStats(value: unknown, path: string): AboutStats {
  const raw = assertObject(value, path);
  const yearsExperienceCountLabel = assertRequiredString(
    raw.yearsExperienceCountLabel,
    `${path}.yearsExperienceCountLabel`,
  );
  const coursesCountLabel = assertRequiredString(raw.coursesCountLabel, `${path}.coursesCountLabel`);
  const technologiesCountLabel = assertRequiredString(
    raw.technologiesCountLabel,
    `${path}.technologiesCountLabel`,
  );
  const projectsCountLabel = assertOptionalString(raw.projectsCountLabel, `${path}.projectsCountLabel`);
  const certificatesCountLabel = assertOptionalString(
    raw.certificatesCountLabel,
    `${path}.certificatesCountLabel`,
  );

  if (coursesCountLabel !== "35") {
    throw new ContentValidationError(`${path}.coursesCountLabel`, "must remain 35 per C3 rules");
  }
  if (technologiesCountLabel !== "18+") {
    throw new ContentValidationError(
      `${path}.technologiesCountLabel`,
      "must remain 18+ per spec §8.2",
    );
  }
  for (const [key, label] of Object.entries({
    yearsExperienceCountLabel,
    coursesCountLabel,
    technologiesCountLabel,
    projectsCountLabel,
    certificatesCountLabel,
  })) {
    if (label !== undefined) {
      assertNoForbiddenToken(label, `${path}.${key}`, FORBIDDEN_YEARS_PLACEHOLDER);
      assertNoForbiddenToken(label, `${path}.${key}`, FORBIDDEN_PROJECTS_PLACEHOLDER);
    }
  }

  return omitUndefined({
    yearsExperienceCountLabel,
    coursesCountLabel,
    technologiesCountLabel,
    projectsCountLabel,
    certificatesCountLabel,
  });
}

function validateEducationCertificateRef(
  value: unknown,
  path: string,
): EducationCertificateRef {
  const raw = assertObject(value, path);

  return omitUndefined({
    id: assertRequiredString(raw.id, `${path}.id`),
    title: assertRequiredString(raw.title, `${path}.title`),
    viewLabel: assertRequiredString(raw.viewLabel, `${path}.viewLabel`),
    file: assertOptionalString(raw.file, `${path}.file`),
  });
}

function validateAboutEducation(value: unknown, path: string): AboutEducation {
  const raw = assertObject(value, path);
  const honor = assertOptionalString(raw.honor, `${path}.honor`);

  return omitUndefined({
    dateRange: assertRequiredString(raw.dateRange, `${path}.dateRange`),
    degree: assertRequiredString(raw.degree, `${path}.degree`),
    institution: assertRequiredString(raw.institution, `${path}.institution`),
    institutionLogo: assertOptionalString(raw.institutionLogo, `${path}.institutionLogo`),
    summary: assertRequiredString(raw.summary, `${path}.summary`),
    honor,
    degreeCertificate: validateEducationCertificateRef(
      raw.degreeCertificate,
      `${path}.degreeCertificate`,
    ),
    honorCertificate:
      raw.honorCertificate === undefined
        ? undefined
        : validateEducationCertificateRef(raw.honorCertificate, `${path}.honorCertificate`),
  });
}

/** About section data (spec §8.2). */
export function validateAboutSectionData(data: unknown): AboutSectionData {
  const path = "AboutSectionData";
  const raw = assertObject(data, path);
  const professionalSummary = assertRequiredString(
    raw.professionalSummary,
    `${path}.professionalSummary`,
  );

  assertNoForbiddenToken(
    professionalSummary,
    `${path}.professionalSummary`,
    FORBIDDEN_YEARS_PLACEHOLDER,
  );
  assertNoForbiddenToken(
    professionalSummary,
    `${path}.professionalSummary`,
    FORBIDDEN_PROJECTS_PLACEHOLDER,
  );

  return omitUndefined({
    professionalSummary,
    yearsExperienceStartDate: assertYearMonthDate(
      raw.yearsExperienceStartDate,
      `${path}.yearsExperienceStartDate`,
    ),
    stats: validateAboutStats(raw.stats, `${path}.stats`),
    mainFields: assertRequiredStringArray(raw.mainFields, `${path}.mainFields`),
    education: validateAboutEducation(raw.education, `${path}.education`),
    professionalFocus: assertOptionalString(raw.professionalFocus, `${path}.professionalFocus`),
  });
}

/** §11.2 Experience */
export function validateExperience(data: unknown): Experience {
  const path = "Experience";
  const raw = assertObject(data, path);

  return omitUndefined({
    organization: assertRequiredString(raw.organization, `${path}.organization`),
    organizationType: assertOptionalString(raw.organizationType, `${path}.organizationType`),
    organizationLogo: assertOptionalString(raw.organizationLogo, `${path}.organizationLogo`),
    role: assertRequiredString(raw.role, `${path}.role`),
    employmentType: assertOptionalString(raw.employmentType, `${path}.employmentType`),
    startDate: assertYearMonthDate(raw.startDate, `${path}.startDate`),
    endDate: assertExperienceEndDate(raw.endDate, `${path}.endDate`),
    durationLabel: assertOptionalString(raw.durationLabel, `${path}.durationLabel`),
    description: assertRequiredString(raw.description, `${path}.description`),
    technologies: assertOptionalStringArray(raw.technologies, `${path}.technologies`),
    teamSize: assertOptionalString(raw.teamSize, `${path}.teamSize`),
    link: assertOptionalString(raw.link, `${path}.link`),
    screenshots: assertOptionalStringArray(raw.screenshots, `${path}.screenshots`),
    certificate:
      raw.certificate === undefined
        ? undefined
        : validateEducationCertificateRef(raw.certificate, `${path}.certificate`),
    confidentialityReviewed: assertRequiredBoolean(
      raw.confidentialityReviewed,
      `${path}.confidentialityReviewed`,
    ),
  });
}

/** §11.3 Project */
export function validateProject(data: unknown): Project {
  const path = "Project";
  const raw = assertObject(data, path);

  return omitUndefined({
    name: assertRequiredString(raw.name, `${path}.name`),
    role: assertRequiredString(raw.role, `${path}.role`),
    year: assertOptionalYearOrNumber(raw.year, `${path}.year`),
    category: assertOptionalStringArray(raw.category, `${path}.category`),
    shortDescription: assertRequiredString(raw.shortDescription, `${path}.shortDescription`),
    problemSolved: assertRequiredString(raw.problemSolved, `${path}.problemSolved`),
    solution: assertOptionalString(raw.solution, `${path}.solution`),
    techStack: assertRequiredStringArray(raw.techStack, `${path}.techStack`),
    backendFocus: assertOptionalString(raw.backendFocus, `${path}.backendFocus`),
    whyImportant: assertOptionalString(raw.whyImportant, `${path}.whyImportant`),
    architecture: assertOptionalString(raw.architecture, `${path}.architecture`),
    database: assertOptionalStringArray(raw.database, `${path}.database`),
    securityConsiderations: assertOptionalString(
      raw.securityConsiderations,
      `${path}.securityConsiderations`,
    ),
    challenges: assertOptionalString(raw.challenges, `${path}.challenges`),
    githubUrl: assertOptionalString(raw.githubUrl, `${path}.githubUrl`),
    liveDemoUrl: assertOptionalString(raw.liveDemoUrl, `${path}.liveDemoUrl`),
    screenshots: assertOptionalStringArray(raw.screenshots, `${path}.screenshots`),
    isFeatured: assertOptionalBoolean(raw.isFeatured, `${path}.isFeatured`),
    workplace: (() => {
      if (raw.workplace == null) return undefined;
      const wp = assertObject(raw.workplace, `${path}.workplace`);
      return {
        name: assertRequiredString(wp.name, `${path}.workplace.name`),
        logo: assertRequiredString(wp.logo, `${path}.workplace.logo`),
        showName: assertOptionalBoolean(wp.showName, `${path}.workplace.showName`),
      };
    })(),
    confidentialityReviewed: assertRequiredBoolean(
      raw.confidentialityReviewed,
      `${path}.confidentialityReviewed`,
    ),
  });
}

/** §11.4 Course */
export function validateCourse(data: unknown): Course {
  const path = "Course";
  const raw = assertObject(data, path);

  return omitUndefined({
    name: assertRequiredString(raw.name, `${path}.name`),
    provider: assertRequiredString(raw.provider, `${path}.provider`),
    category: assertRequiredStringArray(raw.category, `${path}.category`),
    completionDate: assertCompletionDate(raw.completionDate, `${path}.completionDate`),
    description: assertRequiredString(raw.description, `${path}.description`),
    skillsSharpened: assertRequiredStringArray(raw.skillsSharpened, `${path}.skillsSharpened`),
    numberOfHours: assertOptionalNumber(raw.numberOfHours, `${path}.numberOfHours`),
    certificateLink: assertOptionalString(raw.certificateLink, `${path}.certificateLink`),
    certificatePdfFile: assertOptionalString(raw.certificatePdfFile, `${path}.certificatePdfFile`),
    courseImage: assertOptionalString(raw.courseImage, `${path}.courseImage`),
    mainTopics: assertOptionalStringArray(raw.mainTopics, `${path}.mainTopics`),
    whyITookIt: assertOptionalString(raw.whyITookIt, `${path}.whyITookIt`),
    whatILearned: assertOptionalString(raw.whatILearned, `${path}.whatILearned`),
    relatedProjects: assertOptionalStringArray(raw.relatedProjects, `${path}.relatedProjects`),
    isFeatured: assertOptionalBoolean(raw.isFeatured, `${path}.isFeatured`),
  });
}

/** §11.5 Skill */
export function validateSkill(data: unknown): Skill {
  const path = "Skill";
  const raw = assertObject(data, path);

  return omitUndefined({
    name: assertRequiredString(raw.name, `${path}.name`),
    category: assertRequiredString(raw.category, `${path}.category`),
    notes: assertOptionalString(raw.notes, `${path}.notes`),
    icon: assertOptionalString(raw.icon, `${path}.icon`),
    proficiency: assertOptionalString(raw.proficiency, `${path}.proficiency`),
    displayOrder: assertOptionalNumber(raw.displayOrder, `${path}.displayOrder`),
  });
}

/** §11.6 Resume */
export function validateResume(data: unknown): Resume {
  const path = "Resume";
  const raw = assertObject(data, path);

  return omitUndefined({
    fileName: assertRequiredString(raw.fileName, `${path}.fileName`),
    repoPath: assertRequiredString(raw.repoPath, `${path}.repoPath`),
    publicUrl: assertRequiredString(raw.publicUrl, `${path}.publicUrl`),
    lastUpdated: assertOptionalYearMonthDate(raw.lastUpdated, `${path}.lastUpdated`),
    downloadButtonText: assertRequiredString(raw.downloadButtonText, `${path}.downloadButtonText`),
    previewEnabled: assertRequiredBoolean(raw.previewEnabled, `${path}.previewEnabled`),
    highlights: assertOptionalStringArray(raw.highlights, `${path}.highlights`),
  });
}

/** §11.7 Contact */
export function validateContact(data: unknown): Contact {
  const path = "Contact";
  const raw = assertObject(data, path);

  return omitUndefined({
    heading: assertRequiredString(raw.heading, `${path}.heading`),
    message: assertRequiredString(raw.message, `${path}.message`),
    email: assertRequiredString(raw.email, `${path}.email`),
    linkedIn: assertRequiredString(raw.linkedIn, `${path}.linkedIn`),
    phone: assertRequiredString(raw.phone, `${path}.phone`),
    location: assertRequiredString(raw.location, `${path}.location`),
    preferredContactMethod: assertRequiredString(
      raw.preferredContactMethod,
      `${path}.preferredContactMethod`,
    ),
    contactFormEnabled: assertRequiredBoolean(raw.contactFormEnabled, `${path}.contactFormEnabled`),
  });
}

/** §11.8 SocialLink */
export function validateSocialLink(data: unknown): SocialLink {
  const path = "SocialLink";
  const raw = assertObject(data, path);

  return omitUndefined({
    label: assertRequiredString(raw.label, `${path}.label`),
    url: assertRequiredString(raw.url, `${path}.url`),
    icon: assertOptionalString(raw.icon, `${path}.icon`),
    openInNewTab: assertRequiredBoolean(raw.openInNewTab, `${path}.openInNewTab`),
  });
}

/** §11.9 TerminalCommand */
export function validateTerminalCommand(data: unknown): TerminalCommand {
  const path = "TerminalCommand";
  const raw = assertObject(data, path);

  return omitUndefined({
    command: assertRequiredString(raw.command, `${path}.command`),
    description: assertRequiredString(raw.description, `${path}.description`),
    output: assertRequiredString(raw.output, `${path}.output`),
    aliases: assertOptionalStringArray(raw.aliases, `${path}.aliases`),
    isHidden: assertOptionalBoolean(raw.isHidden, `${path}.isHidden`),
    requiresLink: assertOptionalBoolean(raw.requiresLink, `${path}.requiresLink`),
  });
}

/** Work-related models that carry the §15.4 confidentiality gate. */
export type ConfidentialityGated = Experience | Project;

/**
 * Return only items approved for publication (`confidentialityReviewed === true`).
 * Unreviewed work-related entries are excluded from published output (spec §12.5, §15.4).
 */
export function filterConfidentialityReviewed<T extends { confidentialityReviewed: boolean }>(
  items: readonly T[],
): T[] {
  return items.filter((item) => item.confidentialityReviewed === true);
}

/** List work items still awaiting owner confidentiality review. */
export function getUnreviewedWorkItems<T extends { confidentialityReviewed: boolean }>(
  items: readonly T[],
): T[] {
  return items.filter((item) => item.confidentialityReviewed !== true);
}

function validateList<T>(
  data: unknown,
  label: string,
  validateItem: (item: unknown, index: number) => T,
): T[] {
  if (!Array.isArray(data)) {
    throw new ContentValidationError(label, "expected an array");
  }
  return data.map((item, index) => validateItem(item, index));
}

export function validateExperienceList(data: unknown): Experience[] {
  return validateList(data, "Experience[]", (item, index) => {
    const path = `Experience[${index}]`;
    const raw = assertObject(item, path);
    return omitUndefined({
      organization: assertRequiredString(raw.organization, `${path}.organization`),
      organizationType: assertOptionalString(raw.organizationType, `${path}.organizationType`),
      organizationLogo: assertOptionalString(raw.organizationLogo, `${path}.organizationLogo`),
      role: assertRequiredString(raw.role, `${path}.role`),
      employmentType: assertOptionalString(raw.employmentType, `${path}.employmentType`),
      startDate: assertYearMonthDate(raw.startDate, `${path}.startDate`),
      endDate: assertExperienceEndDate(raw.endDate, `${path}.endDate`),
      durationLabel: assertOptionalString(raw.durationLabel, `${path}.durationLabel`),
      description: assertRequiredString(raw.description, `${path}.description`),
      technologies: assertOptionalStringArray(raw.technologies, `${path}.technologies`),
      teamSize: assertOptionalString(raw.teamSize, `${path}.teamSize`),
      link: assertOptionalString(raw.link, `${path}.link`),
      screenshots: assertOptionalStringArray(raw.screenshots, `${path}.screenshots`),
      certificate:
        raw.certificate === undefined
          ? undefined
          : validateEducationCertificateRef(raw.certificate, `${path}.certificate`),
      confidentialityReviewed: assertRequiredBoolean(
        raw.confidentialityReviewed,
        `${path}.confidentialityReviewed`,
      ),
    });
  });
}

export function validateCourseList(data: unknown): Course[] {
  return validateList(data, "Course[]", (item, index) => {
    const path = `Course[${index}]`;
    const raw = assertObject(item, path);
    return omitUndefined({
      name: assertRequiredString(raw.name, `${path}.name`),
      provider: assertRequiredString(raw.provider, `${path}.provider`),
      category: assertRequiredStringArray(raw.category, `${path}.category`),
      completionDate: assertCompletionDate(raw.completionDate, `${path}.completionDate`),
      description: assertRequiredString(raw.description, `${path}.description`),
      skillsSharpened: assertRequiredStringArray(raw.skillsSharpened, `${path}.skillsSharpened`),
      numberOfHours: assertOptionalNumber(raw.numberOfHours, `${path}.numberOfHours`),
      certificateLink: assertOptionalString(raw.certificateLink, `${path}.certificateLink`),
      certificatePdfFile: assertOptionalString(raw.certificatePdfFile, `${path}.certificatePdfFile`),
      courseImage: assertOptionalString(raw.courseImage, `${path}.courseImage`),
      mainTopics: assertOptionalStringArray(raw.mainTopics, `${path}.mainTopics`),
      whyITookIt: assertOptionalString(raw.whyITookIt, `${path}.whyITookIt`),
      whatILearned: assertOptionalString(raw.whatILearned, `${path}.whatILearned`),
      relatedProjects: assertOptionalStringArray(raw.relatedProjects, `${path}.relatedProjects`),
      isFeatured: assertOptionalBoolean(raw.isFeatured, `${path}.isFeatured`),
    });
  });
}

export function validateLearningPathList(data: unknown): LearningPath[] {
  return validateList(data, "LearningPath[]", (item, index) => {
    const path = `LearningPath[${index}]`;
    const raw = assertObject(item, path);
    return omitUndefined({
      id: assertRequiredString(raw.id, `${path}.id`),
      order: assertRequiredNumber(raw.order, `${path}.order`),
      title: assertRequiredString(raw.title, `${path}.title`),
      courses: validateList(raw.courses, `${path}.courses`, (course, courseIndex) => {
        const coursePath = `${path}.courses[${courseIndex}]`;
        const rawCourse = assertObject(course, coursePath);
        return omitUndefined({
          name: assertRequiredString(rawCourse.name, `${coursePath}.name`),
          category: assertRequiredString(rawCourse.category, `${coursePath}.category`),
          image: assertOptionalString(rawCourse.image, `${coursePath}.image`),
        });
      }),
    });
  });
}

export function validateProjectList(data: unknown): Project[] {
  return validateList(data, "Project[]", (item, index) => {
    const path = `Project[${index}]`;
    const raw = assertObject(item, path);
    return omitUndefined({
      name: assertRequiredString(raw.name, `${path}.name`),
      role: assertRequiredString(raw.role, `${path}.role`),
      year: assertOptionalYearOrNumber(raw.year, `${path}.year`),
      category: assertOptionalStringArray(raw.category, `${path}.category`),
      shortDescription: assertRequiredString(raw.shortDescription, `${path}.shortDescription`),
      problemSolved: assertRequiredString(raw.problemSolved, `${path}.problemSolved`),
      solution: assertOptionalString(raw.solution, `${path}.solution`),
      techStack: assertRequiredStringArray(raw.techStack, `${path}.techStack`),
      backendFocus: assertOptionalString(raw.backendFocus, `${path}.backendFocus`),
      whyImportant: assertOptionalString(raw.whyImportant, `${path}.whyImportant`),
      architecture: assertOptionalString(raw.architecture, `${path}.architecture`),
      database: assertOptionalStringArray(raw.database, `${path}.database`),
      securityConsiderations: assertOptionalString(
        raw.securityConsiderations,
        `${path}.securityConsiderations`,
      ),
      challenges: assertOptionalString(raw.challenges, `${path}.challenges`),
      githubUrl: assertOptionalString(raw.githubUrl, `${path}.githubUrl`),
      liveDemoUrl: assertOptionalString(raw.liveDemoUrl, `${path}.liveDemoUrl`),
      screenshots: assertOptionalStringArray(raw.screenshots, `${path}.screenshots`),
      isFeatured: assertOptionalBoolean(raw.isFeatured, `${path}.isFeatured`),
      workplace: (() => {
        if (raw.workplace == null) return undefined;
        const wp = assertObject(raw.workplace, `${path}.workplace`);
        return {
          name: assertRequiredString(wp.name, `${path}.workplace.name`),
          logo: assertRequiredString(wp.logo, `${path}.workplace.logo`),
          showName: assertOptionalBoolean(wp.showName, `${path}.workplace.showName`),
        };
      })(),
      confidentialityReviewed: assertRequiredBoolean(
        raw.confidentialityReviewed,
        `${path}.confidentialityReviewed`,
      ),
    });
  });
}
