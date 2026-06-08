import Image from "next/image";

/**
 * Brand logo — the "NP" mark shown in the navbar (spec §5.1).
 *
 * Renders the logo asset at `public/logo.png` (served from `/logo.png`). The
 * accessible name for the brand link lives on the link itself in {@link Navbar}
 * (an `aria-label`), so the image is decorative here (`alt=""`). `priority` is
 * set because the mark is in the always-visible header, not lazy content.
 *
 * The asset is tightly cropped to the wordmark (~3.86:1); rendered at 28px tall
 * (≈108px wide) so the sticky bar stays compact.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden="true"
      width={108}
      height={28}
      priority
      className={["h-7 w-[108px] object-contain", className].filter(Boolean).join(" ")}
    />
  );
}
