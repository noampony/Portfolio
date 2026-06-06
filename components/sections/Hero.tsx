import { FloatingCode } from "@/components/sections/FloatingCode";
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
  "inline-flex min-h-11 min-w-[2.75rem] items-center justify-center rounded-md px-5 py-2.5 text-body font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base";

/**
 * Hero section — layout (Task 4.1), styling (Task 4.2), animations (Task 4.3).
 * CTAs render as keyboard-focusable no-ops (no href, no dead links).
 */
export function Hero() {
  const initials = getInitials(profile.name);

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate w-full overflow-x-hidden"
    >
      {/* Atmospheric backdrop — tokens only (§6.3) + decorative floating code (§8.1). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-bg-base" />
        <div
          className="absolute -right-1/4 top-1/4 h-[min(70vh,28rem)] w-[min(90vw,32rem)] rounded-full opacity-[0.08] blur-3xl"
          style={{
            background: "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))",
          }}
        />
        <div
          className="absolute -left-1/3 bottom-0 h-[min(50vh,20rem)] w-[min(70vw,24rem)] rounded-full bg-accent opacity-[0.04] blur-3xl"
        />
        <FloatingCode />
      </div>

      <div className="hero-entrance mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-measure flex-col justify-center gap-8 px-6 py-10 sm:gap-10 md:flex-row md:items-center md:justify-between md:gap-10 md:py-12 lg:gap-12 lg:py-16">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <h1
            id="hero-heading"
            className="m-0 max-w-measure text-display font-semibold tracking-tight text-text-primary"
          >
            {profile.name}
          </h1>

          <p className="m-0 max-w-measure text-h2 font-medium text-text-secondary">{profile.title}</p>

          <div className="flex max-w-measure flex-col gap-1 text-body text-text-primary">
            {heroTextLines.map((line) => (
              <p key={line} className="m-0">
                {line}
              </p>
            ))}
          </div>

          <p className="m-0 max-w-measure text-body text-text-secondary">{profile.location}</p>

          <div className="flex w-full max-w-measure flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              className={cn(
                ctaBaseClasses,
                "w-full bg-accent text-accent-contrast hover:bg-accent-hover sm:w-auto"
              )}
            >
              {PRIMARY_CTA_LABEL}
            </button>
            <button
              type="button"
              className={cn(
                ctaBaseClasses,
                "w-full border border-border bg-bg-surface-raised text-text-primary hover:border-accent hover:text-accent sm:w-auto"
              )}
            >
              {SECONDARY_CTA_LABEL}
            </button>
          </div>

          <p className="m-0 max-w-measure pt-1">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-sm text-body text-text-secondary underline-offset-4 outline-none transition-colors hover:text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent"
            >
              LinkedIn
            </a>
          </p>
        </div>

        <div className="flex shrink-0 justify-center md:justify-end">
          {profile.profileImage ? (
            // Profile image source is TBD (§8.1) — this branch activates once owner supplies an asset.
            // eslint-disable-next-line @next/next/no-img-element -- static public asset when available
            <img
              src={profile.profileImage}
              alt=""
              width={160}
              height={160}
              className="h-28 w-28 rounded-full border border-border object-cover shadow-[0_0_0_1px_var(--border),0_0_2rem_-0.25rem_color-mix(in_srgb,var(--accent)_35%,transparent)] sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
            />
          ) : (
            <div
              role="img"
              aria-label={`${profile.name} profile`}
              className="flex h-28 w-28 items-center justify-center rounded-full border border-border bg-bg-surface-raised font-mono text-display font-semibold text-accent shadow-[0_0_0_1px_var(--border),0_0_2rem_-0.25rem_color-mix(in_srgb,var(--accent)_35%,transparent)] sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40"
            >
              <span aria-hidden="true">{initials}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
