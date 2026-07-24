"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { CountUp } from "@/components/ui/CountUp";
import { Magnetic } from "@/components/ui/Magnetic";
import { TypewriterRotator } from "@/components/ui/TypewriterRotator";
import { profile } from "@/lib/content/data/profile";
import { learningPaths } from "@/lib/content/data/learning-paths";
import { cn } from "@/lib/utils";
import { useResumeViewer } from "@/components/providers/ResumeViewerProvider";

const PRIMARY_CTA_LABEL = "Resume";
const SECONDARY_CTA_LABEL = "Contact";
const TYPEWRITER_CHAR_MS = 88;

const heroTextLines = profile.heroText.split("\n").filter(Boolean);

// Rotating typewriter subtitle rendered under the role title (Hero, §7.3).
const heroRoles = [
  "AI Agents Enthusiastic",
  "Team Leader Volunteer",
  "Private Tutor",
  "Mentoring Juniors",
  "Cloud Python Developer",
  "AWS Expert",
  "Cyber Security Oriented",
] as const;

function yearsExperienceSince(startDate: string): number {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  if (!startYear || !startMonth) return 0;
  const now = new Date();
  const delta = now.getFullYear() - startYear;
  return Math.max(0, now.getMonth() + 1 >= startMonth ? delta : delta - 1);
}

const yearsOfExperience = yearsExperienceSince(profile.yearsExperienceStartDate);

/**
 * Floating tags pinned to the left edge of the profile-frame ellipse. They pop in
 * bottom-to-top, one second apart, each reusing the original experience-tag
 * spring + float treatment. The courses count is derived from the Courses
 * section data so it never drifts from what that section renders.
 */
const totalCoursesCompleted = learningPaths.reduce(
  (total, path) => total + path.courses.length,
  0,
);

const profileTags = [
  {
    key: "experience",
    ariaLabel: `${yearsOfExperience}+ years of experience`,
    value: `${yearsOfExperience}+`,
    numericValue: yearsOfExperience,
    lines: ["Years of", "Experience"],
    positionClasses:
      "-top-1 -left-6 sm:-top-[4.6px] sm:-left-[28px] min-[850px]:-top-3 min-[850px]:-left-10",
    appearDelay: 3.15,
  },
  {
    key: "courses",
    ariaLabel: `${totalCoursesCompleted}+ external courses completed`,
    value: `${totalCoursesCompleted}+`,
    numericValue: totalCoursesCompleted,
    lines: ["External", "Courses", "Completed"],
    positionClasses:
      "top-1/2 -translate-y-1/2 -left-12 sm:-left-[55px] min-[850px]:-left-20",
    appearDelay: 2.15,
  },
  {
    key: "degree",
    ariaLabel: "B.Sc Computer Science Degree",
    value: "B.Sc",
    lines: ["Computer", "Science", "Degree"],
    // Bottom offset is a touch larger than the top tag's (rather than the same
    // -1/-2/-3 value) because this tag wraps onto 3 lines and is taller, so a
    // matching edge offset would pull its center closer to the middle tag than
    // the top tag's. The extra px exactly compensates for that height delta so
    // the middle tag sits equidistant between the top and bottom tags.
    positionClasses:
      "-bottom-[7.2px] -left-[22px] sm:-bottom-[8.2px] sm:-left-[25px] min-[850px]:-bottom-[18.41px] min-[850px]:-left-10",
    appearDelay: 1.15,
  },
] as const;

const easeOut = [0.22, 1, 0.36, 1] as const;

const ctaBaseClasses =
  "group inline-flex min-h-11 min-w-[2.75rem] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-body font-medium outline-none transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.015]";

const ctaIconClasses =
  "hero-cta-icon-bounce shrink-0";

const paragraphContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.33,
    },
  },
};

const paragraphItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: easeOut },
  },
};

function ResumeIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={ctaIconClasses}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={ctaIconClasses}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      <path d="M8 9h8" />
      <path d="M8 13h5" />
    </svg>
  );
}

function useTypewriter(text: string, enabled: boolean, charDelayMs: number, skip: boolean) {
  const [displayed, setDisplayed] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (skip || !enabled) {
      return;
    }

    let index = 0;
    let timer: number | undefined;

    const step = () => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        setComplete(true);
        return;
      }

      timer = window.setTimeout(step, charDelayMs);
    };

    timer = window.setTimeout(step, charDelayMs);

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [text, enabled, charDelayMs, skip]);

  if (skip) {
    return { displayed: text, complete: true };
  }

  if (!enabled) {
    return { displayed: "", complete: false };
  }

  return { displayed, complete };
}

type HeroContentProps = {
  initials: string;
};

/**
 * Animated Hero copy — typewriter name, staggered reveals, reduced-motion fallbacks (§7.3).
 */
export function HeroContent({ initials }: HeroContentProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [greetingReady, setGreetingReady] = useState(prefersReducedMotion);
  // The resume preview modal is shared app-wide (Hero CTA + navbar open the same
  // dialog); its state and narrow-mobile fallback live in the resume-viewer context.
  const { open: resumeOpen, openResume } = useResumeViewer();

  const { displayed: displayedName, complete: nameComplete } = useTypewriter(
    profile.name,
    greetingReady,
    TYPEWRITER_CHAR_MS,
    prefersReducedMotion
  );

  const contentRevealed = prefersReducedMotion || greetingReady;

  // Placeholder (no image) — kept as a square avatar, independent of the framed portrait.
  const profileImageClasses = cn(
    "shrink-0 object-contain",
    "mx-auto h-52 w-auto sm:h-60",
    "min-[850px]:mx-0 min-[850px]:h-auto min-[850px]:max-h-[25rem] min-[850px]:w-auto lg:max-h-[27rem]"
  );

  // Framed-portrait sizing. The frame box is a touch wider than the portrait's own
  // aspect (1191×1852 ≈ 5/8) so the body sits inside the oval without being clipped.
  // `min-[850px]:ml-20` reserves the widest tag overhang (the middle tag's
  // `min-[850px]:-left-20`) as real layout space — the tags are absolutely
  // positioned, so without it the flex row lets the text column run underneath
  // them at narrow row-layout widths.
  const profileFrameClasses = cn(
    "relative isolate shrink-0",
    "h-56 sm:h-64 min-[850px]:h-[26rem] lg:h-[28rem]",
    "aspect-[5/7]",
    "min-[850px]:ml-20"
  );

  // Clip the portrait to the frame ellipse: the top half stays fully visible (head
  // pops out), the lower half is masked to the same ellipse the border/fill use, so
  // the body curves to match the frame and never spills outside it.
  const profileImageMask = {
    maskImage:
      "linear-gradient(#000, #000), radial-gradient(ellipse 50% 50% at 50% 50%, #000 99%, transparent 100%)",
    maskSize: "100% 50%, 100% 100%",
    maskPosition: "top, bottom",
    maskRepeat: "no-repeat",
    maskComposite: "add",
    WebkitMaskImage:
      "linear-gradient(#000, #000), radial-gradient(ellipse 50% 50% at 50% 50%, #000 99%, transparent 100%)",
    WebkitMaskSize: "100% 50%, 100% 100%",
    WebkitMaskPosition: "top, bottom",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskComposite: "source-over",
  } as const;

  return (
    <div className="flex w-full flex-col gap-8 sm:gap-10 min-[850px]:flex-row min-[850px]:items-start min-[850px]:gap-10 lg:gap-12">
      {/* Left column on md+; `contents` on mobile lets the image slot between text and buttons. */}
      <div className="contents min-[850px]:flex min-[850px]:min-w-0 min-[850px]:flex-1 min-[850px]:flex-col min-[850px]:gap-8">
        <div className="order-1 flex min-w-0 flex-col gap-0 min-[850px]:order-none">
          <h1
            id="hero-heading"
            aria-label={`Hello! I'm ${profile.name}`}
            className="m-0 text-[3.25rem] font-semibold leading-[1.0] tracking-tight sm:text-[3.75rem] lg:text-[5.5rem]"
          >
            <motion.span
              className="mb-0 block text-body font-medium tracking-wide text-text-secondary lg:text-[1.875rem]"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: easeOut }}
              onAnimationComplete={() => {
                if (!prefersReducedMotion) {
                  setGreetingReady(true);
                }
              }}
            >
              Hello! I&apos;m
            </motion.span>
            <span className="inline-flex items-baseline">
              <span className="relative inline-block">
                <span className="hero-name-glow bg-gradient-to-r from-gradient-from to-gradient-to bg-clip-text text-transparent">
                  {displayedName}
                </span>
                {nameComplete && !prefersReducedMotion ? (
                  <span
                    aria-hidden="true"
                    className="hero-name-shine absolute inset-0"
                  >
                    {displayedName}
                  </span>
                ) : null}
              </span>
              {!nameComplete && !prefersReducedMotion ? (
                <span
                  aria-hidden="true"
                  className="hero-type-cursor ml-1 inline-block h-[0.82em] w-[2px] translate-y-[0.06em] rounded-full bg-gradient-to-b from-gradient-from to-gradient-to"
                />
              ) : null}
            </span>
          </h1>

          <motion.p
            className="m-0 text-h2 font-medium text-text-secondary sm:text-h1 lg:text-[2.25rem]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={contentRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.68, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.18 }}
          >
            <span className="relative inline-block">
              {profile.title}
              {nameComplete && !prefersReducedMotion ? (
                <span
                  aria-hidden="true"
                  className="hero-name-shine hero-name-shine--delayed absolute inset-0"
                >
                  {profile.title}
                </span>
              ) : null}
            </span>
          </motion.p>

          <motion.div
            className="mt-1 min-h-[1.6em] text-lg font-medium leading-[1.6] text-accent sm:text-xl lg:text-[1.5rem]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={contentRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.68, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.3 }}
          >
            <TypewriterRotator phrases={heroRoles} start={contentRevealed} />
          </motion.div>

          <motion.div
            className="mt-4 flex flex-col gap-1.5 text-lg text-white sm:text-xl lg:text-[1.375rem] lg:leading-relaxed"
            variants={paragraphContainerVariants}
            initial="hidden"
            animate={contentRevealed ? "visible" : "hidden"}
          >
            {heroTextLines.map((line) => (
              <motion.p key={line} variants={paragraphItemVariants} className="m-0 max-w-none xl:whitespace-nowrap">
                {line}
              </motion.p>
            ))}
          </motion.div>

        </div>

        <motion.div
          className="order-3 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap min-[850px]:order-none"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={contentRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.68, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.72 }}
        >
          <Magnetic className="w-full sm:w-auto">
            <button
              type="button"
              onClick={openResume}
              aria-haspopup="dialog"
              aria-expanded={resumeOpen}
              className={cn(
                ctaBaseClasses,
                "w-full border border-white/10 bg-accent text-accent-contrast shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_0_rgba(45,212,191,0)] backdrop-blur hover:bg-accent-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_12px_28px_rgba(45,212,191,0.22)]"
              )}
            >
              {PRIMARY_CTA_LABEL}
              <ResumeIcon />
            </button>
          </Magnetic>
          {/*
           * Secondary CTA → Contact section (§8.1, §8.8 wiring note). A real
           * in-page anchor (not a no-op): keyboard-operable by default, and it
           * inherits the global smooth scroll + `scroll-padding-top` (and the
           * reduced-motion fallback to an instant jump) from globals.css.
           */}
          <Magnetic className="w-full sm:w-auto">
            <a
              href="#contact"
              className={cn(
                ctaBaseClasses,
                "w-full border border-border bg-bg-surface-raised/90 text-text-primary shadow-[0_0_0_rgba(45,212,191,0)] backdrop-blur hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent)_10%,rgb(28_36_46_/_0.9))] hover:text-accent hover:shadow-[0_12px_28px_rgba(45,212,191,0.14)] supports-[backdrop-filter]:bg-bg-surface-raised/75 supports-[backdrop-filter]:hover:bg-[color-mix(in_srgb,var(--accent)_10%,rgb(28_36_46_/_0.75))]"
              )}
            >
              {SECONDARY_CTA_LABEL}
              <ContactIcon />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        className="order-2 flex shrink-0 items-start justify-center min-[850px]:order-none min-[850px]:justify-end"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={contentRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.83, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.24 }}
      >
        {profile.profileImage ? (
          <div className={profileFrameClasses}>
            {/*
             * Decorative oval frame (§6.3 / §7 aesthetic): the fill, the border and the
             * portrait's clip all share this element's ellipse (inset-0, rounded-[50%]),
             * so the border traces exactly where the portrait is clipped — nothing
             * spills outside. Fill + border fade in over the lower half only, leaving
             * the cropped head "popping out" of an unframed top.
             */}
            {/* Glass version of the fill — same oval and gradient stop, teal accent colour. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-[50%] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-28px_76px_rgba(45,212,191,0.14),0_24px_70px_rgba(2,6,23,0.42)] backdrop-blur-2xl"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 30%, color-mix(in srgb, var(--accent) 30%, transparent) 70%)",
              }}
            />
            {/* Lower-half border treatment, softened into a glass edge — teal accent colour. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-[50%] border-[3px] border-[rgba(45,212,191,0.62)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_34px_rgba(45,212,191,0.22)]"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 40%, #000 62%)",
                maskImage: "linear-gradient(to bottom, transparent 40%, #000 62%)",
              }}
            />
            <Image
              src={profile.profileImage}
              alt={`${profile.name} profile`}
              width={1191}
              height={1852}
              priority
              sizes="(min-width: 1024px) 20rem, (min-width: 850px) 18.6rem, (min-width: 640px) 11.5rem, 10rem"
              className="absolute inset-0 h-full w-full object-contain"
              style={profileImageMask}
            />
            {/* Profile tags — pop in bottom-to-top after the image settles. Positioning
                lives on a plain wrapper so the middle tag's translate centering isn't
                overwritten by Framer Motion's transform. */}
            {profileTags.map((tag) => (
              <div
                key={tag.key}
                aria-label={tag.ariaLabel}
                className={cn("absolute z-20", tag.positionClasses)}
              >
                <motion.div
                  initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
                  animate={
                    contentRevealed
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 12,
                          delay: tag.appearDelay,
                        }
                  }
                >
                  <div
                    className={cn(
                      // Fixed footprint (matches the 3-line "Degree" tag's own
                      // content box) so all three pills render at the exact same
                      // size regardless of label line-count/font-size — the box
                      // no longer shrinks to fit its own content.
                      "flex flex-col items-center justify-center",
                      // The sm footprint is the base one scaled by the frame-height
                      // ratio (256/224) so the tags keep the same proportion to the
                      // ellipse at every breakpoint.
                      "h-[72.8px] w-[51.4px] sm:h-[83.2px] sm:w-[58.7px] min-[850px]:h-[140px] min-[850px]:w-[97px]",
                      "rounded-full",
                      "border border-[rgba(45,212,191,0.62)]",
                      "backdrop-blur-2xl",
                      "gap-1 px-2.5 py-3",
                      "sm:gap-1 sm:px-3 sm:py-3.5",
                      "min-[850px]:gap-1.5 min-[850px]:px-4 min-[850px]:py-6"
                    )}
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 30%, color-mix(in srgb, var(--accent) 30%, transparent) 70%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -8px 20px rgba(45,212,191,0.14), 0 0 34px rgba(45,212,191,0.22)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="font-bold leading-none text-white text-sm sm:text-base min-[850px]:text-3xl"
                    >
                      {"numericValue" in tag ? (
                        <CountUp
                          value={tag.numericValue}
                          suffix="+"
                          start={contentRevealed}
                          delay={tag.appearDelay + 0.1}
                        />
                      ) : (
                        tag.value
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-center font-medium leading-tight text-white/70",
                        tag.lines.length > 2
                          ? "text-[6px] sm:text-[7px] min-[850px]:text-[10px]"
                          : "text-[7px] sm:text-[8px] min-[850px]:text-[11px]",
                      )}
                    >
                      {tag.lines.map((line, index) => (
                        <span key={line}>
                          {index > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </span>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          <div
            role="img"
            aria-label={`${profile.name} profile`}
            className={cn(
              profileImageClasses,
              "flex aspect-square items-center justify-center rounded-full bg-bg-surface-raised font-mono text-display font-semibold text-accent"
            )}
          >
            <span aria-hidden="true">{initials}</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
