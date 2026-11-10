"use client";

import { useState } from "react";
import { ConfigEditor } from "./ConfigEditor";

export function TabSettings() {
  const [active, setActive] = useState("availability");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-5 py-2.5 rounded-none border border-themeBorder bg-transparent font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
              active === t.id
                ? "bg-themeAccent text-themeText border-themeAccent shadow-[4px_4px_0_0_rgba(8,9,11,0.3)]"
                : "text-themeText-secondary hover:text-themeText hover:border-themeAccent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "availability" && (
        <ConfigEditor
          configKey="availability_data"
          title="Availability & Hire Status"
          fallback={{ available: true, label: "Available for freelance & full-time" }}
          schema={[
            { key: "available", label: "Currently available", type: "bool" },
            { key: "label", label: "Availability Label", type: "text", placeholder: "Available for freelance & full-time" },
          ]}
        />
      )}

      {active === "portrait" && (
        <div className="space-y-4">
          <ConfigEditor
            configKey="portrait_data"
            title="Hero Portrait (Variety Images)"
            fallback={{ photos: [] }}
            schema={[
              { key: "photos", label: "Portrait URLs (comma-separated — leave blank to use bundled photo)", type: "tags" },
            ]}
          />
          <p className="text-xs text-themeText-secondary/50">
            Add multiple image URLs and the hero will crossfade between them for a dynamic,
            varied look. Leave blank to use the built-in /my-picture.webp image.
          </p>
        </div>
      )}

      {active === "splash" && (
        <ConfigEditor
          configKey="splash_data"
          title="Splash Screen"
          fallback={{ words: [], final: "DATA SCIENCE × FULL-STACK" }}
          schema={[
            { key: "words", label: "Roulette Words (comma-separated)", type: "tags" },
            { key: "final", label: "Final Tagline", type: "text", placeholder: "DATA SCIENCE × FULL-STACK" },
          ]}
        />
      )}

      {active === "social" && (
        <ConfigEditor
          profile
          configKey="social_data"
          title="Contact Details, Social & Resume"
          fallback={{}}
          schema={[
            { key: "email", label: "Email", type: "text", placeholder: "you@example.com" },
            { key: "phone", label: "Phone", type: "text", placeholder: "+91 00000 00000" },
            { key: "location", label: "Location", type: "text", placeholder: "Palakkad, Kerala, India" },
            { key: "github", label: "GitHub URL", type: "text" },
            { key: "linkedin", label: "LinkedIn URL", type: "text" },
            { key: "resume_pdf_url", label: "Resume PDF URL", type: "text", placeholder: "/resume.pdf or https://…" },
          ]}
        />
      )}
    </div>
  );
}

const TABS = [
  { id: "availability", label: "Availability" },
  { id: "portrait", label: "Portrait" },
  { id: "splash", label: "Splash" },
  { id: "social", label: "Contact & Links" },
];
