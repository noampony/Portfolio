import { TimelineEntry } from "@/components/ui/TimelineEntry";
import { experiences } from "@/lib/content/data/experience";
import { filterConfidentialityReviewed } from "@/lib/content/loaders";
import type { Experience as ExperienceModel } from "@/lib/content/types";

/**
 * Experience section (spec §8.3) — a reverse-chronological timeline of
 * professional and leadership roles.
 *
 * Confidentiality gating (spec §15.4, tasks/README Rule 9): only entries with
 * `confidentialityReviewed: true` are ever rendered; the gate runs here so an
 * unreviewed work entry can never reach the DOM regardless of ordering.
 *
 * The section exposes the `#experience` anchor (spec §5.3). Per spec §5.1 the
 * primary navbar carries only Home/Projects/Courses/Resume — homepage sections
 * are anchor targets, not navbar items — so `lib/navigation.ts` is intentionally
 * left unchanged here, consistent with how the About section (`#about`) was
 * wired in Task 5.2.
 */

const ONGOING_END_SORT_KEY = "9999-99";

/** Sort key for an entry's end; an ongoing role sorts to the top. */
function endSortKey(entry: ExperienceModel): string {
  if (entry.endDate === "Present") {
    return ONGOING_END_SORT_KEY;
  }
  return entry.endDate ?? entry.startDate;
}

/** Reverse-chronological: current / most-recently-ended first, then by start. */
function byMostRecent(a: ExperienceModel, b: ExperienceModel): number {
  const endComparison = endSortKey(b).localeCompare(endSortKey(a));
  if (endComparison !== 0) {
    return endComparison;
  }
  return b.startDate.localeCompare(a.startDate);
}

export function Experience() {
  const reviewed = filterConfidentialityReviewed(experiences);
  const entries = [...reviewed].sort(byMostRecent);

  // No reviewed entries → render nothing rather than an empty section shell.
  if (entries.length === 0) {
    return null;
  }

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative border-t border-border bg-bg-base py-16 lg:py-24"
    >
      <div className="site-shell">
        <p className="mb-3 font-mono text-small tracking-wider text-accent">SYS://EXPERIENCE</p>
        <h2
          id="experience-heading"
          className="m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
        >
          Where I&apos;ve Built and Led
        </h2>
        <p className="mt-4 max-w-measure text-body text-text-secondary">
          Backend engineering and team leadership — most recent first.
        </p>

        <ol className="mt-10 max-w-3xl sm:mt-12">
          {entries.map((entry, index) => (
            <TimelineEntry
              key={`${entry.organization}-${entry.role}-${entry.startDate}`}
              experience={entry}
              isCurrent={entry.endDate === "Present"}
              isLast={index === entries.length - 1}
              index={index}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
