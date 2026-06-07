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
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_12%_12%,color-mix(in_srgb,var(--accent)_11%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_srgb,var(--bg-surface)_62%,transparent),transparent_42%)]"
      />
      <div className="mx-auto grid w-full max-w-7xl gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:items-start lg:gap-14">
        <div className="about-reveal max-w-measure">
          <p className="mb-3 font-mono text-small uppercase tracking-[0.18em] text-accent">
            About Me
          </p>
          <h2 id="about-heading" className="m-0 text-h1 font-semibold text-text-primary">
            Backend systems, cloud practice, and continuous learning.
          </h2>
          <p className="mt-5 text-body text-text-secondary sm:text-[1.0625rem]">
            {about.professionalSummary}
          </p>
        </div>

        <div className="about-reveal grid gap-4 sm:gap-5">
          <dl
            aria-label="About statistics"
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="group rounded-md border border-border bg-bg-surface/90 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.18)] transition-[border-color,background-color,box-shadow,transform] duration-200 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-accent/45 motion-safe:hover:bg-bg-surface-raised"
              >
                <dt className="text-small text-text-muted">{stat.label}</dt>
                <dd className="mt-2 font-mono text-h2 font-semibold text-accent transition-colors duration-200 group-hover:text-accent-hover">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-md border border-border bg-bg-surface/90 p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]">
            <h3 className="m-0 text-body font-semibold text-text-primary">Main Fields</h3>
            <ul
              aria-label="Main professional fields"
              className="mt-4 flex flex-wrap gap-2"
            >
              {about.mainFields.map((field) => (
                <li key={field}>
                  <span className="inline-flex min-h-9 items-center rounded-sm border border-border bg-bg-surface-raised px-3 py-1.5 text-small text-text-secondary transition-colors duration-200 hover:border-accent/45 hover:text-text-primary">
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
