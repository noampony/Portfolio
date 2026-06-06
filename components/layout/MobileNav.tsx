"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Accessible mobile navigation menu (spec §5.5, §20.2–§20.3).
 *
 * Rendered only below the `md` breakpoint (the desktop navbar keeps its inline
 * list above it). Driven by the same {@link NAV_ITEMS} config as the desktop
 * navbar — the single source of truth lives in lib/navigation.ts, so disabled
 * items (e.g. Resume, §5.7) and "targets must exist" stay consistent across both.
 *
 * Visual style is **TBD** (§5.5); this uses a conventional, non-branded
 * slide-down panel anchored under the header rather than inventing flourishes.
 *
 * Behaviour (spec §5.5 + §20.2–§20.3):
 *  - Toggles open/closed via pointer and keyboard.
 *  - Closes when a nav item is selected, on outside click, and on Escape.
 *  - Moves focus into the panel on open and back to the toggle on Escape; focus
 *    is **not** trapped, so Tab can still leave the menu (§20.2).
 *  - The panel is only in the DOM while open, so it never permanently blocks
 *    primary content.
 */

/**
 * Route-based active match (mirrors the desktop navbar). Only real routes can be
 * "active"; in-page anchors would need scroll-spy, which is out of scope here.
 */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.disabled || item.href === null || item.href.startsWith("#")) {
    return false;
  }
  return item.href === pathname;
}

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const close = () => setOpen(false);

  // Outside-click + Escape close, only while open. Escape returns focus to the
  // toggle so keyboard users are never stranded.
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Move focus into the panel when it opens (first focusable item, else the
  // panel itself). This is a focus move, not a trap — focus can Tab out freely.
  useEffect(() => {
    if (!open) return;
    const target =
      panelRef.current?.querySelector<HTMLElement>('a[href], button:not([disabled])') ??
      panelRef.current;
    target?.focus();
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center justify-center rounded-sm p-2 text-text-secondary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
      >
        <MenuIcon open={open} />
      </button>

      {open ? (
        <div
          id={panelId}
          ref={panelRef}
          tabIndex={-1}
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border border-border bg-bg-surface-raised p-2 shadow-lg outline-none"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              if (item.disabled || item.href === null) {
                // TBD target (e.g. Resume, §5.7): present per §5.1 but never a
                // dead link — non-interactive, muted, with an SR-only status.
                return (
                  <li key={item.id}>
                    <span
                      aria-disabled="true"
                      title={
                        item.disabledReason
                          ? `${item.label} — ${item.disabledReason}`
                          : undefined
                      }
                      className="block cursor-not-allowed rounded-sm px-3 py-2 text-body text-text-muted"
                    >
                      {item.label}
                      {item.disabledReason ? (
                        <span className="sr-only"> ({item.disabledReason})</span>
                      ) : null}
                    </span>
                  </li>
                );
              }

              const active = isActive(item, pathname);

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={close}
                    className={cn(
                      "block rounded-sm px-3 py-2 text-body text-text-secondary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent",
                      active && "font-medium text-accent",
                    )}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Decorative hamburger / close glyph; the button carries the accessible name. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}
