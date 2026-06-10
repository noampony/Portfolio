"use client";

import { useEffect, useRef, type MouseEvent } from "react";

import type { EducationCertificateRef } from "@/lib/content/types";

type EducationCertificateViewerProps = {
  certificate: EducationCertificateRef | null;
  onClose: () => void;
};

function CertificateDocumentIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="about-cert-trigger-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="9" r="6" />
      <path d="m9 14.5-1.6 6.2a.5.5 0 0 0 .73.55L12 19.4l3.87 1.85a.5.5 0 0 0 .73-.55L15 14.5" />
      <path d="m10.1 9 1.3 1.3 2.5-2.6" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="cert-viewer-open-link-icon"
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

type EducationCertificateTriggerProps = {
  certificate: EducationCertificateRef;
  onOpen: (certificate: EducationCertificateRef) => void;
};

export function EducationCertificateTrigger({
  certificate,
  onOpen,
}: EducationCertificateTriggerProps) {
  return (
    <button
      type="button"
      className="about-cert-trigger"
      aria-label={certificate.viewLabel}
      title={certificate.viewLabel}
      onClick={() => onOpen(certificate)}
    >
      <CertificateDocumentIcon />
      <span className="about-cert-trigger-label">Preview certificate</span>
    </button>
  );
}

export function EducationCertificateViewer({
  certificate,
  onClose,
}: EducationCertificateViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (certificate) {
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [certificate]);

  const handleClose = () => {
    onClose();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="cert-viewer-dialog"
      aria-labelledby={certificate ? "cert-viewer-title" : undefined}
      onCancel={handleClose}
      onClose={handleClose}
      onClick={handleBackdropClick}
    >
      {certificate ? (
        <div className="cert-viewer-panel">
          <header className="cert-viewer-header">
            <div className="cert-viewer-heading">
              <span className="cert-viewer-icon" aria-hidden="true">
                <CertificateDocumentIcon />
              </span>
              <h2 id="cert-viewer-title" className="cert-viewer-title">
                {certificate.title} Certificate
              </h2>
            </div>
            <button
              type="button"
              className="cert-viewer-close"
              aria-label="Close certificate viewer"
              onClick={handleClose}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </header>
          <div className="cert-viewer-body">
            {certificate.file ? (
              <>
                <div className="cert-viewer-frame-wrap">
                  <iframe
                    src={certificate.file}
                    title={certificate.title}
                    className="cert-viewer-frame"
                  />
                </div>
                <p className="cert-viewer-mobile-note">
                  PDF preview isn&apos;t supported on mobile — tap the button below to open it.
                </p>
                <a
                  href={certificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-viewer-open-link"
                >
                  <ExternalLinkIcon />
                  Open PDF in new tab
                </a>
              </>
            ) : (
              <>
                <div className="cert-viewer-preview" aria-hidden="true">
                  <CertificateDocumentIcon />
                </div>
                <p className="cert-viewer-placeholder">
                  Certificate preview is not available yet. This viewer is ready for when the
                  file is added.
                </p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
