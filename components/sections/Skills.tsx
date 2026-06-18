"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef } from "react";

import { SkillBadge } from "@/components/ui/SkillBadge";
import { skills } from "@/lib/content/data/skills";

const easeOut = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const badgeRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: easeOut },
  },
};

/** Group an array of skills by their `category`, preserving `displayOrder`. */
function groupByCategory(list: typeof skills) {
  const map = new Map<string, typeof skills>();
  for (const skill of list) {
    const bucket = map.get(skill.category) ?? [];
    bucket.push(skill);
    map.set(skill.category, bucket);
  }
  // Sort each bucket by displayOrder
  map.forEach((bucket) => {
    bucket.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  });
  return map;
}

const grouped = groupByCategory(skills);

/**
 * Technical Skills section (spec §8.6, Task 9.2).
 *
 * All categories are rendered as grouped rows of scannable badges. Notes are
 * shown inline — never hover-only. Badges with no notes render the name only,
 * with no empty artifact. Icons are deferred until a license-safe source is
 * approved (spec §6.8); this component ships text/badge-only.
 *
 * The section exposes the `#skills` anchor for in-page navigation.
 */
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const animateState = isInView && !shouldReduceMotion ? "visible" : "hidden";
  const staticState = "visible";

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="relative isolate overflow-hidden border-t border-border bg-bg-base py-16 lg:py-24"
    >
      {/* Subtle radial accent background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_88%_16%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_28%),radial-gradient(circle_at_10%_80%,color-mix(in_srgb,var(--gradient-to)_10%,transparent),transparent_30%)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={shouldReduceMotion ? staticState : animateState}
          variants={revealVariants}
          className="mb-10 lg:mb-14"
        >
          <p className="mb-2 font-mono text-small tracking-wider text-accent">
            SYS://SKILLS
          </p>
          <div className="flex items-center gap-4">
            <h2
              id="skills-heading"
              className="text-h2 font-semibold text-text-primary"
            >
              Technical Skills
            </h2>
            <div
              aria-hidden="true"
              className="h-px min-w-12 flex-1 bg-gradient-to-r from-border via-accent/35 to-transparent"
            />
          </div>
          <p className="mt-3 max-w-measure text-body text-text-secondary">
            A curated overview of the tools, languages, and platforms I work with.
          </p>
        </motion.div>

        {/* Skill categories */}
        <motion.div
          initial="hidden"
          animate={shouldReduceMotion ? staticState : animateState}
          variants={staggerContainerVariants}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from(grouped.entries()).map(([category, categorySkills]) => (
            <motion.div
              key={category}
              variants={revealVariants}
              className="rounded-lg border border-border bg-bg-surface p-5"
            >
              <h3 className="mb-4 font-mono text-small font-semibold uppercase tracking-widest text-accent">
                {category}
              </h3>
              <motion.ul
                className="flex flex-wrap gap-2"
                aria-label={`${category} skills`}
                variants={staggerContainerVariants}
                initial="hidden"
                animate={shouldReduceMotion ? staticState : animateState}
              >
                {categorySkills.map((skill) => (
                  <motion.li
                    key={skill.name}
                    variants={badgeRevealVariants}
                    className="list-none"
                  >
                    <SkillBadge skill={skill} />
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
