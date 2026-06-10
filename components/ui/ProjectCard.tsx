import type { Project } from "@/lib/content/types";

/**
 * A single project preview card (spec §8.4). Server component — no client JS;
 * the card is fully readable from the SSR HTML and does not depend on any image
 * (§8.4 acceptance: "readable without relying on images").
 *
 * Required §8.4 fields render unconditionally (name, short description, problem
 * solved, tech stack); `backendFocus` and `whyImportant` render only when present
 * so genuinely-absent fields (e.g. the Students Tracking System backend focus,
 * still TBD per §8.4) never show as an empty UI artifact.
 *
 * Tech-stack badges reuse the shared `.experience-tag` chip so technologies read
 * consistently across the Experience and Projects sections (mono, per §6.4).
 * Subtle hover styling and the featured-large emphasis are layered on in Task 7.3.
 */
type ProjectCardProps = {
  project: Project;
  /** Id wired to the card's `<h3>` so the `<article>` is named for assistive tech. */
  headingId: string;
};

export function ProjectCard({ project, headingId }: ProjectCardProps) {
  const { name, role, shortDescription, problemSolved, backendFocus, techStack, whyImportant } =
    project;

  return (
    <article
      aria-labelledby={headingId}
      className="flex h-full flex-col rounded-lg border border-border bg-bg-surface p-5 transition-colors duration-200 hover:border-accent/40 sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <h3 id={headingId} className="m-0 text-body font-semibold text-text-primary">
          {name}
        </h3>
        <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
          {role}
        </span>
      </div>

      <p className="mt-2 text-body text-text-secondary">{shortDescription}</p>

      <dl className="mt-4 space-y-3">
        <div>
          <dt className="text-small font-medium text-text-muted">Problem solved</dt>
          <dd className="m-0 mt-1 text-small text-text-secondary">{problemSolved}</dd>
        </div>
        {backendFocus ? (
          <div>
            <dt className="text-small font-medium text-text-muted">Backend focus</dt>
            <dd className="m-0 mt-1 text-small text-text-secondary">{backendFocus}</dd>
          </div>
        ) : null}
      </dl>

      {techStack.length > 0 ? (
        <div className="mt-4">
          <p className="m-0 text-small text-text-muted">Built with</p>
          <ul aria-label={`${name} tech stack`} className="mt-1.5 flex flex-wrap gap-1.5">
            {techStack.map((tech) => (
              <li key={tech} className="experience-tag">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {whyImportant ? (
        <p className="mt-4 border-t border-border pt-3 text-small text-text-muted">{whyImportant}</p>
      ) : null}
    </article>
  );
}
