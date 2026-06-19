"use client";

import type { Skill } from "@/lib/content/types";
import { getSkillIcon } from "@/lib/content/skill-icons";
import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

/**
 * Icon tile for a single skill — logo on top, name below.
 * Uses brand SVG paths from skill-icons; falls back to the skill's initial.
 */
export function SkillBadge({ skill, className }: SkillBadgeProps) {
  const iconPath = getSkillIcon(skill.name);

  return (
    <div
      className={cn(
        "group flex flex-col items-center gap-2 rounded-xl border border-border bg-bg-surface",
        "px-1.5 pb-2.5 pt-3 transition-all duration-300",
        "hover:border-accent/40 hover:bg-bg-surface-raised hover:-translate-y-2 hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center">
        {iconPath ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-7 w-7 fill-current text-accent transition-transform duration-300 group-hover:scale-110"
          >
            <path d={iconPath} />
          </svg>
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 font-mono text-sm font-bold text-accent transition-transform duration-300 group-hover:scale-110">
            {skill.name.charAt(0)}
          </span>
        )}
      </div>
      <span className="line-clamp-2 flex h-[2em] w-full items-center justify-center text-center font-mono text-[0.6rem] font-medium leading-tight tracking-wide text-text-secondary group-hover:text-text-primary">
        {skill.name}
      </span>
    </div>
  );
}
