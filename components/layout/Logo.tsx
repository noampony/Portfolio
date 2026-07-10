import { cn } from "@/lib/utils";

/**
 * Site logo: a rounded-square emblem with a terminal-prompt glyph (`›_`) beside
 * the "Noam Pony" wordmark. Rendered as inline SVG + text so it stays crisp at
 * any size and themes off the site's CSS custom properties (teal→blue gradient).
 *
 * Decorative (`aria-hidden`): the wrapping link in the navbar carries the
 * accessible name ("Noam Pony — home"). The wordmark inherits its colour from
 * that link, so it picks up the link's hover/focus colour transition.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("group/logo inline-flex select-none items-center gap-2.5", className)}
    >
      <span className="site-logo-emblem">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logo-emblem-gradient" x1="4" y1="4" x2="26" y2="26">
              <stop offset="0%" stopColor="var(--gradient-from)" />
              <stop offset="100%" stopColor="var(--gradient-to)" />
            </linearGradient>
          </defs>
          <rect
            x="1.25"
            y="1.25"
            width="27.5"
            height="27.5"
            rx="8.5"
            fill="color-mix(in srgb, var(--accent) 8%, var(--bg-surface-raised))"
            stroke="url(#logo-emblem-gradient)"
            strokeWidth="1.5"
          />
          {/* Terminal chevron `›` */}
          <path
            d="M10 10.5 14.5 15 10 19.5"
            stroke="var(--gradient-from)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cursor underscore `_` */}
          <path
            d="M16.5 19.5 H20.5"
            stroke="var(--gradient-to)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-[0.975rem] font-semibold tracking-tight">Noam Pony</span>
    </span>
  );
}
