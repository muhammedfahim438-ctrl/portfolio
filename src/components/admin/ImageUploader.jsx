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
      <label className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-14 rounded-none object-cover border border-themeBorder" />
        ) : (
          <div className="h-14 w-14 rounded-none border-2 border-dashed border-themeBorder flex items-center justify-center text-[10px] text-themeText-secondary/50 uppercase tracking-wider">
            none
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-none border-2 border-themeBorder bg-themeBgSecondary text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-all duration-200"
            >
              {progress !== null ? `Uploading ${progress}%` : "Upload"}
            </button>
            {progress !== null && (
              <div className="h-1.5 w-28 overflow-hidden rounded-none bg-themeBorder">
                <div className="h-full bg-themeAccent transition-all duration-200" style={{ width: `${progress}%` }} />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-3 py-2 text-[13px] text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>
      </div>
      {error && <p className="text-[10px] text-red-400">{error}</p>}
    </div>
  );
}
