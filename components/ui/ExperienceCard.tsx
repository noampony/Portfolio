"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

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
 * The card is **compact by default** so the whole tree is visible at once (spec §8.3): it
 * shows just the role/degree, organisation, dates+duration and a small logo. The full
 * detail (description, team, technologies, links, certificates) lives in a larger card
 * that opens **on hover, on keyboard activation and on tap** — never hover-only (§7.4).
 *
 * Reveal mechanism (a disclosure, not a flip):
 * - A transparent full-card `<button aria-expanded aria-controls>` toggles the card; the
 *   `sr-only <h3>` names it regardless of state.
 * - Desktop (pointer + hover): hovering opens an absolutely-positioned overlay anchored to
 *   the card; the tree never reflows because the overlay is portalled to `document.body`.
 * - Touch / no-hover: tapping opens a centred sheet with a dimmed backdrop.
 * - Keyboard: Enter/Space opens and moves focus into the panel; Escape closes and returns
 *   focus to the trigger; tabbing out of the panel closes it.
 *
 * Progressive enhancement (§7.5): until the client hydrates (`enhanced` is `false`), the
 * full detail renders inline and visible, so the SSR HTML is complete without JS. After
 * hydration it collapses to the compact card + on-demand overlay. All motion is
 * reduced-motion-gated.
 */

/** Bundle of single-open state + capability flags, owned by `ExperienceGitGraph`. */
export type ExperienceExpansion = {
  /** Id of the currently open card (single-open), or null. */
  expandedId: string | null;
  /** Open the given card, or close all when passed null. */
  onExpandedChange: (id: string | null) => void;
  /** True once the client has hydrated — switches inline detail → compact + overlay. */
  enhanced: boolean;
  /** True on hover-capable, fine-pointer devices (desktop) → anchored overlay + hover. */
  hoverCapable: boolean;
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

const CLOSE_DELAY_MS = 130;
const VIEWPORT_MARGIN = 16;

type PanelPos = { left: number; top: number; originX: number; originY: number };

function clampValue(value: number, lo: number, hi: number): number {
  return Math.min(Math.max(value, lo), Math.max(lo, hi));
}

/**
 * Position the fixed overlay. Anchored mode renders the panel at the trigger's width (so it
 * "grows in place" — same width, taller), aligned over the card and clamped inside the
 * viewport (so edge cards never clip); the transform-origin sits at the trigger centre so it
 * grows out of the compact card. Sheet mode centres a wider panel on screen.
 */
function computePanelPos(
  mode: "anchored" | "sheet",
  anchor: DOMRect | null,
  panel: HTMLElement,
): PanelPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pw = panel.offsetWidth;
  const ph = panel.offsetHeight;

  if (mode === "anchored" && anchor) {
    // The panel is rendered at the card's width, so it keeps that width and only grows taller.
    const left = clampValue(anchor.left, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vw - pw - VIEWPORT_MARGIN));
    const top = clampValue(anchor.top, VIEWPORT_MARGIN, Math.max(VIEWPORT_MARGIN, vh - ph - VIEWPORT_MARGIN));
    const cx = anchor.left + anchor.width / 2;
    const cy = anchor.top + anchor.height / 2;
    return { left, top, originX: clampValue(cx - left, 0, pw), originY: clampValue(cy - top, 0, ph) };
  }

  return {
    left: Math.max(VIEWPORT_MARGIN, (vw - pw) / 2),
    top: Math.max(VIEWPORT_MARGIN, (vh - ph) / 2),
    originX: pw / 2,
    originY: ph / 2,
  };
}

/** `useLayoutEffect` on the client, `useEffect` on the server (avoids the SSR warning). */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ExperienceExpandCardProps = {
  /** Stable id (the heading id) used as the single-open key. */
  cardId: string;
  /** Id of the always-present `sr-only` heading that names the card. */
  headingId: string;
  /** The accessible heading text (role / degree). */
  headingText: string;
  expansion: ExperienceExpansion;
  /** Stronger accent + "live" breathing on the current-role card. */
  current?: boolean;
  /** Centred organisation-logo watermark behind the expanded card (served from `/public`). */
  backgroundImage?: string;
  /** Render the watermark larger / more opaque (e.g. the Check Point wordmark). */
  prominentLogo?: boolean;
  /** Render the watermark smaller / more transparent (e.g. the private-tutor mark). */
  subduedLogo?: boolean;
  /** Compact-card content (role/company/duration/logo + current badge). */
  compact: ReactNode;
  /** Expanded "big card" content — the full detail layout. */
  panel: ReactNode;
};

/**
 * The shell shared by the role and education cards: a compact disclosure that expands into
 * a larger overlay card. Open state is lifted to the parent (single-open), so opening one
 * card closes any other.
 */
function ExperienceExpandCard({
  cardId,
  headingId,
  headingText,
  expansion,
  current,
  backgroundImage,
  prominentLogo,
  subduedLogo,
  compact,
  panel,
}: ExperienceExpandCardProps) {
  const { expandedId, onExpandedChange, enhanced, hoverCapable } = expansion;
  const open = enhanced && expandedId === cardId;
  const mode: "anchored" | "sheet" = hoverCapable ? "anchored" : "sheet";

  const panelId = useId();
  const articleRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const focusPanelRef = useRef(false);
  // Latest open card id, read by the deferred close so a stale timer can't clobber a sibling
  // the pointer moved straight onto (kept in sync via an effect to avoid a render-time write).
  const expandedIdRef = useRef(expandedId);

  const prefersReducedMotion = useReducedMotion();
  const [pos, setPos] = useState<PanelPos | null>(null);
  // The trigger's rect, captured on open: drives the panel width (anchored = card width) and
  // its position. State (not a ref) so the width can be read during render without a lint error.
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openCard = useCallback(() => {
    clearCloseTimer();
    setAnchorRect(buttonRef.current?.getBoundingClientRect() ?? null);
    setPos(null);
    onExpandedChange(cardId);
  }, [cardId, clearCloseTimer, onExpandedChange]);

  const closeCard = useCallback(() => {
    clearCloseTimer();
    onExpandedChange(null);
  }, [clearCloseTimer, onExpandedChange]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      // Only close if this card is still the open one — moving the pointer straight onto a
      // sibling opens that sibling, and this stale timer must not then close it.
      if (expandedIdRef.current === cardId) {
        onExpandedChange(null);
      }
    }, CLOSE_DELAY_MS);
  }, [cardId, clearCloseTimer, onExpandedChange]);

  // Position the panel once it is mounted (before paint, so there is no flicker).
  useIsomorphicLayoutEffect(() => {
    if (!open || !panelRef.current) {
      return;
    }
    setPos(computePanelPos(mode, anchorRect, panelRef.current));
  }, [open, mode, anchorRect]);

  // Move focus into the panel when it was opened via keyboard, so its links/certificate
  // controls are reachable; the portalled panel is otherwise outside the tab sequence.
  // Gated on `pos` because the panel is `visibility: hidden` until positioned, and a hidden
  // element cannot receive focus.
  useIsomorphicLayoutEffect(() => {
    if (open && pos && focusPanelRef.current && panelRef.current) {
      focusPanelRef.current = false;
      panelRef.current.focus();
    }
  }, [open, pos]);

  // While open: Escape dismisses (and returns focus to the trigger) even when the card was
  // opened by hover and nothing inside it has focus (WCAG 1.4.13). Anchored overlays close
  // on page scroll (they would otherwise drift from the trigger); both modes close on
  // resize. Inner panel scrolling does not fire window `scroll`.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onResize = () => closeCard();
    const onKeyDown = (event: KeyboardEvent) => {
      // Let an open certificate <dialog> handle Escape first (it is the deeper modal).
      if (event.key === "Escape" && !document.querySelector("dialog[open]")) {
        closeCard();
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKeyDown);
    if (mode === "anchored") {
      window.addEventListener("scroll", closeCard, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", closeCard);
    };
  }, [open, mode, closeCard]);

  // Keep the latest open-card id available to the deferred close (see `scheduleClose`).
  useEffect(() => {
    expandedIdRef.current = expandedId;
  }, [expandedId]);

  // Clear any pending close timer on unmount.
  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    // `detail === 0` => keyboard activation (Enter/Space): focus into the panel on open.
    focusPanelRef.current = event.detail === 0;
    if (open && !hoverCapable) {
      closeCard();
    } else {
      openCard();
    }
  };

  const handleFocusOut = (event: ReactFocusEvent) => {
    if (!open) {
      return;
    }
    const next = event.relatedTarget as Node | null;
    if (articleRef.current?.contains(next) || panelRef.current?.contains(next)) {
      return;
    }
    closeCard();
  };

  const logoStyle: CSSProperties | undefined = backgroundImage
    ? ({
        "--card-logo": `url(${backgroundImage})`,
        ...(prominentLogo
          ? { "--card-logo-size": "clamp(10rem, 60%, 18rem)", "--card-logo-opacity": "0.1" }
          : {}),
        ...(subduedLogo
          ? { "--card-logo-size": "clamp(4.5rem, 32%, 8rem)", "--card-logo-opacity": "0.04" }
          : {}),
      } as CSSProperties)
    : undefined;

  const overlayTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };
  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
      };

  return (
    <article
      ref={articleRef}
      aria-labelledby={headingId}
      className={cn("experience-card", current && "experience-card--current")}
      data-open={open || undefined}
      onPointerEnter={enhanced && hoverCapable ? openCard : undefined}
      onPointerLeave={enhanced && hoverCapable ? scheduleClose : undefined}
      onBlur={enhanced ? handleFocusOut : undefined}
    >
      {/* The single accessible heading; names the card in every state. */}
      <h3 id={headingId} className="sr-only">
        {headingText}
      </h3>

      {enhanced ? (
        <>
          <div className="experience-card-compact" aria-hidden="true">
            {compact}
          </div>
          <button
            type="button"
            ref={buttonRef}
            className="experience-card-toggle"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            onClick={handleClick}
          >
            <span className="sr-only">
              {headingText} — {open ? "hide details" : "show details"}
            </span>
          </button>

          {createPortal(
            <AnimatePresence>
              {/* Backdrop only in sheet (touch) mode, where tap-outside is the close path. In
                  anchored (hover) mode a full-screen backdrop would sit over the other cards
                  and swallow their hover — there, pointer-leave / Escape / scroll close it. */}
              {open && mode === "sheet" ? (
                <motion.div
                  key="backdrop"
                  aria-hidden="true"
                  className="experience-card-backdrop experience-card-backdrop--dim"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
                  onPointerDown={closeCard}
                />
              ) : null}
              {open ? (
                <motion.div
                  key="panel"
                  ref={panelRef}
                  id={panelId}
                  role="group"
                  tabIndex={-1}
                  aria-labelledby={headingId}
                  className={cn(
                    "experience-card-panel",
                    mode === "sheet" && "experience-card-panel--sheet",
                    current && "experience-card-panel--current",
                  )}
                  style={{
                    position: "fixed",
                    left: pos?.left ?? 0,
                    top: pos?.top ?? 0,
                    // Anchored: match the compact card's width so it grows in place. Sheet: CSS width.
                    width: mode === "anchored" && anchorRect ? anchorRect.width : undefined,
                    transformOrigin: pos ? `${pos.originX}px ${pos.originY}px` : "center",
                    visibility: pos ? "visible" : "hidden",
                    ...logoStyle,
                  }}
                  {...panelMotion}
                  transition={overlayTransition}
                  onPointerEnter={mode === "anchored" ? clearCloseTimer : undefined}
                  onPointerLeave={mode === "anchored" ? scheduleClose : undefined}
                  onBlur={handleFocusOut}
                >
                  <span aria-hidden="true" className="experience-card-logo" />
                  <div className="experience-card-panel-inner">{panel}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )}
        </>
      ) : (
        /* Pre-hydration / no-JS: full detail inline and visible (§7.5). */
        <div className="experience-card-static" style={logoStyle}>
          <span aria-hidden="true" className="experience-card-logo" />
          <div className="experience-card-panel-inner">{panel}</div>
        </div>
      )}
    </article>
  );
}

type NodeCardProps = {
  node: GraphNode;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  expansion: ExperienceExpansion;
};

/**
 * Renders the right card for a graph node — the education root or a role card. The
 * `node.card.kind` discriminator picks the body; both layouts call this so the switch
 * lives in one place.
 */
export function NodeCard({ node, headingId, onOpenCertificate, expansion }: NodeCardProps) {
  if (node.card.kind === "education") {
    return (
      <EducationRootCard
        education={node.card.education}
        headingId={headingId}
        onOpenCertificate={onOpenCertificate}
        expansion={expansion}
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
      expansion={expansion}
    />
  );
}

type ExperienceCardBodyProps = {
  experience: Experience;
  duration: string | null;
  isCurrent: boolean;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  expansion: ExperienceExpansion;
};

/** A role card — compact: role/org/dates/logo; expanded: the full detail layout. */
export function ExperienceCardBody({
  experience,
  duration,
  isCurrent,
  headingId,
  onOpenCertificate,
  expansion,
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

  const currentBadge = (
    <span className="experience-current-tag">
      <span className="experience-current-tag-dot" aria-hidden="true" />
      Current
    </span>
  );

  const compact = (
    <>
      {organizationLogo ? (
        <img
          src={organizationLogo}
          alt=""
          aria-hidden="true"
          className="experience-card-compact-logo"
        />
      ) : null}
      <p className="m-0 text-[1.0625rem] font-semibold leading-snug text-text-primary">{role}</p>
      <p className="m-0 mt-1 text-small text-text-secondary">
        <span className="font-medium">{organization}</span>
        {organizationType ? <span className="text-text-muted"> · {organizationType}</span> : null}
      </p>
      <p className="m-0 mt-1 font-mono text-small text-text-muted">
        {dateRange}
        {duration ? <span className="text-text-secondary"> · {duration}</span> : null}
      </p>
      {isCurrent ? <span className="mt-2 inline-flex">{currentBadge}</span> : null}
    </>
  );

  const panel = (
    <>
      {certificate ? (
        <div className="experience-card-cert-row">
          <EducationCertificateTrigger certificate={certificate} onOpen={onOpenCertificate} />
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="m-0 text-h2 font-semibold leading-snug text-text-primary">{role}</p>
        {employmentType ? (
          <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
            {employmentType}
          </span>
        ) : null}
      </div>

      <p className="mt-1.5 text-body text-text-secondary">
        <span className="font-medium">{organization}</span>
        {organizationType ? <span className="text-text-muted"> · {organizationType}</span> : null}
      </p>

      <p className="mt-1 font-mono text-small text-text-muted">
        {dateRange}
        {duration ? <span className="text-text-secondary"> · {duration}</span> : null}
      </p>

      {isCurrent ? <div className="mt-3">{currentBadge}</div> : null}

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
    <ExperienceExpandCard
      cardId={headingId}
      headingId={headingId}
      headingText={role}
      expansion={expansion}
      current={isCurrent}
      backgroundImage={organizationLogo}
      prominentLogo={Boolean(organizationLogo?.includes("check-point"))}
      subduedLogo={Boolean(organizationLogo?.includes("private-tutor"))}
      compact={compact}
      panel={panel}
    />
  );
}

type EducationRootCardProps = {
  education: AboutEducation;
  headingId: string;
  onOpenCertificate: (certificate: EducationCertificateRef) => void;
  expansion: ExperienceExpansion;
};

/** The root node — the B.Sc. degree — as an expand card with the same in-page certificate
 *  viewer as the About section (degree + Dean's List). Content is pulled from
 *  `about.education`. Each certificate trigger is paired with its context so the two
 *  "Preview certificate" buttons stay unambiguous: the standalone trigger is the degree's
 *  (the card itself), and the Dean's List trigger is joined to the honour badge. */
export function EducationRootCard({
  education,
  headingId,
  onOpenCertificate,
  expansion,
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

  const compact = (
    <>
      {education.institutionLogo ? (
        <img
          src={education.institutionLogo}
          alt=""
          aria-hidden="true"
          className="experience-card-compact-logo"
        />
      ) : null}
      <p className="m-0 text-[1.0625rem] font-semibold leading-snug text-text-primary">
        {education.degree}
      </p>
      <p className="m-0 mt-1 text-small text-text-secondary">{education.institution}</p>
      <p className="m-0 mt-1 font-mono text-small text-text-muted">{education.dateRange}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
        <span className="inline-flex items-center rounded-full border border-border bg-white/[0.08] px-2 py-0.5 text-small text-text-secondary">
          Education
        </span>
        {education.honor ? (
          <span className="about-education-honor-badge">
            <DeanListIcon />
            {education.honor}
          </span>
        ) : null}
      </div>
    </>
  );

  const panel = (
    <>
      <div className="experience-card-cert-row">
        <EducationCertificateTrigger
          certificate={education.degreeCertificate}
          onOpen={onOpenCertificate}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <p className="m-0 text-h2 font-semibold leading-snug text-text-primary">
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

      <p className="mt-3 text-body text-text-secondary">{education.summary}</p>

      {honorGroup ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">{honorGroup}</div>
      ) : null}
    </>
  );

  return (
    <ExperienceExpandCard
      cardId={headingId}
      headingId={headingId}
      headingText={education.degree}
      expansion={expansion}
      backgroundImage={education.institutionLogo}
      compact={compact}
      panel={panel}
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
