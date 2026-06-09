"use client";

import { useState } from "react";

import { EducationCertificateViewer } from "@/components/sections/EducationCertificateViewer";
import { ExperienceGitNode } from "@/components/ui/ExperienceGitNode";
import type { ExperienceGraph } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";

/**
 * Client wrapper that lays out the Experience git tree (spec §8.3) and owns the
 * certificate-viewer dialog state for the degree root node. The graph is an ordered
 * list rendered top → bottom (current role at the top, the degree root at the bottom);
 * each row is a self-contained 2-column grid (graph gutter + card), so the lanes track
 * card heights with no measurement and no layout shift.
 *
 * The certificate viewer mirrors the About section: the root card's triggers open the
 * same in-page `<dialog>` (degree + Dean's List). State is local here, so this section
 * is self-contained and doesn't share state across sections.
 */
export function ExperienceGitGraph({ graph }: { graph: ExperienceGraph }) {
  const [activeCertificate, setActiveCertificate] = useState<EducationCertificateRef | null>(null);
  const total = graph.nodes.length;

  return (
    <div className="mt-10 max-w-3xl sm:mt-12">
      <ol className="git-graph">
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

      <EducationCertificateViewer
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  );
}
