"use client";

import { NodeCard, type ExperienceExpansion } from "@/components/ui/ExperienceCard";
import type { GraphNode } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * A single node in the Experience git tree (spec §8.3): a graph gutter cell (the
 * lane lines and fork elbows — all decorative/`aria-hidden`) paired with the role/degree
 * card. The two share a grid row, so the gutter stretches to the card's height and the
 * lanes stay aligned with no JS measurement.
 *
 * Branched gutter, bottom → top (mirroring the large-screen tree's shape): a single
 * centred stem fades in from the bottom of the section, just below the degree root's
 * connector, rises through the branch-point role, then forks into a left lane (the
 * current role) and a right lane (the side roles). Both lane tips rise past the last
 * card's top edge and fade out over the same range (still live) — the same fade span
 * and gradient as the start, just reversed. Unbranched graphs fall back to one
 * straight lane.
 *
 * The whole tree is visible at once; each card is compact and expands into a larger card
 * on hover / keyboard / tap (`NodeCard` → `ExperienceCard`).
 *
 * This is the SMALL-screen layout. The large-screen tree (`ExperienceTreeGraph`) reuses
 * the same card bodies (`NodeCard`).
 */

type ExperienceGitNodeProps = {
  node: GraphNode;
  /** Position in the ordered list (top = 0); drives the linear fallback lane. */
  index: number;
  /** Total node count; drives the linear fallback lane. */
  total: number;
  /** Whether the graph formed the fork shape (`ExperienceGraph.branched`). */
  branched: boolean;
  expansion: ExperienceExpansion;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

/** Gutter drawing for one row of the branched (forked) tree. */
function BranchedGutter({ node }: { node: GraphNode }) {
  if (node.isRoot) {
    // Root (degree) — solid from the connector down through the card, then past the
    // card's bottom edge, fading in as if rising from the bottom of the section.
    return (
      <>
        <span className="git-line git-line--stem git-line--bottom" />
        <span className="git-line git-line--stem git-line--top" />
        <span className="git-line git-line--stem git-line--root-fade" />
      </>
    );
  }
  if (node.branchPoint) {
    // Branch point — the stem passes the dot, rises a little further, then forks
    // into the left and right lanes.
    return (
      <>
        <span className="git-elbow git-elbow--fork-left" />
        <span className="git-elbow git-elbow--fork-right" />
        <span className="git-line git-line--stem git-line--fork-tail" />
        <span className="git-line git-line--stem git-line--bottom" />
      </>
    );
  }
  if (node.lane === "side") {
    // Side roles — both lanes pass through; the connector leaves the right lane.
    return (
      <>
        <span className="git-line git-line--main git-line--top" />
        <span className="git-line git-line--main git-line--bottom" />
        <span className="git-line git-line--side git-line--top" />
        <span className="git-line git-line--side git-line--bottom" />
      </>
    );
  }
  // Current role at the top of the left lane: both lanes stay solid alongside this
  // last card, then rise just past its top edge and fade out together (identical
  // fade heads — the branches are still live).
  return (
    <>
      <span className="git-line git-line--main git-line--top" />
      <span className="git-line git-line--main git-line--bottom" />
      <span className="git-line git-line--main git-line--fade-head" />
      <span className="git-line git-line--side git-line--full" />
      <span className="git-line git-line--side git-line--fade-head" />
    </>
  );
}

/** Straight single-lane gutter for the unbranched fallback graph. */
function LinearGutter({ index, total }: { index: number; total: number }) {
  return (
    <>
      {index > 0 ? (
        <span className="git-line git-line--main git-line--top" />
      ) : (
        /* Continuation line — the topmost (current) node: the branch is still
           live, so a fading line above the dot signals it keeps going. */
        <span className="git-line git-line--main git-line--continuation" />
      )}
      {index < total - 1 ? <span className="git-line git-line--main git-line--bottom" /> : null}
    </>
  );
}

export function ExperienceGitNode({
  node,
  index,
  total,
  branched,
  expansion,
  onOpenCertificate,
}: ExperienceGitNodeProps) {
  const headingId = `experience-node-${index}`;
  // Which lane the card connector leaves from (sets `--git-connector-start`).
  const connectorLane = !branched
    ? "main"
    : node.isRoot || node.branchPoint
      ? "stem"
      : node.lane === "side"
        ? "side"
        : "main";

  return (
    <li className={cn("git-graph-row", `git-graph-row--${connectorLane}`)}>
      {/* Decorative graph gutter — the headings/dates convey order to assistive tech. */}
      <span aria-hidden="true" className="git-graph-gutter">
        {branched ? <BranchedGutter node={node} /> : <LinearGutter index={index} total={total} />}
      </span>

      <div className="git-graph-cell">
        <NodeCard
          node={node}
          headingId={headingId}
          expansion={expansion}
          onOpenCertificate={onOpenCertificate}
        />
      </div>
    </li>
  );
}
