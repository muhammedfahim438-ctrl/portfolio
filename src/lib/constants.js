// Single source of truth for values referenced by more than one module.
//
// Change the domain in ONE place: SITE_URL. It is consumed by:
//   - index.html     (canonical, og:url, twitter:image, JSON-LD) via the
//                    "site-meta" plugin in vite.config.js
//   - robots.txt / sitemap.xml (generated at build time)
//   - any component that needs an absolute URL
//
// Keep SITE_URL without a trailing slash or path.

export const SITE_URL = "https://muhammedfahim-portfolio.vercel.app";

export function absoluteUrl(path = "/") {
  const base = SITE_URL.replace(/\/+$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

// Admin identity. Matches the Firebase Auth user that owns /admin and the
// literal allowed to write in firestore.rules / storage.rules. If you rotate
// the admin account, update this AND the rules file AND Firebase Auth.
export const ADMIN_EMAIL = "muhammedfahim438@gmail.com";

export function isAdminEmail(email) {
  if (typeof email !== "string") return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Public contact details (owner). Centralized so admin edits propagate.
export const CONTACT_EMAIL = "muhammedfahim438@gmail.com";
export const CONTACT_PHONE = "+91 9061635562";
export const CONTACT_LOCATION = "Palakkad, Kerala, India";
export const GITHUB_URL = "https://github.com/muhammedfahim438-ctrl";
export const LINKEDIN_URL = "https://linkedin.com/in/muhammed-fahim-m";

// Contact form validation limits — mirrored exactly by firestore.rules so the
// client never accepts something the server would reject.
export const MESSAGE_LIMITS = {
  sender_name: 100,
  sender_phone: 40,
  sender_email: 200,
  message_body: 4000,
};

// Simple email-format check (mirrored by the rules `matches()` predicate).
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Bots that submit faster than this are rejected by the client.
export const MIN_FORM_FILL_MS = 3000;
