"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

import { easeOut } from "@/lib/motion";

/**
 * Animated number count-up. The final value is server-rendered (SEO, no-JS and
 * reduced-motion users always see the real number); when `start` flips true the
 * digits roll 0 → value by mutating `textContent` only — no re-renders, no
 * hydration mismatch, and no layout shift (host pills have fixed footprints;
 * `tabular-nums` keeps digit widths steady while rolling).
 */
type CountUpProps = {
  value: number;
  suffix?: string;
  /** Seconds to wait after `start` before rolling (ride the host's own reveal delay). */
  delay?: number;
  /** Gate: the roll plays once, the first time this is true. */
  start?: boolean;
  duration?: number;
};

export function CountUp({
  value,
  suffix = "",
  delay = 0,
  start = true,
  duration = 1.1,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  const prefersReducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!start || prefersReducedMotion || played.current) return;
    const el = ref.current;
    if (!el) return;
    played.current = true;

    // Zero out right away so the roll never flashes the final value first
    // (the host is still invisible at this point — its own reveal shares `delay`).
    el.textContent = `0${suffix}`;
    const controls = animate(0, value, {
      duration,
      delay,
      ease: easeOut,
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [start, prefersReducedMotion, value, suffix, delay, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {`${value}${suffix}`}
    </span>
  );
}
