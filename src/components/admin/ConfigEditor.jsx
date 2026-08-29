"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getConfig, setConfig, getProfile, setProfileConfig } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";

export function ConfigEditor({ configKey, title, schema, fallback = {}, profile = false }) {
  const [form, setForm] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tagBuffers, setTagBuffers] = useState({});

  const load = useCallback(async () => {
    try {
      const data = (profile ? await getProfile(configKey) : await getConfig(configKey, null)) ?? {};
      const next = {};
      const buffers = {};
      (schema ?? []).forEach((f) => {
        const val = data[f.key] ?? f.default ?? "";
        next[f.key] = val;
        if (f.type === "tags") buffers[f.key] = Array.isArray(val) ? val.join(", ") : "";
      });
      setForm(next);
      setTagBuffers(buffers);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  }, [configKey, schema, profile]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form };
    (schema ?? []).forEach((f) => {
      if (f.type === "tags") {
        payload[f.key] = String(tagBuffers[f.key] ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (f.type === "number") payload[f.key] = Number(payload[f.key]) || 0;
      if (f.type === "bool") payload[f.key] = !!payload[f.key];
    });
    try {
      await (profile ? setProfileConfig(configKey, payload) : setConfig(configKey, payload));
      toast.success(`${title} saved`);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-themeText/40">Loading…</div>;
  }

  return (
    <div className="glass space-y-4 rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-themeText">{title}</h3>
      {(schema ?? []).map((f) => (
        <ConfigField key={f.key} field={f} value={f.type === "tags" ? (tagBuffers[f.key] ?? "") : (form[f.key] ?? "")}
          onChange={(v) => (f.type === "tags" ? setTagBuffers((p) => ({ ...p, [f.key]: v })) : updateField(f.key, v))} />
      ))}
      <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
    </div>
  );
}

function ConfigField({ field, value, onChange }) {
  const label = <label className="block text-sm font-medium text-themeText/70">{field.label}</label>;
  const inputClass = "w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40";

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        {label}
        <textarea rows={field.rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} resize-y`} placeholder={field.placeholder} />
      </div>
    );
  }
  if (field.type === "tags") {
    return (
      <div className="space-y-1.5">
        {label}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="comma, separated, values" className={inputClass} />
      </div>
    );
  }
  if (field.type === "bool") {
    return (
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-themeAccent" : "bg-themeBorder"}`}>
          <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
        </button>
        {label}
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      {label}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={inputClass} />
    </div>
  );
}
