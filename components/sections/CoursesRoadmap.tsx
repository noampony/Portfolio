"use client";

import { useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { RoadmapPath } from "@/components/ui/RoadmapPath";
import { RoadmapRoad } from "@/components/ui/RoadmapRoad";
import { learningPaths } from "@/lib/content/data/learning-paths";

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
 * The section keeps the `#courses` anchor (spec §5.3). Per §5.1 the navbar's Courses item
 * targets the future `/courses` page, so `lib/navigation.ts` is intentionally unchanged.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

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
      className="relative isolate border-t border-border bg-bg-base py-16 lg:py-24"
    >
      <noscript>
        <style>{NO_JS_FALLBACK}</style>
      </noscript>

      <div aria-hidden="true" className="roadmap-grid-wash" />

      <motion.div
        className="site-shell"
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainerVariants}
      >
        <motion.p
          variants={revealItemVariants}
          className="courses-reveal mb-3 font-mono text-small tracking-wider text-accent"
        >
          SYS://COURSES
        </motion.p>
        <motion.h2
          id="courses-heading"
          variants={revealItemVariants}
          className="courses-reveal m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
        >
          Learning Roadmap
        </motion.h2>
        <motion.p
          variants={revealItemVariants}
          className="courses-reveal mt-4 max-w-measure text-body text-text-secondary"
        >
          A deliberate progression — grouped into focused paths, from language depth and
          backend systems to architecture, security, and AI-augmented development.
        </motion.p>

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
