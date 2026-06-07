"use client";

import { useSyncExternalStore } from "react";

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getServerSnapshot);
}

function getReducedMotionMediaQuery() {
  return window.matchMedia("(prefers-reduced-motion: reduce)");
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = getReducedMotionMediaQuery();

  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return getReducedMotionMediaQuery().matches;
}

function getServerSnapshot() {
  return false;
}
