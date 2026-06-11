"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type SpotlightPosition = { x: number; y: number };

export function ExperienceSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<SpotlightPosition | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const section = el.closest("section");
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseLeave = () => setPosition(null);

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      ref={ref}
      className="experience-spotlight"
      style={
        position
          ? {
              background: `radial-gradient(280px circle at ${position.x}px ${position.y}px, color-mix(in srgb, var(--accent) 34%, white 8%) 0%, color-mix(in srgb, var(--accent) 18%, transparent) 45%, transparent 75%), radial-gradient(700px circle at ${position.x}px ${position.y}px, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 70%)`,
              opacity: 1,
            }
          : { opacity: 0 }
      }
    />
  );
}
