import { Montserrat } from "next/font/google";

/**
 * Montserrat is used for every text on the site. The three CSS variables are kept
 * (hero / sans / mono) so existing consumers keep resolving, but they now all point
 * at the same Montserrat family.
 */

/** Hero section family. */
export const heroFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
  preload: true
});

/** Default UI / body family. */
export const sansFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true
});

/** Previously the monospace family; now Montserrat like the rest of the site. */
export const monoFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false
});
