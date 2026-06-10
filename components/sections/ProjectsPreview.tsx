import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/content/data/projects";
import { filterConfidentialityReviewed } from "@/lib/content/loaders";

/**
 * Projects Preview section (spec §8.4) — the homepage's 3–5 top projects.
 *
 * Confidentiality gating (spec §15.4, tasks/README Rule 9): only projects with
 * `confidentialityReviewed: true` are ever rendered, so an unreviewed Check Point
 * project can never reach the DOM regardless of ordering. With the current data
 * only the volunteer Students Tracking System is owner-approved; the three Check
 * Point projects stay hidden until the owner confirms publishability (the blocked
 * inputs from Task 7.1). The section renders whatever is reviewed — and renders
 * nothing rather than an empty shell when none are.
 *
 * Server component: the cards render into the initial HTML (available without
 * client JS, good for SEO / assistive tech). Card styling polish, featured-large
 * emphasis, and scroll reveal are layered on in Task 7.3.
 *
 * The section exposes the `#projects` anchor (spec §5.3). Per spec §5.1 the primary
 * navbar carries only Home/Projects/Courses/Resume — homepage sections are anchor
 * targets, not navbar items — so `lib/navigation.ts` is intentionally left unchanged
 * here, consistent with how About (`#about`) and Experience (`#experience`) were
 * wired. The navbar's `Projects` item points at the dedicated `/projects` page
 * (Phase 15), not this preview.
 */
export function ProjectsPreview() {
  const reviewed = filterConfidentialityReviewed(projects);

  // No reviewed projects → render nothing rather than an empty section shell.
  if (reviewed.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative isolate border-t border-border bg-bg-base py-16 lg:py-24"
    >
      <div className="site-shell">
        <p className="mb-3 font-mono text-small tracking-wider text-accent">SYS://PROJECTS</p>
        <h2
          id="projects-heading"
          className="m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
        >
          Selected Work
        </h2>
        <p className="mt-4 max-w-measure text-body text-text-secondary">
          A few backend systems I&apos;ve built and led — problem-first, readable without a single
          screenshot.
        </p>

        <ul className="mt-10 grid list-none gap-4 p-0 sm:gap-5 md:grid-cols-2">
          {reviewed.map((project, index) => (
            <li key={project.name} className="flex">
              <ProjectCard project={project} headingId={`project-${index}-heading`} />
            </li>
          ))}
        </ul>

        {/*
         * "View All Projects" (§8.4) → the dedicated Projects page is conditional/
         * nice-to-have (§4.3) and does not exist yet (Phase 15 / Task 15.3). To honor
         * the "no broken links" rule it ships as a non-interactive, accessibly-labelled
         * placeholder — never a dead `#`/404 link. Task 15.3 enables it when the page ships.
         */}
        <div className="mt-10">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border bg-bg-surface px-4 py-2 text-small font-medium text-text-muted"
          >
            View All Projects
            <span aria-hidden="true" className="font-mono text-text-muted">
              (coming soon)
            </span>
            <span className="sr-only"> — full Projects page coming soon</span>
          </button>
        </div>
      </div>
    </section>
  );
}
