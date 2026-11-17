"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getConfig, setConfig, getProfile, setProfileConfig } from "@/lib/firestore";

export function ConfigEditor({ configKey, title, schema, fallback, profile }) {
  const [form, setForm] = useState(fallback || {});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = profile
          ? await getProfile(configKey)
          : await getConfig(configKey);
        if (data) setForm({ ...fallback, ...data });
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [configKey, profile, fallback]);

  async function handleSave() {
    setSaving(true);
    try {
      if (profile) {
        await setProfileConfig(configKey, form);
      } else {
        await setConfig(configKey, form);
      }
      toast.success(`${title} updated`);
    } catch {
      toast.error(`Failed to save ${title}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-themeText/80">
        Loading {title}…
      </div>
    );
  }

  return (
    <section className="space-y-6 rounded-none p-6 border-4 border-themeAccent bg-themeSurface/30 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0 dg-chunky">
      <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-6 dg-f-display">
        {title}
      </h2>

      <div className="space-y-5">
        {schema.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label
              htmlFor={`config-${configKey}-${field.key}`}
              className="block text-[0.625rem] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono"
            >
              {field.label}
            </label>
            {field.type === "bool" ? (
              <div className="flex items-center gap-2">
                <input
                  id={`config-${configKey}-${field.key}`}
                  type="checkbox"
                  checked={form[field.key] === true}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.checked }))
                  }
                  className="w-4 h-4 border-4 border-themeAccent text-themeAccentText bg-themeInput shadow-[1px_1px_0_0_var(--dg-bg-deep)] dg-r-0"
                />
                <span className="text-xs font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  {field.label}
                </span>
              </div>
            ) : field.type === "textarea" ? (
              <textarea
                id={`config-${configKey}-${field.key}`}
                rows={field.rows || 3}
                value={form[field.key] ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder || ""}
                className="w-full resize-y rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
              />
            ) : field.type === "lines" ? (
              <textarea
                id={`config-${configKey}-${field.key}`}
                rows={field.rows || 4}
                value={
                  Array.isArray(form[field.key])
                    ? form[field.key].join("\n")
                    : form[field.key] ?? ""
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: e.target.value.split("\n").filter((line) => line.trim()),
                  }))
                }
                placeholder={field.placeholder || "One item per line"}
                className="w-full resize-y rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
              />
            ) : field.type === "tags" ? (
              <input
                id={`config-${configKey}-${field.key}`}
                type="text"
                value={
                  Array.isArray(form[field.key])
                    ? form[field.key].join(", ")
                    : form[field.key] ?? ""
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.key]: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder={field.placeholder || "Comma-separated"}
                className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
              />
            ) : (
              <input
                id={`config-${configKey}-${field.key}`}
                type="text"
                value={form[field.key] ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder || ""}
                className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
              />
            )}
          </div>
        ))}

        <div className="pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-3 border-4 border-themeAccent bg-themeAccent text-themeText font-display font-semibold uppercase tracking-tight hover:bg-themeWarn hover:text-themeBg shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] disabled:opacity-50 disabled:cursor-not-allowed dg-f-mono dg-r-0"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
