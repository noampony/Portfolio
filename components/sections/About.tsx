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

type BackgroundGraph = {
  title: string;
  xLabel: string;
  yLabel: string;
  points: string;
  bars?: number[];
  className: string;
};

const backgroundGraphs: BackgroundGraph[] = [
  {
    title: "Courses Finished",
    xLabel: "Career",
    yLabel: "Count",
    points: "14,70 30,62 46,50 62,35 78,26 94,14",
    bars: [24, 32, 46, 58, 72],
    className: "about-graph-card--courses",
  },
  {
    title: "Systems Reliability",
    xLabel: "Iterations",
    yLabel: "Signal",
    points: "14,58 28,50 42,53 56,38 70,30 84,24 96,18",
    bars: [34, 42, 38, 54, 64],
    className: "about-graph-card--reliability",
  },
  {
    title: "Cold Coffee Cups",
    xLabel: "Debug Sprints",
    yLabel: "Caffeine",
    points: "14,64 26,48 38,59 50,35 62,45 76,24 94,18",
    bars: [38, 50, 44, 68, 76],
    className: "about-graph-card--coffee",
  },
  {
    title: "Backend Throughput",
    xLabel: "Deploys",
    yLabel: "Load",
    points: "12,66 24,56 38,60 52,42 66,34 80,28 96,20",
    bars: [30, 36, 49, 61, 69],
    className: "about-graph-card--throughput",
  },
  {
    title: "API Latency Drop",
    xLabel: "Releases",
    yLabel: "ms",
    points: "12,22 26,30 40,28 54,42 68,48 82,58 98,64",
    bars: [72, 63, 58, 46, 35],
    className: "about-graph-card--latency",
  },
  {
    title: "Cloud Services Mapped",
    xLabel: "Labs",
    yLabel: "AWS",
    points: "14,66 28,58 42,52 56,38 70,32 84,22 98,16",
    bars: [26, 34, 44, 57, 71],
    className: "about-graph-card--cloud",
  },
  {
    title: "PR Review Velocity",
    xLabel: "Weeks",
    yLabel: "Flow",
    points: "12,60 26,46 40,50 54,36 68,40 82,26 98,22",
    bars: [40, 51, 47, 60, 66],
    className: "about-graph-card--reviews",
  },
  {
    title: "Bug Hunts Won",
    xLabel: "Sprints",
    yLabel: "Fixes",
    points: "14,62 28,54 42,42 56,48 70,30 84,25 98,18",
    bars: [32, 41, 55, 48, 70],
    className: "about-graph-card--bugs",
  },
  {
    title: "Learning Momentum",
    xLabel: "Months",
    yLabel: "Hours",
    points: "12,68 26,55 40,58 54,44 68,34 82,28 98,15",
    bars: [25, 37, 43, 59, 78],
    className: "about-graph-card--learning",
  },
  {
    title: "Deploy Confidence",
    xLabel: "Checks",
    yLabel: "Pass",
    points: "14,56 28,48 42,44 56,36 70,28 84,24 98,18",
    bars: [44, 50, 56, 64, 72],
    className: "about-graph-card--deploys",
  },
  {
    title: "Keyboard Shortcuts Learned",
    xLabel: "Years",
    yLabel: "Speed",
    points: "12,64 26,57 40,43 54,46 68,31 82,27 98,19",
    bars: [31, 43, 52, 61, 73],
    className: "about-graph-card--shortcuts",
  },
  {
    title: "Docker Layers Tamed",
    xLabel: "Images",
    yLabel: "Size",
    points: "12,26 26,34 40,32 54,45 68,50 82,59 98,65",
    bars: [68, 61, 54, 43, 34],
    className: "about-graph-card--docker",
  },
  {
    title: "Focus Mode Sessions",
    xLabel: "Blocks",
    yLabel: "Depth",
    points: "14,65 28,49 42,52 56,37 70,33 84,21 98,17",
    bars: [36, 49, 45, 63, 75],
    className: "about-graph-card--focus",
  },
  {
    title: "Terminal Tabs Open",
    xLabel: "Day",
    yLabel: "Tabs",
    points: "12,58 26,42 40,54 54,31 68,44 82,26 98,35",
    bars: [47, 62, 50, 74, 57],
    className: "about-graph-card--terminal",
  },
];

function AboutBackgroundGraphs() {
  return (
    <div aria-hidden="true" className="about-graphs-layer">
      {backgroundGraphs.map((graph) => (
        <div key={graph.title} className={`about-graph-card ${graph.className}`}>
          <div className="about-graph-title">{graph.title}</div>
          <svg className="about-graph-svg" viewBox="0 0 112 82" focusable="false">
            <path className="about-graph-grid" d="M14 18H102M14 34H102M14 50H102M14 66H102" />
            <path className="about-graph-axis" d="M14 10V68H104M14 68L18 64M14 68L18 72M104 68L100 64M104 68L100 72" />
            {graph.bars?.map((height, index) => {
              const x = 24 + index * 15;
              const y = 68 - height * 0.58;

              return (
                <rect
                  key={`${graph.title}-${height}`}
                  className="about-graph-bar"
                  x={x}
                  y={y}
                  width="5"
                  height={68 - y}
                  rx="1.5"
                />
              );
            })}
            <polyline className="about-graph-line" points={graph.points} />
            {graph.points.split(" ").map((point) => {
              const [cx, cy] = point.split(",");

              return (
                <circle
                  key={`${graph.title}-${point}`}
                  className="about-graph-dot"
                  cx={cx}
                  cy={cy}
                  r="1.8"
                />
              );
            })}
            <text className="about-graph-y-label" x="5" y="13">
              {graph.yLabel}
            </text>
            <text className="about-graph-x-label" x="78" y="79">
              {graph.xLabel}
            </text>
          </svg>
        </div>
      ))}
    </div>
  );
}

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
      <AboutBackgroundGraphs />

      <div className="about-layout relative z-10 mx-auto grid w-full max-w-7xl gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.86fr)] lg:items-stretch lg:gap-14 xl:grid-cols-[minmax(0,0.9fr)_minmax(36rem,1fr)]">
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
