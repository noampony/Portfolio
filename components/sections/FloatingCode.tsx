"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimation } from "framer-motion";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Portfolio-themed Python snippets for the decorative Hero backdrop.
 * Exact content is TBD (spec §19.2) — these defaults are owner-confirmable
 * placeholders only. Never use real or work-derived code (spec §15.2).
 */
const SNIPPET_POOL = [
  `name = "Noam Pony"\nrole = "Backend Developer"\nlocation = "Israel"`,
  `def greet() -> str:\n    return "Hello, welcome!"`,
  `def greet_hebrew() -> str:\n    return "Shalom, nice to meet you!"`,
  `def first_impression() -> str:\n    return "Backend developer with cloud focus"`,
  `summary = (\n    "Cloud backend developer"\n    " with hands-on ownership"\n)`,
  `tagline = (\n    "Building scalable and reliable"\n    " backend systems"\n)`,
  `portfolio_sections = [\n    "about",\n    "experience",\n    "projects",\n    "courses",\n    "skills",\n    "resume",\n    "contact"\n]`,
  `courses_completed = 35\ntech_stack_count = "18+"`,
  `skills = [\n    "Python",\n    "AWS",\n    "Docker",\n    "CI/CD"\n]`,
  `main_fields = [\n    "Backend Development",\n    "Cloud / AWS",\n    "Docker",\n    "Python"\n]`,
  `strengths = [\n    "ownership",\n    "leadership",\n    "hands-on",\n    "clear communication"\n, "continuous learning"\n]`,
  `def open_contact() -> str:\n    return "Let's work together!"`,
  `class DeveloperProfile:\n    name: str = "Noam Pony"\n    title: str = "Backend Developer"`,
  `experience_start = "2022-10"`,
  `def build_backend() -> str:\n    return "scalable & reliable systems"`,
  `learning_path = {\n    "courses": 35,\n    "focus": ["cloud backend", "generative AI"]\n}`,
  `volunteer_project = {\n    "role": "team-leader volunteer",\n    "focus": "useful public impact"\n}`,
  `project_preview = "#projects"\ncourses_hub = "#courses"`,
  `contact_message = (\n    "Have something interesting"\n    " to work on? Contact me."\n)`,
  `stack = ["Python", "AWS", "Docker", "CI/CD"]`,
  `recruiter_note = (\n    "Strong backend fundamentals"\n    " and practical delivery"\n)`,
  `manager_signal = {\n    "bias": "reliable execution",\n    "style": "calm ownership"\n}`,
  `hr_signal = {\n    "location": "Israel",\n    "mindset": "continuous learning"\n}`,
  `systems_focus = [\n    "APIs",\n    "automation",\n    "testing",\n    "cloud workflows"\n]`,
  `def review_code() -> str:\n    return "readable, tested, maintainable"`,
  `def solve_problem() -> str:\n    return "trace, isolate, fix, verify"`,
  `def welcome_visitor() -> str:\n    return "Thanks for stopping by!"`,
  `site_theme = "dark aesthetic"`,
  `async def deploy_portfolio() -> None:\n    await launch()`,
] as const;

/** Approximate rendered block footprint used to keep spawn zones from overlapping. */
const BLOCK_WIDTH_VW = 14;
const BLOCK_HEIGHT_VH = 10;
const DRIFT_ZONE_BLEED_VW = 24;
const DRIFT_ZONE_BLEED_VH = 18;
const DRIFT_MIN_DISTANCE = 8;
const DRIFT_MAX_DISTANCE = 24;
const DRIFT_MIN_AXIS_COMPONENT = 2.75;
const DRIFT_MIN_SPEED = 1.4;
const DRIFT_MAX_SPEED = 4.6;

const blockClassName =
  "absolute left-0 top-0 m-0 max-w-[15rem] whitespace-pre-wrap rounded-md border border-border bg-bg-surface p-3 font-mono text-small leading-snug text-[color-mix(in_srgb,var(--text-muted)_45%,var(--bg-surface))] will-change-transform lg:max-w-[17rem] xl:max-w-[18rem]";

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

type BlockCycle = {
  code: string;
  start: Point;
  end: Point;
  visibleDuration: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  gapAfter: number;
};

type BlockLayout = {
  code: string;
  x: number;
  y: number;
};

type BlockSeed = {
  zone: Zone;
  layout: BlockLayout;
  staticPosition: Point;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function pickSnippet(): string {
  return SNIPPET_POOL[Math.floor(Math.random() * SNIPPET_POOL.length)] ?? SNIPPET_POOL[0];
}

function getGridDimensions(count: number): { cols: number; rows: number } {
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 8) return { cols: 4, rows: 2 };
  if (count <= 10) return { cols: 5, rows: 2 };
  return { cols: 4, rows: 3 };
}

function getZone(index: number, count: number): Zone {
  const { cols, rows } = getGridDimensions(count);
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

function getPlacementBounds(zone: Zone): Zone {
  const xMin = zone.xMin + 1;
  const xMax = zone.xMax - BLOCK_WIDTH_VW - 1;
  const yMin = zone.yMin + 1;
  const yMax = zone.yMax - BLOCK_HEIGHT_VH - 1;

  return {
    xMin: Math.min(xMin, xMax),
    xMax: Math.max(xMin, xMax),
    yMin: Math.min(yMin, yMax),
    yMax: Math.max(yMin, yMax),
  };
}

function getMovementBounds(zone: Zone): Zone {
  const placementBounds = getPlacementBounds({
    xMin: 2,
    xMax: 92,
    yMin: 4,
    yMax: 88,
  });
  const zoneBounds = getPlacementBounds(zone);

  return {
    xMin: Math.max(placementBounds.xMin, zoneBounds.xMin - DRIFT_ZONE_BLEED_VW),
    xMax: Math.min(placementBounds.xMax, zoneBounds.xMax + DRIFT_ZONE_BLEED_VW),
    yMin: Math.max(placementBounds.yMin, zoneBounds.yMin - DRIFT_ZONE_BLEED_VH),
    yMax: Math.min(placementBounds.yMax, zoneBounds.yMax + DRIFT_ZONE_BLEED_VH),
  };
}

function randomPointInZone(zone: Zone): Point {
  const bounds = getPlacementBounds(zone);

  return randomPointInBounds(bounds);
}

function randomPointInBounds(bounds: Zone): Point {
  return {
    x: randomBetween(bounds.xMin, bounds.xMax),
    y: randomBetween(bounds.yMin, bounds.yMax),
  };
}

function randomDriftVector(): Point {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const angle = randomBetween(0, Math.PI * 2);
    const distance = randomBetween(DRIFT_MIN_DISTANCE, DRIFT_MAX_DISTANCE);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    if (Math.abs(x) >= DRIFT_MIN_AXIS_COMPONENT && Math.abs(y) >= DRIFT_MIN_AXIS_COMPONENT) {
      return { x, y };
    }
  }

  const diagonalAngle = randomBetween(Math.PI / 7, Math.PI / 2 - Math.PI / 7);
  const quadrant = Math.floor(randomBetween(0, 4));
  const angle = diagonalAngle + quadrant * (Math.PI / 2);
  const distance = randomBetween(DRIFT_MIN_DISTANCE, DRIFT_MAX_DISTANCE);

  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
  };
}

function createDrift(zone: Zone, start: Point): { end: Point; visibleDuration: number } {
  const bounds = getMovementBounds(zone);
  let end = randomPointInBounds(bounds);
  let distance = 0;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const drift = randomDriftVector();
    const candidate = {
      x: clamp(start.x + drift.x, bounds.xMin, bounds.xMax),
      y: clamp(start.y + drift.y, bounds.yMin, bounds.yMax),
    };

    distance = Math.hypot(candidate.x - start.x, candidate.y - start.y);
    if (distance >= DRIFT_MIN_DISTANCE) {
      end = candidate;
      break;
    }
  }

  if (distance < DRIFT_MIN_DISTANCE) {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const candidate = randomPointInBounds(bounds);
      distance = Math.hypot(candidate.x - start.x, candidate.y - start.y);

      if (distance >= DRIFT_MIN_DISTANCE) {
        end = candidate;
        break;
      }
    }
  }

  distance = Math.max(DRIFT_MIN_DISTANCE, Math.hypot(end.x - start.x, end.y - start.y));
  const speed = randomBetween(DRIFT_MIN_SPEED, DRIFT_MAX_SPEED);

  return {
    end,
    visibleDuration: clamp(distance / speed, 3.2, 9.5),
  };
}

function createBlockCycle(zone: Zone, start?: Point): BlockCycle {
  const startPoint = start ?? randomPointInZone(zone);
  const drift = createDrift(zone, startPoint);

  return {
    code: pickSnippet(),
    start: startPoint,
    end: drift.end,
    visibleDuration: drift.visibleDuration,
    fadeInDuration: randomBetween(0.9, 1.4),
    fadeOutDuration: randomBetween(1.0, 1.6),
    gapAfter: randomBetween(500, 1500),
  };
}

function createInitialLayout(zone: Zone): BlockLayout {
  const point = randomPointInZone(zone);

  return {
    code: pickSnippet(),
    x: point.x,
    y: point.y,
  };
}

function createBlockSeeds(count: number): BlockSeed[] {
  return Array.from({ length: count }, (_, index) => {
    const zone = getZone(index, count);

    return {
      zone,
      layout: createInitialLayout(zone),
      staticPosition: randomPointInZone(zone),
    };
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Avoid SSR/client mismatch: server + hydration pass render nothing. */
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

function getViewportBlockCount(): number {
  if (typeof window === "undefined") return 0;
  if (window.innerWidth < 768) return 0;
  if (window.innerWidth < 1024) return 6;
  if (window.innerWidth < 1280) return 8;
  if (window.innerWidth < 1536) return 10;
  return 12;
}

function useBlockCount(): number {
  return useSyncExternalStore(subscribeToResize, getViewportBlockCount, () => 0);
}

type FloatingCodeBlockProps = {
  zone: Zone;
  initialLayout: BlockLayout;
  staticPosition: Point;
  reducedMotion: boolean;
};

/**
 * One independently cycling code block — fades in while drifting, fades out while still drifting,
 * then respawns with new content at a new position in its zone.
 */
function FloatingCodeBlock({ zone, initialLayout, staticPosition, reducedMotion }: FloatingCodeBlockProps) {
  const controls = useAnimation();
  const [code, setCode] = useState(initialLayout.code);
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
      let cycle = createBlockCycle(activeZone, startPosition);

      while (!cancelled) {
        setCode(cycle.code);

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
          opacity: [0, 1, 1, 0],
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
        cycle = createBlockCycle(activeZone);
      }
    }

    void runLifecycle();

    return () => {
      cancelled = true;
    };
  }, [controls, reducedMotion]);

  if (reducedMotion) {
    return (
      <pre
        tabIndex={-1}
        className={blockClassName}
        style={{
          transform: `translate(${staticPosition.x}vw, ${staticPosition.y}vh)`,
        }}
      >
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <motion.pre
      tabIndex={-1}
      className={blockClassName}
      initial={{
        opacity: 0,
        x: `${initialLayout.x}vw`,
        y: `${initialLayout.y}vh`,
      }}
      animate={controls}
    >
      <code>{code}</code>
    </motion.pre>
  );
}

/**
 * Decorative floating Python code blocks for the Hero backdrop (spec §8.1).
 * Hidden on mobile when it would clutter (§16.3). Respects reduced motion (§7.3).
 */
export function FloatingCode() {
  const isClient = useIsClient();
  const prefersReducedMotion = usePrefersReducedMotion();
  const blockCount = useBlockCount();
  const blockSeeds = useMemo(
    () => (blockCount > 0 ? createBlockSeeds(blockCount) : []),
    [blockCount]
  );

  if (!isClient || blockCount === 0) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 max-md:hidden">
      {blockSeeds.map((seed, index) => (
        <FloatingCodeBlock
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
