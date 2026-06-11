"use client";

import { type ReactNode, useRef } from "react";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Viewport-fixed blur band that is active only while the wrapped content is being scrolled.
 *
 * A `position: fixed` overlay sits at the bottom ~35% of the viewport.
 * `backdrop-filter: blur()` on a fixed element operates at the viewport composite level,
 * so it correctly blurs all content behind it — including flip cards promoted to separate
 * GPU compositing layers (the issue that broke the previous sibling-overlay approach).
 *
 * Effect: as the user scrolls down through the tree, new elements enter from below and
 * appear blurred through the frosted band. As they scroll upward past the band they
 * emerge sharp. The band fades in when the tree enters the viewport and fades out when
 * the tree has fully passed the band's position.
 *
 * The blur band must NOT be a descendant of any element with a CSS `filter` or
 * `transform`, as those create a new containing block that breaks `position: fixed`.
 * This component deliberately places the band as a sibling of `{children}`, outside
 * any transform/filter wrapper.
 *
 * Reduced-motion: band is never mounted; children render as-is.
 */
export function ScrollGradualBlur({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 0 = tree top just crossing the viewport bottom (first element entering)
  // 1 = tree bottom at 65% viewport height (blur band fully above all content)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end 0.65"],
  });

  // Fade the band in quickly as the tree enters, hold it, fade out as the last
  // element clears the blur line.
  const opacity = useTransform(scrollYProgress, [0, 0.04, 0.88, 1], [0, 1, 1, 0]);

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <div ref={containerRef}>
      {children}

      {/* Viewport-fixed blur band — covers the bottom ~35% of the screen.
          The gradient mask makes the blur appear gradually from ~top of the band
          down to the viewport edge, giving a cinematic "frosted curtain" look. */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35vh",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, black 65%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 30%, black 65%)",
          pointerEvents: "none",
          zIndex: 30,
          opacity,
        }}
      />
    </div>
  );
}
