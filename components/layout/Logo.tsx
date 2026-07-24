import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Site logo: the neon code-brackets/server mark (`/public/logo-mark.png`,
 * transparent background) beside the "Noam Pony" wordmark.
 *
 * Decorative (`aria-hidden`): the wrapping link in the navbar carries the
 * accessible name ("Noam Pony — home"). The wordmark inherits its colour from
 * that link, so it picks up the link's hover/focus colour transition.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("group/logo inline-flex select-none items-center gap-2.5", className)}
    >
      <span className="site-logo-emblem">
        <Image
          src="/logo-mark.png"
          alt=""
          width={40}
          height={30}
          priority
          className="h-[30px] w-10 object-contain"
        />
      </span>
      <span className="text-[0.975rem] font-semibold tracking-tight">Noam Pony</span>
    </span>
  );
}
