import Image from "next/image";

import type { Course } from "@/lib/content/types";

/**
 * A single course card for the Courses Preview learning path (spec §8.5, §11.4).
 *
 * Renders the §8.5 fields where data exists: a step index (the learning-path position),
 * category, name, provider · completion date · hours, short description, skills sharpened,
 * and the certificate state. The card is a static (non-flip) panel — courses read as a
 * curated progression, so all fields are visible at once with no hover-only access (§20).
 *
 * Course image (§8.5 image behavior): when `courseImage` is present it renders through
 * `next/image` (optimized + lazy-loaded by default, explicit width/height → no CLS, §14.3/§14.4)
 * inside a fixed-aspect media box. When absent — the case for every course today (§19.7) — the
 * SAME box shows a consistent, non-generic fallback (gradient + category-derived code glyph +
 * provider), so image-less and image-bearing cards stay the same size with no layout shift.
 *
 * Certificate (§8.5, §10.9): a present `certificateLink` becomes an external link that opens
 * in a new tab with `rel="noopener noreferrer"`; a missing one is shown as a non-interactive
 * "Certificate unavailable" pill — never a broken link.
 */

type CourseCardProps = {
  course: Course;
  /** 1-based position in the learning path; shown as a zero-padded step badge. */
  stepIndex: number;
  /** Id wired to the card `<h3>` so the `<article>` is named for assistive tech. */
  headingId: string;
};

/** Intrinsic size for the media box — fixes the aspect ratio so fallback ≡ image (no CLS). */
const MEDIA_WIDTH = 640;
const MEDIA_HEIGHT = 360;

/** Pick a category-appropriate glyph for the image fallback so it never looks generic. */
function FallbackGlyph({ categories }: { categories: string[] }) {
  const joined = categories.join(" ").toLowerCase();

  if (joined.includes("generative ai") || joined.includes(" ai")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path
          d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (joined.includes("backend")) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <path d="M7 7h.01M7 17h.01" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CertificateArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CourseCard({ course, stepIndex, headingId }: CourseCardProps) {
  const {
    name,
    provider,
    category,
    completionDate,
    description,
    skillsSharpened,
    numberOfHours,
    certificateLink,
    courseImage,
  } = course;

  const step = String(stepIndex).padStart(2, "0");
  const primaryCategory = category[0];

  return (
    <article aria-labelledby={headingId} className="course-card">
      <div className="course-card-media">
        {courseImage ? (
          <Image
            src={courseImage}
            alt={`${name} course preview`}
            width={MEDIA_WIDTH}
            height={MEDIA_HEIGHT}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="course-card-image"
          />
        ) : (
          // Consistent, non-generic fallback (§8.5): category glyph + provider over glass.
          <div className="course-card-fallback" aria-hidden="true">
            <span className="course-card-fallback-glyph">
              <FallbackGlyph categories={category} />
            </span>
            <span className="course-card-fallback-provider">{provider}</span>
          </div>
        )}
        <span className="course-card-step">
          <span className="sr-only">Step </span>
          {step}
        </span>
      </div>

      <div className="course-card-body">
        {primaryCategory ? <span className="course-card-category">{primaryCategory}</span> : null}

        <h3 id={headingId} className="course-card-title">
          {name}
        </h3>

        <p className="course-card-meta">
          <span>{provider}</span>
          <span aria-hidden="true">·</span>
          <span>{completionDate}</span>
          {numberOfHours !== undefined ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{numberOfHours}h</span>
            </>
          ) : null}
        </p>

        <p className="course-card-description">{description}</p>

        {skillsSharpened.length > 0 ? (
          <ul aria-label={`${name} — skills sharpened`} className="course-card-skills">
            {skillsSharpened.map((skill) => (
              <li key={skill} className="experience-tag">
                {skill}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="course-card-footer">
          {certificateLink ? (
            <a
              href={certificateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="course-card-cert course-card-cert--link"
            >
              View certificate
              <CertificateArrow />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span className="course-card-cert course-card-cert--absent">
              Certificate unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
