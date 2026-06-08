"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Client wrapper that owns the timeline's vertical rail and animates it
 * "filling" with accent colour as the section scrolls through the viewport
 * (owner request, Task 6.x polish). A muted track sits behind every entry; an
 * accent progress line is scaled from the top (`scaleY`) by the section's
 * scroll progress via Framer Motion's `useScroll`, so the timeline visibly
 * colours in as the reader moves down the page.
 *
 * The rail is bookended by two explicit terminals (owner request): a "Now"
 * marker at the top (the timeline is reverse-chronological, so the top is the
 * most-recent point) and a "Start" origin marker at the bottom (the earliest
 * role). The rail's top/bottom anchor to the centres of these two markers, so
 * the line begins and ends exactly on them regardless of how many roles render.
 *
 * Accessibility / progressive enhancement (spec §7.3/§7.5):
 * - Reduced motion → the progress line renders fully filled and never reacts to
 *   scroll, so the timeline still reads as "complete" with no motion.
 * - No JavaScript → the CSS default leaves the accent line collapsed and only
 *   the muted track shows. The fill is a pure decoration (the entries themselves
 *   are force-shown by the section's <noscript> rule), so content is never
 *   gated behind it.
 * - The rail lines and the decorative terminal markers are `aria-hidden`; the
 *   ordered list and each role's dates still convey the chronology (most recent
 *   first, ending at the earliest role) to assistive tech.
 */
export function ExperienceTimeline({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  // Progress runs from when the list's top nears the viewport bottom to when its
  // end nears the middle — the line is full by the time the last role is read.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 82%", "end 58%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 32, mass: 0.4 });

  return (
    <div ref={railRef} className="experience-timeline mt-10 max-w-3xl sm:mt-12">
      <span aria-hidden="true" className="experience-rail experience-rail-track" />
      <motion.span
        aria-hidden="true"
        className="experience-rail experience-rail-progress"
        style={reduceMotion ? { scaleY: 1 } : { scaleY: fill }}
      />

      {/* Top terminal — the most-recent point of the timeline. */}
      <div aria-hidden="true" className="experience-endcap experience-endcap--now">
        <span className="experience-endcap-dot" />
        <span className="experience-endcap-label">Now</span>
      </div>

      <ol className="experience-list">{children}</ol>

      {/* Bottom terminal — where the timeline begins (earliest role). */}
      <div aria-hidden="true" className="experience-endcap experience-endcap--start">
        <span className="experience-endcap-dot" />
        <span className="experience-endcap-label">Start</span>
      </div>
    </div>
  );
}
