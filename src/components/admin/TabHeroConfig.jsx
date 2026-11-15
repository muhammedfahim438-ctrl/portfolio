"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getHeroData, updateHeroData } from "@/lib/firestore";
import { ImageUploader } from "@/components/admin/ImageUploader";

const defaultHero = {
  title: "",
  subtitle: "",
  voice_text: "",
  photo_url: "",
};

export function TabHeroConfig() {
  const [form, setForm] = useState(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHeroData();
        if (data) {
          setForm({
            title: data.title ?? "",
            subtitle: data.subtitle ?? "",
            voice_text: data.voice_text ?? "",
            photo_url: data.photo_url ?? "",
          });
        }
      } catch {
        toast.error("Failed to load hero data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateHeroData(form);
      toast.success("Hero data updated");
    } catch {
      toast.error("Failed to save hero data");
    } finally {
      setSaving(false);
    }
  }

  function handlePhotoChange(url) {
    setForm((prev) => ({ ...prev, photo_url: url }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-themeText/50">
        Loading hero data…
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6 p-6 border-4 border-themeAccent bg-themeSurface/30 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0 dg-chunky">
        <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] dg-f-display">
          Edit Hero Section
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="hero-title" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
            Title
          </label>
          <input
            id="hero-title"
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hero-subtitle" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
            Subtitle
          </label>
          <input
            id="hero-subtitle"
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hero-voice" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
            Voice Text
          </label>
          <textarea
            id="hero-voice"
            rows={4}
            value={form.voice_text}
            onChange={(e) => setForm({ ...form, voice_text: e.target.value })}
            className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 resize-y dg-r-0"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hero-photo" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
            Profile Photo
          </label>
          <p className="text-xs text-themeTextSecondary/60">
            Leave empty to use the built-in{" "}
            <code className="text-themeAccent">public/portrait.svg</code>, upload a new
            one here, or paste an image URL.
          </p>
          <ImageUploader value={form.photo_url} onChange={handlePhotoChange} label="Profile Photo" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 border-4 border-themeAccent bg-themeAccent text-themeText font-display font-semibold uppercase tracking-tight hover:bg-themeWarn hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] disabled:opacity-50 disabled:cursor-not-allowed dg-f-mono dg-r-0"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6 p-6 border-4 border-themeAccent bg-themeSurface/30 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0 dg-chunky">
        <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] dg-f-display">
          Preview
        </h2>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-44 w-48 border-4 border-themeAccent/50 bg-themeSurface flex items-center justify-center text-themeTextSecondary font-mono text-sm dg-r-0 shadow-[2px_2px_0_0_var(--dg-bg-deep)]">
            {form.photo_url ? (
              <img src={form.photo_url} alt="Hero preview" className="h-full w-full object-cover" />
            ) : (
              "Your photo here"
            )}
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-themeText uppercase tracking-tight dg-f-display">
              {form.title || "Muhammed Fahim M"}
            </h3>
            <p className="mt-1 text-themeTextSecondary">{form.subtitle || "Subtitle goes here"}</p>
          </div>
          {form.voice_text && (
            <p className="max-w-sm text-xs text-themeTextSecondary/70 italic">
              &ldquo;{form.voice_text}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
