import type { Metadata } from "next";
import { geistSans, jetBrainsMono } from "./fonts";
import { SkipLink, MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noam Pony Portfolio",
  description: "Portfolio website for Noam Pony."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetBrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* First focusable element: lets keyboard users bypass the header (spec §20.6). */}
        <SkipLink />
        <Navbar />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
