"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getConfig, setConfig } from "@/lib/firestore";
import { getAt, mergeDeep, setAt } from "@/lib/contentMerge";

const INPUT =
  "w-full border-4 border-themeAccent bg-themeInput px-3 py-2.5 text-sm text-themeText placeholder:text-themeTextSecondary/40 focus:outline-none focus:shadow-[3px_3px_0_0_var(--dg-bg-deep)] transition-shadow dg-r-0";

const LABEL =
  "block text-[0.625rem] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono";

/**
 * Schema-driven editor for one Firestore config document (or one nested
 * branch of it). Writes with setConfig(merge: true), so saving a sub-section
 * never clobbers the sibling sections in the same document.
 *
 * Field types: text, textarea, lines, tags, pairs, bool, number.
 */
export function BrandForm({
  configKey,
  path = "",
  title,
  desc,
  schema,
  defaults,
  children,
}) {
  const defaultsRef = useRef(defaults);
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasStored, setHasStored] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await getConfig(configKey);
        if (!mounted) return;
        if (stored && typeof stored === "object") {
          setForm(mergeDeep(defaultsRef.current, stored));
          setHasStored(Object.keys(stored).length > 0);
        }
      } catch {
        toast.error(`Failed to load ${title}`);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [configKey, title]);

  const scope = (path ? getAt(form, path) : form) || {};

  function setValue(key, value) {
    setForm((prev) => setAt(prev, path ? `${path}.${key}` : key, value));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = path ? setAt({}, path, getAt(form, path)) : form;
      await setConfig(configKey, payload);
      setHasStored(true);
      toast.success(`${title} saved`);
    } catch {
      toast.error(`Failed to save ${title}`);
    } finally {
      setSaving(false);
    }
  }

  function handleLoadDefaults() {
    setForm((prev) =>
      path ? setAt(prev, path, getAt(defaultsRef.current, path)) : defaultsRef.current
    );
    toast.success("Defaults loaded — press Save to publish them");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center border-4 border-themeAccent bg-themeSurface/30 py-24 text-themeText/50 dg-r-0">
        Loading {title}…
      </div>
    );
  }

  return (
    <section className="space-y-6 border-4 border-themeAccent bg-themeSurface/30 p-6 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="dg-f-display text-lg font-bold uppercase tracking-[0.05em] text-themeText">
            {title}
          </h2>
          {desc && (
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-themeTextSecondary">
              {desc}
            </p>
          )}
        </div>
        <span
          className={`dg-ui-mono border-2 px-3 py-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.2em] ${
            hasStored
              ? "border-themeAccent text-themeAccent"
              : "border-themeBorder text-themeTextSecondary"
          }`}
        >
          {hasStored ? "Custom copy" : "Using defaults"}
        </span>
      </header>

      <div className="space-y-6">
        {schema.map((field) => {
          const value = scope[field.key];
          return (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`brand-${configKey}-${path}-${field.key}`} className={LABEL}>
                  {field.label}
                </label>
                {field.max && typeof value === "string" && (
                  <span
                    className={`dg-ui-mono text-[0.625rem] ${
                      value.length > field.max ? "text-themeAccent" : "text-themeTextSecondary/60"
                    }`}
                  >
                    {value.length}/{field.max}
                  </span>
                )}
              </div>

              {field.type === "textarea" && (
                <textarea
                  id={`brand-${configKey}-${path}-${field.key}`}
                  rows={field.rows || 3}
                  value={value ?? ""}
                  placeholder={field.placeholder || ""}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  className={`${INPUT} resize-y`}
                />
              )}

              {field.type === "lines" && (
                <textarea
                  id={`brand-${configKey}-${path}-${field.key}`}
                  rows={field.rows || 4}
                  value={Array.isArray(value) ? value.join("\n") : ""}
                  placeholder={field.placeholder || "One item per line"}
                  onChange={(e) =>
                    setValue(field.key, e.target.value.split("\n").filter((line) => line.trim()))
                  }
                  className={`${INPUT} resize-y`}
                />
              )}

              {field.type === "tags" && (
                <input
                  id={`brand-${configKey}-${path}-${field.key}`}
                  type="text"
                  value={Array.isArray(value) ? value.join(", ") : ""}
                  placeholder={field.placeholder || "Comma-separated"}
                  onChange={(e) =>
                    setValue(
                      field.key,
                      e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                    )
                  }
                  className={INPUT}
                />
              )}

              {field.type === "pairs" && (
                <div className="space-y-2">
                  {(Array.isArray(value) ? value : []).map((row, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      {(field.fields || []).slice(0, 2).map((sub) => (
                        <input
                          key={sub.key}
                          type="text"
                          value={row?.[sub.key] ?? ""}
                          placeholder={sub.placeholder || sub.label}
                          onChange={(e) => {
                            const next = [...(Array.isArray(value) ? value : [])];
                            next[index] = { ...next[index], [sub.key]: e.target.value };
                            setValue(field.key, next);
                          }}
                          className={INPUT}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            field.key,
                            (Array.isArray(value) ? value : []).filter((_, i) => i !== index)
                          )
                        }
                        className="border-4 border-themeAccent px-3 text-sm text-themeTextSecondary transition-colors hover:bg-themeAccent hover:text-themeText"
                        aria-label={`Remove ${field.label} row ${index + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setValue(field.key, [
                        ...(Array.isArray(value) ? value : []),
                        field.empty || {},
                      ])
                    }
                    className="dg-ui-mono border-2 border-dashed border-themeAccent px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-themeAccent transition-colors hover:bg-themeAccent hover:text-themeText"
                  >
                    + Add row
                  </button>
                </div>
              )}

              {field.type === "bool" && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={value === true}
                    onChange={(e) => setValue(field.key, e.target.checked)}
                    className="h-4 w-4 border-4 border-themeAccent bg-themeInput text-themeAccent dg-r-0"
                  />
                  <span className="text-xs font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                    {field.checkboxLabel || field.label}
                  </span>
                </label>
              )}

              {field.type === "number" && (
                <input
                  id={`brand-${configKey}-${path}-${field.key}`}
                  type="number"
                  value={value ?? ""}
                  placeholder={field.placeholder || ""}
                  onChange={(e) =>
                    setValue(field.key, e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className={INPUT}
                />
              )}

              {(!field.type || field.type === "text") && (
                <input
                  id={`brand-${configKey}-${path}-${field.key}`}
                  type="text"
                  value={value ?? ""}
                  placeholder={field.placeholder || ""}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  className={INPUT}
                />
              )}

              {field.hint && (
                <p className="text-[0.6875rem] leading-relaxed text-themeTextSecondary/70">
                  {field.hint}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {typeof children === "function" && (
        <div className="border-t-2 border-themeBorder pt-6">{children(scope)}</div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t-2 border-themeBorder pt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="dg-f-mono border-4 border-themeAccent bg-themeAccent px-6 py-3 font-display font-semibold uppercase tracking-tight text-themeText transition-all duration-150 hover:bg-themeWarn hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] disabled:cursor-not-allowed disabled:opacity-50 dg-r-0"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={handleLoadDefaults}
          disabled={saving}
          className="dg-f-mono border-4 border-themeAccent bg-transparent px-6 py-3 text-xs font-medium uppercase tracking-wider text-themeText transition-all duration-150 hover:bg-themeAccent hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] disabled:opacity-50 dg-r-0"
        >
          Load brand defaults
        </button>
        <span className="dg-ui-mono text-[0.625rem] uppercase tracking-[0.2em] text-themeTextSecondary/60">
          Saves to {configKey}
          {path ? ` → ${path}` : ""}
        </span>
      </div>
    </section>
  );
}
