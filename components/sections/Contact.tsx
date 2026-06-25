"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { useGlareHandlers } from "@/components/ui/GlareHover";

import { contact } from "@/lib/content/data/contact";

/**
 * Contact section (spec §8.8, Task 11.2 + deliver-animation redesign).
 *
 * Layout: heading block (unchanged) above a 2/3 / 1/3 split:
 *   - Left 2/3: ContactIllustration — looping flying-envelope animation
 *   - Right 1/3: compact direct-link cards (Email, Phone, LinkedIn, Location)
 *
 * No contact form. The "Preferred" metadata has been removed per the redesign.
 */

const easeOut = [0.22, 1, 0.36, 1] as const;

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

const accentLineRevealVariants: Variants = {
  hidden: { opacity: 0, x: -128 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.1, ease: easeOut },
  },
};

/** Digits-only form for the `tel:` URI, preserving the leading "+". */
const telHref = `tel:${contact.phone.replace(/(?!^\+)[^\d]/g, "")}`;

type ContactMethod = {
  id: string;
  label: string;
  /** Visible value (e.g. the address, phone number, profile name). */
  value: string;
  /** `null` → rendered as static text rather than a link (e.g. Location). */
  href: string | null;
  external?: boolean;
  icon: ReactNode;
};

function EmailIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L15.5 12l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95C20.7 8.75 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2 0-2.32 1.57-2.32 3.2V21H9V9Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

// ── Illustration sub-components ──────────────────────────────────────────────

function HumanSilhouette() {
  return (
    <svg viewBox="0 0 46 56" width="46" height="56" fill="none" aria-hidden="true">
      <circle cx="23" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity={0.9} />
      <path
        d="M6 50 C6 36 10 30 23 30 C36 30 40 36 40 50"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.9}
        fill="none"
      />
    </svg>
  );
}

function ContactIllustration({ animate }: { animate: boolean }) {
  return (
    <div
      role="img"
      aria-label="Animated illustration of a message being delivered"
      className="relative w-full"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "160px",
        color: "var(--accent)",
      }}
    >
      {/* YOU — visitor silhouette in a circle matching the ME avatar */}
      <motion.div
        className="flex flex-col items-center gap-1 flex-shrink-0"
        animate={animate ? { y: [-1.5, 1.5, -1.5] } : {}}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          style={{
            width: "84px",
            height: "84px",
            borderRadius: "50%",
            background: "color-mix(in srgb, var(--bg-surface-raised) 62%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <HumanSilhouette />
        </div>
        <span className="font-mono text-[0.6rem] tracking-[0.18em] opacity-70">YOU</span>
      </motion.div>

      {/* Middle — arc + flying envelope */}
      {/*
        Arc: M4 30 Q50 5 96 30 — starts/ends at y=30 (50% of viewBox height 60),
        which maps to 50% of the 160px container = the vertical center of YOU and ME.
        Envelope uses 4 keyframes to trace the arc: start → peak → arrive → fade.
      */}
      <div className="flex-1 relative mx-3" style={{ height: "160px" }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d="M4 30 Q50 5 96 30"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeDasharray="3 3.5"
            fill="none"
            animate={animate ? { opacity: [0.35, 0.65, 0.35] } : { opacity: 0.35 }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>

        {/*
          9 sampled points along quadratic Bézier M4,30 Q50,5 96,30 (t=0..1).
          Each left/top is x% of container width and y/60*100% of container height.
          Rotation follows the arc tangent: negative (nose up) while ascending,
          zero at peak, positive (nose down) while descending.
        */}
        <motion.div
          className="absolute"
          animate={
            animate
              ? {
                  left:    ["4%","15.5%","27%","38.5%","50%","61.5%","73%","84.5%","92%","92%"],
                  top:     ["50%","40.9%","34.4%","30.5%","29.2%","30.5%","34.4%","40.9%","50%","50%"],
                  opacity: [0,   1,      1,     1,      1,    1,     1,    1,      1,     0],
                  rotate:  [-10, -7,     -4,    -2,     0,    2,     4,    7,      10,    10],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.077, 0.155, 0.232, 0.31, 0.388, 0.465, 0.542, 0.62, 1],
          }}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <svg viewBox="0 0 26 18" width="26" height="18" aria-hidden="true" style={{ overflow: "visible" }}>
            <rect x="0" y="0" width="26" height="18" rx="2" fill="currentColor" opacity={0.55} stroke="currentColor" strokeWidth="0.8" />
            <path d="M0 0 L13 11 L26 0" stroke="currentColor" strokeWidth="0.8" fill="none" opacity={0.9} />
            {/* Speed-line streaks trailing behind the envelope */}
            <line x1="-3" y1="6"  x2="-9"  y2="6"  stroke="currentColor" strokeWidth="0.6" opacity={0.75} />
            <line x1="-3" y1="10" x2="-12" y2="10" stroke="currentColor" strokeWidth="0.5" opacity={0.6} />
            <line x1="-3" y1="14" x2="-7"  y2="14" stroke="currentColor" strokeWidth="0.4" opacity={0.4} />
          </svg>
        </motion.div>
      </div>

      {/* ME — avatar with ping rings */}
      <motion.div
        className="flex flex-col items-center gap-1 flex-shrink-0"
        animate={animate ? { y: [-1.5, 1.5, -1.5] } : {}}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        <div className="relative">
          {/* Outer ping ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "-4px",
              border: "1px solid var(--accent)",
            }}
            animate={animate ? { scale: [1, 1.55], opacity: [0.35, 0] } : { opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 1.6 }}
          />
          {/* Inner ping ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "-4px",
              border: "1px solid var(--accent)",
            }}
            animate={animate ? { scale: [1, 1.9], opacity: [0.22, 0] } : { opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 1.9 }}
          />
          <div
            style={{
              width: "84px",
              height: "84px",
              borderRadius: "50%",
              border: "1px solid color-mix(in srgb, var(--accent) 40%, var(--border))",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/contact-avatar.png"
              alt="Noam Pony"
              width={84}
              height={84}

              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>
        <span className="font-mono text-[0.6rem] tracking-[0.18em] opacity-70">ME</span>
      </motion.div>
    </div>
  );
}

// ── Contact method cards ─────────────────────────────────────────────────────

// Phone is included only when a confirmed number exists (§15.6 — otherwise it
// would be omitted upstream in the data, never invented here).
const methods: ContactMethod[] = [
  {
    id: "email",
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: <EmailIcon />,
  },
  ...(contact.phone
    ? [
        {
          id: "phone",
          label: "Phone",
          value: contact.phone,
          href: telHref,
          icon: <PhoneIcon />,
        } satisfies ContactMethod,
      ]
    : []),
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "Noam Pony",
    href: contact.linkedIn,
    external: true,
    icon: <LinkedInIcon />,
  },
  {
    id: "location",
    label: "Location",
    value: contact.location,
    href: null,
    icon: <LocationIcon />,
  },
];

function ContactMethodCard({ method, compact }: { method: ContactMethod; compact?: boolean }) {
  const { overlayRef, overlayStyle, handlers } = useGlareHandlers({ transitionDuration: 1300, playOnce: true });
  const baseClass = `contact-method-card${compact ? " contact-method-card--compact" : ""} group`;

  const inner = (
    <>
      <div ref={overlayRef} style={overlayStyle} aria-hidden="true" />
      <span className="contact-method-icon" aria-hidden="true">
        {method.icon}
      </span>
      <span className="min-w-0">
        <span className="font-mono text-small uppercase tracking-wider text-text-muted">
          {method.label}
        </span>
        <span className={`-mt-1 block truncate ${compact ? "text-small" : "text-body"} text-text-primary`}>
          {method.value}
        </span>
      </span>
    </>
  );

  if (method.href === null) {
    return (
      <div className={baseClass} aria-label={`${method.label}: ${method.value}`} {...handlers}>
        {inner}
      </div>
    );
  }

  const externalProps = method.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={method.href}
      {...externalProps}
      aria-label={
        method.external
          ? `${method.label}: ${method.value} (opens in a new tab)`
          : `${method.label}: ${method.value}`
      }
      className={`${baseClass} contact-method-link`}
      {...handlers}
    >
      {inner}
    </a>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

export function Contact() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden border-t border-border bg-bg-base py-6 lg:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_14%_18%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_30%),radial-gradient(circle_at_86%_82%,color-mix(in_srgb,var(--gradient-to)_12%,transparent),transparent_32%)]"
      />

      <motion.div
        className="site-shell"
        initial={animate ? "hidden" : false}
        whileInView={animate ? "visible" : undefined}
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainerVariants}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr] lg:gap-8 lg:items-center">
          {/* Left: heading + text + illustration widget */}
          <motion.div variants={revealItemVariants} className="flex flex-col gap-4">
            <div className="relative">
              <motion.span
                aria-hidden="true"
                className="about-copy-accent-line"
                variants={accentLineRevealVariants}
              />
              <p className="mb-2 font-mono text-small tracking-wider text-accent">
                SYS://CONTACT
              </p>
              <h2
                id="contact-heading"
                className="m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
              >
                {contact.heading}
              </h2>
              <p className="mt-3 max-w-measure text-body text-text-secondary">
                {contact.message.split("? ")[0]}?<br />
                {contact.message.split("? ")[1]}
              </p>
            </div>

            <ContactIllustration animate={animate} />
          </motion.div>

          {/* Right: 4-row cards, centered vertically */}
          <motion.div
            variants={revealItemVariants}
            className="flex items-center justify-center"
          >
            <ul
              aria-label="Contact methods"
              className="m-0 list-none grid grid-cols-1 gap-3 p-0 w-full min-[560px]:grid-cols-2 lg:grid-cols-1 lg:w-3/4"
            >
              {methods.map((method) => (
                <li key={method.id} className="flex">
                  <ContactMethodCard method={method} compact />
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
