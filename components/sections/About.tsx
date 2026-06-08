"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimation, useInView, useReducedMotion } from "framer-motion";

import {
  EducationCertificateTrigger,
  EducationCertificateViewer,
} from "@/components/sections/EducationCertificateViewer";
import { about } from "@/lib/content/data/about";
import type { EducationCertificateRef } from "@/lib/content/types";

const easeOut = [0.22, 1, 0.36, 1] as const;
const ABOUT_ACCENT_LINE_START_X = -128;
const COUNT_DURATION_MS = 2250;

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
    transition: { duration: 1.05, ease: easeOut },
  },
};

const accentLineRevealVariants = {
  hidden: { opacity: 0, x: ABOUT_ACCENT_LINE_START_X },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.05, ease: easeOut },
  },
};

const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.12 },
  },
};

const cardRevealVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.83, ease: easeOut },
  },
};

type BackgroundGraph = {
  title: string;
  xLabel: string;
  yLabel: string;
  points: string;
  bars?: number[];
};

const backgroundGraphs: BackgroundGraph[] = [
  {
    title: "Courses Finished",
    xLabel: "Career",
    yLabel: "Count",
    points: "14,70 30,62 46,50 62,35 78,26 94,14",
    bars: [24, 32, 46, 58, 72],
  },
  {
    title: "Systems Reliability",
    xLabel: "Iterations",
    yLabel: "Signal",
    points: "14,58 28,50 42,53 56,38 70,30 84,24 96,18",
    bars: [34, 42, 38, 54, 64],
  },
  {
    title: "Cold Coffee Cups",
    xLabel: "Debug Sprints",
    yLabel: "Caffeine",
    points: "14,64 26,48 38,59 50,35 62,45 76,24 94,18",
    bars: [38, 50, 44, 68, 76],
  },
  {
    title: "Backend Throughput",
    xLabel: "Deploys",
    yLabel: "Load",
    points: "12,66 24,56 38,60 52,42 66,34 80,28 96,20",
    bars: [30, 36, 49, 61, 69],
  },
  {
    title: "API Latency Drop",
    xLabel: "Releases",
    yLabel: "ms",
    points: "12,22 26,30 40,28 54,42 68,48 82,58 98,64",
    bars: [72, 63, 58, 46, 35],
  },
  {
    title: "Cloud Services Mapped",
    xLabel: "Labs",
    yLabel: "AWS",
    points: "14,66 28,58 42,52 56,38 70,32 84,22 98,16",
    bars: [26, 34, 44, 57, 71],
  },
  {
    title: "PR Review Velocity",
    xLabel: "Weeks",
    yLabel: "Flow",
    points: "12,60 26,46 40,50 54,36 68,40 82,26 98,22",
    bars: [40, 51, 47, 60, 66],
  },
  {
    title: "Bug Hunts Won",
    xLabel: "Sprints",
    yLabel: "Fixes",
    points: "14,62 28,54 42,42 56,48 70,30 84,25 98,18",
    bars: [32, 41, 55, 48, 70],
  },
  {
    title: "Learning Momentum",
    xLabel: "Months",
    yLabel: "Hours",
    points: "12,68 26,55 40,58 54,44 68,34 82,28 98,15",
    bars: [25, 37, 43, 59, 78],
  },
  {
    title: "Deploy Confidence",
    xLabel: "Checks",
    yLabel: "Pass",
    points: "14,56 28,48 42,44 56,36 70,28 84,24 98,18",
    bars: [44, 50, 56, 64, 72],
  },
  {
    title: "Keyboard Shortcuts Learned",
    xLabel: "Years",
    yLabel: "Speed",
    points: "12,64 26,57 40,43 54,46 68,31 82,27 98,19",
    bars: [31, 43, 52, 61, 73],
  },
  {
    title: "Docker Layers Tamed",
    xLabel: "Images",
    yLabel: "Size",
    points: "12,26 26,34 40,32 54,45 68,50 82,59 98,65",
    bars: [68, 61, 54, 43, 34],
  },
  {
    title: "Focus Mode Sessions",
    xLabel: "Blocks",
    yLabel: "Depth",
    points: "14,65 28,49 42,52 56,37 70,33 84,21 98,17",
    bars: [36, 49, 45, 63, 75],
  },
  {
    title: "Terminal Tabs Open",
    xLabel: "Day",
    yLabel: "Tabs",
    points: "12,58 26,42 40,54 54,31 68,44 82,26 98,35",
    bars: [47, 62, 50, 74, 57],
  },
];

const GRAPH_WIDTH_VW = 15;
const GRAPH_HEIGHT_VH = 14;
const GRAPH_DRIFT_ZONE_BLEED_VW = 24;
const GRAPH_DRIFT_ZONE_BLEED_VH = 18;
const GRAPH_DRIFT_MIN_DISTANCE = 8;
const GRAPH_DRIFT_MAX_DISTANCE = 24;
const GRAPH_DRIFT_MIN_AXIS_COMPONENT = 2.75;
const GRAPH_DRIFT_MIN_SPEED = 1.4;
const GRAPH_DRIFT_MAX_SPEED = 4.6;
const GRAPH_VISIBLE_OPACITY = 0.34;

type Zone = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

type Point = {
  x: number;
  y: number;
};

type GraphCycle = {
  graph: BackgroundGraph;
  start: Point;
  end: Point;
  visibleDuration: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  gapAfter: number;
};

type GraphLayout = {
  graph: BackgroundGraph;
  x: number;
  y: number;
};

type GraphSeed = {
  zone: Zone;
  layout: GraphLayout;
  staticPosition: Point;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function pickGraph(): BackgroundGraph {
  return backgroundGraphs[Math.floor(Math.random() * backgroundGraphs.length)] ?? backgroundGraphs[0];
}

function getGraphGridDimensions(count: number): { cols: number; rows: number } {
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 8) return { cols: 4, rows: 2 };
  return { cols: 5, rows: 2 };
}

function getGraphZone(index: number, count: number): Zone {
  const { cols, rows } = getGraphGridDimensions(count);
  const col = index % cols;
  const row = Math.floor(index / cols);
  const areaX = 90;
  const areaY = 84;
  const originX = 2;
  const originY = 4;
  const cellWidth = areaX / cols;
  const cellHeight = areaY / rows;

  return {
    xMin: originX + col * cellWidth,
    xMax: originX + (col + 1) * cellWidth,
    yMin: originY + row * cellHeight,
    yMax: originY + (row + 1) * cellHeight,
  };
}

function getGraphPlacementBounds(zone: Zone): Zone {
  const xMin = zone.xMin + 1;
  const xMax = zone.xMax - GRAPH_WIDTH_VW - 1;
  const yMin = zone.yMin + 1;
  const yMax = zone.yMax - GRAPH_HEIGHT_VH - 1;

  return {
    xMin: Math.min(xMin, xMax),
    xMax: Math.max(xMin, xMax),
    yMin: Math.min(yMin, yMax),
    yMax: Math.max(yMin, yMax),
  };
}

function getGraphMovementBounds(zone: Zone): Zone {
  const placementBounds = getGraphPlacementBounds({
    xMin: 2,
    xMax: 92,
    yMin: 4,
    yMax: 88,
  });
  const zoneBounds = getGraphPlacementBounds(zone);

  return {
    xMin: Math.max(placementBounds.xMin, zoneBounds.xMin - GRAPH_DRIFT_ZONE_BLEED_VW),
    xMax: Math.min(placementBounds.xMax, zoneBounds.xMax + GRAPH_DRIFT_ZONE_BLEED_VW),
    yMin: Math.max(placementBounds.yMin, zoneBounds.yMin - GRAPH_DRIFT_ZONE_BLEED_VH),
    yMax: Math.min(placementBounds.yMax, zoneBounds.yMax + GRAPH_DRIFT_ZONE_BLEED_VH),
  };
}

function randomPointInGraphBounds(bounds: Zone): Point {
  return {
    x: randomBetween(bounds.xMin, bounds.xMax),
    y: randomBetween(bounds.yMin, bounds.yMax),
  };
}

function randomPointInGraphZone(zone: Zone): Point {
  return randomPointInGraphBounds(getGraphPlacementBounds(zone));
}

function randomGraphDriftVector(): Point {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(GRAPH_DRIFT_MIN_DISTANCE, GRAPH_DRIFT_MAX_DISTANCE);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    if (Math.abs(x) >= GRAPH_DRIFT_MIN_AXIS_COMPONENT && Math.abs(y) >= GRAPH_DRIFT_MIN_AXIS_COMPONENT) {
      return { x, y };
    }
  }

  const diagonalAngle = randomBetween(Math.PI / 7, Math.PI / 2 - Math.PI / 7);
  const quadrant = Math.floor(randomBetween(0, 4));
  const angle = diagonalAngle + quadrant * (Math.PI / 2);
  const distance = randomBetween(GRAPH_DRIFT_MIN_DISTANCE, GRAPH_DRIFT_MAX_DISTANCE);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function createGraphDrift(zone: Zone, start: Point): { end: Point; visibleDuration: number } {
  const bounds = getGraphMovementBounds(zone);
  let end = randomPointInGraphBounds(bounds);
  let distance = 0;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const drift = randomGraphDriftVector();
    const candidate = {
      x: clamp(start.x + drift.x, bounds.xMin, bounds.xMax),
      y: clamp(start.y + drift.y, bounds.yMin, bounds.yMax),
    };

    distance = Math.hypot(candidate.x - start.x, candidate.y - start.y);
    if (distance >= GRAPH_DRIFT_MIN_DISTANCE) {
      end = candidate;
      break;
    }
  }

  if (distance < GRAPH_DRIFT_MIN_DISTANCE) {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const candidate = randomPointInGraphBounds(bounds);
      distance = Math.hypot(candidate.x - start.x, candidate.y - start.y);

      if (distance >= GRAPH_DRIFT_MIN_DISTANCE) {
        end = candidate;
        break;
      }
    }
  }

  distance = Math.max(GRAPH_DRIFT_MIN_DISTANCE, Math.hypot(end.x - start.x, end.y - start.y));
  const speed = randomBetween(GRAPH_DRIFT_MIN_SPEED, GRAPH_DRIFT_MAX_SPEED);

  return {
    end,
    visibleDuration: clamp(distance / speed, 3.2, 9.5),
  };
}

function createGraphCycle(zone: Zone, start?: Point): GraphCycle {
  const startPoint = start ?? randomPointInGraphZone(zone);
  const drift = createGraphDrift(zone, startPoint);

  return {
    graph: pickGraph(),
    start: startPoint,
    end: drift.end,
    visibleDuration: drift.visibleDuration,
    fadeInDuration: randomBetween(0.9, 1.4),
    fadeOutDuration: randomBetween(1.0, 1.6),
    gapAfter: randomBetween(500, 1500),
  };
}

function createInitialGraphLayout(zone: Zone): GraphLayout {
  const point = randomPointInGraphZone(zone);

  return {
    graph: pickGraph(),
    x: point.x,
    y: point.y,
  };
}

function createGraphSeeds(count: number): GraphSeed[] {
  return Array.from({ length: count }, (_, index) => {
    const zone = getGraphZone(index, count);

    return {
      zone,
      layout: createInitialGraphLayout(zone),
      staticPosition: randomPointInGraphZone(zone),
    };
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function subscribeToResize(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getViewportGraphCount(): number {
  if (typeof window === "undefined") return 0;
  if (window.innerWidth < 768) return 0;
  if (window.innerWidth < 1024) return 5;
  if (window.innerWidth < 1280) return 7;
  return 9;
}

function useGraphCount(): number {
  return useSyncExternalStore(subscribeToResize, getViewportGraphCount, () => 0);
}

type BackgroundGraphCardProps = {
  graph: BackgroundGraph;
};

function BackgroundGraphCard({ graph }: BackgroundGraphCardProps) {
  return (
    <>
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
    </>
  );
}

type FloatingGraphCardProps = {
  zone: Zone;
  initialLayout: GraphLayout;
  staticPosition: Point;
  reducedMotion: boolean;
};

function FloatingGraphCard({
  zone,
  initialLayout,
  staticPosition,
  reducedMotion,
}: FloatingGraphCardProps) {
  const controls = useAnimation();
  const [graph, setGraph] = useState(initialLayout.graph);
  const zoneRef = useRef(zone);
  const startPositionRef = useRef({ x: initialLayout.x, y: initialLayout.y });

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const activeZone = zoneRef.current;
    const startPosition = startPositionRef.current;
    let cancelled = false;

    async function runLifecycle() {
      let cycle = createGraphCycle(activeZone, startPosition);

      while (!cancelled) {
        setGraph(cycle.graph);

        await controls.set({
          x: `${cycle.start.x}vw`,
          y: `${cycle.start.y}vh`,
          opacity: 0,
        });

        const totalDuration = cycle.fadeInDuration + cycle.visibleDuration + cycle.fadeOutDuration;
        const fadeInEnd = cycle.fadeInDuration / totalDuration;
        const fadeOutStart = (cycle.fadeInDuration + cycle.visibleDuration) / totalDuration;

        await controls.start({
          x: `${cycle.end.x}vw`,
          y: `${cycle.end.y}vh`,
          opacity: [0, GRAPH_VISIBLE_OPACITY, GRAPH_VISIBLE_OPACITY, 0],
          transition: {
            x: { duration: totalDuration, ease: "linear" },
            y: { duration: totalDuration, ease: "linear" },
            opacity: {
              duration: totalDuration,
              ease: "easeInOut",
              times: [0, fadeInEnd, fadeOutStart, 1],
            },
          },
        });

        await sleep(cycle.gapAfter);
        cycle = createGraphCycle(activeZone);
      }
    }

    void runLifecycle();

    return () => {
      cancelled = true;
    };
  }, [controls, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className="about-graph-card"
        style={{
          opacity: GRAPH_VISIBLE_OPACITY,
          transform: `translate(${staticPosition.x}vw, ${staticPosition.y}vh)`,
        }}
      >
        <BackgroundGraphCard graph={graph} />
      </div>
    );
  }

  return (
    <motion.div
      className="about-graph-card"
      initial={{
        opacity: 0,
        x: `${initialLayout.x}vw`,
        y: `${initialLayout.y}vh`,
      }}
      animate={controls}
    >
      <BackgroundGraphCard graph={graph} />
    </motion.div>
  );
}

function AboutBackgroundGraphs() {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const graphCount = useGraphCount();
  const graphSeeds = useMemo(
    () => (graphCount > 0 ? createGraphSeeds(graphCount) : []),
    [graphCount]
  );

  if (!isClient || graphCount === 0) {
    return null;
  }

  return (
    <div aria-hidden="true" className="about-graphs-layer">
      {graphSeeds.map((seed, index) => (
        <FloatingGraphCard
          key={index}
          zone={seed.zone}
          initialLayout={seed.layout}
          staticPosition={seed.staticPosition}
          reducedMotion={prefersReducedMotion}
        />
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
        <div className="about-copy-panel about-layout-copy h-full max-w-measure">
          <motion.span
            aria-hidden="true"
            className="about-copy-accent-line"
            initial={animate ? "hidden" : false}
            whileInView={animate ? "visible" : undefined}
            viewport={{ once: true, margin: "-80px" }}
            variants={accentLineRevealVariants}
          />
          <motion.div
            className="flex h-full flex-col justify-center"
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
        </div>

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
                <li key={field} className="flex grow">
                  <span className="about-field-badge w-full justify-center">{field}</span>
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
