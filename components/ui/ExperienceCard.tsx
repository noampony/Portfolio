"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

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
 *
 * Each card is a click/tap-to-flip card (mirrors the Projects flip cards, §7.4): the
 * FRONT shows the role/degree, organisation/institution and dates (with the computed
 * period) centred and large, plus a "click to reveal" affordance; the BACK keeps the full
 * detail layout (description, team, technologies, links). Certificate triggers are
 * per-face: role cards show the same trigger row on both faces, while the education card
 * pairs each trigger with its context (degree vs Dean's List) so two "Preview certificate"
 * buttons are never ambiguous. The organisation-logo watermark appears on BOTH faces.
 * The flip is a single transparent
 * full-card toggle (a disclosure: `aria-expanded`/`aria-controls`); the faces toggle
 * `inert` with the flip state so the hidden face's controls leave the tab + a11y tree,
 * and the always-present `sr-only` heading names the card regardless of which face shows.
 */

/**
 * Scroll-fill MotionValues for a card, threaded from the owning row/cell
 * (ExperienceGitNode / ExperienceTreeGraph): `frame` (0→1) fades the whole card in, then
 * `body` (0→1) fades the front content. Undefined = render statically (fully drawn) — used
 * for the pre-mount / reduced-motion fallback. See `useScrollDraw`.
 */
export type CardFill = {
  frame: MotionValue<number>;
  body: MotionValue<number>;
  /** Content rise (px → 0) for the front body's eased entrance. */
  bodyY: MotionValue<number>;
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

/** Decorative flip glyph (two curved arrows) reinforcing the "flip me" affordance. */
function FlipGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-7.5-4" strokeLinecap="round" />
      <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 7.5 4" strokeLinecap="round" />
      <path d="M21 3v4h-4M3 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The front body wrapper. With `fill` it fades + rises into place on scroll (mirroring the
 * former card-body reveal); without it, a plain wrapper inherits the CSS fully-drawn default
 * (SSR / pre-mount / reduced-motion).
 */
function FrontReveal({ fill, children }: { fill?: CardFill; children: ReactNode }) {
  if (!fill) {
    return <div className="experience-flip-front-inner">{children}</div>;
  }
  return (
    <motion.div
      className="experience-flip-front-inner"
      style={{ opacity: fill.body, y: fill.bodyY }}
    >
      {children}
    </motion.div>
  );
}

type ExperienceFlipCardProps = {
  /** Id of the always-present `sr-only` heading that names the card. */
  headingId: string;
  /** The accessible heading text (role / degree). */
  headingText: string;
  fill?: CardFill;
  /** Stronger accent + "live" breathing on the current-role card. */
  current?: boolean;
  /** Centred organisation-logo watermark behind both faces (served from `/public`). */
  backgroundImage?: string;
  /** Render the watermark larger / more opaque (e.g. the Check Point wordmark). */
  prominentLogo?: boolean;
  /** Render the watermark smaller / more transparent (e.g. the private-tutor mark). */
  subduedLogo?: boolean;
  /** Certificate trigger row at the top of the front face; omit when the entry has none. */
  frontCertificates?: ReactNode;
  /** Certificate trigger row at the top of the back face. Role cards reuse the front node;
   *  the education card omits this and embeds its triggers inside `back` instead. */
  backCertificates?: ReactNode;
  /** Centred front content (role/company/dates). */
  front: ReactNode;
  /** Back content — the full detail layout. */
  back: ReactNode;
};

/**
 * The flip shell shared by the role and education cards. A single transparent full-card
 * `<button>` toggles the flip (the faces are `pointer-events:none`, so clicks on empty space
 * fall through to it while the certificate/link controls re-enable pointer events). The
 * 3D flip, hover lift and shimmer are reduced-motion-gated in CSS (`.experience-flip*`).
 */
function ExperienceFlipCard({
  headingId,
  headingText,
  fill,
  current,
  backgroundImage,
  prominentLogo,
  subduedLogo,
  frontCertificates,
  backCertificates,
  front,
  back,
}: ExperienceFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const backId = useId();
  const innerRef = useRef<HTMLDivElement>(null);

  // Flip when the card surface is clicked, but let clicks that land on an interactive
  // control (certificate button, link) through to that control. This lives on the inner
  // surface (above the toggle, so the controls stay clickable — a CSS pointer-events
  // fall-through is unreliable inside the `preserve-3d` context). Keyboard/assistive-tech
  // users flip via the real `<button>` toggle below; this is a mouse-only enhancement, so
  // it is attached imperatively rather than as a JSX handler on a non-interactive element.
  useEffect(() => {
    const surface = innerRef.current;
    if (!surface) {
      return;
    }
    const handleClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest("a, button")) {
        return;
      }
      setFlipped((value) => !value);
    };
    surface.addEventListener("click", handleClick);
    return () => surface.removeEventListener("click", handleClick);
  }, []);

  const logoStyle = backgroundImage
    ? ({
        "--card-logo": `url(${backgroundImage})`,
        ...(prominentLogo
          ? { "--card-logo-size": "clamp(10rem, 70%, 20rem)", "--card-logo-opacity": "0.18" }
          : {}),
        ...(subduedLogo
          ? { "--card-logo-size": "clamp(4.5rem, 34%, 9rem)", "--card-logo-opacity": "0.06" }
          : {}),
      } as CSSProperties)
    : undefined;

  const body = (
    <>
      {/* The single accessible heading; never inert, so the card stays named on either face. */}
      <h3 id={headingId} className="sr-only">
        {headingText}
      </h3>

      <button
        type="button"
        className="experience-flip-toggle"
        onClick={() => setFlipped((value) => !value)}
        aria-expanded={flipped}
        aria-controls={backId}
      >
        <span className="sr-only">
          {headingText} — {flipped ? "hide details" : "show details"}
        </span>
      </button>

      <div ref={innerRef} className="experience-flip-inner">
        {/* Front — role/company/dates, centred and large. */}
        <div className="experience-flip-face experience-flip-front" inert={flipped || undefined}>
          <span aria-hidden="true" className="experience-flip-logo" />
          <FrontReveal fill={fill}>
            {frontCertificates ? (
              <div className="experience-flip-cert-row">{frontCertificates}</div>
            ) : null}
            <div aria-hidden="true" className="experience-flip-front-main">
              {front}
            </div>
            <span aria-hidden="true" className="experience-flip-hint">
              <span className="experience-flip-hint-icon">
                <FlipGlyph />
              </span>
              Click to reveal details
            </span>
          </FrontReveal>
        </div>

        {/* Back — the full detail layout (same content as the former card body). */}
        <div
          id={backId}
          aria-labelledby={headingId}
          className="experience-flip-face experience-flip-back"
          inert={!flipped || undefined}
        >
          <span aria-hidden="true" className="experience-flip-logo" />
          <div className="experience-flip-back-inner">
            {backCertificates ? (
              <div className="experience-flip-cert-row experience-flip-cert-row--back">
                {backCertificates}
              </div>
            ) : null}
            {back}
            <span aria-hidden="true" className="experience-flip-hint experience-flip-hint--back">
              <span className="experience-flip-hint-icon">
                <FlipGlyph />
              </span>
              Click to go back
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const className = cn("experience-flip", current && "experience-flip--current");

  if (fill) {
    return (
      <motion.article
        aria-labelledby={headingId}
        className={className}
        data-flipped={flipped}
        style={{ opacity: fill.frame, "--card-frame": fill.frame, ...logoStyle } as MotionStyle}
      >
        {body}
      </motion.article>
    );
  }

  return (
    <article
      aria-labelledby={headingId}
      className={className}
      data-flipped={flipped}
      style={logoStyle}
    >
      {body}
    </article>
  );
}

type NodeCardProps = {
  node: GraphNode;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  /** Scroll-fill MotionValues; omit for the static (pre-mount / reduced-motion) fallback. */
  fill?: CardFill;
};

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

/** A role card — front: role/org/dates (centred); back: the full detail layout. */
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

  const dateRange = (
    <>
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
    </>
  );

  const certificates = certificate ? (
    <EducationCertificateTrigger certificate={certificate} onOpen={onOpenCertificate} />
  ) : null;

  const front = (
    <>
      <p className="m-0 text-h2 font-semibold leading-snug text-text-primary">{role}</p>
      <p className="m-0 mt-2 text-body text-text-secondary">
        <span className="font-medium">{organization}</span>
        {organizationType ? <span className="text-text-muted"> · {organizationType}</span> : null}
      </p>
      <p className="m-0 mt-3 font-mono text-small text-text-muted">
        {dateRange}
        {duration ? (
          <span className="mt-1 block text-text-secondary">{duration}</span>
        ) : null}
      </p>
      {employmentType ? (
        <span className="mt-3 inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
          {employmentType}
        </span>
      ) : null}
    </>
  );

  const back = (
    <>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="m-0 text-body font-semibold text-text-primary">{role}</p>
        {employmentType ? (
          <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
            {employmentType}
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-small text-text-secondary">
        <span className="font-medium">{organization}</span>
        {organizationType ? <span className="text-text-muted"> · {organizationType}</span> : null}
      </p>

      <p className="mt-1 font-mono text-small text-text-muted">
        {dateRange}
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
    </>
  );

  return (
    <ExperienceFlipCard
      headingId={headingId}
      headingText={role}
      fill={fill}
      current={isCurrent}
      backgroundImage={organizationLogo}
      prominentLogo={Boolean(organizationLogo?.includes("check-point"))}
      subduedLogo={Boolean(organizationLogo?.includes("private-tutor"))}
      frontCertificates={certificates}
      backCertificates={certificates}
      front={front}
      back={back}
    />
  );
}

type EducationRootCardProps = {
  education: AboutEducation;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  fill?: CardFill;
};

/** The root node — the B.Sc. degree — as a flip card with the same in-page certificate
 *  viewer as the About section (degree + Dean's List). Content is pulled from
 *  `about.education`. Each certificate trigger is paired with its context so the two
 *  "Preview certificate" buttons stay unambiguous: the standalone trigger is the degree's
 *  (the card itself), and the Dean's List trigger is joined to the honour badge. */
export function EducationRootCard({
  education,
  headingId,
  onOpenCertificate,
  fill,
}: EducationRootCardProps) {
  const honorGroup =
    education.honor || education.honorCertificate ? (
      <span className="experience-honor-group">
        {education.honor ? (
          <span className="about-education-honor-badge">
            <DeanListIcon />
            {education.honor}
          </span>
        ) : null}
        {education.honorCertificate ? (
          <EducationCertificateTrigger
            certificate={education.honorCertificate}
            onOpen={onOpenCertificate}
          />
        ) : null}
      </span>
    ) : null;

  const frontCertificates = (
    <>
      <EducationCertificateTrigger
        certificate={education.degreeCertificate}
        onOpen={onOpenCertificate}
      />
      {honorGroup}
    </>
  );

  const front = (
    <>
      <p className="m-0 text-h2 font-semibold leading-snug text-text-primary">{education.degree}</p>
      <p className="m-0 mt-2 text-body text-text-secondary">{education.institution}</p>
      <p className="m-0 mt-3 font-mono text-small text-text-muted">{education.dateRange}</p>
      <span className="mt-3 inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
        Education
      </span>
    </>
  );

  const back = (
    <>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="m-0 text-body font-semibold text-text-primary">
          <span className="block">{education.degree}</span>
          <span className="mt-0.5 block text-small font-normal text-text-secondary">
            {education.institution}
          </span>
        </p>
        <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
          Education
        </span>
      </div>

      <p className="mt-1 font-mono text-small text-text-muted">{education.dateRange}</p>

      <p className="mt-2">
        <EducationCertificateTrigger
          certificate={education.degreeCertificate}
          onOpen={onOpenCertificate}
        />
      </p>

      <p className="mt-3 text-body text-text-secondary">{education.summary}</p>

      {honorGroup ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">{honorGroup}</div>
      ) : null}
    </>
  );

  return (
    <ExperienceFlipCard
      headingId={headingId}
      headingText={education.degree}
      fill={fill}
      backgroundImage={education.institutionLogo}
      frontCertificates={frontCertificates}
      front={front}
      back={back}
    />
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
