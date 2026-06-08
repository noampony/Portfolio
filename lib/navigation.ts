/**
 * Single source of truth for the site's primary navigation (spec §5.1–§5.4, §5.7).
 *
 * The navbar is fully data-driven from {@link NAV_ITEMS}. The navbar links to the
 * site's top-level destinations (dedicated pages), not to homepage sections —
 * keeping the nav unambiguous once the Projects and Courses pages exist. To honor
 * the "no broken links" rule (tasks/README Dependency Rule + Global Definition of
 * Done), items whose target pages don't exist yet ship as `disabled` placeholders
 * (non-interactive, accessibly labelled) rather than dead/`#` links — and are
 * enabled by later tasks as their targets ship:
 *
 *   - `Home`      → `/` (the homepage). A real route so it highlights as the active
 *                   page and lets users return home from the Projects/Courses pages.
 *   - `Projects`  → dedicated `/projects` page (Phase 15). Disabled placeholder until then.
 *   - `Courses`   → dedicated `/courses` page (Phase 16). Disabled placeholder until then.
 *   - `Resume`    → behavior is **TBD** (§5.7); wired in Task 10.2. §5.1 requires the item
 *                   in the navbar, so it ships now as a `disabled` placeholder with an
 *                   accessible label — never as a dead/`#` target. Task 10.2 flips
 *                   `disabled` off and sets the resolved `href`.
 *
 * Active-state highlighting (§5.4) is route-based only here. Scroll-spy section
 * highlighting is explicitly out of scope for this task (a later task may add it).
 */

export type NavItem = {
  /** Stable React key / identifier. */
  id: string;
  /** Visible label and accessible name. */
  label: string;
  /**
   * Navigation target. A route (`/`) or in-page anchor (`#about`). `null` when
   * the item has no destination yet (must also be `disabled`) so we never emit
   * a dead link.
   */
  href: string | null;
  /**
   * When `true`, the item renders as a non-interactive, accessibly-labelled
   * placeholder instead of a link — used for items whose behavior is still TBD
   * (currently only Resume, §5.7). Never combine an enabled item with `href: null`.
   */
  disabled?: boolean;
  /** Short status note announced for disabled items (e.g. "coming soon"). */
  disabledReason?: string;
  /** External destination → opens in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "projects",
    label: "Projects",
    href: null,
    disabled: true,
    disabledReason: "coming soon",
  },
  {
    id: "courses",
    label: "Courses",
    href: null,
    disabled: true,
    disabledReason: "coming soon",
  },
  {
    id: "resume",
    label: "Resume",
    href: null,
    disabled: true,
    disabledReason: "coming soon",
  },
];
