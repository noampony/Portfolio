"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";

import type { RoadmapCourse } from "@/lib/content/types";
import { RoadmapCourseCard } from "@/components/ui/RoadmapCourseCard";

/**
 * A fanned deck of course cards for one learning path (spec §8.5).
 *
 * The cards overlap left to right in course order, each slightly rotated, like a hand of
 * playing cards. One card is always *focused*: it comes to the front, stands straight, lifts a
 * little, and shows its full name. The first course starts focused, so one full name is always
 * readable with no action.
 *
 * Ways to change the focused card:
 * - mouse: hover a card (hovering the deck also spreads the fan a bit, in CSS);
 * - touch / click: tap a card;
 * - keyboard: Tab reaches the focused card (roving tabindex), Left/Right move, Home/End jump;
 * - the small `‹ 03 / 07 ›` controls under the deck (easy to hit on a phone).
 *
 * Layout lives in CSS (`.roadmap-deck*`): all cards share one grid cell and are moved with
 * `transform` only, so the deck height is the card height and focusing never shifts layout.
 * The gap between cards comes from the column width (container query units), so the fan
 * always fits its column. Each card gets its index through `--i`; the deck gets the card count
 * through `--n`.
 */

type CourseDeckProps = {
  courses: RoadmapCourse[];
  /** Path title, used to name the list and the controls for assistive tech. */
  label: string;
};

export function CourseDeck({ courses, label }: CourseDeckProps) {
  const baseId = useId();
  const hintId = `${baseId}-hint`;
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const count = courses.length;

  /** Make `index` the focused card; optionally move keyboard focus to it too. */
  const focusCard = useCallback(
    (index: number, moveFocus: boolean) => {
      const next = Math.min(Math.max(index, 0), count - 1);
      setFocusedIndex(next);
      if (moveFocus) {
        cardRefs.current[next]?.focus();
      }
    },
    [count],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      const keyToIndex: Record<string, number> = {
        ArrowRight: focusedIndex + 1,
        ArrowDown: focusedIndex + 1,
        ArrowLeft: focusedIndex - 1,
        ArrowUp: focusedIndex - 1,
        Home: 0,
        End: count - 1,
      };
      const target = keyToIndex[event.key];
      if (target === undefined) return;
      event.preventDefault();
      focusCard(target, true);
    },
    [count, focusCard, focusedIndex],
  );

  // Hover focuses a card only for a real mouse; touch taps go through onClick instead, so a
  // tap doesn't fire both.
  const onPointerEnter = useCallback(
    (event: PointerEvent<HTMLLIElement>, index: number) => {
      if (event.pointerType === "mouse") {
        focusCard(index, false);
      }
    },
    [focusCard],
  );

  if (count === 0) {
    return null;
  }

  const counterLabel = (value: number) => String(value).padStart(2, "0");

  return (
    <div className="roadmap-deck" style={{ "--n": count } as CSSProperties}>
      {count > 1 ? (
        <p id={hintId} className="sr-only">
          Use the left and right arrow keys to browse the courses.
        </p>
      ) : null}
      <ul
        className="roadmap-deck-stack"
        role="list"
        aria-label={`${label} courses`}
        aria-describedby={count > 1 ? hintId : undefined}
        onKeyDown={onKeyDown}
      >
        {courses.map((course, index) => {
          const focused = index === focusedIndex;
          return (
            <li
              key={course.name}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="roadmap-deck-item"
              data-focused={focused ? "true" : "false"}
              // `--z`: the closer a card is to the focused one, the higher it sits, so each
              // card shows an edge that steps away from the focus on both sides.
              style={{ "--i": index, "--z": count - Math.abs(index - focusedIndex) } as CSSProperties}
              tabIndex={focused ? 0 : -1}
              aria-labelledby={`${baseId}-${index}`}
              aria-current={focused ? "true" : undefined}
              onPointerEnter={(event) => onPointerEnter(event, index)}
              onClick={() => focusCard(index, false)}
              onFocus={() => focusCard(index, false)}
            >
              <RoadmapCourseCard
                course={course}
                headingId={`${baseId}-${index}`}
                focused={focused}
              />
            </li>
          );
        })}
      </ul>

      {count > 1 ? (
        <div className="roadmap-deck-controls">
          <button
            type="button"
            className="roadmap-deck-arrow"
            onClick={() => focusCard(focusedIndex - 1, false)}
            disabled={focusedIndex === 0}
            aria-label={`Previous ${label} course`}
          >
            <ArrowGlyph direction="left" />
          </button>
          <span className="roadmap-deck-counter" aria-hidden="true">
            {counterLabel(focusedIndex + 1)} / {counterLabel(count)}
          </span>
          <button
            type="button"
            className="roadmap-deck-arrow"
            onClick={() => focusCard(focusedIndex + 1, false)}
            disabled={focusedIndex === count - 1}
            aria-label={`Next ${label} course`}
          >
            <ArrowGlyph direction="right" />
          </button>
        </div>
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
