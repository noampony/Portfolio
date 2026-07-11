"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

/**
 * Magnetic hover wrapper — the child subtly attracts toward the cursor with a
 * spring (clamped to a few px) and settles back on leave. Transform-only, so no
 * layout shift; the wrapper itself is never focusable and adds no semantics.
 *
 * Gated to hover-capable fine pointers and off under reduced motion — in both
 * cases the handlers simply never fire, and the DOM shape stays identical so
 * hydration is stable (`useMediaQuery`'s server snapshot is `false`).
 */
type MagneticProps = {
  children: ReactNode;
  /** Maximum pull in px at the element's edge. */
  strength?: number;
  className?: string;
};

export function Magnetic({ children, strength = 5, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const active = finePointer && !prefersReducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22 });
  const springY = useSpring(y, { stiffness: 260, damping: 22 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, relX)) * strength);
    y.set(Math.max(-1, Math.min(1, relY)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.div>
  );
}
