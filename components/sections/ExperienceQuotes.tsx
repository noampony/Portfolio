"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

import { inspirationalQuotes, type Quote } from "@/lib/content/data/quotes";

/**
 * Decorative floating inspirational-quote cards for the Experience backdrop
 * (spec §8.3 ambience, echoing the Hero/About floating-element treatment).
 *
 * Mirrors the `AboutBackgroundGraphs` engine (zone-based spawn, slow randomized
 * drift, fade-in → hold → fade-out lifecycle), but renders larger glass cards so
 * each quote has presence and is legible from the background. Hidden on mobile
 * (§16.3) and respects reduced motion (§7.3): a static, non-animating fallback.
 */

/** Approximate rendered card footprint (vw/vh) — larger than the About cards. */
const QUOTE_WIDTH_VW = 26;
const QUOTE_HEIGHT_VH = 15;
const DRIFT_ZONE_BLEED_VW = 24;
const DRIFT_ZONE_BLEED_VH = 18;
const DRIFT_MIN_DISTANCE = 8;
const DRIFT_MAX_DISTANCE = 24;
const DRIFT_MIN_AXIS_COMPONENT = 2.75;
const DRIFT_MIN_SPEED = 1.4;
const DRIFT_MAX_SPEED = 4.6;
const QUOTE_VISIBLE_OPACITY = 0.44;

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

type QuoteCycle = {
  quote: Quote;
  start: Point;
  end: Point;
  visibleDuration: number;
  fadeInDuration: number;
  fadeOutDuration: number;
  gapAfter: number;
};

type QuoteLayout = {
  quote: Quote;
  x: number;
  y: number;
};

type QuoteSeed = {
  zone: Zone;
  layout: QuoteLayout;
  staticPosition: Point;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function pickQuote(): Quote {
  return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)] ?? inspirationalQuotes[0];
}

function getGridDimensions(count: number): { cols: number; rows: number } {
  if (count <= 4) return { cols: 2, rows: 2 };
  return { cols: 3, rows: 2 };
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
  const xMax = zone.xMax - QUOTE_WIDTH_VW - 1;
  const yMin = zone.yMin + 1;
  const yMax = zone.yMax - QUOTE_HEIGHT_VH - 1;

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

function randomPointInBounds(bounds: Zone): Point {
  return {
    x: randomBetween(bounds.xMin, bounds.xMax),
    y: randomBetween(bounds.yMin, bounds.yMax),
  };
}

function randomPointInZone(zone: Zone): Point {
  return randomPointInBounds(getPlacementBounds(zone));
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

function createQuoteCycle(zone: Zone, start?: Point): QuoteCycle {
  const startPoint = start ?? randomPointInZone(zone);
  const drift = createDrift(zone, startPoint);

  return {
    quote: pickQuote(),
    start: startPoint,
    end: drift.end,
    visibleDuration: drift.visibleDuration,
    fadeInDuration: randomBetween(0.9, 1.4),
    fadeOutDuration: randomBetween(1.0, 1.6),
    gapAfter: randomBetween(500, 1500),
  };
}

function createInitialLayout(zone: Zone): QuoteLayout {
  const point = randomPointInZone(zone);

  return {
    quote: pickQuote(),
    x: point.x,
    y: point.y,
  };
}

function createQuoteSeeds(count: number): QuoteSeed[] {
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

function getViewportQuoteCount(): number {
  if (typeof window === "undefined") return 0;
  if (window.innerWidth < 768) return 0;
  if (window.innerWidth < 1024) return 3;
  if (window.innerWidth < 1280) return 4;
  return 5;
}

function useQuoteCount(): number {
  return useSyncExternalStore(subscribeToResize, getViewportQuoteCount, () => 0);
}

type QuoteCardContentProps = {
  quote: Quote;
};

function QuoteCardContent({ quote }: QuoteCardContentProps) {
  return (
    <>
      <p className="experience-quote-text">{quote.text}</p>
      <p className="experience-quote-author">— {quote.author}</p>
    </>
  );
}

type FloatingQuoteCardProps = {
  zone: Zone;
  initialLayout: QuoteLayout;
  staticPosition: Point;
  reducedMotion: boolean;
};

/**
 * One independently cycling quote card — fades in while drifting, fades out while
 * still drifting, then respawns with a new quote at a new position in its zone.
 */
function FloatingQuoteCard({ zone, initialLayout, staticPosition, reducedMotion }: FloatingQuoteCardProps) {
  const controls = useAnimation();
  const [quote, setQuote] = useState(initialLayout.quote);
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
      let cycle = createQuoteCycle(activeZone, startPosition);

      while (!cancelled) {
        setQuote(cycle.quote);

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
          opacity: [0, QUOTE_VISIBLE_OPACITY, QUOTE_VISIBLE_OPACITY, 0],
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
        cycle = createQuoteCycle(activeZone);
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
        className="experience-quote-card"
        style={{
          opacity: QUOTE_VISIBLE_OPACITY,
          transform: `translate(${staticPosition.x}vw, ${staticPosition.y}vh)`,
        }}
      >
        <QuoteCardContent quote={quote} />
      </div>
    );
  }

  return (
    <motion.div
      className="experience-quote-card"
      initial={{
        opacity: 0,
        x: `${initialLayout.x}vw`,
        y: `${initialLayout.y}vh`,
      }}
      animate={controls}
    >
      <QuoteCardContent quote={quote} />
    </motion.div>
  );
}

export function ExperienceQuotes() {
  const isClient = useIsClient();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const quoteCount = useQuoteCount();
  const quoteSeeds = useMemo(
    () => (quoteCount > 0 ? createQuoteSeeds(quoteCount) : []),
    [quoteCount]
  );

  if (!isClient || quoteCount === 0) {
    return null;
  }

  return (
    <div aria-hidden="true" className="experience-quotes-layer">
      {quoteSeeds.map((seed, index) => (
        <FloatingQuoteCard
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
