"use client";

import { useEffect, useRef, useState } from "react";

import { EducationCertificateViewer } from "@/components/sections/EducationCertificateViewer";
import type { ExperienceExpansion } from "@/components/ui/ExperienceCard";
import { ExperienceGitNode } from "@/components/ui/ExperienceGitNode";
import { ExperienceTreeGraph } from "@/components/ui/ExperienceTreeGraph";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useMounted } from "@/lib/hooks/useMounted";
import type { ExperienceGraph } from "@/lib/content/experienceGraph";
import type { EducationCertificateRef } from "@/lib/content/types";

/**
 * Responsive container for the Experience timeline. It owns the certificate-viewer
 * dialog state for the degree root node, the single-open "expanded card" state, and
 * picks the layout:
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
 *
 * Cards are compact by default and expand into a larger card on hover / keyboard / tap
 * (see `ExperienceCard`). Single-open state lives here so opening one card closes any
 * other; the cards render their full detail inline until the client hydrates (`enhanced`),
 * keeping the SSR HTML complete without JS (§7.5).
 */
export function ExperienceGitGraph({ graph }: { graph: ExperienceGraph }) {
  const [activeCertificate, setActiveCertificate] = useState<EducationCertificateRef | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isLargeScreen = useMediaQuery("(min-width: 768px)");
  const hoverCapable = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enhanced = useMounted();
  const total = graph.nodes.length;

  // Gentle reveal-on-scroll for the cards + connector lines. The wrapper carries a
  // `data-reveal` state that drives a CSS transition (reduced-motion-gated, so reduced-motion
  // and no-JS users always see the tree fully). If the tree is already on screen at mount we
  // skip straight to "revealed" (no entrance), avoiding a flash against the SSR→client swap;
  // otherwise we "arm" it (hidden) and reveal once it scrolls into view.
  const treeRef = useRef<HTMLDivElement>(null);
  const [reveal, setReveal] = useState<"idle" | "armed" | "revealed">("idle");

  useEffect(() => {
    const el = treeRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      setReveal("revealed");
      return;
    }
    setReveal("armed");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReveal("revealed");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const expansion: ExperienceExpansion = {
    expandedId,
    onExpandedChange: setExpandedId,
    enhanced,
    hoverCapable,
  };

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
    <div
      ref={treeRef}
      className="mt-10 sm:mt-12"
      data-reveal={reveal === "idle" ? undefined : reveal}
    >
      {isLargeScreen && canRenderTree ? (
        <ExperienceTreeGraph
          graph={graph}
          expansion={expansion}
          onOpenCertificate={setActiveCertificate}
        />
      ) : (
        <ol className="git-graph max-w-3xl">
          {graph.nodes.map((node, index) => (
            <ExperienceGitNode
              key={node.id}
              node={node}
              index={index}
              total={total}
              expansion={expansion}
              onOpenCertificate={setActiveCertificate}
            />
          ))}
        </ol>
      )}

      <EducationCertificateViewer
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </div>
  );
}
