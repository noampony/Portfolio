"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainerVariants } from "@/lib/motion";

/**
 * Animated intro for the Experience section — the shared `SectionHeading` inside a
 * scroll-triggered stagger container, played once on scroll-in and disabled under
 * reduced motion (then the content renders in its final, visible state). Kept as a
 * small client island so the parent `Experience` stays a server component.
 */
export function ExperienceIntro() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <motion.div
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainerVariants}
    >
      <SectionHeading
        headingId="experience-heading"
        eyebrow="SYS://EXPERIENCE"
        title={<>Where I&apos;ve Built and Led</>}
        lead="Backend engineering and team leadership - most recent first."
      />
    </motion.div>
  );
}
