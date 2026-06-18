"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

/**
 * Decorative winding "road" drawn down the centre of the roadmap (desktop only), replacing the
 * straight spine. An SVG path is generated to pass through every node centre and bulge
 * alternately between them, so the road weaves while each numbered node still sits on it.
 *
 * Node positions are read from layout via the offset chain (transform-independent, so the
 * reveal animation doesn't skew the curve) and recomputed on resize. Purely decorative
 * (aria-hidden); renders nothing until measured and is hidden below the desktop breakpoint.
 *
 * As the user scrolls, an emerald copy of the road's borders + dashed lane "fills in" from the
 * top, clipped by a horizontal line pinned to the viewport's vertical centre (so the fill front
 * always sits mid-screen and reverses on scroll up). When the front passes a node, that node is
 * marked `data-road-reached` so CSS can recolour its ring/number to match. The fill is a
 * desktop-only progressive enhancement and is skipped entirely under reduced motion.
 */

type RoadmapRoadProps = {
  /** The `.roadmap-paths` container whose `.roadmap-path-order` nodes the road threads through. */
  containerRef: RefObject<HTMLElement | null>;
  /** Number of paths — re-run measurement when it changes. */
  pathCount: number;
};

/** Layout position of `el` relative to `container`, ignoring CSS transforms (offset chain). */
function offsetWithin(el: HTMLElement, container: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Horizontal bulge of the road between consecutive nodes (px); alternates side each segment. */
const BULGE = 70;

/** Soft feather (px) on the fill's leading edge so it pours in rather than ending in a hard
 *  horizontal line (which reads as a green "bridge" wherever the road bends near-horizontal). */
const FILL_FEATHER = 22;

export function RoadmapRoad({ containerRef, pathCount }: RoadmapRoadProps) {
  const [geom, setGeom] = useState<{ w: number; h: number; d: string } | null>(null);

  // Latest measured road height + node anchors, kept in refs so the scroll-driven fill reads
  // fresh values without re-creating the motion transform / re-subscribing on every resize.
  const heightRef = useRef(0);
  const nodesRef = useRef<{ el: HTMLElement; top: number; height: number }[]>([]);

  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const fillEnabled = isDesktop && !reduceMotion;

  const uid = useId().replace(/:/g, "");
  const maskId = `roadmap-fill-mask-${uid}`;
  const gradId = `roadmap-fill-grad-${uid}`;

  // Progress is 0 when the paths list's top crosses the viewport centre and 1 when its bottom
  // does — i.e. it maps scroll position linearly onto the road's local Y. `fillY` is therefore
  // the road point currently at screen centre: the leading edge of the emerald fill.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const fillY = useTransform(scrollYProgress, (p) => p * heightRef.current);

  // Reveal mask geometry: a fully-opaque rect up to the feather band, then a white→black gradient
  // band that fades the green out over the last FILL_FEATHER px ending at the front (`fillY`).
  const solidHeight = useTransform(fillY, (y) => Math.max(0, y - FILL_FEATHER));
  const featherY = useTransform(fillY, (y) => Math.max(0, y - FILL_FEATHER));
  const featherHeight = useTransform(fillY, (y) => Math.max(0, Math.min(FILL_FEATHER, y)));

  // Fill each node's ring/connector in step with the road: `--road-fill` (0→1) is the fraction of
  // the node's own height the front has crossed, so the ring "pours" at exactly the road's speed.
  const syncNodes = (frontY: number) => {
    for (const node of nodesRef.current) {
      const fraction = Math.max(0, Math.min(1, (frontY - node.top) / node.height));
      node.el.style.setProperty("--road-fill", fraction.toFixed(3));
    }
  };

  useMotionValueEvent(fillY, "change", (value) => {
    if (!fillEnabled) return;
    syncNodes(value);
  });

  // When the fill is disabled (reduced motion / below desktop), reset every node to empty so none
  // is left stuck emerald; when (re)enabled, sync once so the initial scroll position shows.
  useEffect(() => {
    if (!fillEnabled) {
      // A front above every node sets all fractions to 0; under reduced motion the fill CSS is
      // gated off anyway, so the value is inert there.
      syncNodes(Number.NEGATIVE_INFINITY);
      return;
    }
    syncNodes(fillY.get());
  }, [fillEnabled, fillY, geom]);

  useEffect(() => {
    let raf = 0;
    let observer: ResizeObserver | null = null;

    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(".roadmap-path-order"));
      if (nodes.length === 0) {
        setGeom(null);
        nodesRef.current = [];
        return;
      }

      const w = container.offsetWidth;
      const h = container.offsetHeight;
      const centres = nodes.map((n) => {
        const { x, y } = offsetWithin(n, container);
        return { x: x + n.offsetWidth / 2, y: y + n.offsetHeight / 2 };
      });

      // Anchor the road to the top edge so it "enters" the frame like a real road, then
      // continue the weave past the last node with virtual centre-line points one gap apart
      // until the road has crossed the bottom edge. This keeps the exit identical to the
      // inter-node arcs (out to a bulge and back to centre) and lets the SVG viewport clip it
      // mid-curve — instead of a single long bezier whose return phase falls off-screen, which
      // left only its near-straight outgoing leg visible and made the road trail off straight.
      const first = centres[0];
      const last = centres[centres.length - 1];
      const gap =
        centres.length > 1 ? (last.y - first.y) / (centres.length - 1) : h - last.y;
      const points = [{ x: first.x, y: 0 }, ...centres];
      for (let vy = last.y + gap; vy < h + gap; vy += gap) {
        points.push({ x: last.x, y: vy });
      }

      let d = `M ${first.x.toFixed(1)} 0`;
      for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const dir = i % 2 === 0 ? 1 : -1;
        // Scale the bulge to the segment height so short anchor segments (top-edge → first
        // node, last node → bottom-edge) curve gently rather than kinking sideways.
        const segH = Math.abs(p1.y - p0.y);
        const bulge = Math.min(BULGE, segH / 2);
        const cx = (p0.x + p1.x) / 2 + bulge * dir;
        const cy = (p0.y + p1.y) / 2;
        d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
      }

      heightRef.current = h;
      nodesRef.current = nodes.map((el, i) => ({
        el,
        top: centres[i].y - el.offsetHeight / 2,
        height: el.offsetHeight,
      }));
      setGeom({ w, h, d });
    };

    // The container `<ol>` ref may not be attached yet on the first layout effect (this road
    // renders before it so it paints behind the cards), so defer until the ref is available.
    const start = () => {
      if (!containerRef.current) {
        raf = requestAnimationFrame(start);
        return;
      }
      compute();
      observer = new ResizeObserver(compute);
      observer.observe(containerRef.current);
      // Also observe each node individually — a CSS alignment change (e.g. align-items)
      // can shift node positions without changing the container size, so the container
      // ResizeObserver alone wouldn't re-fire. Observing nodes catches those cases.
      const nodes = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(".roadmap-path-order"),
      );
      nodes.forEach((n) => observer!.observe(n));
    };
    start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
    };
  }, [containerRef, pathCount]);

  if (!geom) return null;

  return (
    <svg
      className="roadmap-road"
      width={geom.w}
      height={geom.h}
      viewBox={`0 0 ${geom.w} ${geom.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {fillEnabled ? (
        <defs>
          {/* Vertical white→transparent ramp used to feather the fill's leading edge. */}
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          {/* Reveal mask: opaque up to the feather band, then the ramp fades green out at `fillY`. */}
          <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={geom.w} height={geom.h}>
            <motion.rect x={0} y={0} width={geom.w} height={solidHeight} fill="#fff" />
            <motion.rect x={0} y={featherY} width={geom.w} height={featherHeight} fill={`url(#${gradId})`} />
          </mask>
        </defs>
      ) : null}

      {/* Base road: faint accent shoulder, asphalt surface, dashed lane — widest → narrowest. */}
      <path className="roadmap-road-edge" d={geom.d} />
      <path className="roadmap-road-surface" d={geom.d} />
      <path className="roadmap-road-lane" d={geom.d} />

      {/* Emerald fill, revealed top→down by the feathered mask. Re-drawing the (dark) surface over
          the emerald edge leaves only the road's two side borders green, not the whole band. */}
      {fillEnabled ? (
        <g mask={`url(#${maskId})`}>
          <path className="roadmap-road-edge roadmap-road-edge--fill" d={geom.d} />
          <path className="roadmap-road-surface" d={geom.d} />
          <path className="roadmap-road-lane roadmap-road-lane--fill" d={geom.d} />
        </g>
      ) : null}
    </svg>
  );
}
