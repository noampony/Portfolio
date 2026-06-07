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
      className="border-t border-border bg-bg-base px-6 py-16 sm:px-14 md:px-16 lg:py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:items-start lg:gap-14">
        <div className="max-w-measure">
          <p className="mb-3 font-mono text-small uppercase text-accent">About Me</p>
          <h2 id="about-heading" className="m-0 text-h1 font-semibold text-text-primary">
            Backend systems, cloud practice, and continuous learning.
          </h2>
          <p className="mt-5 text-body text-text-secondary">{about.professionalSummary}</p>
        </div>

        <div className="grid gap-6">
          <dl
            aria-label="About statistics"
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-md border border-border bg-bg-surface p-4"
              >
                <dt className="text-small text-text-muted">{stat.label}</dt>
                <dd className="mt-2 font-mono text-h2 font-semibold text-accent">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-md border border-border bg-bg-surface p-5">
            <h3 className="m-0 text-body font-semibold text-text-primary">Main Fields</h3>
            <ul
              aria-label="Main professional fields"
              className="mt-4 flex flex-wrap gap-2"
            >
              {about.mainFields.map((field) => (
                <li key={field}>
                  <span className="inline-flex min-h-9 items-center rounded-sm border border-border bg-bg-surface-raised px-3 py-1.5 text-small text-text-secondary">
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
