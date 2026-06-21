"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { contact } from "@/lib/content/data/contact";

/**
 * Contact section (spec §8.8, Task 11.2).
 *
 * Direct contact links only — no contact form. The form is a nice-to-have
 * (§8.8 decision) and the direct links must ship first; we deliberately do not
 * render a placeholder/broken form.
 *
 * Renders the heading, corrected message, and the confirmed contact methods:
 *   - Email    → `mailto:`
 *   - Phone    → `tel:` (only when a confirmed number is present, §15.6)
 *   - LinkedIn → opens in a new tab with `rel="noopener noreferrer"`
 *   - Location → plain text (not a link)
 * plus the preferred contact method.
 *
 * The section exposes the `#contact` anchor (spec §5.3); per §5.1 the navbar
 * carries only Home/Projects/Courses/Resume, so `lib/navigation.ts` is
 * intentionally left unchanged. The Hero's Contact CTA is wired to `#contact`
 * later (Task 11.3).
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
    value: "noam-pony",
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

const isPreferred = (id: string) =>
  contact.preferredContactMethod.toLowerCase() === id.toLowerCase();

function ContactMethodCard({ method }: { method: ContactMethod }) {
  const preferred = isPreferred(method.id);

  const inner = (
    <>
      <span className="contact-method-icon" aria-hidden="true">
        {method.icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-mono text-small uppercase tracking-wider text-text-muted">
            {method.label}
          </span>
          {preferred && (
            <span className="contact-preferred-badge">Preferred</span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-body text-text-primary">
          {method.value}
        </span>
      </span>
    </>
  );

  const baseClass = "contact-method-card group";

  if (method.href === null) {
    return (
      <div className={baseClass} aria-label={`${method.label}: ${method.value}`}>
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
    >
      {inner}
    </a>
  );
}

export function Contact() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden border-t border-border bg-bg-base py-16 lg:py-24"
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
        <motion.div variants={revealItemVariants} className="relative">
          <motion.span
            aria-hidden="true"
            className="about-copy-accent-line"
            variants={accentLineRevealVariants}
          />
          <p className="mb-3 font-mono text-small tracking-wider text-accent">
            SYS://CONTACT
          </p>
          <h2
            id="contact-heading"
            className="m-0 max-w-measure text-h2 font-semibold leading-snug text-text-primary sm:text-h1 sm:leading-tight"
          >
            {contact.heading}
          </h2>
          <p className="mt-4 max-w-measure text-body text-text-secondary">
            {contact.message}
          </p>
        </motion.div>

        <motion.ul
          variants={revealItemVariants}
          aria-label="Contact methods"
          className="mt-10 grid list-none gap-3 p-0 sm:grid-cols-2 sm:gap-4"
        >
          {methods.map((method) => (
            <li key={method.id} className="flex">
              <ContactMethodCard method={method} />
            </li>
          ))}
        </motion.ul>

        <motion.p
          variants={revealItemVariants}
          className="mt-6 text-small text-text-muted"
        >
          Preferred contact method:{" "}
          <span className="font-medium text-text-secondary">
            {contact.preferredContactMethod}
          </span>
          .
        </motion.p>
      </motion.div>
    </section>
  );
}
