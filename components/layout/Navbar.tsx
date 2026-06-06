"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type NavItem } from "@/lib/navigation";
import { MobileNav } from "@/components/layout/MobileNav";
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
  "rounded-sm text-body text-text-secondary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-bg-surface/75">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-measure flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4"
      >
        <Link
          href="/"
          className="rounded-sm font-mono text-body font-semibold text-text-primary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
        >
          Noam Pony
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
                    className="cursor-not-allowed text-body text-text-muted"
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
                  className={cn(linkClasses, active && "font-medium text-accent")}
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
