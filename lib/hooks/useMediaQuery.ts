"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media-query hook. Mirrors the `useSyncExternalStore` pattern used by the
 * About section's viewport hook: the server snapshot is `false`, so server-rendered
 * markup matches the "query does not match" branch and there is no hydration mismatch.
 * After hydration the store reads the live `matchMedia` result and re-renders if it
 * differs.
 *
 * Used by the Experience section to swap between the small-screen git-tree (the SSR /
 * no-JS baseline) and the large-screen tree layout — a progressive enhancement, so a
 * server snapshot of `false` (small layout) is the correct default.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
