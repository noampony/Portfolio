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

// Fallback collapsed height before DOM measurement fires.
const COLLAPSED_HEIGHT_FALLBACK = 176;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: easeOut },
  },
};

const accentLineRevealVariants: Variants = {
  hidden: { opacity: 0, x: -128 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.1, ease: easeOut },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOut },
  },
};

const tileStaggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const tileRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut },
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
  shouldReduceMotion: boolean | null;
}

function SkillCategoryCard({
  category,
  categorySkills,
  shouldReduceMotion,
}: SkillCategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState(COLLAPSED_HEIGHT_FALLBACK);
  const [expandCount, setExpandCount] = useState(0);
  // Index of the first badge that was below the collapsed height at expand time.
  // MAX_SAFE_INTEGER means "not yet measured" — all badges inherit the parent stagger.
  const [splitIndex, setSplitIndex] = useState(Number.MAX_SAFE_INTEGER);
  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  // Each card observes itself so it animates exactly when it scrolls into view.
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });
  const animateState = isInView && !shouldReduceMotion ? "visible" : "hidden";

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const measure = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(":scope > li"));
      if (items.length === 0) { setHasOverflow(false); return; }

      const gridTop = el.getBoundingClientRect().top;
      // Determine the bottom edge of each row by grouping items with the same top.
      // Keep fractional pixel values so the collapsed height matches the natural
      // grid height of 2-row cards exactly (avoids 1px subpixel discrepancy).
      const rowBottoms: number[] = [];
      let lastTop = -Infinity;

      for (const item of items) {
        const rect = item.getBoundingClientRect();
        const top = rect.top - gridTop;
        const bottom = rect.bottom - gridTop;
        if (top > lastTop + 0.5) {
          rowBottoms.push(bottom);
          lastTop = top;
        } else {
          rowBottoms[rowBottoms.length - 1] = Math.max(rowBottoms[rowBottoms.length - 1], bottom);
        }
      }

      const moreThanTwoRows = rowBottoms.length > 2;
      setHasOverflow(moreThanTwoRows);
      if (moreThanTwoRows && rowBottoms[1] > 0) {
        setCollapsedHeight(rowBottoms[1]);
      }
    };

    // Defer one frame so the CSS grid finishes column resolution before we measure.
    const raf = requestAnimationFrame(measure);

    // Re-check whenever the element resizes (e.g. viewport width change).
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const targetHeight =
    expanded || !hasOverflow ? "auto" : collapsedHeight;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={shouldReduceMotion ? "visible" : animateState}
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

      <div className="flex flex-1 flex-col px-4 pb-1 pt-4 sm:px-5 sm:pb-1.5 sm:pt-5">
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
            height: !expanded && hasOverflow ? collapsedHeight : undefined,
          }}
        >
          <motion.ul
            ref={gridRef}
            className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(84px,1fr))]"
            aria-label={`${category} skills`}
            variants={tileStaggerVariants}
            initial="hidden"
            animate={shouldReduceMotion ? "visible" : animateState}
          >
            {categorySkills.map((skill, i) => {
              const isOverflow = i >= splitIndex;
              const overflowIdx = i - splitIndex;
              return (
                <motion.li
                  key={isOverflow ? `${skill.name}-${expandCount}` : skill.name}
                  variants={isOverflow
                    ? {
                        hidden: { opacity: 0, scale: 0.82 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: { duration: 0.6, ease: easeOut, delay: overflowIdx * 0.12 },
                        },
                      }
                    : tileRevealVariants
                  }
                  className="list-none"
                >
                  <SkillBadge skill={skill} />
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>

        {/* Always rendered so all cards reserve the same button height; invisible when no overflow. */}
        <button
          type="button"
          onClick={() => {
            if (!expanded && gridRef.current) {
              const gridRect = gridRef.current.getBoundingClientRect();
              const items = gridRef.current.querySelectorAll(":scope > li");
              let split = items.length;
              for (let i = 0; i < items.length; i++) {
                const itemTop = (items[i] as HTMLElement).getBoundingClientRect().top - gridRect.top;
                if (itemTop >= collapsedHeight) { split = i; break; }
              }
              setSplitIndex(split);
              setExpandCount((c) => c + 1);
            }
            setExpanded((prev) => !prev);
          }}
          aria-expanded={hasOverflow ? expanded : undefined}
          aria-hidden={!hasOverflow}
          tabIndex={hasOverflow ? undefined : -1}
          className={[
            "mt-1 flex w-full items-center justify-center gap-1.5 rounded-md py-0 font-mono text-[0.65rem] uppercase tracking-widest text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            !hasOverflow ? "invisible pointer-events-none" : "",
          ].join(" ")}
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
      </div>
    </motion.div>
  );
}

/**
 * Technical Skills section (spec §8.6, Task 9.3).
 * Two independent flex columns of category cards, each containing an icon grid.
 */
export function Skills() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const headerAnimateState = isHeaderInView && !shouldReduceMotion ? "visible" : "hidden";

  const categories = Array.from(grouped.entries());
  const leftCol = categories.filter((_, i) => i % 2 === 0);
  const rightCol = categories.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="skills"
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
          ref={headerRef}
          initial="hidden"
          animate={shouldReduceMotion ? "visible" : headerAnimateState}
          variants={revealVariants}
          className="relative mb-10 lg:mb-14"
        >
          <motion.span
            aria-hidden="true"
            className="about-copy-accent-line"
            variants={accentLineRevealVariants}
          />
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

        {/* Two independent flex columns — each card observes itself */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
          <div className="flex flex-1 flex-col gap-4 sm:gap-5">
            {leftCol.map(([category, categorySkills]) => (
              <SkillCategoryCard
                key={category}
                category={category}
                categorySkills={categorySkills}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-4 sm:gap-5">
            {rightCol.map(([category, categorySkills]) => (
              <SkillCategoryCard
                key={category}
                category={category}
                categorySkills={categorySkills}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
