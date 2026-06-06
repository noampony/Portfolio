/**
 * "Skip to content" link. Rendered as the first focusable element in the
 * document so keyboard users can bypass the (sticky) header and jump straight
 * to the main landmark (spec §20.6). Visually hidden until focused.
 *
 * Its target must match the `id` on the <main> element in the root layout.
 */
export const MAIN_CONTENT_ID = "main-content";

export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-md bg-bg-surface-raised px-4 py-2 text-body font-medium text-text-primary outline-none ring-2 ring-transparent focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:ring-accent"
    >
      Skip to content
    </a>
  );
}
