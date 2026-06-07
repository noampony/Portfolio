"use client";

import { useEffect, useRef } from "react";

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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
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

  return (
    <dialog
      ref={dialogRef}
      className="cert-viewer-dialog"
      aria-labelledby={certificate ? "cert-viewer-title" : undefined}
      onCancel={handleClose}
      onClose={handleClose}
    >
      {certificate ? (
        <div className="cert-viewer-panel">
          <header className="cert-viewer-header">
            <div className="cert-viewer-heading">
              <span className="cert-viewer-icon" aria-hidden="true">
                <CertificateDocumentIcon />
              </span>
              <h2 id="cert-viewer-title" className="cert-viewer-title">
                {certificate.title}
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
                <a
                  href={certificate.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-viewer-open-link"
                >
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
