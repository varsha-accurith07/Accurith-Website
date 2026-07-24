// Shared zod schemas for both submission endpoints.
//
// Length caps do two things: (a) they keep silly payloads out of the
// database, and (b) they refuse anything long enough to be a stuffing
// attempt shaped as a form submission. Message caps at 5000 chars — anything
// larger belongs in email.
//
// The `.trim()` transforms run before validation so leading/trailing
// whitespace does not sneak past the .min(1) check.

import { z } from 'zod';

const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().min(1).max(5000);

// Email — zod's built-in check is RFC-flavored; combined with the length cap
// it rejects both invalid syntax and pathological inputs.
const email = z.string().trim().toLowerCase().min(3).max(254).email();

// Phone — international, digits and a handful of separators. We do not try
// to be a phone-number library; we just refuse anything that could be
// smuggling other content.
const phone = z
  .string()
  .trim()
  .min(6)
  .max(20)
  .regex(/^[+0-9()\-\s]+$/, 'phone must contain only digits, spaces, parentheses, hyphens or +');

// URL — must actually parse as https://... or http://... Rejects mailto:,
// javascript:, file:// and similar surfaces.
const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return u.protocol === 'https:' || u.protocol === 'http:';
      } catch {
        return false;
      }
    },
    { message: 'must be a valid http(s) URL' },
  );

// The honeypot: real users never fill this. If it's populated we drop the
// submission silently in the route handler (returning 200 so the bot thinks
// it landed). The schema accepts ANY string here — validation must NOT
// reject the bot before the route can silent-drop it, otherwise the bot
// learns which field is the trap.
const honeypot = z.string().max(1000).optional();

// Contact form — matches /api/contact body. Field set is what Varsha's
// ContactForm.tsx sends (J01 contract). Row lands in the Consultation table.
export const contactSchema = z.object({
  name: shortText,
  email,
  company: shortText,
  role: shortText,
  service: shortText,
  message: longText,
  website: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

// Early-access form — matches /api/early-access body. Field set is what
// Varsha's EarlyAccessForm.tsx sends.
export const earlyAccessSchema = z.object({
  name: shortText,
  email,
  product: shortText,
  website: honeypot,
});
export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;

// Job application form — matches /api/careers/apply body.
export const applicationSchema = z.object({
  openingId: z.string().min(1).max(64),
  name: shortText,
  email,
  phone,
  linkedinUrl: httpUrl,
  portfolioUrl: httpUrl.optional().or(z.literal('')),
  coverNote: longText,
  website: honeypot,
});
export type ApplicationInput = z.infer<typeof applicationSchema>;
