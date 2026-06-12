"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Decorative winding "road" drawn down the centre of the roadmap (desktop only), replacing the
 * straight spine. An SVG path is generated to pass through every node centre and bulge
 * alternately between them, so the road weaves while each numbered node still sits on it.
 *
 * Node positions are read from layout via the offset chain (transform-independent, so the
 * reveal animation doesn't skew the curve) and recomputed on resize. Purely decorative
 * (aria-hidden); renders nothing until measured and is hidden below the desktop breakpoint.
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

export function RoadmapRoad({ containerRef, pathCount }: RoadmapRoadProps) {
  const [geom, setGeom] = useState<{ w: number; h: number; d: string } | null>(null);

  useEffect(() => {
    let raf = 0;
    let observer: ResizeObserver | null = null;

    const compute = () => {
      const container = containerRef.current;
      if (!container) return;
      const nodes = Array.from(container.querySelectorAll<HTMLElement>(".roadmap-path-order"));
      if (nodes.length === 0) {
        setGeom(null);
        return;
      }

      const w = container.offsetWidth;
      const h = container.offsetHeight;
      const centres = nodes.map((n) => {
        const { x, y } = offsetWithin(n, container);
        return { x: x + n.offsetWidth / 2, y: y + n.offsetHeight / 2 };
      });

      // Anchor the road to the top and bottom edges so it "exits" the frame like a real road.
      const first = centres[0];
      const last = centres[centres.length - 1];
      const points = [{ x: first.x, y: 0 }, ...centres, { x: last.x, y: h }];

      let d = `M ${first.x.toFixed(1)} 0`;
      for (let i = 0; i < points.length - 1; i += 1) {
        const p0 = points[i];
        const p1 = points[i + 1];
        const dir = i % 2 === 0 ? 1 : -1;
        const cx = (p0.x + p1.x) / 2 + BULGE * dir;
        const cy = (p0.y + p1.y) / 2;
        d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
      }

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
      <path className="roadmap-road-edge" d={geom.d} />
      <path className="roadmap-road-surface" d={geom.d} />
      <path className="roadmap-road-lane" d={geom.d} />
    </svg>
  );
}
