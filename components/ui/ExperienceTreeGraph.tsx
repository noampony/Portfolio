"use client";

import { useRef } from "react";

import {
  cubicBezier,
  motion,
  useTransform,
  type MotionStyle,
  type UseScrollOptions,
} from "framer-motion";

import { NodeCard } from "@/components/ui/ExperienceCard";
import { useScrollDraw } from "@/lib/hooks/useScrollDraw";
import type { ExperienceGraph, GraphNode } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/** Symmetric ease-in-out for the card entrance: it ramps gradually across the whole range
 *  (an ease-out would front-load the change and still read as a pop). */
const cardEase = cubicBezier(0.42, 0, 0.58, 1);

/**
 * Large-screen Experience layout (≥ md): an upward-growing tree.
 *
 *   ●[current role]   ●[side role, recent]   branch A (left) sits beside branch B's
 *    │                 │                      top card but a little higher; branch B
 *    │                ●[side role, older]     (right) stacks two cards.
 *    │                 │
 *    └────────┬────────┘                      fork
 *             │
 *      ●[branch-point role]                   stem (2nd card)
 *             │
 *      ●[B.Sc. degree]                        root — centred, bottom
 *
 * Positions are derived from the graph node flags (never array indexes): the `isRoot`
 * node is the root, the `branchPoint` node is the stem, the remaining main-lane node is
 * branch A, and the two `side`-lane nodes are branch B (most-recent on top). The parent
 * (`ExperienceGitGraph`) only mounts this when the graph matches that exact 1+1+1+2
 * shape, so the lookups below are total.
 *
 * Layout is a 2-equal-column CSS grid: branch lines sit at the fixed column centres
 * (25% / 75%) and the spine at 50%, so connectors need no JS measurement. Connectors/dots
 * are decorative (aria-hidden); the cards keep the same semantics, ids and chronological
 * reading order as the small layout.
 *
 * The reveal is the same scroll-scrubbed "draw" as the small git tree: each cell and each
 * standalone connector owns its scroll progress (`useScrollDraw`) and feeds the shared CSS
 * fill vars (`--fill` / `--dot-*` / `--card-frame` / `--card-body`), which default to 1 so
 * the SSR / pre-mount / reduced-motion fallback renders the tree fully drawn.
 */

type CellPlacement = {
  /** Grid-placement modifier suffix, e.g. `branch-a`. */
  modifier: string;
  /** A commit dot at the card's top edge, where the incoming line lands. */
  topDot: boolean;
  /** A commit dot at the card's bottom edge, where the line exits to history below. */
  bottomDot: boolean;
  /** Extra class for the top dot (current/root accents); empty for a plain dot. */
  topAccent: string;
};

/**
 * Dots sit where a line meets the card: a `topDot` where the incoming line lands (drawn
 * before the card, as the front arrives from above) and a `bottomDot` where the line exits
 * downward (drawn after the card has appeared). Tip cards that have no line above them
 * (the most-recent side role) carry only a bottom dot.
 */
function placeNode(node: GraphNode, sideOrder: string[]): CellPlacement {
  if (node.isRoot) {
    // Root caps the bottom of the tree: only an incoming line from above, so a top dot.
    return { modifier: "root", topDot: true, bottomDot: false, topAccent: "tree-dot--root" };
  }
  if (node.branchPoint) {
    // Stem (Malware Analyst): the fork taps into its top, the line to the root exits below.
    return { modifier: "stem", topDot: true, bottomDot: true, topAccent: "" };
  }
  if (node.lane === "main") {
    // Branch A (the current role): its top dot is the live "HEAD" where the upward branch +
    // the merge of the side branch meet; the descender to history exits the card bottom.
    return {
      modifier: "branch-a",
      topDot: true,
      bottomDot: true,
      topAccent: node.isCurrent ? "tree-dot--current" : "",
    };
  }
  // Side lane → branch B. First side node (most recent) is the top card — a branch tip with
  // no line above it, so only a bottom dot. The older side card has a line entering its top.
  const isTop = sideOrder.indexOf(node.id) === 0;
  return {
    modifier: isTop ? "branch-b-top" : "branch-b-bottom",
    topDot: !isTop,
    bottomDot: true,
    topAccent: "",
  };
}

/** One tree cell (card + its commit dot[s]); owns its scroll-draw progress. */
function TreeCell({
  node,
  index,
  sideOrder,
  onOpenCertificate,
}: {
  node: GraphNode;
  index: number;
  sideOrder: string[];
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
}) {
  const cellRef = useRef<HTMLLIElement>(null);
  // Wider band so each phase plays over more scroll distance and the card glides in instead
  // of popping at medium scroll speed.
  const { active, progress } = useScrollDraw(cellRef, ["start 0.92", "start 0.32"]);
  const { modifier, topDot, bottomDot, topAccent } = placeNode(node, sideOrder);
  const isBranchA = modifier === "branch-a";

  // Sequence: the top dot sketches in as the front arrives, then the card glides in over a
  // wide, eased range (body fading + rising just behind), then the bottom dot appears once
  // the card is in — it marks where the line exits downward. Branch A's descender last.
  const topDotScale = useTransform(progress, [0.06, 0.28], [0, 1]);
  const topDotOpacity = useTransform(progress, [0.04, 0.24], [0, 1]);
  const cardFrame = useTransform(progress, [0.28, 0.66], [0, 1], { ease: cardEase });
  const cardBody = useTransform(progress, [0.38, 0.76], [0, 1], { ease: cardEase });
  const cardBodyY = useTransform(progress, [0.38, 0.76], [12, 0], { ease: cardEase });
  const bottomDotScale = useTransform(progress, [0.76, 0.94], [0, 1]);
  const bottomDotOpacity = useTransform(progress, [0.74, 0.92], [0, 1]);
  const descenderFill = useTransform(progress, [0.8, 1], [0, 1]);

  // Same id scheme as the small layout; only one layout mounts, so ids stay unique.
  const headingId = `experience-node-${index}`;

  const topDotStyle: MotionStyle | undefined = active
    ? ({ "--dot-scale": topDotScale, opacity: topDotOpacity } as MotionStyle)
    : undefined;
  const bottomDotStyle: MotionStyle | undefined = active
    ? ({ "--dot-scale": bottomDotScale, opacity: bottomDotOpacity } as MotionStyle)
    : undefined;

  return (
    <li
      ref={cellRef}
      className={cn("experience-tree-cell", `experience-tree-cell--${modifier}`)}
    >
      <div className="experience-tree-cardwrap">
        {topDot ? (
          <motion.span
            aria-hidden="true"
            className={cn("tree-dot tree-dot--top", topAccent)}
            style={topDotStyle}
          />
        ) : null}
        {bottomDot ? (
          <motion.span
            aria-hidden="true"
            className="tree-dot tree-dot--bottom"
            style={bottomDotStyle}
          />
        ) : null}
        <NodeCard
          node={node}
          headingId={headingId}
          onOpenCertificate={onOpenCertificate}
          fill={active ? { frame: cardFrame, body: cardBody, bodyY: cardBodyY } : undefined}
        />
      </div>
      {/* Branch A's descender stretches to branch B's taller stack and stays glued to the
          card bottom — a flex filler, so no height math. */}
      {isBranchA ? (
        <motion.span
          aria-hidden="true"
          className="tree-conn tree-conn--branch-a-fill"
          style={active ? ({ "--fill": descenderFill } as MotionStyle) : undefined}
        />
      ) : null}
    </li>
  );
}

/** A standalone decorative connector — grid-placed by its class; owns its scroll-draw. */
function TreeConnector({
  className,
  variant = "fill",
}: {
  className: string;
  /** `fill` paints the line via `--fill`; `opacity` fades a faded continuation in. */
  variant?: "fill" | "opacity";
}) {
  const ref = useRef<HTMLLIElement>(null);
  const offset: UseScrollOptions["offset"] = ["start 0.92", "start 0.5"];
  const { active, progress } = useScrollDraw(ref, offset);
  const draw = useTransform(progress, [0, 1], [0, 1]);

  const style: MotionStyle | undefined = active
    ? variant === "opacity"
      ? { opacity: draw }
      : ({ "--fill": draw } as MotionStyle)
    : undefined;

  return <motion.li aria-hidden="true" className={className} ref={ref} style={style} />;
}

export function ExperienceTreeGraph({
  graph,
  onOpenCertificate,
}: {
  graph: ExperienceGraph;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
}) {
  const sideOrder = graph.nodes.filter((node) => node.lane === "side").map((node) => node.id);

  return (
    <ol className="experience-tree">
      {graph.nodes.map((node, index) => (
        <TreeCell
          key={node.id}
          node={node}
          index={index}
          sideOrder={sideOrder}
          onOpenCertificate={onOpenCertificate}
        />
      ))}

      {/* Decorative connectors — grid items placed by CSS, removed from the a11y tree. */}
      <TreeConnector className="tree-conn tree-conn--branch-b-riser" />
      <TreeConnector className="tree-conn tree-conn--branch-b" />
      <TreeConnector className="tree-fork" />
      <TreeConnector className="tree-conn tree-conn--tap" />
      <TreeConnector className="tree-conn tree-conn--stem" />

      {/* Continuation above the current role: a line rising from branch-A's live HEAD dot
          (top of the Backend card, 25%) that continues up and fades out past the top of
          the graph — signalling the branch is still live. */}
      <TreeConnector className="tree-merge-stem" />
      <TreeConnector className="tree-merge-head" variant="opacity" />
    </ol>
  );
}
