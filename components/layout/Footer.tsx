/**
 * Shared site footer (spec §20.1 landmark).
 *
 * Deliberately minimal: just the copyright line. Contact channels (email,
 * phone, LinkedIn) live in the Contact section and the floating business card —
 * per spec §15.6 they are published only where the owner confirmed, so do not
 * re-add them here.
 */
const OWNER_NAME = "Noam Pony";

export function Footer() {
  // Build-time year; the site is statically generated, so this reflects the
  // last build. Used only for the copyright line.
  const year = new Date().getFullYear();

  return (
    <footer className="seam-hairline bg-bg-surface">
      <div className="site-shell flex flex-col items-center gap-3 py-8 text-small text-text-secondary sm:flex-row sm:justify-between">
        <p className="m-0">
          © {year} {OWNER_NAME}
        </p>
      </div>
    </footer>
  );
}
