"use client";

import { useId, useState, type CSSProperties } from "react";

import type { Project } from "@/lib/content/types";
import { useGlareHandlers } from "@/components/ui/GlareHover";

/**
 * A single project preview card (spec §8.4, §6.7, §7.4) — a click/tap-to-flip card.
 *
 * Front face: the project name, role, and an explicit "Click to know more" affordance so it
 * reads as interactive (§7.4 — no hover-only access; this is an explicit click/keyboard
 * toggle, not a hover reveal). Back face: the §8.4 detail fields (short description, problem
 * solved, backend focus when present, tech stack). `whyImportant` is intentionally dropped
 * here to keep the compact card small; it remains in the data for the full Projects page.
 *
 * The two faces stack in one CSS grid cell so the card auto-sizes to its taller (back) face —
 * no fixed height, no clipping. A single transparent full-card `<button>` is the only focusable
 * control: it carries `aria-expanded`/`aria-controls` (a disclosure pattern), flips the card
 * from either face, and shows a visible focus ring. The front/back faces toggle `aria-hidden`
 * with the flip state so assistive tech follows what is visually shown; the section's
 * `<noscript>` fallback reveals the back face when JS is disabled.
 *
 * Tech-stack badges reuse the shared `.experience-tag` chip (mono, per §6.4) and wrap cleanly.
 * The 3D flip, hover lift, and shimmer are reduced-motion-gated in CSS (`.project-flip*`).
 */
type ProjectCardProps = {
  project: Project;
  /** Id wired to the front face `<h3>` so the `<article>` is named for assistive tech. */
  headingId: string;
  /** Optional decorative background image (served from `/public`), shown at low opacity. */
  backgroundImage?: string;
};

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

export function ProjectCard({ project, headingId, backgroundImage }: ProjectCardProps) {
  const { name, role, workplace, shortDescription, problemSolved, backendFocus, techStack } = project;
  const [flipped, setFlipped] = useState(false);
  const backId = useId();
  const frontGlare = useGlareHandlers({ transitionDuration: 1300, playOnce: true });
  const backGlare = useGlareHandlers({ transitionDuration: 1300, playOnce: true });
  const glareContainerHandlers = {
    onMouseEnter: () => { frontGlare.handlers.onMouseEnter(); backGlare.handlers.onMouseEnter(); },
    onMouseLeave: () => { frontGlare.handlers.onMouseLeave(); backGlare.handlers.onMouseLeave(); },
  };

  // Decorative photo behind the card content, wired through the CSS `--card-bg` var.
  const style = backgroundImage
    ? ({ "--card-bg": `url(${backgroundImage})` } as CSSProperties)
    : undefined;

  return (
    <article aria-labelledby={headingId} className="project-flip" data-flipped={flipped} style={style} {...glareContainerHandlers}>
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-expanded={flipped}
        aria-controls={backId}
        className="project-flip-toggle"
      >
        <span className="sr-only">
          {name} — {flipped ? "hide project details" : "show project details"}
        </span>
      </button>

      <div className="project-flip-inner">
        {/* Front — title + affordance. */}
        <div className="project-flip-face project-flip-front" aria-hidden={flipped}>
          <div aria-hidden="true" className="project-card-bg" />
          <div ref={frontGlare.overlayRef} style={frontGlare.overlayStyle} aria-hidden="true" />
          <span aria-hidden="true" className="font-mono text-small tracking-wider text-accent">
            {"// project"}
          </span>
          <div className="project-flip-front-body">
            <h3
              id={headingId}
              className="project-flip-title m-0 text-h2 font-semibold text-text-primary"
            >
              {name}
            </h3>
            <span className="project-role-pill">{role}</span>
            {workplace ? (
              <span className="project-workplace">
                <img
                  src={workplace.logo}
                  alt={workplace.name}
                  className="project-workplace-logo"
                />
                {workplace.showName ? (
                  <span className="project-workplace-name">{workplace.name}</span>
                ) : null}
              </span>
            ) : null}
          </div>
          <span className="project-flip-hint">
            <span className="project-flip-hint-icon">
              <FlipGlyph />
            </span>
            Tap to know more
          </span>
        </div>

        {/* Back — the §8.4 detail fields. */}
        <div
          id={backId}
          aria-labelledby={headingId}
          className="project-flip-back project-flip-face"
          aria-hidden={!flipped}
        >
          <div aria-hidden="true" className="project-card-bg" />
          <div ref={backGlare.overlayRef} style={backGlare.overlayStyle} aria-hidden="true" />
          <div className="project-flip-back-header">
            <p className="project-flip-back-title">{name}</p>
            {workplace ? (
              <span className="project-workplace project-workplace--back">
                <img
                  src={workplace.logo}
                  alt={workplace.name}
                  className="project-workplace-logo"
                />
                {workplace.showName ? (
                  <span className="project-workplace-name">{workplace.name}</span>
                ) : null}
              </span>
            ) : null}
          </div>
          <p className="m-0 text-small text-text-secondary">{shortDescription}</p>

          <dl className="mt-3 space-y-2">
            <div>
              <dt className="text-small font-medium text-text-muted">Problem solved</dt>
              <dd className="m-0 mt-0.5 text-small text-text-secondary">{problemSolved}</dd>
            </div>
            {backendFocus ? (
              <div>
                <dt className="text-small font-medium text-text-muted">Backend focus</dt>
                <dd className="m-0 mt-0.5 text-small text-text-secondary">{backendFocus}</dd>
              </div>
            ) : null}
          </dl>

          {techStack.length > 0 ? (
            <ul aria-label={`${name} tech stack`} className="mt-3 flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <li key={tech} className="experience-tag">
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}

          <span aria-hidden="true" className="project-flip-hint project-flip-hint--back">
            <span className="project-flip-hint-icon">
              <FlipGlyph />
            </span>
            Tap to go back
          </span>
        </div>
      </div>
    </article>
  );
}
