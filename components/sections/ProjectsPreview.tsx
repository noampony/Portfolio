"use client";

import type { CSSProperties } from "react";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/content/data/projects";
import { filterConfidentialityReviewed } from "@/lib/content/loaders";

/**
 * Decorative background photos behind the cards, shown at low opacity (served from `/public`).
 * `DEFAULT_CARD_BG` is the shared fallback used by the "View All" teaser and by any project
 * without its own entry in `PROJECT_BACKGROUNDS`. To give a project its own image, drop the
 * file under `public/images/projects/` and add a `"<project name>": "<path>"` entry below.
 * Missing files degrade gracefully — the card just shows the glass (no console error).
 */
const DEFAULT_CARD_BG = "/images/projects/card-bg.png";

const PROJECT_BACKGROUNDS: Record<string, string> = {
  "Microsoft & Google Events": "/images/projects/microsoft-office-events.png",
  "Email Archiving Service": "/images/projects/email-archiving-service.png",
  "Final-Failure Watchdog": "/images/projects/final-failure-watchdog.png",
  "At-Risk Teenagers Monitoring System": "/images/projects/students-tracking-system.png",
};

/**
 * Projects Preview section (spec §8.4) — the homepage's top projects.
 *
 * Confidentiality gating (spec §15.4, tasks/README Rule 9): only projects with
 * `confidentialityReviewed: true` are ever rendered, so an unreviewed Check Point project
 * can never reach the DOM regardless of ordering. The section renders whatever is reviewed —
 * and renders nothing rather than an empty shell when none are.
 *
 * Layout / interaction (Task 7.3): a compact responsive grid (1 col → 2 → 3) of click/tap-to-
 * flip glass cards (see `ProjectCard`), followed by a blurred "View All Projects" teaser card.
 * The full Projects page is conditional/nice-to-have (§4.3) and does not exist yet (Phase 15 /
 * Task 15.3), so that card's control is a non-navigating, accessibly-labelled placeholder —
 * never a dead `#`/404 link (AGENTS "no broken links"); Task 15.3 wires it up when the page ships.
 *
 * Motion: a subtle stagger fade-up reveal on scroll, mirroring the About section. It is
 * reduced-motion-safe — `useReducedMotion()` disables the reveal (cards render in place) and
 * the card flip/hover/shimmer are gated under `prefers-reduced-motion` in CSS. The `<noscript>`
 * block restores the reveal opacity and unfolds the flip cards (front + back stacked) so the
 * section is fully readable when JS is disabled.
 *
 * The section exposes the `#projects` anchor (spec §5.3); per §5.1 the navbar carries only
 * Home/Projects/Courses/Resume, so `lib/navigation.ts` is intentionally left unchanged.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

/** No-JS fallback: keep the section visible and unfold the flip cards (front + back stacked). */
const NO_JS_FALLBACK = `
.projects-reveal{opacity:1!important;transform:none!important}
.project-flip-inner{display:block!important;transform:none!important}
.project-flip-face{transform:none!important;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}
.project-flip-toggle,.project-flip-hint{display:none!important}
`;

export function ProjectsPreview() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  const reviewed = filterConfidentialityReviewed(projects);

  // No reviewed projects → render nothing rather than an empty section shell.
  if (reviewed.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative isolate border-t border-border bg-bg-base py-16 lg:py-24"
    >
      <noscript>
        <style>{NO_JS_FALLBACK}</style>
      </noscript>

      <motion.div
        className="site-shell"
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainerVariants}
      >
        <motion.p
          variants={revealItemVariants}
          className="projects-reveal mb-3 font-mono text-small tracking-wider text-accent"
        >
          SYS://PROJECTS
        </motion.p>
        <motion.h2
          id="projects-heading"
          variants={revealItemVariants}
          className="projects-reveal m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
        >
          Featured Projects
        </motion.h2>
        <motion.p
          variants={revealItemVariants}
          className="projects-reveal mt-4 max-w-measure text-body text-text-secondary"
        >
          A few backend systems I&apos;ve built and led.
          <br />
          Tap a card to flip it over.
        </motion.p>

        <ul className="mt-10 grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {reviewed.map((project, index) => (
            <motion.li
              key={project.name}
              variants={revealItemVariants}
              className="projects-reveal flex"
            >
              <ProjectCard
                project={project}
                headingId={`project-${index}-heading`}
                backgroundImage={PROJECT_BACKGROUNDS[project.name] ?? DEFAULT_CARD_BG}
              />
            </motion.li>
          ))}

          {/*
           * "View All Projects" teaser (§8.4). The dedicated Projects page is conditional/
           * nice-to-have (§4.3) and does not exist yet (Phase 15 / Task 15.3), so this ships
           * as a blurred placeholder card with a non-interactive, accessibly-labelled button —
           * never a dead link. Task 15.3 turns it into the real link when the page ships.
           */}
          <motion.li variants={revealItemVariants} className="projects-reveal flex">
            <div
              className="project-cta-card w-full"
              style={{ "--card-bg": `url(${DEFAULT_CARD_BG})` } as CSSProperties}
            >
              <div aria-hidden="true" className="project-card-bg" />
              <div aria-hidden="true" className="project-cta-blur">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="project-cta-overlay">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="project-cta-button"
                >
                  View All Projects
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only"> — full Projects page coming soon</span>
                </button>
                <p className="project-cta-caption">Full page coming soon</p>
              </div>
            </div>
          </motion.li>
        </ul>
      </motion.div>
    </section>
  );
}
