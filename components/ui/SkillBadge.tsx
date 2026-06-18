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
 * Icons are omitted here — the icon source is TBD (spec §6.8, §8.6). When an
 * approved, license-safe source is available they can be added in Task 9.3+.
 */
export function SkillBadge({ skill, className }: SkillBadgeProps) {
  const ariaLabel = skill.notes
    ? `${skill.name}: ${skill.notes}`
    : skill.name;

  return (
    <span
      className={cn(
        "inline-flex flex-col gap-0.5 rounded-md border border-border bg-bg-surface px-3 py-2",
        "text-small text-text-primary transition-colors duration-150",
        "hover:border-accent/50 hover:bg-bg-surface-raised",
        className,
      )}
      aria-label={ariaLabel}
    >
      <span className="font-medium leading-snug">{skill.name}</span>
      {skill.notes && (
        <span className="text-[0.7rem] leading-tight text-text-muted">
          {skill.notes}
        </span>
      )}
    </span>
  );
}
