"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { businessCard } from "@/lib/content/data/businessCard";
import { resume } from "@/lib/content/data/resume";
import { CardTrigger } from "./CardTrigger";

/**
 * Floating Business Card (spec §7.6, §8.9, §16.5) — opened by the
 * always-visible top-left {@link CardTrigger}, mounted once in the root
 * layout. A compact card that expands out of the trigger button's corner
 * (owner-requested interaction): the dialog shares the trigger's top-left
 * anchor and scales up from a top-left transform origin.
 *
 * Follows the ResumeViewer / certificate-viewer pattern: a native `<dialog>`
 * opened with `showModal()`, which provides the modal focus trap, Escape
 * handling (`onCancel`), and automatic focus restore to the trigger on close.
 * Outside clicks land on the dialog element itself (the panel is a child), so
 * a backdrop click closes it. The expand animation lives in a
 * `prefers-reduced-motion: no-preference` query, so reduced-motion users see
 * the card instantly.
 *
 * Renders nothing unless the feature is owner-promoted (§8.9); all content
 * comes from the validated {@link businessCard} data (Task 14.1) — nothing is
 * hardcoded here.
 */
export function FloatingCard() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }
    if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!businessCard.isPromoted) {
    return null;
  }

  const close = () => setOpen(false);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  return (
    <>
      <CardTrigger open={open} onClick={() => setOpen(true)} />
      <dialog
        ref={dialogRef}
        className="business-card-dialog"
        aria-labelledby="business-card-name"
        onCancel={close}
        onClose={close}
        onClick={handleBackdropClick}
      >
        {/* Kept mounted while closed (the <dialog> is display:none then) so the
            content is still visible during the shrink-out close transition. */}
        <div className="business-card-panel">
          <header className="business-card-header">
            <span className="business-card-header-label">Business card</span>
            <button
              type="button"
              className="business-card-close"
              aria-label="Close business card"
              onClick={close}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>

          <div className="business-card-identity">
            <span className="business-card-avatar">
              <Image
                src={businessCard.profileImage}
                alt={`${businessCard.name} profile`}
                width={192}
                height={192}
                sizes="6rem"
                className="business-card-avatar-image"
              />
            </span>
            <h2 id="business-card-name" className="business-card-name">
              {businessCard.name}
            </h2>
            <p className="business-card-title">{businessCard.title}</p>
          </div>

          <ul className="business-card-contact-list">
            <li>
              <a href={`mailto:${businessCard.email}`} className="business-card-contact-link">
                <MailIcon />
                <span className="business-card-contact-text">{businessCard.email}</span>
              </a>
            </li>
            <li>
              <a
                href={businessCard.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="business-card-contact-link"
              >
                <LinkedInIcon />
                <span className="business-card-contact-text">LinkedIn</span>
                <ExternalLinkIcon />
              </a>
            </li>
            <li>
              <span className="business-card-contact-link business-card-contact-static">
                <PinIcon />
                <span className="business-card-contact-text">{businessCard.location}</span>
              </span>
            </li>
          </ul>

          <a
            href={businessCard.resumeLink}
            download={resume.fileName}
            className="business-card-resume-action"
            onClick={close}
          >
            <DownloadIcon />
            {resume.downloadButtonText}
          </a>
        </div>
      </dialog>
    </>
  );
}

/* Decorative glyphs — every icon is aria-hidden; adjacent text or the parent's
   aria-label carries the accessible name. */

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg {...iconProps} className="business-card-external-icon">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const iconProps = {
  "aria-hidden": true,
  focusable: "false",
  className: "business-card-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
