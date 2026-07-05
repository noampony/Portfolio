"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
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
 * Carousel behaviour (spec §8.2, Task 5.3): the gallery auto-advances every 3s,
 * pausing while the carousel is hovered or has keyboard focus; prev/next buttons,
 * horizontal wheel/trackpad gestures, and touch swipes all move the active card;
 * `prefers-reduced-motion` disables autoplay and removes the arc transition while
 * keeping every manual navigation path fully functional.
 */

/** Number of cards shown on each side of the centre before a slide fades out. */
const VISIBLE_SIDE = 2;

/** Autoplay interval, per spec §8.2. */
const AUTOPLAY_MS = 3000;

/** Minimum horizontal wheel delta to count as an intentional navigation gesture. */
const WHEEL_THRESHOLD = 12;

/** Cooldown between wheel-triggered slide changes so one gesture doesn't fire many. */
const WHEEL_COOLDOWN_MS = 350;

/** Minimum horizontal swipe distance (px) to count as a touch navigation gesture. */
const SWIPE_THRESHOLD = 40;

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
  const total = impacts.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const baseId = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % total) + total) % total),
    [total],
  );
  const goNext = useCallback(() => setActiveIndex((prev) => (prev + 1) % total), [total]);
  const goPrev = useCallback(() => setActiveIndex((prev) => (prev - 1 + total) % total), [total]);

  // Autoplay: advances every 3s unless reduced motion is requested or the carousel is
  // being interacted with by mouse hover or keyboard focus (spec §8.2).
  useEffect(() => {
    if (reduceMotion || isHovered || isFocused) return;
    const id = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, isHovered, isFocused, goNext]);

  // Horizontal mouse wheel / trackpad navigation. Vertical-dominant gestures are left
  // alone so normal page scrolling over the carousel keeps working.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let cooling = false;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) < Math.abs(event.deltaY)) return;
      if (Math.abs(event.deltaX) < WHEEL_THRESHOLD || cooling) return;
      cooling = true;
      if (event.deltaX > 0) goNext();
      else goPrev();
      window.setTimeout(() => {
        cooling = false;
      }, WHEEL_COOLDOWN_MS);
    };

    track.addEventListener("wheel", handleWheel, { passive: true });
    return () => track.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const handleBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsFocused(false);
    }
  };

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          <button
            type="button"
            className="impact-gallery-arrow impact-gallery-arrow--prev"
            onClick={goPrev}
            aria-label="Show previous impact card"
          >
            <ArrowGlyph direction="left" />
          </button>

          <ul
            ref={trackRef}
            className="impact-gallery-track"
            role="group"
            aria-roledescription="carousel"
            aria-label="Career impact highlights"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {impacts.map((impact, index) => {
              const offset = circularOffset(index, activeIndex, total);
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
                      zIndex: total - abs,
                    } as React.CSSProperties
                  }
                >
                  <ImpactCard
                    impact={impact}
                    headingId={`${baseId}-impact-${index}`}
                    active={isActive}
                    onActivate={() => goTo(index)}
                  />
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="impact-gallery-arrow impact-gallery-arrow--next"
            onClick={goNext}
            aria-label="Show next impact card"
          >
            <ArrowGlyph direction="right" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function ArrowGlyph({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
