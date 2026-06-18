"use client";

import type { Skill } from "@/lib/content/types";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

/**
 * Individual skill badge — name + optional inline notes.
 *
 * Notes are rendered inline (never hover-only, per spec §8.6). The badge carries
 * an accessible label that combines the name and notes when both are present so
 * screen readers get the full context in one announcement.
 *
 * Icons are omitted here — the icon source is TBD (spec §6.8, §8.6).
 *
 * `max-w-full min-w-0` prevents badges with long notes (e.g. AWS) from
 * overflowing their flex-wrap container on narrow viewports.
 */
export function SkillBadge({ skill, className }: SkillBadgeProps) {
  const ariaLabel = skill.notes
    ? `${skill.name}: ${skill.notes}`
    : skill.name;

  return (
    <span
      className={cn(
        "inline-flex min-w-0 max-w-full flex-col gap-0.5 rounded-md border border-border bg-bg-surface px-3 py-2",
        "text-small text-text-primary transition-colors duration-150",
        "hover:border-accent/50 hover:bg-bg-surface-raised",
        className,
      )}
      aria-label={ariaLabel}
    >
      <span className="font-medium leading-snug">{skill.name}</span>
      {skill.notes && (
        <span className="break-words text-[0.7rem] leading-tight text-text-muted">
          {skill.notes}
        </span>
      )}
    </span>
  );
}
