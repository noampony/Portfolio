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

function randomPointInBounds(bounds: Zone): Point {
  return {
    x: randomBetween(bounds.xMin, bounds.xMax),
    y: randomBetween(bounds.yMin, bounds.yMax),
  };
}

function randomPointInZone(zone: Zone): Point {
  return randomPointInBounds(getPlacementBounds(zone));
}

function createQuoteCycle(zone: Zone, start?: Point): QuoteCycle {
  return {
    quote: pickQuote(),
    start: start ?? randomPointInZone(zone),
    visibleDuration: randomBetween(3.5, 7.5),
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
  if (window.innerWidth < 1024) return 4;
  if (window.innerWidth < 1280) return 5;
  return 6;
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
      <span aria-hidden="true" className="experience-quote-mark experience-quote-mark--open">
        ❝
      </span>
      <p className="experience-quote-text">{quote.text}</p>
      <span aria-hidden="true" className="experience-quote-mark experience-quote-mark--close">
        ❞
      </span>
      <p className="experience-quote-author">— {quote.author}</p>
    </>
  );
}

type FloatingQuoteCardProps = {
  zone: Zone;
  initialLayout: QuoteLayout;
  staticPosition: Point;
  reducedMotion: boolean;
  /** Measured pixel height of the quotes layer (the full section), see below. */
  layerHeight: number;
};

/**
 * One independently cycling quote card — fades in while drifting, fades out while
 * still drifting, then respawns with a new quote at a new position in its zone.
 *
 * Horizontal positions stay in `vw` (the layer is full-bleed, so viewport width ≈ layer
 * width). Vertical positions are kept as abstract 0–100 units and mapped to the layer's
 * measured pixel height, so the cards spread across the *entire* (tall) Experience
 * section rather than only the first viewport-height of it. `layerHeight` is read through
 * a ref so a resize updates future drift cycles without restarting the running one.
 */
function FloatingQuoteCard({ zone, initialLayout, staticPosition, reducedMotion, layerHeight }: FloatingQuoteCardProps) {
  const controls = useAnimation();
  const [quote, setQuote] = useState(initialLayout.quote);
  const zoneRef = useRef(zone);
  const startPositionRef = useRef({ x: initialLayout.x, y: initialLayout.y });
  const heightRef = useRef(layerHeight);

  // Keep the ref current so the running drift lifecycle reads the latest layer height
  // (e.g. after a resize) without being torn down and restarted.
  useEffect(() => {
    heightRef.current = layerHeight;
  }, [layerHeight]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const activeZone = zoneRef.current;
    const startPosition = startPositionRef.current;
    let cancelled = false;

    /** Map a 0–100 vertical unit to a pixel offset within the (tall) section. */
    const yPx = (unit: number) => `${(unit / 100) * heightRef.current}px`;

    async function runLifecycle() {
      let cycle = createQuoteCycle(activeZone, startPosition);

      while (!cancelled) {
        setQuote(cycle.quote);

        await controls.set({
          x: `${cycle.start.x}vw`,
          y: yPx(cycle.start.y),
          opacity: 0,
        });

        const totalDuration = cycle.fadeInDuration + cycle.visibleDuration + cycle.fadeOutDuration;
        const fadeInEnd = cycle.fadeInDuration / totalDuration;
        const fadeOutStart = (cycle.fadeInDuration + cycle.visibleDuration) / totalDuration;

        await controls.start({
          opacity: [0, QUOTE_VISIBLE_OPACITY, QUOTE_VISIBLE_OPACITY, 0],
          transition: {
            duration: totalDuration,
            ease: "easeInOut",
            times: [0, fadeInEnd, fadeOutStart, 1],
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
          transform: `translate(${staticPosition.x}vw, ${(staticPosition.y / 100) * layerHeight}px)`,
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
        y: `${(initialLayout.y / 100) * layerHeight}px`,
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
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [layerHeight, setLayerHeight] = useState(0);
  const quoteSeeds = useMemo(
    () => (quoteCount > 0 ? createQuoteSeeds(quoteCount) : []),
    [quoteCount]
  );

  // Track the layer's pixel height (it spans the full Experience section) so cards can be
  // distributed across the whole section height rather than a single viewport-height.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || typeof ResizeObserver === "undefined") {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height ?? layer.offsetHeight;
      setLayerHeight(height);
    });
    observer.observe(layer);
    setLayerHeight(layer.offsetHeight);
    return () => observer.disconnect();
  }, [isClient, quoteCount]);

  if (!isClient || quoteCount === 0) {
    return null;
  }

  return (
    <div aria-hidden="true" className="experience-quotes-layer" ref={layerRef}>
      {layerHeight > 0
        ? quoteSeeds.map((seed, index) => (
            <FloatingQuoteCard
              key={index}
              zone={seed.zone}
              initialLayout={seed.layout}
              staticPosition={seed.staticPosition}
              reducedMotion={prefersReducedMotion}
              layerHeight={layerHeight}
            />
          ))
        : null}
    </div>
  );
}
