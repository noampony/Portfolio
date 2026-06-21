"use client";

import { useEffect, useRef, type MouseEvent } from "react";

import { resume } from "@/lib/content/data/resume";

/**
 * Resume preview modal (spec §8.7) — opened by the Hero "Resume" CTA (§8.1
 * wiring note). Mirrors the EducationCertificateViewer pattern: a native
 * `<dialog>` (free focus-trap + Esc handling), embedded PDF preview via an
 * `<iframe>`, a `Download CV` action and an "open in new tab" fallback link.
 *
 * The PDF is served from the site root at `/resume.pdf` (Next.js serves
 * `public/` from `/`) — never `/public/...` (§4.5). No third-party trackers.
 */

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="resume-viewer-action-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="resume-viewer-action-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

function ResumeDocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

type ResumeViewerProps = {
  open: boolean;
  onClose: () => void;
};

export function ResumeViewer({ open, onClose }: ResumeViewerProps) {
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

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="resume-viewer-dialog"
      aria-labelledby={open ? "resume-viewer-title" : undefined}
      onCancel={onClose}
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      {open ? (
        <div className="resume-viewer-panel">
          <header className="resume-viewer-header">
            <div className="resume-viewer-heading">
              <span className="resume-viewer-icon" aria-hidden="true">
                <ResumeDocumentIcon />
              </span>
              <h2 id="resume-viewer-title" className="resume-viewer-title">
                Resume
              </h2>
            </div>
            <button
              type="button"
              className="resume-viewer-close"
              aria-label="Close resume preview"
              onClick={onClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>
          <div className="resume-viewer-body">
            <div className="resume-viewer-frame-wrap">
              <iframe
                src={resume.publicUrl}
                title="Resume preview"
                className="resume-viewer-frame"
              />
            </div>
            <div className="resume-viewer-actions">
              <a
                href={resume.publicUrl}
                download={resume.fileName}
                className="resume-viewer-action resume-viewer-action--primary"
              >
                <DownloadIcon />
                {resume.downloadButtonText}
              </a>
              <a
                href={resume.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-viewer-action"
              >
                <ExternalLinkIcon />
                Open in new tab
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
