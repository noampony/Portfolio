"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { impacts } from "@/lib/content/data/impact";
import { SectionBackground } from "@/components/layout/SectionBackground";
import { ImpactCard } from "@/components/ui/ImpactCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { easeOut, staggerContainerVariants } from "@/lib/motion";

/**
 * My Impact section (spec §8.2) — replaces the former About section. Every career
 * impact from the validated content model is rendered as a card inside a Circular
 * Gallery (React Bits "Circular Gallery" style, implemented locally): cards fan out
 * along a 3D arc, the centre card upright and fully readable, the rest rotated and
 * dimmed but still present.
 *
 * Carousel behaviour (spec §8.2, Task 5.3): the gallery auto-advances every 5s,
 * pausing while the carousel is hovered or has keyboard focus, and only once the
 * gallery has actually scrolled into view (so a slow scroll to the section never
 * "steals" the first card before the visitor has seen it); prev/next buttons,
 * horizontal wheel/trackpad gestures, and touch swipes all move the active card;
 * `prefers-reduced-motion` disables autoplay and removes the arc transition while
 * keeping every manual navigation path fully functional.
 */

/** Number of cards shown on each side of the centre before a slide fades out. */
const VISIBLE_SIDE = 2;

/** Extra side card shown once the viewport is wide enough to fit it (spec §8.2). */
const VISIBLE_SIDE_WIDE = 3;

/** Minimum viewport width (px) at which the wider, 7-card arc is used. */
const WIDE_LAYOUT_QUERY = "(min-width: 1440px)";

/** Non-linear translateX step per depth level — tapers so the gap between the 2nd/3rd
 *  cards visually matches the gap between the centre and 1st card, compensating for
 *  the scale/rotation shrink applied at each depth (indexed by `abs`). */
const STEP_MULTIPLIERS = [0, 1, 1.65, 2.15];

/** Autoplay interval, per spec §8.2. */
const AUTOPLAY_MS = 5000;

/** Minimum horizontal wheel delta to count as an intentional navigation gesture. */
const WHEEL_THRESHOLD = 12;

/** Cooldown between wheel-triggered slide changes so one gesture doesn't fire many. */
const WHEEL_COOLDOWN_MS = 350;

/** Minimum horizontal swipe distance (px) to count as a touch navigation gesture. */
const SWIPE_THRESHOLD = 40;

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
  const [hasEnteredView, setHasEnteredView] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [visibleSide, setVisibleSide] = useState(VISIBLE_SIDE);
  const baseId = useId();
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Widen the arc to show one more card on each side once there's room for it.
  useEffect(() => {
    const query = window.matchMedia(WIDE_LAYOUT_QUERY);
    const update = () => setVisibleSide(query.matches ? VISIBLE_SIDE_WIDE : VISIBLE_SIDE);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Detect when the gallery first scrolls into view, independent of the entrance
  // animation above — a dedicated observer with no negative margin so autoplay can
  // start as soon as any part of the carousel is actually on screen.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % total) + total) % total),
    [total],
  );
  const goNext = useCallback(() => setActiveIndex((prev) => (prev + 1) % total), [total]);
  const goPrev = useCallback(() => setActiveIndex((prev) => (prev - 1 + total) % total), [total]);

  // Autoplay: advances every 5s unless reduced motion is requested, the carousel is
  // being interacted with by mouse hover or keyboard focus, or the gallery hasn't
  // scrolled into view yet — otherwise the timer could burn through cards before the
  // visitor ever sees the first one (spec §8.2).
  useEffect(() => {
    if (reduceMotion || isHovered || isFocused || !hasEnteredView) return;
    const id = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, isHovered, isFocused, hasEnteredView, goNext]);

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
      className="impact-section relative isolate overflow-hidden bg-bg-base py-16 lg:py-24"
    >
      <SectionBackground />

      <div className="site-shell relative z-10">
        <motion.div
          className="impact-header max-w-measure"
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainerVariants}
        >
          <SectionHeading
            headingId="impact-heading"
            eyebrow="SYS://IMPACT"
            title="My Impact"
            lead={
              <>Work I&apos;m proud of from across my career - and what each piece changed.</>
            }
          />
        </motion.div>

        <motion.div
          ref={galleryRef}
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
              const isVisible = abs <= visibleSide;
              const step = STEP_MULTIPLIERS[abs] ?? abs;
              const adjustedOffset = Math.sign(offset) * step;

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
                      "--offset": adjustedOffset,
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
