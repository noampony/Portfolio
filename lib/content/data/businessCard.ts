/**
 * Floating Business Card content (spec §8.9, Task 14.1).
 *
 * Promotion and card-specific TBD inputs were confirmed by the owner:
 * - promoted: yes
 * - tagline: Senior Cloud Backend Developer
 * - resume: the existing `/resume.pdf`
 * - profile picture: the existing `/profile.png`
 *
 * Shared identity and contact values are referenced from their source modules
 * so the future drawer cannot drift from the public Profile, Contact, or
 * Resume data. This task defines data only; the drawer UI belongs to Task 14.2.
 */

import { contact } from "./contact";
import { profile } from "./profile";
import { resume } from "./resume";
import type { BusinessCard } from "../types";
import { validateBusinessCard } from "../validate";

const businessCardData = {
  isPromoted: true,
  name: profile.name,
  title: profile.title,
  shortTagline: "Senior Cloud Backend Developer",
  email: contact.email,
  linkedIn: contact.linkedIn,
  resumeLink: resume.publicUrl,
  profileImage: profile.profileImage,
  location: contact.location,
} as const;

export const businessCard: BusinessCard = validateBusinessCard(businessCardData);
