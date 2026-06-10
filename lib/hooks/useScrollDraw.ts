"use client";

import { useSyncExternalStore, type RefObject } from "react";

import {
  useReducedMotion,
  useScroll,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";

/** No-op subscribe + a client/server-split snapshot: `false` on the server, `true` once
 *  hydrated. Mirrors the `useSyncExternalStore` pattern in `useMediaQuery`, and avoids a
 *  `setState`-in-effect (which the lint config forbids). */
const noop = () => () => {};
function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/**
 * Scroll-progress source for the Experience git-tree "draw on scroll" animation
 * (ExperienceGitNode / ExperienceTreeGraph). Returns the element's 0→1 scroll progress
 * plus an `active` flag that is only true once mounted *and* motion is allowed.
 *
 * Callers always build their `useTransform` MotionValues from `progress` (hooks can't be
 * conditional), but only bind them to `style` when `active` is true — so the server render,
 * the first client render (pre-mount, avoiding a hydration mismatch) and reduced-motion all
 * fall back to the CSS defaults, which paint the graph fully drawn (the original look).
 */
export function useScrollDraw(
  ref: RefObject<HTMLElement | null>,
  offset: UseScrollOptions["offset"] = ["start 0.85", "start 0.4"],
): { active: boolean; progress: MotionValue<number> } {
  const reduceMotion = useReducedMotion();
  const mounted = useMounted();

  const { scrollYProgress } = useScroll({ target: ref, offset });

  return { active: mounted && !reduceMotion, progress: scrollYProgress };
}
