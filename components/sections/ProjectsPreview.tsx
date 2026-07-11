"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionBackground } from "@/components/layout/SectionBackground";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/lib/content/data/projects";
import { filterConfidentialityReviewed } from "@/lib/content/loaders";
import { revealItemVariants, staggerContainerVariants } from "@/lib/motion";

/**
 * Decorative background photos behind the cards, shown at low opacity (served from `/public`).
 * `DEFAULT_CARD_BG` is the shared fallback for any project without its own entry in
 * `PROJECT_BACKGROUNDS`. To give a project its own image, drop the file under
 * `public/images/projects/` and add a `"<project name>": "<path>"` entry below.
 * Missing files degrade gracefully — the card just shows the glass (no console error).
 */
const DEFAULT_CARD_BG = "/images/projects/card-bg.png";

const PROJECT_BACKGROUNDS: Record<string, string> = {
  "Microsoft & Google Event Streaming": "/images/projects/microsoft-office-events.png",
  "Email Archiving Service": "/images/projects/email-archiving-service.png",
  "Delivery Safety Net": "/images/projects/final-failure-watchdog.png",
  "At-Risk Teenagers Monitoring System": "/images/projects/students-tracking-system.png",
  "Developer Portfolio Website": "/images/projects/portfolio-website.png",
  "Securing a Shared Search Platform":
    "/images/projects/opensearch-fine-grained-access-control.png",
};

/** Per-project opacity override for `PROJECT_BACKGROUNDS` (front + back), keyed by project name. */
const PROJECT_BACKGROUND_OPACITY: Record<string, number> = {
  "At-Risk Teenagers Monitoring System": 0.06,
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
 * flip glass cards (see `ProjectCard`).
 *
 * Motion: a subtle stagger fade-up reveal on scroll, mirroring the About section. It is
 * reduced-motion-safe — `useReducedMotion()` disables the reveal (cards render in place) and
 * the card flip/hover/shimmer are gated under `prefers-reduced-motion` in CSS. The `<noscript>`
 * block restores the reveal opacity and unfolds the flip cards (front + back stacked) so the
 * section is fully readable when JS is disabled.
 *
 * The section exposes the `#projects` anchor (spec §5.3), which the primary navbar links to
 * and highlights via scroll-spy (see `lib/navigation.ts`).
 */

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
      className="relative isolate overflow-hidden bg-bg-base py-16 lg:py-24"
    >
      <SectionBackground />

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
        <SectionHeading
          className="projects-reveal"
          headingId="projects-heading"
          eyebrow="SYS://PROJECTS"
          title="Featured Projects"
          lead={
            <>
              A few backend systems I&apos;ve built and led.
              <br />
              Tap a card to flip it over.
            </>
          }
        />

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
                backgroundOpacity={PROJECT_BACKGROUND_OPACITY[project.name]}
              />
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
