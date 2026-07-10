"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { SECTION_NAV_ITEMS, RESUME_NAV_LABEL } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Accessible mobile navigation menu (spec §5.5, §20.2–§20.3).
 *
 * Rendered only below the `lg` breakpoint (the desktop navbar keeps its inline
 * list above it). Driven by the same {@link SECTION_NAV_ITEMS} config as the
 * desktop navbar, and shares its scroll-spy active state and resume-modal trigger
 * (passed down from {@link Navbar}) so both stay in lockstep.
 *
 * Behaviour (spec §5.5 + §20.2–§20.3):
 *  - Toggles open/closed via pointer and keyboard.
 *  - Closes when an item is selected, on outside click, and on Escape.
 *  - Moves focus into the panel on open and back to the toggle on Escape; focus
 *    is **not** trapped, so Tab can still leave the menu (§20.2).
 *  - The panel is only in the DOM while open, so it never permanently blocks
 *    primary content.
 */

type MobileNavProps = {
  className?: string;
  /** Section id currently in view (scroll-spy), or `null`. */
  activeId: string | null;
  /** Called when a section link is chosen (updates scroll-spy immediately). */
  onSelectSection: (id: string) => void;
  /** Opens the shared resume preview modal. */
  onOpenResume: () => void;
  /** Whether the resume modal is open (drives the Resume item's `aria-expanded`). */
  resumeOpen: boolean;
};

export function MobileNav({
  className,
  activeId,
  onSelectSection,
  onOpenResume,
  resumeOpen,
}: MobileNavProps) {
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
            {SECTION_NAV_ITEMS.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    aria-current={active ? "true" : undefined}
                    onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                      // Scroll imperatively (see useActiveSection's doc comment)
                      // instead of relying on the link's native hash navigation,
                      // which no-ops when the hash is already the clicked target.
                      // Modified clicks (open in new tab, etc.) pass through untouched.
                      if (
                        event.defaultPrevented ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      ) {
                        return;
                      }
                      event.preventDefault();
                      onSelectSection(item.id);
                      close();
                    }}
                    className={cn(
                      "block rounded-md px-3 py-2 text-body text-text-secondary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent",
                      active && "nav-spotlight font-medium text-accent",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-1 border-t border-border pt-2">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={resumeOpen}
                onClick={() => {
                  onOpenResume();
                  close();
                }}
                className="nav-resume-cta flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent"
              >
                {RESUME_NAV_LABEL}
                <ResumeIcon />
              </button>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Decorative résumé glyph; the button label carries the accessible name. */
function ResumeIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
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
