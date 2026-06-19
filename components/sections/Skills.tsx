"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { SkillBadge } from "@/components/ui/SkillBadge";
import { skills } from "@/lib/content/data/skills";

const easeOut = [0.22, 1, 0.36, 1] as const;

// Icon tile: ~80px tall (incl. padding). 3 rows + gaps ≈ 292px at narrowest grid.
// Collapse only categories whose content exceeds 3 rows at any viewport width.
const COLLAPSED_HEIGHT = 300;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

const tileRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28, ease: easeOut },
  },
};

function groupByCategory(list: typeof skills) {
  const map = new Map<string, typeof skills>();
  for (const skill of list) {
    const bucket = map.get(skill.category) ?? [];
    bucket.push(skill);
    map.set(skill.category, bucket);
  }
  map.forEach((bucket) => {
    bucket.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  });
  return map;
}

const grouped = groupByCategory(skills);

interface SkillCategoryCardProps {
  category: string;
  categorySkills: typeof skills;
  animateState: "visible" | "hidden";
  shouldReduceMotion: boolean | null;
}

function SkillCategoryCard({
  category,
  categorySkills,
  animateState,
  shouldReduceMotion,
}: SkillCategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const check = () => setHasOverflow(el.scrollHeight > COLLAPSED_HEIGHT);

    // Defer one frame so the CSS grid finishes column resolution before we measure.
    const raf = requestAnimationFrame(check);

    // Re-check whenever the element resizes (e.g. viewport width change).
    const ro = new ResizeObserver(check);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const targetHeight =
    expanded || !hasOverflow ? "auto" : COLLAPSED_HEIGHT;

  return (
    <motion.div
      variants={cardVariants}
      className={[
        "group relative flex flex-col overflow-hidden rounded-xl",
        "border border-border bg-bg-surface",
        "transition-colors duration-200",
        "hover:border-accent/30 hover:bg-bg-surface-raised",
      ].join(" ")}
    >
      {/* Top accent line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="mb-4 font-mono text-[0.65rem] font-semibold uppercase tracking-widest text-accent">
          {category}
        </h3>

        <motion.div
          animate={{ height: targetHeight }}
          initial={false}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.45,
            ease: easeOut,
          }}
          className="overflow-hidden"
          style={{
            height: !expanded && hasOverflow ? COLLAPSED_HEIGHT : undefined,
          }}
        >
          <motion.ul
            ref={gridRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(84px,1fr))]"
            aria-label={`${category} skills`}
            variants={staggerContainerVariants}
            initial="hidden"
            animate={shouldReduceMotion ? "visible" : animateState}
          >
            {categorySkills.map((skill) => (
              <motion.li
                key={skill.name}
                variants={tileRevealVariants}
                className="list-none"
              >
                <SkillBadge skill={skill} />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {hasOverflow && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {expanded ? (
              <>
                <svg aria-hidden="true" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                Show less
              </>
            ) : (
              <>
                <svg aria-hidden="true" className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                Show all {categorySkills.length}
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Technical Skills section (spec §8.6, Task 9.3).
 * Two independent flex columns of category cards, each containing an icon grid.
 */
export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();

  const animateState = isInView && !shouldReduceMotion ? "visible" : "hidden";

  const categories = Array.from(grouped.entries());
  const leftCol = categories.filter((_, i) => i % 2 === 0);
  const rightCol = categories.filter((_, i) => i % 2 === 1);

  const cardProps = (category: string, categorySkills: typeof skills) => ({
    key: category,
    category,
    categorySkills,
    animateState: animateState as "visible" | "hidden",
    shouldReduceMotion,
  });

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-heading"
      className="relative isolate overflow-hidden border-t border-border bg-bg-base py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_88%_16%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_28%),radial-gradient(circle_at_10%_80%,color-mix(in_srgb,var(--gradient-to)_10%,transparent),transparent_30%)]"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial="hidden"
          animate={shouldReduceMotion ? "visible" : animateState}
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

        {/* Two independent flex columns */}
        <motion.div
          initial="hidden"
          animate={shouldReduceMotion ? "visible" : animateState}
          variants={staggerContainerVariants}
          className="flex flex-col gap-4 sm:flex-row sm:gap-5"
        >
          <div className="flex flex-1 flex-col gap-4 sm:gap-5">
            {leftCol.map(([category, categorySkills]) => (
              <SkillCategoryCard {...cardProps(category, categorySkills)} />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-4 sm:gap-5">
            {rightCol.map(([category, categorySkills]) => (
              <SkillCategoryCard {...cardProps(category, categorySkills)} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
