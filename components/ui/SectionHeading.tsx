"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { accentLineRevealVariants, revealItemVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Shared section heading — the `SYS://` eyebrow, the `<h2>`, the colourful left
 * accent line and an optional lead paragraph, in the one visual rhythm every
 * homepage section uses. Purely presentational: it carries variants but no
 * `initial`/`animate` of its own, so the parent section's stagger container
 * (or `useInView` driver) keeps controlling when the reveal plays — and under
 * reduced motion the parent simply never enters the "hidden" state.
 */
type SectionHeadingProps = {
  /** id for the `<h2>`, matching the section's `aria-labelledby`. */
  headingId: string;
  /** The mono `SYS://NAME` label above the title. */
  eyebrow: string;
  title: ReactNode;
  /** Optional lead paragraph below the title. */
  lead?: ReactNode;
  /**
   * When true (default) the wrapper is a stagger item with the shared fade-up
   * variants. Set false when the heading sits inside a block that already
   * animates as one item (e.g. Contact's left column), to avoid compounding.
   */
  asItem?: boolean;
  className?: string;
};

export function SectionHeading({
  headingId,
  eyebrow,
  title,
  lead,
  asItem = true,
  className,
}: SectionHeadingProps) {
  const content = (
    <>
      <motion.span
        aria-hidden="true"
        className="about-copy-accent-line"
        variants={accentLineRevealVariants}
      />
      <p className="mb-3 font-mono text-small tracking-wider text-accent">{eyebrow}</p>
      <h2
        id={headingId}
        className="m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-measure text-body text-text-secondary">{lead}</p>
      ) : null}
    </>
  );

  if (!asItem) {
    return <div className={cn("relative", className)}>{content}</div>;
  }

  return (
    <motion.div variants={revealItemVariants} className={cn("relative", className)}>
      {content}
    </motion.div>
  );
}
