import type { LearningPath } from "@/lib/content/types";
import { CourseCarousel } from "@/components/ui/CourseCarousel";

/**
 * One path in the learning roadmap (spec §8.5): a numbered node on the spine plus a content
 * block (header + carousel of the path's courses). The `<h3>` keeps a logical heading order
 * under the section `<h2>` ("Learning Roadmap").
 *
 * The node is a direct child of the path (it sits on the spine in the gutter on mobile/tablet,
 * and on the central spine on desktop); the header + carousel are wrapped in
 * `.roadmap-path-content` so the desktop center layout can place that block on alternating
 * sides of the spine (CSS handles the parity via `:nth-child`).
 */

type RoadmapPathProps = {
  path: LearningPath;
  /** Id wired to the path `<h3>` so the carousel can reference its name. */
  headingId: string;
};

export function RoadmapPath({ path, headingId }: RoadmapPathProps) {
  const order = String(path.order).padStart(2, "0");

  return (
    <section aria-labelledby={headingId} className="roadmap-path">
      <span aria-hidden="true" className="roadmap-path-order">
        {order}
      </span>
      <div className="roadmap-path-content">
        <header className="roadmap-path-header">
          <h3 id={headingId} className="roadmap-path-title">
            <span className="sr-only">Path {path.order}: </span>
            {path.title}
          </h3>
        </header>
        <CourseCarousel courses={path.courses} label={path.title} />
      </div>
    </section>
  );
}
