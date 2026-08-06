"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionBackground } from "@/components/layout/SectionBackground";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/lib/content/data/projects";
import { filterConfidentialityReviewed } from "@/lib/content/loaders";
import { revealItemVariants, staggerContainerVariants } from "@/lib/motion";

/**
 * Decorative background photos behind the cards, shown at low opacity (served from `/public`).
 * To give a project its own image, drop the file under `public/images/projects/` and add a
 * `"<project name>": "<path>"` entry below. A project with no entry renders as plain glass,
 * and a missing file degrades gracefully the same way (no console error).
 *
 * There is deliberately no shared fallback image: `public/images/projects/card-bg.png` is a
 * byte-identical copy of `students-tracking-system.png` (the At-Risk system UI, showing names,
 * faces and health/nutrition fields), so using it as a generic backdrop would publish that
 * content on unrelated cards — see spec §15.4 / AGENTS.md. Add a purpose-made neutral image
 * here if a default is wanted later.
 */
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

/** Disclosure chevron, matching the Skills section's "Show all / Show less" affordance. */
function Chevron({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={direction === "up" ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
    </svg>
  );
}

/** Cards on the opening row — a deliberately wider two-up row. */
const FIRST_ROW_SIZE = 2;
/** Cards per row after the opening one. */
const ROW_SIZE = 3;
/** Rows shown before the "show more" disclosure: the two-up row plus one three-up row. */
const VISIBLE_ROWS = 2;

/** Shared grid geometry for both card lists — six `lg` columns hold either 2 or 3 cards. */
const GRID_CLASS = "grid list-none gap-4 p-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6";

/**
 * Groups card indices into display rows: one two-up row, then three-up rows.
 *
 * Purely a function of the count, so the layout keeps working as projects are added —
 * 7 → 2 + 3 + 2, 8 → 2 + 3 + 3, 9 → 2 + 3 + 3 + 1.
 */
function planRows(count: number): number[][] {
  if (count === 0) return [];

  const indices = Array.from({ length: count }, (_, index) => index);
  const rows = [indices.slice(0, FIRST_ROW_SIZE)];
  for (let start = FIRST_ROW_SIZE; start < count; start += ROW_SIZE) {
    rows.push(indices.slice(start, start + ROW_SIZE));
  }

  return rows;
}

/**
 * Grid placement for a card, from how many cards share its row. The `lg` grid is six columns
 * so a row holds either two cards (span 3) or three (span 2), both filling the full width.
 * A trailing row of one is centred rather than left hanging at the left edge.
 */
function lgPlacementClass(rowLength: number): string {
  if (rowLength === 1) return "lg:col-span-2 lg:col-start-3";
  return rowLength === 2 ? "lg:col-span-3" : "lg:col-span-2";
}

/**
 * Projects Preview section (spec §8.4) — the homepage's top projects.
 *
 * Confidentiality gating (spec §15.4, tasks/README Rule 9): only projects with
 * `confidentialityReviewed: true` are ever rendered, so an unreviewed Check Point project
 * can never reach the DOM regardless of ordering. The section renders whatever is reviewed —
 * and renders nothing rather than an empty shell when none are.
 *
 * Layout / interaction (Task 7.3): a responsive grid (1 col → 2 → a six-column `lg` grid) of
 * click/tap-to-flip glass cards (see `ProjectCard`). On `lg` the first row is a wider two-up
 * row and later rows are three-up — see `planRows`.
 *
 * Disclosure: only the first two rows are shown up front; the rest sit in a second list behind
 * a toggle. The toggle renders *after* that list, so it sits directly under the visible cards
 * while collapsed (the collapsed list occupies no space) and under the revealed cards once open
 * — one control for both directions, always adjacent to what it acts on, and in DOM order for
 * keyboard users. The extra rows are always in the HTML (collapsed, not unmounted) so assistive
 * tech, crawlers and the `<noscript>` path can reach them. Collapsing is a CSS height/fade
 * transition on `.projects-more-wrap`, not the `hidden` attribute — see globals.css for why.
 *
 * Motion: a subtle stagger fade-up reveal on scroll, mirroring the About section. It is
 * reduced-motion-safe — `useReducedMotion()` disables the reveal (cards render in place) and
 * the card flip/hover/shimmer plus the disclosure's expand/collapse are gated under
 * `prefers-reduced-motion` in CSS. The `<noscript>` block restores the reveal opacity, unfolds
 * the flip cards (front + back stacked), and force-expands the collapsed rows while dropping the
 * (inert) toggle, so the section is fully readable when JS is disabled.
 *
 * The section exposes the `#projects` anchor (spec §5.3), which the primary navbar links to
 * and highlights via scroll-spy (see `lib/navigation.ts`).
 */

/**
 * No-JS fallback: keep the section visible, unfold the flip cards (front + back stacked), and
 * show every project row while hiding the toggle that can no longer do anything.
 */
const NO_JS_FALLBACK = `
.projects-reveal{opacity:1!important;transform:none!important}
.project-flip-inner{display:block!important;transform:none!important}
.project-flip-face{transform:none!important;-webkit-backface-visibility:visible!important;backface-visibility:visible!important}
.project-flip-toggle,.project-flip-hint{display:none!important}
.projects-more-wrap{grid-template-rows:minmax(0,1fr)!important;opacity:1!important;visibility:visible!important}
.projects-more-toggle{display:none!important}
`;

export function ProjectsPreview() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const [expanded, setExpanded] = useState(false);
  const moreId = useId();

  const reviewed = filterConfidentialityReviewed(projects);

  // No reviewed projects → render nothing rather than an empty section shell.
  if (reviewed.length === 0) {
    return null;
  }

  const rows = planRows(reviewed.length);
  const shownRows = rows.slice(0, VISIBLE_ROWS);
  const extraRows = rows.slice(VISIBLE_ROWS);
  const extraCount = extraRows.reduce((total, row) => total + row.length, 0);

  const renderCard = (index: number, rowLength: number) => {
    const project = reviewed[index];

    return (
      <motion.li
        key={project.name}
        variants={revealItemVariants}
        className={`projects-reveal flex ${lgPlacementClass(rowLength)}`}
      >
        <ProjectCard
          project={project}
          headingId={`project-${index}-heading`}
          backgroundImage={PROJECT_BACKGROUNDS[project.name]}
          backgroundOpacity={PROJECT_BACKGROUND_OPACITY[project.name]}
        />
      </motion.li>
    );
  };

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

        <ul className={`mt-10 ${GRID_CLASS}`}>
          {shownRows.map((row) => row.map((index) => renderCard(index, row.length)))}
        </ul>

        {extraCount > 0 ? (
          <>
            <div className="projects-more-wrap" data-expanded={expanded}>
              <ul
                id={moreId}
                aria-label="More projects"
                className={`projects-more pt-4 sm:pt-5 ${GRID_CLASS}`}
              >
                {extraRows.map((row) => row.map((index) => renderCard(index, row.length)))}
              </ul>
            </div>

            <motion.div variants={revealItemVariants} className="projects-reveal mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                aria-controls={moreId}
                className="projects-more-toggle font-mono text-[0.7rem] uppercase tracking-widest"
              >
                <Chevron direction={expanded ? "up" : "down"} />
                {expanded
                  ? "Show fewer projects"
                  : `Show ${extraCount} more project${extraCount === 1 ? "" : "s"}`}
              </button>
            </motion.div>
          </>
        ) : null}
      </motion.div>
    </section>
  );
}
