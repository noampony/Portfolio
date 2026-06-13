"use client";

import { NodeCard, type ExperienceExpansion } from "@/components/ui/ExperienceCard";
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
 * The whole tree is visible at once; cards are compact and expand into a larger overlay
 * card on hover / keyboard / tap. The overlay is portalled to `document.body`, so the grid
 * never reflows when a card opens.
 */

/**
 * Which cell a node occupies in the 2-branch tree (its grid-placement modifier). Derived
 * from the graph flags, never array order: root caps the bottom, the branch point is the
 * stem, the remaining main-lane node is branch A, and the two side nodes are branch B
 * (most-recent on top).
 */
function placeNode(node: GraphNode, sideOrder: string[]): string {
  if (node.isRoot) return "root";
  if (node.branchPoint) return "stem";
  if (node.lane === "main") return "branch-a";
  return sideOrder.indexOf(node.id) === 0 ? "branch-b-top" : "branch-b-bottom";
}

/** One tree cell (the card placed in its branch position). */
function TreeCell({
  node,
  index,
  sideOrder,
  expansion,
  onOpenCertificate,
}: {
  node: GraphNode;
  index: number;
  sideOrder: string[];
  expansion: ExperienceExpansion;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
}) {
  const modifier = placeNode(node, sideOrder);
  const isBranchA = modifier === "branch-a";
  const headingId = `experience-node-${index}`;

  return (
    <li className={cn("experience-tree-cell", `experience-tree-cell--${modifier}`)}>
      <div className="experience-tree-cardwrap">
        <NodeCard
          node={node}
          headingId={headingId}
          expansion={expansion}
          onOpenCertificate={onOpenCertificate}
        />
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
  expansion,
  onOpenCertificate,
}: {
  graph: ExperienceGraph;
  expansion: ExperienceExpansion;
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
          expansion={expansion}
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
