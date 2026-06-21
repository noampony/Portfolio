/**
 * Contact content (spec §8.8, §11.7) — used by the Contact section.
 *
 * Phone publication is gated on owner confirmation (§15.6): publishing the
 * number increases spam risk and is acceptable only when intentionally
 * confirmed. The owner has confirmed publication, so the phone is included
 * and set as the preferred contact method.
 *
 * The `message` uses the corrected wording from §8.8 (apostrophe in "Let's").
 * The contact form is a nice-to-have and is not enabled here (§8.8, §11.7).
 */

import type { Contact } from "../types";
import { validateContact } from "../validate";

const contactData = {
  heading: "Get In Touch",
  message:
    "Let's Work Together! Have something interesting to work on? Feel free to contact me.",
  email: "noampony2@gmail.com",
  linkedIn: "https://www.linkedin.com/in/noam-pony/",
  phone: "+972 50 4377257",
  location: "Israel",
  preferredContactMethod: "Phone",
  contactFormEnabled: false,
} as const;

export const contact: Contact = validateContact(contactData);
