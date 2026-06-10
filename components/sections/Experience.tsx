import { ExperienceIntro } from "@/components/sections/ExperienceIntro";
import { ExperienceSpotlight } from "@/components/sections/ExperienceSpotlight";
import { ExperienceGitGraph } from "@/components/ui/ExperienceGitGraph";
import { about } from "@/lib/content/data/about";
import { experiences } from "@/lib/content/data/experience";
import { buildExperienceGraph } from "@/lib/content/experienceGraph";
import { filterConfidentialityReviewed } from "@/lib/content/loaders";
import type { Experience as ExperienceModel } from "@/lib/content/types";

/**
 * Experience section (spec §8.3) — a git commit graph of professional and
 * leadership roles: a main branch from the B.Sc. degree (root) up to the current
 * role, with a side branch (Private Tutor → Team Leader) forking at "Malware Analyst"
 * and merging back at the top. Topology is built in `buildExperienceGraph`.
 *
 * Confidentiality gating (spec §15.4, tasks/README Rule 9): only entries with
 * `confidentialityReviewed: true` are ever rendered; the gate runs here so an
 * unreviewed work entry can never reach the DOM regardless of ordering. The graph
 * builder degrades gracefully to a straight main lane if a branch node is gated out.
 *
 * The section exposes the `#experience` anchor (spec §5.3). Per spec §5.1 the
 * primary navbar carries only Home/Projects/Courses/Resume — homepage sections
 * are anchor targets, not navbar items — so `lib/navigation.ts` is intentionally
 * left unchanged here, consistent with how the About section (`#about`) was
 * wired in Task 5.2.
 *
 * This stays a server component so the graph content is rendered into the initial
 * HTML (available without client JS, good for SEO/AT) and the ongoing role's
 * duration is computed once at build time here, then handed to the client
 * `ExperienceGitGraph` — avoiding a runtime clock dependency and any hydration
 * mismatch (§8.3.2). The per-node scroll reveal lives in `ExperienceGitNode`.
 */

const ONGOING_END_SORT_KEY = "9999-99";

/** Sort key for an entry's end; an ongoing role sorts to the top. */
function endSortKey(entry: ExperienceModel): string {
  if (entry.endDate === "Present") {
    return ONGOING_END_SORT_KEY;
  }
  return entry.endDate ?? entry.startDate;
}

/** Reverse-chronological: current / most-recently-ended first, then by start. */
function byMostRecent(a: ExperienceModel, b: ExperienceModel): number {
  const endComparison = endSortKey(b).localeCompare(endSortKey(a));
  if (endComparison !== 0) {
    return endComparison;
  }
  return b.startDate.localeCompare(a.startDate);
}

/** Whole months between a start year-month and now (build time for static pages). */
function monthsElapsedSince(start: string, now = new Date()): number {
  const [startYear, startMonth] = start.split("-").map(Number);
  if (!startYear || !startMonth) {
    return 0;
  }
  const months = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth);
  return Math.max(0, months);
}

/** Human-readable span (e.g. `3 yrs 8 mos`) from a whole-month count. */
function formatDuration(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  }
  if (months > 0) {
    parts.push(`${months} mo${months === 1 ? "" : "s"}`);
  }
  return parts.length > 0 ? parts.join(" ") : "1 mo";
}

/**
 * Resolve the duration label shown under an entry's dates. Prefer the
 * owner-provided label (spec §8.3 wording); otherwise compute it for an ongoing
 * role (§8.3.2). Completed roles with no provided label simply show their date
 * range — no value is invented.
 */
function resolveDuration(entry: ExperienceModel): string | null {
  if (entry.durationLabel) {
    return entry.durationLabel;
  }
  if (entry.endDate === "Present") {
    return formatDuration(monthsElapsedSince(entry.startDate));
  }
  return null;
}

export function Experience() {
  const reviewed = filterConfidentialityReviewed(experiences);
  const entries = [...reviewed].sort(byMostRecent);

  // No reviewed entries → render nothing rather than an empty section shell.
  if (entries.length === 0) {
    return null;
  }

  // Resolve each entry's duration at build time (avoids a client clock dependency),
  // then compose the git tree: the experiences plus the degree root (§8.3).
  const resolved = entries.map((entry) => ({
    experience: entry,
    duration: resolveDuration(entry),
  }));
  const graph = buildExperienceGraph(resolved, about.education);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative isolate overflow-hidden border-t border-border bg-bg-base py-16 lg:py-24"
    >
      {/*
       * Progressive-enhancement safety net (spec §7.5/§8.3): the timeline's reveal is a
       * scroll-scrubbed "draw" whose fill vars (--fill / --dot-* / --card-body) default to
       * the fully-drawn state, so the SSR HTML is already complete and visible without JS.
       * This block is a belt-and-suspenders guarantee that the card content and commit dots
       * stay visible if scripting never runs; it is inert whenever JS runs.
       */}
      <noscript>
        <style>{`.experience-flip-inner{display:block!important;transform:none!important}.experience-flip-face{transform:none!important;-webkit-backface-visibility:visible!important;backface-visibility:visible!important;min-height:0!important}.experience-flip-toggle,.experience-flip-hint{display:none!important}.git-dot,.tree-dot{opacity:1!important}`}</style>
      </noscript>

      {/* Decorative backdrop glow — tokens only, echoes the About/Hero atmosphere. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_46%_at_88%_-4%,color-mix(in_srgb,var(--gradient-to)_11%,transparent),transparent_34%),radial-gradient(46%_42%_at_6%_6%,color-mix(in_srgb,var(--accent)_8%,transparent),transparent_32%)]"
      />

      <ExperienceSpotlight />

      <div className="site-shell relative z-10">
        <ExperienceIntro />

        <ExperienceGitGraph graph={graph} />
      </div>
    </section>
  );
}
