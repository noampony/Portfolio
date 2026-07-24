"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const TYPE_CHAR_MS = 70;
const DELETE_CHAR_MS = 38;
const HOLD_MS = 2000;
// Reduced-motion crossfade dwell (no per-character typing) — a touch longer so
// each phrase is comfortably readable before it swaps.
const REDUCED_MOTION_HOLD_MS = 2600;

type Phase = "typing" | "deleting";

type TypewriterRotatorProps = {
  /** Phrases cycled through, in order. */
  phrases: readonly string[];
  /** Gate the animation start so it lines up with the rest of the Hero reveal. */
  start: boolean;
  className?: string;
};

/**
 * Rotating typewriter subtitle (Hero, §7.3). Types a phrase, holds it, deletes
 * it, then moves to the next — looping forever. Under `prefers-reduced-motion`
 * the phrases crossfade in full with no per-character motion. The animated text
 * is `aria-hidden`; a static, comma-joined list is exposed to assistive tech so
 * screen readers get the full set once instead of a stream of partial words.
 */
export function TypewriterRotator({
  phrases,
  start,
  className,
}: TypewriterRotatorProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  // Reduced motion: swap the full phrase on an interval, no typing/deleting.
  useEffect(() => {
    if (!start || !prefersReducedMotion || phrases.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % phrases.length);
    }, REDUCED_MOTION_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [start, prefersReducedMotion, index, phrases]);

  // Full typewriter state machine: type → hold → delete → next phrase.
  useEffect(() => {
    if (!start || prefersReducedMotion || phrases.length === 0) {
      return;
    }

    const current = phrases[index];
    let timer: number | undefined;

    if (phase === "typing") {
      if (displayed.length < current.length) {
        timer = window.setTimeout(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          TYPE_CHAR_MS,
        );
      } else {
        timer = window.setTimeout(() => setPhase("deleting"), HOLD_MS);
      }
    } else if (displayed.length > 0) {
      timer = window.setTimeout(
        () => setDisplayed(current.slice(0, displayed.length - 1)),
        DELETE_CHAR_MS,
      );
    } else {
      // Fully deleted — after a short beat, advance to the next phrase and type it.
      timer = window.setTimeout(() => {
        setIndex((current) => (current + 1) % phrases.length);
        setPhase("typing");
      }, TYPE_CHAR_MS);
    }

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [start, prefersReducedMotion, phase, displayed, index, phrases]);

  // Under reduced motion the full phrase is shown (swapped on an interval);
  // otherwise the per-character `displayed` state drives the typewriter.
  const shown =
    prefersReducedMotion && phrases.length > 0 ? phrases[index] : displayed;

  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span className="sr-only">{phrases.join(", ")}</span>
      {/* Terminal-style prompt mark leading each line (dev aesthetic, §7). */}
      <span aria-hidden="true" className="mr-2 font-mono text-accent opacity-80">
        &gt;
      </span>
      {/* Always carry a glyph (zero-width space when empty) so the flex
          baseline never collapses — otherwise the mark + cursor drop a hair
          each time the line finishes deleting, then snap back. */}
      <span aria-hidden="true">{shown || "\u200B"}</span>
      {!prefersReducedMotion ? (
        <span
          aria-hidden="true"
          className="hero-type-cursor ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] rounded-full bg-accent"
        />
      ) : null}
    </span>
  );
}
