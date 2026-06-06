import { profile } from "@/lib/content/data/profile";
import { cn } from "@/lib/utils";

/** Public LinkedIn profile (spec §8.1, §15.8). */
const LINKEDIN_URL = "https://www.linkedin.com/in/noam-pony/";

/**
 * CTA labels are TBD in spec §8.1 — these are suggested defaults only,
 * owner-confirmable before launch. Buttons are intentional no-ops until
 * Tasks 10.3 (Resume) and 11.3 (Contact) wire them up.
 */
const PRIMARY_CTA_LABEL = "Resume";
const SECONDARY_CTA_LABEL = "Contact";

const heroTextLines = profile.heroText.split("\n").filter(Boolean);

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const ctaBaseClasses =
  "inline-flex min-h-11 min-w-[2.75rem] items-center justify-center rounded-md px-5 py-2 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

/**
 * Hero section — semantic layout and required MVP content (spec §8.1, Task 4.1).
 *
 * Styling and responsive polish land in Task 4.2; floating-code animation in 4.3.
 * CTAs render as keyboard-focusable no-ops (no href, no dead links).
 */
export function Hero() {
  const initials = getInitials(profile.name);

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative mx-auto max-w-measure px-6 py-16"
    >
      {/* Decorative floating-code backdrop — animated in Task 4.3. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        data-floating-code-container
      />

      <div className="relative flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4">
          <h1 id="hero-heading" className="text-h1 font-semibold text-text-primary">
            {profile.name}
          </h1>

          <p className="m-0 text-h2 text-text-secondary">{profile.title}</p>

          <div className="flex flex-col gap-1 text-body text-text-primary">
            {heroTextLines.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>

          <p className="m-0 text-body text-text-secondary">{profile.location}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" className={cn(ctaBaseClasses, "bg-accent text-accent-contrast hover:bg-accent-hover")}>
              {PRIMARY_CTA_LABEL}
            </button>
            <button
              type="button"
              className={cn(
                ctaBaseClasses,
                "border border-border bg-bg-surface-raised text-text-primary hover:border-accent hover:text-accent"
              )}
            >
              {SECONDARY_CTA_LABEL}
            </button>
          </div>

          <p className="m-0 pt-1">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm text-body text-text-secondary underline-offset-4 outline-none transition-colors hover:text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent"
            >
              LinkedIn
            </a>
          </p>
        </div>

        {profile.profileImage ? (
          // Profile image source is TBD (§8.1) — this branch activates once owner supplies an asset.
          // eslint-disable-next-line @next/next/no-img-element -- static public asset when available
          <img
            src={profile.profileImage}
            alt=""
            className="h-40 w-40 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`${profile.name} profile`}
            className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full border border-border bg-bg-surface-raised font-mono text-h1 font-semibold text-accent"
          >
            <span aria-hidden="true">{initials}</span>
          </div>
        )}
      </div>
    </section>
  );
}
