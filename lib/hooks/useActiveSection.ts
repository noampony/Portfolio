"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll-spy for the primary navbar (spec §5.4): tracks which homepage section is
 * currently in view so the matching nav item can highlight.
 *
 * Detection is deterministic rather than IntersectionObserver-based: on each
 * (rAF-throttled) scroll we pick the last section whose top has crossed a
 * detection line ~30% down the viewport — the section occupying the upper part of
 * the screen — with a bottom-of-page guard so a short final section (e.g. Contact)
 * still activates. This avoids the "dead band" gaps a single-threshold observer
 * leaves and keeps the active item unambiguous. While viewing the Hero (before
 * `sectionIds[0]`'s top crosses the line) nothing has crossed yet, so `activeId`
 * stays `null` and no nav item is highlighted — there is no "Home" item to light
 * up for that state (see lib/navigation.ts).
 *
 * {@link selectSection} performs the scroll itself (rather than leaving it to the
 * clicked anchor's native "hash changed" navigation): it sets the active id
 * immediately and holds it while it smooth-scrolls to the target, so the active
 * indicator moves straight to the clicked item instead of flickering through
 * every section it passes. Live tracking resumes once the target is reached (or
 * after a safety timeout, in case the target can't reach the detection line).
 *
 * Doing the scroll imperatively (instead of relying on the browser's native
 * anchor-scroll, which only fires on an actual `hash` *change*) matters because
 * the native behaviour silently no-ops when the URL hash already equals the
 * clicked link's target — e.g. clicking "Home", scrolling away by hand (which
 * doesn't touch the hash), then clicking "Home" again would otherwise do
 * nothing. Computing the target scroll position from `--navbar-height` (kept in
 * sync by {@link Navbar}) reproduces the same flush alignment `scroll-padding-top`
 * gives native anchor jumps, but unconditionally.
 *
 * `sectionIds` must be a stable reference (a module-level constant) — it is the
 * effect dependency.
 */
export function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const releaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;

      // Detection line ~30% down the viewport (clamped so it always clears the
      // sticky navbar on short screens).
      const line = Math.max(120, window.innerHeight * 0.3);

      // Starts `null` (not `sectionIds[0]`) so nothing is highlighted while still
      // viewing the Hero, above the first tracked section.
      let next: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - 1 <= line) {
          next = id;
        }
      }

      // Bottom guard: when the page can't scroll any further, the last section is
      // the one being viewed even if it never reached the detection line.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        next = sectionIds[sectionIds.length - 1] ?? next;
      }

      // While a nav click is in flight, hold the selected id until we arrive.
      if (pendingRef.current) {
        if (next === pendingRef.current) {
          pendingRef.current = null; // arrived → resume live tracking
        } else {
          return; // still travelling → keep showing the target
        }
      }

      setActiveId(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(compute);
    };

    compute(); // establish the initial active section on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  const selectSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    pendingRef.current = id;
    setActiveId(id);
    if (releaseTimerRef.current) {
      window.clearTimeout(releaseTimerRef.current);
    }
    // Safety release so tracking never gets stuck if the target can't reach the
    // detection line (e.g. a short final section at the bottom of the page).
    releaseTimerRef.current = window.setTimeout(() => {
      pendingRef.current = null;
    }, 1200);

    // Scroll ourselves instead of leaving it to the anchor's native hash
    // navigation (see the module doc comment for why). `--navbar-height` is the
    // sticky header's real measured height, kept in sync by Navbar.
    const navbarHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
      ) || 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    // Keep the URL shareable without adding a history entry per click (would
    // spam the back button) or re-triggering a native anchor scroll.
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (releaseTimerRef.current) {
        window.clearTimeout(releaseTimerRef.current);
      }
    };
  }, []);

  return { activeId, selectSection };
}
