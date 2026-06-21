/**
 * Resume content (spec §8.7, §11.6) — used by the Resume section (Task 10.2)
 * and the Hero Resume CTA (Task 10.3).
 *
 * The file lives at the repo path `public/resume.pdf` and is served from the
 * site root at `/resume.pdf` (Next.js serves `public/` from `/`, never
 * `/public/...`). Always link `/resume.pdf` (§4.5).
 *
 * TBD fields (`lastUpdated`, `highlights`) are intentionally omitted until the
 * owner provides them (§8.7, §17, §19.8); the validator drops absent optionals
 * rather than rendering empty values.
 *
 * Privacy: the PDF must be privacy-reviewed and owner-signed-off before
 * publication (§15.5). This module only encodes metadata (paths/labels) — it
 * does not embed or render the PDF.
 */

import type { Resume } from "../types";
import { validateResume } from "../validate";

const resumeData = {
  fileName: "Noam Pony CV.pdf",
  repoPath: "/public/resume.pdf",
  publicUrl: "/resume.pdf",
  downloadButtonText: "Download CV",
  previewEnabled: true,
} as const;

export const resume: Resume = validateResume(resumeData);
