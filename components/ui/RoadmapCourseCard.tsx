"use client";

import Image from "next/image";
import { type CSSProperties, useCallback, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import type { RoadmapCourse } from "@/lib/content/types";

/**
 * A single compact course card for the learning roadmap (spec §8.5).
 *
 * Shows a media area (the course `image` when provided, otherwise a consistent gradient
 * fallback — never a broken image), the course name, and a small category label. The card is
 * non-interactive in this phase: there is no course detail page yet, so it carries no link.
 *
 * Long names are clipped to a single line. When the card is hovered (and the name is actually
 * wider than the card), the name scrolls sideways to reveal its end, then eases back to the
 * start — a gentle ping-pong that repeats while hovered. Disabled under `prefers-reduced-motion`.
 */

type RoadmapCourseCardProps = {
  course: RoadmapCourse;
  /** Id wired to the card title so the carousel item is named for assistive tech. */
  headingId: string;
};

/** Readable, unhurried scroll pace for the course name (CSS pixels per second). */
const SCROLL_SPEED_PX_PER_SECOND = 22;
/** Shortest full round-trip, so very slight overflow still reads as a deliberate motion. */
const MIN_SCROLL_DURATION_SECONDS = 3.5;

export function RoadmapCourseCard({ course, headingId }: RoadmapCourseCardProps) {
  const { name, category, image } = course;
  const nameRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const [scroll, setScroll] = useState<{ distance: number; duration: number } | null>(null);

  const startScroll = useCallback(() => {
    if (reduceMotion) return;
    const el = nameRef.current;
    if (!el) return;
    // Overflow of the single-line name beyond its clip box, in CSS pixels.
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow <= 1) {
      setScroll(null);
      return;
    }
    // ~42% of the timeline is spent travelling each way (the rest is a brief pause at the
    // ends), so the full round-trip lasts roughly (2 * travel) / 0.84 for a steady pace.
    const travel = overflow / SCROLL_SPEED_PX_PER_SECOND;
    const duration = Math.max(MIN_SCROLL_DURATION_SECONDS, (travel * 2) / 0.84);
    setScroll({ distance: overflow, duration });
  }, [reduceMotion]);

  const stopScroll = useCallback(() => {
    setScroll(null);
  }, []);

  return (
    <article
      aria-labelledby={headingId}
      className="roadmap-course-card"
      onMouseEnter={startScroll}
      onMouseLeave={stopScroll}
      onFocus={startScroll}
      onBlur={stopScroll}
    >
      <div
        aria-hidden="true"
        className="roadmap-course-media"
        data-has-image={image ? "true" : "false"}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 12rem, 10.5rem"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="roadmap-course-body">
        <span className="roadmap-course-category">{category}</span>
        <h4
          ref={nameRef}
          id={headingId}
          className="roadmap-course-name"
          data-scrolling={scroll ? "true" : "false"}
          style={
            scroll
              ? ({
                  "--course-name-distance": `-${scroll.distance}px`,
                  "--course-name-duration": `${scroll.duration}s`,
                } as CSSProperties)
              : undefined
          }
        >
          <span className="roadmap-course-name-text">{name}</span>
        </h4>
      </div>
    </article>
  );
}
