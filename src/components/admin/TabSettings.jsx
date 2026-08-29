"use client";

import { useState } from "react";
import { ConfigEditor } from "./ConfigEditor";

export function TabSettings() {
  const [active, setActive] = useState("availability");

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
              active === t.id
                ? "bg-themeAccent text-white"
                : "bg-themeBg-secondary text-themeText-secondary border border-themeBorder hover:text-themeText"
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
          <p className="text-xs text-themeText/50">
            Add multiple image URLs and the hero will crossfade between them for a dynamic,
            varied look. Leave blank to use the built-in /my-picture image.
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
