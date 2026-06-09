"use client";

import { motion, useReducedMotion } from "framer-motion";

import { EducationCertificateTrigger } from "@/components/sections/EducationCertificateViewer";
import type { GraphNode } from "@/lib/content/experienceGraph";
import type { AboutEducation, EducationCertificateRef, Experience } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * A single node in the Experience git tree (spec §8.3): a graph gutter cell (the
 * lane lines, fork/merge elbows and commit dot — all decorative/`aria-hidden`) paired
 * with the role/degree card. The two share a grid row, so the gutter stretches to the
 * card's height and the lanes stay aligned with no JS measurement and no layout shift.
 *
 * Which graph segments a row draws is derived from the node's lane + flags and its
 * position: the main lane runs through every row (top → root), the side lane only
 * through the side-branch rows, and the fork/merge elbows live on the branch/merge
 * nodes. The reveal is a reduced-motion-safe Framer Motion fade-up; under reduced
 * motion the row renders in its final, fully-visible state. Markup is server-rendered
 * so the content is present without client JS.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

// Opacity-only reveal: each row owns its lane segments, so animating position would
// momentarily disconnect a sliding row's lanes from its settled neighbour. Fading in
// place keeps the graph's lines continuous throughout the staggered reveal.
const rowRevealVariants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut, delay: Math.min(index * 0.07, 0.25) },
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

type ExperienceGitNodeProps = {
  node: GraphNode;
  /** Position in the ordered list (top = 0); used for the reveal stagger. */
  index: number;
  /** Total node count; used to know whether a lane continues above/below this row. */
  total: number;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

export function ExperienceGitNode({
  node,
  index,
  total,
  onOpenCertificate,
}: ExperienceGitNodeProps) {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  // The main lane is the spine: it runs through every row from the top node down to
  // the root, so a row carries it above unless it's the first row, and below unless
  // it's the last (root) row.
  const mainAbove = index > 0;
  const mainBelow = index < total - 1;
  const onSide = node.lane === "side";
  const headingId = `experience-node-${index}`;

  return (
    <motion.li
      className={cn("git-graph-row", onSide ? "git-graph-row--side" : "git-graph-row--main")}
      custom={index}
      variants={rowRevealVariants}
      initial={animate ? "hidden" : false}
      whileInView={animate ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Decorative graph gutter — the headings/dates convey order to assistive tech. */}
      <span aria-hidden="true" className="git-graph-gutter">
        {mainAbove ? (
          <span className="git-line git-line--main git-line--top" />
        ) : index === 0 ? (
          /* Continuation line — the topmost (current) node: the branch is still
             live, so a fading line above the dot signals it keeps going. */
          <span className="git-line git-line--main git-line--continuation" />
        ) : null}
        {mainBelow ? <span className="git-line git-line--main git-line--bottom" /> : null}
        {onSide ? (
          <>
            <span className="git-line git-line--side git-line--top" />
            <span className="git-line git-line--side git-line--bottom" />
          </>
        ) : null}
        {node.branchPoint ? <span className="git-elbow git-elbow--split" /> : null}
        {node.mergePoint ? <span className="git-elbow git-elbow--merge" /> : null}
        <span
          className={cn(
            "git-dot",
            onSide ? "git-dot--side" : "git-dot--main",
            node.isCurrent && "git-dot--current",
            node.isRoot && "git-dot--root",
          )}
        />
      </span>

      <div className="git-graph-cell">
        {node.card.kind === "education" ? (
          <EducationRootCard
            education={node.card.education}
            headingId={headingId}
            onOpenCertificate={onOpenCertificate}
          />
        ) : (
          <ExperienceCardBody
            experience={node.card.experience}
            duration={node.card.duration}
            isCurrent={node.isCurrent}
            headingId={headingId}
          />
        )}
      </div>
    </motion.li>
  );
}

type ExperienceCardBodyProps = {
  experience: Experience;
  duration: string | null;
  isCurrent: boolean;
  headingId: string;
};

/** The role card — mirrors the former TimelineEntry card (concurrency badge dropped:
 *  the side branch now expresses parallel roles visually). */
function ExperienceCardBody({ experience, duration, isCurrent, headingId }: ExperienceCardBodyProps) {
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

  return (
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
  );
}

type EducationRootCardProps = {
  education: AboutEducation;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

/** The root node — the B.Sc. degree, with the same in-page certificate viewer as the
 *  About section (degree + Dean's List). Content is pulled from `about.education`. */
function EducationRootCard({ education, headingId, onOpenCertificate }: EducationRootCardProps) {
  return (
    <article aria-labelledby={headingId} className="experience-card">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <h3 className="m-0 text-body font-semibold text-text-primary" id={headingId}>
          {education.degree} – {education.institution}
        </h3>
        <span className="inline-flex items-center rounded-full border border-border bg-bg-surface-raised px-2 py-0.5 text-small text-text-secondary">
          Education
        </span>
        <EducationCertificateTrigger
          certificate={education.degreeCertificate}
          onOpen={onOpenCertificate}
        />
      </div>

      <p className="mt-1 font-mono text-small text-text-muted">{education.dateRange}</p>

      <p className="mt-3 text-body text-text-secondary">{education.summary}</p>

      {education.honor && education.honorCertificate ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="about-education-honor-badge">
            <DeanListIcon />
            {education.honor}
          </span>
          <EducationCertificateTrigger
            certificate={education.honorCertificate}
            onOpen={onOpenCertificate}
          />
        </div>
      ) : null}
    </article>
  );
}

/** Dean's-List star — mirrors the About section's honour badge glyph. */
function DeanListIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
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
