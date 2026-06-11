"use client";

import { NodeCard } from "@/components/ui/ExperienceCard";
import type { ExperienceGraph, GraphNode } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";
import { cn } from "@/lib/utils";

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
 * The tree renders fully drawn; the `ScrollGradualBlur` wrapper in `ExperienceGitGraph`
 * owns the single scroll-driven reveal for the whole tree block.
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

/** One tree cell (card + its commit dot[s]). Renders fully drawn; reveal is handled by
 *  the `ScrollGradualBlur` wrapper in `ExperienceGitGraph`. */
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
  const { modifier, topDot, bottomDot, topAccent } = placeNode(node, sideOrder);
  const isBranchA = modifier === "branch-a";
  const headingId = `experience-node-${index}`;

  return (
    <li className={cn("experience-tree-cell", `experience-tree-cell--${modifier}`)}>
      <div className="experience-tree-cardwrap">
        {topDot ? (
          <span aria-hidden="true" className={cn("tree-dot tree-dot--top", topAccent)} />
        ) : null}
        {bottomDot ? (
          <span aria-hidden="true" className="tree-dot tree-dot--bottom" />
        ) : null}
        <NodeCard node={node} headingId={headingId} onOpenCertificate={onOpenCertificate} />
      </div>
      {isBranchA ? (
        <span aria-hidden="true" className="tree-conn tree-conn--branch-a-fill" />
      ) : null}
    </li>
  );
}

/** A standalone decorative connector — grid-placed by its class. Renders fully drawn. */
function TreeConnector({ className }: { className: string }) {
  return <li aria-hidden="true" className={className} />;
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
      <TreeConnector className="tree-merge-head" />
    </ol>
  );
}
