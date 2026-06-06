"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Generic Python snippets for the decorative Hero backdrop.
 * Exact content is TBD (spec §19.2) — these defaults are owner-confirmable
 * placeholders only. Never use real or work-derived code (spec §15.2).
 */
const FLOATING_SNIPPETS = [
  {
    code: `def greet(name: str) -> str:\n    return f"Hello, {name}!"`,
    position: "right-[8%] top-[18%]",
    duration: 28,
    delay: 0,
  },
  {
    code: `items = [1, 2, 3, 4, 5]\ntotal = sum(items)`,
    position: "left-[6%] top-[32%]",
    duration: 32,
    delay: 4,
  },
  {
    code: `async def fetch(url: str) -> bytes:\n    ...`,
    position: "right-[14%] bottom-[28%]",
    duration: 26,
    delay: 2,
  },
  {
    code: `squares = [n * n for n in range(6)]`,
    position: "left-[12%] bottom-[18%]",
    duration: 30,
    delay: 6,
  },
] as const;

/**
 * Decorative floating Python code blocks for the Hero backdrop (spec §8.1).
 * Hidden on mobile when it would clutter (§16.3). Respects reduced motion (§7.3).
 */
export function FloatingCode() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 max-md:hidden">
      {FLOATING_SNIPPETS.map((snippet) => (
        <motion.pre
          key={snippet.code}
          tabIndex={-1}
          className={cn(
            "absolute m-0 max-w-[14rem] whitespace-pre-wrap rounded-md border border-border/40 bg-bg-surface/30 p-3 font-mono text-small leading-snug text-text-muted/80 backdrop-blur-[1px] sm:max-w-[16rem]",
            snippet.position
          )}
          initial={false}
          animate={
            prefersReducedMotion
              ? { opacity: 0.14, x: 0, y: 0 }
              : {
                  opacity: [0.1, 0.16, 0.1],
                  x: [0, 6, 0],
                  y: [0, -10, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: snippet.duration,
                  delay: snippet.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <code>{snippet.code}</code>
        </motion.pre>
      ))}
    </div>
  );
}
