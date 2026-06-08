"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PointerEvent } from "react";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

/**
 * Sticky, data-driven primary navbar (spec §5.1–§5.4).
 *
 * Sticky on scroll with sufficient contrast against page backgrounds (§5.2);
 * a `scroll-padding-top` rule in globals.css keeps anchored section headings
 * from being covered. Links are rendered from {@link NAV_ITEMS} only — see
 * lib/navigation.ts for the "targets must exist" contract. Active state (§5.4)
 * is route-based and intentionally subtle; scroll-spy is out of scope here.
 *
 * Client component because active state reads the current route. Below the `md`
 * breakpoint the inline list is hidden and {@link MobileNav} renders a
 * collapsible menu from the same nav-config (Task 2.4).
 */

/**
 * Route-based active match (§5.4). Only real routes can be "active" here;
 * in-page anchors would require scroll-spy, which is deferred to a later task.
 */
function isActive(item: NavItem, pathname: string): boolean {
  if (item.disabled || item.href === null || item.href.startsWith("#")) {
    return false;
  }
  return item.href === pathname;
}

const linkClasses =
  "rounded-full px-3 py-1.5 text-body text-text-secondary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent";

export function Navbar() {
  const pathname = usePathname();

  // Gentle slide-down entrance is a pure CSS keyframe (see `.navbar-slide-in` in
  // globals.css), gated behind `prefers-reduced-motion: no-preference` like the
  // site's other entrance animations. CSS is used here instead of Framer Motion
  // because a mount-time JS animation on this sticky header proved unreliable
  // under React Strict Mode's double-mount; a keyframe always runs to completion.
  // Cursor-following spotlight: track the pointer as CSS custom properties on the
  // header (no React re-render) so the `.navbar-cursor-spotlight` overlay can paint
  // a soft accent glow under the cursor. Pure inline-style writes; the overlay's
  // fade-in/out is handled in CSS and disabled under reduced motion.
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
  }

  return (
    <header
      onPointerMove={handlePointerMove}
      className="navbar-slide-in group isolate sticky top-0 z-40 border-b border-border bg-bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-bg-surface/75"
    >
      <div aria-hidden className="navbar-cursor-spotlight" />
      <nav
        aria-label="Primary"
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 sm:px-10 md:px-16"
      >
        <Link
          href="/"
          aria-label="Noam Pony — home"
          className="inline-flex rounded-sm text-text-primary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Logo />
        </Link>

        <ul className="ml-auto hidden flex-wrap items-center gap-x-5 gap-y-2 md:flex">
          {NAV_ITEMS.map((item) => {
            if (item.disabled || item.href === null) {
              // TBD target (e.g. Resume, §5.7): present per §5.1 but never a dead
              // link. Non-interactive, visibly muted, with an SR-only status note.
              return (
                <li key={item.id}>
                  <span
                    aria-disabled="true"
                    title={
                      item.disabledReason
                        ? `${item.label} — ${item.disabledReason}`
                        : undefined
                    }
                    className="cursor-not-allowed rounded-full px-3 py-1.5 text-body text-text-muted"
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
                  className={cn(
                    linkClasses,
                    active && "nav-spotlight font-medium text-accent",
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

        <MobileNav className="ml-auto md:hidden" />
      </nav>
    </header>
  );
}
