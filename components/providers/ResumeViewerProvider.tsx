"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { resume } from "@/lib/content/data/resume";
import { ResumeViewer } from "@/components/sections/ResumeViewer";

/**
 * App-wide resume preview modal (spec §8.7).
 *
 * The {@link ResumeViewer} dialog is mounted once here and shared, so any
 * trigger — the Hero "Resume" CTA and the navbar "Resume" item — opens the same
 * modal via {@link useResumeViewer}. Centralising the open/close state (and the
 * narrow-mobile "open the PDF in a new tab" fallback) keeps every entry point
 * behaving identically.
 */

type ResumeViewerContextValue = {
  /** Whether the modal is currently open (drives triggers' `aria-expanded`). */
  open: boolean;
  openResume: () => void;
  closeResume: () => void;
};

const ResumeViewerContext = createContext<ResumeViewerContextValue | null>(null);

export function useResumeViewer(): ResumeViewerContextValue {
  const ctx = useContext(ResumeViewerContext);
  if (!ctx) {
    throw new Error("useResumeViewer must be used within a ResumeViewerProvider");
  }
  return ctx;
}

export function ResumeViewerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const openResume = useCallback(() => {
    // On narrow mobile, embedded PDF iframes don't render, so open the PDF
    // directly in a new tab instead (same fallback the certificate viewer uses).
    if (typeof window !== "undefined" && window.innerWidth <= 420) {
      window.open(resume.publicUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setOpen(true);
  }, []);

  const closeResume = useCallback(() => setOpen(false), []);

  const value = useMemo<ResumeViewerContextValue>(
    () => ({ open, openResume, closeResume }),
    [open, openResume, closeResume],
  );

  return (
    <ResumeViewerContext.Provider value={value}>
      {children}
      <ResumeViewer open={open} onClose={closeResume} />
    </ResumeViewerContext.Provider>
  );
}
