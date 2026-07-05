"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { impacts } from "@/lib/content/data/impact";
import { ImpactCard } from "@/components/ui/ImpactCard";

/**
 * My Impact section (spec §8.2) — replaces the former About section. Every career
 * impact from the validated content model is rendered as a card inside a Circular
 * Gallery (React Bits "Circular Gallery" style, implemented locally): cards fan out
 * along a 3D arc, the centre card upright and fully readable, the rest rotated and
 * dimmed but still present.
 *
 * Scope note: this task builds the section, its `#impact` anchor, and the circular
 * layout with click/keyboard selection to bring any card to the centre. The richer
 * carousel behaviour — 3s autoplay, hover/focus pause, prev/next buttons, horizontal
 * wheel and touch gestures, and the reduced-motion carousel fallback — lands in the
 * next task. The entrance reveal here already respects `prefers-reduced-motion`.
 */

/** Number of cards shown on each side of the centre before a slide fades out. */
const VISIBLE_SIDE = 2;

const easeOut = [0.22, 1, 0.36, 1] as const;

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easeOut } },
};

const galleryVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: easeOut, delay: 0.1 } },
};

/** Shortest signed distance from `active` to `index` on a ring of `total` cards. */
function circularOffset(index: number, active: number, total: number): number {
  let delta = index - active;
  const half = total / 2;
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

export function MyImpact() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();

  return (
    <section
      id="impact"
      aria-labelledby="impact-heading"
      className="impact-section relative isolate overflow-hidden border-t border-border bg-bg-base py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_12%_12%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_28%),radial-gradient(circle_at_86%_20%,color-mix(in_srgb,var(--gradient-to)_14%,transparent),transparent_30%),linear-gradient(180deg,color-mix(in_srgb,var(--bg-surface)_72%,transparent),transparent_48%)]"
      />
      <div aria-hidden="true" className="impact-grid-wash" />

      <div className="site-shell relative z-10">
        <motion.div
          className="impact-header max-w-measure"
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-80px" }}
          variants={headerVariants}
        >
          <p className="mb-3 font-mono text-small tracking-wider text-accent">SYS://IMPACT</p>
          <h2
            id="impact-heading"
            className="m-0 text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
          >
            My Impact
          </h2>
          <p className="mt-4 text-body text-text-secondary sm:text-[1.0625rem]">
            A selection of what I&apos;ve built across backend engineering, security
            products, operations, and volunteer work — and the outcomes each one drove.
          </p>
        </motion.div>

        <motion.div
          className="impact-gallery"
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-80px" }}
          variants={galleryVariants}
        >
          <ul
            className="impact-gallery-track"
            role="group"
            aria-roledescription="carousel"
            aria-label="Career impact highlights"
          >
            {impacts.map((impact, index) => {
              const offset = circularOffset(index, activeIndex, impacts.length);
              const abs = Math.abs(offset);
              const isActive = offset === 0;
              const isVisible = abs <= VISIBLE_SIDE;

              return (
                <li
                  key={impact.title}
                  className="impact-slide"
                  data-visible={isVisible || undefined}
                  // Off-view slides are removed from the tab order and the a11y tree
                  // so keyboard/AT users never land on an invisible card's control.
                  inert={isVisible ? undefined : true}
                  style={
                    {
                      "--offset": offset,
                      "--abs": abs,
                      zIndex: impacts.length - abs,
                    } as React.CSSProperties
                  }
                >
                  <ImpactCard
                    impact={impact}
                    headingId={`${baseId}-impact-${index}`}
                    active={isActive}
                    onActivate={() => setActiveIndex(index)}
                  />
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
