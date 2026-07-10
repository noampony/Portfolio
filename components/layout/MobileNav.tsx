"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
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
 *  - Toggles open/closed via pointer and keyboard; the hamburger glyph morphs
 *    into a close cross and the panel scales in from the toggle with a staggered
 *    item cascade (all Framer Motion transform/opacity, zero-duration under
 *    reduced motion).
 *  - Closes when an item is selected, on outside click, and on Escape.
 *  - Moves focus into the panel on open and back to the toggle on Escape; focus
 *    is **not** trapped, so Tab can still leave the menu (§20.2).
 *  - The panel is only in the DOM while open (plus its brief exit animation), so
 *    it never permanently blocks primary content.
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

const listVariants: Variants = {
  closed: {},
  open: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 14 },
  open: { opacity: 1, x: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};

export function MobileNav({
  className,
  activeId,
  onSelectSection,
  onOpenResume,
  resumeOpen,
}: MobileNavProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
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
        className="mobile-nav-toggle inline-flex items-center justify-center rounded-md p-2.5 text-text-secondary outline-none transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-accent"
      >
        <MenuIcon open={open} reduced={prefersReducedMotion} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            ref={panelRef}
            tabIndex={-1}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
            }
            className="mobile-nav-panel absolute right-0 top-full z-50 mt-3 w-64 origin-top-right rounded-xl p-2 outline-none"
          >
            <motion.ul
              className="flex flex-col gap-0.5"
              variants={prefersReducedMotion ? undefined : listVariants}
              initial="closed"
              animate="open"
            >
              {SECTION_NAV_ITEMS.map((item) => {
                const active = item.id === activeId;
                return (
                  <motion.li
                    key={item.id}
                    variants={prefersReducedMotion ? undefined : itemVariants}
                  >
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
                        "mobile-nav-item group/item flex items-center gap-2.5 rounded-lg px-3 py-2 text-body text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent",
                        active && "nav-spotlight font-medium text-accent hover:text-accent",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-1 w-1 shrink-0 rounded-full bg-current transition-opacity",
                          active
                            ? "opacity-100"
                            : "opacity-30 group-hover/item:opacity-70",
                        )}
                      />
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
              <motion.li
                variants={prefersReducedMotion ? undefined : itemVariants}
                className="mt-1.5 border-t border-border pt-2"
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={resumeOpen}
                  onClick={() => {
                    onOpenResume();
                    close();
                  }}
                  className="nav-resume-cta flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {RESUME_NAV_LABEL}
                  <ResumeIcon />
                </button>
              </motion.li>
            </motion.ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
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

/**
 * Decorative hamburger glyph that morphs into a close cross: the outer bars
 * rotate/translate to meet in the middle while the middle bar slides out and
 * fades. Pure transform/opacity (no layout shift), instant under reduced
 * motion. The toggle button carries the accessible name.
 */
function MenuIcon({ open, reduced }: { open: boolean; reduced: boolean }) {
  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const };
  const barClass = "absolute left-0 block h-[2px] w-full rounded-full bg-current";

  return (
    <span aria-hidden="true" className="relative block h-4 w-[1.125rem]">
      <motion.span
        className={cn(barClass, "top-0")}
        animate={open ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className={cn(barClass, "top-[7px]")}
        animate={open ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
        transition={transition}
      />
      <motion.span
        className={cn(barClass, "top-[14px]")}
        animate={open ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </span>
  );
}
