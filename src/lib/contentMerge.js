// Shared helpers for merging brand copy with the stored Firestore document.
// Used by the landing provider and by every Brand Studio form, so the admin
// previews exactly what the page will render.

// Defaults win only when the stored value is missing. Primitives and arrays
// replace, nested objects merge one level at a time, and null keeps the
// default so a half-written document cannot blank a section.
export function mergeDeep(base, override) {
  if (override === null || override === undefined) return base;
  if (typeof override !== "object" || Array.isArray(override)) return override;
  if (typeof base !== "object" || base === null || Array.isArray(base)) {
    return { ...override };
  }

  const next = { ...base };
  for (const key of Object.keys(override)) {
    next[key] = mergeDeep(base[key], override[key]);
  }
  return next;
}

export function getAt(source, path) {
  if (!path) return source;
  return path
    .split(".")
    .reduce((acc, key) => (acc === null || acc === undefined ? acc : acc[key]), source);
}

export function setAt(source, path, value) {
  if (!path) return value;
  const [head, ...rest] = path.split(".");
  const base = source && typeof source === "object" ? { ...source } : {};
  base[head] = setAt(base[head], rest.join("."), value);
  return base;
}
