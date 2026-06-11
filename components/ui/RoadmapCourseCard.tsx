import type { CSSProperties } from "react";

import type { RoadmapCourse } from "@/lib/content/types";

/**
 * A single compact course card for the learning roadmap (spec §8.5).
 *
 * Shows a media area (the course `image` when provided, otherwise a consistent gradient
 * fallback — never a broken image), the course name, and a small category label. The card is
 * non-interactive in this phase: there is no course detail page yet, so it carries no link.
 */

type RoadmapCourseCardProps = {
  course: RoadmapCourse;
  /** Id wired to the card title so the carousel item is named for assistive tech. */
  headingId: string;
};

export function RoadmapCourseCard({ course, headingId }: RoadmapCourseCardProps) {
  const { name, category, image } = course;

  const mediaStyle = image
    ? ({ "--roadmap-card-image": `url(${image})` } as CSSProperties)
    : undefined;

  return (
    <article aria-labelledby={headingId} className="roadmap-course-card">
      <div
        aria-hidden="true"
        className="roadmap-course-media"
        data-has-image={image ? "true" : "false"}
        style={mediaStyle}
      />
      <div className="roadmap-course-body">
        <span className="roadmap-course-category">{category}</span>
        <h4 id={headingId} className="roadmap-course-name">
          {name}
        </h4>
      </div>
    </article>
  );
}
