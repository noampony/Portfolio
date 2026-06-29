"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import type { RoadmapCourse } from "@/lib/content/types";
import { RoadmapCourseCard } from "@/components/ui/RoadmapCourseCard";

/**
 * Horizontal, scroll-snapping carousel of compact course cards for one learning path
 * (spec §8.5). Native overflow scrolling (swipe / trackpad / scrollbar) is the primary
 * interaction; prev/next arrow buttons are a progressive enhancement.
 *
 * The arrow buttons scroll the track by roughly a viewport-width and disable at each end.
 * When all cards already fit, both arrows hide. The track is itself focusable and labelled
 * so keyboard users can scroll it with the arrow keys. Arrow-button scrolling is smooth, but
 * downgraded to an instant jump under `prefers-reduced-motion`.
 */

type CourseCarouselProps = {
  courses: RoadmapCourse[];
  /** Accessible label for the scrollable region, e.g. the path title. */
  label: string;
};

/** A small slop so float rounding at the track edges doesn't leave an arrow stuck enabled. */
const EDGE_EPSILON = 2;

export function CourseCarousel({ courses, label }: CourseCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, clientWidth, scrollWidth } = track;
    setCanScrollLeft(scrollLeft > EDGE_EPSILON);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - EDGE_EPSILON);
  }, []);

  // Recompute arrow availability on mount and whenever the track resizes (responsive widths,
  // font swaps). `onScroll` handles the during-scroll updates.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateScrollState();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);
    return () => observer.disconnect();
  }, [updateScrollState]);

  const scrollByDirection = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      // Scroll ~85% of the visible width so a card stays partially in view as an anchor.
      const amount = track.clientWidth * 0.85 * direction;
      track.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion],
  );

  const showArrows = canScrollLeft || canScrollRight;

  return (
    <div
      className="roadmap-carousel"
      // Reserve the prev/next arrow gutters even when the arrows are hidden, so a path
      // whose cards all fit starts at the same horizontal offset as one that scrolls.
      data-arrows={showArrows || undefined}
    >
      {showArrows ? (
        <button
          type="button"
          className="roadmap-carousel-arrow roadmap-carousel-arrow--prev"
          onClick={() => scrollByDirection(-1)}
          disabled={!canScrollLeft}
          aria-label={`Scroll ${label} courses left`}
        >
          <ArrowGlyph direction="left" />
        </button>
      ) : null}

      <ul
        ref={trackRef}
        className="roadmap-carousel-track"
        role="group"
        aria-label={`${label} courses`}
        tabIndex={0}
        onScroll={updateScrollState}
      >
        {courses.map((course, index) => (
          <li key={course.name} className="roadmap-carousel-item">
            <RoadmapCourseCard course={course} headingId={`${baseId}-${index}`} />
          </li>
        ))}
      </ul>

      {showArrows ? (
        <button
          type="button"
          className="roadmap-carousel-arrow roadmap-carousel-arrow--next"
          onClick={() => scrollByDirection(1)}
          disabled={!canScrollRight}
          aria-label={`Scroll ${label} courses right`}
        >
          <ArrowGlyph direction="right" />
        </button>
      ) : null}
    </div>
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
