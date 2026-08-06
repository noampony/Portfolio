"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { SectionBackground } from "@/components/layout/SectionBackground";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { INTERPERSONAL_CATEGORY, skills } from "@/lib/content/data/skills";
import { getSkillIcon } from "@/lib/content/skill-icons";
import { easeOut } from "@/lib/motion";

// Fallback collapsed height before DOM measurement fires.
const COLLAPSED_HEIGHT_FALLBACK = 176;

// Vertical headroom inside the (overflow-hidden) clip box so the hover lift on
// first-row tiles isn't clipped at the top. Matches the badge lift
// (hover:-translate-y-2 = 8px) plus a little slack for the hover scale. It's
// offset by an equal negative margin below, so the resting gap above the first
// row is unchanged; the height target is bumped so exactly two rows still show.
const LIFT_HEADROOM = 12;

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

// Interpersonal skills are the one non-technical category, so they're pulled out
// of the technical card grid and rendered as their own full-width band below it.
const technicalSkills = skills.filter((s) => s.category !== INTERPERSONAL_CATEGORY);
const interpersonalSkills = skills
  .filter((s) => s.category === INTERPERSONAL_CATEGORY)
  .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

const grouped = groupByCategory(technicalSkills);

// Tailwind `sm` breakpoint — below it the cards stack into a single column.
const TWO_COLUMN_QUERY = "(min-width: 640px)";

// useLayoutEffect on the client (so the column count is corrected before the
// first paint, avoiding any flash), useEffect on the server to silence the SSR
// warning. The state still defaults to the SSR value so hydration matches.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Round-robin so reading order is preserved: with 2 columns the cards lay out
// exactly as a row-major grid would (item 0,2,4 left; 1,3,5 right), and with 1
// column they stay in source order. Each column is its own flex stack, so
// expanding a card only shifts the cards below it in that column.
function distributeIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  return columns;
}

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
  // Full (expanded) content height, measured alongside the collapsed height.
  const [fullHeight, setFullHeight] = useState(0);
  // The clip box animates with a plain CSS `max-height` transition between two measured
  // pixel values — NOT Framer animating a number against the "auto" string. That combination
  // was unreliable here (React 19 / Framer): interrupting the open animation (Show all → Show
  // less before it finished) left the panel desynced — collapsing with no transition, or
  // stuck open. CSS transitions between two px values redirect from the current value
  // mid-flight, so it stays smooth however fast the user toggles. The first clamp on mount is
  // `none → px` (non-animatable), so it applies instantly with no "grow" on load.
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

      // Use layout-box metrics (offsetTop/offsetHeight), NOT getBoundingClientRect:
      // tiles render in their "hidden" variant (scale: 0.82) until the card scrolls
      // into view, and getBoundingClientRect would report those transformed, compressed
      // sizes — yielding a too-short collapsed height that never self-corrects (a child
      // transform doesn't resize the grid, so the ResizeObserver never re-fires). offset*
      // ignores transforms, so the measurement is correct regardless of animation state.
      // offsetTop is sibling-relative; since the grid has no top padding, item 0 sits at
      // the grid's content top, so each row bottom relative to it is the grid's own height.
      const baseTop = items[0].offsetTop;
      const rowBottoms: number[] = [];
      let lastTop = -Infinity;

      for (const item of items) {
        const top = item.offsetTop - baseTop;
        const bottom = top + item.offsetHeight;
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
      // Full content height (bottom of the last row) — the expanded target.
      const lastBottom = rowBottoms[rowBottoms.length - 1];
      if (lastBottom > 0) {
        setFullHeight(lastBottom);
      }
    };

    // Defer one frame so the CSS grid finishes column resolution before we measure.
    const raf = requestAnimationFrame(measure);

    // Re-check whenever the element resizes (e.g. viewport width change).
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // Fonts can swap in after the first measure and nudge tile heights; re-measure
    // once they're ready so the collapsed height matches the final typography.
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Clip with `max-height` (not `height`): the box keeps its natural `auto` height so the
  // card grows with its content via flex, while max-height caps what's visible — collapsed →
  // two rows, expanded → full content (the cap equals the content, so nothing is hidden).
  // `undefined` (no cap) when the card fits. Using `height` instead made the explicit pixel
  // value a flex-basis that the card's `flex-1` inner column shrank back to the collapsed
  // size; max-height stays out of flex sizing. It also animates px↔px reliably (unlike the
  // old Framer number↔"auto" tween, which desynced when a toggle interrupted it).
  const clipMaxHeight = hasOverflow
    ? (expanded ? fullHeight : collapsedHeight) + LIFT_HEADROOM
    : undefined;

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

        <div
          className="overflow-hidden"
          style={{
            // Headroom for the hover lift, cancelled by an equal negative
            // margin so the resting layout (and the gap above row 1) is unchanged.
            paddingTop: LIFT_HEADROOM,
            marginTop: -LIFT_HEADROOM,
            maxHeight: clipMaxHeight,
            transition: shouldReduceMotion
              ? undefined
              : "max-height 450ms cubic-bezier(0.22, 1, 0.36, 1)",
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
        </div>

        {/* Keep category cards aligned without exposing an inert control to assistive tech. */}
        {hasOverflow ? (
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
            aria-expanded={expanded}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-md py-0 font-mono text-[0.65rem] uppercase tracking-widest text-text-muted transition-colors duration-150 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
        ) : (
          <div aria-hidden="true" className="mt-1 h-[0.9375rem]" />
        )}
      </div>
    </motion.div>
  );
}

/**
 * The Interpersonal category, rendered as a full-width band under the technical
 * cards. Deliberately styled apart from them: horizontal icon+label pills on an
 * accent-washed surface rather than a card of stacked square tiles, so it reads
 * as a different kind of skill rather than one more technical bucket.
 */
function InterpersonalBand({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) {
  const bandRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bandRef, { once: true, margin: "-60px" });
  const animateState = isInView && !shouldReduceMotion ? "visible" : "hidden";

  return (
    <motion.div
      ref={bandRef}
      variants={cardVariants}
      initial="hidden"
      animate={shouldReduceMotion ? "visible" : animateState}
      className="skills-interpersonal-card mt-4 rounded-xl px-4 py-4 sm:mt-5 sm:px-5 sm:py-5"
    >
      <h3 className="mb-4 font-mono text-[0.65rem] font-semibold uppercase tracking-widest text-accent">
        {INTERPERSONAL_CATEGORY}
      </h3>

      <motion.ul
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        aria-label={`${INTERPERSONAL_CATEGORY} skills`}
        variants={tileStaggerVariants}
        initial="hidden"
        animate={shouldReduceMotion ? "visible" : animateState}
      >
        {interpersonalSkills.map((skill) => {
          const iconPath = getSkillIcon(skill.name);
          return (
            <motion.li
              key={skill.name}
              variants={tileRevealVariants}
              className="list-none"
            >
              <div className="skills-interpersonal-pill flex h-full items-center gap-2.5 rounded-full py-2 pl-2 pr-3.5">
                <span className="skills-interpersonal-pill-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                  {iconPath ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[1.125rem] w-[1.125rem] fill-current text-accent"
                    >
                      <path d={iconPath} />
                    </svg>
                  ) : (
                    <span className="font-mono text-sm font-bold text-accent">
                      {skill.name.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="min-w-0 font-mono text-[0.65rem] font-medium leading-tight tracking-wide text-text-secondary">
                  {skill.name}
                </span>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
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

  // Default to 2 (the SSR/desktop value) so hydration matches; the layout effect
  // drops it to 1 on narrow viewports before the first paint.
  const [columnCount, setColumnCount] = useState(2);

  useIsomorphicLayoutEffect(() => {
    const mq = window.matchMedia(TWO_COLUMN_QUERY);
    const update = () => setColumnCount(mq.matches ? 2 : 1);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const categories = Array.from(grouped.entries());
  const columns = distributeIntoColumns(categories, columnCount);

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative isolate overflow-hidden bg-bg-base py-16 lg:py-24"
    >
      <SectionBackground />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={shouldReduceMotion ? false : "hidden"}
          animate={shouldReduceMotion ? "visible" : headerAnimateState}
          className="mb-10 lg:mb-14"
        >
          <SectionHeading
            headingId="skills-heading"
            eyebrow="SYS://SKILLS"
            title="Technical Skills"
            lead="The tools, languages, and platforms I work with."
          />
        </motion.div>

        {/* Independent flex columns (masonry-style): each column is its own
            vertical stack, so expanding a card only pushes down the cards below
            it in the same column — never the rest of the row. */}
        <div className="flex items-start gap-4 sm:gap-5">
          {columns.map((columnCategories, columnIndex) => (
            <div
              key={columnIndex}
              className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5"
            >
              {columnCategories.map(([category, categorySkills]) => (
                <SkillCategoryCard
                  key={category}
                  category={category}
                  categorySkills={categorySkills}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </div>
          ))}
        </div>

        <InterpersonalBand shouldReduceMotion={shouldReduceMotion} />
      </div>
    </section>
  );
}
