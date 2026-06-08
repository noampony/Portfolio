"use client";

import { motion, useReducedMotion } from "framer-motion";

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
 * Styling/animation (Task 6.3): the glass card, accent rail and node mirror the
 * About section's card system so the timeline reads as part of the same site.
 * The scroll reveal is a Framer Motion `whileInView` fade-up gated on
 * `useReducedMotion` (spec §7.3/§7.5): under reduced motion no entrance runs and
 * the content is rendered in its final, fully-visible state. Only opacity and
 * transform animate, so there is no layout shift (§14.8). The card markup is still
 * server-rendered into the initial HTML, so the text is present for crawlers and
 * assistive tech regardless of JavaScript.
 *
 * The "Present" duration is computed at build time by the parent server
 * component and passed in via `duration`, so the displayed value is stable and
 * never produces a client/server hydration mismatch.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

const entryRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut, delay: Math.min(index * 0.07, 0.25) },
  }),
};

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

type TimelineEntryProps = {
  experience: Experience;
  /** The ongoing role — visually emphasised and badged "Current". */
  isCurrent: boolean;
  /** True when this role overlapped the ongoing role — badged "Concurrent". */
  concurrent: boolean;
  /** Stable index used to label the card's heading and stagger the reveal. */
  index: number;
  /** Build-time-resolved duration label (e.g. `3 yrs 8 mos`), or null to omit. */
  duration: string | null;
};

export function TimelineEntry({
  experience,
  isCurrent,
  concurrent,
  index,
  duration,
}: TimelineEntryProps) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  const {
    organization,
    organizationType,
    role,
    employmentType,
    startDate,
    endDate,
    description,
    technologies,
    teamSize,
    link,
  } = experience;

  const headingId = `experience-entry-${index}`;

  return (
    <motion.li
      className="experience-entry"
      custom={index}
      variants={entryRevealVariants}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Timeline node — decorative; the heading conveys the entry to AT. */}
      <span
        aria-hidden="true"
        className={cn(
          "experience-node",
          isCurrent && "experience-node--current",
          concurrent && "experience-node--concurrent",
        )}
      />

      <article
        aria-labelledby={headingId}
        className={cn("experience-card", isCurrent && "experience-card--current")}
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <h3 className="m-0 text-body font-semibold text-text-primary" id={headingId}>
            {role}
          </h3>
          {isCurrent ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent bg-accent/10 px-2 py-0.5 text-small font-medium text-accent">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Current
            </span>
          ) : null}
          {concurrent ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-surface-raised px-2 py-0.5 text-small font-medium text-text-secondary"
              title="Held concurrently with my current role"
            >
              <ParallelIcon />
              Concurrent
              <span className="sr-only"> with my current role</span>
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
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className="text-small text-text-muted">Built with</span>
            <ul aria-label="Technologies used" className="flex flex-wrap gap-1.5">
              {technologies.map((tech) => (
                <li key={tech} className="experience-tag">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
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
    </motion.li>
  );
}

/** Two parallel tracks — a decorative cue that the role ran alongside another. */
function ParallelIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 20 13 6M11 20 19 6" />
    </svg>
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
