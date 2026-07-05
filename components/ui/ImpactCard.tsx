"use client";

import type { Impact } from "@/lib/content/types";
import { useGlareHandlers } from "@/components/ui/GlareHover";

/**
 * A single My Impact card (spec §8.2). Presentation-agnostic content comes from the
 * validated {@link Impact} model; all carousel positioning is handled by the parent
 * gallery. The glass surface, borders, and glare hover mirror the site's card system
 * (§6.7) so the card sits naturally with the rest of the page.
 *
 * When `active` is false the whole card doubles as a control that brings it to the
 * centre of the gallery — rendered as a transparent, accessibly-labelled button
 * overlay so the article's text stays exposed to assistive tech. The active card has
 * no overlay and reads as plain content.
 */
type ImpactCardProps = {
  impact: Impact;
  /** Stable id for the title, so the article can be `aria-labelledby` it. */
  headingId: string;
  /** True when this card is the centred/focused slide. */
  active: boolean;
  /** Bring this card to the centre of the gallery. */
  onActivate: () => void;
};

export function ImpactCard({ impact, headingId, active, onActivate }: ImpactCardProps) {
  const { overlayRef, overlayStyle, handlers } = useGlareHandlers({ transitionDuration: 900 });

  return (
    <article
      className="impact-card"
      data-active={active || undefined}
      aria-labelledby={headingId}
      {...handlers}
    >
      <div ref={overlayRef} style={overlayStyle} aria-hidden="true" />

      <div className="impact-card-body">
        <p className="impact-card-index" aria-hidden="true">
          {String(impact.displayOrder).padStart(2, "0")}
        </p>
        <h3 id={headingId} className="impact-card-title">
          {impact.title}
        </h3>
        <p className="impact-card-desc">{impact.description}</p>
        <ul className="impact-card-bullets">
          {impact.impactBullets.map((bullet) => (
            <li key={bullet} className="impact-card-bullet">
              <CheckIcon />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {active ? null : (
        <button
          type="button"
          className="impact-card-activate"
          onClick={onActivate}
          aria-label={`Bring the ${impact.title} impact into focus`}
        />
      )}
    </article>
  );
}

function CheckIcon() {
  return (
    <svg
      className="impact-card-bullet-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
