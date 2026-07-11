import type { Variants } from "framer-motion";

/**
 * Shared motion vocabulary for the homepage sections. Every section reveal is
 * built from the same three variants so scroll rhythm stays uniform site-wide;
 * sections drive the "hidden"/"visible" states (whileInView / useInView) and
 * gate everything behind `useReducedMotion()`.
 */

/** House easing curve — matches the CSS `cubic-bezier(0.22, 1, 0.36, 1)` used in globals.css. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Parent container: staggers its variant-bearing children on reveal. */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/** Standard fade-up used by section headings, cards and blocks. */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

/** The colourful left accent line sliding in beside each section heading. */
export const accentLineRevealVariants: Variants = {
  hidden: { opacity: 0, x: -128 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.1, ease: easeOut },
  },
};
