import { about } from "@/lib/content/data/about";

type StatItem = {
  id: string;
  value: string;
  label: string;
};

const stats: StatItem[] = [
  {
    id: "years",
    value: about.stats.yearsExperienceCountLabel,
    label: "Years Experience",
  },
  {
    id: "technologies",
    value: about.stats.technologiesCountLabel,
    label: "Technologies",
  },
  {
    id: "courses",
    value: about.stats.coursesCountLabel,
    label: "Courses",
  },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="about-section relative isolate overflow-hidden border-t border-border bg-bg-base px-6 py-16 sm:px-10 md:px-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_12%_12%,color-mix(in_srgb,var(--accent)_16%,transparent),transparent_28%),radial-gradient(circle_at_86%_20%,color-mix(in_srgb,var(--gradient-to)_14%,transparent),transparent_30%),linear-gradient(180deg,color-mix(in_srgb,var(--bg-surface)_72%,transparent),transparent_48%)]"
      />
      <div aria-hidden="true" className="about-grid-wash" />
      <div aria-hidden="true" className="about-scanline" />

      <div className="mx-auto grid w-full max-w-7xl gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.86fr)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,0.9fr)_minmax(36rem,1fr)]">
        <div className="about-reveal about-copy-panel max-w-measure">
          <p className="mb-3 font-mono text-small uppercase tracking-[0.18em] text-accent">
            About Me
          </p>
          <h2 id="about-heading" className="m-0 text-h1 font-semibold text-text-primary">
            Backend systems, cloud practice, and continuous learning.
          </h2>
          <p className="mt-5 text-body text-text-secondary sm:text-[1.0625rem]">
            {about.professionalSummary}
          </p>
          <div aria-hidden="true" className="mt-7 flex items-center gap-3 font-mono text-small text-text-secondary">
            <span className="h-px min-w-8 flex-1 bg-gradient-to-r from-accent/70 to-transparent" />
            <span>profile.compile()</span>
          </div>
        </div>

        <div className="about-reveal grid gap-4 sm:gap-5">
          <dl
            aria-label="About statistics"
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="about-stat-card group"
              >
                <dt className="whitespace-nowrap text-small text-text-secondary">{stat.label}</dt>
                <dd className="mt-2 font-mono text-h2 font-semibold text-accent transition-colors duration-200 group-hover:text-accent-hover">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="about-fields-panel">
            <div className="flex items-center justify-between gap-4">
              <h3 className="m-0 text-body font-semibold text-text-primary">Main Fields</h3>
              <span aria-hidden="true" className="h-px min-w-12 flex-1 bg-gradient-to-r from-border via-accent/35 to-transparent" />
            </div>
            <ul
              aria-label="Main professional fields"
              className="mt-4 flex flex-wrap gap-2"
            >
              {about.mainFields.map((field) => (
                <li key={field}>
                  <span className="about-field-badge">
                    {field}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
