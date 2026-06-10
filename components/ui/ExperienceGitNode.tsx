"use client";

import { useRef } from "react";

import { cubicBezier, motion, useTransform, type MotionStyle } from "framer-motion";

import { NodeCard } from "@/components/ui/ExperienceCard";
import { useScrollDraw } from "@/lib/hooks/useScrollDraw";
import type { GraphNode } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** Symmetric ease-in-out for the card entrance: it ramps gradually across the whole range
 *  (an ease-out would front-load the change and still read as a pop). */
const cardEase = cubicBezier(0.42, 0, 0.58, 1);

/**
 * A single node in the Experience git tree (spec §8.3): a graph gutter cell (the
 * lane lines, fork/merge elbows and commit dot — all decorative/`aria-hidden`) paired
 * with the role/degree card. The two share a grid row, so the gutter stretches to the
 * card's height and the lanes stay aligned with no JS measurement and no layout shift.
 *
 * The reveal is a scroll-scrubbed "draw": as the row crosses the viewport its own scroll
 * progress (`useScrollDraw`) is split into staggered sub-ranges so the segments draw in
 * git order — top lane → commit dot → card frame → card body → bottom lane — and reverse
 * on scroll-up. Each phase feeds a CSS custom property (`--fill` / `--dot-*` / `--conn-fill`
 * / the card's `--card-frame` / `--card-body`) consumed by globals.css; those vars default
 * to 1, so the server render, the first (pre-mount) client render and reduced-motion all
 * paint the graph fully drawn — no hydration mismatch, no JS required for the content.
 *
 * This is the SMALL-screen layout. The large-screen tree (`ExperienceTreeGraph`) reuses
 * the same card bodies (`NodeCard`) and the same fill scheme.
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
  const rowRef = useRef<HTMLLIElement>(null);
  // Wider band than the default, so each phase plays over more scroll distance and the card
  // glides in rather than popping at medium scroll speed.
  const { active, progress } = useScrollDraw(rowRef, ["start 0.92", "start 0.32"]);

  // Staggered sub-ranges of the row's 0→1 scroll progress (top lane first, content last).
  const topLine = useTransform(progress, [0, 0.28], [0, 1]);
  const bottomLine = useTransform(progress, [0.8, 1], [0, 1]);
  const splitFill = useTransform(progress, [0.06, 0.28], [0, 1]);
  const mergeFill = useTransform(progress, [0.3, 0.5], [0, 1]);
  // The dot sketches in: it grows from nothing (scale 0→1) as the front reaches it.
  const dotScale = useTransform(progress, [0.24, 0.44], [0, 1]);
  const dotOpacity = useTransform(progress, [0.22, 0.4], [0, 1]);
  const connFill = useTransform(progress, [0.36, 0.5], [0, 1]);
  // The card glides in over a wide, eased range so it never pops; the content fades + rises
  // just behind the frame so the text lands shortly after (not a screen-height later).
  const cardFrame = useTransform(progress, [0.4, 0.8], [0, 1], { ease: cardEase });
  const cardBody = useTransform(progress, [0.5, 0.88], [0, 1], { ease: cardEase });
  const cardBodyY = useTransform(progress, [0.5, 0.88], [12, 0], { ease: cardEase });

  // The main lane is the spine: it runs through every row from the top node down to
  // the root, so a row carries it above unless it's the first row, and below unless
  // it's the last (root) row.
  const mainAbove = index > 0;
  const mainBelow = index < total - 1;
  const onSide = node.lane === "side";
  const headingId = `experience-node-${index}`;

  // `--fill`/`--conn-fill`/`--dot-*` are only bound while drawing; otherwise the CSS
  // defaults (= 1, fully drawn) apply for the SSR / pre-mount / reduced-motion fallback.
  const fillStyle = (value: typeof topLine): MotionStyle | undefined =>
    active ? ({ "--fill": value } as MotionStyle) : undefined;

  return (
    <motion.li
      ref={rowRef}
      className={cn("git-graph-row", onSide ? "git-graph-row--side" : "git-graph-row--main")}
      style={active ? ({ "--conn-fill": connFill } as MotionStyle) : undefined}
    >
      {/* Decorative graph gutter — the headings/dates convey order to assistive tech. */}
      <span aria-hidden="true" className="git-graph-gutter">
        {mainAbove ? (
          <motion.span
            className="git-line git-line--main git-line--top"
            style={fillStyle(topLine)}
          />
        ) : index === 0 ? (
          /* Continuation line — the topmost (current) node: the branch is still
             live, so a fading line above the dot signals it keeps going. */
          <motion.span
            className="git-line git-line--main git-line--continuation"
            style={active ? { opacity: topLine } : undefined}
          />
        ) : null}
        {mainBelow ? (
          <motion.span
            className="git-line git-line--main git-line--bottom"
            style={fillStyle(bottomLine)}
          />
        ) : null}
        {onSide ? (
          <>
            <motion.span
              className="git-line git-line--side git-line--top"
              style={fillStyle(topLine)}
            />
            <motion.span
              className="git-line git-line--side git-line--bottom"
              style={fillStyle(bottomLine)}
            />
          </>
        ) : null}
        {node.branchPoint ? (
          <motion.span className="git-elbow git-elbow--split" style={fillStyle(splitFill)} />
        ) : null}
        {node.mergePoint ? (
          <motion.span className="git-elbow git-elbow--merge" style={fillStyle(mergeFill)} />
        ) : null}
        <motion.span
          className={cn(
            "git-dot",
            onSide ? "git-dot--side" : "git-dot--main",
            node.isCurrent && "git-dot--current",
            node.isRoot && "git-dot--root",
          )}
          style={
            active ? ({ "--dot-scale": dotScale, opacity: dotOpacity } as MotionStyle) : undefined
          }
        />
      </span>

      <div className="git-graph-cell">
        <NodeCard
          node={node}
          headingId={headingId}
          onOpenCertificate={onOpenCertificate}
          fill={active ? { frame: cardFrame, body: cardBody, bodyY: cardBodyY } : undefined}
        />
      </div>
    </motion.li>
  );
}
