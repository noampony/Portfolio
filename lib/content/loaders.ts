/**
 * Data loaders — validate content at import/build time (spec §12.5).
 *
 * Section data modules (e.g. `lib/content/data/profile.ts` in Task 3.3) should
 * pass raw records through these helpers so missing required fields fail fast.
 */

import {
  filterConfidentialityReviewed,
  validateContact,
  validateAboutSectionData,
  validateCourse,
  validateCourseList,
  validateExperience,
  validateExperienceList,
  validateProfile,
  validateProject,
  validateProjectList,
  validateResume,
  validateSkill,
  validateSocialLink,
  validateTerminalCommand,
} from "./validate";

export {
  ContentValidationError,
  filterConfidentialityReviewed,
  getUnreviewedWorkItems,
  validateContact,
  validateAboutSectionData,
  validateCourse,
  validateCourseList,
  validateExperience,
  validateExperienceList,
  validateProfile,
  validateProject,
  validateProjectList,
  validateResume,
  validateSkill,
  validateSocialLink,
  validateTerminalCommand,
} from "./validate";

export type { ConfidentialityGated } from "./validate";

export function loadProfile(data: unknown) {
  return validateProfile(data);
}

export function loadAboutSectionData(data: unknown) {
  return validateAboutSectionData(data);
}

export function loadExperience(data: unknown) {
  return validateExperience(data);
}

export function loadExperienceList(data: unknown) {
  return validateExperienceList(data);
}

export function loadProject(data: unknown) {
  return validateProject(data);
}

export function loadProjectList(data: unknown) {
  return validateProjectList(data);
}

export function loadCourse(data: unknown) {
  return validateCourse(data);
}

export function loadCourseList(data: unknown) {
  return validateCourseList(data);
}

export function loadSkill(data: unknown) {
  return validateSkill(data);
}

export function loadResume(data: unknown) {
  return validateResume(data);
}

export function loadContact(data: unknown) {
  return validateContact(data);
}

export function loadSocialLink(data: unknown) {
  return validateSocialLink(data);
}

export function loadTerminalCommand(data: unknown) {
  return validateTerminalCommand(data);
}

/**
 * Publish-safe work items — excludes entries where `confidentialityReviewed !== true`
 * (spec §15.4).
 */
export function loadPublishedExperiences(data: unknown) {
  return filterConfidentialityReviewed(loadExperienceList(data));
}

export function loadPublishedProjects(data: unknown) {
  return filterConfidentialityReviewed(loadProjectList(data));
}

import "./build-validation";
