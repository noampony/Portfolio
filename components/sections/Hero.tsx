import { FloatingCode } from "@/components/sections/FloatingCode";
import { HeroContent } from "@/components/sections/HeroContent";
import { dmSans } from "@/app/fonts";
import { profile } from "@/lib/content/data/profile";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
      className={cn("relative isolate w-full overflow-x-hidden font-hero", dmSans.variable)}
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

      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-7xl flex-col justify-center px-6 py-10 sm:px-10 md:px-16 md:py-12 lg:py-16">
        <HeroContent initials={initials} />
      </div>
    </section>
  );
}
