"use client";

import Image from "next/image";

import { motion, type MotionStyle, type MotionValue } from "framer-motion";

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

/**
 * Scroll-fill MotionValues for a card, threaded from the owning row/cell
 * (ExperienceGitNode / ExperienceTreeGraph): `frame` (0→1) fades the card edge in, then
 * `body` (0→1) fades the content. Undefined = render statically (fully drawn) — used for the
 * pre-mount / reduced-motion fallback. See `useScrollDraw` and `CardShell`.
 */
export type CardFill = {
  frame: MotionValue<number>;
  body: MotionValue<number>;
  /** Content rise (px → 0) for the body's eased entrance; only the inner content moves, so
   *  the card frame — and the commit dot anchored to its edge — stays put. */
  bodyY: MotionValue<number>;
};

/**
 * Card shell shared by both card bodies. When `fill` is set it renders a `motion.article`
 * that fades the whole card in (`opacity` + the `--card-frame` edge var) as the fill front
 * arrives, with the content in a `motion.div` whose opacity (`fill.body`) follows closely
 * behind — so the card appears on scroll and its text lands just after, not a screen later.
 * When `fill` is undefined it renders a plain article/div that inherits the CSS defaults
 * (fully drawn) for the SSR / pre-mount / reduced-motion fallback.
 */
function CardShell({
  className,
  headingId,
  fill,
  children,
}: {
  className: string;
  headingId: string;
  fill?: CardFill;
  children: React.ReactNode;
}) {
  if (!fill) {
    return (
      <article aria-labelledby={headingId} className={className}>
        <div className="experience-card-body">{children}</div>
      </article>
    );
  }

  return (
    <motion.article
      aria-labelledby={headingId}
      className={className}
      style={{ opacity: fill.frame, "--card-frame": fill.frame } as MotionStyle}
    >
      <motion.div className="experience-card-body" style={{ opacity: fill.body, y: fill.bodyY }}>
        {children}
      </motion.div>
    </motion.article>
  );
}

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
  /** Scroll-fill MotionValues; omit for the static (pre-mount / reduced-motion) fallback. */
  fill?: CardFill;
};

/**
 * Organization / institution logo badge, pinned to the card's top-right corner (see the
 * `.experience-org-logo` rule). The asset is decorative (the org/degree name carries the
 * accessible label); it renders at a fixed height with its natural aspect ratio preserved
 * (`aspect-ratio:auto`), so wide wordmarks aren't squashed.
 */
function OrgLogo({ src }: { src: string }) {
  // Raster logos (jpg/png) usually ship with an opaque (often white) background, so they
  // read best on a light chip; SVG logos are transparent and tuned for the dark card.
  const isRaster = /\.(png|jpe?g|webp)$/i.test(src);

  return (
    <span className={cn("experience-org-logo", isRaster && "experience-org-logo--light")}>
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
export function NodeCard({ node, headingId, onOpenCertificate, fill }: NodeCardProps) {
  if (node.card.kind === "education") {
    return (
      <EducationRootCard
        education={node.card.education}
        headingId={headingId}
        onOpenCertificate={onOpenCertificate}
        fill={fill}
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
      fill={fill}
    />
  );
}

type ExperienceCardBodyProps = {
  experience: Experience;
  duration: string | null;
  isCurrent: boolean;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  fill?: CardFill;
};

/** The role card — mirrors the former TimelineEntry card (concurrency badge dropped:
 *  the side branch now expresses parallel roles visually). */
export function ExperienceCardBody({
  experience,
  duration,
  isCurrent,
  headingId,
  onOpenCertificate,
  fill,
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
    <CardShell
      headingId={headingId}
      fill={fill}
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
    </CardShell>
  );
}

type EducationRootCardProps = {
  education: AboutEducation;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  fill?: CardFill;
};

/** The root node — the B.Sc. degree, with the same in-page certificate viewer as the
 *  About section (degree + Dean's List). Content is pulled from `about.education`. */
export function EducationRootCard({
  education,
  headingId,
  onOpenCertificate,
  fill,
}: EducationRootCardProps) {
  return (
    <CardShell headingId={headingId} fill={fill} className="experience-card">
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
    </CardShell>
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
