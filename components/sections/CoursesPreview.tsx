"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { CourseCard } from "@/components/ui/CourseCard";
import { courses } from "@/lib/content/data/courses";

/**
 * Courses Preview section (spec §8.5) — the homepage's top 3–5 courses, framed as a
 * learning path (professional growth) rather than a random completion list.
 *
 * Ordering comes from the data module (`lib/content/data/courses.ts`), which is curated
 * as a progression (language depth → backend systems → engineering craft → AI-assisted
 * development); the step badges + connecting rail make that progression legible. Each card
 * renders the §8.5 fields where data exists, with a consistent fallback for missing images
 * and an "unavailable" pill for missing certificates (see `CourseCard`).
 *
 * "Explore Courses Hub" (§8.5): the dedicated Courses Hub page is conditional/nice-to-have
 * (§4.4) and does not exist yet (Phase 16 / Task 16.2), so the control ships as a
 * non-navigating, accessibly-labelled placeholder — never a dead `#`/404 link (AGENTS
 * "no broken links"). Task 16.2 wires it to the real page.
 *
 * Motion mirrors the Projects/About sections: a subtle stagger fade-up reveal on scroll,
 * reduced-motion-safe via `useReducedMotion()` (cards render in place) with card hover gated
 * under `prefers-reduced-motion` in CSS. The `<noscript>` block restores reveal opacity so
 * the section is fully readable with JS disabled.
 *
 * The section exposes the `#courses` anchor (spec §5.3); per §5.1 the navbar carries only
 * Home/Projects/Courses/Resume (the Courses item already targets the future `/courses` page),
 * so `lib/navigation.ts` is intentionally left unchanged here.
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

export function CoursesPreview() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  // Defensive: render nothing rather than an empty shell if data is ever emptied.
  if (courses.length === 0) {
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
          Learning Path
        </motion.h2>
        <motion.p
          variants={revealItemVariants}
          className="courses-reveal mt-4 max-w-measure text-body text-text-secondary"
        >
          A deliberate progression — from language depth to backend systems, engineering craft,
          and AI-assisted development. A few courses along the way.
        </motion.p>

        <ol className="course-path mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {courses.map((course, index) => (
            <motion.li key={course.name} variants={revealItemVariants} className="courses-reveal flex">
              <CourseCard
                course={course}
                stepIndex={index + 1}
                headingId={`course-${index}-heading`}
              />
            </motion.li>
          ))}
        </ol>

        {/*
         * "Explore Courses Hub" (§8.5). The dedicated Courses Hub page is conditional/
         * nice-to-have (§4.4) and does not exist yet (Phase 16 / Task 16.2), so this ships as
         * a non-interactive, accessibly-labelled placeholder — never a dead link. Task 16.2
         * turns it into the real link when the page ships.
         */}
        <motion.div variants={revealItemVariants} className="courses-reveal mt-8 flex justify-center">
          <button type="button" disabled aria-disabled="true" className="course-hub-button">
            Explore Courses Hub
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only"> — full Courses Hub coming soon</span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
