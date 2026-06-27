"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/lib/content/data/profile";
import { resume } from "@/lib/content/data/resume";
import { cn } from "@/lib/utils";
import { ResumeViewer } from "@/components/sections/ResumeViewer";

const PRIMARY_CTA_LABEL = "Resume";
const SECONDARY_CTA_LABEL = "Contact";
const TYPEWRITER_CHAR_MS = 88;

const heroTextLines = profile.heroText.split("\n").filter(Boolean);

function yearsExperienceSince(startDate: string): number {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  if (!startYear || !startMonth) return 0;
  const now = new Date();
  const delta = now.getFullYear() - startYear;
  return Math.max(0, now.getMonth() + 1 >= startMonth ? delta : delta - 1);
}

const yearsOfExperience = yearsExperienceSince(profile.yearsExperienceStartDate);

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
  const [resumeOpen, setResumeOpen] = useState(false);

  // Open the resume preview modal. On narrow mobile, embedded PDF iframes don't
  // render, so open the PDF directly in a new tab instead (same fallback the
  // certificate viewer uses).
  const openResume = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 420) {
      window.open(resume.publicUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setResumeOpen(true);
  };

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
    "md:mx-0 md:h-auto md:max-h-[25rem] md:w-auto lg:max-h-[27rem]"
  );

  // Framed-portrait sizing. The frame box is a touch wider than the portrait's own
  // aspect (1191×1852 ≈ 5/8) so the body sits inside the oval without being clipped.
  const profileFrameClasses = cn(
    "relative isolate shrink-0",
    "h-56 sm:h-64 md:h-[26rem] lg:h-[28rem]",
    "aspect-[5/7]"
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
    <div className="flex w-full flex-col gap-8 sm:gap-10 md:flex-row md:items-start md:gap-10 lg:gap-12">
      {/* Left column on md+; `contents` on mobile lets the image slot between text and buttons. */}
      <div className="contents md:flex md:min-w-0 md:flex-1 md:flex-col md:gap-8">
        <div className="order-1 flex min-w-0 flex-col gap-0 md:order-none">
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
            className="flex flex-col gap-1.5 text-lg text-white sm:text-xl lg:text-[1.375rem] lg:leading-relaxed"
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
          className="order-3 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:order-none"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={contentRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.68, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.72 }}
        >
          <button
            type="button"
            onClick={openResume}
            aria-haspopup="dialog"
            aria-expanded={resumeOpen}
            className={cn(
              ctaBaseClasses,
              "w-full border border-white/10 bg-accent text-accent-contrast shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_0_0_rgba(45,212,191,0)] backdrop-blur hover:bg-accent-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_12px_28px_rgba(45,212,191,0.22)] sm:w-auto"
            )}
          >
            {PRIMARY_CTA_LABEL}
            <ResumeIcon />
          </button>
          {/*
           * Secondary CTA → Contact section (§8.1, §8.8 wiring note). A real
           * in-page anchor (not a no-op): keyboard-operable by default, and it
           * inherits the global smooth scroll + `scroll-padding-top` (and the
           * reduced-motion fallback to an instant jump) from globals.css.
           */}
          <a
            href="#contact"
            className={cn(
              ctaBaseClasses,
              "w-full border border-border bg-bg-surface-raised/90 text-text-primary shadow-[0_0_0_rgba(45,212,191,0)] backdrop-blur hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent)_10%,rgb(28_36_46_/_0.9))] hover:text-accent hover:shadow-[0_12px_28px_rgba(45,212,191,0.14)] supports-[backdrop-filter]:bg-bg-surface-raised/75 supports-[backdrop-filter]:hover:bg-[color-mix(in_srgb,var(--accent)_10%,rgb(28_36_46_/_0.75))] sm:w-auto"
            )}
          >
            {SECONDARY_CTA_LABEL}
            <ContactIcon />
          </a>
        </motion.div>
      </div>

      <motion.div
        className="order-2 flex shrink-0 items-start justify-center md:order-none md:justify-end"
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
            {/* eslint-disable-next-line @next/next/no-img-element -- Hero LCP; static public asset */}
            <img
              src={profile.profileImage}
              alt={`${profile.name} profile`}
              width={1191}
              height={1852}
              className="absolute inset-0 h-full w-full object-contain"
              style={profileImageMask}
            />
            {/* Experience tag — jumps in after the profile image settles, then floats */}
            <motion.div
              aria-label={`${yearsOfExperience}+ years of experience`}
              initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
              animate={
                contentRevealed
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 12, delay: 1.15 }
              }
              className="absolute top-2 -left-8 z-20 sm:top-0 sm:-left-9 md:top-4 md:-left-12"
            >
              <motion.div
                animate={contentRevealed && !prefersReducedMotion ? { y: [0, -8, 0] } : {}}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: 1.9,
                }}
                className={cn(
                  "flex flex-col items-center",
                  "rounded-full",
                  "border border-accent/30",
                  "backdrop-blur-md",
                  "gap-1 px-3 py-4",
                  "sm:gap-1.5 sm:px-3.5 sm:py-5",
                  "md:gap-2 md:px-5 md:py-9"
                )}
                style={{
                  background:
                    "linear-gradient(to bottom, color-mix(in srgb, var(--accent) 28%, transparent), color-mix(in srgb, var(--accent) 12%, transparent))",
                  boxShadow:
                    "0 8px 32px color-mix(in srgb, var(--accent) 22%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="font-bold leading-none text-white text-base sm:text-xl md:text-4xl"
                >
                  {yearsOfExperience}+
                </span>
                <span className="text-center font-medium leading-tight text-white/70 text-[7px] sm:text-[9px] md:text-[11px]">
                  Years of
                  <br />
                  Experience
                </span>
              </motion.div>
            </motion.div>
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

      <ResumeViewer open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
