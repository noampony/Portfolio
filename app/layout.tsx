import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@/lib/content/loaders";
import { sansFont, monoFont } from "./fonts";
import { SkipLink, MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";
import { ResumeViewerProvider } from "@/components/providers/ResumeViewerProvider";
import { StructuredData } from "@/components/seo/StructuredData";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const homepageUrl = siteUrl ? `${siteUrl}/` : "/";

export const metadata: Metadata = {
  title: "Noam Pony | Backend Developer",
  description:
    "Noam Pony is a backend developer focused on cloud backend systems, Python, AWS, automation, DevOps, and security-aware software engineering.",
  openGraph: {
    title: "Noam Pony | Backend Developer",
    description:
      "Noam Pony is a backend developer focused on cloud backend systems, Python, AWS, automation, DevOps, and security-aware software engineering.",
    type: "website",
    url: homepageUrl,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${monoFont.variable}`}>
      <body className="flex min-h-screen flex-col">
        <StructuredData />
        {/* First focusable element: lets keyboard users bypass the header (spec §20.6). */}
        <SkipLink />
        <ResumeViewerProvider>
          <Navbar />
          <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          <ScrollToTopButton />
        </ResumeViewerProvider>
        <Analytics />
      </body>
    </html>
  );
}
