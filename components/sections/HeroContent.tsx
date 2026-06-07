"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/content/data/profile";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const PRIMARY_CTA_LABEL = "Resume";
const SECONDARY_CTA_LABEL = "Contact";
const TYPEWRITER_CHAR_MS = 88;

const heroTextLines = profile.heroText.split("\n").filter(Boolean);

const easeOut = [0.22, 1, 0.36, 1] as const;

const ctaBaseClasses =
  "group inline-flex min-h-11 min-w-[2.75rem] items-center justify-center gap-2 rounded-md px-5 py-2.5 text-body font-medium outline-none transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-[1.015]";

const ctaIconClasses =
  "hero-cta-icon-bounce shrink-0";

const paragraphContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.22,
    },
  },
};

const paragraphItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [greetingReady, setGreetingReady] = useState(false);

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
        <div className="order-1 flex min-w-0 flex-col gap-5 sm:gap-6 md:order-none">
          <h1
            id="hero-heading"
            aria-label={`Hello! I'm ${profile.name}`}
            className="m-0 text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-[3.25rem] lg:text-[4.75rem]"
          >
            <motion.span
              className="mb-2 block text-body font-medium tracking-wide text-text-secondary sm:mb-3 sm:text-h2 lg:text-[1.875rem]"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
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
            transition={{ duration: 0.45, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.12 }}
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

          <motion.p
            className="m-0 text-body text-text-secondary sm:text-lg"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={contentRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.38 }}
          >
            {profile.location}
          </motion.p>
        </div>

        <motion.div
          className="order-3 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:order-none"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={contentRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.48 }}
        >
          <button
            type="button"
            className={cn(
              ctaBaseClasses,
              "w-full bg-accent text-accent-contrast shadow-[0_0_0_rgba(45,212,191,0)] hover:bg-accent-hover hover:shadow-[0_12px_28px_rgba(45,212,191,0.22)] sm:w-auto"
            )}
          >
            {PRIMARY_CTA_LABEL}
            <DownloadIcon />
          </button>
          <button
            type="button"
            className={cn(
              ctaBaseClasses,
              "w-full border border-border bg-bg-surface-raised text-text-primary shadow-[0_0_0_rgba(45,212,191,0)] hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--bg-surface-raised))] hover:text-accent hover:shadow-[0_12px_28px_rgba(45,212,191,0.14)] sm:w-auto"
            )}
          >
            {SECONDARY_CTA_LABEL}
            <ContactIcon />
          </button>
        </motion.div>
      </div>

      <motion.div
        className="order-2 flex shrink-0 items-start justify-center md:order-none md:justify-end"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={contentRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.55, ease: easeOut, delay: prefersReducedMotion ? 0 : 0.16 }}
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
            {/* Dark-blue gradient fill — clipped to the oval, fills the lower ~70%. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-[50%]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 30%, rgba(96,165,250,0.5) 70%)",
              }}
            />
            {/* Border line — masked to the lower half so the head stays unframed. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 rounded-[50%] border-[3px] border-[rgba(96,165,250,0.7)]"
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
