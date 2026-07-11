"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

/**
 * Cursor-reactive glow — a soft accent radial that follows the pointer across
 * its host `<section>`, fading in while the pointer is inside. Placed as a
 * sibling right after `<SectionBackground />` so it paints above the ambient
 * layers but behind the content.
 *
 * Zero React state: a rAF-throttled `pointermove` writes `--spot-x/--spot-y`
 * onto the glow element itself, and enter/leave toggle a `data-active` attr the
 * CSS fades on. Gated to hover-capable fine pointers and off under reduced
 * motion — the component renders nothing at all when gated (the server and
 * first client render both return null, so hydration stays stable).
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const active = finePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const paint = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${pointerX - rect.left}px`);
      el.style.setProperty("--spot-y", `${pointerY - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onEnter = () => el.setAttribute("data-active", "true");
    const onLeave = () => el.removeAttribute("data-active");

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  if (!active) return null;

  return <div ref={ref} aria-hidden="true" className="section-cursor-glow" />;
}
