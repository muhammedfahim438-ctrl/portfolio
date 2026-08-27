"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getHeroData, updateHeroData } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { ImageCropModal } from "@/components/ui/ImageCropModal";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState("");
  const fileInputRef = useRef(null);

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

  function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
    e.target.value = "";
  }

  async function handleCropComplete(file) {
    if (!file) return;
    downloadBlob(file, "my-picture.png");
    toast.success(
      "Cropped photo saved to Downloads — place it at public/my-picture.png and redeploy."
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-themeText/50">
        Loading hero data…
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="glass space-y-6">
          <h2 className="text-xl font-semibold text-themeText">Edit Hero Section</h2>

          <div className="space-y-1.5">
            <label htmlFor="hero-title" className="block text-sm font-medium text-themeText/70">
              Title
            </label>
            <input
              id="hero-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="hero-subtitle" className="block text-sm font-medium text-themeText/70">
              Subtitle
            </label>
            <input
              id="hero-subtitle"
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="hero-voice" className="block text-sm font-medium text-themeText/70">
              Voice Text
            </label>
            <textarea
              id="hero-voice"
              rows={4}
              value={form.voice_text}
              onChange={(e) => setForm({ ...form, voice_text: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="hero-photo" className="block text-sm font-medium text-themeText/70">
              Profile Photo
            </label>
            <p className="text-xs text-themeText/50">
              The site uses the local file{" "}
              <code className="text-themeAccent">public/my-picture.png</code>{" "}
              by default. Leave the field empty to use it, or enter an override
              URL/path.
            </p>
            <div className="flex items-center gap-2">
              <input
                id="hero-photo"
                type="text"
                value={form.photo_url}
                onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                placeholder="/my-picture.png"
                className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-lg bg-themeBg-secondary border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
              >
                Crop New Photo (Save Locally)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelected}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="glass space-y-6">
          <h2 className="text-xl font-semibold text-themeText">Preview</h2>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-themeAccent/30 to-themeSecondary/30 blur-xl" />
              <img
                src={form.photo_url || "/my-picture.png"}
                alt="Hero preview"
                className="relative h-44 w-44 rounded-full object-cover border-2 border-themeAccent/50"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-themeText">
                {form.title || "Your Name"}
              </h3>
              <p className="mt-1 text-themeText/60">{form.subtitle || "Subtitle goes here"}</p>
            </div>
            {form.voice_text && (
              <p className="max-w-sm text-sm text-themeText/50 italic">
                &ldquo;{form.voice_text}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      <ImageCropModal
        open={cropOpen}
        imageSrc={cropSrc}
        onClose={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}