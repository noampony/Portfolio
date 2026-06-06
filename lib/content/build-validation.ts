/**
 * Build/dev-time self-check for the content validator (Task 3.2).
 *
 * Imported as a side effect from `loaders.ts` so `pnpm build` / `next dev` fail
 * when sample data is invalid or the confidentiality gate regresses.
 */

import { profile } from "./data/profile";
import {
  sampleExperienceReviewed,
  sampleExperienceUnreviewed,
  sampleProjectReviewed,
  sampleProjectUnreviewed,
} from "./fixtures";
import {
  filterConfidentialityReviewed,
  validateExperience,
  validateProject,
} from "./validate";

function assertConfidentialityFilter(): void {
  const experiences = [
    validateExperience(sampleExperienceReviewed),
    validateExperience(sampleExperienceUnreviewed),
  ];
  const publishedExperiences = filterConfidentialityReviewed(experiences);
  if (publishedExperiences.length !== 1) {
    throw new Error(
      "Content validator self-check failed: confidentiality filter must exclude unreviewed experience items.",
    );
  }
  if (publishedExperiences[0]?.organization !== sampleExperienceReviewed.organization) {
    throw new Error(
      "Content validator self-check failed: confidentiality filter kept the wrong experience item.",
    );
  }

  const projects = [
    validateProject(sampleProjectReviewed),
    validateProject(sampleProjectUnreviewed),
  ];
  const publishedProjects = filterConfidentialityReviewed(projects);
  if (publishedProjects.length !== 1) {
    throw new Error(
      "Content validator self-check failed: confidentiality filter must exclude unreviewed project items.",
    );
  }
  if (publishedProjects[0]?.name !== sampleProjectReviewed.name) {
    throw new Error(
      "Content validator self-check failed: confidentiality filter kept the wrong project item.",
    );
  }
}

if (!profile.name) {
  throw new Error("Content validator self-check failed: profile data failed to load.");
}
assertConfidentialityFilter();
