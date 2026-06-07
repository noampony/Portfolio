"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import {
  EducationCertificateTrigger,
  EducationCertificateViewer,
} from "@/components/sections/EducationCertificateViewer";
import { about } from "@/lib/content/data/about";
import type { EducationCertificateRef } from "@/lib/content/types";

const easeOut = [0.22, 1, 0.36, 1] as const;
const COUNT_DURATION_MS = 1500;

type StatItem = {
  id: string;
  label: string;
  numericValue: number;
  suffix?: string;
};

const stats: StatItem[] = [
  {
    id: "years",
    numericValue: Number(about.stats.yearsExperienceCountLabel),
    label: "Years Experience",
    suffix: "+",
  },
  {
    id: "technologies",
    numericValue: 18,
    label: "Technologies",
    suffix: "+",
  },
  {
    id: "courses",
    numericValue: 35,
    label: "Courses",
    suffix: "+",
  },
];

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const cardRevealVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: easeOut },
  },
};

function DeanListIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="h-3.5 w-3.5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6L12 2z" />
    </svg>
  );
}

function MetricIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M4 18V8m6 10V4m6 14v-7m4 7H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type AnimatedStatValueProps = {
  value: number;
  suffix?: string;
  animate: boolean;
};

function AnimatedStatValue({ value, suffix = "", animate }: AnimatedStatValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate || !isInView) {
      return;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / COUNT_DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayed(Math.round(eased * value));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, isInView, value]);

  return (
    <span ref={ref}>
      {displayed}
      {suffix}
    </span>
  );
}

export function About() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;
  const [activeCertificate, setActiveCertificate] = useState<EducationCertificateRef | null>(
    null,
  );

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="about-section relative isolate overflow-hidden border-t border-border bg-bg-base px-6 py-16 sm:px-10 md:px-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_12%_12%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_28%),radial-gradient(circle_at_86%_20%,color-mix(in_srgb,var(--gradient-to)_14%,transparent),transparent_30%),linear-gradient(180deg,color-mix(in_srgb,var(--bg-surface)_72%,transparent),transparent_48%)]"
      />
      <div aria-hidden="true" className="about-grid-wash" />
      <div aria-hidden="true" className="about-scanline" />

      <div className="about-layout mx-auto grid w-full max-w-7xl gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.86fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,0.9fr)_minmax(36rem,1fr)]">
        <motion.div
          className="about-copy-panel about-layout-copy flex h-full flex-col justify-center max-w-measure"
          initial={animate ? "hidden" : false}
          whileInView={animate ? "visible" : undefined}
          viewport={{ once: true, margin: "-80px" }}
          variants={revealVariants}
        >
          <p className="mb-3 font-mono text-small tracking-wider text-accent">SYS://ABOUT</p>
          <h2
            id="about-heading"
            className="m-0 text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
          >
            I Design High-Scale Cloud Backends That Don&apos;t Blink Under Real-World Load.
          </h2>
          <div className="mt-5 space-y-4 text-body text-text-secondary sm:text-[1.0625rem]">
            {about.professionalSummary.split("\n\n").map((paragraph) => (
              <p key={paragraph} className="m-0">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="about-layout-sidebar grid h-full gap-3 sm:gap-3.5 lg:grid-rows-[auto_auto_minmax(0,1fr)]">
          <motion.div
            aria-label="About statistics"
            className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
            role="group"
            initial={animate ? "hidden" : false}
            whileInView={animate ? "visible" : undefined}
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainerVariants}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.id}
                className="about-stat-card group"
                variants={cardRevealVariants}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="m-0 whitespace-nowrap text-small text-text-muted">{stat.label}</p>
                    <p className="m-0 mt-1 font-mono text-xl font-semibold text-accent transition-colors duration-200 group-hover:text-accent-hover sm:text-h2">
                      <AnimatedStatValue
                        value={stat.numericValue}
                        suffix={stat.suffix}
                        animate={animate}
                      />
                    </p>
                  </div>
                  <span className="about-stat-icon">
                    <MetricIcon />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="about-education-card"
            initial={animate ? "hidden" : false}
            whileInView={animate ? "visible" : undefined}
            viewport={{ once: true, margin: "-80px" }}
            variants={revealVariants}
          >
            <article aria-labelledby="about-education-heading">
              <p className="about-education-label">EDUCATION</p>
              <div className="about-education-body">
                <div aria-hidden="true" className="about-education-timeline">
                  <span className="about-education-dot" />
                  <span className="about-education-line" />
                </div>
                <div className="about-education-content">
                  <h3 id="about-education-heading" className="about-education-title">
                    <span>
                      {about.education.degree} – {about.education.institution}
                    </span>
                    <EducationCertificateTrigger
                      certificate={about.education.degreeCertificate}
                      onOpen={setActiveCertificate}
                    />
                  </h3>
                  <p className="about-education-dates">{about.education.dateRange}</p>
                  <p className="about-education-summary">{about.education.summary}</p>
                  {about.education.honor && about.education.honorCertificate ? (
                    <div className="about-education-honor-row">
                      <span className="about-education-honor-badge">
                        <DeanListIcon />
                        {about.education.honor}
                      </span>
                      <EducationCertificateTrigger
                        certificate={about.education.honorCertificate}
                        onOpen={setActiveCertificate}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </motion.div>

          <motion.div
            className="about-fields-panel about-fields-panel--stretch"
            initial={animate ? "hidden" : false}
            whileInView={animate ? "visible" : undefined}
            viewport={{ once: true, margin: "-80px" }}
            variants={revealVariants}
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="m-0 text-body font-semibold text-text-primary">
                Main Fields Of Development
              </h3>
              <span
                aria-hidden="true"
                className="h-px min-w-12 flex-1 bg-gradient-to-r from-border via-accent/35 to-transparent"
              />
            </div>
            <ul aria-label="Main professional fields" className="mt-3 flex flex-wrap gap-1.5">
              {about.mainFields.map((field) => (
                <li key={field}>
                  <span className="about-field-badge">{field}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      <EducationCertificateViewer
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </section>
  );
}
