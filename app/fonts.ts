import { DM_Sans, Geist, JetBrains_Mono } from "next/font/google";

/** Hero section — warmer, professional sans (owner preference over global Geist). */
export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
  preload: true
});

export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false
});
