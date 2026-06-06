/**
 * Shared site footer (spec §20.1 landmark).
 *
 * Exposes only non-confidential, owner-approved contact info. Per spec §15.6,
 * phone and email are published only with explicit owner confirmation, which
 * does not yet exist — so the footer defaults to the public LinkedIn profile
 * only. Email/phone are wired up later in the Contact section (Phase 11) once
 * confirmed; do not add them here.
 */
const OWNER_NAME = "Noam Pony";
const LINKEDIN_URL = "https://www.linkedin.com/in/noam-pony/";

export function Footer() {
  // Build-time year; the site is statically generated, so this reflects the
  // last build. Used only for the copyright line.
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-surface">
      <div className="mx-auto flex max-w-measure flex-col items-center gap-3 px-6 py-8 text-small text-text-secondary sm:flex-row sm:justify-between">
        <p className="m-0">
          © {year} {OWNER_NAME}
        </p>
        <nav aria-label="Footer">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-text-secondary underline-offset-4 outline-none transition-colors hover:text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
