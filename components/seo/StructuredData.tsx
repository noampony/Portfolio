import { contact } from "@/lib/content/data/contact";
import { profile } from "@/lib/content/data/profile";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    address: {
      "@type": "PostalAddress",
      addressCountry: profile.location,
    },
    sameAs: [contact.linkedIn],
    ...(siteUrl ? { url: siteUrl } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Noam Pony",
    description:
      "Noam Pony is a Senior Backend Developer focused on cloud backend systems, Python, AWS, automation, DevOps, and security-aware software engineering.",
    inLanguage: "en",
    ...(siteUrl ? { url: siteUrl } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(person) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }} />
    </>
  );
}
