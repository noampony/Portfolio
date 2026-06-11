"use client";

import { useState } from "react";

import { EducationCertificateViewer } from "@/components/sections/EducationCertificateViewer";
import { ExperienceGitNode } from "@/components/ui/ExperienceGitNode";
import { ExperienceTreeGraph } from "@/components/ui/ExperienceTreeGraph";
import { ScrollGradualBlur } from "@/components/ui/ScrollGradualBlur";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import type { ExperienceGraph } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";

/**
 * Responsive container for the Experience timeline. It owns the certificate-viewer
 * dialog state for the degree root node and picks the layout:
 *
 * - **Small screens (< md):** the git tree (spec §8.3) — a vertical `<ol>` of 2-column
 *   rows (graph gutter + card). This is also the SSR / no-JS baseline.
 * - **Large screens (≥ md):** the upward tree (`ExperienceTreeGraph`), swapped in after
 *   hydration via `useMediaQuery` (server snapshot `false`, so no hydration mismatch).
 *
 * Exactly one layout is mounted at a time, so the cards' `experience-node-*` ids stay
 * unique and there is a single certificate `<dialog>`. The large tree only renders when
 * the graph matches the expected 1+1+1+2 shape (root + stem + 1 main branch + 2 side
 * cards); on any other shape — e.g. confidentiality gating collapses the fork — it falls
 * back to the linear git tree, which renders any node count gracefully.
 */
export function ExperienceGitGraph({ graph }: { graph: ExperienceGraph }) {
  const [activeCertificate, setActiveCertificate] = useState<EducationCertificateRef | null>(null);
  const isLargeScreen = useMediaQuery("(min-width: 768px)");
  const total = graph.nodes.length;

  // The tree maps cards to fixed positions, so it requires the exact branched shape.
  const sideCount = graph.nodes.filter((node) => node.lane === "side").length;
  const mainBranchCount = graph.nodes.filter(
    (node) => node.lane === "main" && !node.isRoot && !node.branchPoint,
  ).length;
  const canRenderTree =
    graph.branched &&
    graph.nodes.some((node) => node.isRoot) &&
    graph.nodes.some((node) => node.branchPoint) &&
    mainBranchCount === 1 &&
    sideCount === 2;

  return (
    <div className="mt-10 sm:mt-12">
      <ScrollGradualBlur>
        {isLargeScreen && canRenderTree ? (
          <ExperienceTreeGraph graph={graph} onOpenCertificate={setActiveCertificate} />
        ) : (
          <ol className="git-graph max-w-3xl">
            {graph.nodes.map((node, index) => (
              <ExperienceGitNode
                key={node.id}
                node={node}
                index={index}
                total={total}
                onOpenCertificate={setActiveCertificate}
              />
            ))}
          </ol>
        )}
      </ScrollGradualBlur>

      <EducationCertificateViewer
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  );
}
