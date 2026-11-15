"use client";

import { useState } from "react";

export function ImageUploader({ value, onChange, label }) {
  const [url, setUrl] = useState(value || "");

  return (
    <div className="space-y-3">
      <label htmlFor="image-upload" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
        {label || "Image URL"}
      </label>
      <div className="flex items-center gap-2">
        <input
          id="image-upload"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="https://… or /assets/image.png"
          className="flex-1 rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
        />
        <button
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result);
                setUrl(dataUrl);
                onChange(dataUrl);
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }}
          className="px-4 py-3 border-4 border-themeAccent bg-themeSurface text-themeText text-xs font-medium uppercase tracking-tighter shadow-[2px_2px_0_0_#080808] hover:bg-themeAccent hover:text-themeBg transition-all duration-150 dg-f-mono dg-r-0"
        >
          Upload
        </button>
      </div>
      {url && (
        <div className="flex items-center gap-2">
          <img src={url} alt="Preview" className="w-12 h-12 border-4 border-themeAccent object-cover shadow-[2px_2px_0_0_#080808]" />
          <button
            onClick={() => {
              setUrl("");
              onChange("");
            }}
            className="border-2 border-themeAccent bg-transparent text-themeAccent hover:bg-themeAccent hover:text-themeText shadow-[1px_1px_0_0_#080808] transition-all duration-150 dg-f-mono dg-r-0"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
