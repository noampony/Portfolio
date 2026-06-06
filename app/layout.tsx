import type { Metadata } from "next";
import Link from "next/link";
import { geistSans, jetBrainsMono } from "./fonts";
import { SkipLink, MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
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
        <header className="border-b border-border bg-bg-surface">
          {/* Minimal shell nav; the data-driven section links land in Task 2.3. */}
          <nav aria-label="Primary" className="mx-auto flex max-w-measure items-center px-6 py-4">
            <Link
              href="/"
              className="rounded-sm font-mono text-body font-semibold text-text-primary outline-none transition-colors hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
            >
              Noam Pony
            </Link>
          </nav>
        </header>
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
