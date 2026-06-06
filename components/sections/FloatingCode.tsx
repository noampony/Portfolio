"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

/**
 * Generic Python snippets for the decorative Hero backdrop.
 * Exact content is TBD (spec §19.2) — these defaults are owner-confirmable
 * placeholders only. Never use real or work-derived code (spec §15.2).
 */
const SNIPPET_POOL = [
  `def greet(name: str) -> str:\n    return f"Hello, {name}!"`,
  `items = [1, 2, 3, 4, 5]\ntotal = sum(items)`,
  `async def fetch(url: str) -> bytes:\n    ...`,
  `squares = [n * n for n in range(6)]`,
  `for item in collection:\n    process(item)`,
  `data = {"key": "value"}`,
  `class Point:\n    def __init__(self, x: float, y: float):\n        self.x = x\n        self.y = y`,
  `result = sorted(names, key=len)`,
  `values = map(str.upper, words)`,
  `total = sum(n for n in numbers if n > 0)`,
  `payload = {"status": "ok"}`,
  `names = [user.name for user in users]`,
] as const;

/** Approximate rendered block footprint used to keep spawn zones from overlapping. */
const BLOCK_WIDTH_VW = 14;
const BLOCK_HEIGHT_VH = 10;

/** Drift bounds across the full Hero backdrop. */
const BACKDROP = {
  xMin: 2,
  xMax: 82,
  yMin: 4,
  yMax: 82,
} as const;

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

type TravelLeg = {
  target: Point;
  duration: number;
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

function randomPointInZone(zone: Zone): Point {
  const bounds = getPlacementBounds(zone);

  return {
    x: randomBetween(bounds.xMin, bounds.xMax),
    y: randomBetween(bounds.yMin, bounds.yMax),
  };
}

function randomPointInBackdrop(): Point {
  return {
    x: randomBetween(BACKDROP.xMin, BACKDROP.xMax - BLOCK_WIDTH_VW),
    y: randomBetween(BACKDROP.yMin, BACKDROP.yMax - BLOCK_HEIGHT_VH),
  };
}

function randomTravelLeg(from: Point): TravelLeg {
  let target = randomPointInBackdrop();

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidate = randomPointInBackdrop();
    if (Math.hypot(candidate.x - from.x, candidate.y - from.y) >= 24) {
      target = candidate;
      break;
    }
  }

  const distance = Math.hypot(target.x - from.x, target.y - from.y);

  return {
    target,
    duration: randomBetween(14, 24) * (distance / 36),
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
  initialLayout: BlockLayout;
  staticPosition: Point;
  reducedMotion: boolean;
};

/**
 * One independently drifting code block — continuously moves across the full
 * backdrop on random legs. Snippet text refreshes occasionally with a quick fade.
 */
function FloatingCodeBlock({ initialLayout, staticPosition, reducedMotion }: FloatingCodeBlockProps) {
  const controls = useAnimation();
  const [code, setCode] = useState(initialLayout.code);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let cancelled = false;
    let legsSinceRefresh = 0;
    let position: Point = { x: initialLayout.x, y: initialLayout.y };

    async function drift() {
      await controls.set({
        x: `${position.x}vw`,
        y: `${position.y}vh`,
      });

      while (!cancelled) {
        const leg = randomTravelLeg(position);

        await controls.start({
          x: `${leg.target.x}vw`,
          y: `${leg.target.y}vh`,
          transition: { duration: leg.duration, ease: "linear" },
        });

        position = leg.target;
        legsSinceRefresh += 1;

        if (legsSinceRefresh >= 4 && Math.random() < 0.45) {
          legsSinceRefresh = 0;
          setCode(pickSnippet());
        }
      }
    }

    void drift();

    return () => {
      cancelled = true;
    };
  }, [controls, initialLayout.x, initialLayout.y, reducedMotion]);

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
    <motion.pre tabIndex={-1} className={blockClassName} initial={false} animate={controls}>
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
  const prefersReducedMotion = useReducedMotion() ?? false;
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
          initialLayout={seed.layout}
          staticPosition={seed.staticPosition}
          reducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}
