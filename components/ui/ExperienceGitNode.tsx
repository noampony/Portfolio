"use client";

import { motion, useReducedMotion } from "framer-motion";

import { NodeCard, rowRevealVariants } from "@/components/ui/ExperienceCard";
import type { GraphNode } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * A single node in the Experience git tree (spec §8.3): a graph gutter cell (the
 * lane lines, fork/merge elbows and commit dot — all decorative/`aria-hidden`) paired
 * with the role/degree card. The two share a grid row, so the gutter stretches to the
 * card's height and the lanes stay aligned with no JS measurement and no layout shift.
 *
 * Which graph segments a row draws is derived from the node's lane + flags and its
 * position: the main lane runs through every row (top → root), the side lane only
 * through the side-branch rows, and the fork/merge elbows live on the branch/merge
 * nodes. The reveal is a reduced-motion-safe Framer Motion fade-up; under reduced
 * motion the row renders in its final, fully-visible state. Markup is server-rendered
 * so the content is present without client JS.
 *
 * This is the SMALL-screen layout. The large-screen tree (`ExperienceTreeGraph`) reuses
 * the same card bodies (`NodeCard`) and reveal (`rowRevealVariants`).
 */

type ExperienceGitNodeProps = {
  node: GraphNode;
  /** Position in the ordered list (top = 0); used for the reveal stagger. */
  index: number;
  /** Total node count; used to know whether a lane continues above/below this row. */
  total: number;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

export function ExperienceGitNode({
  node,
  index,
  total,
  onOpenCertificate,
}: ExperienceGitNodeProps) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  // The main lane is the spine: it runs through every row from the top node down to
  // the root, so a row carries it above unless it's the first row, and below unless
  // it's the last (root) row.
  const mainAbove = index > 0;
  const mainBelow = index < total - 1;
  const onSide = node.lane === "side";
  const headingId = `experience-node-${index}`;

  return (
    <motion.li
      className={cn("git-graph-row", onSide ? "git-graph-row--side" : "git-graph-row--main")}
      custom={index}
      variants={rowRevealVariants}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
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
        {mainBelow ? <span className="git-line git-line--main git-line--bottom" /> : null}
        {onSide ? (
          <>
            <span className="git-line git-line--side git-line--top" />
            <span className="git-line git-line--side git-line--bottom" />
          </>
        ) : null}
        {node.branchPoint ? <span className="git-elbow git-elbow--split" /> : null}
        {node.mergePoint ? <span className="git-elbow git-elbow--merge" /> : null}
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
    </motion.li>
  );
}
