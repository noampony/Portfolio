"use client";

/**
 * Always-visible floating trigger for the business card (spec §7.6, §8.9).
 * A horizontal "Reach Out" pill (id-card icon + text) fixed at the bottom
 * center of the viewport — same size and shape at every screen width (owner
 * request). Clicking it expands the card up out of the button
 * ({@link FloatingCard} anchors to the same bottom-center point and scales
 * from a bottom-center origin).
 *
 * Activates on click/Enter/Space — nothing is hover-only — and exposes the
 * card relationship via `aria-haspopup`/`aria-expanded`. Focus returns here
 * automatically when the native `<dialog>` card closes.
 */

import type { RefObject } from "react";

type CardTriggerProps = {
  /** Whether the card is currently open (drives `aria-expanded`). */
  open: boolean;
  onClick: () => void;
  /**
   * Handle to the button so {@link FloatingCard} can mark it `data-no-ring`
   * before the closing card restores focus here (see globals.css). The marker
   * is dropped as soon as focus leaves, so focusing the button on its own terms
   * still shows the ring.
   */
  buttonRef?: RefObject<HTMLButtonElement | null>;
};

/**
 * Drop the suppression once focus leaves: the next time the button is focused
 * (tabbing back to it, say) it is genuine keyboard focus and earns the ring.
 */
function clearRingSuppression(event: { currentTarget: HTMLButtonElement }) {
  event.currentTarget.removeAttribute("data-no-ring");
}

export function CardTrigger({ open, onClick, buttonRef }: CardTriggerProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={onClick}
      onBlur={clearRingSuppression}
      className="business-card-trigger fixed z-30"
    >
      <IdCardIcon />
      <span className="business-card-trigger-label">Reach Out</span>
    </button>
  );
}

/** Decorative contact-card glyph; the button's label carries the name. */
function IdCardIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5.5 16c.5-1.5 1.5-2 2.5-2s2 .5 2.5 2" />
      <line x1="14" y1="9" x2="18.5" y2="9" />
      <line x1="14" y1="12.5" x2="18.5" y2="12.5" />
    </svg>
  );
}
