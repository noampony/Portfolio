"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated intro for the Experience section — the `SYS://EXPERIENCE` label, heading and
 * lead-in, plus the colourful left accent line. The scroll reveal mirrors the About
 * section's copy panel exactly: a stagger container drives a fade-up on the text and a
 * slide-in on the accent line, played once on scroll-in and disabled under reduced motion
 * (then the content renders in its final, visible state). Kept as a small client island so
 * the parent `Experience` stays a server component.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;
const ACCENT_LINE_START_X = -128;

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.12 },
  },
};

const accentLineRevealVariants = {
  hidden: { opacity: 0, x: ACCENT_LINE_START_X },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.1, ease: easeOut },
  },
};

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.05, ease: easeOut },
  },
};

export function ExperienceIntro() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <motion.div
      className="relative"
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainerVariants}
    >
      {/* Colourful left accent line — same treatment as the About section. */}
      <motion.span
        aria-hidden="true"
        className="about-copy-accent-line"
        variants={accentLineRevealVariants}
      />
      <motion.div variants={revealVariants}>
        <p className="mb-3 font-mono text-small tracking-wider text-accent">SYS://EXPERIENCE</p>
        <h2
          id="experience-heading"
          className="m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
        >
          Where I&apos;ve Built and Led
        </h2>
        <p className="mt-4 max-w-measure text-body text-text-secondary">
          Backend engineering and team leadership — most recent first.
        </p>
      </motion.div>
    </motion.div>
  );
}
