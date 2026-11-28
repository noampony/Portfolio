import Image from "next/image";

import type { RoadmapCourse } from "@/lib/content/types";

/**
 * A single compact course card for the learning roadmap (spec §8.5), shown inside a
 * `CourseDeck`.
 *
 * Shows a media area (the course `image` when provided, otherwise a consistent gradient
 * fallback - never a broken image), a small category label, and the course name. The card
 * has no link: there is no course detail page yet.
 *
 * The name is clipped to one line, but the *focused* card of a deck shows it in full (up to
 * 4 lines). Every card reserves the room for 4 lines, so focusing a card never changes the
 * deck's height. The clip is visual only - the full name is always in the DOM for assistive
 * tech.
 */

type RoadmapCourseCardProps = {
  course: RoadmapCourse;
  /** Id wired to the card title so the deck item is named for assistive tech. */
  headingId: string;
  /** The deck's focused card: shows its full name. */
  focused: boolean;
};

export function RoadmapCourseCard({ course, headingId, focused }: RoadmapCourseCardProps) {
  const { name, category, image } = course;

  return (
    <div className="roadmap-course-card" data-focused={focused ? "true" : "false"}>
      <div
        aria-hidden="true"
        className="roadmap-course-media"
        data-has-image={image ? "true" : "false"}
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 12rem, 11rem"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="roadmap-course-body">
        <span className="roadmap-course-category">{category}</span>
        <h4 id={headingId} className="roadmap-course-name">
          {name}
        </h4>
      </div>
    </div>
  );
}
