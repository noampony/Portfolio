/**
 * Build/dev-time self-check for the content validator (Task 3.2).
 *
 * Imported as a side effect from `loaders.ts` so `pnpm build` / `next dev` fail
 * when sample data is invalid or the confidentiality gate regresses.
 */

import { profile } from "./data/profile";
import { about } from "./data/about";
import { experiences } from "./data/experience";
import { projects } from "./data/projects";
import {
  sampleExperienceReviewed,
  sampleExperienceUnreviewed,
  sampleProjectReviewed,
  sampleProjectUnreviewed,
} from "./fixtures";
import {
  filterConfidentialityReviewed,
  getUnreviewedWorkItems,
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

/** Verify the real Experience data is gated correctly (Task 6.1, spec §15.4). */
function assertExperienceConfidentialityGate(): void {
  const published = filterConfidentialityReviewed(experiences);
  if (published.some((entry) => entry.confidentialityReviewed !== true)) {
    throw new Error(
      "Content validator self-check failed: published experience output contains an unreviewed entry.",
    );
  }
  if (published.length < 1) {
    throw new Error(
      "Content validator self-check failed: expected at least one published experience entry.",
    );
  }
}

/** Verify the real Project data is gated correctly (Task 7.1, spec §8.4, §15.4). */
function assertProjectConfidentialityGate(): void {
  const published = filterConfidentialityReviewed(projects);
  if (published.some((entry) => entry.confidentialityReviewed !== true)) {
    throw new Error(
      "Content validator self-check failed: published project output contains an unreviewed entry.",
    );
  }
  // All four projects are owner-approved for publication (the Check Point three in
  // generalized, public-safe form); none should remain gated.
  if (getUnreviewedWorkItems(projects).length !== 0) {
    throw new Error(
      "Content validator self-check failed: a project is unexpectedly still gated (confidentialityReviewed !== true).",
    );
  }
  if (published.length < 1) {
    throw new Error(
      "Content validator self-check failed: expected at least one published project.",
    );
  }
}

if (!profile.name) {
  throw new Error("Content validator self-check failed: profile data failed to load.");
}
if (!about.professionalSummary) {
  throw new Error("Content validator self-check failed: about data failed to load.");
}
assertConfidentialityFilter();
assertExperienceConfidentialityGate();
assertProjectConfidentialityGate();
