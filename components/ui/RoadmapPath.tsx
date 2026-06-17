"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import type { LearningPath } from "@/lib/content/types";
import { CourseCarousel } from "@/components/ui/CourseCarousel";

/**
 * One path in the learning roadmap (spec §8.5): a numbered node on the spine plus a content
 * block (header + carousel of the path's courses). The `<h3>` keeps a logical heading order
 * under the section `<h2>` ("Learning Roadmap").
 *
 * The node is a direct child of the path (it sits on the spine in the gutter on mobile/tablet,
 * and on the central spine on desktop); the header + carousel are wrapped in
 * `.roadmap-path-content` so the desktop center layout can place that block on alternating
 * sides of the spine (CSS handles the parity via `:nth-child`).
 *
 * Each path reveals itself on scroll: the title slides/fades up first, then the carousel a beat
 * later (a gentle internal stagger). The reveal re-runs every time the path scrolls back into
 * view (`once: false`) so the roadmap feels alive as you move through it. The number node is
 * intentionally *not* animated — it anchors the decorative road (whose geometry is measured
 * from the node's layout position), and transform/opacity reveals never shift layout, so the
 * road stays glued to the nodes. Reduced-motion renders everything in place, and the
 * `.courses-reveal` class lets the section's `<noscript>` restore visibility without JS.
 */

type RoadmapPathProps = {
  path: LearningPath;
  /** Id wired to the path `<h3>` so the carousel can reference its name. */
  headingId: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Stagger the title then the carousel; no transform on the container itself. */
const pathContentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.05 } },
};

/** A slow, clearly-visible fade-up for each piece of a path. */
const pathRevealVariants: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.1, ease: easeOut } },
};

export function RoadmapPath({ path, headingId }: RoadmapPathProps) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const order = String(path.order).padStart(2, "0");

  return (
    <section aria-labelledby={headingId} className="roadmap-path">
      <span aria-hidden="true" className="roadmap-path-order">
        {order}
      </span>
      <motion.div
        className="roadmap-path-content"
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: false, amount: 0.35 }}
        variants={pathContentVariants}
      >
        <motion.header
          variants={pathRevealVariants}
          className="courses-reveal roadmap-path-header"
        >
          <h3 id={headingId} className="roadmap-path-title">
            <span className="sr-only">Path {path.order}: </span>
            {path.title}
          </h3>
        </motion.header>
        <motion.div variants={pathRevealVariants} className="courses-reveal" style={{ minWidth: 0 }}>
          <CourseCarousel courses={path.courses} label={path.title} />
        </motion.div>
      </motion.div>
    </section>
  );
}
