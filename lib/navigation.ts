/**
 * Single source of truth for the site's primary navigation (spec §5.1–§5.4, §5.7).
 *
 * The navbar is fully data-driven from {@link NAV_ITEMS}. To honor the
 * "no broken links" rule (tasks/README Dependency Rule + Global Definition of
 * Done), this list contains **only items whose targets already exist at the
 * current commit**. Items are added/enabled by later tasks as their targets ship:
 *
 *   - `Home`      → `/#home` (Hero anchor, Task 4.1).
 *   - `About`     → `#about`       — appended by Task 5.2 when the About section ships.
 *   - `Experience`→ `#experience`  — appended by Task 6.2.
 *   - `Projects`  → `#projects`    — appended by Task 7.2 (homepage preview anchor per §5.3;
 *                   re-pointed to a dedicated page only if Phase 15 builds one).
 *   - `Courses`   → `#courses`     — appended by Task 8.2 (homepage preview anchor per §5.3;
 *                   re-pointed to a dedicated page only if Phase 16 builds one).
 *   - `Skills`    → `#skills`      — appended by Task 9.2.
 *   - `Resume`    → behavior is **TBD** (§5.7); wired in Task 10.2. §5.1 requires the item
 *                   in the navbar, so it ships now as a `disabled` placeholder with an
 *                   accessible label — never as a dead/`#` target. Task 10.2 flips
 *                   `disabled` off and sets the resolved `href`.
 *   - `Contact`   → `#contact`     — appended by Task 11.2.
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
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  {
    id: "resume",
    label: "Resume",
    href: null,
    disabled: true,
    disabledReason: "coming soon",
  },
];
