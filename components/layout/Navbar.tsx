"use client";

import Link from "next/link";
import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SECTION_NAV_ITEMS, SECTION_IDS, RESUME_NAV_LABEL } from "@/lib/navigation";
import { useActiveSection } from "@/lib/hooks/useActiveSection";
import { useResumeViewer } from "@/components/providers/ResumeViewerProvider";
import { MobileNav } from "@/components/layout/MobileNav";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * Sticky, data-driven primary navbar (spec §5.1–§5.4).
 *
 * Single-page section nav: items are in-page anchors (from {@link SECTION_NAV_ITEMS})
 * that smooth-scroll to homepage sections, and scroll-spy ({@link useActiveSection})
 * highlights the section currently in view with a sliding accent underline. The
 * "Resume" item is an action — it opens the shared resume modal via the
 * resume-viewer context — and is set apart by accent colour. Below `lg` the inline
 * list is hidden and {@link MobileNav} renders a collapsible menu from the same
 * config.
 *
 * The header's real rendered height is measured and written to the
 * `--navbar-height` custom property (see the effect below), which
 * `scroll-padding-top` in globals.css consumes — so an anchored section's top
 * lands flush against the navbar's bottom edge exactly, regardless of how tall
 * the sticky header actually renders at a given breakpoint/zoom/font load.
 * Smooth scroll and the entrance/indicator animations respect
 * `prefers-reduced-motion`.
 */

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

const linkClasses =
  "group/nav relative inline-flex items-center rounded-sm px-2.5 py-2 text-small font-medium text-text-secondary outline-none transition-colors hover:text-text-primary focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Intercepts a section-link click to scroll imperatively via `selectSection`
 * (see useActiveSection's doc comment for why), while still letting modified
 * clicks (open in new tab/window, etc.) fall through to the link's native
 * behaviour untouched.
 */
function handleSectionClick(
  event: MouseEvent<HTMLAnchorElement>,
  id: string,
  selectSection: (id: string) => void,
) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  selectSection(id);
}

export function Navbar() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { activeId, selectSection } = useActiveSection(SECTION_IDS);
  const { open: resumeOpen, openResume } = useResumeViewer();
  const headerRef = useRef<HTMLElement>(null);

  // Keep `--navbar-height` in sync with the header's actual rendered height (it
  // differs slightly across breakpoints), so the `scroll-padding-top` anchor
  // offset in globals.css always matches exactly instead of leaving a gap or
  // overlap between the navbar and the scrolled-to section.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${header.offsetHeight}px`,
      );
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  // Cursor-following spotlight: track the pointer as CSS custom properties on the
  // header (no React re-render) so `.navbar-cursor-spotlight` can paint a soft
  // accent glow under the cursor. The fade in/out is CSS, disabled under reduced
  // motion. See globals.css.
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
  }

  return (
    <header
      ref={headerRef}
      onPointerMove={handlePointerMove}
      className="navbar-slide-in group isolate sticky top-0 z-40 border-b border-border bg-bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-bg-surface/75"
    >
      <div aria-hidden className="navbar-cursor-spotlight" />
      <nav
        aria-label="Primary"
        className="site-shell relative z-10 flex items-center gap-x-4 py-2"
      >
        <Link
          href="/#home"
          onClick={(event) => handleSectionClick(event, "home", selectSection)}
          aria-label="Noam Pony - home"
          className="inline-flex rounded-sm text-text-primary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Logo />
        </Link>

        <ul className="ml-auto hidden items-center gap-x-0.5 lg:flex">
          {SECTION_NAV_ITEMS.map((item) => {
            const active = item.id === activeId;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={(event) => handleSectionClick(event, item.id, selectSection)}
                  aria-current={active ? "true" : undefined}
                  className={cn(linkClasses, active && "text-accent hover:text-accent")}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="nav-underline"
                      aria-hidden="true"
                      className="nav-underline pointer-events-none absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 520, damping: 40 }
                      }
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 rounded-full bg-current opacity-40 transition-transform duration-300 ease-out group-hover/nav:scale-x-100"
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li className="ml-1.5">
            <button
              type="button"
              onClick={openResume}
              aria-haspopup="dialog"
              aria-expanded={resumeOpen}
              className="nav-resume-cta inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-small font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
            >
              {RESUME_NAV_LABEL}
              <ResumeIcon />
            </button>
          </li>
        </ul>

        <MobileNav
          className="ml-auto lg:hidden"
          activeId={activeId}
          onSelectSection={selectSection}
          onOpenResume={openResume}
          resumeOpen={resumeOpen}
        />
      </nav>
    </header>
  );
}
