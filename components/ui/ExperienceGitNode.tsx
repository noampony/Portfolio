"use client";

import { NodeCard } from "@/components/ui/ExperienceCard";
import type { GraphNode } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * A single node in the Experience git tree (spec §8.3): a graph gutter cell (the
 * lane lines, fork/merge elbows and commit dot — all decorative/`aria-hidden`) paired
 * with the role/degree card. The two share a grid row, so the gutter stretches to the
 * card's height and the lanes stay aligned with no JS measurement.
 *
 * The tree renders fully drawn (CSS `--fill` / `--dot-scale` variables default to 1).
 * The scroll-driven reveal is handled by the `ScrollGradualBlur` wrapper in
 * `ExperienceGitGraph`, which applies a single gradient blur animation to the whole tree.
 *
 * This is the SMALL-screen layout. The large-screen tree (`ExperienceTreeGraph`) reuses
 * the same card bodies (`NodeCard`).
 */

type ExperienceGitNodeProps = {
  node: GraphNode;
  /** Position in the ordered list (top = 0); used to know whether a lane continues above. */
  index: number;
  /** Total node count; used to know whether a lane continues below this row. */
  total: number;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

export function ExperienceGitNode({
  node,
  index,
  total,
  onOpenCertificate,
}: ExperienceGitNodeProps) {
  const mainAbove = index > 0;
  const mainBelow = index < total - 1;
  const onSide = node.lane === "side";
  const headingId = `experience-node-${index}`;

  return (
    <li
      className={cn("git-graph-row", onSide ? "git-graph-row--side" : "git-graph-row--main")}
    >
      {/* Decorative graph gutter — the headings/dates convey order to assistive tech. */}
      <span aria-hidden="true" className="git-graph-gutter">
        {mainAbove ? (
          <span className="git-line git-line--main git-line--top" />
        ) : index === 0 ? (
          /* Continuation line — the topmost (current) node: the branch is still
             live, so a fading line above the dot signals it keeps going. */
          <span className="git-line git-line--main git-line--continuation" />
        ) : null}
        {mainBelow ? (
          <span className="git-line git-line--main git-line--bottom" />
        ) : null}
        {onSide ? (
          <>
            <span className="git-line git-line--side git-line--top" />
            <span className="git-line git-line--side git-line--bottom" />
          </>
        ) : null}
        {node.branchPoint ? (
          <span className="git-elbow git-elbow--split" />
        ) : null}
        {node.mergePoint ? (
          <span className="git-elbow git-elbow--merge" />
        ) : null}
        <span
          className={cn(
            "git-dot",
            onSide ? "git-dot--side" : "git-dot--main",
            node.isCurrent && "git-dot--current",
            node.isRoot && "git-dot--root",
          )}
        />
      </span>

      <div className="git-graph-cell">
        <NodeCard node={node} headingId={headingId} onOpenCertificate={onOpenCertificate} />
      </div>
    </li>
  );
}
