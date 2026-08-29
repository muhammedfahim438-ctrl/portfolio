"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { uploadFile } from "@/lib/storage";

export function ImageUploader({ value, onChange, folder = "uploads", label = "Image" }) {
  const fileRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const { url } = await uploadFile(file, folder, (p) => setProgress(p));
      onChange(url);
      toast.success("Image uploaded");
    } catch {
      setError("Upload failed. Make sure Firebase Storage is enabled.");
    } finally {
      setProgress(null);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-themeText/70">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover border border-themeBorder" />
        ) : (
          <div className="h-16 w-16 rounded-lg border border-dashed border-themeBorder flex items-center justify-center text-xs text-themeText/40">none</div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-themeBg-secondary border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
            >
              {progress !== null ? `Uploading ${progress}%` : "Upload"}
            </button>
            {progress !== null && (
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-themeBorder">
                <div className="h-full bg-themeAccent transition-all" style={{ width: `${progress}%` }} />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-lg bg-themeInput px-3 py-2 text-sm text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
