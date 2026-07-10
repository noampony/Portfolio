"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** Appear once the page has scrolled roughly past the Hero section. */
const SHOW_THRESHOLD_PX = 480;

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * Floating "back to top" action, mounted once in the root layout so it's
 * available from anywhere on the page. Fades in after the user scrolls past the
 * Hero and scrolls back to the very top on click.
 *
 * Stands in for the removed "Home" navbar item (spec §5.1 follow-up): the logo
 * already scrolls to the top on click, and this button covers the "jump back
 * up" case from deep in the page without needing a dedicated nav item.
 */
export function ScrollToTopButton() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setVisible(window.scrollY > SHOW_THRESHOLD_PX);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update(); // establish initial visibility on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  function handleClick() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    // Drop any section hash so the URL reflects the top of the page.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Back to top"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="scroll-to-top-button fixed bottom-6 right-6 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border text-text-secondary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
        >
          <ArrowUpIcon />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}
