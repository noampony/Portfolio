import { CursorGlow } from "@/components/ui/CursorGlow";

/**
 * Shared ambient background for the homepage sections (spec §6.3, §7.1–7.3): one
 * unified treatment so every non-hero section reads as the same material —
 * static corner-glow tints (accent + blue), a slowly-drifting abstract "aurora"
 * sheen, a film-grain tile, a dev-grid wash, glow seams that blend a section into
 * its neighbours instead of a flat border, and a cursor-reactive glow.
 *
 * The look lives here: a prop-less `<SectionBackground />` yields the full unified
 * style language. The props are escape hatches, not per-section knobs — passing
 * different values per section is what made the old backgrounds feel unrelated.
 *
 * Decorative and paint-cheap: `aria-hidden` + `pointer-events: none`, no blur
 * filters. The only motion is a transform/opacity-only drift on the glow/aurora
 * layers, GPU-composited and disabled under `prefers-reduced-motion` (see
 * globals.css). Hook-free itself so it renders inside both server and client
 * sections; `CursorGlow` is the only client child — it sits as a sibling after
 * the ambient layer (so it paints above the grain, matching its `z-index`) and
 * renders `null` on the server + first client render, so hydration stays stable.
 *
 * The host `<section>` must be `relative isolate` (they all are) and should be
 * `overflow-hidden` so the layers clip at the section edges.
 */
type SectionBackgroundProps = {
  /** Corner-glow placement. Defaults to the unified `"split"`. */
  glow?: "left" | "right" | "split";
  /** The subtle dev-grid wash. On by default (unified everywhere). */
  grid?: boolean;
  /**
   * Top seam toward the previous section: "line" renders a centred glowing
   * hairline + wash (replaces `border-t`), "wash" the borderless blend only.
   * Defaults to `"line"`.
   */
  seamTop?: "line" | "wash";
  /** Fades the bottom toward `--bg-surface` so the next section's seam matches. */
  seamBottom?: boolean;
  /** The cursor-reactive glow. On by default (unified everywhere). */
  cursor?: boolean;
};

export function SectionBackground({
  glow = "split",
  grid = true,
  seamTop = "line",
  seamBottom = true,
  cursor = true,
}: SectionBackgroundProps) {
  return (
    <>
      <div aria-hidden="true" className="section-bg">
        <div className={`section-glow section-glow--${glow}`} />
        <div className="section-aurora" />
        {grid ? <div className="section-grid-wash" /> : null}
        <div className="section-grain" />
        {seamTop ? (
          <div
            className={`section-seam-top${seamTop === "line" ? " section-seam-top--line" : ""}`}
          />
        ) : null}
        {seamBottom ? <div className="section-seam-bottom" /> : null}
      </div>
      {cursor ? <CursorGlow /> : null}
    </>
  );
}
