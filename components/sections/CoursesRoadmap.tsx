"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionBackground } from "@/components/layout/SectionBackground";
import { RoadmapPath } from "@/components/ui/RoadmapPath";
import { RoadmapRoad } from "@/components/ui/RoadmapRoad";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { learningPaths } from "@/lib/content/data/learning-paths";
import { staggerContainerVariants } from "@/lib/motion";

/**
 * Courses section (spec §8.5) — a compact learning *roadmap*: the ordered learning paths,
 * each rendered as a header plus a small carousel of its courses (see `RoadmapPath` /
 * `CourseCarousel`). Replaces the earlier flat top-3–5 "Courses Preview".
 *
 * Path ordering and grouping come from `lib/content/data/learning-paths.ts` (a deliberate
 * progression). Per-course categories and images are owner-supplied later (§19.7); cards show
 * a placeholder category and a gradient fallback until then. No total course count is shown
 * here (the About section owns the headline stats).
 *
 * Motion mirrors the other sections: a subtle stagger fade-up reveal on scroll, reduced-motion
 * safe via `useReducedMotion()` (content renders in place). The `<noscript>` block restores
 * reveal opacity so the section is fully readable with JS disabled.
 *
 * The section keeps the `#courses` anchor (spec §5.3), which the primary navbar links to
 * and highlights via scroll-spy (see `lib/navigation.ts`).
 */

/** No-JS fallback: keep the reveal-animated content visible when scripting never runs. */
const NO_JS_FALLBACK = `.courses-reveal{opacity:1!important;transform:none!important}`;

export function CoursesRoadmap() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const pathsRef = useRef<HTMLOListElement>(null);

  // Defensive: render nothing rather than an empty shell if data is ever emptied.
  if (learningPaths.length === 0) {
    return null;
  }

  return (
    <section
      id="courses"
      aria-labelledby="courses-heading"
      className="relative isolate overflow-hidden bg-bg-base py-16 lg:py-24"
    >
      <SectionBackground />

      <noscript>
        <style>{NO_JS_FALLBACK}</style>
      </noscript>

      <motion.div
        className="site-shell"
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainerVariants}
      >
        <SectionHeading
          className="courses-reveal"
          headingId="courses-heading"
          eyebrow="SYS://COURSES"
          title="Learning Roadmap"
          lead="A deliberate path - Python first, then backend systems, architecture, security, and AI-assisted development."
        />

        <div className="roadmap-paths-wrap mt-10">
          <RoadmapRoad containerRef={pathsRef} pathCount={learningPaths.length} />
          {/* Each path owns its own scroll reveal (see RoadmapPath), so the list items are
              plain elements — animating them here too would double the motion. */}
          <ol ref={pathsRef} className="roadmap-paths list-none p-0">
            {learningPaths.map((path) => (
              <li key={path.id}>
                <RoadmapPath path={path} headingId={`path-${path.id}-heading`} />
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
