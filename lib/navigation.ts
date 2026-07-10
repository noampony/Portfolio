/**
 * Single source of truth for the site's primary navigation (spec §5.1–§5.4).
 *
 * The navbar is a single-page section nav: each item is an in-page anchor to a
 * homepage section, and clicking it smooth-scrolls there. The item matching the
 * section currently in view is highlighted via scroll-spy (see
 * `lib/hooks/useActiveSection.ts`). `id` mirrors the section wrapper's DOM `id`
 * (e.g. `#experience`), so the nav config and the scroll-spy targets can never
 * drift apart.
 *
 * There is intentionally no "Home" item: the logo already scrolls to the top on
 * click, and the floating {@link ScrollToTopButton} (mounted in the root layout)
 * covers the "jump back up" case from anywhere on the page — a dedicated nav
 * item would just duplicate both.
 *
 * The "Resume" item is intentionally NOT in this list: it is an action (it opens
 * the resume preview modal), not a navigation target, so both navbars render it
 * separately and wire it to {@link RESUME_NAV_LABEL} + the resume-viewer context.
 */

export type SectionNavItem = {
  /** Matches the target section's DOM `id`; also used as the React key. */
  id: string;
  /** Visible label and accessible name. */
  label: string;
  /** In-page anchor (`#${id}`). */
  href: string;
};

export const SECTION_NAV_ITEMS: SectionNavItem[] = [
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "impact", label: "Impact", href: "#impact" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "courses", label: "Courses", href: "#courses" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/** Ordered section ids for scroll-spy (stable reference for the hook's deps). */
export const SECTION_IDS: readonly string[] = SECTION_NAV_ITEMS.map(
  (item) => item.id,
);

/** Label for the Resume action item (opens the resume preview modal). */
export const RESUME_NAV_LABEL = "Resume";
