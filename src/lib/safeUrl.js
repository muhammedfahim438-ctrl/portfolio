/**
 * Allowlist for URLs that come from Firestore (or any other editable data
 * source) before they reach an `href` or `src`.
 *
 * An admin-editable string is not a trusted string: a `javascript:` or
 * `data:` URL in a CTA field would execute in a visitor's browser. Anything
 * outside this list is replaced with `fallback` so the URL simply does not
 * render instead of becoming a script vector.
 *
 * Allowed:
 *   - #fragment and relative paths (but not protocol-relative `//evil.com`)
 *   - https:, mailto:, tel:
 */
export function safeUrl(value, fallback = "") {
  if (typeof value !== "string") return fallback;

  const raw = value.trim();
  if (!raw || raw.startsWith("//")) return fallback;

  // Any scheme must be on the allowlist. The regex catches obfuscated forms
  // such as `java\nscript:` too, because the trimmed string fails to parse
  // as a valid URL for an allowed protocol.
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (["https:", "mailto:", "tel:"].includes(parsed.protocol)) return raw;
    } catch {
      return fallback;
    }
    return fallback;
  }

  // Bare `evil.com` is a relative path to the site, not a script URL. It is
  // safe to keep; reject backslashes, which browsers may normalise to `/`.
  return raw.includes("\\") ? fallback : raw;
}
