import Image from "next/image";

/**
 * Brand logo — the "NP" mark shown in the navbar (spec §5.1).
 *
 * Renders the logo asset at `public/logo.png` (served from `/logo.png`). The
 * accessible name for the brand link lives on the link itself in {@link Navbar}
 * (an `aria-label`), so the image is decorative here (`alt=""`). `priority` is
 * set because the mark is in the always-visible header, not lazy content.
 *
 * The intrinsic mark is ~1.85:1; rendered at 32px tall to sit cleanly in the bar.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={59}
      height={32}
      priority
      className={className}
    />
  );
}
