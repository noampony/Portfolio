"use client";

import { motion, useReducedMotion } from "framer-motion";

import { NodeCard, rowRevealVariants } from "@/components/ui/ExperienceCard";
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
 * (25% / 75%) and the spine at 50%, so connectors need no JS measurement. Branch A's
 * descender is a flex filler inside its (column-spanning) cell, so it stretches to
 * whatever height branch B's taller stack imposes and stays glued to the card bottom;
 * the other connectors bridge a single row gap via negative-margin bleed. Nothing
 * depends on card height, so there is no layout shift. Connectors/dots are decorative
 * (aria-hidden); the cards keep the same semantics, ids and chronological reading order
 * as the small layout. The reveal is the shared opacity-only fade, off under reduced
 * motion.
 */

type CellPlacement = {
  /** Grid-placement modifier suffix, e.g. `branch-a`. */
  modifier: string;
  /** Extra dot class (current/root accents); empty for a plain dot. */
  dotAccent: string;
  /** Root sits at the bottom, so its dot caps the top edge; others emit lines downward. */
  dotAtTop: boolean;
  /** Stagger index — root → stem → branches, so the tree "grows" upward. */
  reveal: number;
};

function placeNode(node: GraphNode, sideOrder: string[]): CellPlacement {
  if (node.isRoot) {
    return { modifier: "root", dotAccent: "tree-dot--root", dotAtTop: true, reveal: 0 };
  }
  if (node.branchPoint) {
    return { modifier: "stem", dotAccent: "", dotAtTop: false, reveal: 1 };
  }
  if (node.lane === "main") {
    // The remaining main-lane role — branch A (the current role).
    return {
      modifier: "branch-a",
      dotAccent: node.isCurrent ? "tree-dot--current" : "",
      dotAtTop: false,
      reveal: 3,
    };
  }
  // Side lane → branch B. First side node (most recent) is the top card.
  const isTop = sideOrder.indexOf(node.id) === 0;
  return {
    modifier: isTop ? "branch-b-top" : "branch-b-bottom",
    dotAccent: "",
    dotAtTop: false,
    reveal: isTop ? 3 : 2,
  };
}

export function ExperienceTreeGraph({
  graph,
  onOpenCertificate,
}: {
  graph: ExperienceGraph;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
}) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const sideOrder = graph.nodes.filter((node) => node.lane === "side").map((node) => node.id);

  return (
    <ol className="experience-tree">
      {graph.nodes.map((node, index) => {
        const { modifier, dotAccent, dotAtTop, reveal } = placeNode(node, sideOrder);
        // Same id scheme as the small layout; only one layout mounts, so ids stay unique.
        const headingId = `experience-node-${index}`;

        return (
          <motion.li
            key={node.id}
            className={cn("experience-tree-cell", `experience-tree-cell--${modifier}`)}
            custom={reveal}
            variants={rowRevealVariants}
            initial={animate ? "hidden" : false}
            whileInView={animate ? "visible" : undefined}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="experience-tree-cardwrap">
              <span
                aria-hidden="true"
                className={cn(
                  "tree-dot",
                  dotAtTop ? "tree-dot--top" : "tree-dot--bottom",
                  dotAccent,
                )}
              />
              <NodeCard node={node} headingId={headingId} onOpenCertificate={onOpenCertificate} />
            </div>
            {/* Branch A's descender stretches to branch B's taller stack and stays
                glued to the card bottom — a flex filler, so no height math. */}
            {modifier === "branch-a" ? (
              <span aria-hidden="true" className="tree-conn tree-conn--branch-a-fill" />
            ) : null}
          </motion.li>
        );
      })}

      {/* Decorative connectors — grid items placed by CSS, removed from the a11y tree. */}
      <li aria-hidden="true" className="tree-conn tree-conn--branch-b-riser" />
      <li aria-hidden="true" className="tree-conn tree-conn--branch-b" />
      <li aria-hidden="true" className="tree-fork" />
      <li aria-hidden="true" className="tree-conn tree-conn--tap" />
      <li aria-hidden="true" className="tree-conn tree-conn--stem" />
    </ol>
  );
}
