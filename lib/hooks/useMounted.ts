"use client";

import { useSyncExternalStore } from "react";

/** No-op subscribe: the value never changes after the first client render. */
const subscribe = () => () => {};

/**
 * SSR-safe "has the client hydrated yet?" flag. Returns `false` on the server and on the
 * first client render (so the markup matches and there is no hydration mismatch), then
 * `true` afterwards. Mirrors the `useSyncExternalStore` pattern in `useMediaQuery`.
 *
 * Used to gate progressive enhancement: the Experience cards render their full detail
 * inline (visible, no JS needed) until this flips `true`, then switch to the compact
 * card + on-demand expanded overlay.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
