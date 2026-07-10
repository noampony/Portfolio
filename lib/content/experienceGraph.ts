/**
 * Experience git-tree model (spec §8.3).
 *
 * Shapes the Experience section as a git commit graph that reads bottom → top:
 * a stem rising from the root that forks at the "Malware Analyst" role into two
 * parallel branches — the current role on one branch, the side roles on the other
 * (the small and large layouts both draw this same shape). The root of the tree is
 * the B.Sc. degree, sourced from the public About section (`about.education`), not
 * from the experience data.
 *
 * Deliberate chronology note: the structure is owner-specified, not a literal
 * timeline. The current role (Backend Software Developer – Cloud) began 2022-10, yet
 * the side-branch roles (Private Tutor 2022, Team Leader 2024–25) sit before it in
 * the top-down node order — the branch layout is a visual statement about the career
 * path, not a timestamp. Do not "fix" this into strict date order.
 *
 * This module is pure and server-safe (no React, no `Date`). The server component
 * (Experience.tsx) does confidentiality filtering and build-time duration resolution
 * *before* calling `buildExperienceGraph`, so this never gates content and never
 * depends on a runtime clock.
 */

import type { AboutEducation, Experience } from "./types";

/** Which vertical lane a node sits on. */
export type GraphLane = "main" | "side";

/** A duration-resolved experience handed in by the server component. */
export type ResolvedExperience = {
  experience: Experience;
  /** Build-time duration label (e.g. `3 yrs 8 mos`), or null to omit. */
  duration: string | null;
};

/** A node's card payload — either an experience role or the education root. */
export type GraphCard =
  | { kind: "experience"; experience: Experience; duration: string | null }
  | { kind: "education"; education: AboutEducation };

export type GraphNode = {
  /** Stable id for React keys + aria wiring. */
  id: string;
  lane: GraphLane;
  isRoot: boolean;
  isCurrent: boolean;
  /** The dot above which the stem forks into the two branches. */
  branchPoint: boolean;
  card: GraphCard;
};

export type ExperienceGraph = {
  /** Ordered top → bottom (DOM + visual + reading order). */
  nodes: GraphNode[];
  /** False when the expected fork couldn't be formed → linear fallback. */
  branched: boolean;
};

/** Role whose dot the side branch forks off from. */
const BRANCH_POINT_ROLE = "Malware Analyst";

const ROOT_ID = "education-root";

function experienceId(experience: Experience): string {
  return `${experience.organization}-${experience.role}-${experience.startDate}`;
}

function isOngoing(experience: Experience): boolean {
  return experience.endDate === "Present";
}

type NodeOverrides = Partial<Pick<GraphNode, "branchPoint">>;

function experienceNode(
  resolved: ResolvedExperience,
  lane: GraphLane,
  overrides: NodeOverrides = {},
): GraphNode {
  return {
    id: experienceId(resolved.experience),
    lane,
    isRoot: false,
    isCurrent: isOngoing(resolved.experience),
    branchPoint: overrides.branchPoint ?? false,
    card: { kind: "experience", experience: resolved.experience, duration: resolved.duration },
  };
}

function rootNode(education: AboutEducation): GraphNode {
  return {
    id: ROOT_ID,
    lane: "main",
    isRoot: true,
    isCurrent: false,
    branchPoint: false,
    card: { kind: "education", education },
  };
}

/**
 * Build the git-tree node list from the (already filtered + duration-resolved)
 * experiences and the education root.
 *
 * Roles are matched by predicate, never by array index, so the graph is robust to
 * the input order. If confidentiality filtering removes the branch point, the current
 * role, or every side-branch member, the graph degrades gracefully to a single
 * straight main lane (root at the bottom) — no dangling fork.
 */
export function buildExperienceGraph(
  resolved: ResolvedExperience[],
  education: AboutEducation,
): ExperienceGraph {
  const current = resolved.find((entry) => isOngoing(entry.experience));
  const branchPoint = resolved.find((entry) => entry.experience.role === BRANCH_POINT_ROLE);
  const sideMembers = resolved.filter((entry) => entry !== current && entry !== branchPoint);

  // Fallback: can't form the fork → straight spine in the given order
  // (the server passes most-recent-first), with the degree as the root.
  if (!current || !branchPoint || sideMembers.length === 0) {
    const spine = resolved.map((entry) => experienceNode(entry, "main"));
    return { nodes: [...spine, rootNode(education)], branched: false };
  }

  // Side lane, most-recent-first top → bottom (Team Leader above Private Tutor).
  const sideTopDown = [...sideMembers].sort((a, b) =>
    b.experience.startDate.localeCompare(a.experience.startDate),
  );

  const nodes: GraphNode[] = [
    experienceNode(current, "main"),
    ...sideTopDown.map((entry) => experienceNode(entry, "side")),
    experienceNode(branchPoint, "main", { branchPoint: true }),
    rootNode(education),
  ];

  return { nodes, branched: true };
}
