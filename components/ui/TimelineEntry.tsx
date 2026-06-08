import type { Experience } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * A single Experience timeline card (spec §8.3).
 *
 * Renders only fields that exist on the entry — optional fields (organization
 * type, employment type, team size, technologies, link) are guarded so nothing
 * is invented and no empty artifact is shown (tasks/README Rule 5). Screenshots
 * are intentionally never rendered (§8.3 — optional + confidentiality).
 *
 * The card is a server component: no client JS ships and the duration of an
 * ongoing role is computed at build time, matching the site's build-time date
 * convention (see lib/content/data/about.ts). Entrance/scroll animation is
 * deliberately deferred to Task 6.3.
 */

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Format an ISO year-month (`2022-10`) as `Oct 2022`; pass `Present` through. */
function formatMonthYear(value: string): string {
  if (value === "Present") {
    return "Present";
  }
  const [year, month] = value.split("-");
  const label = MONTH_LABELS[Number(month) - 1];
  return label ? `${label} ${year}` : value;
}

/** Whole months between a start year-month and now (build time for static pages). */
function monthsElapsedSince(start: string, now = new Date()): number {
  const [startYear, startMonth] = start.split("-").map(Number);
  if (!startYear || !startMonth) {
    return 0;
  }
  const months = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth);
  return Math.max(0, months);
}

/** Human-readable span (e.g. `3 yrs 8 mos`) from a whole-month count. */
function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  }
  if (months > 0) {
    parts.push(`${months} mo${months === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(" ") : "1 mo";
}

type TimelineEntryProps = {
  experience: Experience;
  /** The ongoing role — visually emphasised and badged "Current". */
  isCurrent: boolean;
  /** Last item drops the connecting rail so the line ends on the final node. */
  isLast: boolean;
  /** Stable index used to label the card's heading for assistive tech. */
  index: number;
};

export function TimelineEntry({ experience, isCurrent, isLast, index }: TimelineEntryProps) {
  const {
    organization,
    organizationType,
    role,
    employmentType,
    startDate,
    endDate,
    durationLabel,
    description,
    technologies,
    teamSize,
    link,
  } = experience;

  const headingId = `experience-entry-${index}`;

  // Prefer the owner-provided duration label (spec §8.3 wording); otherwise
  // compute it dynamically for an ongoing role (§8.3.2). Completed roles with
  // no provided label simply show their date range — no derived value invented.
  const duration =
    durationLabel ?? (endDate === "Present" ? formatDuration(monthsElapsedSince(startDate)) : null);

  return (
    <li
      className={cn(
        "relative border-l border-border pl-6 sm:pl-8",
        isLast ? "border-l-transparent pb-0" : "pb-8 sm:pb-10",
      )}
    >
      {/* Timeline node — decorative; the heading conveys the entry to AT. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-0 top-5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent",
          isCurrent ? "bg-accent" : "bg-bg-base",
        )}
      />

      <article
        aria-labelledby={headingId}
        className="rounded-lg border border-border bg-bg-surface p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <h3 className="m-0 text-body font-semibold text-text-primary" id={headingId}>
            {role}
          </h3>
          {isCurrent ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-small font-medium text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Current
            </span>
          ) : null}
          {employmentType ? (
            <span className="inline-flex items-center rounded-full border border-border bg-bg-surface-raised px-2 py-0.5 text-small text-text-secondary">
              {employmentType}
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-body text-text-secondary">
          <span className="font-medium text-text-primary">{organization}</span>
          {organizationType ? <span className="text-text-muted"> · {organizationType}</span> : null}
        </p>

        <p className="mt-1 font-mono text-small text-text-muted">
          <time dateTime={startDate}>{formatMonthYear(startDate)}</time>
          {endDate ? (
            <>
              {" – "}
              {endDate === "Present" ? (
                "Present"
              ) : (
                <time dateTime={endDate}>{formatMonthYear(endDate)}</time>
              )}
            </>
          ) : null}
          {duration ? <span className="text-text-secondary"> · {duration}</span> : null}
        </p>

        <p className="mt-3 text-body text-text-secondary">{description}</p>

        {teamSize ? (
          <p className="mt-3 text-small text-text-secondary">
            <span className="text-text-muted">Team</span> · {teamSize}
          </p>
        ) : null}

        {technologies && technologies.length > 0 ? (
          <ul aria-label="Technologies used" className="mt-3 flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <li
                key={tech}
                className="rounded border border-border bg-bg-base px-2 py-0.5 font-mono text-small text-text-secondary"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : null}

        {link ? (
          <p className="mt-4">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-sm text-small font-medium text-accent outline-none transition-colors hover:text-accent-hover focus-visible:ring-2 focus-visible:ring-accent"
            >
              View on LinkedIn
              <ExternalLinkIcon />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        ) : null}
      </article>
    </li>
  );
}

/** Decorative external-link glyph; the link text carries the accessible name. */
function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
