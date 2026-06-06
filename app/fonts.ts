import { Geist, JetBrains_Mono } from "next/font/google";

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
