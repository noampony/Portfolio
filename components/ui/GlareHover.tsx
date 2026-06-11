"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

import { useReducedMotion } from "framer-motion";

interface GlareOptions {
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
}

function hexToRgba(glareColor: string, glareOpacity: number): string {
  const hex = glareColor.replace("#", "");
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }
  if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }
  return glareColor;
}

/**
 * Returns a ref for the glare overlay div + mouse event handlers to attach to the hover
 * container. Based on the React Bits GlareHover (Tailwind variant). Respects
 * `prefers-reduced-motion` — handlers are no-ops when the user prefers reduced motion.
 *
 * Usage: render `<div ref={overlayRef} style={overlayStyle} aria-hidden="true" />` as the
 * first child of a `position: relative; overflow: hidden` element, then spread `handlers`
 * onto the element (or its hover trigger parent).
 */
export function useGlareHandlers({
  glareColor = "#ffffff",
  glareOpacity = 0.32,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
}: GlareOptions = {}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const rgba = hexToRgba(glareColor, glareOpacity);

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
  };

  const handleEnter = () => {
    if (prefersReducedMotion) return;
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `${transitionDuration}ms ease`;
        el.style.backgroundPosition = "100% 100%, 0 0";
      });
    });
  };

  const handleLeave = () => {
    if (prefersReducedMotion) return;
    const el = overlayRef.current;
    if (!el) return;
    if (playOnce) {
      el.style.transition = "none";
      el.style.backgroundPosition = "-100% -100%, 0 0";
    } else {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = "-100% -100%, 0 0";
    }
  };

  return {
    overlayRef,
    overlayStyle,
    handlers: {
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
    },
  };
}

interface GlareHoverProps extends GlareOptions {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Standalone GlareHover wrapper — matches the React Bits GlareHover API. Wraps children
 * in a `position: relative; overflow: hidden` div and injects the animated glare overlay.
 * For cards that already carry their own layout/style, use `useGlareHandlers` directly.
 */
export default function GlareHover({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.32,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className,
  style,
}: GlareHoverProps) {
  const { overlayRef, overlayStyle, handlers } = useGlareHandlers({
    glareColor,
    glareOpacity,
    glareAngle,
    glareSize,
    transitionDuration,
    playOnce,
  });

  return (
    <div
      className={`relative overflow-hidden${className ? ` ${className}` : ""}`}
      style={style}
      {...handlers}
    >
      <div ref={overlayRef} style={overlayStyle} aria-hidden="true" />
      {children}
    </div>
  );
}
