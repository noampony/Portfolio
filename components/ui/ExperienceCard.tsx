"use client";

import Image from "next/image";

import { EducationCertificateTrigger } from "@/components/sections/EducationCertificateViewer";
import type { GraphNode } from "@/lib/content/experienceGraph";
import type { AboutEducation, EducationCertificateRef, Experience } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Shared Experience card bodies, used by BOTH layouts: the small-screen git-tree
 * (`ExperienceGitNode`) and the large-screen tree (`ExperienceTreeGraph`). Keeping a
 * single implementation here means there is exactly one card markup + one `headingId`
 * scheme; because only one layout is mounted at a time, the `aria-labelledby` ids stay
 * unique.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * Opacity-only reveal shared by both layouts. Each node/cell owns its connecting lines,
 * so animating position would momentarily disconnect a sliding element's lines from its
 * settled neighbour. Fading in place keeps the graph/tree lines continuous throughout
 * the staggered reveal. The `custom` value is the stagger index.
 */
export const rowRevealVariants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut, delay: Math.min(index * 0.07, 0.25) },
  }),
};

/**
 * Large-screen tree reveal: cards rise and settle as you scroll in, staggered by their
 * `reveal` index so the tree "grows" upward from the root. Only the cards transform — the
 * connector lines are separate, statically-placed grid items — and the move is small and
 * fades in, so the commit dots re-seat onto their lines as each card settles. Off under
 * reduced motion (the cell renders in its final state). The `custom` value is the stagger
 * index (root → stem → branches).
 */
export const treeCellRevealVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.965 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    // Slow, gentle settle (~80% longer than a typical reveal); the early trigger lives in
    // the cell's `viewport` margin (ExperienceTreeGraph) so it starts well before scroll-in.
    transition: { duration: 1.3, ease: easeOut, delay: Math.min(index * 0.16, 0.7) },
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

type NodeCardProps = {
  node: GraphNode;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

/**
 * Organization / institution logo badge, pinned to the card's top-right corner (see the
 * `.experience-org-logo` rule). The asset is decorative (the org/degree name carries the
 * accessible label); it renders at a fixed height with its natural aspect ratio preserved
 * (`aspect-ratio:auto`), so wide wordmarks aren't squashed.
 */
function OrgLogo({ src }: { src: string }) {
  return (
    <span className="experience-org-logo">
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        width={120}
        height={40}
        // Logos are SVG (and first-party): serve the raw file rather than routing it
        // through the image optimizer, which rejects SVG unless `dangerouslyAllowSVG`.
        unoptimized
        // Fixed height, width follows each logo's *natural* aspect ratio (aspect-ratio:auto
        // overrides next/image's width/height-derived ratio) so wide wordmarks aren't squashed.
        className="h-6 w-auto object-contain [aspect-ratio:auto]"
      />
    </span>
  );
}

/**
 * Renders the right card for a graph node — the education root or a role card. The
 * `node.card.kind` discriminator picks the body; both layouts call this so the switch
 * lives in one place.
 */
export function NodeCard({ node, headingId, onOpenCertificate }: NodeCardProps) {
  if (node.card.kind === "education") {
    return (
      <EducationRootCard
        education={node.card.education}
        headingId={headingId}
        onOpenCertificate={onOpenCertificate}
      />
    );
  }

  return (
    <ExperienceCardBody
      experience={node.card.experience}
      duration={node.card.duration}
      isCurrent={node.isCurrent}
      headingId={headingId}
      onOpenCertificate={onOpenCertificate}
    />
  );
}

type ExperienceCardBodyProps = {
  experience: Experience;
  duration: string | null;
  isCurrent: boolean;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
};

/** The role card — mirrors the former TimelineEntry card (concurrency badge dropped:
 *  the side branch now expresses parallel roles visually). */
export function ExperienceCardBody({
  experience,
  duration,
  isCurrent,
  headingId,
  onOpenCertificate,
}: ExperienceCardBodyProps) {
  const {
    organization,
    organizationType,
    organizationLogo,
    role,
    employmentType,
    startDate,
    endDate,
    description,
    technologies,
    teamSize,
    link,
    certificate,
  } = experience;

  return (
    <article
      aria-labelledby={headingId}
      className={cn("experience-card", isCurrent && "experience-card--current")}
    >
      {organizationLogo ? <OrgLogo src={organizationLogo} /> : null}
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1.5",
          organizationLogo && "pr-24",
        )}
      >
        <h3 className="m-0 text-body font-semibold text-text-primary" id={headingId}>
          {role}
        </h3>
        {employmentType ? (
          <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
            {employmentType}
          </span>
        ) : null}
        {certificate ? (
          <EducationCertificateTrigger certificate={certificate} onOpen={onOpenCertificate} />
        ) : null}
      </div>

      <p className="mt-1 text-small text-text-secondary">
        <span className="font-medium">{organization}</span>
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
export function EducationRootCard({
  education,
  headingId,
  onOpenCertificate,
}: EducationRootCardProps) {
  return (
    <article aria-labelledby={headingId} className="experience-card">
      {education.institutionLogo ? <OrgLogo src={education.institutionLogo} /> : null}
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1.5",
          education.institutionLogo && "pr-24",
        )}
      >
        <h3 className="m-0 text-body font-semibold text-text-primary" id={headingId}>
          <span className="block">{education.degree}</span>
          <span className="mt-0.5 block text-small font-normal text-text-secondary">
            {education.institution}
          </span>
        </h3>
        <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
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
